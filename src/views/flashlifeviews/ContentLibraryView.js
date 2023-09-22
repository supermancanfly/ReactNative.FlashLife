import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    FlatList,
    PermissionsAndroid
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ListHeader from '../../components/contentlibrary/ListHeader';
import ContentListItem from '../../components/contentlibrary/ContentListItem';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import {
    ApiGetContentLibraryFiles
} from '../../network/Services';
import { apiErrorHandler } from '../../utils/CommonMethods';
var applicationDataManager = ApplicationDataManager.getInstance();
export default class ContentLibraryView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            header_background_color: applicationDataManager.getHeaderBgcolor(),
            isLoading: false,
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            formDetails: [],
            categoryDetails: this.props.formDetails,
            filesList: []
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInContentLibrary(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getContentFiles();
    }
    getContentFiles = () => {
        const { userData, categoryDetails } = this.state;
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id + "&category_id=" + categoryDetails.category_id
        // "&user_id=" + userData[0].id 

        ApiGetContentLibraryFiles(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            // console.log("response" + JSON.stringify(responseJson));
            if (responseJson.length > 0) {
                this.setState({ isLoading: false, filesList: responseJson, })
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            // console.error(err);
            //Hello, I fixed api error handler
        })
    }

    checkPermission = async (item, index, fileicon) => {
        if (Platform.OS === 'ios') {
            this.downloadFile(item, index, fileicon);
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
                    this.downloadFile(item, index, fileicon);
                } else {
                    // If permission denied then show alert
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.log("++++" + err);
            }
        }
    };

    // https://life.flash.co.za/instaccess_backend/uploads/content_files/Obs Office New Starters Lunch Process_9167.pdf
    downloadFile = (item, index, fileicon) => {
        let fileUrl = item.file;

        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        // let FILE_URL = fileUrl;
        // let FILE_URL = fileUrl.replace(" ","%20");
        // let FILE_URL = fileUrl.replace(" ",/%20/g);
        // let FILE_URL = fileUrl.replace(/%20/g, " ");
        // str.replace(/%20/g, " ");

        // let FILE_URL = fileUrl.replaceAll(" ","%20");
        let FILE_URL = fileUrl.replace(/ /g, "%20");
        // let FILE_URL = fileUrl.replace(" ","%20");

        // Function to get extention of the file url
        let file_ext = this.getFileExtention(FILE_URL);

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
        if (Platform.OS === 'ios') {

            // last step it will download open it with fileviewer.
            RNFS.downloadFile(options)
                .promise.then(() => FileViewer.open(localFile, { showOpenWithDialog: true, showAppsSuggestions: true }))
                .then((res) => {

                    // success
                    // Here you can perform any of your completion tasks
                })
                .catch((error) => {
                    // error
                    console.log("error" + error)
                });
        }

        else {

            let androidoptions = {
                fileCache: true,
                addAndroidDownloads: {
                    path:
                        RootDir +
                        '/file_' +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        file_ext,
                    description: 'downloading file...',
                    notification: true,
                    // useDownloadManager works with Android only
                    useDownloadManager: true,
                },
            };
            config(androidoptions)
                .fetch('GET', FILE_URL)
                .then(res => {
                    // Alert after successful downloading
                    // alert('File Downloaded Successfully.');
                    console.log("RES DATA:", res);
                    FileViewer.open(res.data)
                        .then(() => {
                            // Do whatever you want
                            // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
                        })
                        .catch(_err => {
                            // Do whatever you want
                            console.log(_err);
                        });
                });
        };

        // else{
        // let newfileName= fileName.replace(/%20/g," ");
        // console.log("newfileName"+newfileName);
        // let filepath=RootDir +
        // '/file_' +
        // newfileName +
        // // Math.floor(date.getTime() + date.getSeconds() / 2) +
        // file_ext;
        // console.log("----filepath"+filepath)
        // RNFetchBlob.fs.exists(filepath)
        // .then((exist) => {
        //     console.log("exist"+exist);
        //     if(exist){
        //     console.log("already file exists no need to download")
        //     FileViewer.open(filepath,{ showOpenWithDialog: true, showAppsSuggestions: true })
        //     .then(() => {
        //         // Do whatever you want
        //         console.log('Success');
        //         // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
        //     })
        //     .catch(_err => {
        //         // Do whatever you want
        //         console.log(_err);
        //     });
        //     }
        //     else{
        //         let androidoptions = {
        //             fileCache: true,
        //             addAndroidDownloads: {
        //                 path:filepath,
        //                     // title:fileName,
        //                     description: 'downloading file...',
        //                 notification: true,
        //                 // useDownloadManager works with Android only
        //                 useDownloadManager: true,
        //             },
        //         };
        //         config(androidoptions)
        //             .fetch('GET', FILE_URL)
        //             .then(res => {
        //                 // Alert after successful downloading
        //                 // console.log('res -> ', JSON.stringify(res));
        //                 console.log("path"+res.path());

        //                 FileViewer.open(res.data)
        //                 .then(() => {
        //                     // Do whatever you want
        //                     console.log('Success');
        //                     // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
        //                 })
        //                 .catch(_err => {
        //                     // Do whatever you want
        //                     console.log(_err);
        //                 });

        //                   })

        //     }
        //     // console.log(`file ${exist ? '' : 'not'} exists`)
        // })
        // .catch(() => { console.log('err while checking') });  
        // }


    }


    getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    renderProgressDialogLoader() {
        if (this.state.isLoading) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background_color}
                />
            )
        }
    }

    renderRowFilesView() {
        return (
            <View style={{
                flex: 1,
                marginBottom: Platform.OS === 'ios' ? 70 : 0
                // paddingBottom:70
            }}>
                <FlatList
                    data={this.state.filesList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{

                        flexGrow: 1,
                        // marginBottom:70
                    }}
                    ListHeaderComponent={<ListHeader
                        title={this.state.categoryDetails ? this.state.categoryDetails.category_name : ""} />}
                    //   ListEmptyComponent={this.renderEmptyContainer()}
                    renderItem={({ item, index }) => {
                        // console.log("ITEM INDEX DATA :", JSON.stringify(item));
                        return (
                            <ContentListItem
                                item={item}
                                index={index}
                                checkPermission={() => this.checkPermission(item, 0, "doticon")}
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                            />

                        );
                    }}
                >
                </FlatList>
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderBackTitleProfile
                    title={"Show"}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                            : colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                    profilename={ConstantValues.CONTENT_LIBRARY_STR}
                    buttonPress={this.props.onBackForms}
                    source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                />
                {this.renderRowFilesView()}
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: 70,
    },
})