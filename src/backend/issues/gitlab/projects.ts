import {Gitlab} from "@gitbeaker/rest";
import {ProjectBase} from "@/types/project";
import {Issue} from "@/types/issue";

export async function getAllGitLabProjects(): Promise<ProjectBase[]> {
    const gitlab = new Gitlab({
        host: process.env.GITLAB_INSTANCE ?? 'https://gitlab.com',
        token: process.env.GITLAB_TOKEN!
    });

    const projects = await gitlab.Projects.all();

    return projects.map(x => {
        return {
            id: x.id,
            usernameSlug: x.namespace.name,
            projectName: x.name,
            shortDescription: x.description,
        }
    })
}

export async function getGitLabProject(id: number): Promise<ProjectBase> {
    const gitlab = new Gitlab({
        host: process.env.GITLAB_INSTANCE ?? 'https://gitlab.com',
        token: process.env.GITLAB_TOKEN!
    });

    const project = await gitlab.Projects.show(id);

    return {
        id: project.id,
        usernameSlug: project.namespace.name,
        projectName: project.name,
        shortDescription: project.description,
    }
}

export async function getGitLabProjectIssues(id: number): Promise<Issue[]> {
    const gitlab = new Gitlab({
        host: process.env.GITLAB_INSTANCE ?? 'https://gitlab.com',
        token: process.env.GITLAB_TOKEN!
    });

    const issues = await gitlab.Issues.all({ projectId: id });

    return issues.map(x => {
        return {
            title: x.title,
            description: x.description
        }
    })
}

export async function createGitlabIssue(id: number, title: string, body: string): Promise<string> {
    const gitlab = new Gitlab({
        host: process.env.GITLAB_INSTANCE ?? 'https://gitlab.com',
        token: process.env.GITLAB_TOKEN!
    });

    const issue = await gitlab.Issues.create(id, title, {
        description: body
    });

    return issue.web_url;
}
