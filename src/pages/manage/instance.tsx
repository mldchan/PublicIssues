import {useEffect, useRef, useState} from "react";
import LogInForm from "@/components/management/LogIn";
import ProjectList from "@/components/management/ProjectList";
import InstanceSettings from "@/components/management/Instance";


export default function ManageInstance() {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const hasRan = useRef(false);

    useEffect(() => {
        if (hasRan.current) return;
        hasRan.current = true;
        if (localStorage.getItem('token')) {
            fetch('/api/admin/checkSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token')
                })
            }).then(x => {
                if (x.ok) {
                    setLoggedIn(true);
                }
            })
        }
    }, []);

    if (!loggedIn) {
        return <main>
            <LogInForm/>
        </main>
    }

    return <main>
        <h1>Instance Settings</h1>
        <a href={`/manage`}>
            <button className={'bg-blue-600 rounded-lg p-1 px-2'}>Go back</button>
        </a>
        <InstanceSettings/>
    </main>
}
