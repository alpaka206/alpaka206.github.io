import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { EXPERIENCE } from '@/features/profile/data/experience';

export function ExperienceSection() {
  return (
    <Element name='experience'>
      <Section title='📚 Experience'>
        {EXPERIENCE.map((sec) => (
          <div key={sec.title} className='mb-4'>
            <div className='text-[18px] font-bold mt-5 mb-2'>{sec.title}</div>
            {sec.lines.map((l, i) => (
              <div key={i} className='text-sm mb-2'>
                {l}
              </div>
            ))}
          </div>
        ))}
      </Section>
    </Element>
  );
}
