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
import {setValue} from "@/backend/db/keyValueStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {token, newTitle, newDescription, meta} = req.body as {
        token: string;
        newTitle?: string;
        newDescription?: string;
        meta: {
            index: {
                title: string;
                description: string;
                author: string;
                siteName: string;
            },
            project: {
                title: string;
                description: string;
                author: string;
                siteName: string;
            },
            domain: string;
        }
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

    if (newTitle !== undefined) {
        await setValue("instTitle", newTitle);
    }

    if (newDescription !== undefined) {
        await setValue("instDescription", newDescription);
    }

    if (meta) {
        await setValue('indexMetaTitle', meta.index.title);
        await setValue('indexMetaDescription', meta.index.description);
        await setValue('indexMetaAuthor', meta.index.author);
        await setValue('indexMetaSiteName', meta.index.siteName);

        await setValue('projectMetaTitle', meta.project.title);
        await setValue('projectMetaDescription', meta.project.description);
        await setValue('projectMetaAuthor', meta.project.author);
        await setValue('projectMetaSiteName', meta.project.siteName);

        await setValue('domain', meta.domain);
    }

    res.status(204).end();
}
