import {FormEvent, useRef, useState} from "react";
import {Turnstile} from "next-turnstile";

export default function LogInForm() {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);

    const action = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        const token = formData.get('cf-turnstile-response')?.toString() ?? '';
        const username = formData.get('username')?.toString() ?? '';
        const password = formData.get('password')?.toString() ?? '';

        setLoading(true);

        fetch('/api/admin/logIn', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
                token
            })
        }).then(x => {
            if (!x.ok) {
                setLoading(false);
            }

            x.json().then(x => {
                setLoading(false);

                if (x.token && x.token !== '') {
                    localStorage.setItem('token', x.token);
                    location.reload();
                }
            })
        }).catch(x => {
            setLoading(false);
        })

    }

    return (<>
        <form onSubmit={action} ref={formRef}>
            <h1>Log in</h1>
            <br/>
            <label htmlFor='username'>Username:</label>
            <br/>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}
                   name='username'/>
            <br/>
            <label htmlFor='password'>Password:</label>
            <br/>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
                   name='password'/>
            <br/>
            <label>Let us know you're a not a robot:</label>
            <br/>
            <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} retry={"auto"} refreshExpired={"auto"}
                       sandbox={process.env.NODE_ENV === "development"}/>
            <button type='submit' disabled={loading} className='bg-blue-600 rounded-lg p-2 px-4'>Log In</button>
        </form>
    </>)

}