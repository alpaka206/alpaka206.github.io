import "../css/ShareIt.css.ts";

const ShareIt = () => {
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
      "https://github.com/share-it-cuk/share-it-frontend",
      "_blank",
      featureWindow
    );
  };

  return (
    <div className="projectContainer">
      <div className="projectTop">프로젝트 개요</div>
      <div className="projectTitle">ShareIt</div>

      {/* <div className={styles.imageContainer}> */}
      <img
        className="projectTitleImage"
        src="./assets/ShareIt/mainpage.png"
        alt="mainpage"
      />
      {/* </div> */}
      <div className="projectExpCatainer">
        <div className="projectExpTitle">Skills</div>
        <div className="content">
          {[
            { skill: "React", color: "#61DBFB" },
            { skill: "JavaScript", color: "#F0DB4F" },
            // { skill: "Typescript", color: "#007acc" },
            { skill: "Recoil", color: "#007AF4" },
            // { skill: "vanilla-extract", color: "#99F6E4" },
            // { skill: "vite", color: "#9575CD" },
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
            // { tool: "Vercel", color: "#777777" },
          ].map(({ tool, color }) => (
            <div className="item" style={{ backgroundColor: color }}>
              {tool}
            </div>
          ))}
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">진행기간</div>
        <div>2024.01.25 ~ 2024.06.03</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">개발 인원</div>
        <div>5명</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">역할</div>
        <div className="content">
          {[
            { role: "프론트엔드 개발", color: "#dbebdb" },
            { role: "퍼블리싱", color: "#ffe2dd" },
            { role: "기획", color: "#f1c40f" },
            // { role: "운영 및 홍보", color: "#fe340f" },
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
      {/* <div className="projectExpCatainer">
        <div className="projectExpTitle">성과</div>
        <div>총 사용자 1320명</div>
      </div> */}
      <div className="projectExpCatainer">
        <div className="projectExpTitle">카테고리</div>
        <div className="item" style={{ backgroundColor: "#f1780f" }}>
          WEB
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">github</div>
        <div onClick={() => openGitHubPage()}>
          https://github.com/share-it-cuk/share-it-frontend
        </div>
      </div>

      <div className="projectDivider" />

      <div className="subTitle">기능</div>
      <div className="FunctionTitle">회원가입</div>
      <div className="itemWithDot">
        Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입
      </div>
      <div className="itemWithDot">일반 회원가입도 가능</div>
      <div className="itemWithDot">이메일 인증을 통해 검증</div>
      <div className="itemWithDot">정보를 입력하면 다음 내용으로 슬라이딩</div>
      <img
        className="projectImage"
        src="./assets/ShareIt/KaKaologin.png"
        alt="loginpage"
      />

      <img
        className="projectImage"
        src="./assets/ShareIt/Email.png"
        alt="registerchat"
      />

      <div className="subTitle">메인페이지</div>
      <div className="itemWithDot">
        간단한 개인 정보 및 앞으로 반납/대여 일정 확인 가능
      </div>
      <div className="itemWithDot">최근에 등록된 물건 확인 가능</div>
      <div className="itemWithDot">사이드바 작동</div>
      <div className="itemWithDot">최근 검색어 및 검색어 자동완성 구현</div>
      <img
        className="projectImage"
        src="./assets/ShareIt/Search.png"
        alt="mainpage"
      />

      <img
        className="projectImage"
        src="./assets/ShareIt/sidebar.png"
        alt="mainpage"
      />

      <div className="subTitle">등록</div>
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

export default ShareIt;
