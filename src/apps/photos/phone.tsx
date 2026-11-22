import { useLayoutEffect } from 'react';
import { Picture } from '@/media/Picture';
import { NavScreen } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import type { PhoneAppProps } from '../registry';
import { ALBUMS, LIBRARY } from './library';
import { PhotoViewer } from './phone-viewer';
import styles from './photos.phone.module.css';

type PhotoScreen = { kind: 'photo'; index: number };

/** iOS Photos: square thumbnails three to a row, album by album; a tap opens the viewer on the whole library. */
export default function PhotosPhone({ props }: PhoneAppProps<'photos'>) {
  const { screens, push } = usePhoneApp<PhotoScreen>();
  const open = screens.at(-1);

  useLayoutEffect(() => {
    if (props.album) document.getElementById(`photos-${props.album}`)?.scrollIntoView({ block: 'start' });
  }, [props.album]);

  return (
    <>
      <div className={styles.layer} inert={Boolean(open)}>
        <NavScreen title="사진" background="plain">
          {ALBUMS.map((album) => (
            <section key={album.id} id={`photos-${album.id}`} className={styles.album}>
              <h2 className={styles.albumTitle}>{album.title}</h2>
              <ul className={styles.grid}>
                {album.photos.map((photo) => {
                  // The viewer's own counter, so two pictures of the same screen still have different names.
                  const index = LIBRARY.indexOf(photo);
                  return (
                    <li key={photo.key}>
                      <button
                        type="button"
                        className={styles.cell}
                        aria-label={`${photo.alt}, ${index + 1}/${LIBRARY.length}`}
                        onClick={() => push({ kind: 'photo', index }, '/photos')}
                      >
                        <Picture src={photo.key} alt="" sizes="34vw" className={styles.thumb} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </NavScreen>
      </div>
      {open && (
        <div key={screens.length} className={styles.pushed}>
          <PhotoViewer photos={LIBRARY} start={open.index} />
        </div>
      )}
    </>
  );
}
