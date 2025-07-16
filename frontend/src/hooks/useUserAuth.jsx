import { useContext,useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_URL } from "../utils/apiPath";

const useUserAuth = () => {
    const {user,updateUser,clearUser}=useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return;
    
        let isMounted= true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_URL.AUTH.GET_USER_INFO);

                if(isMounted && response.data){
                    updateUser(response.data);
                }
            } catch (error) {
                console.log("FAILED",error);
                if (isMounted) {
                    clearUser();
                    navigate('/login');
                }
            } 
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [updateUser,clearUser,navigate]);
};

export default useUserAuth;