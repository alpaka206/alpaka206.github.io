import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { CAREER } from '@/features/profile/data/career';

export function CareerSection() {
  return (
    <Element name='career'>
      <Section title='🎞️ Career'>
        {CAREER.map((c) => (
          <div key={c.org} className='mb-5'>
            <div className='text-[18px] font-bold mt-2 mb-2'>{c.org}</div>
            <div className='text-sm mb-2'>{c.period}</div>
            {c.bullets.map((b, i) => (
              <div key={i} className='text-sm mb-2'>
                - {b}
              </div>
            ))}
          </div>
        ))}
      </Section>
    </Element>
  );
}
