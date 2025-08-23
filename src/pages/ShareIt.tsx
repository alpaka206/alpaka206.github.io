import * as styles from "../styles/Project.css.ts";

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
    <styles.Container>
      <styles.BackButton
        src="./assets/back.svg"
        alt="Phone"
        onClick={() => window.history.back()}
      ></styles.BackButton>
      <styles.Top>프로젝트 개요</styles.Top>
      <styles.Title>ShareIt</styles.Title>

      <styles.TitleImage src="./assets/ShareIt/mainpage.webp" alt="mainpage" />
      <styles.ExpContainer>
        <styles.ExpTitle>Skills</styles.ExpTitle>
        <styles.Content>
          {[
            { skill: "React", color: "#61DBFB" },
            { skill: "JavaScript", color: "#F0DB4F" },
            { skill: "Recoil", color: "#007AF4" },
            { skill: "axios", color: "#0A99E0" },
          ].map(({ skill, color }) => (
            <styles.Item bgColor={color}>{skill}</styles.Item>
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
            { tool: "Firebase", color: "#FFCA28" },
          ].map(({ tool, color }) => (
            <styles.Item bgColor={color}>{tool}</styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>진행기간</styles.ExpTitle>
        <div>2024.01.25 ~ 2024.06.03</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>개발 인원</styles.ExpTitle>
        <div>5명</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>역할</styles.ExpTitle>
        <styles.Content>
          {[
            { role: "프론트엔드 개발", color: "#dbebdb" },
            { role: "퍼블리싱", color: "#ffe2dd" },
            { role: "기획", color: "#f1c40f" },
            // { role: "운영 및 홍보", color: "#fe340f" },
          ].map(({ role, color }) => (
            <styles.Item bgColor={color}>{role}</styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>기여도</styles.ExpTitle>
        <div>100%</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>카테고리</styles.ExpTitle>
        <styles.Item>WEB</styles.Item>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>github</styles.ExpTitle>
        <div onClick={() => openGitHubPage()}>
          https://github.com/share-it-cuk/share-it-frontend
        </div>
      </styles.ExpContainer>

      <styles.Divider />

      <styles.Subtitle>기능</styles.Subtitle>
      <styles.FunctionTitle>회원가입</styles.FunctionTitle>
      <styles.ItemWithDot>
        Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입
      </styles.ItemWithDot>
      <styles.ItemWithDot>일반 회원가입도 가능</styles.ItemWithDot>
      <styles.ItemWithDot>이메일 인증을 통해 검증</styles.ItemWithDot>
      <styles.ItemWithDot>
        정보를 입력하면 다음 내용으로 슬라이딩
      </styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/KaKaologin.webp"
        alt="loginpage"
      />

      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/Email.webp"
        alt="registerchat"
      />

      <styles.Subtitle>메인페이지</styles.Subtitle>
      <styles.ItemWithDot>
        간단한 개인 정보 및 앞으로 반납/대여 일정 확인 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>최근에 등록된 물건 확인 가능</styles.ItemWithDot>
      <styles.ItemWithDot>사이드바 작동</styles.ItemWithDot>
      <styles.ItemWithDot>
        최근 검색어 및 검색어 자동완성 구현
      </styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/Search.webp"
        alt="mainpage"
      />

      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/sidebar.webp"
        alt="mainpage"
      />

      <styles.Subtitle>등록</styles.Subtitle>
      <styles.ItemWithDot>
        필요해요/빌려주기를 통해 필요한 물건/빌려줄 물건을 등록 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>
        사진, 가격, 해시태그, 부가 설명 기입 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>
        필요로 한 물건은 사진이 없을수 있기에 빌려주기만 사진 필수 등록
      </styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/registration.webp"
        alt="mainpage"
      />

      <styles.Subtitle>리스트</styles.Subtitle>
      <styles.ItemWithDot>
        검색없이 접속시 최근 등록된 순으로 확인 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>무한 스크롤로 추가 확인 가능</styles.ItemWithDot>
      <styles.ItemWithDot>인기 해시태그 제공</styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/borrowpage.webp"
        alt="mainpage"
      />
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/needpage.webp"
        alt="mainpage"
      />

      <styles.Subtitle>상세페이지</styles.Subtitle>
      <styles.ItemWithDot>평점 및 좋아요 개수 확인가능</styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/borrowDetail.webp"
        alt="mainpage"
      />
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/needDetail.webp"
        alt="mainpage"
      />

      <styles.Subtitle>채팅페이지</styles.Subtitle>
      <styles.ItemWithDot>약속 잡기 가능</styles.ItemWithDot>
      <styles.ItemWithDot>거래 완료 가능</styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/chat.webp"
        alt="mainpage"
      />
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/chatwidget.webp"
        alt="mainpage"
      />

      <styles.Subtitle>리뷰페이지</styles.Subtitle>
      <styles.ItemWithDot>거래내역 확인 가능</styles.ItemWithDot>
      <styles.ItemWithDot>별점 부여 가능</styles.ItemWithDot>
      <styles.ProjectImageFullWidth
        src="./assets/ShareIt/review.webp"
        alt="mainpage"
      />
      <styles.Divider />
      <styles.Subtitle>개발한 내역</styles.Subtitle>
      <styles.ItemWithDot>무한 스크롤로 리스트 구현</styles.ItemWithDot>
      <styles.ItemWithDot>웹 소켓통신으로 채팅 구현</styles.ItemWithDot>
      <styles.ItemWithDot>
        Oauth 2.0을 도입하여 카카오 로그인 적용
      </styles.ItemWithDot>
      <styles.ItemWithDot>이메일 인증 도입</styles.ItemWithDot>
      <styles.ItemWithDot>
        업로드 파일 형식 제안하여 해킹 위협 방지
      </styles.ItemWithDot>
    </styles.Container>
  );
};

export default ShareIt;
