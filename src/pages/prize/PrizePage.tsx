import { useState } from 'react';
import PrizeCard from '@/components/prize/PrizeCard';
import PrizeModal from '@/components/prize/PrizeModal';
import { prizeList } from '@/data/prizeData';

export function PrizePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <div className='px-[30px] py-[10px] h-[calc(100vh-20px)] bg-[#f9f9f9]'>
      <div className='grid [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] gap-5'>
        {prizeList.map((prize, idx) => (
          <PrizeCard
            key={idx}
            src={prize.src}
            title={prize.title}
            date={prize.date}
            organization={prize.organization}
            description={prize.description}
            onClick={() => setSelectedImage(prize.src)}
          />
        ))}
      </div>
      {selectedImage && (
        <PrizeModal
          imageSrc={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
