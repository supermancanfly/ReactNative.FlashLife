import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
    TextInput,
    LayoutAnimation,
    UIManager,
    Alert
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import LunchInputComponent from '../components/lunch_items/LunchInputComponent';
import CurrentBookingsView from './CurrentBookingsView';
import MaterialButton from "../components/shared/MaterialButton";
import { DateButton } from '../components/lunch_items/lunch_items_renders';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import Moment from 'moment';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
    ApiGetWhiteLabelSettings,
    ApiGetCurrentLunchItems,
    ApiDeleteCurrentOrderItem
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class CurrentLunchListView extends React.Component {
    constructor(props) {
        super(props)
        // this.onSelectGuestOrderItem.bind(this)
        this.onSelectGuestOrderItem = this.onSelectGuestOrderItem.bind(this);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }

        this.state = {
            lunchmenuList: [],
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isLoading: false,
            userData: this.props.userData,
            whitelabelsettings: [],
            clubMonthList: [],
            isOrderDateOpen: false,
            valueNominationList: [],
            additionalnotes: "",
            isLunchSubmitted: false,
            isLunchSetupsCurrentlyUnavailable: false,
            lunchList: [
                {
                    id: 1,
                    titlename: ConstantValues.JULY_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 2,
                    titlename: ConstantValues.AUG_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "25"
                },
                {
                    id: 3,
                    titlename: ConstantValues.SEP_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 4,
                    titlename: ConstantValues.OCT_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 5,
                    titlename: ConstantValues.NOV_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 6,
                    titlename: ConstantValues.DEC_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
            ],
            clubScoresList: [],
            pointsByMonth: [],
            monthcount: 0
        }
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInCurrentLunchView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        console.log("ComponentDidMount");
        this.getCurrentLunchSetupOpenList();
    }


    handleAdditionalSettings = (newText) => this.setState({ additionalnotes: newText })

    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        const { userData } = this.state;
        let params = `?company_id=${ConstantValues.COMPANY_ID_STR}`;
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



    // company_id=&user_id=
    setWhiteLables = async (responseJson) => {
        // console.log("this.state.whitelabelsettings0" + JSON.stringify(responseJson))
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
        // console.log("this.state.whitelabelsettings---1" + JSON.stringify(this.state.whitelabelsettings))
    }
    componentWillUnmount() {
    }

    onSeeMoreItem = (item, itemorder) => {
        itemorder.isSeeMore = !itemorder.isSeeMore;
        this.setState({})
    }
    renderProgressDialogLoader() {
        if (this.state.isLoading) {
            return (
                <ProgressDialog
                    background={this.state.header_background}
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                />
            )
        }
    }

    getCurrentLunchSetupOpenList = async () => {
        const { userData } = this.state;
        let params = `?company_id=${userData[0].employee_company_id}&status=&user_id=${userData[0].id}&location_id=${userData[0].employed_location_id}`;
        this.setState({
            isLoading: true
        })
        let data = [];
        // console.log("PARAMS", params);
        await ApiGetCurrentLunchItems(userData[0].token, params).then(responseJson => {
            // console.log("RESPONSE : ", JSON.stringify(responseJson));
            this.setState({ isLoading: false });
            let data = [];
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {

                    let mainOrderList = [];
                    let guestOrderList = [];

                    let lunch_order_id = responseJson[i].lunch_order_id;
                    let company_id = responseJson[i].company_id;
                    let user_id = responseJson[i].user_id;
                    let date = responseJson[i].date;
                    let lunch_item_id = responseJson[i].lunch_item_id;
                    let lunch_setup_id = responseJson[i].lunch_setup_id;
                    let guest = responseJson[i].guest;
                    let guest_name = responseJson[i].guest_name;
                    let guest_email = responseJson[i].guest_email;
                    let comments = responseJson[i].comments;
                    let delete_restriction = responseJson[i].delete_restriction;
                    let lunch_item_details = responseJson[i].lunch_item_details;

                    let item_name = lunch_item_details[0].item_name;
                    let item_ingredients = lunch_item_details[0].item_ingredients;
                    let halaal = lunch_item_details[0].halaal;
                    let image = lunch_item_details[0].image;

                    if (guest === '0') {
                        mainOrderList.push({
                            orderid: lunch_order_id,
                            id: lunch_item_id,
                            company_id: company_id,
                            date: date,
                            titlename: item_name,
                            icon: image,
                            guestname: guest_name,
                            guestemail: guest_email,
                            item_ingredients: item_ingredients,
                            guest: guest,
                            halaal: halaal,
                            comments: comments,
                            isSwitch: false,
                            delete_restriction: delete_restriction,
                            isSeeMore: false,
                        })
                    } else {
                        guestOrderList.push({
                            orderid: lunch_order_id,
                            id: lunch_item_id,
                            company_id: company_id,
                            date: date,
                            titlename: item_name,
                            icon: image,
                            guestname: guest_name,
                            guestemail: guest_email,
                            item_ingredients: item_ingredients,
                            guest: guest,
                            halaal: halaal,
                            comments: comments,
                            isSwitch: false,
                            delete_restriction: delete_restriction,
                            isSeeMore: false,
                        })
                    }

                    if (data.length == 0) {
                        data.push({
                            id: lunch_setup_id,
                            isSwitch: false,
                            orderList: mainOrderList,
                            guestOrderList: guestOrderList,
                            lunchdate: date,
                            isSelectOrder: false,
                            comments: comments,
                        });
                    } else {
                        let isExist = false;
                        let index = -1;
                        for (let j = 0; j < data.length; j++) {
                            // console.log("LUNCH DATE:1212: ", data[j].lunchdate, " : ", responseJson[i].date);
                            if (data[j].lunchdate === responseJson[i].date) {
                                // console.log("LUNCH DATE: ", data[j].lunchdate, " : ", responseJson[i].date);
                                isExist = true;
                                index = j;
                            }
                        }

                        if (isExist) {
                            if (mainOrderList.length > 0)
                                data[index].orderList.push(mainOrderList[0])
                            // console.log("Data ORDER LIST: ", JSON.stringify(data[index].orderList));
                            // data[index].orderList = mainOrderList;
                            if (guestOrderList.length > 0)
                                data[index].guestOrderList.push(guestOrderList[0]);
                        } else {
                            data.push({
                                id: lunch_setup_id,
                                isSwitch: false,
                                orderList: mainOrderList,
                                guestOrderList: guestOrderList,
                                lunchdate: date,
                                isSelectOrder: false,
                                comments: comments,
                            });
                        }
                    }
                }

                let newData = data.sort((a, b) => {
                    return new Date(a.lunchdate) - new
                        Date(b.lunchdate)
                }
                );
                this.setState({
                    lunchmenuList: data
                })
                if (data.length == 0) {
                    this.setState({ isLunchSetupsCurrentlyUnavailable: false })
                }
                else {
                    this.setState({ isLunchSetupsCurrentlyUnavailable: true })

                }

            }
            else {
                this.setState({ isLunchSetupsCurrentlyUnavailable: false })
            }

        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }



    addAnotherGuest = (item, index) => {

        item.dynamicGuestList.push({
            id: item.dynamicGuestList.length + 1,
            orderList: this.state.orderList,
            value: "",
            isaddGuestSwitch: false,
            view: <View
                style={{
                }}>
                <Text style={{
                    fontSize: fontsProps.lg,
                    fontWeight: 'bold',
                    color: colors.GREY_COLOR,
                    marginVertical: 5
                }}>Guest Name
                </Text>
                <TextInput
                    style={{
                        flexDirection: 'row',
                        color: colors.COLOR_BLACK,
                        width: '100%',
                        borderWidth: 1,
                        marginBottom: 5,
                        backgroundColor: colors.COLOR_WHITE,
                        borderColor: this.state.header_background != "" ?
                            this.state.header_background :
                            colors.COLOR_THEME,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                    }}
                    // placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                    underlineColorAndroid="transparent"

                    value={item.dynamicInputData.guestname}
                    onChangeText={text => {
                        let { lunchList } = this.state;
                        item.dynamicInputData.guestname = text;

                        this.setState({

                        });
                    }}
                    keyboardType='default'
                    returnKeyType="done"
                />

                <Text style={{
                    fontSize: fontsProps.lg,
                    fontWeight: 'bold',
                    color: colors.GREY_COLOR,
                    marginVertical: 5
                }}>Guest Email
                </Text>
                <TextInput
                    style={{
                        flexDirection: 'row',
                        color: colors.COLOR_BLACK,
                        width: '100%',
                        borderWidth: 1,
                        marginBottom: 5,
                        backgroundColor: colors.COLOR_WHITE,
                        borderColor: this.state.header_background != "" ?
                            this.state.header_background :
                            colors.COLOR_THEME,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: Platform.OS == 'ios' ? 10 : 5,

                    }}

                    underlineColorAndroid="transparent"

                    keyboardType='default'
                    returnKeyType="done"
                />

                <View>
                    {

                        item.guestOrderList.map((guestitem, key) => (
                            <View key={key}>
                                <View style={{
                                    backgroundColor: '#FFFFFF',
                                    flex: 1,
                                    flexDirection: 'row',
                                    padding: 5,
                                    borderRadius: 5,
                                    margin: 5,
                                    justifyContent: 'space-between'
                                }}>

                                    <Image source={guestitem.icon}
                                        style={{
                                            width: 90 / 2,
                                            height: 90 / 2,
                                            alignSelf: 'center',

                                            paddingVertical: 5,
                                        }}
                                    >
                                    </Image>


                                    <View style={{
                                        justifyContent: 'center',

                                    }}>
                                        {/* <Text style={{
                                            fontSize: fontsProps.md,
                                            fontWeight: 'bold', color: '#616161',
                                            paddingHorizontal: 10
                                        }}>
                                            Order Title({guestitem.titlename})</Text> */}
                                        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontWeight: 'bold', color: '#616161',
                                                // paddingHorizontal: 10
                                            }}>
                                                Order Title
                                            </Text>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontWeight: 'bold',
                                                color: this.state.header_background != "" ?
                                                    this.state.header_background :
                                                    colors.COLOR_THEME,
                                                paddingLeft: 5
                                            }}>
                                                ({guestitem.titlename})
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontSize: fontsProps.sm,
                                            color: '#616161',
                                            paddingHorizontal: 10
                                        }}>
                                            Ingredients</Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end'
                                    }}
                                        onPress={() => { this.onSelectGuestOrderItem(guestitem, key) }}
                                    >
                                        <Image source={
                                            guestitem.active ?
                                                Constantimages.checkfill_icon
                                                : Constantimages.checkcircle_icon
                                        }
                                            style={{
                                                width: 25, height: 25, resizeMode: 'contain',

                                                tintColor:
                                                    guestitem.active ?
                                                        this.state.header_background != "" ?
                                                            this.state.header_background :
                                                            colors.COLOR_THEME
                                                        :
                                                        colors.GREY_COLOR,
                                            }} />


                                    </TouchableOpacity>

                                </View>
                                <View style={{
                                    height: 0.5,
                                    backgroundColor: colors.GREY_COLOR
                                }}>
                                </View>

                            </View>

                        ))

                    }
                </View>
                {/* } */}

                <Text style={{
                    fontSize: fontsProps.lg,
                    fontWeight: 'bold',
                    color: colors.GREY_COLOR,
                    marginVertical: 5
                }}>
                    Notes
                    {/* {ConstantValues.ADDITIONAL_NOTES_STR} */}
                </Text>
                <TextInput
                    style={{
                        flexDirection: 'row',
                        color: colors.COLOR_BLACK,
                        width: '100%',
                        textAlignVertical: 'top',
                        backgroundColor: colors.COLOR_WHITE,
                        borderWidth: 1,
                        marginBottom: 5,
                        borderColor: this.state.header_background != "" ?
                            this.state.header_background :
                            colors.COLOR_THEME,
                        borderRadius: 5,
                        paddingHorizontal: 10,

                        paddingVertical: Platform.OS == 'ios' ? 30 : null,
                        height: Platform.OS == 'ios' ? 70 : null
                    }}
                    placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                    underlineColorAndroid="transparent"
                    numberOfLines={2}
                    multiline={true}

                    keyboardType='default'
                    returnKeyType="done"
                />
                {/* <View style={{
                    width: '100%', height: 5,
                    marginBottom: 10, marginTop: 5,
                    backgroundColor: this.state.header_background != "" ?
                        this.state.header_background :
                        colors.COLOR_THEME
                }}>

                </View> */}
            </View>
        }

        )

        item.dynamicInputData.push({
            guestname: "",
            isSwith: false,
            guestemail: "",
            additionalnotes: ""
        })
        this.setState({

        })
    }
    // guestsOrdersList:[],
    addGuest = (item, index) => {
        // console.log("Add Guest:---------------------item"+JSON.stringify(item))

        // console.log(item.dynamicGuestList)

        item.isAddGuest = !item.isAddGuest
        // if(item.dynamicGuestList.id)
        // for (let i = 0; i < item.dynamicGuestList.length; i++) {
        //     console.log("item.dynamicGuestList[i]" + JSON.stringify(item.dynamicGuestList))
        //     // if(item.dynamicGuestList[i].id==)

        // }

        this.setState({

        })
        if (item.dynamicGuestList.length == 0) {
            item.dynamicGuestList.push({
                id: item.dynamicGuestList.length + 1,
                orderList: this.state.orderList,
                value: "",
                isaddGuestSwitch: false,
                view: <View
                    style={{
                    }}>
                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                    }}>Guest Name
                    </Text>
                    <TextInput
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            borderWidth: 1,
                            marginBottom: 5,
                            backgroundColor: colors.COLOR_WHITE,
                            borderColor: this.state.header_background != "" ?
                                this.state.header_background :
                                colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                        }}

                        underlineColorAndroid="transparent"

                        value={item.dynamicInputData.guestname}
                        onChangeText={text => {
                            let { lunchList } = this.state;
                            item.dynamicInputData.guestname = text;

                            this.setState({

                            });
                        }}
                        keyboardType='default'
                        returnKeyType="done"
                    />

                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                    }}>Guest Email
                    </Text>
                    <TextInput
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            borderWidth: 1,
                            // marginBottom: 5,
                            backgroundColor: colors.COLOR_WHITE,
                            borderColor: this.state.header_background != "" ?
                                this.state.header_background :
                                colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 10 : 5,

                        }}
                        // placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                        underlineColorAndroid="transparent"

                        keyboardType='default'
                        returnKeyType="done"
                    />

                    <View>
                        {

                            item.guestOrderList.map((guestitem, key) => (
                                <View key={key}>
                                    <View style={{
                                        backgroundColor: colors.COLOR_WHITE,
                                        flex: 1,
                                        flexDirection: 'row',
                                        padding: 5,
                                        borderRadius: 5,
                                        margin: 5,
                                        justifyContent: 'space-between'
                                    }}>

                                        <Image source={guestitem.icon}
                                            style={{
                                                width: 90 / 2,
                                                height: 90 / 2,
                                                alignSelf: 'center',

                                                paddingVertical: 5,
                                            }}
                                        >
                                        </Image>


                                        <View style={{
                                            justifyContent: 'center',

                                        }}>
                                            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    fontWeight: 'bold', color: '#616161',
                                                    // paddingHorizontal: 10
                                                }}>
                                                    Order Title
                                                </Text>
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    fontWeight: 'bold',
                                                    color: this.state.header_background != "" ?
                                                        this.state.header_background :
                                                        colors.COLOR_THEME,
                                                    paddingLeft: 5
                                                }}>
                                                    ({guestitem.titlename})
                                                </Text>
                                            </View>
                                            <Text style={{
                                                fontSize: fontsProps.sm,
                                                color: '#616161',
                                                paddingHorizontal: 10
                                            }}>
                                                Ingredients</Text>
                                        </View>
                                        <TouchableOpacity style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end'
                                        }}
                                            onPress={() => { this.onSelectGuestOrderItem(guestitem, key) }}
                                        >
                                            <Image source={
                                                guestitem.active ?
                                                    Constantimages.checkfill_icon
                                                    : Constantimages.checkcircle_icon
                                            }
                                                style={{
                                                    width: 25, height: 25, resizeMode: 'contain',

                                                    tintColor:
                                                        guestitem.active ?
                                                            this.state.header_background != "" ?
                                                                this.state.header_background :
                                                                colors.COLOR_THEME
                                                            :
                                                            colors.GREY_COLOR,
                                                }} />


                                        </TouchableOpacity>

                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.GREY_COLOR }}>
                                    </View>

                                </View>

                            ))

                        }
                    </View>
                    {/* } */}

                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                    }}>{ConstantValues.ADDITIONAL_NOTES_STR}
                    </Text>
                    <TextInput
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            textAlignVertical: 'top',
                            backgroundColor: colors.COLOR_WHITE,
                            borderWidth: 1,
                            marginBottom: 5,
                            borderColor: this.state.header_background != "" ?
                                this.state.header_background :
                                colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingHorizontal: 10,

                            paddingVertical: Platform.OS == 'ios' ? 30 : null,
                            height: Platform.OS == 'ios' ? 70 : null
                        }}
                        placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                        // placeholder={"hi"}
                        underlineColorAndroid="transparent"
                        numberOfLines={2}
                        multiline={true}

                        keyboardType='default'
                        returnKeyType="done"
                    />
                    <View style={{
                        width: '100%', height: 5, marginTop: 5, marginBottom: 10, backgroundColor: this.state.header_background != "" ?
                            this.state.header_background :
                            colors.COLOR_THEME
                    }}>

                    </View>
                </View>
            }

            )

            item.dynamicInputData.push({
                guestname: "",
                isSwith: false,
                guestemail: "",
                additionalnotes: ""
            })
            this.setState({

            })
        }

    }

    handleCancelOrder = (item, itemorder, index) => {
        Alert.alert(
            '',
            ConstantValues.CANCEL_ORDER_STR,
            [
                {
                    text: "No", onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'
                },
                {
                    text: "Yes", onPress: () => this.onDeleteItem(item, itemorder, index),
                }
            ],
            { cancelable: false },
        )
        // return true;
    }

    onDeleteItem = async (item, itemorder, index) => {
        const { orderList, lunchmenuList } = this.state;
        let itemId = itemorder.orderid;
        this.setState({
            isLoading: true
        })


        await ApiDeleteCurrentOrderItem(this.state.userData[0].token, itemId).then((responseJson) => {
            this.setState({
                isLoading: false
            })
            this.getCurrentLunchSetupOpenList();

        }).catch(error => {
            this.setState({
                isLoading: false
            });
            //Hello, I fixed api error handler
        })
    }

    onSelectGuestOrderItem = (item, index) => {
        const { orderList, lunchmenuList } = this.state;
        item.active = !item.active
        this.setState({
            orderList,
            lunchmenuList
        })
    }
    onMenuOrderParticularDate = (item, index) => {
        const { orderList } = this.state;
        item.isSwitch = !item.isSwitch
        let isMenuListOpen = false

        for (let i = 0; i < this.state.lunchmenuList.length; i++) {

            if (this.state.lunchmenuList[i].isSwitch) {
                isMenuListOpen = true;

            }

        }
        this.setState({
            isOrderDateOpen: isMenuListOpen
        })
    }

    onSubmitDetails = async () => {
        this.setState({ isLunchSubmitted: true })
    }
    renderRowCurrentLunchNotAvailableView() {
        return <CurrentBookingsView
            userData={this.props.userData}
            // onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
            callBackMethodFromSubchildBookings={() => { }}
        />

    }

    renderRowLunchSetupsAvailable() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView contentContainerStyle={{
                    paddingVertical: 5
                }}>
                    {
                        this.state.lunchmenuList.map((item, i) =>
                        (

                            <View key={i.toString()} style={{ paddingHorizontal: 10, }}>
                                <View>
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                                            "Radomir Tinkov - Gilroy-Bold",
                                        paddingHorizontal: 10,
                                        marginTop: 15
                                    }}>
                                        {Moment(item.lunchdate).format("ddd - DD MMM")}

                                    </Text>
                                    <View>
                                        {
                                            item.orderList.map((itemorder, index) =>
                                            (
                                                <View key={index.toString()}>
                                                    <View style={{
                                                        backgroundColor: '#FFFFFF',
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        padding: 5,
                                                        borderRadius: 5,
                                                        margin: 5,
                                                        justifyContent: 'space-between'
                                                    }}>

                                                        <Image
                                                            source={{ uri: itemorder.icon }}
                                                            style={{
                                                                width: 88,
                                                                height: 88,
                                                                alignSelf: 'center',
                                                                paddingVertical: 5,
                                                                borderRadius: 12
                                                            }}
                                                        />
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            flex: 6
                                                        }}>
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingHorizontal: 10
                                                            }}>
                                                                <Text style={{
                                                                    fontSize: fontsProps.md,
                                                                    color: '#616161',
                                                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                }}>
                                                                    {itemorder.titlename}
                                                                </Text>
                                                            </View>
                                                            <Text style={{
                                                                fontSize: 12,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 3,
                                                                color: itemorder.halaal == "1" ? "#00C193" : "#A1A4B0",
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                            }}>
                                                                {itemorder.halaal == "1" ? "Halaal" : "Non-halaal"}
                                                            </Text>


                                                            {!itemorder.isSeeMore &&
                                                                <TouchableOpacity style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    paddingHorizontal: 10
                                                                }}
                                                                    onPress={() => { this.onSeeMoreItem(item, itemorder) }}>
                                                                    <Text style={{
                                                                        fontSize: fontsProps.md,
                                                                        color: '#0097F7',
                                                                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                    }}>
                                                                        See more
                                                                    </Text>

                                                                    <Image source={
                                                                        itemorder.isSeeMore ? Constantimages.arrowup_icon :
                                                                            Constantimages.arrow_down_icon}
                                                                        style={{
                                                                            width: 17,//itemorder.isSeeMore ? 20 : 20,
                                                                            height: 17,//itemorder.isSeeMore ? 20 : 20,
                                                                            resizeMode: 'contain',
                                                                            tintColor: '#0097F7',
                                                                        }} />

                                                                </TouchableOpacity>
                                                            }
                                                            {itemorder.isSeeMore &&
                                                                <Text style={{
                                                                    fontSize: fontsProps.sm,
                                                                    color: '#616161',
                                                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                                    paddingHorizontal: 10
                                                                }}>
                                                                    {itemorder.item_ingredients}
                                                                </Text>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                    </View>
                                </View>

                                {item.orderList.length > 0 &&
                                    <View>
                                        {item.orderList[0].comments != "" && <View>
                                            <Text style={{
                                                fontSize: fontsProps.lg,
                                                color: colors.GREY_COLOR,
                                                marginVertical: 5,
                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",

                                            }}>{ConstantValues.ADDITIONAL_NOTES_STR}
                                            </Text>
                                            <View style={{
                                                color: colors.COLOR_BLACK,
                                                width: '100%',
                                                minHeight: 40,
                                                borderWidth: 1,
                                                marginBottom: 5,
                                                borderColor: this.state.header_background != "" ?
                                                    this.state.header_background :
                                                    colors.COLOR_THEME,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,
                                                backgroundColor: colors.COLOR_WHITE,
                                                justifyContent: 'center'
                                            }}>

                                                <Text style={{
                                                    color: colors.COLOR_BLACK,
                                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                }}>{item.orderList[0].comments}</Text>
                                            </View>

                                        </View>}
                                    </View>}
                                <View>
                                    {item.guestOrderList.map((itemorder, index) =>
                                    (
                                        <View>
                                            <View>
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    color: colors.GREY_COLOR,
                                                    paddingLeft: 5,
                                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                }}>
                                                    {itemorder.guestname}
                                                </Text>
                                                <View style={{
                                                    backgroundColor: '#FFFFFF',
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    padding: 5,
                                                    borderRadius: 5,
                                                    margin: 5,
                                                    justifyContent: 'space-between'
                                                }}>

                                                    <Image source={{ uri: itemorder.icon }}
                                                        style={{
                                                            width: 88,
                                                            height: 88,
                                                            alignSelf: 'center',
                                                            paddingVertical: 5,
                                                            borderRadius: 12
                                                        }}
                                                    />
                                                    <View style={{
                                                        justifyContent: 'center',
                                                        flex: 6
                                                    }}>

                                                        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                                            <Text style={{
                                                                fontSize: fontsProps.md,
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                color: '#616161',
                                                            }}>{itemorder.titlename}</Text>
                                                        </View>
                                                        <Text style={{
                                                            fontSize: 12,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 3,
                                                            color: itemorder.halaal == "1" ? "#00C193" : "#A1A4B0",
                                                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                        }}>
                                                            {itemorder.halaal == "1" ? "Halaal" : "Non-halaal"}
                                                        </Text>
                                                        {!itemorder.isSeeMore &&
                                                            <TouchableOpacity style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                paddingHorizontal: 10
                                                            }}
                                                                onPress={() => { this.onSeeMoreItem(item, itemorder) }}>
                                                                <Text style={{
                                                                    fontSize: fontsProps.md,
                                                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                    color: '#0097F7',
                                                                }}>
                                                                    See more
                                                                </Text>

                                                                <Image source={
                                                                    itemorder.isSeeMore ? Constantimages.arrowup_icon :
                                                                        Constantimages.arrow_down_icon}
                                                                    style={{
                                                                        width: 20,//itemorder.isSeeMore ? 20 : 20,
                                                                        height: 20,//itemorder.isSeeMore ? 20 : 20,
                                                                        resizeMode: 'contain',
                                                                        tintColor: '#0097F7',
                                                                    }} />

                                                            </TouchableOpacity>
                                                        }
                                                        {itemorder.isSeeMore &&

                                                            <Text style={{
                                                                fontSize: fontsProps.sm,
                                                                color: '#616161',
                                                                paddingHorizontal: 10,
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                            }}>
                                                                {itemorder.item_ingredients}
                                                            </Text>}
                                                    </View>
                                                </View>
                                            </View>
                                            {itemorder.isSeeMore &&
                                                <View
                                                    style={{
                                                    }}>
                                                    {itemorder.comments != "" &&
                                                        <View>
                                                            <Text style={{
                                                                fontSize: fontsProps.lg,
                                                                color: colors.GREY_COLOR,
                                                                marginVertical: 5,
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                            }}>
                                                                Notes
                                                            </Text>
                                                            <View style={{
                                                                color: colors.COLOR_BLACK,
                                                                width: '100%',
                                                                minHeight: 40,
                                                                borderWidth: 1,
                                                                marginBottom: 5,
                                                                borderColor: this.state.header_background != "" ?
                                                                    this.state.header_background :
                                                                    colors.COLOR_THEME,
                                                                borderRadius: 5,
                                                                paddingHorizontal: 10,
                                                                backgroundColor: colors.COLOR_WHITE,
                                                                justifyContent: 'center',
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                            }}>

                                                                <Text>{itemorder.comments}</Text>
                                                            </View>

                                                        </View>}
                                                    {itemorder.isSeeMore &&

                                                        <TouchableOpacity style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            padding: 10,
                                                            justifyContent: 'center',

                                                        }}
                                                            onPress={() => { this.onSeeMoreItem(item, itemorder) }}>
                                                            <Text style={{
                                                                fontSize: fontsProps.md,
                                                                color: '#0097F7',
                                                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                            }}>
                                                                See less
                                                            </Text>

                                                            <Image source={
                                                                itemorder.isSeeMore ? Constantimages.arrowup_icon :
                                                                    Constantimages.arrow_down_icon}
                                                                style={{
                                                                    width: 20,//itemorder.isSeeMore ? 17 : 30,
                                                                    height: 20,//itemorder.isSeeMore ? 17 : 30,
                                                                    resizeMode: 'contain',
                                                                    tintColor: '#0097F7',
                                                                }} />

                                                        </TouchableOpacity>}
                                                </View>
                                            }
                                        </View>
                                    ))}
                                </View>
                            </View>

                        ))
                    }


                </ScrollView>
                {this.renderProgressDialogLoader()}
            </View>

        );
    }
    render() {
        if (this.state.isLunchSetupsCurrentlyUnavailable) {
            return (
                this.renderRowLunchSetupsAvailable()

            )
        }
        else if (!this.state.isLunchSetupsCurrentlyUnavailable) {
            return (
                this.renderRowCurrentLunchNotAvailableView()
            )
        }
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10
    },
    item: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        padding: 5,
        borderRadius: 5,
        margin: 5,
        elevation: 5
    },

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        marginBottom: 70.0
    },



})

