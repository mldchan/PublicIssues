import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, getUsers, newUser} from "@/backend/users/admin";

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

    await newUser(username, password);
    const users = await getUsers();

    return res.status(200).json(users);
}
