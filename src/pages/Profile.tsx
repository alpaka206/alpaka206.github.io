import * as styles from "../css/Profile.css";
import { Link, Element } from "react-scroll";

const navItems = [
  { name: "Home", target: "home" },
  { name: "Contact", target: "contact" },
  { name: "Skills & Abilities", target: "skills" },
  { name: "Education", target: "education" },
  { name: "Experience", target: "experience" },
  { name: "Career", target: "career" },
];

const Profile = () => {
  return (
    <styles.ProfileContainer>
      <styles.BackButton
        src="./assets/back.svg"
        alt="Phone"
        onClick={() => window.history.back()}
      />

      <styles.ProfileNav>
        {navItems.map(({ name, target }) => (
          <Link key={target} to={target} smooth duration={500}>
            <styles.ProfileNavItem>{name}</styles.ProfileNavItem>
          </Link>
        ))}
      </styles.ProfileNav>
      <styles.ProfileContent>
        <Element name="home">
          <styles.ProfileInfo>
            <styles.ProfileImage
              src="./assets/ProfileImage.jpg"
              alt="prize"
            />
            <styles.ProfileInfoExplain>
              <styles.ProfileInfoName>김규원</styles.ProfileInfoName>
              <styles.ProfileInfoDate>2000.05.17</styles.ProfileInfoDate>
              <styles.ProfileInfoComment>
                포기하지 않는 성실함과 꾸준한 성장을 가장 중요하게 생각합니다.
              </styles.ProfileInfoComment>
              <styles.ProfileInfoComment>
                언제나 배움을 즐기고, 항상 도전하여 사용자에게 더 좋은 경험을 주고
                싶습니다.
              </styles.ProfileInfoComment>
            </styles.ProfileInfoExplain>
          </styles.ProfileInfo>
        </Element>
        <styles.Divider />
        <Element name="contact">
          <styles.SectionContainer>
            <styles.SectionTitle>📪 Contact</styles.SectionTitle>
            <styles.SectionDetail>📞 010-2412-0339</styles.SectionDetail>
            <styles.SectionDetail>✉️ gyuwon05@gmail.com</styles.SectionDetail>
          </styles.SectionContainer>
        </Element>
        <styles.Divider />
        <Element name="skills">
          <styles.SectionContainer>
            <styles.SectionTitle>🔭 Skills & Abilities</styles.SectionTitle>
            <styles.SectionSubTitle>
              ✏️ Languages & Frameworks & Libraries
            </styles.SectionSubTitle>
            <styles.SkillLevel>능숙하게 쓸 수 있어요</styles.SkillLevel>
            <styles.TagContainer>
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
            </styles.TagContainer>
            <styles.SkillLevel>사용할 수 있어요</styles.SkillLevel>
            <styles.TagContainer>
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
            </styles.TagContainer>
            <styles.Divider />
            <h3>🛠️ Tools & Platforms</h3>
            <styles.TagContainer>
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
            </styles.TagContainer>
          </styles.SectionContainer>
        </Element>
        <styles.Divider />
        <Element name="education">
          <styles.SectionContainer>
            <styles.SectionTitle>🏫 Education</styles.SectionTitle>
            <styles.SectionDetail>
              🎓 가톨릭대학교(Catholic University of Korea)
            </styles.SectionDetail>
            <styles.SectionDetail>
              💻️ 주전공: 정보통신전자공학부
            </styles.SectionDetail>
            <styles.SectionDetail>
              💻 복수전공: 컴퓨터정보공학과
            </styles.SectionDetail>
            <styles.SectionDetail>
              👨‍🎓 2019.03 ~ 2025.02(졸업예정)
            </styles.SectionDetail>
            <styles.SectionDetail>📚 3.63 / 4.5</styles.SectionDetail>
          </styles.SectionContainer>
        </Element>
        <styles.Divider />
        <Element name="experience">
          <styles.SectionContainer>
            <styles.SectionTitle>📚 Experience</styles.SectionTitle>

            <styles.SectionSubTitle>React</styles.SectionSubTitle>
            <styles.SectionDetail>
              recoil로 상태관리 사용 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              소켓 통신을 이용하여 채팅을 구현해보았습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              OAuth 2.0을 이용하여 소셜 로그인을 도입할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Webview 방식을 통해 React Native로 개발하는 방법을 공부 중에
              있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Next.js를 활용하여 SSR 개발을 할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>JAVASCRIPT</styles.SectionSubTitle>
            <styles.SectionDetail>ES6+ 문법에 익숙합니다.</styles.SectionDetail>
            <styles.SectionDetail>
              Vite로 번들러를 사용해 보았습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              TypeScript를 능숙하게 사용할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              디자인 시스템과 Atomic 디자인에 대한 이해도가 높습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Jest를 활용한 테스트 코드 작성 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Storybook 작성, 빌드 및 배포 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>HTML/CSS</styles.SectionSubTitle>
            <styles.SectionDetail>
              웹 표준을 지키려 노력합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Zero-runtime인 Vanilla-extract를 잘 활용할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Styled-component를 활용할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              크로스 브라우징에 대응할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Keyframe을 활용한 애니메이션 기법을 활용할 수 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>JAVA</styles.SectionSubTitle>
            <styles.SectionDetail>
              java를 사용하여 TCP/UDP 통신으로 주차장 관리 프로그램을 개발해본적
              있습니다.
            </styles.SectionDetail>
          </styles.SectionContainer>
        </Element>
        <styles.Divider />
        <Element name="career">
          <styles.SectionContainer>
            <styles.SectionTitle>🎞️ Career</styles.SectionTitle>
            <styles.SectionSubTitle>에이치투비즈(h2biz)</styles.SectionSubTitle>
            <styles.SectionDetail>2024.06 ~ 2024.08</styles.SectionDetail>
            <styles.SectionDetail>개발팀 학생 인턴</styles.SectionDetail>
          </styles.SectionContainer>
        </Element>
      </styles.ProfileContent>
    </styles.ProfileContainer>
  );
};

export default Profile;
