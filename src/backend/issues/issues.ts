import {
    createGitlabIssue,
    getAllGitLabProjects,
    getGitLabProject,
    getGitLabProjectIssues
} from "@/backend/issues/gitlab/projects";
import {createGitHubIssue, getAllGitHubProjects, getGitHubProject} from "@/backend/issues/github/projects";
import {createForgejoIssue, getAllForgejoProjects, getForgejoProject} from "@/backend/issues/forgejo/projects";
import {Project, ProjectBase, ProjectPrivacy} from "@/types/project";
import {Issue} from "@/types/issue";
import {IssueType} from "@/types/general";
import sql from "@/backend/db/postgres";

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
    let projects: ProjectBase[] = [];
    let projects2: Project[] = [];
    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            projects = await getAllGitLabProjects();
            break;
        case "github":
            projects = await getAllGitHubProjects();
            break;
        case "forgejo":
            projects = await getAllForgejoProjects();
            break;
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }

    for (const project of projects) {
        const rows = await sql`select visibility_type, allow_issues
                                   from projects
                                   where id = ${project.id}`;

        if (rows.length > 0) {
            let privacy: ProjectPrivacy = 'Private';
            if (rows[0]['visibility_type'] === 1) privacy = "Unlisted";
            if (rows[0]['visibility_type'] === 2) privacy = "Public";
            projects2.push({...project, privacy, allowIssues: rows[0]['allow_issues'] === 1});
            continue;
        }

        projects2.push({...project, privacy: 'Private', allowIssues: false});
    }

    return projects2;
}

export async function getProject(id: number): Promise<Project | null> {
    let projectBase: ProjectBase | null = null;

    switch (process.env.ISSUE_TYPE) {
        case "gitlab":
            projectBase = await getGitLabProject(id);
            break;
        case "github":
            projectBase = await getGitHubProject(id);
            break;
        case"forgejo":
            projectBase = await getForgejoProject(id);
            break;
        default:
            throw new Error(`Invalid ISSUE_TYPE: ${process.env.ISSUE_TYPE}`);
    }

    if (!projectBase) {
        return null;
    }

    const rows = await sql`select visibility_type, allow_issues
                                   from projects
                                   where id = ${projectBase.id}`;

    if (rows.length > 0) {
        let privacy: ProjectPrivacy = 'Private';
        if (rows[0]['visibility_type'] === 1) privacy = "Unlisted";
        if (rows[0]['visibility_type'] === 2) privacy = "Public";
        return {...projectBase, privacy, allowIssues: rows[0]['allow_issues'] === 1};
    }

    return {...projectBase, privacy: 'Private', allowIssues: false};
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
