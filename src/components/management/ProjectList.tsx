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

            return <div className={scopedStyles.project} key={project.id}>
                <h1>{project.usernameSlug} / {project.projectName}</h1>
                <ReactMarkdown children={project.shortDescription} remarkPlugins={[remarkGfm]}
                               disallowedElements={["headers"]}/>
                <label htmlFor='privacy'>Privacy:</label>
                <select className='w-1/3' onChange={changeProjectVisibility}>
                    <option value={0} selected={project.privacy === 'Private'}>Private</option>
                    <option value={2} selected={project.privacy === 'Public'}>Public</option>
                    <option value={1} selected={project.privacy === 'Unlisted'}>Unlisted</option>
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
