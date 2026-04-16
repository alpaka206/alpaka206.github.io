import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { EDUCATION } from '@/features/profile/data/education';

export function EducationSection() {
  return (
    <Element name='education'>
      <Section title='🎓 Education'>
        <div className='border border-[#e2e2e2] rounded-[14px] p-5 bg-[#fafafa] shadow-sm'>
          <div className='flex flex-wrap items-center gap-2 mb-2'>
            <div className='text-[18px] font-bold'>{EDUCATION.school}</div>
            <span className='text-[12px] font-semibold text-[#1f2937] bg-[#e6eefc] px-2 py-1 rounded-full'>
              {EDUCATION.period}
            </span>
          </div>

          <ul className='text-sm text-[#333] leading-relaxed list-disc pl-5'>
            {EDUCATION.majors.map((m) => (
              <li key={m} className='mb-2'>
                {m}
              </li>
            ))}
            {EDUCATION.notes?.map((n) => (
              <li key={n} className='mb-2'>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </Element>
  );
}
