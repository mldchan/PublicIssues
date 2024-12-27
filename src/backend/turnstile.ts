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
import {NextApiRequest} from "next";

export async function validateTurnstileResponse(req: NextApiRequest, captchaToken: string): Promise<boolean> {
    if (!process.env.TURNSTILE_SECRET_KEY || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        return false;
    }

    const form = new URLSearchParams();
    form.append("secret", process.env.TURNSTILE_SECRET_KEY!);
    form.append("response", captchaToken);
    form.append("remoteip", req.headers["x-forwarded-for"] as string);

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {method: "POST", body: form},
    );

    const json = await result.json();
    console.log(json);

    return json.success;
}
