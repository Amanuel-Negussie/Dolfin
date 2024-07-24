
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "@/services";
import { useUsers } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const AuthHandler: React.FC = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const { login, setNewUser, setCurrentUser, userState } = useCurrentUser();
    const { addNewUser, dispatch } = useUsers();
    const [isLoginDone, setIsLoginDone] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Login to backend if Auth0 is authenticated
        if (isAuthenticated && user?.sub) {
            login(user?.sub);
        }
        else {
            console.log("No User Logged In");
        }
    }, [login]);

    // Login set NewUser to null
    useEffect(() => {
        if (!userState.newUser && userState.currentUser) {
            console.log('Current user is: ', userState.currentUser);
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

