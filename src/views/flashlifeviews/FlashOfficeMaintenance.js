import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Keyboard, PermissionsAndroid, Alert } from 'react-native';
import HeaderBackTitleProfile from "../../components/shared/HeaderBackTitleProfile";
import ApplicationDataManager from "../../utils/ApplicationDataManager";
import Constantimages from "../../utils/ConstantImages";
import { ConstantValues } from "../../utils/ConstantValues";
import { colors, fontsProps } from "../../utils/StyleComponents";
import expandMore from '../../assets/svg/exppand_more.svg';
import { SvgXml } from 'react-native-svg';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from "../../components/file_to_blob";
import addPhoto from '../../assets/svg/add_a_photo.svg';
import { check, checkMultiple, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
import { ApiGetMaintenanceLocations, ApiSendSMTPMaintenanceMail } from "../../network/Services";
import ProgressDialog from "../../components/dialogs/ProgressDialog";
import { apiErrorHandler } from "../../utils/CommonMethods";
import DropDownDialog from "../../components/dialogs/DropDownDialog";
import ImagePickerDialog from "../../components/home/ImagePickerDialog";
const FlashOfficeMaintenance = (props) => {
    const action_button_background = ApplicationDataManager.getInstance().getActionButtonBackground();
    const action_button_text_color = ApplicationDataManager.getInstance().getActionButtonTextColor();
    const header_background_color = ApplicationDataManager.getInstance().getHeaderBgcolor();
    const header_text_color = ApplicationDataManager.getInstance().getHeaderTextColor();
    const userData = props.userData;;
    const navigate = useNavigation();
    const [isLocationDropdownVisible, setLocationDropdownVisible] = useState(false);
    const [locationValue, setLocationValue] = useState("");
    const [issueValue, setIssueValue] = useState("");
    const [imageData, setImageData] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [locationList, setLocationList] = useState([]);
    const [isImagePickerDialogVisible, setImagePicker] = useState(false);
    const [locationId, setLocationId] = useState();
    useEffect(() => {
        getLocations();
    }, [])

    getLocations = async () => {
        let params = `?company_id${userData[0].employee_company_id}&location_id=185,186,188`;
        setLoading(true)
        await ApiGetMaintenanceLocations(userData[0].token, params).then(responseJson => {
            setLoading(false);
            let prepareArray = [];
            var obj;
            if (responseJson.length > 0) {
                for (let index = 0; index < responseJson.length; index++) {
                    const element = responseJson[index];
                    obj = {
                        name: element.location_name,
                        id: element.location_id
                    }
                    prepareArray.push(obj);
                }
                setLocationList(prepareArray);
            }
        }).catch((error) => {
            setLoading(false);
            apiErrorHandler(props, error, ConstantValues.INTERNETWEAKPERFORMANCE, navigateToMore);
        })
    }
    const navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        props.callBackForMoreTabInFlashReportFraudView(ConstantValues.MORE_STR);
    }
    const locationTypeDropdown = () => {
        return <TouchableOpacity style={{
            borderColor: "#CBCBD0",
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#CBCBD0",
        }}
            onPress={() => {
                setLocationDropdownVisible(true);
            }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <TextInput
                    placeholder={"Select Location"}
                    placeholderTextColor={colors.COLOR_BLACK}
                    value={locationValue}
                    editable={false}
                    style={{
                        height: 50,
                        padding: 5,
                        fontSize: 13,
                        flex: 1,
                        borderTopLeftRadius: 4.0,
                        borderBottomLeftRadius: 4.0,
                        color: colors.COLOR_BLACK,
                        backgroundColor: "#F6F6F6",
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",
                    }}
                />
                <View pointerEvents='none'
                    style={{
                        marginLeft: 1.0,
                        padding: 15.0,
                        backgroundColor: "#F6F6F6",
                        borderTopRightRadius: 4.0,
                        borderBottomEndRadius: 4.0
                    }}>
                    <SvgXml width="15"
                        height="20"
                        xml={expandMore} />
                </View>
            </View>


        </TouchableOpacity>
    }
    const maintenanceIssueView = () => {
        return <View style={{ marginTop: 20.0, }}>
            <Text style={{
                fontSize: 13,
                textAlign: "right",
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
            }}>{(issueValue.length)} / {ConstantValues.MAX_TEXTINPUT_LENGTH}</Text>
            <View style={{
                borderColor: "#CBCBD0",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                backgroundColor: "#CBCBD0",

            }}>
                <TextInput
                    placeholder={'Provide a description of the office maintenance issue you want to log:'}
                    style={{
                        padding: 5,
                        fontSize: 13,
                        borderRadius: 5,
                        color: colors.COLOR_BLACK,
                        backgroundColor: "#F6F6F6",
                        flexWrap: "wrap",
                        minHeight: 100,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",

                    }}
                    value={issueValue}
                    onChangeText={setIssueValue}
                    numberOfLines={5}
                    textAlignVertical="top"
                    returnKeyType='done'
                    multiline={true}
                    blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    maxLength={ConstantValues.MAX_TEXTINPUT_LENGTH}
                    scrollEnabled={false}
                />
            </View>
        </View>
    }
    const onCameraPermissions = async (type) => {
        if (Platform.OS === 'ios') {
            try {
                const res = await check(PERMISSIONS.IOS.CAMERA);
                if (res === RESULTS.GRANTED) {
                    setImagePicker(true);
                } else if (res == RESULTS.DENIED) {
                    res = await request(PERMISSIONS.IOS.CAMERA);
                    if (res === RESULTS.GRANTED) {
                        setImagePicker(true);
                    } else {
                        Alert.alert("Camera permission denied")
                    }
                } else if (res == RESULTS.BLOCKED) {
                    Alert.alert("Camera is blocked!", "Please go to the setting and unblock it.")
                }
            } catch (err) {
                console.warn(err);
            }

        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'AndoridPermissionExample App Camera Permission',
                        message: 'AndoridPermissionExample App needs access to your camera ',
                    }
                );
                console.log("permission", granted);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setImagePicker(true);
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'AndoridPermissionExample App Camera Permission',
                            message: 'AndoridPermissionExample App needs access to your camera ',
                        }
                    );
                } else if (granted === PermissionsAndroid.RESULTS.BLOCKED ||
                    granted === "never_ask_again") {
                    Alert.alert("Camera is blocked!", "Please go to the setting and unblock it.")
                }
                else {
                    console.log("Camera permission denied!");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }
    const uploadImageView = () => {
        return <View style={{
            marginTop: 20,
            flexDirection: 'row',
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: "#CBCBD0",
            borderColor: "#CBCBD0",
            height: 50.0
        }}>
            <TouchableOpacity onPress={() => { }}
                style={{
                    backgroundColor: "#F6F6F6",
                    justifyContent: "center",
                    flex: 1,
                    borderTopLeftRadius: 4.0,
                    borderBottomLeftRadius: 4.0,
                    padding: 5.0
                }}>
                {(imageData != null) ?
                    <View style={{ marginLeft: 5 }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 3 }}
                            source={{ uri: imageData.uri }}>
                        </Image>
                    </View> : <Text style={{
                        color: colors.COLOR_BLACK,
                        fontSize: fontsProps.md,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        marginHorizontal: 5
                    }}>Upload Image</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCameraPermissions(ConstantValues.TAKE_PHOTO_STR)} style={{
                backgroundColor: "#F6F6F6",
                borderTopRightRadius: 4.0,
                borderBottomRightRadius: 4.0,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 1.0,
                padding: 15.0
            }}>
                <SvgXml width="20"
                    height="20"
                    xml={addPhoto} />
            </TouchableOpacity>
        </View>
    }
    const renderOptionalText = () => {
        return <View style={{
            marginVertical: 5,
            marginHorizontal: 5
        }}>
            <Text style={{
                color: colors.GREY_COLOR,
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-Regular",
            }}>Optional</Text>
        </View>

    }
    const submitButtonView = () => {
        return <ButtonImageTitle
            type={"check"}
            title={ConstantValues.SUBMIT_STR}
            imagesrc={Constantimages.doublearrrow_icon}
            imagestyle={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                tintColor: ConstantValues.COMPANY_ID_STR == "37" ?
                    colors.COLOR_WHITE :
                    "#B2FA00"
            }}
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: action_button_background != "" ? action_button_background : colors.COLOR_WHITE,
                borderRadius: 5,
                elevation: 5,
                height: ConstantValues.SUBMIT_BUTTON_SIZE,
                marginTop: 15
            }}
            titleStyle={{
                fontSize: 15,
                color: action_button_text_color != "" ?
                    action_button_text_color :
                    colors.COLOR_WHITE,
                textAlign: 'center',
                fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
            }}
            buttonPress={() => sendMail()}
            imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
        />
    }

    const renderProgressDialogLoader = () => {
        return (
            <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={header_background_color}
            />
        )
    }
    const validation = () => {
        var value = false;
        if (locationValue == "") {
            value = false;
            return Alert.alert("Error", "Please select a location");

        } else if (issueValue == "") {
            value = false;
            return Alert.alert("Error", "Please enter maintenance issue")
        } else {
            value = true;
        }
        return value;
    }
    const sendMail = () => {
        if (!validation()) {
            return;
        }
        let fileBlob = "";
        let fileType = "";
        if (fileData.length > 0) {
            fileBlob = fileData[0].blob.file;
            fileType = fileData[0].type;
        }
        setLoading(true);
        ApiSendSMTPMaintenanceMail(
            userData[0].token,
            issueValue,
            fileBlob,
            locationId,
            userData[0].id,
            fileType
        ).then(responseJson => {
            setLoading(false);
            if (responseJson == true) {
                if (Platform.OS == 'ios') {
                    setTimeout(() => {
                        Alert.alert(
                            '',
                            "Submitted Successfully",
                            [
                                {
                                    text: ConstantValues.OK_ALERT_STR, onPress: () => props.onBackForms()
                                }
                            ],
                            { cancelable: true },
                        )
                    }, 1500);
                }
                else {
                    Alert.alert(
                        '',
                        "Submitted Successfully",
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: () => props.onBackForms()
                            }
                        ],
                        { cancelable: false },
                    )
                }
            }

        }).catch(error => {
            console.log("error", error);
            setLoading(false);
            apiErrorHandler(props, error, ConstantValues.INTERNETWEAKPERFORMANCE, navigateToMore);
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            <View style={{ flex: 1, backgroundColor: "#EAEDF2" }}>
                <HeaderBackTitleProfile
                    title={"Show"}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: (header_background_color != "") ?
                            header_background_color
                            : colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={Constantimages.flash_back_icon}
                    profilename={"Office Maintenance"}
                    buttonPress={props.onBackForms}
                    source={Constantimages.back_icon}
                />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                    <ScrollView keyboardShouldPersistTaps='always' style={{ margin: 10 }}>
                        <View style={{
                            flex: 1,
                            padding: 15,
                            backgroundColor: colors.COLOR_WHITE,
                            borderRadius: 5
                        }}>
                            {locationTypeDropdown()}
                            {maintenanceIssueView()}
                            {uploadImageView()}
                            {renderOptionalText()}
                            {submitButtonView()}
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

            </View>
            {isLocationDropdownVisible && <DropDownDialog
                visible={isLocationDropdownVisible}
                title={"Maintenance Issue"}
                onDropModalVisible={() => setLocationDropdownVisible(!isLocationDropdownVisible)}
                onSelectDropDownValue={(value) => {
                    setLocationDropdownVisible(!isLocationDropdownVisible)
                    setLocationValue(value.name)
                    setLocationId(value.id)
                }}
                background={header_background_color}
                dropdownvalues={locationList}
            />}
            {isImagePickerDialogVisible && <ImagePickerDialog
                isDialogVisible={isImagePickerDialogVisible}
                onCamera={async () => {
                    setImagePicker(!isImagePickerDialogVisible);
                    var response = await onCameraCapture();
                    if (response) {

                        const { fileSize } = response; // Accessing properties directly

                        const maxSize = Platform.OS === 'ios' ? 350 * 1024 : 500 * 1024;

                        if (fileSize > maxSize) {
                            Platform.OS === 'ios' ? alert('File size exceeds the 400KB limit.') : alert('File size exceeds the 500KB limit.');
                            return;
                        }

                        var imageBlob = await convertFileToBlob(response);
                        setFileData([]);
                        let data = [];
                        let ext = response.type;
                        let ext1 = ext.split("/");
                        ext = ext1[1];
                        data.push({
                            path: response.path,
                            type: ext,
                            name: "attachments",
                            blob: imageBlob
                        })
                        setFileData(data);
                        setImageData({
                            path: response.path,
                            type: ext,
                            name: "attachments",
                            blob: imageBlob,
                            uri: response.uri

                        })
                    }
                }}
                onGallery={async () => {
                    setImagePicker(!isImagePickerDialogVisible);
                    var response = await onGalleryProceed();
                    if (response) {

                        const { fileSize } = response; // Accessing properties directly

                        const maxSize = Platform.OS === 'ios' ? 350 * 1024 : 500 * 1024;

                        if (fileSize > maxSize) {
                            Platform.OS === 'ios' ? alert('File size exceeds the 400KB limit.') : alert('File size exceeds the 500KB limit.');
                            return;
                        }

                        var imageBlob = await convertFileToBlob(response);
                        setFileData([]);
                        let data = [];
                        let ext = response.type;
                        let ext1 = ext.split("/");
                        ext = ext1[1];
                        data.push({
                            path: response.path,
                            type: ext,
                            name: "attachments",
                            blob: imageBlob
                        })

                        setFileData(data);
                        setImageData({
                            path: response.path,
                            type: ext,
                            name: "attachments",
                            blob: imageBlob,
                            uri: response.uri

                        })
                    }
                }}
                onDialogDismiss={() => setImagePicker(!isImagePickerDialogVisible)}
            />}
            {isLoading && renderProgressDialogLoader()}

        </SafeAreaView>
    )


}
export default FlashOfficeMaintenance;