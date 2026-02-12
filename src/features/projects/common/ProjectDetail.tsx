import { useState } from 'react';
import { Chips } from './Chips';
import {
  Divider,
  FieldRow,
  ProjectLayout,
  SectionTitle,
} from './ProjectLayout';
import { GitHubLink } from './GitHubLink';
import type { ProjectData, ProjectImageItem } from './types';
import { ProjectImageGrid } from './ProjectImageGrid';
import { ProjectImageModal } from './ProjectImageModal';

export function ProjectDetail({ data: D }: { data: ProjectData }) {
  const [selectedImage, setSelectedImage] = useState<ProjectImageItem | null>(
    null
  );

  return (
    <ProjectLayout>
      <div className='grid grid-cols-1 lg:grid-cols-10 gap-4 mb-6 items-stretch'>
        <div className='lg:col-span-7 border border-[#e2e2e2] rounded-[16px] p-5 bg-white shadow-sm'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl md:text-[28px] font-bold'>{D.title}</h1>
            {D.category && <Chips items={[D.category]} />}
          </div>
          {D.summary && (
            <p className='text-[15px] text-[#444] mt-2'>{D.summary}</p>
          )}

          {D.highlights && D.highlights.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3'>
              {D.highlights.map((h) => (
                <span
                  key={h}
                  className='text-xs font-semibold text-[#1f2937] bg-[#e6eefc] px-2 py-1 rounded-full'
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className='mt-4'>
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
            {D.githubUrl && (
              <FieldRow label='GitHub'>
                <GitHubLink url={D.githubUrl} />
              </FieldRow>
            )}
          </div>
        </div>

        <div className='lg:col-span-3 h-full'>
          <div className='border border-[#e2e2e2] rounded-[16px] bg-white shadow-sm w-full max-w-[360px] mx-auto lg:ml-auto h-full flex items-center justify-center'>
            <img
              src={D.hero}
              alt={`프로젝트 대표 이미지: ${D.title}`}
              className='w-full h-full max-h-[450px] object-contain'
              loading='eager'
              decoding='async'
            />
          </div>
        </div>
      </div>

      {D.responsibilities && D.responsibilities.length > 0 && (
        <div className='mb-6'>
          <SectionTitle>기여도 및 역할</SectionTitle>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {D.responsibilities.map((r) => (
              <div
                key={r.title}
                className='border border-[#e2e2e2] rounded-[14px] p-4 bg-white shadow-sm'
              >
                <div className='text-[15px] font-bold mb-2'>{r.title}</div>
                <ul className='text-sm text-[#333] leading-relaxed list-disc pl-5'>
                  {r.items.map((it, i) => (
                    <li key={i} className='mb-2'>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {D.outcomes && D.outcomes.length > 0 && (
        <div className='mb-6'>
          <SectionTitle>성과</SectionTitle>
          <div className='border border-[#e2e2e2] rounded-[14px] p-4 bg-white shadow-sm'>
            <ul className='text-sm text-[#333] leading-relaxed list-disc pl-5'>
              {D.outcomes.map((o, i) => (
                <li key={i} className='mb-2'>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Divider />

      {D.sections?.map((s) => (
        <div
          key={s.title}
          className='border border-[#e2e2e2] rounded-[16px] p-5 bg-white shadow-sm mb-6'
        >
          <SectionTitle>{s.title}</SectionTitle>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
            {s.bullets && s.bullets.length > 0 && (
              <div className='lg:col-span-5'>
                <ul className='text-sm text-[#333] leading-relaxed list-disc pl-5'>
                  {s.bullets.map((b, i) => (
                    <li key={i} className='mb-2'>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.images && s.images.length > 0 && (
              <div
                className={
                  s.bullets && s.bullets.length > 0
                    ? 'lg:col-span-7'
                    : 'lg:col-span-12'
                }
              >
                <ProjectImageGrid
                  items={(s.images as (string | ProjectImageItem)[]).map(
                    (img) =>
                      typeof img === 'string'
                        ? { src: img, alt: s.title }
                        : { src: img.src, alt: img.alt ?? s.title }
                  )}
                  onImageClick={(item) => setSelectedImage(item)}
                  layout='scroll'
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {selectedImage && (
        <ProjectImageModal
          imageSrc={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </ProjectLayout>
  );
}
