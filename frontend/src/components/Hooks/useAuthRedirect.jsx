import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

const useAuthRedirect = () => {
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectTo);
        }
    }, [isAuthenticated, navigate, redirectTo]);

    return redirectTo;
}

export default useAuthRedirect;