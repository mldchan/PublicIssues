import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getProject, getProjectIssues} from "@/backend/issues/issues";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {project} = ctx.params as { project: string };
    if (!project) return {notFound: true};
    if (isNaN(Number(project))) return {notFound: true};

    const fetchedProject = await getProject(Number(project));
    if (!fetchedProject) return {notFound: true};

    if (fetchedProject.privacy === "Private") return {notFound: true};

    const fetchedIssues = await getProjectIssues(Number(project));
    if (!fetchedIssues) return {notFound: true};

    return {
        props: {
            project: fetchedProject,
            issues: fetchedIssues
        }
    }
}

export default function Project(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <main>
        <h1>Project: {props.project.projectName}</h1>
        {props.project.allowIssues && <>
            <h2>Create a new issue:</h2>
            <p>You can fill out a form on this project in order to submit an issue.</p>
            <p>
                <a href={`/${props.project.id}/create`}>
                    <button className={'bg-blue-600 p-1 px-2 rounded-lg'}>New issue</button>
                </a>
            </p>
        </>}
        <hr/>
        <h2>{props.project.allowIssues ? 'Existing issues:' : 'Issues:'}</h2>
        {props.issues.length === 0 && <p>No issues yet...</p>}
        {props.issues.map((x, i) => {
            return <div key={i} className={'p-2 border-2 border-white m-2 rounded-lg'}>
                <h3 className={'text-xl font-bold'}>{x.title}</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={x.description} />
            </div>
        })}
    </main>
}
