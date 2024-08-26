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
          <div className={styles.Profile_detail}>
            {/* <img
              src="./assets/phone_icon.png"
              alt="Phone"
              className={styles.Profile_Contact_Icon}
            /> */}
            📞 010-2412-0339
          </div>
          <div className={styles.Profile_detail}>
            {/* <img
              src="./assets/email_icon.png"
              alt="Email"
              className={styles.Profile_Contact_Icon}
            /> */}
            ✉️ gyuwon05@gmail.com
          </div>
          {/* <div className={styles.Profile_detail}>
            <img
              src="./assets/Insta.png"
              alt="Instagram"
              className={styles.Profile_Contact_Icon}
            />
            @alpaka_dev
          </div>
          <div className={styles.Profile_detail}>
            <img
              src="./assets/Github.png"
              alt="GitHub"
              className={styles.Profile_Contact_Icon}
            />
            <a href="https://github.com/alpaka206">github.com/alpaka206</a>
          </div> */}
        </Element>
        <div className={styles.Divider} />
        <Element name="skills" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>🔭 Skills & Abilities</div>
          <div className={styles.Profile_SubTitle}>
            ✏️ Languages & Frameworks & Libraries
          </div>
          <div className={styles.Profile_SkillLevel}>능숙하게 쓸 수 있어요</div>
          <div className={styles.Profile_Languages}>
            <img
              src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"
              alt="React"
            />
            <img
              src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"
              alt="TypeScript"
            />
            <img
              src="https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=20232a"
              alt="javascript"
            />
            <img
              src="https://img.shields.io/badge/html5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
              alt="html5"
            />
            <img
              src="https://img.shields.io/badge/css3-1572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
              alt="css3"
            />

            <img
              src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white"
              alt="Storybook"
            />
            <img
              src="https://img.shields.io/badge/Recoil-764ABC?style=for-the-badge&logo=Recoil&logoColor=white"
              alt="Recoil"
            />
            <img
              src="https://img.shields.io/badge/🧁  vanilla--extract-99F6E4?style=for-the-badge"
              alt="vanilla--extract"
            />
          </div>
          <div className={styles.Profile_SkillLevel}>사용할 수 있어요</div>
          <div className={styles.Profile_Languages}>
            <img
              src="https://img.shields.io/badge/React Native-61DAFB?style=for-the-badge&logo=React&logoColor=black"
              alt="React Native"
            />
            <img
              src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"
              alt="Next"
            />
            <img
              src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white"
              alt="Jest"
            />
            <img
              src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white"
              alt="threejs"
            />
            <img
              src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white"
              alt="vite"
            />

            <img
              src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"
              alt="Node"
            />
            <img
              src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"
              alt="MongoDB"
            />
            <img
              src="https://img.shields.io/badge/Java-004027?style=for-the-badge&logo=Jameson&logoColor=white"
              alt="Java"
            />
            <img
              src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white"
              alt="styled--components"
            />
          </div>
          <h3>🛠️ Tools & Platforms</h3>
          <div className={styles.Profile_Tools}>
            <img
              src="https://img.shields.io/badge/git-F05033.svg?style=for-the-badge&logo=git&logoColor=white"
              alt="git"
            />
            <img
              src="https://img.shields.io/badge/github-181717.svg?style=for-the-badge&logo=github&logoColor=white"
              alt="github"
            />
            <img
              src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white"
              alt="Notion"
            />
            <img
              src="https://img.shields.io/badge/figma-F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white"
              alt="figma"
            />

            <img
              src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white"
              alt="Firebase"
            />
            <img
              src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"
              alt="Vercel"
            />
            <img
              src="https://img.shields.io/badge/Visual Studio-5C2D91?style=for-the-badge&logo=Visual Studio&logoColor=white"
              alt="Visual Studio"
            />
            <img
              src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"
              alt="Visual Studio Code"
            />
          </div>
        </Element>
        <div className={styles.Divider} />
        <Element name="education" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>🏫 Education</div>
          <div className={styles.Profile_detail}>
            🎓 가톨릭대학교(Catholic University of Korea)
          </div>
          <div className={styles.Profile_detail}>
            💻️ 주전공: 정보통신전자공학부
          </div>
          <div className={styles.Profile_detail}>
            💻 복수전공: 컴퓨터정보공학과
          </div>
          <div className={styles.Profile_detail}>
            👨‍🎓 2019.03 ~ 2025.02(졸업예정)
          </div>
          <div className={styles.Profile_detail}>📚 3.63 / 4.5</div>
        </Element>
        <div className={styles.Divider} />
        <Element name="experience" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>📚 Experience</div>

          <div className={styles.Profile_SubTitle}>React</div>
          <div className={styles.Profile_detail}>
            recoil로 상태관리 사용 경험이 있습니다.
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
          <div className={styles.Profile_SubTitle}>JAVASCRIPT</div>
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
          <div className={styles.Profile_SubTitle}>HTML/CSS</div>
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
          <div className={styles.Profile_SubTitle}>JAVA</div>
          <div className={styles.Profile_detail}>
            java를 사용하여 TCP/UDP 통신으로 주차장 관리 프로그램을 개발해본적
            있습니다.
          </div>
        </Element>
        <div className={styles.Divider} />
        <Element name="career" className={styles.Profile_Conatiner}>
          <div className={styles.Profile_MainTitle}>🎞️ Career</div>
          <div className={styles.Profile_SubTitle}>에이치투비즈(h2biz)</div>
          <div className={styles.Profile_detail}>2024.06 ~ 2024.08</div>
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
