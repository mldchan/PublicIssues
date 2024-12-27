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
