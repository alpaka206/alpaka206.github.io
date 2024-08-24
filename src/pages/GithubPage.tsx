const GitHubPage = () => {
  const openGitHubPage = () => {
    window.open(
      "https://github.com/alpaka206",
      "_blank",
      "noopener,noreferrer,width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };
  return <div onClick={openGitHubPage}></div>;
};

export default GitHubPage;
