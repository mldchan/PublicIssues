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
import {getAllProjects} from "@/backend/issues/issues";
import ReactMarkdown from "react-markdown";
import scopedStyles from '@/styles/scoped.module.css';
import remarkGfm from "remark-gfm";
import {getValue} from "@/backend/db/keyValueStore";
import {ensureDatabase} from "@/backend/users/admin";
import Head from "next/head";
import Metadata from "@/components/Metadata";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    await ensureDatabase();

    const projects = await getAllProjects();

    return {
        props: {
            projects: projects.filter(x => x.privacy === "Public"),
            title: await getValue("instTitle"),
            description: await getValue("instDescription"),
            meta: {
                name: await getValue("indexMetaTitle"),
                description: await getValue("indexMetaDescription"),
                author: await getValue("indexMetaAuthor"),
                siteName: await getValue("indexMetaSiteName"),
                domain: await getValue("domain")
            }
        }
    }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main>
            <Head>
                <Metadata name={props.meta.name}
                          description={props.meta.description}
                          domain={props.meta.domain}
                          author={props.meta.author}
                          siteName={props.meta.siteName}/>
            </Head>

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
