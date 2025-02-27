const icongen = require('icon-gen');
const path = require('path');

icongen(path.join(__dirname, 'resources', 'assets', 'circle.png'), path.join(__dirname, 'resources'), {
    ico: {
        name: 'icon',
        sizes: [16, 24, 32, 48, 64, 128, 256]
    }
}).then((results) => {
    console.log('图标生成成功:', results);
}).catch((err) => {
    console.error('图标生成失败:', err);
}); 