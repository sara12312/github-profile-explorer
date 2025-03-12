// defining API functions to fetch GitHub user data and repositories.

export async function fetchGitHubUser(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
            Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return response.json();
}

export async function fetchGitHubUserRepos(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
        throw new Error('Repositories not found');
    }

    return response.json();
}