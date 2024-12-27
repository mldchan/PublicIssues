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

import {fetch} from "cross-fetch";

export async function submitIssue(projectId: number, title: string, body: string, cfToken: string): Promise<{
    status: boolean;
    error?: string;
}> {
    return new Promise((resolve) => {
        fetch(`/api/${projectId}/newIssue`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                token: cfToken,
                title: title,
                body: body
            })
        }).then(x => {
            if (x.ok) {
                resolve({status: true});

                x.json().then(x => {
                    document.location = x.issueURL;
                });
            } else {
                x.json().then(x => {
                    resolve({status: false, error: `API returned error: ${x.error}`});
                }).catch(x => {
                    resolve({status: false, error: `Unknown error: ${x.error}`});
                })
            }
        })
    })
}
