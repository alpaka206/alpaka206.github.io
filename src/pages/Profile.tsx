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
            <styles.ProjectCard>
              <styles.ProjectHeader>
                <a
                  href="https://github.com/COMAtching"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <styles.ProjectTitle>COMATCHING</styles.ProjectTitle>
                </a>
                <styles.ProjectSubTitle>
                  AI 기반 실시간 커플 매칭 서비스
                </styles.ProjectSubTitle>
              </styles.ProjectHeader>
              <styles.ProjectDescription>
                Role: Front-End Developer
              </styles.ProjectDescription>

              <styles.ProjectDescription>
                실시간 포인트 관리와 사용자 간 매칭 로직을 구현하고, Lighthouse
                분석을 통해 성능 저하 이슈를 최적화했습니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                Recoil 기반으로 복잡한 상태를 구조화하여 프로필 카드 UI, 포인트
                결제·소모 흐름 등 전체 매칭 사이클을 설계했고, 2,095명의
                사용자가 참여한 실서비스로 운영되었습니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                사용자 피드백을 반영해 UI/UX를 지속적으로 개선하고, 컴포넌트
                구조를 리팩토링하여 유지보수성을 높였습니다.
              </styles.ProjectDescription>

              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>TypeScript</styles.TechBadge>
                <styles.TechBadge>Recoil</styles.TechBadge>
                <styles.TechBadge>SockJS</styles.TechBadge>
                <styles.TechBadge>STOMP</styles.TechBadge>
                <styles.TechBadge>AWS</styles.TechBadge>
              </styles.TechBadgeGroup>
            </styles.ProjectCard>
            <styles.ProjectCard>
              <styles.ProjectHeader>
                <a
                  href="https://github.com/COMAtching/COMATCHING_FC_FE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <styles.ProjectTitle>
                    부천FC - Friends Community
                  </styles.ProjectTitle>
                </a>
                <styles.ProjectSubTitle>
                  응원 성향 기반 축구 팬 매칭 플랫폼
                </styles.ProjectSubTitle>
              </styles.ProjectHeader>
              <styles.ProjectDescription>
                Role: Front-End Developer
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                COMATCHING 프로젝트를 기반으로 외주 형태로 확장 개발한
                서비스입니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                팀 응원 성향 기반 매칭 알고리즘의 UI를 구현하고, 관리자가 알림
                등을 설정할 수 있는 관리자 기능을 개발했습니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                사용자 중심의 페이지 전환 흐름 및 실시간 매칭 데이터 렌더링
                구조를 구축했습니다.
              </styles.ProjectDescription>
              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>TypeScript</styles.TechBadge>
                <styles.TechBadge>Recoil</styles.TechBadge>
                <styles.TechBadge>SockJS</styles.TechBadge>
                <styles.TechBadge>STOMP</styles.TechBadge>
                <styles.TechBadge>AWS</styles.TechBadge>
              </styles.TechBadgeGroup>
            </styles.ProjectCard>
            <styles.ProjectCard>
              <styles.ProjectHeader>
                <a
                  href="https://github.com/share-it-cuk/share-it-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <styles.ProjectTitle>Share-It</styles.ProjectTitle>
                </a>
                <styles.ProjectSubTitle>
                  중고 물품 공유 및 대여 플랫폼
                </styles.ProjectSubTitle>
              </styles.ProjectHeader>
              <styles.ProjectDescription>
                Role: Front-End Developer
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                상품 등록, 검색, 대여 UI를 구현하고, 무한 스크롤 기반의 목록
                조회 기능을 개발했습니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                사용자 인증, 예약, 반납 등의 흐름을 구조화하여 전체 대여
                사이클을 설계하고, 사용자 경험에 맞춘 화면 전환 및 상태 관리를
                구현했습니다.
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                실시간 채팅 기능 구현
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                종합설계프로젝트1 A+
              </styles.ProjectDescription>
              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>Firebase</styles.TechBadge>
                <styles.TechBadge>Recoil</styles.TechBadge>
              </styles.TechBadgeGroup>
            </styles.ProjectCard>
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
            <styles.SectionSubTitle>
              Frontend Development
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              React 및 TypeScript 기반의 SPA 개발에 능숙합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Recoil과 Zustand를 활용한 복잡한 상태 관리 경험이 있으며, 최근에는
              Zustand 기반 구조 개선에도 참여하였습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              React Query를 통한 데이터 요청 및 캐싱 처리에 익숙합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              SockJS와 STOMP를 활용한 실시간 채팅 기능을 직접 구현하였습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Vite로 번들러를 사용해 보았습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              OAuth 2.0 기반 소셜 로그인 (Kakao, Google 등)을 구현한 경험이
              있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Next.js 기반의 서버사이드 렌더링 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              성능 최적화를 위한 Lighthouse 분석을 수행해 왔습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              React Native WebView를 활용한 앱 연동방식을 학습하였습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>
              Component & UI Design
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              Atomic Design 패턴과 디자인 시스템 기반의 컴포넌트 구조 설계
              경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Storybook을 활용한 컴포넌트 문서화, 배포 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Styled-components와 Vanilla-extract를 활용한 CSS-in-JS 스타일링에
              익숙하며, 크로스 브라우징과 접근성을 고려한 UI를 구현합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Keyframe을 활용한 인터랙션 중심의 애니메이션 효과 적용 경험이
              있습니다.
            </styles.SectionDetail>

            <styles.SectionSubTitle>Testing & Tooling</styles.SectionSubTitle>
            <styles.SectionDetail>
              Jest 기반의 단위 테스트와 사용자 시나리오 중심의 테스트 케이스
              작성 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Vite 및 Webpack을 활용한 프로젝트 설정과 번들링 구성 경험이
              있으며, 성능 측정 및 최적화를 진행해본 경험이 있습니다.
            </styles.SectionDetail>

            <styles.SectionSubTitle>
              Backend & Network Programming
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              Java 기반의 TCP/UDP 통신 구조를 활용하여 주차장 관리 프로그램을
              개발한 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              FastAPI 기반의 REST API 서버를 구현에 일부 참여하였습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Node.js와 NestJS 프레임워크를 활용해 간단한 CRUD API 및 인증 처리
              백엔드를 개발해본 경험이 있으며, 프론트엔드와의 협업 구조를 고려한
              API 스펙 정의 및 연동 테스트 경험도 갖추고 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              전체 시스템 흐름을 고려하여 프론트와 백을 매끄럽게 연결하는
              End-to-End 구조에 익숙합니다.
            </styles.SectionDetail>
          </styles.Section>
        </Element>
      </styles.ContentArea>
    </styles.ProfileContainer>
  );
};

export default Profile;
