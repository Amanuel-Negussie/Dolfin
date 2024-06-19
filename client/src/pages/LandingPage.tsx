import { useEffect } from "react";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";

function LandingPage() {
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = "/home";
        }
    }, [isAuthenticated]);

    return (
        <div>
            <h1>Welcome to Dolfin!</h1>
            <p>Please log in to continue.</p>
            <LoginButton />
        </div>
    );
}

export default LandingPage;