// import { AuthContext } from '@/contexts/AuthContext'; // Ensure correct path
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';

const useAuth = () => {
    const {user, setUser, authToken} = useContext(AuthContext);


    return { user, setUser, authToken };
};

export default useAuth;
