import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/services';
import { useAuth0 } from '@auth0/auth0-react';
import { UserType } from '@/components/types';
import { getLoginUser } from '@/services/api';

const useLogin = () => {
    const { user } = useAuth0();
    const { login, currentUser } = useCurrentUser();
    const [userInfo, setUserInfo] = useState<UserType | null>(null);

    useEffect(() => {
        async function loginUser() {
            if (!currentUser) {
                const { data: payload } = await getLoginUser(String(user?.sub));
                if (payload != null) {
                    setUserInfo(payload[0]);
                }
            }
            else {
                setUserInfo(currentUser);
            }
        }
        loginUser();
    }, []);

    return userInfo?.id;
};

export default useLogin;
