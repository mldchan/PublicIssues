import sql from "@/backend/db/postgres";

export async function setValue(key: string, value: string) {
    const a = await sql`insert into kv_store(key, value) values (${key}, ${value})
            on conflict (key) do update set value = ${value} returning key, value`;
    return a.length === 1
}

export async function getValue(key: string) {
    const a = await sql`select value from kv_store where key = ${key}`;
    if (a.length === 0) return null;
    return a[0].value;
}

export async function hasValue(key: string) {
    const a = await sql`select value from kv_store where key = ${key}`;
    return a.length === 1
}

export async function deleteValue(key: string) {
    const a = await sql`delete from kv_store where key = ${key}`;
    return a.length === 1
}

export async function defaultValue(key: string, value: string) {
    await sql`insert into kv_store(key, value) values (${key}, ${value}) on conflict do nothing`;
}
