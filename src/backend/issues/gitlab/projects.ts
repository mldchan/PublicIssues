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

    const issues = await gitlab.Issues.all({projectId: id});

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
