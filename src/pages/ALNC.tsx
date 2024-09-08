import "../css/Project.css.ts";

const ALNC = () => {
  return (
    <div className="projectContainer">
      <div className="projectTop">프로젝트 개요</div>
      <div className="projectTitle">새차처럼</div>

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
        <div>2022.11.10 ~ 2023.08.25</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">참가 인원</div>
        <div>4명</div>
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
        <div>학생창업유망팅 선정 및 k-300 출정</div>
        <div>하나 소셜벤처 유니버시티 우수팀 선정</div>
        <div>가톨릭대학교 창업경진대회 장려상 수상</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">카테고리</div>
        <div className="item" style={{ backgroundColor: "#f1780f" }}>
          WEB
        </div>
      </div>
      {/* <div className="projectExpCatainer">
        <div className="projectExpTitle">github</div>
        <div onClick={() => openGitHubPage()}>
          https://github.com/COMAtching/COMAtching_FE
        </div>
      </div> */}

      <div className="projectDivider" />

      <div className="subTitle">기능</div>
      <div className="FunctionTitle">로그인</div>
      <div className="itemWithDot">사용자 구분을 위한 로그인 기능</div>
      <img
        className="projectImage"
        src="./assets/ALNC/login.png"
        alt="loginpage"
      />

      <div className="subTitle">메인페이지</div>
      <div className="itemWithDot">날씨정보 확인 가능</div>
      <div className="itemWithDot">간단한 게시글 열람 가능</div>
      <img
        className="projectImage"
        src="./assets/ALNC/mainpage.png"
        alt="mainpage"
      />

      <div className="subTitle">견적 신청</div>

      <div className="itemWithDot">고압수, 스팀 세차 선택 가능</div>
      <div className="itemWithDot">어떤 점을 우선시 할지 선택 가능</div>
      <div className="itemWithDot">사진 및 정보 작성 가능</div>
      <img
        className="projectImage"
        src="./assets/ALNC/pick_first.png"
        alt="mainpage"
      />

      <img
        className="projectImage"
        src="./assets/ALNC/pick_second.png"
        alt="mainpage"
      />
      <img
        className="projectImage"
        src="./assets/ALNC/pick_final.png"
        alt="mainpage"
      />

      <div className="subTitle">견적서 보기</div>
      <div className="itemWithDot">견적서를 보낸 업체 리스트 열람 가능</div>
      <div className="itemWithDot">업체의 상세정보 열람 가능</div>
      <img
        className="projectImage"
        src="./assets/ALNC/list.png"
        alt="mainpage"
      />
      <img
        className="projectImage"
        src="./assets/ALNC/list_detail.png"
        alt="mainpage"
      />

      <div className="subTitle">견적함</div>
      <div className="itemWithDot">예약 내역 열람 가능</div>
      <img
        className="projectImage"
        src="./assets/ALNC/pick_list.png"
        alt="mainpage"
      />
      {/* <div className="projectDivider" />
      <div className="subTitle">앞으로 구현하고자 하는 것</div>
      <div className="itemWithDot">매칭 뽑힌 사람끼리 쪽지 가능</div>
      <div className="itemWithDot">이메일 인증 재구현</div>
      <div className="itemWithDot">소개팅 희망자들을 위해 채팅방 개설</div>
      <div className="itemWithDot">토근 관리 RTR 방식 적용</div>
      <div className="itemWithDot">
        매칭 및 뽑힐기회 충전 사용자가 직접 가능하도록
      </div> */}
    </div>
  );
};

export default ALNC;
