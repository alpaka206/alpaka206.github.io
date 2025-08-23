import * as styles from "../styles/Profile.css";
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
                사용자 흐름을 구조적으로 설계하고, 실시간성과 유지보수성을 모두
                고려하는 프론트엔드 개발자 김규원입니다.
              </styles.Paragraph>
              <styles.Paragraph>
                Recoil, Zustand, React Query 등 다양한 상태 관리 경험과 퍼포먼스
                개선 역량을 바탕으로 실서비스에서 성능과 사용자 경험을 동시에
                개선한 경험이 있습니다.
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
              <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white" />
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
                Role: Front-End Leader
              </styles.ProjectDescription>

              <styles.ProjectDescription>
                - 실시간 포인트 관리 및 사용자 매칭 로직 구현
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - Recoil 기반 상태 구조 설계로 프로필 카드, 포인트 흐름 등 전체
                UX 설계
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 코드 스플리팅 및 불필요 렌더링 제거로 초기 로딩 속도 30% 개선
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 총 2,095명 이상의 사용자가 참여한 실서비스 운영
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 지속적인 사용자 피드백 반영 및 리팩토링으로 UI/UX 개선 및
                유지보수성 향상
              </styles.ProjectDescription>
              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>TypeScript</styles.TechBadge>
                <styles.TechBadge>Recoil</styles.TechBadge>
                <styles.TechBadge>vanilla-extract</styles.TechBadge>
                <styles.TechBadge>Vite</styles.TechBadge>
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
                - COMATCHING 프로젝트를 기반으로 외주 확장 개발된 실시간 팬 매칭
                서비스
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 팬들의 응원 성향에 따른 실시간 매칭 UI를 구현하고 관리자
                기능을 추가
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - STOMP 기반 실시간 데이터 흐름과 사용자 중심 페이지 전환 구조
                설계
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 외주 클라이언트 피드백을 반영하며 운영성과 유지보수성을 고려한
                구조로 개선
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
                  교내 중고 물품 공유 및 대여 플랫폼
                </styles.ProjectSubTitle>
              </styles.ProjectHeader>
              <styles.ProjectDescription>
                Role: Front-End Developer
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 대여 주기를 고려한 상품 등록/검색/예약 UI 흐름을 설계하고 구현
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 무한 스크롤 기반 목록 조회 및 실시간 채팅 기능을 직접 구현
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 사용자 인증부터 반납까지의 상태 흐름을 구조화하여 UX 완성도
                향상
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 사용자 경험 기반의 기능 구현으로 종합설계프로젝트1 A+ 달성
              </styles.ProjectDescription>
              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>Firebase</styles.TechBadge>
                <styles.TechBadge>Axios</styles.TechBadge>
                <styles.TechBadge>Recoil</styles.TechBadge>
              </styles.TechBadgeGroup>
            </styles.ProjectCard>
            <styles.ProjectCard>
              <styles.ProjectHeader>
                <styles.ProjectTitle>새차처럼</styles.ProjectTitle>
                <styles.ProjectSubTitle>
                  손세차 매장 정보 및 예약 플랫폼
                </styles.ProjectSubTitle>
              </styles.ProjectHeader>
              <styles.ProjectDescription>
                Role: Front-End Developer
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 손세차 매장 정보를 사용자에게 제공하고, 예약 및 리뷰가 가능한
                웹 플랫폼 개발
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 상인들에게는 온라인 홍보 및 예약 시스템을 제공하고,
                사용자에게는 합리적인 가격과 정보를 연결
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 매장 상세 정보, 리뷰 작성, 예약 흐름 등의 UI 구현 및 데이터
                흐름 설계
              </styles.ProjectDescription>
              <styles.ProjectDescription>
                - 교육부 주관 창업유망팀 300 경진대회 최종 선정, 하나금융그룹
                소셜벤처 유니버시티 우수팀 수상
              </styles.ProjectDescription>
              <styles.TechBadgeGroup>
                <styles.TechBadge>React</styles.TechBadge>
                <styles.TechBadge>Firebase</styles.TechBadge>
                <styles.TechBadge>Axios</styles.TechBadge>
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
              2024.12 ~ 재직 중 / 프로
            </styles.SectionDetail>
            <styles.SectionDetail>
              - 삼성 91개국 글로벌 사후 QA 자동화 툴 프론트엔드 개발 참여
            </styles.SectionDetail>
            <styles.SectionDetail>
              - 삼성 샵앱 31개국 글로벌 사전 QA 자동화 툴 프론트엔드 개발 참여
            </styles.SectionDetail>
            <styles.SectionDetail>
              - Puppeteer 기반 UI 캡처 기능 구현
            </styles.SectionDetail>
            <styles.SectionDetail>
              - FastAPI 기반 API 연동 및 백엔드 일부 개발 참여
            </styles.SectionDetail>
            <styles.SectionDetail>
              - OCR 기반 QA 시스템 및 스크린샷 업로드 일부 개발 참여
            </styles.SectionDetail>

            <styles.SectionSubTitle>H2Biz</styles.SectionSubTitle>
            <styles.SectionDetail>
              2024.06 ~ 2024.08 / 학생 인턴
            </styles.SectionDetail>
            <styles.SectionDetail>- 프로젝트 리펙토링</styles.SectionDetail>
            <styles.SectionDetail>- 프론트엔드 과제 수행</styles.SectionDetail>
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
              💻 복수전공: 컴퓨터정보공학부
            </styles.SectionDetail>
            <styles.SectionDetail>👨‍🎓 2019.03 ~ 2025.02</styles.SectionDetail>
          </styles.Section>
        </Element>

        <styles.Divider />
        <Element name="experience">
          <styles.Section>
            <styles.SectionTitle>📚 Experience</styles.SectionTitle>
            <styles.SectionSubTitle>
              🖥️ Frontend Development
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              React와 TypeScript 기반의 SPA 개발에 익숙하며, 서비스의 구조
              설계부터 사용자 흐름, 상태 관리까지 전체적인 화면 동작을 고려한
              개발을 지향합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Recoil, Zustand 등 다양한 상태 관리 도구를 프로젝트 상황에 맞게
              선택하고 구조화해본 경험이 있으며, 최근에는 Zustand 기반 구조 개선
              및 리팩토링 작업에 참여했습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              React Query를 활용한 데이터 요청, 캐싱, 무한스크롤 구성 등 사용자
              중심의 데이터 흐름 처리에 익숙하며, 실시간성이 요구되는
              서비스에서는 SockJS + STOMP 기반의 채팅 및 알림 기능을 직접
              구현했습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Next.js를 활용한 서버사이드 렌더링 경험과 Vite 기반 번들러 설정 및
              성능 최적화도 경험하였습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Lighthouse 분석을 통한 성능 디버깅과 개선을 반복적으로
              수행해왔습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              OAuth 2.0 기반의 소셜 로그인(Kakao, Google 등)을 직접 구현하고,
              React Native WebView와의 앱 연동 방식도 학습하여 실제 적용 사례에
              대비하고 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>
              Component & UI Design
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              Atomic Design 패턴 기반으로 컴포넌트의 재사용성과 유지보수성을
              고려한 구조 설계를 해왔으며, 디자인 시스템 관점의 일관된 UI 구현
              경험을 갖고 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Storybook을 활용해 컴포넌트 문서화 및 협업용 UI 테스트 환경을
              구성해보았고, 스타일링은 styled-components, vanilla-extract 기반의
              CSS-in-JS 방식에 익숙합니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              크로스 브라우징, 반응형 UI, 웹 접근성 등을 고려한 실무 UI를 직접
              구현해왔고, Keyframe을 활용한 인터랙션 중심 애니메이션 구성 경험도
              보유하고 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>Testing & Tooling</styles.SectionSubTitle>
            <styles.SectionDetail>
              Jest 기반의 단위 테스트 작성과 사용자 시나리오 중심의 테스트
              케이스 정의 경험이 있으며, 실제로 주요 로직이나 라이브러리
              리팩토링 시 테스트 코드 기반 검증을 진행했습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Vite 및 Webpack을 활용해 번들링 구조를 설정하고, 코드 스플리팅,
              Lazy loading 등을 통해 초기 로딩 성능을 개선한 경험도 있습니다.
            </styles.SectionDetail>
            <styles.SectionSubTitle>
              Backend & System Integration
            </styles.SectionSubTitle>
            <styles.SectionDetail>
              실제 프로젝트에서 프론트엔드와 백엔드가 맞물려 동작하는 구조를
              고려하여 API 스펙 정의, 인터페이스 설계, 연동 테스트까지
              End-to-End 흐름을 관리해본 경험이 있습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              FastAPI와 Node.js, NestJS 기반의 간단한 백엔드 서버 개발도 경험해
              보았습니다.
            </styles.SectionDetail>
            <styles.SectionDetail>
              Java 기반의 TCP/UDP 통신 구조를 활용한 소형 프로그램 개발 경험을
              통해 네트워크 구조에 대한 기본 이해를 쌓았습니다.
            </styles.SectionDetail>
          </styles.Section>
        </Element>
      </styles.ContentArea>
    </styles.ProfileContainer>
  );
};

export default Profile;
