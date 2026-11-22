import { PROFILE } from '@/content/profile';
import { Button } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { mediaUrl } from '@/media/Picture';
import { useWindows } from '@/os/windows';
import { ExternalLink, Hero, Value } from '../PaneLayout';
import { SITE } from '../site';
import styles from '../Settings.module.css';

export function AboutSite() {
  return (
    <>
      <Hero
        media={<span className={styles.mark} style={{ maskImage: `url(${mediaUrl('brand/alpaca', 256)})` }} aria-hidden="true" />}
        title="alpaka206.github.io"
        lines={[`버전 ${SITE.version}`]}
      />
      <FormSection>
        <FormRow label="버전">
          <Value>{SITE.version}</Value>
        </FormRow>
        <FormRow label="만든 도구">
          <Value>{SITE.builtWith.join(' / ')}</Value>
        </FormRow>
        <FormRow label="만든 사람">
          <Value>{PROFILE.name}</Value>
        </FormRow>
        <FormRow label="소스 코드">
          <ExternalLink href={SITE.source.href}>{SITE.source.label}</ExternalLink>
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow label="만든 과정" description="설계와 구현에서 고른 것들을 메모에 정리했어요.">
          <Button onClick={() => useWindows.getState().open('notes', { note: 'how-built' })}>이 사이트를 만든 방법</Button>
        </FormRow>
      </FormSection>
    </>
  );
}
