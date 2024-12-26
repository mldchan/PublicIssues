import {useEffect, useRef, useState} from "react";
import {createUser, deleteUser, getSettings, getUsers, setSettings} from "@/frontend/admin/instance";


export default function InstanceSettings() {

    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [users, setUsers] = useState<string[]>([]);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userLoading, setUserLoading] = useState(false);
    const [userSuccess, setUserSuccess] = useState(false);
    const [userError, setUserError] = useState(false);

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
            setUserSuccess(true);
            setUsers([...users, username]);
            setUsername('');
            setPassword('');
        } else {
            setUserError(true);
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

        <hr />

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
                    const success = await deleteUser(x);
                    if (success.success) {
                        setUsers(users.filter(y => x !== y));
                    } else {
                        alert("Failed to delete user");
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

        <hr/>

        <h2>New User</h2>
        <p>Create a new user.</p>
        <label htmlFor={'username'}>Username: </label>
        <br/>
        <input type={"text"} value={username} onChange={x => setUsername(x.target.value)} disabled={userLoading} />
        <br/>
        <label htmlFor={'password'}>Password: </label>
        <br/>
        <input type={"password"} value={password} onChange={x => setPassword(x.target.value)} disabled={userLoading} />
        <br/>
        <button onClick={submitUserCreateForm} disabled={userLoading} className={'bg-blue-600 rounded-lg p-1 px-2'}>Create user</button>
    </>

}
