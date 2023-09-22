import Moment from 'moment';
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
export default class ActualMonthsView extends React.Component {
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
            monthDetails: this.props.rewordDetails,
            clubMonthList: this.props.clubMonthList,
            count: 0
        }
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInActualMonthsView(ConstantValues.MORE_STR);
    }
    handleTextInputChange = (newText) => {
        this.setState({ quantity: newText })
    }
    componentDidMount() {
        let valuecount = parseInt(this.state.monthDetails.CSI) +
            parseInt(this.state.monthDetails.vacancy_share)
            + parseInt(this.state.monthDetails.wellness)
            + parseInt(this.state.monthDetails.virtual_transaction)
            + parseInt(this.state.monthDetails.market_visit)
            + parseInt(this.state.monthDetails.values_nominated)
            + parseInt(this.state.monthDetails.values_nominator)
            + parseInt(this.state.monthDetails.flash_book);
        this.setState({
            count: valuecount
        })
        // console.log("MONTH DETAILS:", JSON.stringify(this.state.monthDetails));
        // for(let i=0;i<responseJson.length;i++){

        // pData.push({
        //     id:i,
        //     month:responseJson[i].month,
        //     CSI:responseJson[i].CSI,
        //     vacancy_share:responseJson[i].vacancy_share,
        //     wellness:responseJson[i].wellness,
        //     virtual_transaction:responseJson[i].virtual_transaction,
        //     market_visit:responseJson[i].market_visit,
        //     values_nominated:responseJson[i].values_nominated,
        //     values_nominator:responseJson[i].values_nominator,
        //     flash_book:responseJson[i].flash_book,
        //    isSwitch:false,

        // })
        // }

        // console.log("clubMonthList)"+JSON.stringify(this.state.clubMonthList))
        // this.getWhiteLabelSettings()
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
            quantity
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
                            }}>
                            {this.showMonthData("Actuals ", this.state.monthDetails.monthDate)}
                            {/* {this.state.monthDetails.month == 1 ? "Actuals Jan 2021" : this.state.monthDetails.month == 2 ? "Actuals Feb 2021" : this.state.monthDetails.month == 3 ? "Actuals Mar 2021" : this.state.monthDetails.month == 4 ? "Actuals Apr 2021" : this.state.monthDetails.month == 5 ? "Actuals May 2021" : this.state.monthDetails.month == 6 ? "Actuals Jun 2021" : this.state.monthDetails.month == 7 ? "Actuals Jul 2021" : this.state.monthDetails.month == 8 ? "Actuals Aug 2021" : this.state.monthDetails.month == 9 ? "Actuals Sep 2021" : this.state.monthDetails.month == 10 ? "Actuals Oct 2021" : this.state.monthDetails.month == 11 ? "Actuals Nov 2021" : this.state.monthDetails.month == 12 ? "Actuals Dec 2021" : "" */}

                            {/* } */}
                        </Text>
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

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            margin: 10,
                            backgroundColor: 'white',
                            elevation: 3,
                            borderRadius: 5,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            paddingHorizontal: 10
                        }}
                    >
                        <View>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: this.state.header_background_color != "" ?
                                    this.state.header_background_color : colors.COLOR_THEME,

                                paddingVertical: 5
                            }}>{this.showMonthData("", this.state.monthDetails.monthDate)}
                                {/* {this.state.monthDetails.month == 1 ? "Jan 2021" : this.state.monthDetails.month == 2 ? "Feb 2021" : this.state.monthDetails.month == 3 ? "Mar 2021" : this.state.monthDetails.month == 4 ? "Apr 2021" : this.state.monthDetails.month == 5 ? "May 2021" : this.state.monthDetails.month == 6 ? "Jun 2021" : this.state.monthDetails.month == 7 ? "Jul 2021" : this.state.monthDetails.month == 8 ? "Aug 2021" : this.state.monthDetails.month == 9 ? "Sep 2021" : this.state.monthDetails.month == 10 ? "Oct 2021" : this.state.monthDetails.month == 11 ? "Nov 2021" : this.state.monthDetails.month == 12 ? "Dec 2021" : ""

                                } */}
                            </Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                paddingVertical: 5
                            }}>CSI</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Flash Book</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Market Visit</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Vacancy Share</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Values Nomination:Given</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Values Nomination:Received</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Virtual Transactions</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,

                                paddingVertical: 5
                            }}>Wellness</Text>

                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'right',
                                paddingVertical: 5
                            }}>Total</Text>

                        </View>
                        <View>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: this.state.header_background_color != "" ?
                                    this.state.header_background_color : colors.COLOR_THEME,
                                textAlign: 'center',
                                paddingVertical: 5
                            }}>
                                Points
                            </Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.CSI}</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.flash_book}</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.market_visit}</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.vacancy_share}</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>
                                {this.state.monthDetails.values_nominator}

                            </Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>

                                {this.state.monthDetails.values_nominated}


                            </Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.virtual_transaction}</Text>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.monthDetails.wellness}</Text>
                            <View style={{

                                height: 2,
                                width: 80,
                                backgroundColor: this.state.header_background_color != "" ?
                                    this.state.header_background_color : colors.COLOR_THEME,

                            }}>
                            </View>
                            <Text style={{

                                fontSize: fontsProps.lg, fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingVertical: 5

                            }}>{this.state.count}</Text>
                            <View style={{

                                height: 2,
                                width: 80,
                                marginBottom: 10,
                                backgroundColor: this.state.header_background_color != "" ?
                                    this.state.header_background_color : colors.COLOR_THEME,

                            }}>
                            </View>
                        </View>
                    </View>


                </ScrollView>
                {this.renderProgressDialogLoader()}
            </View>
        );
    }

    showMonthData = (title, value) => {
        // console.log("VALUE", value);

        return title + Moment(value).format('MMM YYYY')

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