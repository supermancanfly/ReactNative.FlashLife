import { ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
export const convertFileToBlob = async (filedata) => {
    return new Promise(async (resolve, reject) => {
        var data = await RNFS.readFile(filedata.uri, 'base64').then(res => {
            let ext = filedata.type;
            ext = ext.split("/")[0];
            let result = {
                "file": res,
                "extension": ext,
                "uri": filedata.uri
            }
            return result;
        });
        // console.log("DATA IMAGE BLOB", JSON.stringify(data));
        resolve(data);
    });

}

export const onGalleryProceed = () => {
    const options = {
        title: 'Select a photo',
        takePhotoButtonTitle: 'Take a photo',
        chooseFromLibraryButtonTitle: 'Choose from gallery',
        quality: 1,
    }

    return new Promise((resolve, reject) => {
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('user cancelled image picker');
                reject(null);
            }
            else if (response.errorCode) {
                reject(response.errorCode);
                console.log('Image picker error 1' + response.errorCode);
            }
            else {
                async function getBlob(res) {
                    const data = await convertFileToBlob(res);
                    console.log("This is gallery Image data:", JSON.stringify(data));
                    data['image_data'] = response;
                    return data;
                }
                if (response && response.assets && response.assets.length > 0) {
                    //  resolve(getBlob(response.assets[0]));
                    resolve(response.assets[0]);
                } else {
                    reject(null);
                }

            }
        });
    })


}


export const onCameraCapture = () => {
    const options = {
        title: 'Select a photo',
        takePhotoButtonTitle: 'Take a photo',
        chooseFromLibraryButtonTitle: 'Choose from gallery',
        quality: 1, maxWidth: 500, maxHeight: 500
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            launchCamera(options, response => {
                if (response.didCancel) {
                    console.log('user cancelled image picker');
                    reject(null);
                }
                else if (response.errorCode) {
                    reject(response.errorCode);
                    console.log('Image picker error' + response.errorCode);
                }
                else {
                    async function getBlob(res) {
                        const data = await convertFileToBlob(res);
                        console.log("This is camera Image data:", data);
                        data['image_data'] = response;
                        return data;
                    }
                    if (response && response.assets && response.assets.length > 0) {
                        // resolve(getBlob(response.assets[0]));
                        // console.log("RES", JSON.stringify(response));
                        resolve(response.assets[0]);
                    } else {
                        reject(null);
                    }
                }
            })
        }, 200);
    });

}

export const downloadFile = async ({ url, token, data }) => {
    let downloadDest = `${RNFS.DownloadDirectoryPath}/winner`;
    RNFS.mkdir(downloadDest);
    downloadDest += `/${((Math.random() * 1000) | 0)}.xlsx`;
    // await RNFS.writeFile(downloadDest, data, 'base64');
    // return;
    let DownloadFileOptions = {
        fromUrl: url,
        toFile: downloadDest,
        // headers: {
        //     'Authorization': 'token ' + token
        // },
        // begin: this._downloadFileBegin,
        // progress: this._downloadFileProgress,
        progress: (data) => _downloadFileProgress(data),
        background: false,
        progressDivider: 1
    };
    console.log("DOWNLOADING START");
    RNFS.downloadFile(DownloadFileOptions).promise.then((resp) => {
        //call another function here
        if (resp && resp.statusCode && resp.statusCode == 200) {
            console.log(r);
        }

    }).catch(error => {
        console.log("DOWNLOAD ERROR: ", JSON.stringify(error));
    });
}

const _downloadFileProgress = (data) => {
    console.log("progress: ", data);
}