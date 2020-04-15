import React, { Component } from 'react';
import './index.less';

const QRCode = require('qrcode');
/** 生成二维码开放接口:
 *  二维码内容[通常为url]
 *  二维码大小[限制为正方形]
 *  二维码中间显示：文字或LOGO[默认不显示]
 */
class Qrcode extends Component {
    constructor(props) {
        /** 父组件传递参数
		 * @argument qrUrl        二维码内容
		 * @argument qrSize       二维码大小(默认200)
		 * @argument qrText       二维码中间显示文字
		 * @argument qrTextSize   二维码中间显示文字大小(默认16px)
		 * @argument qrLogo       二维码中间显示图片
		 * @argument qrLogoSize   二维码中间显示图片大小(默认为40)
		 */
        super(props); // 当父组件向子组件传递数据时，需要在这里传入props。
        props.qrSize = props.qrSize || 200; // 二维码大小默认值
        props.qrTextSize = props.qrTextSize || 40; // 中间字体默认值
        props.qrLogoSize = props.qrLogoSize || 40; // 中间二维码图片默认值
        this.state = {}; // 通过state来定义当前组件内部自己的数据
    }

    componentDidMount = () => {
        this.renderImage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.qrUrl !== this.props.qrUrl) {
            this.renderImage();
        }
    }

    renderImage() {
        // 画二维码里的logo[注意添加logo图片的时候需要在父组件中引入图片]
        const { qrcode_canvas } = this; // 最终存放二维码图片的标签
        const { canvas } = this;
        this.handleCanvasBlurProblem(canvas);
        const opt = { errorCorrectionLevel: 'H', ...this.props.options };
        QRCode.toDataURL(this.props.qrUrl, opt, (err, url) => {
            qrcode_canvas.src = url;
            const ctx = canvas.getContext('2d');
            setTimeout(() => { // 画二维码里的logo或文本 在canvas里进行拼接
                ctx.drawImage(qrcode_canvas, 0, 0, this.qrSize, this.qrSize); // 获取图片
                if (this.props.qrLogo) this.setQrcodeImg(ctx); // 如果传了qrLogo则设置中间图片
                else if (this.props.qrText) this.setQrcodeText(ctx); // 如果传了qrText则设置中间文本
                canvas.style.display = 'none'; // 隐藏掉convas
                qrcode_canvas.src = canvas.toDataURL(); // 显示二维码图片标签
                qrcode_canvas.style.display = 'inline-block';
                this.props.afterDraw && this.props.afterDraw(qrcode_canvas.src, this.props.qrText || '');
            }, 300);
        });
    }

    /**
	 * 在二维码下面加文本
	 */
    setQrcodeText = (ctx) => {
        ctx.font = `bold ${this.qrTextSize}px Arial`;
        const tw = ctx.measureText(this.props.qrText).width; // 文字真实宽度
        const ftop = this.qrSize; // 根据字体大小计算文字top
        const fleft = (this.qrSize - tw) / 2; // 根据字体大小计算文字left
        const tp = this.qrTextSize; // 字体边距为字体大小的一半可以自己设置
        ctx.fillStyle = '#fff';
        ctx.fillRect(
            0,
            ftop,
            this.qrSize,
            this.qrTextSize + tp
        );
        ctx.textBaseline = 'top'; // 设置绘制文本时的文本基线。
        ctx.fillStyle = '#000';
        ctx.fillText(this.props.qrText, fleft, ftop);
    }

    /**
	 * 在二维码中间加图片
	 */
    setQrcodeImg = (ctx) => {
        const { qrcode_logo } = this; // logo图片的标签
        ctx.fillStyle = '#fff'; // 设置获取的logo将其变为圆角以及添加白色背景
        ctx.beginPath();
        const logoPosition = (this.props.qrSize - this.props.qrLogoSize) / 2; // logo相对于canvas居中定位
        const h = this.props.qrLogoSize + 10; // 圆角高 10为基数(logo四周白色背景为10/2)
        const w = this.props.qrLogoSize + 10; // 圆角宽
        const x = logoPosition - 5;
        const y = logoPosition - 5;
        const r = 5; // 圆角半径
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(
            qrcode_logo,
            logoPosition,
            logoPosition,
            this.props.qrLogoSize,
            this.props.qrLogoSize
        );
    }

    render() {
        return (
            <div id="Qrcode">
                <div className="qrcode_box">
                    <img className="qrcode_canvas" id="qrcode_canvas" ref={(qrcode_canvas) => { this.qrcode_canvas = qrcode_canvas; }} alt="二维码图片" />
                    <img className="qrcode_logo" ref={(qrcode_logo) => { this.qrcode_logo = qrcode_logo; }} src={this.props.qrLogo} alt="二维码logo" />
                    <canvas width={this.props.qrSize} height={this.props.qrSize + this.props.qrTextSize} className="canvas" ref={(canvas) => { this.canvas = canvas; }} />
                </div>
            </div>
        );
    }

    /**
	 * webkitBackingStorePixelRatio：浏览器在渲染canvas之前会用几个像素来来存储画布信息
	 * window.devicePixelRatio：屏幕的设备像素比
	 */
    getPixelRatio(context) {
        const backingStore = context.backingStorePixelRatio
            || context.webkitBackingStorePixelRatio
            || context.mozBackingStorePixelRatio
            || context.msBackingStorePixelRatio
            || context.oBackingStorePixelRatio
            || context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }

    /**
	 * 解决canvas下图片模糊的问题
	 */
    handleCanvasBlurProblem(canvas) {
        const ctx = canvas.getContext('2d');
        const per = this.getPixelRatio(ctx);

        const h = canvas.height;
        const w = canvas.width;

        canvas.height = h * per;
        canvas.width = w * per;
        canvas.style.height = `${h}px`;
        canvas.style.width = `${w}px`;

        this.qrSize = this.props.qrSize * per;
        this.qrTextSize = this.props.qrTextSize * per;
    }
}

export default Qrcode;
