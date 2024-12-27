import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, deleteUser, getUsers, newUser} from "@/backend/users/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token, username } = req.body as {
        token: string;
        username: string;
    };

    if (token === undefined || username === undefined) {
        return res.status(401).send({
            error: "Token not provided",
        });
    }

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    if (username === process.env.ADMIN_USERNAME) {
        return res.status(401).send({
            error: "Can't delete default admin user"
        })
    }

    await deleteUser(username);
    const users = await getUsers();

    return res.status(200).json(users);
}
