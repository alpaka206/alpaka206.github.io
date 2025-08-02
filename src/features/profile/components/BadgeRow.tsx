import type { Badge } from '../types';

export function BadgeRow({ title, items }: { title: string; items: Badge[] }) {
  return (
    <>
      <div className='text-[18px] font-bold mt-5 mb-2'>{title}</div>
      <div className='flex flex-wrap gap-2 mt-2 mb-5'>
        {items.map((b) => (
          <img key={b.label} src={b.imgUrl} alt={b.label} />
        ))}
      </div>
    </>
  );
}
