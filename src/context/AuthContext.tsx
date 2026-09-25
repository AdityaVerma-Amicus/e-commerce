import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

interface User {
    email: string;
}

interface AuthContextValue {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (
        email: string,
        password: string,
    ): Promise<void> => {
        // Simulate an API request
        await new Promise((resolve) =>
            setTimeout(resolve, 1000),
        );

        // Mock authentication
        if (
            email === "test@example.com" &&
            password === "password"
        ) {
            setUser({ email });
            return;
        }

        throw new Error("Invalid email or password");
    };

    const logout = () => {
        setUser(null);
    };

    const value: AuthContextValue = {
        isLoggedIn: user !== null,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider",
        );
    }

    return context;
}