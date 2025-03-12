// app/profile/[username]/page.tsx

import { fetchGitHubUser, fetchGitHubUserRepos } from "@/app/api/github";
import UserProfile from "@/app/components/UserProfile";
import RepoList from "@/app/components/RepoList";
import { User, Repo } from "@/app/types/github";
import SummarizeButton from "@/app/components/SummarizeButton";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  try {
    const [user, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubUserRepos(username),
    ]);

    return (
      <div className="min-h-screen bg-gray-700 p-8">
        <div className="max-w-4xl mx-auto">
          <UserProfile user={user as User} />
          <SummarizeButton user={user as User} repos={repos as Repo[]} />
          <RepoList repos={repos as Repo[]} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-600">Could not find user: {username}</p>
        </div>
      </div>
    );
  }
}
