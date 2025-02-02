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

import sql from "@/backend/db/postgres";

export async function restrictIP(ip: string): Promise<void> {
    await sql`insert into ip_restrict(ip_addr)
              values (${ip})`;
}

export async function isIPRestricted(ip: string): Promise<boolean> {

    await sql`delete
              from ip_restrict
              where now() > restrict_expire`;

    const a = await sql`select ip_addr
                        from ip_restrict
                        where ip_addr = ${ip}`;

    return a.length > 0;
}
