import {Project} from "@/types/project";
import {forgejoApi} from "forgejo-js";
import { fetch } from 'cross-fetch';

export async function getAllForgejoProjects(): Promise<Project[]> {
    const api = forgejoApi(process.env.FORGEJO_INSTANCE ?? 'https://codeberg.org/', {
        token: process.env.FORGEJO_TOKEN!,
        customFetch: fetch
    });

    const user = await api.user.userGetCurrent();
    if (!user.ok) return [];

    const repos = await api.user.userCurrentListRepos();
    if (!repos.ok) return [];

    return repos.data.map(x => {
        return {
            id: x.id ?? -1,
            usernameSlug: user.data.login_name ?? 'undefined',
            projectName: x.name ?? x.full_name ?? 'undefined',
            privacy: x.private ? 'Private' : 'Public',
            shortDescription: x.description ?? 'undefined'
        }
    });
}

export async function getForgejoProject(id: number): Promise<Project | null> {
    const api = forgejoApi(process.env.FORGEJO_INSTANCE ?? 'https://codeberg.org/', {
        token: process.env.FORGEJO_TOKEN!,
        customFetch: fetch
    });

    const user = await api.user.userGetCurrent();
    if (!user.ok) return null;

    const repos = await api.user.userCurrentListRepos();
    if (!repos.ok) return null;

    const repo = repos.data.find(x => x.id === id);
    if (!repo) return null;

    return  {
        id,
        projectName: repo.name ?? 'undefined',
        shortDescription: repo.description ?? 'undefined',
        privacy: repo.private ? 'Private' : 'Public',
        usernameSlug: user.data.login_name ?? 'undefined'
    }
}

export async function createForgejoIssue(id: number, title: string, body: string): Promise<string | null> {
    const api = forgejoApi(process.env.FORGEJO_INSTANCE ?? 'https://codeberg.org/', {
        token: process.env.FORGEJO_TOKEN!,
        customFetch: fetch
    });

    const user = await api.user.userGetCurrent();
    if (!user.ok) return null;
    if (!user.data) return null;
    if (!user.data.login_name) return null;

    const repos = await api.user.userCurrentListRepos();
    if (!repos.ok) return null;

    const repo = repos.data.find(x => x.id === id);
    if (!repo) return null;
    if (!repo.name) return null;

    const issue = await api.repos.issueCreateIssue(user.data.login_name, repo.name, {
        title: title,
        body: body
    });

    return issue.data.url ?? null;
}
