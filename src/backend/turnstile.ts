import {validateTurnstileToken} from "next-turnstile";
import {v4} from "uuid";

export async function validateTurnstileResponse(captcha: string): Promise<boolean> {
    if (!process.env.TURNSTILE_SECRET_KEY || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        return false;
    }

    const resp = await validateTurnstileToken({
        token: captcha,
        secretKey: process.env.TURNSTILE_SECRET_KEY!,
        idempotencyKey: v4(),
        sandbox: process.env.NODE_ENV === "development"
    });

    return resp.success;
}
