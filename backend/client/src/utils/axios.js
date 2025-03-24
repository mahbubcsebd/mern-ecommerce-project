import axios from "axios";


const databaseUrl = import.meta.env.VITE_APP_DATABASE_URL;


const axiosInstance = axios.create({
    baseURL: databaseUrl,
});

export default axiosInstance;