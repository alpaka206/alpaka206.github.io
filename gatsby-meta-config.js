module.exports = {
  title: `alpaka206.com`,
  description: `김규원의 개발일기`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://alpaka206.github.io/`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `alpaka206/alpaka206.github.io`, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: 'G-Z0JD8BBEME', // Google Analytics Tracking ID
  author: {
    name: `김규원`,
    bio: {
      role: `개발자`,
      description: ['사람에 가치를 두는', '능동적으로 일하는', '이로운 것을 만드는'],
      thumbnail: 'sample.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: ``, // `https://github.com/zoomKoding`,
      linkedIn: ``, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: ``, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2019.03 ~',
        activity: '가톨릭대학교 정보통신전자공학부 입학',
      },
      {
        date: '2019.03 ~ 2019.06',
        activity: '보안동아리 catcert',
      },
      {
        date: '2019.06 ~ 2019.12',
        activity: '알고리즘동아리 alcuk',
      },
      {
        date: '2022.03 ~ ',
        activity: '코딩동아리 COMA',
      },
      {
        date: '2022.11 ~ 2023.06',
        activity: '창업동아리 새차처럼',
      },
      {
        date: '2023.09 ~ ',
        activity: 'COMAtching',
        links: {
          github: 'https://github.com/COMAtching/COMAtching_FE',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      // {
      //   title: '개발 블로그 테마 개발',
      //   description:
      //     '개발 블로그를 운영하는 기간이 조금씩 늘어나고 점점 많은 생각과 경험이 블로그에 쌓아가면서 제 이야기를 담고 있는 블로그를 직접 만들어보고 싶게 되었습니다. 그동안 여러 개발 블로그를 보면서 좋았던 부분과 불편했던 부분들을 바탕으로 레퍼런스를 참고하여 직접 블로그 테마를 만들게 되었습니다.',
      //   techStack: ['gatsby', 'react'],
      //   thumbnailUrl: 'blog.png',
      //   links: {
      //     post: '/gatsby-starter-zoomkoding-introduction',
      //     github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
      //     demo: 'https://www.zoomkoding.com',
      //   },
      // },
      {
        title: '교내 소개팅 어플 개발',
        description:
          '교내 축제때 "학교에서 나랑 맞는 사람을 쉽게 만나볼 수는 없을까?" 라는 생각으로 만들게 되었습니다.',
        techStack: ['html', 'react'],
        thumbnailUrl: 'COMAtching.jpg',
        links: {
          // post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/COMAtching/COMAtching_FE',
          demo: 'https://www.COMAtching.com',
        },
      },
    ],
  },
};
