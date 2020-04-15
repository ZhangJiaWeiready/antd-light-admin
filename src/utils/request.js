import axios from 'axios';
import { message } from 'antd';
import appStore from '../stores/AppStore';

const rq = axios.create({
    baseURL: '/api',
    timeout: 3000,
    xsrfHeaderName: 'crsf'
});

rq.interceptors.request.use((config) => {
    const { token } = appStore;
    config.headers = {
        'Content-type': config.headers['Content-type'] || 'application/json',
        token
    };
    return config;
}, (err) => {
    message.error('请求错误，请检查');
    return Promise.reject(err);
});

rq.interceptors.response.use((response) => {
    const { status, data } = response;
    const errCode = [4, 43, 44, 46];
    if (status < 400) {
        if (errCode.includes(data.code - 0)) {
            setTimeout(cleanToken, 1000); // 防止内存泄漏，加了个1s延迟
            message.error(data.msg);
            return Promise.reject(data.msg);
        }
        return data;
    }
    if (status >= 400 && status < 500) {
        const errorInfo = '客户端错误，请检查';
        message.error(errorInfo);
        return Promise.reject(errorInfo);
    }
    if (status >= 500) {
        const errorInfo = '服务端错误，请检查';
        message.error(errorInfo);
        return Promise.reject(errorInfo);
    }
    return {};
}, (err) => {
    message.error(err.message);
    return Promise.reject(err);
});

function cleanToken() {
    const { changeToken } = appStore;
    changeToken('');
}

export default rq;
