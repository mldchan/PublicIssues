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
import {Project} from "@/types/project";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import scopedStyles from "@/styles/scoped.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    getProjects,
    ProjectUpdateStatus,
    setAllowIssues,
    setVisibility,
    updateProjects
} from "@/frontend/admin/projects";


export default function ProjectList() {
    const [projects, setProjects] = useState<(Project & ProjectUpdateStatus)[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const hasGot = useRef(false);

    useEffect(() => {
        if (hasGot.current) return;
        hasGot.current = true;

        getProjects().then(x => {
            if (x.status) {
                setProjects(x.projects!)
            } else {
                setError(x.error!)
            }

            setLoading(false);
        });
    }, []);

    if (loading) return <>
        <p>Fetching projects from the desired issue provider...</p>
    </>;

    if (error) return <>
        <p>{error}</p>
    </>

    return <>
        {projects.map((project) => {
            const changeProjectVisibility = async (e: ChangeEvent<HTMLSelectElement>) => {
                let visibility = Number(e.target.value);

                const status = await setVisibility(project.id, visibility);
                setProjects(updateProjects(projects, project.id, status ? 'updVisibilitySuccess' : 'updVisibilityFail'));
            }

            const changeProjectAllowIssues = async (e: ChangeEvent<HTMLInputElement>) => {
                let allowIssue = e.target.checked;

                const status = await setAllowIssues(project.id, allowIssue);
                setProjects(updateProjects(projects, project.id, status ? 'updAllowSucess' : 'updAllowFail'));
            }

            let privacy = 0;
            switch (project.privacy) {
                case "Unlisted":
                    privacy = 1;
                    break;
                case "Public":
                    privacy = 2;
                    break;
            }

            return <div className={scopedStyles.project} key={project.id}>
                <h1>{project.usernameSlug} / {project.projectName}</h1>
                <ReactMarkdown children={project.shortDescription} remarkPlugins={[remarkGfm]}
                               disallowedElements={["headers"]}/>
                <label htmlFor='privacy'>Privacy:</label>
                <select className='w-1/3' onChange={changeProjectVisibility} value={privacy}>
                    <option value={0}>Private</option>
                    <option value={2}>Public</option>
                    <option value={1}>Unlisted</option>
                </select>
                {project.status && project.status === "updVisibilitySuccess" &&
                    <span className='text-green-600'>success!</span>}
                {project.status && project.status === "updVisibilityFail" &&
                    <span className='text-red-600'>error while saving!</span>}

                <br/>
                <label htmlFor='allow'>Allow Issues:</label>
                <input type="checkbox" checked={project.allowIssues} onChange={changeProjectAllowIssues}/>

                {project.status && project.status === "updAllowSucess" &&
                    <span className='text-green-600'>success!</span>}
                {project.status && project.status === "updAllowFail" &&
                    <span className='text-red-600'>error while saving!</span>}
            </div>
        })}
    </>

}
