import {ProjectBase} from "@/types/project";
import {Octokit} from "@octokit/rest";

export async function getAllGitHubProjects(): Promise<ProjectBase[]> {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    const {data: user} = await octokit.users.getAuthenticated();

    const {data: projects} = await octokit.repos.listForUser({
        username: user.login
    })

    return projects.map(x => {
        return {
            id: x.id,
            usernameSlug: user.login,
            projectName: x.name,
            shortDescription: x.description ?? ''
        }
    })
}

export async function getGitHubProject(id: number): Promise<ProjectBase | null> {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    const {data: user} = await octokit.users.getAuthenticated();
    const {data: projects} = await octokit.repos.listForUser({
        username: user.login
    });

    const project = projects.find(x => x.id === id);
    if (!project) return null;

    return {
        id: project.id,
        usernameSlug: user.login,
        projectName: project.name,
        shortDescription: ""
    }
}

export async function createGitHubIssue(id: number, title: string, body: string) {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    const {data: user} = await octokit.users.getAuthenticated();
    const {data: projects} = await octokit.repos.listForUser({
        username: user.login
    });

    const project = projects.find(x => x.id === id);
    if (!project) return null;

    const {data: issue} = await octokit.issues.create({
        owner: user.login,
        repo: project.name,
        title: title,
        body: body
    })

    return issue.html_url;
}
