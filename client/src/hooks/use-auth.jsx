import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/queryClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginPending, setIsLoginPending] = useState(false);
    const [isRegisterPending, setIsRegisterPending] = useState(false);
    const [isUpdatePending, setIsUpdatePending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await apiRequest("/api/user");
                setUser(userData);
            } catch (err) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        setIsLoginPending(true);
        try {
            const userData = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            setUser(userData);
            return userData;
        } finally {
            setIsLoginPending(false);
        }
    };

    const register = async (userData) => {
        setIsRegisterPending(true);
        try {
            const safeUserData = { ...userData };
            const newUser = await apiRequest("/api/register", {
                method: "POST",
                body: JSON.stringify(safeUserData),
            });
            setUser(newUser);
            return newUser;
        } finally {
            setIsRegisterPending(false);
        }
    };

    const logout = async () => {
        try {
            await apiRequest("/api/logout", { method: "POST" });
            setUser(null);
            navigate('/auth');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const updateProfile = async (updates) => {
        if (!user) return;
        setIsUpdatePending(true);
        try {
            const updatedUser = await apiRequest("/api/user", {
                method: "PATCH",
                body: JSON.stringify(updates),
            });
            setUser(updatedUser);
            return updatedUser;
        } finally {
            setIsUpdatePending(false);
        }
    };

    const value = {
        user,
        isLoading,
        isLoginPending,
        isRegisterPending,
        isUpdatePending,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) navigate("/auth");
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-slate-400">Loading FindIt...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;
    return children;
}
