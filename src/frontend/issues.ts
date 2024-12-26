
'use client'

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
