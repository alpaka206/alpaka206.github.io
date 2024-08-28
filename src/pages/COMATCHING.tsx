import * as styles from "../css/COMATCHING.css.ts";

const COMATCHING = () => {
  return (
    <div className="projectContainer">
      <div className="projectTop">Project</div>
      <div className="projectTitle">COMATCHING</div>

      {/* <div className={styles.imageContainer}> */}
      <img
        className="projectImage"
        src="./assets/Comatching/mainpage.png"
        alt="mainpage"
      />
      {/* </div> */}
      <div className="projectExpCatainer">
        <div className="projectExpTitle">Skills</div>
        <div className="content">
          <div className="item" style={{ backgroundColor: "#61DBFB" }}>
            React
          </div>
          <div className="item" style={{ backgroundColor: "#F0DB4F" }}>
            JavaScript
          </div>
          <div className="item" style={{ backgroundColor: "#007acc" }}>
            Typescript
          </div>
          <div className="item" style={{ backgroundColor: "#007AF4" }}>
            Recoil
          </div>
          <div className="item" style={{ backgroundColor: "#99F6E4" }}>
            vanilla-extract
          </div>
          <div className="item" style={{ backgroundColor: "#9575CD" }}>
            vite
          </div>
          <div className="item" style={{ backgroundColor: "#0A99E0" }}>
            axios
          </div>
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">Tools</div>
        <div className="content">
          <div className="item" style={{ backgroundColor: "#b0a1ec" }}>
            Visual studio code
          </div>
          <div className="item" style={{ backgroundColor: "#eeeeee" }}>
            notion
          </div>
          <div className="item" style={{ backgroundColor: "#F24E1E" }}>
            figma
          </div>
          <div className="item" style={{ backgroundColor: "#2684FF" }}>
            jira
          </div>
          <div className="item" style={{ backgroundColor: "#FFCA28" }}>
            firebase
          </div>
          <div className="item" style={{ backgroundColor: "#777777" }}>
            vercel
          </div>
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">진행기간</div>
        <div>2023.09.07 ~ 진행중</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">개발 인원</div>
        <div>초기 4명으로 구성된 팀에서 현재 13명으로 확장됨</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">역할</div>
        <div className="content">
          <div className="item" style={{ backgroundColor: "#dbebdb" }}>
            프론트엔드 개발
          </div>
          <div className="item" style={{ backgroundColor: "#ffe2dd" }}>
            퍼블리싱
          </div>
          <div className="item" style={{ backgroundColor: "#f1c40f" }}>
            기획
          </div>
          <div className="item" style={{ backgroundColor: "#f1c40f" }}>
            운영 및 홍보
          </div>
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">기여도</div>
        <div>100%</div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">카테고리</div>
        <div className="item" style={{ backgroundColor: "#f1c40f" }}>
          WEB
        </div>
      </div>
      <div className="projectExpCatainer">
        <div className="projectExpTitle">github</div>
        <div>
          <a
            href="https://github.com/COMAtching/COMAtching_FE"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/COMAtching/COMAtching_FE
          </a>
        </div>
      </div>

      <div className="projectDivider" />

      <div className={styles.subTitle}>기능</div>
      <div className={styles.content}>
        <div>회원가입</div>
        <div>Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/loginpage.png"
            alt="loginpage"
          />
        </div>
        <div>채팅 형식으로 정보 받음</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/loginpage.png"
            alt="loginpage"
          />
        </div>
        <div>취향 입력 받음</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/loginpage.png"
            alt="loginpage"
          />
        </div>
        <div>순서대로 추가 정보를 입력 받음</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/loginpage.png"
            alt="loginpage"
          />
        </div>
      </div>

      <div className={styles.subTitle}>메인페이지</div>
      <div className={styles.content}>
        <div>간단한 개인 정보 및 추가 정보 확인 가능</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
        <div>충전 요청 보낼 수 있음</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
      </div>

      <div className={styles.subTitle}>뽑기</div>
      <div className={styles.content}>
        <div>QR코드 제공(인식으로 간편하게 진행)</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
        <div>기본 조건으로 MBTI를 고를 수 있음</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
        <div>유료 조건 사용 가능</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
      </div>

      <div className={styles.subTitle}>결과</div>
      <div className={styles.content}>
        <div>AI를 활용하여 본인이 고른 조건과 가장 유사한 사람 제공</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
      </div>

      <div className={styles.subTitle}>결과 모아보기</div>
      <div className={styles.content}>
        <div>본인이 뽑은 내역 확인 가능</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
        <div>평가를 통해 AI 학습</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
      </div>

      <div className={styles.subTitle}>관리자 충전 내역 관리</div>
      <div className={styles.content}>
        <div>관리자가 포인트 충전 및 뽑힐 횟수 증가 가능</div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="./assets/Comatching/mainpage.png"
            alt="mainpage"
          />
        </div>
      </div>
    </div>
  );
};

export default COMATCHING;
