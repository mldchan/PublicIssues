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
'use client';

import {Project} from "@/types/project";

export type ProjectUpdateStatusValues = 'updVisibilitySuccess' | 'updVisibilityFail' | 'updAllowSucess' | 'updAllowFail'

export type ProjectUpdateStatus = {
    status?: ProjectUpdateStatusValues;
}

export async function setVisibility(projectId: number, visibility: number): Promise<boolean> {
    return await new Promise((resolve) => {
        fetch('/api/admin/projects/setVisibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                projectId,
                visibility
            })
        }).then(x => {
            if (x.ok) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            resolve(false);
        });
    })
}

export async function setAllowIssues(projectId: number, allowIssue: boolean): Promise<boolean> {
    return new Promise((resolve) => {
        fetch('/api/admin/projects/setAllowIssues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                projectId,
                allowIssues: allowIssue ? 1 : 0
            })
        }).then(x => {
            if (x.ok) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            resolve(false);
        });
    });
}

export function updateProjects(projects: (Project & ProjectUpdateStatus)[], id: number, status: ProjectUpdateStatusValues) {
    return projects.map((project: Project) => {
        if (project.id === id) {
            return {...project, status: status};
        }
        return project;
    })
}

export function getProjects(): Promise<{
    status: boolean,
    projects?: (Project & ProjectUpdateStatus)[],
    error?: string
}> {
    return new Promise((resolve) => {
        fetch('/api/admin/projects/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
            })
        }).then(x => {
            if (x.ok) {
                x.json().then(x => {
                    resolve({
                        status: true,
                        projects: x
                    });
                }).catch(x => {
                    resolve({
                        status: false,
                        error: `JSON parse error: ${x}`,
                    });
                });

                return;
            }

            resolve({
                status: false,
                error: `Non-OK response: ${x.status} (${x.statusText})`
            })
        }).catch(error => {
            resolve({
                status: false,
                error: `Failed to get project list: ${error}`,
            });
        })
    })
}
