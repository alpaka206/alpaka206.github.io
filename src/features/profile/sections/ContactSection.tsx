import { Element } from 'react-scroll';
import { Section } from '@/features/profile/components/Section';
import { CONTACT } from '@/features/profile/data/contact';

export function ContactSection() {
  return (
    <Element name='contact'>
      <Section title='📪 Contact'>
        <div className='text-sm mb-2'>{CONTACT.phone}</div>
        <div className='text-sm mb-2'>{CONTACT.email}</div>
      </Section>
    </Element>
  );
}
