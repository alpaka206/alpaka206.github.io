type Props = {
  imageUrl: string;
  title: string;
  onClick?: () => void;
  className?: string;
  variant?: 'desktop' | 'folder';
};

export function FolderIcon({
  imageUrl,
  title,
  onClick,
  className,
  variant = 'desktop',
}: Props) {
  const labelTone =
    variant === 'folder'
      ? 'text-black/90 group-hover:text-black'
      : 'text-white/90 group-hover:text-white';

  const labelShadow = variant === 'folder' ? '' : 'drop-shadow';
  return (
    <button
      onClick={onClick}
      aria-label={title}
      className={[
        'group inline-flex flex-col items-center gap-2',
        'bg-transparent hover:bg-transparent active:bg-transparent',
        'text-white/90 hover:text-white',
        'p-0 appearance-none border-0',
        'focus:outline-none focus-visible:outline-none focus-visible:ring-0',
        className ?? '',
      ].join(' ')}
    >
      <div className='size-10 md:size-12 shrink-0'>
        <img
          src={imageUrl}
          alt={title}
          className='w-full h-full object-contain select-none pointer-events-none transition-transform group-hover:scale-105'
        />
      </div>
      <span
        className={[
          'text-xs md:text-sm font-medium',
          labelTone,
          labelShadow,
        ].join(' ')}
      >
        {title}
      </span>
    </button>
  );
}
