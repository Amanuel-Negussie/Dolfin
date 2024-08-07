
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "@/services";
import { useUsers } from "@/services";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "@/services/api";


export const AuthHandler: React.FC = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { login, setNewUser, userState } = useCurrentUser();
    const { addNewUser } = useUsers();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAccessToken() {
            const token = await getAccessTokenSilently();
            setAccessToken(token);
            // Login to backend if Auth0 is authenticated
            if (isAuthenticated && user?.nickname) {
                login(user.nickname);
            }
            else {
                console.log("No User Logged In");
            }
        }
        fetchAccessToken();
    }, [login]);

    // Login set NewUser to null
    useEffect(() => {
        if (!userState.newUser && userState.currentUser) {
            navigate('/home');
        }
        // If logged in through Auth0, but not in the backend, create a new user
        else if (!userState.newUser && !userState.currentUser) {
            if (user?.nickname && user?.sub) {
                addNewUser({ username: user?.nickname, auth0Id: user?.sub });
                setNewUser(user?.sub);
                navigate('/home');
            }
        }
    }, [userState.newUser]);

    return (<></>);
};

