import {NextApiRequest, NextApiResponse} from "next";
import {checkToken} from "@/backend/users/admin";
import {getProject} from "@/backend/issues/issues";
import sql from "@/backend/db/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token, projectId, visibility } = req.body;

    if (token === undefined || visibility === undefined || projectId === undefined) {
        return res.status(401).send({
            error: "Not all fields were provided",
        });
    }

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    if (visibility !== 0 && visibility !== 1 && visibility !== 2) {
        return res.status(401).send({
            error: "Invalid visibility"
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

    const sqlRes = await sql`insert into projects(id, visibility_type) VALUES (${projectId}, ${visibility}) 
                                          on conflict (id) do update SET visibility_type = ${visibility} returning id, visibility_type, allow_issues`;
    if (sqlRes.length === 1) {
        return res.status(204).end();
    }
    else {
        res.status(500).send({
            'error': 'SQL update error'
        });
    }
}
