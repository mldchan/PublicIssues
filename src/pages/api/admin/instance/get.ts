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
import {checkToken, ensureDatabase} from "@/backend/users/admin";
import {getValue} from "@/backend/db/keyValueStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {token} = req.body as {
        token: string;
    };

    if (token === undefined) {
        return res.status(401).send({
            error: "Token not provided",
        });
    }

    await ensureDatabase();

    if (!await checkToken(token)) {
        return res.status(401).send({
            error: "Authentication failed",
        })
    }

    await ensureDatabase();

    res.status(200).send({
        title: await getValue("instTitle"),
        description: await getValue("instDescription"),
        meta: {
            index: {
                title: await getValue("indexMetaTitle"),
                description: await getValue("indexMetaDescription"),
                author: await getValue("indexMetaAuthor"),
                siteName: await getValue("indexMetaSiteName"),
            },
            project: {
                title: await getValue("projectMetaTitle"),
                description: await getValue("projectMetaDescription"),
                author: await getValue("projectMetaAuthor"),
                siteName: await getValue("projectMetaSiteName")
            },
            domain: await getValue("domain")
        }
    });
}
