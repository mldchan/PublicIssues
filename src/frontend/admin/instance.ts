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

export async function setSettings({newTitle, newDescription}: {
    newTitle?: string;
    newDescription?: string;
}): Promise<boolean> {
    return new Promise((resolve) => {
        fetch('/api/admin/instance/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                newTitle,
                newDescription
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

export async function getSettings(): Promise<{
    success: boolean,
    title?: string,
    description?: string
}> {
    return new Promise((resolve) => {
        fetch('/api/admin/instance/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        }).then(x => {
            if (x.ok) {
                x.json().then(x => {
                    resolve({
                        success: true,
                        title: x.title,
                        description: x.description
                    });
                }).catch(x => {
                    resolve({success: false});
                })
            } else {
                resolve({success: false});
            }
        }).catch(x => {
            resolve({success: false});
        })
    })
}