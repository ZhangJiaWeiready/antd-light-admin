import { observable, action } from 'mobx';

class AppStore {
    @observable token = getLocalItem('token') || '';

    @observable role = getLocalItem('role') || 1;

    @observable name = getLocalItem('name') || 'ZLY';

    @observable shopName = getLocalItem('shopName') || 'ZLY';

    @observable sider = Number(getLocalItem('Sider')) || 1;

    @action.bound
    changeToken(token) {
        this.token = token;
        setLocalItem('token', token);
    }

    @action.bound
    changeRole(role) {
        this.role = role;
        setLocalItem('role', role);
    }

    @action.bound
    changeName(name) {
        this.name = name;
        setLocalItem('name', name);
    }

    @action.bound
    changeShopName(name) {
        this.name = name;
        setLocalItem('shopName', name);
    }

    @action.bound
    changeSider(value) {
        this.sider = value;
        setLocalItem('Sider', value);
    }
}
export default new AppStore();

function getLocalItem(key) {
    if (!key) return '';
    let data = null;
    const value = window.localStorage.getItem(`XZM_${key}`) || '';
    if (!value) return '';
    try {
        data = JSON.parse(value);
    } catch (err) {
        data = value;
    }
    return data;
}

function setLocalItem(key, value) {
    const data = typeof value === 'object' ? JSON.stringify(value) : value;
    window.localStorage.setItem(`XZM_${key}`, data);
}
