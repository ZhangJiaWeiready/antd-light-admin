import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '@/assets/common.less';
import { configure } from 'mobx';
import App from './App';

dayjs.locale('zh-cn'); // dayjs 中文全局设置
configure({ enforceActions: 'always' }); // 开启严格模式
window.PUBLIC_PATH = PUBLIC_PATH;

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>, document.getElementById('root')
);
