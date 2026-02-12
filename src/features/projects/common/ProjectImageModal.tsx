import { useEffect, useRef } from 'react';

type ProjectImageModalProps = {
  imageSrc: string;
  alt?: string;
  onClose: () => void;
};

export function ProjectImageModal({
  imageSrc,
  alt,
  onClose,
}: ProjectImageModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        dialogRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]'
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label='Project image preview'
        tabIndex={-1}
        className='w-full max-w-5xl px-4 outline-none'
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={alt || 'Project image'}
          className='w-full max-h-[80vh] object-contain'
        />
      </div>
    </div>
  );
}
