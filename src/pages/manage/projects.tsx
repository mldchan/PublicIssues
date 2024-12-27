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
import LogInForm from "@/components/management/LogIn";
import ProjectList from "@/components/management/ProjectList";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return {
        props: {
            cfKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!
        }
    }
}

export default function ManageProjects(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <LogInForm cfKey={props.cfKey}/>
        </main>
    }

    return <main>
        <h1>Project Management</h1>
        <a href={`/manage`}>
            <button className={'bg-blue-600 rounded-lg p-1 px-2'}>Go back</button>
        </a>
        <ProjectList/>
    </main>
}
