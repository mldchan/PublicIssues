import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getAllProjects, getIssueManager} from "@/backend/issues/issues";
import ReactMarkdown from "react-markdown";
import scopedStyles from '@/styles/scoped.module.css';
import remarkGfm from "remark-gfm";
import {getValue} from "@/backend/db/keyValueStore";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const projects = await getAllProjects();

    return {
        props: {
            projects: projects.filter(x => x.privacy === "Public"),
            title: await getValue("instTitle"),
            description: await getValue("instDescription")
        }
    }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main>

            <h1>{props.title}</h1>
            <p>{props.description}</p>

            <hr/>

            {props.projects.map(x => {
                return <div className={scopedStyles.project} key={x.id}>
                    <h1>{x.usernameSlug} / {x.projectName}</h1>
                    <ReactMarkdown children={x.shortDescription} remarkPlugins={[remarkGfm]}
                                   disallowedElements={["headers"]}/>
                    <p>
                        <a href={`/${x.id}`}>Open issues</a>
                        {x.allowIssues && <a href={`/${x.id}/create`}>New issue</a>}
                    </p>
                </div>
            })}
        </main>
    );
}
