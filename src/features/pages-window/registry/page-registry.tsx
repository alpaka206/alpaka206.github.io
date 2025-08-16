import type { PageTab } from "@/store/useDesktopStore";

export const PAGE_TABS: Record<string, PageTab> = {
  about: {
    id: "about" as any,
    title: "About Me",
    icon: "/assets/Profile.webp",
    content: (
      <iframe
        src="https://alpaka206.github.io/#/Profile" // GH Pages면 해시라우팅 URL
        title="About Me"
        className="w-full h-full"
      />
    ),
  },
  blog: {
    id: "blog" as any,
    title: "Tech Blog",
    icon: "/assets/Blog.webp",
    content: (
      <iframe
        src="https://alpaka206.vercel.app/"
        title="Tech Blog"
        className="w-full h-full"
      />
    ),
  },
  insta: {
    id: "insta" as any,
    title: "Instagram",
    icon: "/assets/Insta.webp",
    content: (
      <iframe
        src="https://www.instagram.com/alpaka_dev/embed"
        title="Instagram"
        className="w-full h-full"
      />
    ),
  },
  awards: {
    id: "awards" as any,
    title: "Awards",
    icon: "/assets/prize.webp",
    content: (
      <iframe
        src="https://alpaka206.github.io/#/Prize"
        title="Awards"
        className="w-full h-full"
      />
    ),
  },
};
