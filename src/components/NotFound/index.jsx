import React, { Component } from 'react';
import { Button } from 'antd';
import './index.less';

export default class NotFound extends Component {
    gotback = () => {
        this.props.history.goBack(2);
    }

    render() {
        return (
            <div>
                404
                <Button onClick={() => this.gotback()}>回退</Button>
            </div>
        );
    }
}
