import { SideNav } from '@/features/profile/components/SideNav';
import { AboutSection } from '@/features/profile/sections/AboutSection';
import { ContactSection } from '@/features/profile/sections/ContactSection';
import { SkillsSection } from '@/features/profile/sections/SkillsSection';
import { ProjectsSection } from '@/features/profile/sections/ProjectsSection';
import { CareerSection } from '@/features/profile/sections/CareerSection';
import { EducationSection } from '@/features/profile/sections/EducationSection';
import { ExperienceSection } from '@/features/profile/sections/ExperienceSection';

function ProfileDivider() {
  return <hr className='w-full h-px bg-[#ddd] border-0' />;
}

export default function ProfilePage() {
  return (
    <div className='min-h-screen w-full bg-[#f9f9f9] text-[#1a1a1a]'>
      <div className='w-full max-w-[1400px] mx-auto pb-10'>
        <div className='flex items-start'>
          <aside className='hidden md:block sticky top-6 h-fit self-start'>
            <SideNav />
          </aside>

          <div className='hidden md:block w-px self-stretch bg-[#ddd]' />

          <main className='flex-1 min-w-0 break-words pl-6 [&_img]:max-w-full [&_img]:h-auto'>
            <AboutSection />
            <ProfileDivider />
            <ContactSection />
            <ProfileDivider />
            <SkillsSection />
            <ProfileDivider />
            <ProjectsSection />
            <ProfileDivider />
            <CareerSection />
            <ProfileDivider />
            <EducationSection />
            <ProfileDivider />
            <ExperienceSection />
          </main>
        </div>
      </div>
    </div>
  );
}
