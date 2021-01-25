import {Platform} from 'react-native';
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

export default class Files {
    constructor() {
    }

    static path = Platform.OS === 'ios' ? LibraryDirectoryPath : ExternalDirectoryPath;

    //判断文件是否存在
    exists(url) {
        return exists(url);
    }

    //暂停下载
    stop(id) {
        stopDownload(id);
    }

    //删除
    remove(filePath) {
        return new Promise((resolve, reject) => {
            unlink(filePath).then((res) => {
                return resolve(res);
            }).catch(err => {
                return reject(err);
            });
        });
    }

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
    download(url, filePath, progressDivider, beginSuccess, progressSuccess, params) {
        return new Promise((resolve, reject) => {
            if (typeof params === "undefined") params = {};
            const options = {
                fromUrl: url,
                toFile: filePath,
                background: true,
                progressDivider: progressDivider ?? 1,
                begin: res => {
                    if (typeof beginSuccess === "function") beginSuccess(res);
                },
                progress: res => {
                    const index = res.bytesWritten / res.contentLength;
                    if (typeof progressSuccess === "function") progressSuccess(res, index);
                },
            };
            //写入headers
            if (params['headers']) options.headers = params.headers;
            downloadFile(options).promise.then(res => {
                console.log('下载完成');
                return resolve(res);
            }).catch(err => reject(err));
        })
    }

    /**
     *  文件上传
     * @param uploadUrl
     * @param files
     * @param progressSuccess
     * @param params
     * @returns {Promise<unknown>}
     */
    upload(uploadUrl, files, progressSuccess, params) {
        return new Promise((resolve, reject) => {
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
                    return resolve(res);
                } else {
                    console.log('SERVER ERROR');
                }
                return resolve(res);
            }).catch(err => reject(err))
        });
    }
}
