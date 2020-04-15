import Exif from 'exif-js';

export const rndNum = (n) => {
    let rnd = '';
    for (let i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10);
    }
    return rnd;
};

// 格式化图片，去除一些平台差异，比如苹果拍出来的图片有旋转问题
export async function formatImgs(file) {
    const fileReader = new FileReader();

    return new Promise((resolve) => {
        let Orientation;
        // 去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, () => {
            Orientation = Exif.getTag(file, 'Orientation');
        });
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            const base64 = e.target.result;
            const img = new Image();
            let imgData = null;
            img.src = base64;
            img.filename = file.name;
            img.onload = async () => {
                imgData = await compressImg(img, Orientation);
                imgData.file.uid = file.uid;
                imgData.file.thumbUrl = imgData.url;
                resolve(imgData);
            };
        };
    });
}

/**
 * 压缩图片
 *
 * @param {img} img new Image() 出来的对象
 *
 * @return {string}
 */
export async function compressImg(img, Orientation) {
    const file1 = rotateImg(img, Orientation);
    const imgNode = new Image();
    imgNode.src = file1.url;
    imgNode.filename = img.filename || img.name;
    const load = new Promise((res, rej) => {
        imgNode.onload = (e) => {
            res(scaleImg(imgNode));
        };
    });
    const data = await load;
    return data;
}

function rotateImg(img, Orientation) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // 图片原始尺寸
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    let degree = 0; // 旋转角度
    let x = 0;
    let y = 0; // 绘制的x,y坐标

    // 判断需不需要旋转
    const orieation = Orientation ? (Orientation - 0) : 0;
    if (orieation && orieation !== 1) {
        if (orieation === 6) {
            width = img.naturalHeight;
            height = img.naturalWidth;
            degree = Math.PI / 2;
            y = -img.naturalHeight;
        }
        if (orieation === 3) {
            width = img.naturalWidth;
            height = img.naturalHeight;
            degree = Math.PI;
            x = -img.naturalWidth;
            y = -img.naturalHeight;
        }
        if (orieation === 8) {
            width = img.naturalHeight;
            height = img.naturalWidth;
            degree = 3 * (Math.PI / 2);
            x = -img.naturalWidth;
        }
    }
    canvas.width = width;
    canvas.height = height;
    context.rotate(degree);
    // 图片压缩
    context.drawImage(img, x, y, img.naturalWidth, img.naturalHeight);
    const newUrl = canvas.toDataURL('image/jpeg'); // base64 格式
    const file = dataURLtoFile(newUrl, img.filename);
    return {
        url: newUrl,
        file
    };
}

function scaleImg(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const maxWidth = 1080;
    const orW = img.naturalWidth;
    const orH = img.naturalHeight;
    let width; let
        height;

    if (orW > maxWidth) {
        width = maxWidth;
        height = Math.round(width * (orH / orW));
    } else {
        width = orW;
        height = orH;
    }
    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0, width, height);

    const newUrl = canvas.toDataURL('image/jpeg', 0.92);
    const file = dataURLtoFile(newUrl, img.filename);
    return {
        url: newUrl,
        file
    };
}

function dataURLtoFile(dataurl, filename = 'file') {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], {
        type: mime
    });
    blob.lastModifiedDate = new Date();
    blob.name = filename;
    blob.filename = filename;
    return blob;
}
