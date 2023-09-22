import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    TouchableWithoutFeedback,
    Platform,
    PermissionsAndroid,
    Animated,
    ActivityIndicator
} from 'react-native';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import SignatureCapture from 'react-native-signature-capture';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import { Picker } from '@react-native-community/picker';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DateTimePicker from "react-native-modal-datetime-picker";
import ApplicationDataManager from '../utils/ApplicationDataManager';
import EditLoyaltyCardView from '../views/EditLoyaltyCardView';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import {
    ApiGetFormsQuestions,
    ApiUpdateLoyaltyCard,
    ApiDeleteLoyaltyCard,

} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class LoyaltyCardDetails extends React.Component {
    constructor(props) {
        super(props)
        this.animatedValue2 = new Animated.Value(0);
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
            opacity: new Animated.Value(1),
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            formDetails: this.props.formDetails,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            photo: null,
            profileimageBlob: null,

            selectedSignatute: [],
            selectedImageData: [],
            singleFile: null,
            isflipFrontImage: true,
            iseditloyaltycard: false,
            isLoyaltyFrontImageLoading: false,
            isLoyaltyBackImageLoading: false,
            loyaltycardfrontphotoBlob: null,
            loyaltycardbackphotoBlob: null,
            loyaltycardfrontphoto: null,
            loyaltycardbackphoto: null,
            whitelabelsettings: [],
            isloyaltycarddetails: true,
            isRotateImage: false,
            frontImageWidth: 0,
            frontImageHeight: 0,
            backImageWidth: 0,
            backImageHeight: 0,
            requiredCardHeight: dimensionsProps.fullHeight * 0.6,
            imagemodalVisible: false
        }
        this.onCheckValueChange = this.onCheckValueChange.bind(this)
        this.onBackLoyaltyCard = this.onBackLoyaltyCard.bind(this)
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInLoyaltyCardDetails(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    handleTextInputChange = (newText) => {
        this.setState({ employeenumber: newText })
    }
    async onBackLoyaltyCard() {
        await this.setState({
            iseditloyaltycard: false,
            isloyaltycarddetails: false
        })
        this.props.onBackFormQuestion();
    }
    componentDidMount() {

        if (this.state.formDetails.loyalty_card_front_image != "") {
            Image.prefetch(this.state.formDetails.loyalty_card_front_image, () => console.log('Image is being fetched'));
            Image.getSize(this.state.formDetails.loyalty_card_front_image, (width, height) => {
                let ratio;
                if (width > height) {
                    ratio = Math.min(dimensionsProps.fullWidth / width, dimensionsProps.fullHeight / height);
                    let heightR = height * ratio;
                    let reqWidth = (width * ratio) < dimensionsProps.fullWidth ? dimensionsProps.fullWidth - 45 : (width * ratio);
                    this.setState({
                        frontImageWidth: reqWidth,
                        frontImageHeight: (heightR < this.state.requiredCardHeight) ? this.state.requiredCardHeight : heightR
                    });

                } else {
                    ratio = Math.min(dimensionsProps.fullWidth / height, this.state.requiredCardHeight / width);
                    // this.setState({
                    //     isRotateFrontImage: true
                    // })
                    let heightR = height * ratio;
                    let reqWidth = (width * ratio) < dimensionsProps.fullWidth ? dimensionsProps.fullWidth - 45 : (width * ratio);
                    this.setState({
                        frontImageWidth: reqWidth,
                        frontImageHeight: heightR
                    });// (heightR < this.state.requiredCardHeight) ? this.state.requiredCardHeight : heightR });

                }
                // console.log("front Image :original width: " + width + " original height: " + height
                //     + " converted width:: " + " : " + this.state.frontImageWidth
                //     + " converted height:: "
                //     + this.state.frontImageHeight + " aspect ratio: " + ratio
                //     + " : required height:" + this.state.requiredCardHeight + " : c height: " + heightR);
            }, (error) => {
            });
        }
        if (this.state.formDetails.loyalty_card_back_image != "") {
            Image.prefetch(this.state.formDetails.loyalty_card_back_image, () => console.log('Image is being fetched'));
            Image.getSize(this.state.formDetails.loyalty_card_back_image, (width, height) => {
                let ratio;
                if (width > height) {
                    ratio = Math.min(dimensionsProps.fullWidth / width, dimensionsProps.fullHeight / height);
                } else {
                    this.setState({
                        isRotateImage: true
                    })
                    ratio = Math.min(dimensionsProps.fullWidth / height, this.state.requiredCardHeight / width);
                }
                let heightR = height * ratio;
                let reqWidth = (width * ratio) < dimensionsProps.fullWidth ? dimensionsProps.fullWidth - 45 : (width * ratio);
                this.setState({
                    backImageWidth: reqWidth,
                    backImageHeight: heightR
                });

            }, (error) => {
            });
            // Image.getSize(this.state.formDetails.loyalty_card_back_image, (width, height) => {
            //     if (width <= height) {
            //         this.setState({
            //             isRotateImage: true
            //         })
            //     }
            // }, (error) => {
            // });
        }
        this.setState({
            isLoyaltyFrontImageLoading: true,
            isLoyaltyBackImageLoading: true
        })
    }
    componentWillUnmount() {
    }
    flip_Card_Animation = () => {
        Animated.spring(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        this.setState({ isflipFrontImage: !this.state.isflipFrontImage, isRotateFrontImage: false })
    }
    onEditLoyaltyCardVisible = () => {
        this.setState({ isloyaltycarddetails: false, iseditloyaltycard: true })
    }
    onChangeRotateImage = () => {
        this.setState({ isRotateFrontImage: !this.state.isRotateFrontImage })
    }
    onSelectCardImage = (typeofimage) => {
        var that = this;
        async function requestCameraPermission() {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'AndoridPermissionExample App Camera Permission',
                    message: 'AndoridPermissionExample App needs access to your camera ',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                that.proceed(typeofimage);
            } else {
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission();
        } else {
            this.proceed(typeofimage);
        }
    }
    proceed = (typeofimage) => {
        const options = {
            title: 'Select a photo',
            takePhotoButtonTitle: 'Take a photo',
            chooseFromLibraryButtonTitle: 'Choose from gallery',
            quality: 1
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else {
                let source = { uri: response.uri }
                if (typeofimage == ConstantValues.CARD_FRONT_IMAGE_STR) {
                    this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: response.data });
                }
                else {
                    this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: response.data });
                }
            }
        });
    }
    onLoyaltyCardEdit = () => {
        const {
            userData,
            loyaltycardname,
            loyaltycardfrontphotoBlob,
            loyaltycardbackphotoBlob,
            formDetails
        } = this.state;
        this.setState({ isLoading: true, iseditloyaltycard: false, isLoyaltyBackImageLoading: false, isLoyaltyFrontImageLoading: false })
        let imagefrontCardString = "";
        if (loyaltycardfrontphotoBlob != null) {
            imagefrontCardString = loyaltycardfrontphotoBlob;
        }
        else {
            imagefrontCardString = formDetails.loyalty_card_front_image;
        }
        let imagebackCardString = "";
        if (loyaltycardbackphotoBlob != null) {
            imagebackCardString = loyaltycardbackphotoBlob;
        }
        else {
            imagebackCardString = formDetails.loyalty_card_back_image;
        }
        ApiUpdateLoyaltyCard(
            userData[0].employee_company_id,
            userData[0].id,
            formDetails.loyalty_card_name,
            imagefrontCardString,
            imagebackCardString,
            formDetails.loyalty_card_id,
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.length > 0) {
                this.props.onBackFormQuestion();
            }
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    onLoyaltyCardDelete = () => {
        const {
            userData,
            formDetails,
        } = this.state;
        this.setState({ isLoading: true, iseditloyaltycard: false, isLoyaltyBackImageLoading: false, isLoyaltyFrontImageLoading: false })
        ApiDeleteLoyaltyCard(
            formDetails.loyalty_card_id,
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            this.props.onBackFormQuestion();
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    selectFile = async (item) => {
        const { formsData } = this.state;
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            item.formname = res.name;
            item.file_type = res.name;
            this.setState({
                formsData
            });

            this.setState({ singleFile: res })
            this.convertFileToBlob(res, item);
        } catch (err) {
            this.setState({ singleFile: null })
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.log('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };
    convertFileToBlob = async (filedata, item) => {
        const { formsData } = this.state;
        var data = await RNFS.readFile(filedata.uri, 'base64').then(res => {
            item.todaydate = res;
            this.setState({ formsData });
            return res
        });
    }
    getFormQuestions() {
        const { userData, formDetails } = this.state;
        this.setState({
            isLoading: true,
            locationData: []
        })
        let todaydate = "";
        let params = "?form_id=" + formDetails.id
        ApiGetFormsQuestions(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    let question_options = []
                    if (response[i].question_type == "DatePicker") {
                        todaydate = "Select Date";
                    }
                    else {
                        todaydate = "";
                    }
                    if (response[i].question_options.length > 0) {
                        for (let j = 0; j < response[i].question_options.length; j++) {
                            question_options.push({
                                label: response[i].question_options[j].label,
                                isSwitch: false,
                            })
                        }
                    }
                    data.push({
                        id: response[i].form_question_id,
                        question_label: response[i].question_label,
                        question_type: response[i].question_type,
                        dependent_answer: response[i].dependent_answer,
                        question_tag: response[i].question_tag,
                        start_date: response[i].start_date,
                        end_date: response[i].end_date,
                        correct_answer: response[i].correct_answer,
                        isSwitch: false,
                        question_options: question_options,
                        todaydate: todaydate,
                        formname: "",
                        file_type: ""
                    })
                }
                this.setState({
                    formsData: data,
                });
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);

            //Hello, I fixed api error handler
        })
    }


    handleDatePicked = (date) => {

        const { formsData } = this.state;
        for (let i = 0; i < this.state.formsData.length; i++) {
            if (this.state.selectedDateRow.id == formsData[i].id) {
                formsData[i].todaydate = Moment(new Date(date)).format('YYYY-MM-DD');
                this.setState({
                    formsData
                })
            }
        }
        this.hideDateTimePicker();
    }
    showDateTimePicker = (item) => {
        this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
    }
    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
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
    onCheckValueChange(item, option, index) {
        const { formsData } = this.state;
        option.isSwitch = !option.isSwitch
        this.setState({
            formsData
        })
    }


    onDropDownValueChange(item, index) {
        const { formsData } = this.state
        for (let i = 0; i < formsData.length; i++) {
            if (item.catid == formsData[i].id) {
                formsData[i].todaydate = item.name
            }
        }
        this.setState({
            formsData,
            isDropDownVisible: false
        })
    }
    renderRowEditLoyaltyCard() {
        return <EditLoyaltyCardView
            userData={this.props.userData}
            formDetails={this.state.formDetails}
            onBackFormQuestion={this.onBackLoyaltyCard}
            navigation={this.props.navigation}
        />
    }
    renderRowLoyaltyCardDetails() {
        return <View style={{
            flex: 1,
            marginBottom: 10
        }}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: this.state.header_background_color != "" ?
                    this.state.header_background_color : colors.COLOR_THEME,
                paddingVertical: 8,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        paddingHorizontal: 5
                    }}
                    onPress={this.props.onBackFormQuestion}
                >
                    <Image source={Constantimages.back_icon}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: colors.COLOR_WHITE
                        }}
                    >
                    </Image>
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: fontsProps.lg, fontWeight: 'bold',
                        textAlign: 'center',
                        color: this.state.header_text_color != "" ?
                            this.state.header_text_color : colors.COLOR_WHITE,
                    }}>{this.state.formDetails.loyalty_card_name}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        paddingHorizontal: 5
                    }}
                    onPress={() => {
                        this.onEditLoyaltyCardVisible()
                    }}
                >
                    <Image source={Constantimages.edit_icon}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: colors.COLOR_WHITE
                        }}
                    >
                    </Image>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginVertical: 10
            }}>
                <TouchableOpacity onPress={() => {
                    this.onChangeRotateImage()
                }}>
                    <Image source={this.state.isRotateFrontImage ? Constantimages.rotate_right_icon : Constantimages.rotate_left_icon}
                        style={{
                            width: 45, height: 45,
                            tintColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME
                        }} />
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginBottom: 10,
                }}>
                    {(this.state.formDetails.loyalty_card_front_image != ""
                        && this.state.isflipFrontImage) &&
                        <View style={{
                            height: dimensionsProps.fullHeight * 0.7,
                            width: dimensionsProps.fullWidth - 15,
                            backgroundColor: colors.COLOR_WHITE,
                        }}>
                            <Image source={{
                                uri: this.state.formDetails.loyalty_card_front_image,
                                cache: "force-cache"
                            }}
                                onLoadEnd={() => {
                                    this.setState({ isLoyaltyFrontImageLoading: false })
                                }}
                                style={{
                                    transform: [{ rotate: this.state.isRotateFrontImage ? '270 deg' : '0 deg' }],
                                    height: this.state.frontImageHeight,
                                    width: this.state.frontImageWidth,
                                    alignSelf: 'center',
                                }}
                                resizeMode="contain"
                            >
                            </Image>
                            <ActivityIndicator
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                                size='large'
                                color={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
                                animating={this.state.isLoyaltyFrontImageLoading} />
                        </View>
                    }
                    {(this.state.formDetails.loyalty_card_back_image != "" &&
                        this.state.isflipFrontImage != true) &&
                        <View style={{
                            height: dimensionsProps.fullHeight * 0.7,
                            width: dimensionsProps.fullWidth - 15,
                            backgroundColor: colors.COLOR_WHITE,
                        }}>
                            <Image
                                source={{
                                    uri: this.state.formDetails.loyalty_card_back_image,
                                    cache: "force-cache"
                                }}
                                onLoadEnd={() => {
                                    this.setState({ isLoyaltyBackImageLoading: false })
                                }}
                                style={{
                                    // transform: [{ rotate: this.state.isRotateImage ? '270 deg' : '0 deg' }],
                                    transform: [{ rotate: this.state.isRotateFrontImage ? '270 deg' : '0 deg' }],
                                    height: this.state.backImageHeight,
                                    width: this.state.backImageWidth,
                                    alignSelf: 'center',
                                }}
                                resizeMode="contain"
                            >
                            </Image>
                            <ActivityIndicator
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                                size='large'
                                color={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
                                animating={this.state.isLoyaltyBackImageLoading} />
                        </View>
                    }
                    <View style={{ flex: 0.5, }}>
                        {(this.state.formDetails.loyalty_card_front_image != "" && this.state.isflipFrontImage != true) &&
                            <Text style={{
                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.COLOR_BLACK,
                                textAlign: 'center'
                            }}>{ConstantValues.CARD_BACK_IMAGE_STR}</Text>
                        }
                        {(this.state.formDetails.loyalty_card_front_image != "" && this.state.isflipFrontImage) &&
                            <Text style={{
                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.COLOR_BLACK,
                                textAlign: 'center'
                            }}>{ConstantValues.CARD_FRONT_IMAGE_STR}</Text>
                        }
                        <TouchableOpacity
                            style={{
                                width: dimensionsProps.fullWidth / 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: paddingProps.sm,
                                paddingHorizontal: paddingProps.tosm,
                                alignSelf: 'center',
                                marginVertical: 5,
                                borderRadius: 5,
                                backgroundColor: this.state.action_button_background != "" ?
                                    this.state.action_button_background : colors.COLOR_THEME,
                            }}
                            onPress={this.flip_Card_Animation.bind(this)}
                        >
                            <Text style={{
                                fontSize: fontsProps.md, paddingVertical: 5,
                                color: colors.COLOR_WHITE,
                                fontWeight: 'bold', marginHorizontal: 5
                            }}>{ConstantValues.FLIP_IMAGE}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
            />
            {this.state.isDropDownVisible &&
                <Modal
                    visible={this.state.isDropDownVisible}
                    transparent={true}
                    onRequestClose={() => {
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                isDropDownVisible: false
                            })
                        }}
                    >
                        <View
                            transparent={true}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 50
                            }}
                        >
                            <View style={{
                                width: dimensionsProps.fullWidth - 35,
                                backgroundColor: colors.COLOR_WHITE,
                            }}>
                                <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                                </View>
                                <View style={{ paddingBottom: 40, paddingHorizontal: 5 }}>
                                    <ScrollView>
                                        {this.state.dropDownDetails.map((item, index) => (
                                            <TouchableOpacity style={{
                                                backgroundColor: colors.COLOR_WHITE
                                            }} key={index}
                                                onPress={() =>
                                                    this.onDropDownValueChange(item, index)
                                                }>
                                                <Text style={{
                                                    paddingVertical: 10,
                                                    fontSize: fontsProps.md
                                                }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            }

            {this.renderProgressDialogLoader()}
        </View>
    }
    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                {this.state.isloyaltycarddetails &&
                    this.renderRowLoyaltyCardDetails()
                }
                {this.state.iseditloyaltycard &&
                    this.renderRowEditLoyaltyCard()
                }
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10
    },
})