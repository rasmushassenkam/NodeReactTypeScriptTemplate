import axios from "axios";
import { apiEndpoint } from "../../constants/config";

// Add a request interceptor
axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    // todo: set apiEndpoint according to environment (maybe from a config file from server)
    config.baseURL = apiEndpoint + "/api";
    return config;
}, function (error) {
    // todo: Do something with request error
    return Promise.reject(error);
});

export default axios;