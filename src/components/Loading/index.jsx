import React from 'react';
import { Spin } from 'antd';
import './index.less';

export default () => (
    <div className="loading-page">
        <Spin size="large" />
        <span className="loading-text">载入中...</span>
    </div>
);
