import Image from "next/image";
import ComparisonChart from "@/app/components/ComparsionChart";
import { fetchGitHubUser } from "@/app/api/github";

interface ComparePageProps {
    searchParams: { user1: string; user2: string };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const { user1, user2 } = searchParams;

    const [user1Data, user2Data] = await Promise.all([
        fetchGitHubUser(user1),
        fetchGitHubUser(user2),
    ]);

    const chartData = [
        {
            name: "Public Repos",
            user1: user1Data.public_repos,
            user2: user2Data.public_repos,
        },
        {
            name: "Followers",
            user1: user1Data.followers,
            user2: user2Data.followers,
        },
        {
            name: "Following",
            user1: user1Data.following,
            user2: user2Data.following,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
                    Compare {user1} vs {user2}
                </h1>
                <div className="grid gap-8 md:grid-cols-2">
                    {/* User 1 */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <Image
                                src={user1Data.avatar_url}
                                alt={`${user1}'s avatar`}
                                width={80}
                                height={80}
                                className="rounded-full mr-4 border-2 border-blue-500 dark:border-blue-400"
                            />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {user1Data.login}
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Followers: {user1Data.followers} | Repos: {user1Data.public_repos}
                        </p>
                    </div>
                    {/* User 2 */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <Image
                                src={user2Data.avatar_url}
                                alt={`${user2}'s avatar`}
                                width={80}
                                height={80}
                                className="rounded-full mr-4 border-2 border-green-500 dark:border-green-400"
                            />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {user2Data.login}
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Followers: {user2Data.followers} | Repos: {user2Data.public_repos}
                        </p>
                    </div>
                </div>
                {/* Chart */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Metrics Comparison
                    </h2>
                    <ComparisonChart
                        data={chartData}
                        user1Name={user1}
                        user2Name={user2}
                    />
                </div>
            </div>
        </div>
    );
}