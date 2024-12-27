/*
 * Public Issues allows creating issues on most repo software. Great for self hosts.
 * Copyright (C) 2024  エムエルディーちゃん mldchan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {ProjectBase} from "@/types/project";
import {forgejoApi} from "forgejo-js";
import {fetch} from 'cross-fetch';

export async function getAllForgejoProjects(): Promise<ProjectBase[]> {
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
            shortDescription: x.description ?? 'undefined'
        }
    });
}

export async function getForgejoProject(id: number): Promise<ProjectBase | null> {
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

    return {
        id,
        projectName: repo.name ?? 'undefined',
        shortDescription: repo.description ?? 'undefined',
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
