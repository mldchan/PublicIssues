import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, ensureDatabase} from "@/backend/users/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ensureDatabase();

    const { token } = req.body;

    if (!token) {
        res.status(401).send({'error': 'Invalid token'});
    }

    if (await checkToken(token)) {
        res.status(204).end();
    }
    else {
        res.status(401).send({'error': 'Invalid token'});
    }
}
