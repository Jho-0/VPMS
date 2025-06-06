// context/utils/axios.js
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000/api/",
});

// Automatically add token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
