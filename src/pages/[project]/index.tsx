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
import {getProject, getProjectIssues} from "@/backend/issues/issues";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {ensureDatabase} from "@/backend/users/admin";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {project} = ctx.params as { project: string };
    if (!project) return {notFound: true};
    if (isNaN(Number(project))) return {notFound: true};

    await ensureDatabase();

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
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={x.description}/>
            </div>
        })}
    </main>
}
