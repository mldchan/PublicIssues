import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getAllProjects, getIssueManager} from "@/backend/issueManagement";
import ReactMarkdown from "react-markdown";
import scopedStyles from '@/styles/scoped.module.css';
import remarkGfm from "remark-gfm";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const projects = await getAllProjects();

    return {
        props: {
            projects,
            issueMngr: getIssueManager()
        }
    }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main>

            <h1>Welcome to Public Issues!</h1>
            <p>Here you can file issues on {props.issueMngr} without an account.</p>

            <hr />

            {props.projects.map(x => {
                return <div className={scopedStyles.project}>
                    <h1>{x.usernameSlug} / {x.projectName}</h1>
                    <ReactMarkdown children={x.shortDescription} remarkPlugins={[remarkGfm]} disallowedElements={["headers"]}/>
                    <p>
                        <a href={`/${x.id}`}>Open issues</a>
                        <a href={`/${x.id}/create`}>New issue</a>
                    </p>
                </div>
            })}
        </main>
    );
}
