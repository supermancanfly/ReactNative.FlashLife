// import React from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     PixelRatio,
//     TextInput,
//     Alert,
//     Platform,
//     PermissionsAndroid,
// } from 'react-native';
// import FileViewer from 'react-native-file-viewer';
// import RNFetchBlob from 'react-native-fetch-blob';
// export const downloadFile = (item) => {
//     let fileUrl = item.download_file;
//     // Get today's date to add the time suffix in filename
//     let date = new Date();
//     // File URL which we want to download
//     let FILE_URL = fileUrl.replace(" ","%20");
//     // let FILE_URL = "https://instaccess.com/instaccess_backend_dev/uploads/content_feed/BIlanding_image_2818.jpg";
//     // let FILE_URL = "https://instaccess.com/instaccess_backend_dev/uploads/content_files/file4_7723.html";
//     // Function to get extention of the file url
//     let file_ext = getFileExtention(FILE_URL);
//     file_ext = '.' + file_ext[0];

//     // config: To get response by passing the downloading related options
//     // fs: Root directory path to download
//     const { config, fs } = RNFetchBlob;
//     let RootDir = fs.dirs.PictureDir;
//     let options = {
//       fileCache: true,
//       addAndroidDownloads: {
//         path:
//           RootDir +
//           '/file_' +
//           Math.floor(date.getTime() + date.getSeconds() / 2) +
//           file_ext,
//         description: 'downloading file...',
//         notification: true,
//         // useDownloadManager works with Android only
//         useDownloadManager: true,
//       },
//     };
//     config(options)
//       .fetch('GET', FILE_URL)
//       .then(res => {
//         // Alert after successful downloading
//         // if (fileicon != "fileicon") {
//         //   this.setState({
//         //     isFileMenuOptions: !this.state.isFileMenuOptions,
//         //   })
//         // }
//         FileViewer.open(res.data)
//           .then(() => {
//             // Do whatever you want
//             console.log('Success');
//             // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
//           })
//           .catch(_err => {
//             // Do whatever you want
//             console.log("Fileviewer Error"+_err);
//           });
//       }).catch(_err => {
//         // Do whatever you want
//         console.log("Download File Error"+_err);
//       });;
//   };
//  export const getFileExtention = fileUrl => {
//    console.log("getFileExtention---fileUrl"+fileUrl)
//     // To get the file extension
//     return /[.]/.exec(fileUrl) ?
//       /[^.]+$/.exec(fileUrl) : undefined;
//   };

// export const checkPermission = async (item) => {
//     console.log("checkPermission file download item"+JSON.stringify(item));
//     if (Platform.OS === 'ios') {
//      downloadFile(item);
//     } else {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission Required',
//             message:
//               'Application needs access to your storage to download File',
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {

//           console.log('Storage Permission Granted.');
//           // Start downloading
//           downloadFile(item);
//         } else {
//           // If permission denied then show alert
//           Alert.alert('Error', 'Storage Permission Not Granted');
//         }
//       } catch (err) {
//         // To handle permission related exception
//         console.log("++++" + err);
//       }
//     }
//   };

// export const FileDownload = async (value) => {
//     console.log("----------------------FileDownload---------------"+JSON.stringify(value));
//     const promise = new Promise(async (resolve, reject) => {

//         try {
//             //do something and return result on success


//             // console.log("result"+JSON.stringify(result))
//             // resolve(result);
//             checkPermission(value);
//             resolve();

//         } catch (msg) { reject(msg); }

//     });

//     return promise;
// }

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PixelRatio,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
export const downloadFile = (item) => {
  let fileUrl = item.download_file;
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = fileUrl.replace(" ", "%20");
  // let FILE_URL = "https://instaccess.com/instaccess_backend_dev/uploads/content_feed/BIlanding_image_2818.jpg";
  // let FILE_URL = "https://instaccess.com/instaccess_backend_dev/uploads/content_files/file4_7723.html";
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);
  file_ext = '.' + file_ext[0];

  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const { config, fs } = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;

  // Put your url here -----
  const url =
    FILE_URL;
  // -----

  // this will split the whole url.
  const f2 = url.split("/");

  // then get the file name with extention.
  const fileName = f2[f2.length - 1];
  // const fileExtention = url.split(".")[3];

  // create a local file path from url
  const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  const options = {
    fromUrl: url,
    toFile: localFile,
  };
  // last step it will download open it with fileviewer.
  RNFS.downloadFile(options)
    .promise.then(() => FileViewer.open(localFile))
    .then(() => {

      // success
      // Here you can perform any of your completion tasks
    })
    .catch((error) => {
      // error
    });

  // let options = {
  //   fileCache: true,
  //   addAndroidDownloads: {
  //     path:
  //       RootDir +
  //       '/file_' +
  //       Math.floor(date.getTime() + date.getSeconds() / 2) +
  //       file_ext,
  //     description: 'downloading file...',
  //     notification: true,
  //     // useDownloadManager works with Android only
  //     useDownloadManager: true,
  //   },
  // };
  // console.log("-----------options----------"+JSON.stringify(options));

  // config(options)
  //   .fetch('GET', FILE_URL)
  //   .then(res => {
  //     // Alert after successful downloading
  //     console.log('res -> ', JSON.stringify(res));
  //     console.log('File Downloaded Successfully.');
  //     // if (fileicon != "fileicon") {
  //     //   this.setState({
  //     //     isFileMenuOptions: !this.state.isFileMenuOptions,
  //     //   })
  //     // }
  //     FileViewer.open(res.data,  {
  //       displayName: "Documents",
  //       showOpenWithDialog: true,
  //       showAppsSuggestions: true
  //     })
  //       .then(() => {
  //         // Do whatever you want
  //         console.log('Success');
  //         // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
  //       })
  //       .catch(_err => {
  //         // Do whatever you want
  //         console.log("Fileviewer Error"+_err);
  //       });
  //   }).catch(_err => {
  //     // Do whatever you want
  //     console.log("Download File Error"+_err);
  //   });;
};
export const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ?
    /[^.]+$/.exec(fileUrl) : undefined;
};

export const checkPermission = async (item) => {
  if (Platform.OS === 'ios') {
    downloadFile(item);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message:
            'Application needs access to your storage to download File',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        // Start downloading
        downloadFile(item);
      } else {
        // If permission denied then show alert
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
    }
  }
};

export const FileDownload = async (value) => {
  const promise = new Promise(async (resolve, reject) => {

    try {
      //do something and return result on success


      // console.log("result"+JSON.stringify(result))
      // resolve(result);
      checkPermission(value);
      resolve();

    } catch (msg) { reject(msg); }

  });

  return promise;
}

