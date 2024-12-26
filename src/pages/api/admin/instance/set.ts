import {NextApiRequest, NextApiResponse} from "next";
import {checkToken} from "@/backend/users/admin";
import {setValue} from "@/backend/db/keyValueStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token, newTitle, newDescription } = req.body as {
        token: string;
        newTitle?: string;
        newDescription?: string;
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

    if (newTitle !== undefined) {
        await setValue("instTitle", newTitle);
    }

    if (newDescription !== undefined) {
        await setValue("instDescription", newDescription);
    }

    res.status(204).end();
}
