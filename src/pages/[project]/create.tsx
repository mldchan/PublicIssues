import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getProject} from "@/backend/issueManagement";
import {FormEvent, useRef, useState} from "react";
import {Turnstile} from "next-turnstile";
import {fetch} from "cross-fetch";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {project} = ctx.params as { project: string };
    if (!project) return {notFound: true};
    if (isNaN(Number(project))) return {notFound: true};

    const fetchedProject = await getProject(Number(project));
    if (!fetchedProject) return {notFound: true};

    return {
        props: {
            project: fetchedProject
        }
    }
}

export default function CreateIssue(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [issueTitle, setIssueTitle] = useState("");
    const [issueBody, setIssueBody] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formRef = useRef<HTMLFormElement>(null);


    const handleForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        const token = formData.get("cf-turnstile-response");
        const issueTitle = formData.get("title");
        const issueBody = formData.get("body");

        setLoading(true);

        fetch(`/api/${props.project.id}/newIssue`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                token: token?.toString() ?? '',
                title: issueTitle?.toString() ?? '',
                body: issueBody?.toString() ?? ''
            })
        }).then(x => {
            if (x.ok) {
                setLoading(false);

                x.json().then(x => {
                    document.location = x.issueURL;
                });
            } else {
                setLoading(false);

                x.json().then(x => {
                    setError(`API returned error: ${x.error}`);
                }).catch(x => {
                    setError(`Unknown error: ${x}`);
                })
            }
        })
    }

    return <>
        <main>
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
                <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} retry={"auto"} refreshExpired={"auto"}
                           sandbox={process.env.NODE_ENV === "development"}/>

                <button type="submit" disabled={loading} className='bg-blue-600 p-2 rounded-lg'>Create the issue</button>
            </form>
        </main>
    </>
}
