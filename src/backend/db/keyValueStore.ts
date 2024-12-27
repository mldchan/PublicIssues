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

export async function setValue(key: string, value: string) {
    const a = await sql`insert into kv_store(key, value)
                        values (${key}, ${value})
                        on conflict (key) do update set value = ${value}
                        returning key, value`;
    return a.length === 1
}

export async function getValue(key: string) {
    const a = await sql`select value
                        from kv_store
                        where key = ${key}`;
    if (a.length === 0) return null;
    return a[0].value;
}

export async function hasValue(key: string) {
    const a = await sql`select value
                        from kv_store
                        where key = ${key}`;
    return a.length === 1
}

export async function deleteValue(key: string) {
    const a = await sql`delete
                        from kv_store
                        where key = ${key}`;
    return a.length === 1
}

export async function defaultValue(key: string, value: string) {
    await sql`insert into kv_store(key, value)
              values (${key}, ${value})
              on conflict do nothing`;
}

