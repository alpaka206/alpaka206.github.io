import React, { useEffect, useState } from "react";

interface GitHubData {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GithubPage: React.FC = () => {
  const [data, setData] = useState<GitHubData | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/alpaka206")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching GitHub data:", error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>GitHub Profile</h1>
      <img
        src={data.avatar_url}
        alt="Avatar"
        style={{ width: 100, height: 100 }}
      />
      <p>
        <a href={data.html_url} target="_blank" rel="noopener noreferrer">
          {data.login}
        </a>
      </p>
      <p>Public Repos: {data.public_repos}</p>
      <p>Followers: {data.followers}</p>
      <p>Following: {data.following}</p>
    </div>
  );
};

export default GithubPage;
