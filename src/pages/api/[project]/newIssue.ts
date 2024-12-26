import {NextApiRequest, NextApiResponse} from "next";
import {validateTurnstileResponse} from "@/backend/turnstile";
import {createProjectIssue} from "@/backend/issueManagement";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {project} = req.query as {project: string};
    const {token, title, body} = req.body;

    if (!project || isNaN(Number(project))) {
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

    if (!(await validateTurnstileResponse(token))) {
        res.status(400).json({'error': "Turnstile error"});
        return;
    }

    const projectURL = await createProjectIssue(Number(project), title, body);

    if (!projectURL) {
        res.status(400).json({'error': `Internal error while creating issue on project.`});
        return;
    }

    res.status(201).json({'success': true, 'message': 'Issue was created', 'issueURL': projectURL});
}
