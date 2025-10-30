import { DotItem } from '@/components/DotItem/DotItem';
import { Chips } from '@/features/projects/common/Chips';
import {
  Divider,
  FieldRow,
  ProjectLayout,
  SectionTitle,
} from '@/features/projects/common/ProjectLayout';
import { ProjectImg } from '@/features/projects/common/ProjectImg';
import { ALNC_DATA as D } from './data';

export default function ALNC() {
  return (
    <ProjectLayout>
      <div className='text-base mb-2.5'>프로젝트 개요</div>
      <h1 className='text-2xl font-bold mb-2.5'>{D.title}</h1>

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
            D.result.map((r) => <div key={r}>{r}</div>)
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

