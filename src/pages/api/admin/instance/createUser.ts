import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, newUser} from "@/backend/users/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token, username, password } = req.body as {
        token: string;
        username: string;
        password: string;
    };

    if (token === undefined || username === undefined || password === undefined) {
        return res.status(401).send({
            error: "Token not provided",
        });
    }

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    const user1 = await newUser(username, password);

    if (user1) {
        return res.status(204).end();
    } else {
        return res.status(401).send({
            error: 'Creating user failed'
        })
    }
}
