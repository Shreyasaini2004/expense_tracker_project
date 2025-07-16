import axios from 'axios';
import { BASE_URL} from './apiPath';

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {

        const accesstoken = localStorage.getItem("token");
        if (accesstoken) {
            config.headers.Authorization= `Bearer ${accesstoken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                // Handle unauthorized access
               
                window.location.href = '/login';
            } else if(error.response.status === 500){
                console.error("Server error");
            }

        } else if(error.code==="ECONNABORTED"){
            console.error("Request timeout");
        }
        return Promise.reject(error);

    }
);

export default axiosInstance;