import "../css/Project.css.ts";

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
    <div className="projectContainer">
      <img
        src="./assets/back.svg"
        alt="Phone"
        className="project_Back_button"
        onClick={() => window.history.back()}
      ></img>
      <div className="projectTop">프로젝트 개요</div>
      <div className="projectTitle">COMATCHING</div>

      {/* <div className={styles.imageContainer}> */}
      <img
        className="projectTitleImage"
        src="./assets/Comatching/mainpage.png"
        alt="mainpage"
      />
      {/* </div> */}
      <div className="projectExpCatainer">
        <div className="projectExpTitle">Skills</div>
        <div className="content">
          {[
            { skill: "React", color: "#61DBFB" },
            { skill: "JavaScript", color: "#F0DB4F" },
            { skill: "Typescript", color: "#007acc" },
            { skill: "Recoil", color: "#007AF4" },
            { skill: "vanilla-extract", color: "#99F6E4" },
            { skill: "vite", color: "#9575CD" },
            { skill: "axios", color: "#0A99E0" },
          ].map(({ skill, color }) => (
            <div className="item" style={{ backgroundColor: color }}>
              {skill}
            </div>
          ))}
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">Tools</div>
        <div className="content">
          {[
            { tool: "Visual Studio Code", color: "#b0a1ec" },
            { tool: "Notion", color: "#eeeeee" },
            { tool: "Figma", color: "#F24E1E" },
            // { tool: "Jira", color: "#2684FF" },
            { tool: "Firebase", color: "#FFCA28" },
            { tool: "Vercel", color: "#777777" },
          ].map(({ tool, color }) => (
            <div className="item" style={{ backgroundColor: color }}>
              {tool}
            </div>
          ))}
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">진행기간</div>
        <div>2023.09.07 ~ </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">개발 인원</div>
        <div>초기 4명으로 구성된 팀에서 현재 13명으로 확장됨</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">역할</div>
        <div className="content">
          {[
            { role: "프론트엔드 개발", color: "#dbebdb" },
            { role: "퍼블리싱", color: "#ffe2dd" },
            { role: "기획", color: "#f1c40f" },
            { role: "운영 및 홍보", color: "#fe340f" },
          ].map(({ role, color }) => (
            <div className="item" style={{ backgroundColor: color }}>
              {role}
            </div>
          ))}
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">기여도</div>
        <div>100%</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">성과</div>
        <div>총 사용자 2095명</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">카테고리</div>
        <div className="item" style={{ backgroundColor: "#f1780f" }}>
          WEB
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">github</div>
        <div onClick={() => openGitHubPage()}>
          https://github.com/COMAtching/COMAtching_FE
        </div>
      </div>

      <div className="projectDivider" />

      <div className="subTitle">기능</div>
      <div className="FunctionTitle">회원가입</div>
      <div className="itemWithDot">
        Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입
      </div>
      <div className="itemWithDot">채팅 형식으로 정보 받음</div>
      <div className="itemWithDot">취향 입력 받음</div>
      <div className="itemWithDot">순서대로 추가 정보를 입력 받음</div>
      <img
        className="projectImage"
        src="./assets/Comatching/loginpage.png"
        alt="loginpage"
      />

      <img
        className="projectImage"
        src="./assets/Comatching/registerchat.png"
        alt="registerchat"
      />

      <img
        className="projectImage"
        src="./assets/Comatching/registerhobby.png"
        alt="registerhobby"
      />

      <img
        className="projectImage"
        src="./assets/Comatching/registerfinal.png"
        alt="registerfinal"
      />

      <div className="subTitle">메인페이지</div>
      <div className="itemWithDot">간단한 개인 정보 및 추가 정보 확인 가능</div>
      <div className="itemWithDot">충전 요청 보낼 수 있음</div>
      <div className="itemWithDot">QR코드로 빠르게 진행 가능</div>
      <img
        className="projectImage"
        src="./assets/Comatching/mainpage.png"
        alt="mainpage"
      />

      <img
        className="projectImage"
        src="./assets/Comatching/mainpagecharge.png"
        alt="mainpage"
      />
      <img
        className="projectImage"
        src="./assets/Comatching/QRpage.png"
        alt="mainpage"
      />

      <div className="subTitle">매칭</div>

      <div className="itemWithDot">
        기본 조건으로 MBTI를 고를 수 있고 유료 조건도 사용 가능
      </div>
      <div className="itemWithDot">
        AI를 활용하여 본인이 고른 조건과 가장 유사한 사람 제공
      </div>
      <img
        className="projectImage"
        src="./assets/Comatching/matching.png"
        alt="mainpage"
      />

      <img
        className="projectImage"
        src="./assets/Comatching/matchingresult.png"
        alt="mainpage"
      />

      <div className="subTitle">결과 모아보기</div>
      <div className="itemWithDot">본인이 뽑은 내역 확인 가능 및 사후평가</div>
      <img
        className="projectImage"
        src="./assets/Comatching/review.png"
        alt="mainpage"
      />

      <div className="subTitle">관리자 충전 내역 관리</div>
      <div className="itemWithDot">
        관리자가 포인트 충전 및 뽑힐 횟수 증가 가능
      </div>
      <img
        className="projectImage"
        src="./assets/Comatching/admin.png"
        alt="mainpage"
      />
      <div className="projectDivider" />
      <div className="subTitle">앞으로 구현하고자 하는 것</div>
      <div className="itemWithDot">매칭 뽑힌 사람끼리 쪽지 가능</div>
      <div className="itemWithDot">이메일 인증 재구현</div>
      <div className="itemWithDot">소개팅 희망자들을 위해 채팅방 개설</div>
      <div className="itemWithDot">토근 관리 RTR 방식 적용</div>
      <div className="itemWithDot">
        매칭 및 뽑힐기회 충전 사용자가 직접 가능하도록
      </div>
    </div>
  );
};

export default COMATCHING;
