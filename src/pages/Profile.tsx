import * as styles from "../css/Profile.css";
import { Link, Element } from "react-scroll";

const Profile = () => {
  return (
    <div className={styles.Profile}>
      <div className={styles.Profile_Nav}>
        <Link
          to="home"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Home
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Contact
        </Link>
        <Link
          to="skills"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Skills & Abilities
        </Link>
        <Link
          to="education"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Education
        </Link>
        <Link
          to="experience"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Experience
        </Link>
        <Link
          to="career"
          smooth={true}
          duration={500}
          className={styles.Profile_Nav_Item}
        >
          Career
        </Link>
      </div>
      <div className={styles.Profile_Content}>
        <Element name="home" className={styles.Profile_Info}>
          {/* <div className={styles.Profile_Info}> */}
          <img
            src="./assets/ProfileImage.jpg"
            alt="prize"
            className={styles.ProfileImage}
          />
          <div className={styles.Profile_Info_Explain}>
            <div className={styles.Profile_Info_Name}>김규원</div>
            <div className={styles.Profile_Info_Date}>2000.05.17</div>
            <div className={styles.Profile_Info_Comment}>
              포기하지 않는 성실함과 꾸준한 성장을 가장 중요하게 생각합니다.
            </div>
            <div className={styles.Profile_Info_Comment}>
              언제나 배울을 즐기고, 항상 도전하여 사용자에게 더 좋은 경험을 주고
              싶습니다.
            </div>
          </div>
          {/* </div> */}
        </Element>
        <div className={styles.Divider} />
        <Element name="contact" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>📪 Contact</div>
          <div className={styles.Profile_detail}>010-2412-0339</div>
          <div className={styles.Profile_detail}>gyuwon05@gmail.com</div>
          <div className={styles.Profile_detail}>@alpaka_dev</div>
          <div className={styles.Profile_detail}>
            LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/gyuwon">
              linkedin.com/in/gyuwon
            </a>
          </div>
          <div className={styles.Profile_detail}>
            GitHub:{" "}
            <a href="https://github.com/alpaka206">github.com/alpaka206</a>
          </div>
        </Element>
        <div className={styles.Divider} />
        <Element name="skills" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>Skills & Abilities</div>
          <div className={styles.Profile_SubTitle}>Programming Languages</div>

          <div className={styles.Profile_detail}>Java</div>
          <div className={styles.Profile_detail}>
            JavaScript (ES6+), TypeScript
          </div>
          <div className={styles.Profile_detail}>HTML/CSS</div>

          <h3>Frameworks & Libraries</h3>
          <ul className={styles.Profile_list}>
            <li className={styles.Profile_list_item}>
              React (including Next.js, Redux, Recoil)
            </li>
            <li className={styles.Profile_list_item}>Jest (Testing)</li>
            <li className={styles.Profile_list_item}>
              Styled-components, Vanilla-extract
            </li>
          </ul>
          <h3>Tools & Platforms</h3>
          <ul className={styles.Profile_list}>
            <li className={styles.Profile_list_item}>Git, GitHub, Vite</li>
            <li className={styles.Profile_list_item}>Storybook, Webpack</li>
            <li className={styles.Profile_list_item}>
              OAuth 2.0 (Social Login)
            </li>
          </ul>
        </Element>
        <div className={styles.Divider} />
        <Element name="education" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>Education</div>
          <div className={styles.Profile_detail}>
            가톨릭대학교(Catholic University of Korea)
          </div>
          <div className={styles.Profile_detail}>
            주전공: 정보통신전자공학부
          </div>
          <div className={styles.Profile_detail}>
            복수전공: 컴퓨터정보공학과
          </div>
          <div className={styles.Profile_detail}>
            2019.03 ~ 2025.02(졸업예정)
          </div>
          <div className={styles.Profile_detail}>3.63 / 4.5</div>
        </Element>
        <div className={styles.Divider} />
        <Element name="experience" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>Experience</div>
          <div className={styles.Profile_detail}>JAVA</div>
          <div className={styles.Profile_detail}>
            java를 사용하여 TCP/UDP 통신으로 주차장 관리 프로그램을 개발해본적
            있습니다.
          </div>
          <div className={styles.Profile_detail}>React</div>
          <div className={styles.Profile_detail}>
            redux같은 상태관리 사용 경험이 있으며 recoil을 주로 씁니다.
          </div>
          <div className={styles.Profile_detail}>
            소켓 통신을 이용하여 채팅을 구현해보았습니다.
          </div>
          <div className={styles.Profile_detail}>
            OAuth 2.0을 이용하여 소셜 로그인을 도입할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            Webview 방식을 통해 React Native로 개발하는 방법을 공부 중에
            있습니다.
          </div>
          <div className={styles.Profile_detail}>
            Next.js를 활용하여 SSR 개발을 할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>JAVASCRIPT</div>
          <div className={styles.Profile_detail}>ES6+ 문법에 익숙합니다.</div>
          <div className={styles.Profile_detail}>
            Vite로 번들러를 사용해 보았습니다.
          </div>
          <div className={styles.Profile_detail}>
            TypeScript를 능숙하게 사용할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            디자인 시스템과 Atomic 디자인에 대한 이해도가 높습니다.
          </div>
          <div className={styles.Profile_detail}>
            Jest를 활용한 테스트 코드 작성 경험이 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            Storybook 작성, 빌드 및 배포 경험이 있습니다.
          </div>
          <div className={styles.Profile_detail}>HTML/CSS</div>
          <div className={styles.Profile_detail}>
            웹 표준을 지키려 노력합니다.
          </div>
          <div className={styles.Profile_detail}>
            Zero-runtime인 Vanilla-extract를 잘 활용할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            Styled-component를 활용할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            크로스 브라우징에 대응할 수 있습니다.
          </div>
          <div className={styles.Profile_detail}>
            Keyframe을 활용한 애니메이션 기법을 활용할 수 있습니다.
          </div>
        </Element>
        <div className={styles.Divider} />
        <Element name="career" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>Career</div>
          <div className={styles.Profile_detail}>
            에이치투비즈(h2biz) - 2024.06 ~ 2024.08
          </div>
          <div className={styles.Profile_detail}>개발팀 학생 인턴</div>
        </Element>
        <div className={styles.Divider} />
        <div className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>프로젝트 보러가기</div>
          <div className={styles.Profile_MainTitle}>수상내역 보러가기</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
