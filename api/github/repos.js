export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  try {
    const response = await fetch('https://api.github.com/users/pranav1237/repos?per_page=100&sort=updated&type=owner', {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
    });
    if (!response.ok) throw new Error('GitHub API returned ' + response.status);
    const repositories = await response.json();
    const items = repositories
      .filter(repo => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        title: repo.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
        description: repo.description || 'Explore the source code and project details on GitHub.',
        url: repo.html_url,
        language: repo.language || 'SOFTWARE',
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        homepage: repo.homepage || null
      }));
    return res.status(200).json({ items, updatedAt: new Date().toISOString(), source: 'github' });
  } catch (error) {
    console.error('GitHub projects sync failed:', error);
    return res.status(502).json({ error: 'Unable to sync GitHub projects right now.' });
  }
}
