import {NextApiRequest, NextApiResponse} from "next";
import {checkToken, deleteUser, newUser} from "@/backend/users/admin";

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

    const user1 = await deleteUser(username);

    if (user1) {
        return res.status(204).end();
    } else {
        return res.status(401).send({
            error: 'Deleting user failed'
        })
    }
}
