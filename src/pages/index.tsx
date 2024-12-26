import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getAllProjects, getIssueManager} from "@/backend/issues/issues";
import ReactMarkdown from "react-markdown";
import scopedStyles from '@/styles/scoped.module.css';
import remarkGfm from "remark-gfm";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const projects = await getAllProjects();

    return {
        props: {
            projects: projects.filter(x => x.privacy === "Public"),
            issueMngr: getIssueManager()
        }
    }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main>

            <h1>Welcome to Public Issues!</h1>
            <p>Here you can file issues on {props.issueMngr} without an account.</p>

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
