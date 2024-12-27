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

export async function getUsers(): Promise<{
    success: boolean,
    users?: string[]
}> {
    return new Promise((resolve) => {
        fetch('/api/admin/instance/getUsers', {
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
                        users: x
                    })
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


export async function createUser(username: string, password: string): Promise<{
    success: boolean,
    newUsers?: string[]
}> {
    return new Promise((resolve) => {
        fetch('/api/admin/instance/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                username,
                password
            })
        }).then(x => {
            if (x.ok) {
                x.json().then(x => {
                    resolve({
                        success: true,
                        newUsers: x
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

export async function deleteUser(username: string): Promise<{
    success: boolean,
    newUsers?: string[]
}> {
    return new Promise((resolve) => {
        fetch('/api/admin/instance/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                username
            })
        }).then(x => {
            if (x.ok) {
                x.json().then(x => {
                    resolve({
                        success: true,
                        newUsers: x
                    })
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
