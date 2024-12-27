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
import {useEffect, useRef, useState} from "react";
import {getSettings, setSettings} from "@/frontend/admin/instance";
import {createUser, deleteUser, getUsers} from "@/frontend/admin/users";


export default function InstanceSettings() {

    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [indexMetaTitle, setIndexMetaTitle] = useState<string>("");
    const [indexMetaDescription, setIndexMetaDescription] = useState<string>("");
    const [domain, setDomain] = useState<string>("");
    const [indexMetaAuthor, setIndexMetaAuthor] = useState<string>("");
    const [indexMetaSiteName, setIndexMetaSiteName] = useState<string>("");

    const [projectMetaTitle, setProjectMetaTitle] = useState<string>("");
    const [projectMetaDescription, setProjectMetaDescription] = useState<string>("");
    const [projectMetaAuthor, setProjectMetaAuthor] = useState<string>("");
    const [projectMetaSiteName, setProjectMetaSiteName] = useState<string>("");

    const [users, setUsers] = useState<string[]>([]);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userLoading, setUserLoading] = useState(false);
    const [createUserSuccess, setCreateUserSuccess] = useState(false);
    const [createUserError, setCreateUserError] = useState(false);
    const [deleteUserSuccess, setDeleteUserSuccess] = useState(false);
    const [deleteUserError, setDeleteUserError] = useState(false);

    const initialTitle = useRef("");
    const initialDescription = useRef("");

    const hasGot = useRef(false);

    useEffect(() => {
        if (hasGot.current) return;
        hasGot.current = true;

        Promise.all([
            getSettings().then(x => {
                if (x.success) {
                    setTitle(x.title!);
                    setDescription(x.description!);
                    initialTitle.current = x.title!;
                    initialDescription.current = x.description!;

                    setIndexMetaTitle(x.meta!.index.title);
                    setIndexMetaDescription(x.meta!.index.description);
                    setIndexMetaAuthor(x.meta!.index.author);
                    setIndexMetaSiteName(x.meta!.index.siteName);
                    setProjectMetaTitle(x.meta!.project.title);
                    setProjectMetaDescription(x.meta!.project.description);
                    setProjectMetaAuthor(x.meta!.project.author);
                    setProjectMetaSiteName(x.meta!.project.siteName);
                    setDomain(x.meta!.domain);
                }
            }),
            getUsers().then(x => {
                if (x.success) {
                    setUsers(x.users!);
                }
            })
        ]).then(r => {
            setLoading(false);
        })
    }, []);

    const saveSettings = async () => {
        await setSettings({
            newTitle: initialTitle.current !== title ? title : undefined,
            newDescription: initialDescription.current !== description ? description : undefined,
            meta: {
                index: {
                    title: indexMetaTitle,
                    description: indexMetaDescription,
                    author: indexMetaDescription,
                    siteName: indexMetaSiteName
                },
                project: {
                    title: projectMetaTitle,
                    description: projectMetaDescription,
                    author: projectMetaAuthor,
                    siteName: projectMetaSiteName
                },
                domain
            }
        });
    }

    const submitUserCreateForm = async () => {
        setUserLoading(true);

        const out = await createUser(username, password);

        if (out.success) {
            setCreateUserSuccess(true);
            setUsers([...users, username]);
            setUsername('');
            setPassword('');
        } else {
            setCreateUserError(true);
        }

        setUserLoading(false);
    }

    if (loading) return <>
        <p>Fetching projects from the desired issue provider...</p>
    </>;

    return <>
        <h1>Instance Settings</h1>

        <h2>Branding</h2>
        <p>Here you can customize your Public Issues instance.</p>

        <label htmlFor={'title'}>Title:</label>
        <br/>
        <input type={"text"} value={title} onChange={x => setTitle(x.target.value)} onBlur={saveSettings}/>
        <br/>
        <label htmlFor={'description'}>Description:</label>
        <br/>
        <input type={"text"} value={description} onChange={x => setDescription(x.target.value)} onBlur={saveSettings}/>

        <details>
            <summary>Meta configuration</summary>

            <br/>
            <label>Domain:</label>
            <br/>
            <input type={"url"} value={domain} onChange={x => setDomain(x.target.value)} onBlur={saveSettings}/>
            <br/>

            <h3>Main page</h3>
            <label>Title in embeds</label>
            <br/>
            <input type={"text"} value={indexMetaTitle} onChange={x => setIndexMetaTitle(x.target.value)}
                   onBlur={saveSettings}/>
            <br/>
            <label>Description in embeds</label>
            <br/>
            <input type={"text"} value={indexMetaDescription} onChange={x => setIndexMetaDescription(x.target.value)}
                   onBlur={saveSettings}/>
            <br/>
            <label>Author in embeds</label>
            <br/>
            <input type={"text"} value={indexMetaAuthor} onChange={x => setIndexMetaAuthor(x.target.value)}
                   onBlur={saveSettings}/>
            <br/>
            <label>Site name in embeds</label>
            <br/>
            <input type={"text"} value={indexMetaSiteName} onChange={x => setIndexMetaSiteName(x.target.value)}
                   onBlur={saveSettings}/>

            <h3>Individual project pages</h3>
            <label>Title for project (%name%, %id% get replaced)</label>
            <br/>
            <input type={"text"} value={projectMetaTitle} onChange={x => setProjectMetaTitle(x.target.value)}
                   onBlur={saveSettings}/>
            <br/>
            <label>Description for project (%name%, %id% get replaced)</label>
            <br/>
            <input type={"text"} value={projectMetaDescription}
                   onChange={x => setProjectMetaDescription(x.target.value)} onBlur={saveSettings}/>
            <br/>
            <label>Author for project (%name%, %id% get replaced)</label>
            <br/>
            <input type={"text"} value={projectMetaAuthor} onChange={x => setProjectMetaAuthor(x.target.value)}
                   onBlur={saveSettings}/>
            <br/>
            <label>Site name for project (%name%, %id% get replaced)</label>
            <br/>
            <input type={"text"} value={projectMetaSiteName} onChange={x => setProjectMetaSiteName(x.target.value)}
                   onBlur={saveSettings}/>
        </details>

        <hr/>

        <h2>Users</h2>
        <p>Here you can create additional administrators to manage this instance of Public Issues.</p>
        <table className={'w-full'}>
            <thead>
            <tr>
                <th className={'w-2/3'}>Username</th>
                <th className={'w-1/3'}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map(x => {
                const submitUserDelete = async () => {

                    setDeleteUserError(false);
                    setCreateUserSuccess(false);

                    const delUserResult = await deleteUser(x);
                    if (delUserResult.success) {
                        setUsers(delUserResult.newUsers!);
                        setDeleteUserSuccess(true);
                    } else {
                        setDeleteUserError(true);
                    }
                }

                return <tr key={x} className={'border-[1px] border-gray-700'}>
                    <td className={'w-2/3 pl-4'}>{x}</td>
                    <td className={'w-1/3 text-center'}>
                        <button className={'text-red-600'} onClick={submitUserDelete}>Delete</button>
                    </td>
                </tr>
            })}
            </tbody>
        </table>

        {deleteUserSuccess && <p className={'text-green-600'}>User successfully deleted!</p>}
        {deleteUserError && <p className={'text-red-600'}>Failed to delete user!</p>}

        <hr/>

        <h2>New User</h2>
        <p>Create a new user.</p>
        <label htmlFor={'username'}>Username: </label>
        <br/>
        <input type={"text"} value={username} onChange={x => setUsername(x.target.value)} disabled={userLoading}/>
        <br/>
        <label htmlFor={'password'}>Password: </label>
        <br/>
        <input type={"password"} value={password} onChange={x => setPassword(x.target.value)} disabled={userLoading}/>
        <br/>
        <button onClick={submitUserCreateForm} disabled={userLoading}
                className={'bg-blue-600 rounded-lg p-1 px-2'}>Create user
        </button>
        {createUserSuccess && <p className={'text-green-600'}>User was created!</p>}
        {createUserError && <p className={'text-red-600'}>Failed to create user!</p>}
    </>

}
