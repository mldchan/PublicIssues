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
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getProject} from "@/backend/issues/issues";
import {FormEvent, useRef, useState} from "react";
import Turnstile, {useTurnstile} from "react-turnstile";
import {submitIssue} from "@/frontend/issues";
import {ensureDatabase} from "@/backend/users/admin";
import {getValue} from "@/backend/db/keyValueStore";
import Head from "next/head";
import Metadata from "@/components/Metadata";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {project} = ctx.params as { project: string };
    if (!project) return {notFound: true};
    if (isNaN(Number(project))) return {notFound: true};

    await ensureDatabase();

    const fetchedProject = await getProject(Number(project));
    if (!fetchedProject) return {notFound: true};

    if (!fetchedProject.allowIssues) return {notFound: true};

    let title = await getValue("projectMetaTitle") as string;
    let description = await getValue("projectMetaDescription") as string;
    let author = await getValue("projectMetaAuthor") as string;
    let siteName = await getValue("projectMetaSiteName") as string;

    title = title.replace("%name%", fetchedProject.projectName);
    title = title.replace("%author%", fetchedProject.usernameSlug);
    title = title.replace("%id%", fetchedProject.id.toString());

    description = description.replace("%name%", fetchedProject.projectName);
    description = description.replace("%author%", fetchedProject.usernameSlug);
    description = description.replace("%id%", fetchedProject.id.toString());

    author = author.replace("%name%", fetchedProject.projectName);
    author = author.replace("%author%", fetchedProject.usernameSlug);
    author = author.replace("%id%", fetchedProject.id.toString());

    siteName = siteName.replace("%name%", fetchedProject.projectName);
    siteName = siteName.replace("%author%", fetchedProject.usernameSlug);
    siteName = siteName.replace("%id%", fetchedProject.id.toString());

    return {
        props: {
            project: fetchedProject,
            cfKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
            meta: {
                title, description, author, domain: await getValue("domain"), siteName
            }
        }
    }
}

export default function CreateIssue(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [issueTitle, setIssueTitle] = useState("");
    const [issueBody, setIssueBody] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formRef = useRef<HTMLFormElement>(null);

    const turnstile = useTurnstile();

    const handleForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        const token = turnstileToken;
        const issueTitle = formData.get("title");
        const issueBody = formData.get("body");

        setLoading(true);

        submitIssue(props.project.id, issueTitle?.toString() ?? '', issueBody?.toString() ?? '', token).then(x => {
            if (!x.status)
                setError(x.error!);
            setLoading(false);
        })
    }

    return <>
        <main>
            <Head>
                <Metadata name={props.meta.title}
                          description={props.meta.description}
                          domain={props.meta.domain}
                          author={props.meta.author}
                          siteName={props.meta.siteName}/>
            </Head>

            <h1>Create an issue under {props.project.projectName}</h1>
            <form ref={formRef} onSubmit={handleForm}>
                <label htmlFor="title">Issue Title</label>
                <br/>
                <input type="text" value={issueTitle} onChange={x => setIssueTitle(x.currentTarget.value)}
                       id="title" name="title" disabled={loading}/>
                <br/>
                <label htmlFor="title">Issue Body</label>
                <br/>
                <textarea value={issueBody} onChange={x => setIssueBody(x.currentTarget.value)}
                          id="body" name="body" disabled={loading}/>
                <br/>

                {error && <p className='text-red-600'>{error}</p>}
                <Turnstile sitekey={props.cfKey} retry={"auto"}
                           appearance={"always"} onVerify={x => setTurnstileToken(x)}
                />

                <button type="submit" disabled={loading || !turnstileToken}
                        className='bg-blue-600 p-2 rounded-lg'>Create the issue
                </button>
            </form>
        </main>
    </>
}
