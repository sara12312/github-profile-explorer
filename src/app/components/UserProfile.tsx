import Image from "next/image";
import { User } from "@/app/types/github";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="bg-gray-800 shadow-xl rounded-xl p-8 flex flex-col items-center transform transition-all hover:shadow-2xl">
      <Image
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        width={150}
        height={150}
        className="rounded-full mb-4 border-4 border-blue-500 shadow-md"
      />
      <h1 className="text-2xl font-bold text-gray-100">{user.name || user.login}</h1>
      <p className="text-gray-300 mt-2 text-center">{user.bio || "No bio available"}</p>
      <div className="mt-6 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold text-gray-100">{user.public_repos}</p>
            <p className="text-gray-300">Repositories</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold text-gray-100">{user.followers}</p>
            <p className="text-gray-300">Followers</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold text-gray-100">{user.following}</p>
            <p className="text-gray-300">Following</p>
          </div>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
