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
            newDescription: initialDescription.current !== description ? description : undefined
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
