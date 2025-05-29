import * as styles from "../css/Project.css.ts";

const COMATCHING = () => {
  const openGitHubPage = () => {
    const popupWidth = 1200;
    const popupHeight = 600;
    const popupX = Math.round(
      window.screenX + window.outerWidth / 2 - popupWidth / 2
    );
    const popupY = Math.round(
      window.screenY + window.outerHeight / 2 - popupHeight / 2
    );

    const featureWindow =
      "width=" +
      popupWidth +
      ", height=" +
      popupHeight +
      ", left=" +
      popupX +
      ", top=" +
      popupY;

    return window.open(
      "https://github.com/COMAtching/COMAtching_FE",
      "_blank",
      featureWindow
    );
  };
  return (
    <styles.Container>
      <styles.BackButton
        src="./assets/back.svg"
        alt="Phone"
        onClick={() => window.history.back()}
      />
      <styles.Top>프로젝트 개요</styles.Top>
      <styles.Title>COMATCHING</styles.Title>
      <styles.TitleImage
        src="./assets/Comatching/mainpage.png"
        alt="mainpage"
      />
      <styles.ExpContainer>
        <styles.ExpTitle>Skills</styles.ExpTitle>
        <styles.Content>
          {[
            { skill: "React", color: "#61DBFB" },
            { skill: "JavaScript", color: "#F0DB4F" },
            { skill: "Typescript", color: "#007acc" },
            { skill: "Recoil", color: "#007AF4" },
            { skill: "vanilla-extract", color: "#99F6E4" },
            { skill: "vite", color: "#9575CD" },
            { skill: "axios", color: "#0A99E0" },
          ].map(({ skill, color }) => (
            <styles.Item key={skill} bgColor={color}>
              {skill}
            </styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>Tools</styles.ExpTitle>
        <styles.Content>
          {[
            { tool: "Visual Studio Code", color: "#b0a1ec" },
            { tool: "Notion", color: "#eeeeee" },
            { tool: "Figma", color: "#F24E1E" },
            // { tool: "Firebase", color: "#FFCA28" },
            // { tool: "Vercel", color: "#777777" },
            { tool: "AWS", color: "#777777" },
          ].map(({ tool, color }) => (
            <styles.Item key={tool} bgColor={color}>
              {tool}
            </styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>진행기간</styles.ExpTitle>
        <div>2023.09.07 ~ 2024.10.18</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>개발 인원</styles.ExpTitle>
        <div>13명</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>역할</styles.ExpTitle>
        <styles.Content>
          {[
            { role: "프론트엔드 개발", color: "#dbebdb" },
            { role: "퍼블리싱", color: "#ffe2dd" },
            { role: "기획", color: "#f1c40f" },
            { role: "운영 및 홍보", color: "#fe340f" },
          ].map(({ role, color }) => (
            <styles.Item key={role} bgColor={color}>
              {role}
            </styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>기여도</styles.ExpTitle>
        <div>100%</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>성과</styles.ExpTitle>
        <div>총 사용자 2095명</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>카테고리</styles.ExpTitle>
        <styles.Item bgColor="#f1780f">
          WEB
        </styles.Item>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>github</styles.ExpTitle>
        <div onClick={() => openGitHubPage()}>
          https://github.com/COMAtching/COMAtching_FE
        </div>
      </styles.ExpContainer>

      <styles.Divider />

      <styles.Subtitle>기능</styles.Subtitle>
      <styles.FunctionTitle>회원가입</styles.FunctionTitle>
      <styles.ItemWithDot>
        Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입
      </styles.ItemWithDot>
      <styles.ItemWithDot>채팅 형식으로 정보 받음</styles.ItemWithDot>
      <styles.ItemWithDot>취향 입력 받음</styles.ItemWithDot>
      <styles.ItemWithDot>순서대로 추가 정보를 입력 받음</styles.ItemWithDot>
      <styles.ProjectImage
        src="./assets/Comatching/loginpage.png"
        alt="loginpage"
      />

      <styles.ProjectImage
        src="./assets/Comatching/registerchat.png"
        alt="registerchat"
      />

      <styles.ProjectImage
        src="./assets/Comatching/registerhobby.png"
        alt="registerhobby"
      />

      <styles.ProjectImage
        src="./assets/Comatching/registerfinal.png"
        alt="registerfinal"
      />

      <styles.Subtitle>메인페이지</styles.Subtitle>
      <styles.ItemWithDot>간단한 개인 정보 및 추가 정보 확인 가능</styles.ItemWithDot>
      <styles.ItemWithDot>충전 요청 보낼 수 있음</styles.ItemWithDot>
      <styles.ItemWithDot>QR코드로 빠르게 진행 가능</styles.ItemWithDot>
      <styles.ProjectImage
        src="./assets/Comatching/mainpage.png"
        alt="mainpage"
      />

      <styles.ProjectImage
        src="./assets/Comatching/mainpagecharge.png"
        alt="mainpage"
      />
      <styles.ProjectImage
        src="./assets/Comatching/QRpage.png"
        alt="mainpage"
      />

      <styles.Subtitle>매칭</styles.Subtitle>

      <styles.ItemWithDot>
        기본 조건으로 MBTI를 고를 수 있고 유료 조건도 사용 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>
        AI를 활용하여 본인이 고른 조건과 가장 유사한 사람 제공
      </styles.ItemWithDot>
      <styles.ProjectImage
        src="./assets/Comatching/matching.png"
        alt="mainpage"
      />

      <styles.ProjectImage
        src="./assets/Comatching/matchingresult.png"
        alt="mainpage"
      />

      <styles.Subtitle>결과 모아보기</styles.Subtitle>
      <styles.ItemWithDot>본인이 뽑은 내역 확인 가능 및 사후평가</styles.ItemWithDot>
      <styles.ProjectImage
        src="./assets/Comatching/review.png"
        alt="mainpage"
      />

      <styles.Subtitle>관리자 충전 내역 관리</styles.Subtitle>
      <styles.ItemWithDot>
        관리자가 포인트 충전 및 뽑힐 횟수 증가 가능
      </styles.ItemWithDot>
      <styles.ProjectImage
        src="./assets/Comatching/admin.png"
        alt="mainpage"
      />
      <styles.Divider />
      <styles.Subtitle>앞으로 구현하고자 하는 것</styles.Subtitle>
      <styles.ItemWithDot>매칭 뽑힌 사람끼리 쪽지 가능</styles.ItemWithDot>
      <styles.ItemWithDot>이메일 인증 재구현</styles.ItemWithDot>
      <styles.ItemWithDot>소개팅 희망자들을 위해 채팅방 개설</styles.ItemWithDot>
      <styles.ItemWithDot>토근 관리 RTR 방식 적용</styles.ItemWithDot>
      <styles.ItemWithDot>
        매칭 및 뽑힐기회 충전 사용자가 직접 가능하도록
      </styles.ItemWithDot>
    </styles.Container>
  );
};

export default COMATCHING;
