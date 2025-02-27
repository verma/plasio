const fs = require('fs');
const path = require('path');
const https = require('https');

// 添加日志
const log = require('electron-log');
log.transports.file.level = 'info';

const fontsToDownload = [
    {
        name: 'OpenSans-Regular',
        url: 'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2',
        format: 'woff2'
    },
    {
        name: 'OpenSans-Bold',
        url: 'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu0SC55K5gw.woff2',
        format: 'woff2'
    },
    {
        name: 'ArchivoBlack-Regular',
        url: 'https://fonts.gstatic.com/s/archivoblack/v17/HTxqL289NzCGg4MzN6KJ7eW6CYKF_i7y.woff2',
        format: 'woff2'
    }
];

function downloadFont(font) {
    return new Promise((resolve, reject) => {
        const fontPath = path.join(__dirname, 'build', 'fonts', `${font.name}.${font.format}`);
        log.info(`下载字体: ${font.name}`);

        const file = fs.createWriteStream(fontPath);
        https.get(font.url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                log.info(`字体下载完成: ${font.name}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(fontPath, () => {
                log.error(`下载字体失败 ${font.name}:`, err);
                reject(err);
            });
        });

        file.on('error', err => {
            fs.unlink(fontPath, () => {
                log.error(`写入字体文件失败 ${font.name}:`, err);
                reject(err);
            });
        });
    });
}

async function downloadAllFonts() {
    try {
        // 确保字体目录存在
        const fontDir = path.join(__dirname, 'build', 'fonts');
        if (!fs.existsSync(fontDir)) {
            fs.mkdirSync(fontDir, { recursive: true });
        }

        // 下载所有字体
        await Promise.all(fontsToDownload.map(downloadFont));
        log.info('所有字体下载完成');
    } catch (error) {
        log.error('下载字体过程中出错:', error);
        process.exit(1);
    }
}

downloadAllFonts(); 