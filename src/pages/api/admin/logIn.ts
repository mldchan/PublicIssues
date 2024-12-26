import {NextApiRequest, NextApiResponse} from "next";
import {checkPassword, ensureDatabase, generateToken} from "@/backend/users/admin";
import {validateTurnstileResponse} from "@/backend/turnstile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ensureDatabase();

    const { username, password, token } = req.body;

    if (!username || !password || !token) {
        res.status(400).send({'error': 'Username or Password is required'});
        return;
    }

    if (!await validateTurnstileResponse(token)) {
        res.status(400).send({'error': 'Turnstile failed to validate you'});
        return;
    }

    if (!await checkPassword(username, password)) {
        res.status(401).send({'error': 'Invalid username or password'});
        return;
    }


    const userToken = await generateToken(username);


    if (!userToken) {
        res.status(401).send({'error': 'Invalid username or password'});
    }

    res.status(200).send({'token': userToken});
}
