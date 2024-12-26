import {
    createGitlabIssue,
    getAllGitLabProjects,
    getGitLabProject,
    getGitLabProjectIssues
} from "@/backend/gitlab/projects";
import {createGitHubIssue, getAllGitHubProjects, getGitHubProject} from "@/backend/github/projects";
import {createForgejoIssue, getAllForgejoProjects, getForgejoProject} from "@/backend/forgejo/projects";
import {Project} from "@/types/project";
import {Issue} from "@/types/issue";
import {IssueType} from "@/types/general";

export function getIssueManager(): IssueType {
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            return 'GitLab';
        case 'github':
            return "GitHub"
        case 'forgejo':
            return "Forgejo"
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }
}

export async function getAllProjects(): Promise<Project[]> {
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            return await getAllGitLabProjects();
        case "github":
            return await getAllGitHubProjects();
        case "forgejo":
            return await getAllForgejoProjects();
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }
}

export async function getProject(id: number): Promise<Project | null> {
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            return await getGitLabProject(id);
        case "github":
            return await getGitHubProject(id);
        case"forgejo":
            return await getForgejoProject(id);
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }
}

export async function getProjectIssues(id: number): Promise<Issue[] | null> {
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            return await getGitLabProjectIssues(id);
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }
}

export async function createProjectIssue(projID: number, title: string, body: string) {
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            return await createGitlabIssue(projID, title, body);
        case "github":
            return await createGitHubIssue(projID, title, body);
        case "forgejo":
            return await createForgejoIssue(projID, title, body);
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }
}
