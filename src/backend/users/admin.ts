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
import {defaultValue} from "@/backend/db/keyValueStore";
import {getIssueManager} from "@/backend/issues/issues";

export async function ensureDatabase(): Promise<void> {
    await sql`create table if not exists users
              (
                  username
                  text
                  constraint
                  users_pk
                  primary
                  key,
                  password
                  text
                  not
                  null
              );`;

    await sql`create table if not exists users_token
    (
        id
        serial
        constraint
        users_token_pk
        primary
        key,
        "user"
        text
        constraint
        users_token_users_username_fk
        references
        users
        not
        null,
        token
        text
        not
        null,
        expires
        date
        default
              (
        CURRENT_DATE
        +
        '1 mon'
        :
        :
        interval
              ) not null
        );`;

    await sql`create table if not exists projects
              (
                  id
                  integer
                  not
                  null
                  constraint
                  projects_pk
                  primary
                  key,
                  visibility_type
                  integer
                  default
                  0
                  not
                  null,
                  allow_issues
                  integer
                  default
                  1
                  not
                  null
              );`;

    await sql`create table if not exists kv_store
              (
                  key
                  text
                  constraint
                  kv_store_pk
                  primary
                  key,
                  value
                  text
                  not
                  null
              );`

    await ensureDefaultAdminUser();

    await defaultValue("instTitle", "Welcome to Public Issues!");
    await defaultValue("instDescription", `Here you can file issues on ${getIssueManager()} without an account.`);
}

async function ensureDefaultAdminUser(): Promise<void> {
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
        await sql`insert into users(username, password)
                  values (${process.env.ADMIN_USERNAME}, ${process.env.ADMIN_PASSWORD}) on conflict do nothing
                  returning username, password`;
    }
}

export async function newUser(username: string, password: string): Promise<boolean> {
    try {
        const res = await sql`insert into users(username, password)
                              values (${username}, ${password}) returning username, password`;

        return res.length === 1;
    } catch (error) {
        return false;
    }
}

export async function userExists(username: string): Promise<boolean> {
    const res = await sql`select users.username
                          from users
                          where username = ${username}`;

    return res.length === 1;
}

export async function generateToken(username: string): Promise<string | null> {
    try {
        const token = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);

        const res = await sql`insert into users_token("user", token)
                              values (${username}, ${token}) returning token`;

        return res.length === 1 ? token : null;
    } catch (error) {
        return null;
    }
}

export async function checkPassword(username: string, password: string): Promise<boolean> {
    const res = await sql`select users.username
                          from users
                          where username = ${username}
                            and password = ${password}`;
    return res.length === 1;
}

export async function checkToken(token: string) {
    const res = await sql`select "user"
                          from users_token
                          where token = ${token}`;
    return res.length === 1;
}

export async function deleteUser(username: string) {
    await sql`delete
              from users_token
              where "user" = ${username}`;
    const a = await sql`delete
                        from users
                        where username = ${username}`;

    return a.length === 1
}

export async function getUsers(): Promise<string[]> {
    const a = await sql`select username
                        from users`;

    return a.map(x => x.username);
}
