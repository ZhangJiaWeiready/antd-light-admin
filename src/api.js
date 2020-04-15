import request from '@/utils/request.js';

export const login = ({ username, password }) => {
    const opt = {
        method: 'post',
        url: '/user/login',
        data: { username, password }
    };
    return request(opt);
};

export const logout = () => {
    const opt = {
        method: 'post',
        url: '/user/logout'
    };
    return request(opt);
};

export const getUserInfo = (user_id) => {
    const opt = {
        method: 'post',
        url: '/shop/getShop',
        data: { user_id }
    };
    return request(opt);
};
