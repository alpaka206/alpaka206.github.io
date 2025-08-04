type PrizeModalProps = {
  imageSrc: string;
  onClose: () => void;
};

export default function PrizeModal({ imageSrc, onClose }: PrizeModalProps) {
  return (
    <div
      className='fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='w-full max-w-[450px] mt-[-80px]'
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt='수상 이미지 확대'
          className='w-full object-contain'
        />
      </div>
    </div>
  );
}
