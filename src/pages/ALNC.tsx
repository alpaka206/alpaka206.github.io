import * as styles from "../css/Project.css.ts";

const ALNC = () => {
  return (
    <styles.Container>
      <styles.BackButton
        src="./assets/back.svg"
        alt="Phone"
        onClick={() => window.history.back()}
      ></styles.BackButton>
      <styles.Top>프로젝트 개요</styles.Top>
      <styles.Title>새차처럼</styles.Title>

      <styles.TitleImage src="./assets/ALNC/mainpage.webp" alt="mainpage" />
      <styles.ExpContainer>
        <styles.ExpTitle>Skills</styles.ExpTitle>
        <styles.Content>
          {[
            { skill: "React", color: "#61DBFB" },
            { skill: "JavaScript", color: "#F0DB4F" },
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
            // { tool: "Jira", color: "#2684FF" },
            { tool: "Firebase", color: "#FFCA28" },
            // { tool: "Vercel", color: "#777777" },
          ].map(({ tool, color }) => (
            <styles.Item bgColor={color}>{tool}</styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>진행기간</styles.ExpTitle>
        <div>2022.11.10 ~ 2023.08.25</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>참가 인원</styles.ExpTitle>
        <div>4명</div>
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
            <styles.Item bgColor={color}>{role}</styles.Item>
          ))}
        </styles.Content>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>기여도</styles.ExpTitle>
        <div>100%</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>성과</styles.ExpTitle>
        <div>학생창업유망팅 선정 및 k-300 출정</div>
        <div>하나 소셜벤처 유니버시티 우수팀 선정</div>
        <div>가톨릭대학교 창업경진대회 장려상 수상</div>
      </styles.ExpContainer>
      <styles.ExpContainer>
        <styles.ExpTitle>카테고리</styles.ExpTitle>
        <styles.Item bgColor="#f1780f">WEB</styles.Item>
      </styles.ExpContainer>

      <styles.Divider />

      <styles.Subtitle>기능</styles.Subtitle>
      <styles.FunctionTitle>로그인</styles.FunctionTitle>
      <styles.ItemWithDot>사용자 구분을 위한 로그인 기능</styles.ItemWithDot>
      <styles.ProjectImage src="./assets/ALNC/login.webp" alt="loginpage" />

      <styles.Subtitle>메인페이지</styles.Subtitle>
      <styles.ItemWithDot>날씨정보 확인 가능</styles.ItemWithDot>
      <styles.ItemWithDot>간단한 게시글 열람 가능</styles.ItemWithDot>
      <styles.ProjectImage src="./assets/ALNC/mainpage.webp" alt="mainpage" />

      <styles.Subtitle>견적 신청</styles.Subtitle>

      <styles.ItemWithDot>고압수, 스팀 세차 선택 가능</styles.ItemWithDot>
      <styles.ItemWithDot>어떤 점을 우선시 할지 선택 가능</styles.ItemWithDot>
      <styles.ItemWithDot>사진 및 정보 작성 가능</styles.ItemWithDot>
      <styles.ProjectImage src="./assets/ALNC/pick_first.webp" alt="mainpage" />

      <styles.ProjectImage
        src="./assets/ALNC/pick_second.webp"
        alt="mainpage"
      />
      <styles.ProjectImage src="./assets/ALNC/pick_final.webp" alt="mainpage" />

      <styles.Subtitle>견적서 보기</styles.Subtitle>
      <styles.ItemWithDot>
        견적서를 보낸 업체 리스트 열람 가능
      </styles.ItemWithDot>
      <styles.ItemWithDot>업체의 상세정보 열람 가능</styles.ItemWithDot>
      <styles.ProjectImage src="./assets/ALNC/list.webp" alt="mainpage" />
      <styles.ProjectImage
        src="./assets/ALNC/list_detail.webp"
        alt="mainpage"
      />

      <styles.Subtitle>견적함</styles.Subtitle>
      <styles.ItemWithDot>예약 내역 열람 가능</styles.ItemWithDot>
      <styles.ProjectImage src="./assets/ALNC/pick_list.webp" alt="mainpage" />
    </styles.Container>
  );
};

export default ALNC;
