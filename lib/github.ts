export interface GitHubProfileData {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepoData {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  updated_at: string;
  topics: string[];
}

export interface FormattedGitHubResult {
  summaryString: string;
  profile: GitHubProfileData;
  repos: GitHubRepoData[];
}

export async function fetchGitHubSummary(username: string): Promise<FormattedGitHubResult> {
  const cleanUsername = username.trim().replace(/^@/, '').replace(/https?:\/\/github\.com\//, '').replace(/\/$/, '');

  if (!cleanUsername) {
    throw new Error('Please enter a valid GitHub username.');
  }

  // 1. Fetch user profile
  const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (userRes.status === 404) {
    throw new Error(`GitHub user "${cleanUsername}" does not exist. Please check the spelling.`);
  }

  if (userRes.status === 403) {
    throw new Error('GitHub API rate limit exceeded. Please wait a minute or upload a resume PDF instead.');
  }

  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub profile for "${cleanUsername}" (${userRes.statusText})`);
  }

  const profile: GitHubProfileData = await userRes.json();

  // 2. Fetch top/recent repos
  const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=15`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  let repos: GitHubRepoData[] = [];
  if (reposRes.ok) {
    const rawRepos = await reposRes.json();
    repos = rawRepos.map((r: any) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count || 0,
      forks_count: r.forks_count || 0,
      fork: !!r.fork,
      updated_at: r.updated_at,
      topics: r.topics || [],
    }));
  }

  // 3. Format into a rich summary string for roasting
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const forkedReposCount = repos.filter((r) => r.fork).length;
  const originalRepos = repos.filter((r) => !r.fork);
  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean)));

  const repoListFormatted = repos.slice(0, 10).map((r, i) => {
    return `${i + 1}. ${r.name} ${r.fork ? '(FORKED)' : '(ORIGINAL)'}
   - Language: ${r.language || 'None specified'} | Stars: ${r.stargazers_count} | Forks: ${r.forks_count}
   - Description: ${r.description || 'No description provided'}
   - Topics: ${r.topics.length ? r.topics.join(', ') : 'None'}`;
  }).join('\n');

  const summaryString = `
GITHUB PROFILE ROAST DATA:
- Username: @${profile.login}
- Name: ${profile.name || 'Not provided'}
- Bio: "${profile.bio || 'No bio written'}"
- Location: ${profile.location || 'Not provided'}
- Company/College: ${profile.company || 'Not provided'}
- Public Repositories: ${profile.public_repos}
- Followers: ${profile.followers} | Following: ${profile.following}
- Account Age: Member since ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
- Total Stars across sampled repos: ${totalStars}
- Forked Repos in sample: ${forkedReposCount} out of ${repos.length}
- Primary Languages Detected: ${languages.join(', ') || 'None'}

RECENT & TOP REPOSITORIES:
${repoListFormatted || 'No public repositories found.'}
`.trim();

  return {
    summaryString,
    profile,
    repos,
  };
}
