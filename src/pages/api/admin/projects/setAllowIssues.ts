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
import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, ensureDatabase} from "@/backend/users/admin";
import {getProject} from "@/backend/issues/issues";
import sql from "@/backend/db/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {token, projectId, allowIssues} = req.body;

    if (token === undefined || allowIssues === undefined || projectId === undefined) {
        return res.status(401).send({
            error: "Not all fields were provided",
        });
    }

    await ensureDatabase();

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

    const sqlRes = await sql`insert into projects(id, allow_issues)
                             VALUES (${projectId}, ${allowIssues})
                             on conflict (id) do update SET allow_issues = ${allowIssues}
                             returning id, visibility_type, allow_issues`;
    if (sqlRes.length === 1) {
        return res.status(204).end();
    } else {
        res.status(500).send({
            'error': 'SQL update error'
        });
    }
}
