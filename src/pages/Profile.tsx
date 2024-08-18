import * as styles from "../css/Profile.css";

const Profile = () => {
  return (
    <div className={styles.Profile}>
      <img
        src="./assets/ProfileImage.jpg"
        alt="prize"
        className={styles.ProfileImage}
      />
      <div>김규원</div>
      <div>2000.05.17</div>
      <div>포기하지 않는 성실함과 꾸준한 성장을 가장 중요하게 생각합니다.</div>
      <div>
        언제나 배울을 즐기고, 항상 도전하여 사용자에게 더 좋은 경험을 주고
        싶습니다.
      </div>

      <div>Contact</div>
      <div>010-2412-0339</div>
      <div>gyuwon05@gmail.com</div>
      <div>@alpaka_dev</div>
      <p>
        LinkedIn:{" "}
        <a href="https://www.linkedin.com/in/gyuwon">linkedin.com/in/gyuwon</a>
      </p>
      <p>
        GitHub: <a href="https://github.com/alpaka206">github.com/alpaka206</a>
      </p>

      <div>Skills & Abilities</div>
      <h3>Programming Languages</h3>
      <ul>
        <li>Java</li>
        <li>JavaScript (ES6+), TypeScript</li>
        <li>HTML/CSS</li>
      </ul>
      <h3>Frameworks & Libraries</h3>
      <ul>
        <li>React (including Next.js, Redux, Recoil)</li>
        <li>Jest (Testing)</li>
        <li>Styled-components, Vanilla-extract</li>
      </ul>
      <h3>Tools & Platforms</h3>
      <ul>
        <li>Git, GitHub, Vite</li>
        <li>Storybook, Webpack</li>
        <li>OAuth 2.0 (Social Login)</li>
      </ul>

      <div>EDUCATION</div>
      <div>가톨릭대학교(Catholic University of Korea)</div>
      <div>주전공: 정보통신전자공학부</div>
      <div>복수전공: 컴퓨터정보공학과</div>
      <div>2019.03 ~ 2025.02(졸업예정)</div>
      <div>3.63 / 4.5</div>
      <div>EXPERIENCE</div>
      <div>JAVA</div>
      <div>
        java를 사용하여 TCP/UDP 통신으로 주차장 관리 프로그램을 개발해본적
        있습니다.
      </div>
      <div>React</div>
      <div>redux같은 상태관리 사용 경험이 있으며 recoil을 주로 씁니다.</div>
      <div>소켓 통신이용하여 채팅을 구현해보았습니다.</div>
      <div>Auth2.0을 이용하여 소셜 로그인을 도입할수 있습니다.</div>
      <div>
        webview 방식을 통해 react-native로 개발하는 방법을 공부중에 있습니다.
      </div>
      <div>next.js를 활용하여 ssr 개발을 할수 있습니다.</div>
      <div>JAVASCRIPT</div>
      <div>ES6+ 문법에 익숙합니다</div>
      <div>vite로 번들러를 사용해 보았습니다.</div>
      <div>typescript를 능숙하게 사용할수 있습니다.</div>
      <div>디자인 시스템과 atomic 디자인에 대한 이해도가 높습니다.</div>
      <div>Jest를 활용한 테스트코드 작성 경험이 있습니다. </div>
      <div>Storybook 작성, 빌드 및 배포 경험이 있습니다.</div>
      <div>HTML/CSS</div>
      <div>웹표준을 지키려 노력합니다.</div>
      <div>zero-runtime인 vanilla-extract를 잘 활용할수 있습니다.</div>
      <div>styled-component를 활용할 수 있습니다.</div>
      <div>크로스 브라우징에 대응할 수 있습니다.</div>
      <div>keyframe을 활용한 애니메이션 기법을 활용할 수 있습니다.</div>

      <div>Career</div>
      <div>에이치투비즈(h2biz)</div>
      <div>2024.06 ~ 2024.08</div>
      <div>개발팀 학생인턴</div>

      <div>프로젝트 보러가기</div>
      <div>수상내역 보러가기</div>
    </div>
  );
};

export default Profile;
