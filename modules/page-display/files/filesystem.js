import {
    downloadFile,
    uploadFiles,
    unlink,
    exists,
    mkdir,
    ExternalDirectoryPath,
    LibraryDirectoryPath,
    stopDownload,
} from 'react-native-fs';


const path = Platform.OS === 'ios' ? LibraryDirectoryPath : ExternalDirectoryPath;

/**
 * 判断文件是否存在
 * @param url
 * @returns {Promise<unknown>}
 */
const isFile = (url) => {
    return new Promise((resolve, reject) => {
        exists(url)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
};

/**
 * 删除
 * @param filePath  文件路径
 * @returns {Promise<unknown>}
 */
const remove = (filePath) => {
    return new Promise((resolve, reject) => {
        unlink(filePath).then((res) => {
            return resolve(res);
        }).catch(err => {
            return reject(err);
        });
    });
};

//暂停下载,并删除文件
const stop = (id, path) => {
    stopDownload(id);
    remove(path).then();
};


/**
 * 下载
 * @param url               请求地址
 * @param filePath          下载路径
 * @param progressDivider   多少百分比返回一次
 * @param beginSuccess      开始下载调用
 * @param progressSuccess   下载进行中
 * @param params            [headers: {"Cookie": cookie}]
 * @returns {Promise<unknown>}
 */
const download = (url, filePath, progressDivider, beginSuccess, progressSuccess, params = {}) => {
    return new Promise((resolve, reject) => {
        const options = {
            fromUrl: url,
            toFile: filePath,
            background: true,
            progressDivider: progressDivider ?? 1,
            begin: (res) => {
                console.log(res);
                //开始下载时回调
                if (typeof beginSuccess === 'function') beginSuccess(res);
            },
            progress: (res) => {
                //下载中回调
                if (typeof progressSuccess === 'function') progressSuccess(res, res.bytesWritten / res.contentLength);
            },
        };
        //写入headers
        if (params['headers']) options.headers = params.headers;
        downloadFile(options).promise.then(res => {
            console.log('下载完成');
            return resolve(res);
        }).catch(err => reject(err))
    });
};


/**
 *  文件上传
 * @param uploadUrl
 * @param files
 * @param progressSuccess
 * @param params
 * @returns {Promise<unknown>}
 */
const upload = (uploadUrl, files, progressSuccess, params = {}) => {
    return new Promise((resolve, reject) => {
        console.log(uploadUrl);
        console.log(files);
        const options = {
            toUrl: uploadUrl,
            files: files,
            begin: (res) => {
                console.log(res);
                let jobId = res.jobId;
                console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
            },
            progress: (res) => {
                let percentage = Math.floor((res.totalBytesSent / res.totalBytesExpectedToSend) * 100);
                //下载中回调
                if (typeof progressSuccess === 'function') progressSuccess(res, percentage);
            },
        };
        //写入headers
        if (params['headers']) options.headers = params.headers;
        uploadFiles(options).promise.then(res => {
            console.log('uploadFiles', res);
            if (res.statusCode === 200) {
                console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
            } else {
                console.log('SERVER ERROR');
            }
            return resolve(res);
        }).catch(err => reject(err))
    });
};

export default {
    path,
    isFile,
    download,
    upload,
    remove,
    stop,
    mkdir,
}

