import * as styles from "../css/Profile.css";
import { Link, Element } from "react-scroll";

const navItems = [
  { name: "About Me", target: "about" },
  { name: "Contact", target: "contact" },
  { name: "Skills", target: "skills" },
  { name: "Projects", target: "projects" },
  { name: "Career", target: "career" },
  { name: "Education", target: "education" },
  { name: "Experience", target: "experience" },
];

const Profile = () => {
  return (
    <styles.ProfileContainer>
      <styles.BackButton
        src="./assets/back.svg"
        alt="뒤로가기"
        onClick={() => window.history.back()}
      />
      <styles.ProfileNav>
        {navItems.map(({ name, target }) => (
          <Link key={target} to={target} smooth duration={500} offset={-24}>
            <styles.NavItem>{name}</styles.NavItem>
          </Link>
        ))}
      </styles.ProfileNav>
      <styles.ContentArea>
        <Element name="about">
          <styles.IntroSection>
            <styles.ProfileImage
              src="./assets/ProfileImage.webp"
              alt="profile"
            />
            <styles.IntroText>
              <styles.Name>김규원</styles.Name>
              <styles.SubText>Frontend Developer</styles.SubText>
              <styles.SubText>2000.05.17</styles.SubText>
              <styles.Paragraph>
                실시간 서비스와 사용자 중심 UI/UX 구현에 강점을 가진 프론트엔드
                개발자입니다.
              </styles.Paragraph>
              <styles.Paragraph>
                Recoil, Zustand 등 상태 관리 최적화와 성능 개선에 집중해 왔으며,
                React 기반의 다양한 협업 프로젝트 경험을 보유하고 있습니다.
              </styles.Paragraph>
            </styles.IntroText>
          </styles.IntroSection>
        </Element>

        <styles.Divider />
        <Element name="contact">
          <styles.Section>
            <styles.SectionTitle>📪 Contact</styles.SectionTitle>
            <styles.SectionDetail>📞 010-2412-0339</styles.SectionDetail>
            <styles.SectionDetail>✉️ gyuwon05@gmail.com</styles.SectionDetail>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="skills">
          <styles.Section>
            <styles.SectionTitle>🛠 Skills</styles.SectionTitle>
            <styles.SectionSubTitle>🚀 Frontend</styles.SectionSubTitle>
            <styles.TechTagGroup>
              <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black" />
              <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" />
              <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black" />
              <img src="https://img.shields.io/badge/Recoil-764ABC?style=for-the-badge&logo=Recoil&logoColor=white" />
              <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white" />
              <img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
              <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" />
              <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
            </styles.TechTagGroup>
            <styles.SectionSubTitle>🎨 Styling</styles.SectionSubTitle>
            <styles.TechTagGroup>
              <img src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
              <img src="https://img.shields.io/badge/vanilla--extract-99F6E4?style=for-the-badge" />
            </styles.TechTagGroup>
            <styles.SectionSubTitle>
              🧪 Test (Basic Understanding)
            </styles.SectionSubTitle>
            <styles.TechTagGroup>
              <img src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white" />
              <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white" />
            </styles.TechTagGroup>
            <styles.SectionSubTitle>
              🧩 Backend / Infra (Basic Understanding)
            </styles.SectionSubTitle>
            <styles.TechTagGroup>
              <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" />
              <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" />
              <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
              <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
              <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white" />
            </styles.TechTagGroup>
            <styles.SectionSubTitle>
              🧰 Collaboration & Deployment
            </styles.SectionSubTitle>
            <styles.TechTagGroup>
              <img src="https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white" />
              <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
              <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
              <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white" />
              <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white" />
              <img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white" />
              <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black" />
              <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
              <img src="https://img.shields.io/badge/AWS S3-569A31?style=style=for-the-badge&logo=amazonaws&logoColor=white" />
            </styles.TechTagGroup>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="projects">
          <styles.Section>
            <styles.SectionTitle>🚀 Projects</styles.SectionTitle>
            <styles.SectionDetail>
              <strong>COMATCHING</strong>: AI 기반 실시간 커플 매칭 서비스
              <br />
              <small>React, TypeScript, Recoil, AWS</small>
            </styles.SectionDetail>
            <styles.SectionDetail>
              <strong>Friends Community</strong>: 응원 성향 기반 축구 팬 매칭
              플랫폼
              <br />
              <small>React, Recoil, Vite, AWS</small>
            </styles.SectionDetail>
            <styles.SectionDetail>
              <strong>Share-It</strong>: 중고 물품 공유 및 대여 플랫폼
              <br />
              <small>React, Firebase, Recoil</small>
            </styles.SectionDetail>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="career">
          <styles.Section>
            <styles.SectionTitle>🎞️ Career</styles.SectionTitle>
            <styles.SectionSubTitle>
              PTKOREA (펑타이그레이터차이나)
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              2024.12 ~ 재직 중 / 인턴
            </styles.SectionDetail>
            <styles.SectionDetail>
              - 삼성 SMC QA 자동화 툴 개발
            </styles.SectionDetail>
            <styles.SectionDetail>
              - 대기업 글로벌 사이트 퍼블리싱 및 QA
            </styles.SectionDetail>

            <styles.SectionSubTitle>H2Biz</styles.SectionSubTitle>
            <styles.SectionDetail>
              2024.06 ~ 2024.08 / 학생 인턴
            </styles.SectionDetail>
            <styles.SectionDetail>
              - 프론트엔드 과제 수행 및 프로젝트 리펙토링
            </styles.SectionDetail>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="education">
          <styles.Section>
            <styles.SectionTitle>🎓 Education</styles.SectionTitle>
            <styles.SectionDetail>
              🏫 가톨릭대학교(Catholic University of Korea)
            </styles.SectionDetail>
            <styles.SectionDetail>
              💻️ 주전공: 정보통신전자공학부
            </styles.SectionDetail>
            <styles.SectionDetail>
              💻 복수전공: 컴퓨터정보공학과
            </styles.SectionDetail>
            <styles.SectionDetail>👨‍🎓 2019.03 ~ 2025.02</styles.SectionDetail>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="experience">
          <styles.Section>
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
          </styles.Section>
        </Element>
      </styles.ContentArea>
    </styles.ProfileContainer>
  );
};

export default Profile;
