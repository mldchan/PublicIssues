import {NextApiRequest, NextApiResponse} from "next";
import {checkToken} from "@/backend/users/admin";
import {getValue} from "@/backend/db/keyValueStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { token} = req.body as {
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

    res.status(200).send({
        title: await getValue("instTitle"),
        description: await getValue("instDescription")
    });
}
