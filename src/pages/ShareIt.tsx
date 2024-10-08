import "../css/Project.css.ts";

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
      <img
        src="./assets/back.svg"
        alt="Phone"
        className="project_Back_button"
        onClick={() => window.history.back()}
      ></img>
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
        className="projectImageFullWidth"
        src="./assets/ShareIt/KaKaologin.png"
        alt="loginpage"
      />

      <img
        className="projectImageFullWidth"
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
        className="projectImageFullWidth"
        src="./assets/ShareIt/Search.png"
        alt="mainpage"
      />

      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/sidebar.png"
        alt="mainpage"
      />

      <div className="subTitle">등록</div>
      <div className="itemWithDot">
        필요해요/빌려주기를 통해 필요한 물건/빌려줄 물건을 등록 가능
      </div>
      <div className="itemWithDot">
        사진, 가격, 해시태그, 부가 설명 기입 가능
      </div>
      <div className="itemWithDot">
        필요로 한 물건은 사진이 없을수 있기에 빌려주기만 사진 필수 등록
      </div>
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/registration.png"
        alt="mainpage"
      />

      <div className="subTitle">리스트</div>
      <div className="itemWithDot">
        검색없이 접속시 최근 등록된 순으로 확인 가능
      </div>
      <div className="itemWithDot">무한 스크롤로 추가 확인 가능</div>
      <div className="itemWithDot">인기 해시태그 제공</div>
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/borrowpage.png"
        alt="mainpage"
      />
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/needpage.png"
        alt="mainpage"
      />

      <div className="subTitle">상세페이지</div>
      <div className="itemWithDot">평점 및 좋아요 개수 확인가능</div>
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/borrowDetail.png"
        alt="mainpage"
      />
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/needDetail.png"
        alt="mainpage"
      />

      <div className="subTitle">채팅페이지</div>
      <div className="itemWithDot">약속 잡기 가능</div>
      <div className="itemWithDot">거래 완료 가능</div>
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/chat.png"
        alt="mainpage"
      />
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/chatwidget.png"
        alt="mainpage"
      />

      <div className="subTitle">리뷰페이지</div>
      <div className="itemWithDot">거래내역 확인 가능</div>
      <div className="itemWithDot">별점 부여 가능</div>
      <img
        className="projectImageFullWidth"
        src="./assets/ShareIt/review.png"
        alt="mainpage"
      />
      <div className="projectDivider" />
      <div className="subTitle">개발한 내역</div>
      <div className="itemWithDot">무한 스크롤로 리스트 구현</div>
      <div className="itemWithDot">웹 소켓통신으로 채팅 구현</div>
      <div className="itemWithDot">Oauth 2.0을 도입하여 카카오 로그인 적용</div>
      <div className="itemWithDot">이메일 인증 도입</div>
      <div className="itemWithDot">
        업로드 파일 형식 제안하여 해킹 위협 방지
      </div>
    </div>
  );
};

export default ShareIt;
