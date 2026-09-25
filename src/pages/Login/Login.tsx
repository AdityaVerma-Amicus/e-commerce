import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const from =
        location.state?.from?.pathname ?? "/";

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            await login(email, password);

            navigate(from, {
                replace: true,
            });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Login failed",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-100 items-center justify-center px-4 py-12">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm"
            >
                <h1 className="mb-6 text-2xl font-bold text-text">
                    Sign In
                </h1>

                {error && (
                    <p className="mb-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-text"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        className="w-full rounded border border-border p-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-text"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        className="w-full rounded border border-border p-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>

                <p className="mt-4 text-sm text-text-secondary">
                    Demo credentials:
                    <br />
                    test@example.com / password
                </p>
            </form>
        </main>
    );
}

export default Login;