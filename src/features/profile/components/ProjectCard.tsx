import type { Project } from '../types';

export function ProjectCard({ p }: { p: Project }) {
  return (
    <div className='w-full max-w-full border border-[#e2e2e2] rounded-[12px] p-5 mb-6 bg-[#fafafa] overflow-hidden break-words'>
      <div className='mb-3'>
        {p.link ? (
          <a href={p.link} target='_blank' rel='noopener noreferrer'>
            <h3 className='text-[20px] font-extrabold text-[#0b61d8]'>
              {p.title}
            </h3>
          </a>
        ) : (
          <h3 className='text-[20px] font-extrabold text-[#0b61d8]'>
            {p.title}
          </h3>
        )}
        {p.subtitle && (
          <div className='mt-1 text-sm text-[#555]'>{p.subtitle}</div>
        )}
      </div>

      <p className='text-sm text-[#333] mb-2 leading-relaxed'>
        <span className='font-semibold text-[#222]'>Role:</span> {p.role}
      </p>

      {p.points.map((line, i) => (
        <p key={i} className='text-sm text-[#333] mb-2 leading-relaxed'>
          - {line}
        </p>
      ))}

      <div className='flex flex-wrap gap-2 mt-3'>
        {p.stacks.map((s) => (
          <span
            key={s}
            className='bg-[#eee] text-[#333] text-xs px-2 py-1 rounded'
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
