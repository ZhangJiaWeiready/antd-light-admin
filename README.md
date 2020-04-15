# 基于antd4+mobx的轻量化管理后台

#### 介绍
## 基于create-react-app脚手架搭建
antd4 + mobx + react-router5
eslint校验

[项目地址](https://github.com/Huaxink/antd-light-admin)

[预览demo](https://huaxink.github.io/antd-light-admin/index.html#/dashboard)

#### 软件架构
软件架构说明

1. component下有二维码组件
2. 基于exif-js提取图片信息，处理拍出照片的平台差异（横屏旋转，图片压缩）
3. 用的dayjs替换了momentjs，跟着antd官方文档走的
4. 基于react-app-rewired方式，没有eject
5. 简单的BaseLayout组件，可以根据自己需求随意改写

#### 安装教程

1.  npm install

#### 使用说明

1.  npm start 本地启动
2.  npm run build 打包