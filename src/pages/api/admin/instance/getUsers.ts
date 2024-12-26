import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, deleteUser, getUsers, newUser} from "@/backend/users/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token } = req.body as {
        token: string;
    };

    if (token === undefined) {
        return res.status(401).send({
            error: "Token not provided",
        });
    }

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    const users = await getUsers();

    res.status(200).json(users);

}
