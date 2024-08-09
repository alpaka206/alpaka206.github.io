import { useEffect } from "react";

const GitHubPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//cdn.jsdelivr.net/github-cards/latest/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="github-card"
      data-github="alpaka206"
      data-width="100%"
      data-height="500"
      data-theme="medium"
    ></div>
  );
};

export default GitHubPage;
