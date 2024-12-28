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
import {validateTurnstileResponse} from "@/backend/turnstile";
import {createProjectIssue, getProject} from "@/backend/issues/issues";
import {isIPRestricted, restrictIP} from "@/backend/ipRestrict";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {project: projectId} = req.query as { project: string };
    const {token, title, body} = req.body;

    if (!projectId || isNaN(Number(projectId))) {
        res.status(400).send({'error': `Invalid project ID`});
        return;
    }

    if (!token || !title || !body) {
        res.status(400).json({'error': 'Missing parameters'});
        return;
    }

    if (typeof token !== "string" || typeof title !== 'string' || typeof body !== 'string') {
        res.status(400).json({'error': "Invalid types of elements given to the endpoint."});
        return;
    }

    if (title.length < 4 || title.length > 32) {
        res.status(400).json({'error': `Title not in range of 4 and 32, instead it was ${title.length}`});
        return;
    }

    if (body.length < 4 || body.length > 4000) {
        res.status(400).json({'error': `Body not in range of 4 and 4000, instead it was ${body.length}`});
        return;
    }

    if (!(await validateTurnstileResponse(req, token))) {
        res.status(400).json({'error': "Turnstile error"});
        return;
    }

    const clientIp = ((req.headers['x-forwarded-for'] || '') as string).split(',').pop()?.trim() ||
        req.socket.remoteAddress;
    if (!clientIp) {
        res.status(500).json({'error': 'Internal server error when getting IP address'});
        return;
    }

    if (await isIPRestricted(clientIp)) {
        res.status(403).json({'error': 'Rate limited'});
        return;
    }

    await restrictIP(clientIp);

    const project = await getProject(Number(projectId));
    if (!project) {
        res.status(400).json({'error': `Invalid project ID`});
        return;
    }

    if (project.privacy === "Private" || !project.allowIssues) {
        res.status(400).json({'error': `Project does not allow creating issues`});
        return;
    }

    const projectURL = await createProjectIssue(Number(projectId), title, body);

    if (!projectURL) {
        res.status(400).json({'error': `Internal error while creating issue on project.`});
        return;
    }

    res.status(201).json({'success': true, 'message': 'Issue was created', 'issueURL': projectURL});
}
