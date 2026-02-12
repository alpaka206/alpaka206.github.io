import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { EDUCATION } from '@/features/profile/data/education';

export function EducationSection() {
  return (
    <Element name='education'>
      <Section title='🎓 Education'>
        {EDUCATION.lines.map((line, i) => (
          <div key={i} className='text-sm mb-2'>
            {line}
          </div>
        ))}
      </Section>
    </Element>
  );
}
