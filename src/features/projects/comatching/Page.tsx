import { DotItem } from '@/components/DotItem/DotItem';
import {
  Chips,
  Divider,
  FieldRow,
  ProjectLayout,
  SectionTitle,
  ProjectImg,
  GitHubLink,
} from '@/features/projects/common';
import { COMATCHING_DATA as D } from './data';

export default function COMATCHING() {
  return (
    <ProjectLayout>
      {/* 프로젝트 개요 */}
      <div className='text-sm tracking-wide mb-1.5'>프로젝트 개요</div>
      <h1 className='text-2xl md:text-[28px] font-bold mb-4'>{D.title}</h1>

      <img
        src={D.hero}
        alt='hero'
        className='w-4/5 max-w-[1200px] mx-auto mb-4 rounded-md'
      />

      {D.skills && (
        <FieldRow label='Skills'>
          <Chips items={D.skills} />
        </FieldRow>
      )}
      {D.tools && (
        <FieldRow label='Tools'>
          <Chips items={D.tools} />
        </FieldRow>
      )}
      {D.period && (
        <FieldRow label='진행기간'>
          <div>{D.period}</div>
        </FieldRow>
      )}
      {D.members && (
        <FieldRow label={D.membersLabel ?? '개발 인원'}>
          <div>{D.members}</div>
        </FieldRow>
      )}
      {D.roles && (
        <FieldRow label='역할'>
          <Chips items={D.roles} />
        </FieldRow>
      )}
      {D.contribution && (
        <FieldRow label='기여도'>
          <div>{D.contribution}</div>
        </FieldRow>
      )}
      {D.result && (
        <FieldRow label='성과'>
          {Array.isArray(D.result) ? (
            <div className='flex flex-col gap-1'>
              {D.result.map((r) => (
                <div key={r}>{r}</div>
              ))}
            </div>
          ) : (
            <div>{D.result}</div>
          )}
        </FieldRow>
      )}
      {D.category && (
        <FieldRow label='카테고리'>
          <Chips items={[D.category]} />
        </FieldRow>
      )}
      {D.githubUrl && (
        <FieldRow label='github'>
          <GitHubLink url={D.githubUrl} />
        </FieldRow>
      )}

      <Divider />

      {D.sections?.map((s) => (
        <div key={s.title}>
          <SectionTitle>{s.title}</SectionTitle>
          {s.bullets?.map((b) => (
            <DotItem key={b}>{b}</DotItem>
          ))}
          {s.images?.map((src) => (
            <ProjectImg key={src} src={src} alt={s.title} />
          ))}
        </div>
      ))}
    </ProjectLayout>
  );
}
