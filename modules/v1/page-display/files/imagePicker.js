// import {showImagePicker} from 'react-native-image-picker';
// import language from '../language';
//
// const picker = () => {
//     const lang = language.all('imagePicker');
//     return new Promise((resolve, reject) => {
//         // const options = {
//         //     title: lang.title,
//         //     cancelButtonTitle: lang.cancelButtonTitle,
//         //     takePhotoButtonTitle: lang.takePhotoButtonTitle,
//         //     chooseFromLibraryButtonTitle: lang.chooseFromLibraryButtonTitle,
//         //     storageOptions: {
//         //         skipBackup: true,
//         //         path: 'Images',
//         //     },
//         // };
//         //
//         // showImagePicker(options, (response) => {
//         //     console.log('Response = ', response);
//         //     if (response.didCancel) {
//         //         console.log('User cancelled image picker');
//         //     } else if (response.error) {
//         //         console.log('ImagePicker Error: ', response.error);
//         //     } else if (response['customButton']) {
//         //         console.log(response['customButton']);
//         //     } else {
//         //         const source = {uri: response.uri};
//         //         console.log(JSON.stringify(source));
//         //         console.log("source:" + JSON.stringify(source));
//         //         const base64Image = `data:${response.type};base64,${response.data}`;
//         //         const params = {
//         //             width: response.width,
//         //             height: response.height,
//         //             ratio: response.height / response.width,
//         //             type: response.type,
//         //             fileName: response.fileName,
//         //             path: response.path,
//         //             base64: base64Image,
//         //         };
//         //         return resolve(params);
//         //     }
//         // });
//     })
// }
//
// export default {
//     picker,
// }
