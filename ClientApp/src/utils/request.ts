import axios from 'axios';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { Session } from '/@/utils/storage';

//Configure a new axios instance
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' },
});

//Add request interceptor
service.interceptors.request.use(
    (config) => {
        if (Session.get('token')) {
            (<any>config.headers).common['Authorization'] = `Bearer ${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        //What to do with request errors
        return Promise.reject(error);
    }
);

//Add response interceptor
service.interceptors.response.use(
    (response) => {
        //Do something with the response data
        const res = response.data;

        if (res.code && res.code !== 10000) {
            // `token` has expired or the account has been logged in elsewhere
            if (res.code === 401 || res.code === 4001) {
                Session.clear(); // Clear all temporary caches of the browser
                window.location.href = '/'; // Go to the login page
                ElMessageBox.alert('You have been logged out, please log in again', 'Prompt', {})
                    .then(() => { })
                    .catch(() => { });
            }
            else {
                ElNotification({
                    title: `Error code: ${res.code}`,
                    type: 'error',
                    message: res.msg
                })
                return Promise.reject(service.interceptors.response);
            }
        } else {
            return response.data;
        }
    },
    (error) => {
        // Do something with the response error
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('Network timeout');
        } else if (error.message == 'Network Error') {
            ElMessage.error('Network connection error');
        } else {
            if (error.response.status === 401) {
                Session.clear();
                window.location.href = '/'; // Go to the login page
            }
            if (error.response.data) ElMessage.error(error.response.statusText);
            else ElMessage.error(error.response.status);

            console.log(error)
        }
        return Promise.reject(error);
    }
);

//Export axios instance
export default service;