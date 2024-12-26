import {NextApiRequest, NextApiResponse} from "next";
import {checkToken} from "@/backend/users/admin";
import {getProject} from "@/backend/issues/issues";
import sql from "@/backend/db/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token, projectId, allowIssues } = req.body;

    if (token === undefined || allowIssues === undefined || projectId === undefined) {
        return res.status(401).send({
            error: "Not all fields were provided",
        });
    }

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    if (allowIssues !== 0 && allowIssues !== 1) {
        return res.status(401).send({
            error: "Invalid create value"
        })
    }

    if (isNaN(Number(projectId))) {
        return res.status(401).send({
            error: "Invalid project id"
        })
    }

    const project = await getProject(Number(projectId));
    if (!project) {
        return res.status(401).send({
            error: "Invalid project id"
        })
    }

    const sqlRes = await sql`insert into projects(id, allow_issues)VALUES (${projectId}, ${allowIssues})
                             on conflict (id) do update SET allow_issues = ${allowIssues} returning id, visibility_type, allow_issues`;
    if (sqlRes.length === 1) {
        return res.status(204).end();
    }
    else {
        res.status(500).send({
            'error': 'SQL update error'
        });
    }
}
