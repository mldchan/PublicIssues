import exp from "node:constants";

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

export async function createUser(username: string, password: string): Promise<{
    success: boolean
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
                resolve({success: true});
            } else {
                resolve({success: false});
            }
        }).catch(x => {
            resolve({success: false});
        })
    })
}

export async function deleteUser(username: string): Promise<{
    success: boolean
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
                resolve({success: true});
            } else {
                resolve({success: false});
            }
        }).catch(x => {
            resolve({success: false});
        })
    })
}

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
