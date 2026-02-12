import { ProjectImageItem } from './types';

type ProjectImageGridProps = {
  items: ProjectImageItem[];
  onImageClick?: (item: ProjectImageItem) => void;
  className?: string;
  itemClassName?: string;
  layout?: 'grid' | 'scroll';
};

export function ProjectImageGrid({
  items,
  onImageClick,
  className,
  itemClassName,
  layout = 'grid',
}: ProjectImageGridProps) {
  if (layout === 'scroll') {
    return (
      <div
        className={[
          'flex gap-3 overflow-x-auto pb-2',
          'scroll-smooth snap-x snap-mandatory',
          className ?? '',
        ].join(' ')}
      >
        {items.map(({ src, alt }) => (
          <div
            key={src}
            className={[
              'flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px]',
              'rounded-[10px] overflow-hidden',
              'shadow-[0_4px_8px_rgba(0,0,0,0.1)]',
              'bg-white/40',
              'snap-start',
              onImageClick ? 'cursor-zoom-in' : '',
              itemClassName ?? '',
            ].join(' ')}
            onClick={() => onImageClick?.({ src, alt })}
          >
            <img
              src={src}
              alt={alt || ''}
              className='w-full h-40 md:h-44 object-cover block'
              loading='lazy'
              decoding='async'
              sizes='(min-width: 1024px) 260px, (min-width: 640px) 240px, 200px'
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={[
        'grid grid-cols-2 lg:grid-cols-3',
        'gap-3',
        className ?? '',
      ].join(' ')}
    >
      {items.map(({ src, alt }) => (
        <div
          key={src}
          className={[
            'rounded-[10px] overflow-hidden',
            'shadow-[0_4px_8px_rgba(0,0,0,0.1)]',
            'bg-white/40',
            onImageClick ? 'cursor-zoom-in' : '',
            itemClassName ?? '',
          ].join(' ')}
          onClick={() => onImageClick?.({ src, alt })}
        >
          <img
            src={src}
            alt={alt || ''}
            className='w-full h-40 md:h-44 object-cover block'
            loading='lazy'
            decoding='async'
            sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw'
          />
        </div>
      ))}
    </div>
  );
}
