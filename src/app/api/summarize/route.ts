// app/api/summarize/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { User, Repo } from '@/app/types/github';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// Function to estimate token count (approximate, as tokens != characters)
function estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters (this is an approximation)
    return Math.ceil(text.length / 4);
}

export async function POST(request: Request) {
    try {
        // Check if the API token is set
        if (!HUGGING_FACE_API_TOKEN) {
            return NextResponse.json(
                { error: 'HUGGING_FACE_API_TOKEN is not set in environment variables' },
                { status: 500 }
            );
        }

        const { user, repos }: { user: User; repos: Repo[] } = await request.json();

        if (!user || !repos) {
            return NextResponse.json(
                { error: 'Invalid request body: user and repos are required' },
                { status: 400 }
            );
        }

        // Construct a comprehensive text input for summarization
        let inputText = `GitHub User Profile Summary:\n\n`;

        // Add user bio and basic info (always include this)
        inputText += `Username: ${user.login}\n`;
        inputText += `Bio: ${user.bio || 'No bio provided'}\n`;
        inputText += `Public Repositories: ${user.public_repos}\n`;
        inputText += `Followers: ${user.followers}\n`;
        inputText += `Following: ${user.following}\n\n`;

        // Sort repositories by stars (descending) to prioritize popular ones
        const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Limit to top N repositories (e.g., top 5) to manage input length
        const maxReposToInclude = 5;
        const selectedRepos = sortedRepos.slice(0, maxReposToInclude);

        // Add repository details
        inputText += `Repositories (Top ${maxReposToInclude} by Stars):\n`;
        if (selectedRepos.length === 0) {
            inputText += 'No public repositories available.\n';
        } else {
            selectedRepos.forEach((repo, index) => {
                inputText += `${index + 1}. ${repo.name}\n`;
                inputText += `   Description: ${repo.description || 'No description'}\n`;
                inputText += `   Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}, Open Issues: ${repo.open_issues_count}\n`;
            });
        }

        // Define token limit for Hugging Face API (e.g., 1024 tokens)
        const maxTokenLimit = 1024;
        const currentTokenCount = estimateTokenCount(inputText);

        // If the input text exceeds the token limit, truncate it intelligently
        if (currentTokenCount > maxTokenLimit) {
            // Calculate how many repos we can keep while staying under the limit
            let truncatedText = `GitHub User Profile Summary:\n\n`;
            truncatedText += `Username: ${user.login}\n`;
            truncatedText += `Bio: ${user.bio || 'No bio provided'}\n`;
            truncatedText += `Public Repositories: ${user.public_repos}\n`;
            truncatedText += `Followers: ${user.followers}\n`;
            truncatedText += `Following: ${user.following}\n\n`;

            let repoText = `Repositories (Top by Stars):\n`;
            let reposIncluded = 0;

            for (const repo of selectedRepos) {
                const repoEntry = `${reposIncluded + 1}. ${repo.name}\n` +
                    `   Description: ${repo.description || 'No description'}\n` +
                    `   Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}, Open Issues: ${repo.open_issues_count}\n`;

                // Check if adding this repo exceeds the token limit
                const tempText = truncatedText + repoText + repoEntry;
                if (estimateTokenCount(tempText) > maxTokenLimit) {
                    break;
                }

                repoText += repoEntry;
                reposIncluded++;
            }

            truncatedText += repoText;
            inputText = truncatedText;
        }

        // Log the input text for debugging
        console.log('Input text to Hugging Face API:', inputText);
        console.log('Estimated token count:', estimateTokenCount(inputText));

        // Call Hugging Face API for summarization
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            {
                inputs: inputText,
                parameters: { max_length: 200, min_length: 50 },
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check if the response contains the expected data
        if (!response.data || !response.data[0]?.summary_text) {
            return NextResponse.json(
                { error: 'Hugging Face API returned an unexpected response' },
                { status: 500 }
            );
        }

        const summary = response.data[0].summary_text;
        return NextResponse.json({ summary });
    } catch (error) {
        console.error('Summarization error:', error);
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || error.message;
            console.error('Hugging Face API error details:', error.response?.data);
            return NextResponse.json(
                { error: `Hugging Face API error: ${errorMessage}` },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: 'Failed to summarize profile' }, { status: 500 });
    }
}