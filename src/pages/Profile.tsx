import { Element } from 'react-scroll';
import { SideNav } from '@/features/profile/components/SideNav';
import { Section } from '@/features/profile/components/Section';
import { BadgeRow } from '@/features/profile/components/BadgeRow';
import { ProjectList } from '@/features/profile/components/ProjectList';

import {
  FRONTEND_BADGES,
  STYLING_BADGES,
  TEST_BADGES,
  BACKEND_BADGES,
  COLLAB_BADGES,
} from '@/features/profile/data/skills';
import { PROJECTS } from '@/features/profile/data/projects';
import { ABOUT } from '@/features/profile/data/about';
import { CONTACT } from '@/features/profile/data/contact';
import { CAREER } from '@/features/profile/data/career';
import { EDUCATION } from '@/features/profile/data/education';
import { EXPERIENCE } from '@/features/profile/data/experience';

export default function ProfilePage() {
  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-[#f9f9f9] text-[#1a1a1a]'>
      <SideNav />

      <main className='w-full md:pl-[120px]'>
        <div className='px-5 md:px-6 pt-6 md:pt-8 pb-10 max-w-[1400px] mx-auto overflow-x-hidden break-words [&_img]:max-w-full [&_img]:h-auto'>
          {/* About */}
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
                    <p
                      key={i}
                      className='text-[14px] leading-relaxed text-[#444]'
                    >
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </Section>
          </Element>

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Contact */}
          <Element name='contact'>
            <Section title='📪 Contact'>
              <div className='text-sm mb-2'>{CONTACT.phone}</div>
              <div className='text-sm mb-2'>{CONTACT.email}</div>
            </Section>
          </Element>

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Skills */}
          <Element name='skills'>
            <Section title='🛠 Skills'>
              <BadgeRow title='🚀 Frontend' items={FRONTEND_BADGES} />
              <BadgeRow title='🎨 Styling' items={STYLING_BADGES} />
              <BadgeRow
                title='🧪 Test (Basic Understanding)'
                items={TEST_BADGES}
              />
              <BadgeRow
                title='🧩 Backend / Infra (Basic Understanding)'
                items={BACKEND_BADGES}
              />
              <BadgeRow
                title='🧰 Collaboration & Deployment'
                items={COLLAB_BADGES}
              />
            </Section>
          </Element>

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Projects */}
          <Element name='projects'>
            <Section title='🚀 Projects'>
              <ProjectList projects={PROJECTS} />
            </Section>
          </Element>

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Career */}
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

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Education */}
          <Element name='education'>
            <Section title='🎓 Education'>
              {EDUCATION.lines.map((line, i) => (
                <div key={i} className='text-sm mb-2'>
                  {line}
                </div>
              ))}
            </Section>
          </Element>

          <hr className='w-full h-px bg-[#ddd] border-0' />

          {/* Experience */}
          <Element name='experience'>
            <Section title='📚 Experience'>
              {EXPERIENCE.map((sec) => (
                <div key={sec.title} className='mb-4'>
                  <div className='text-[18px] font-bold mt-5 mb-2'>
                    {sec.title}
                  </div>
                  {sec.lines.map((l, i) => (
                    <div key={i} className='text-sm mb-2'>
                      {l}
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          </Element>
        </div>
      </main>
    </div>
  );
}
