import React, { useEffect, useRef } from "react";
import * as styles from "../css/NavPage.css";
import galleryImage from "/assets/RecoilLogo.png";

const NavPage: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const images = gallery?.querySelectorAll(`.${styles.galleryImage}`);
    if (images) {
      const totalImages = images.length;
      const half = Math.floor(totalImages / 2);
      //   const scaleFactor = 0.1; // 스케일 조절 인자

      images.forEach((img, index) => {
        // let scale = 1;
        if (index < half) {
          //   scale = 1 - index * scaleFactor;
          img.classList.add(styles.leftImage);
        } else {
          //   scale = 1 - (totalImages - 1 - index) * scaleFactor;
          img.classList.add(styles.rightImage);
        }
        // img.style.transform = `scale(${scale})`;
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.topNav}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.topNavLink}
        >
          GitHub
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.topNavLink}
        >
          Instagram
        </a>
      </nav>
      <div className={styles.header}>잘지돌지</div>
      <div>
        <h2 className={styles.subHeader}>Welcome to my portfolio</h2>
        <div className={styles.gallery} ref={galleryRef}>
          {[...Array(10)].map((_, i) => (
            <img
              key={i}
              src={galleryImage}
              alt={`Gallery Image ${i}`}
              className={styles.galleryImage}
            />
          ))}
        </div>
        <div className="spotlight"></div>
        <div className={styles.navigationLinks}>
          <a href="#about-me" className={styles.navLink}>
            About Me
          </a>
          <a href="#project-previews" className={styles.navLink}>
            Project Previews
          </a>
          <a href="#awards-honors" className={styles.navLink}>
            Awards and Honors
          </a>
          <a href="#portfolio-concept" className={styles.navLink}>
            Portfolio Concept
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavPage;
