import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { BadgeRow } from '@/features/profile/components/BadgeRow';
import {
  FRONTEND_BADGES,
  STYLING_BADGES,
  TEST_BADGES,
  BACKEND_BADGES,
  COLLAB_BADGES,
} from '@/features/profile/data/skills';

export function SkillsSection() {
  return (
    <Element name='skills'>
      <Section title='🛠 Skills'>
        <BadgeRow title='🚀 Frontend' items={FRONTEND_BADGES} />
        <BadgeRow title='🎨 Styling' items={STYLING_BADGES} />
        <BadgeRow title='🧪 Test (Basic Understanding)' items={TEST_BADGES} />
        <BadgeRow
          title='🧩 Backend / Infra (Basic Understanding)'
          items={BACKEND_BADGES}
        />
        <BadgeRow title='🧰 Collaboration & Deployment' items={COLLAB_BADGES} />
      </Section>
    </Element>
  );
}
