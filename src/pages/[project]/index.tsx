import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getProject, getProjectIssues} from "@/backend/issueManagement";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {project} = ctx.params as { project: string };
    if (!project) return {notFound: true};
    if (isNaN(Number(project))) return {notFound: true};

    const fetchedProject = await getProject(Number(project));
    if (!fetchedProject) return {notFound: true};

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
        <h2>Issues:</h2>
        {props.issues.length === 0 && <p>No issues yet...</p>}
        {props.issues.map(x => {
            return <>
                <h3>{x.title}</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={x.description} />
            </>
        })}
    </main>
}
