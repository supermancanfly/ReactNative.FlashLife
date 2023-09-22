import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    PermissionsAndroid,
    Animated,
    Keyboard,
    Alert
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import Constantimages from '../utils/ConstantImages';
import MaterialButton from "../components/shared/MaterialButton";
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { apiErrorHandler, ValidateAlertPop } from '../utils/CommonMethods';
import {
    ApiGetRedemPoints,
    ApiRewordRedemptionCreate,
    ApiGetWhiteLabelSettings,
} from '../network/Services';
export default class VocherDetailsView extends React.Component {
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
            opacity: new Animated.Value(0),
            isLoading: false,
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            photo: null,
            profileimageBlob: null,
            isSignatureCapture: false,
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
            loyaltycardname: "",
            quantity: "1",
            keyboardHeight: 0,
            inputHeight: Platform.OS == 'ios' ? 40 : 0,
            rewordDetails: this.props.rewordDetails,
            clubMonthList: this.props.clubMonthList
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInVocherDetailsView(ConstantValues.MORE_STR);
    }
    handleTextInputChange = (newText) => {
        this.setState({ quantity: newText })
    }
    componentDidMount() {
        this.getWhiteLabelSettings()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onRedemReward() {
        // auth_token,
        // reward_id,
        // company_id,
        // user_id,
        // selected_quantity
        const {
            userData,
            quantity
        } = this.state;
        this.setState({ isLoading: true, })
        ApiRewordRedemptionCreate(
            this.state.userData[0].token,
            this.state.rewordDetails.reward_id,
            this.state.rewordDetails.company_id,
            this.state.userData[0].id,
            quantity,
            this.state.rewordDetails.reward_type_details[0].reward_type_name
        ).then(responseJson => {
            this.setState({ isLoading: false });
            // this.props.onBackFormQuestion()
            if (responseJson.status == "success") {
                this.getRedemPoints(responseJson.points_redeemed, responseJson.yearly_points, responseJson.result)
            }
            else {
                ValidateAlertPop(responseJson.message)
            }
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    getRedemPoints = (points_redeemed, yearly_points, message) => {
        const { userData } = this.state;
        let params = "?user_id=" + this.state.userData[0].id + "&points_redeemed=" + points_redeemed + "&yearly_points=" + yearly_points;
        // ?user_id=223&parameters=points_redeemed,yearly_points
        // let params = "?user_id="+this.state.userData[0].id+"&parameters="+points_redeemed,yearly_points;
        this.setState({ isLoading: true })
        ApiGetRedemPoints(this.state.userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            //   if (responseJson.length > 0) {
            // this.setState({ rewordList: responseJson })
            // ValidateAlertPop(message)
            if (Platform.OS == 'ios') {
                setTimeout(() => {
                    Alert.alert(
                        '',
                        message,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion()
                            }
                        ],
                        { cancelable: true },
                    )
                }, 1500);
            }
            else {
                Alert.alert(
                    '',
                    message,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion.bind(this)
                        }
                    ],
                    { cancelable: false },
                )
            }

        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    setWhiteLables = async (responseJson) => {
        ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
        ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
        ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
        ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
        ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
        ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
        ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
        ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
        ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
        await this.setState({
            whitelabelsettings: responseJson
        })
    }
    _keyboardDidShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }
    _keyboardDidHide(e) {
        this.setState({ keyboardHeight: 0 });
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
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
    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={styles.backbuttonstyle}
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
                    <View style={
                        styles.titlecontainer
                    }>
                        <Text style={
                            {
                                fontSize: fontsProps.lg,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: this.state.header_text_color != "" ?
                                    this.state.header_text_color : colors.COLOR_WHITE,
                            }}>{ConstantValues.VOUCHERS_STR}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.backbuttonstyle}
                    >
                        <Image source={null}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: colors.COLOR_WHITE
                            }}
                        >
                        </Image>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        flex: 1,
                    }}
                    keyboardShouldPersistTaps='always'
                >

                    <Text style={{
                        fontSize: fontsProps.lg, fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        textAlign: 'center',
                        paddingVertical: 5
                    }}>{this.state.rewordDetails.reward_name}</Text>
                    <View style={{
                        width: 170,
                        height: 170,
                        borderWidth: 2,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        borderColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                    }}>
                        {this.state.rewordDetails.reward_image != "" && this.state.rewordDetails.reward_image != null ?
                            <Image source={{ uri: this.state.rewordDetails.reward_image }}
                                style={{
                                    width: 170 / 2,
                                    height: 170 / 2,
                                    alignSelf: 'center',
                                    // tintColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                }}
                            >
                            </Image>
                            :
                            <Image source={Constantimages.vocher_placeholder_icon}
                                style={{
                                    width: 170 / 2,
                                    height: 170 / 2,
                                    alignSelf: 'center',
                                    // paddingVertical: 5,
                                    tintColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                }}
                            >
                            </Image>
                        }
                    </View>
                    <Text style={{
                        fontSize: fontsProps.lg,
                        color: colors.GREY_COLOR,
                        textAlign: 'center',
                        paddingVertical: 5,
                        paddingHorizontal: 5
                    }}>{this.state.rewordDetails.reward_description}</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>Voucher Value: </Text>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>
                            {/* RS 200 */}
                            R{this.state.rewordDetails.reward_value}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>Points Available: </Text>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>

                            {/* {this.state.clubMonthList.length!=0&&this.state.clubMonthList[this.state.clubMonthList.length-1].yearly_points} Pts */}
                            {this.state.clubMonthList.length != 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].yearly_points} Pts
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>{ConstantValues.POINTS_REQUIRED_STR}: </Text>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>
                            {this.state.rewordDetails.reward_points} Pts

                            {/* {
                                    this.state.rewordDetails.reward_type_details[0].reward_type_name
                                } */}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        borderRadius: 5,
                    }}>
                        <Text style={{
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            textAlign: 'center',
                            paddingVertical: 5
                        }}>{ConstantValues.SELECT_QUANTITY_STR}</Text>
                        <TextInput
                            style={{
                                width: 50,
                                height: 30,
                                paddingVertical: 5,
                                borderRadius: 5,
                                marginLeft: 20,

                                borderColor: this.state.header_background_color != "" ? this.state.header_background_color
                                    : colors.COLOR_THEME, borderWidth: 2, textAlign: 'center'
                            }}
                            underlineColorAndroid="transparent"
                            textAlignVertical='center'
                            value={this.state.quantity}
                            returnKeyType="done"
                            keyboardType='numeric'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={this.handleTextInputChange}
                        />
                    </View>
                    <MaterialButton
                        title={ConstantValues.REDIME_NOW_STR}
                        style={{
                            flexDirection: 'row',
                            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 15,
                            marginHorizontal: paddingProps.md,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            elevation: 10,
                            width: 200,
                            alignSelf: 'center',
                            marginBottom: this.state.keyboardHeight + this.state.inputHeight,
                            borderRadius: 30
                        }}
                        titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}
                        buttonPress={() => {
                            this.onRedemReward()
                        }}
                    />

                </ScrollView>
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backbuttonstyle: {
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    titlecontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})