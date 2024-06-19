import axios from 'axios';

const setAccessToken = (token: string) => {
    axiosConfigs.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const axiosConfigs = axios.create({
    baseURL: 'http://localhost:8000',
});

export default axiosConfigs;
export { setAccessToken };