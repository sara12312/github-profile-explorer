// app/components/RepoList.tsx
import { Repo } from "@/app/types/github";

interface RepoListProps {
  repos: Repo[];
}

export default function RepoList({ repos }: RepoListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Repositories</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {repos.map((repo) => (
          <div key={repo.id} className="bg-gray-600 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:underline"
              >
                {repo.name}
              </a>
            </h3>
            <p className="text-gray-200">
              {repo.description || "No description"}
            </p>
            <div className="mt-2 text-sm text-gray-100">
              <span>⭐ {repo.stargazers_count} </span>
              <span>🍴 {repo.forks_count} </span>
              <span>📖 {repo.open_issues_count} open issues</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
