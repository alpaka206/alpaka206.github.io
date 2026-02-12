import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { ABOUT } from '@/features/profile/data/about';

export function AboutSection() {
  return (
    <Element name='about'>
      <Section>
        <div className='flex items-center gap-6 my-6'>
          <img
            src={ABOUT.avatarSrc}
            alt='profile'
            className='w-[100px] h-[133px] md:w-[160px] md:h-[213px] rounded-[50px] object-cover shadow'
          />
          <div className='flex flex-col gap-2'>
            <h1 className='text-[22px] font-bold'>{ABOUT.name}</h1>
            <span className='text-[15px] text-[#777]'>{ABOUT.role}</span>
            <span className='text-[15px] text-[#777]'>{ABOUT.birth}</span>
            {ABOUT.paragraphs.map((t, i) => (
              <p key={i} className='text-[14px] leading-relaxed text-[#444]'>
                {t}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </Element>
  );
}
