/*
 * Public Issues allows creating issues on most repo software. Great for self hosts.
 * Copyright (C) 2024  エムエルディーちゃん mldchan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {NextApiRequest, NextApiResponse} from "next";
import {checkPassword, ensureDatabase, generateToken} from "@/backend/users/admin";
import {validateTurnstileResponse} from "@/backend/turnstile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ensureDatabase();

    const {username, password, token} = req.body;

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
