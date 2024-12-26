import {NextApiRequest, NextApiResponse} from "next";
import {getAllProjects} from "@/backend/issues/issues";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token } = req.body;
    if (!token) {
        return res.status(401).json({'error': 'Token is missing'});
    }

    const projects = await getAllProjects();

    res.status(200).json(projects);

}
