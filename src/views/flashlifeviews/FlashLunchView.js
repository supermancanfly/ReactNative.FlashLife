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
    PixelRatio,
    Alert
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import MaterialButton from "../../components/shared/MaterialButton";
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { ConstantValues } from '../../utils/ConstantValues';
import InternetStatusConnection from '../../utils/InternetStatusConnection';
import Moment from 'moment';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
import {
    ApiGetWhiteLabelSettings,
    ApiGetLunchSetupOpen,
    ApiLunchOrdersCreate,
    ApiGetOpenLunchOrders
} from '../../network/Services';
import CurrentBookingsView from '../../views/CurrentBookingsView';
import { DateButton } from '../../components/lunch_items/lunch_items_renders';
import { apiErrorHandler } from '../../utils/CommonMethods';

export default class FlashLunchView extends React.Component {
    constructor(props) {
        super(props)
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
            lunchordersList: [],
            ordersListGuests: [],
            dynamicGuestsOrders: [],
            clubScoresList: [],
            pointsByMonth: [],
            monthcount: 0,
            lunchorderList: [],
            isLunchSetupsCurrentlyUnavailable: true
            // isLunchSetupsCurrentlyUnavailable:true
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashLunchView(ConstantValues.MORE_STR);
    }

    componentDidMount() {
        this.getOpenLunchOrdersList()
        // this.getLunchSetupOpenList()
    }
    handleAdditionalSettings = (newText) => this.setState({ additionalnotes: newText })
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
    getOpenLunchOrdersList = async () => {
        const { userData, lunchorderList } = this.state;
        let params = "?company_id=" +
            this.state.userData[0].employee_company_id
            + "&user_id=" + userData[0].id + "&status=open";
        this.setState({
            isLoading: true
        })
        let data = [];
        await ApiGetOpenLunchOrders(this.state.userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    // const element = array[i];
                    data.push({
                        lunch_order_id: responseJson[i].lunch_order_id,
                        company_id: responseJson[i].company_id,
                        user_id: responseJson[i].user_id,
                        date: responseJson[i].date,
                        lunch_item_id: responseJson[i].lunch_item_id,
                        lunch_setup_id: responseJson[i].lunch_setup_id,
                        guest: responseJson[i].guest,
                        guest_name: responseJson[i].guest_name,
                        guest_email: responseJson[i].guest_email,
                        comments: responseJson[i].comments,
                        status: responseJson[i].status,
                        deleted: responseJson[i].deleted,
                        orderList: []
                    })
                }
                this.setState({
                    lunchorderList: data
                })
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
        this.getLunchSetupOpenList()
    }
    getLunchSetupOpenList = async () => {
        const { lunchorderList } = this.state;
        let params = "?company_id="
            +
            // "37"
            this.state.userData[0].employee_company_id
            + "&status=open" + "&app=1";
        // + "&status=open" + "&app=1" +"&notification_sent=0";
        this.setState({
            isLoading: true
        })
        let data = [];
        // console.log("getLunchOpenList-------------------------------*******")
        await ApiGetLunchSetupOpen(this.state.userData[0].token, params).then(responseJson => {
            // console.log("getLunchSetupOpenList-------------------------------*******" + JSON.stringify(responseJson))
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    let dynamicguestData = []
                    let glunch_item_details = [];
                    glunch_item_details = responseJson[i].lunch_item_details;
                    // console.log("g check responseJson[i].lunch_item_details" + JSON.stringify(responseJson[i].lunch_item_details))
                    // console.log("glunch_item_details" + glunch_item_details)
                    if (responseJson[i].notification_sent == 1) {
                        if (data.length == 0) {
                            let lunchItemList = [];
                            let lunchGuestListData = [];
                            let comments = "";
                            for (let j = 0; j < responseJson[i].lunch_item_details.length; j++) {
                                let isOrderedItem = false;
                                let isGuestOrderItem = false;
                                let orderid = "";
                                lunchItemList.push({
                                    orderid: orderid,
                                    id: responseJson[i].lunch_item_details[j].lunch_item_id,
                                    company_id: responseJson[i].lunch_item_details[j].company_id,
                                    date: responseJson[i].date,
                                    titlename: responseJson[i].lunch_item_details[j].item_name,
                                    icon: responseJson[i].lunch_item_details[j].image,
                                    guestname: "",
                                    guestemail: "",
                                    item_ingredients: responseJson[i].lunch_item_details[j].item_ingredients,
                                    guest: "",
                                    halaal: responseJson[i].lunch_item_details[j].halaal,
                                    comments: comments,
                                    isSwitch: false,
                                    active: isOrderedItem,
                                })
                            }
                            data.push({
                                id: responseJson[i].lunch_setup_id,
                                titlename: ConstantValues.JULY_STR,
                                icon: Constantimages.form_icon,
                                isSwitch: false,
                                points: "20",
                                orderList: lunchItemList,
                                lunchdate: responseJson[i].date,
                                isSelectOrder: false,
                                dynamicGuestList: dynamicguestData,
                                comments: comments,
                                dynamicInputData: [],
                                item_ingredients: "",
                                isAddGuest: false,
                            });
                        }
                        else {
                            let isExist = false;
                            let index = -1;
                            for (let j = 0; j < data.length; j++) {
                                if (data[j].lunchdate == responseJson[i].date) {
                                    isExist = true;
                                    index = j;
                                }
                            }
                            if (isExist) {
                                // console.log("data 2------------------------checking 2" + JSON.stringify(data))
                                let lunchItemList = data[index].orderList;
                                // let lunchGuestListData = data[index].guestOrderList;
                                let comments = "";
                                for (let j = 0; j < responseJson[i].lunch_item_details.length; j++) {
                                    let isOrderedItem = false;
                                    let orderid = "";
                                    lunchItemList.push({
                                        orderid: orderid,
                                        id: responseJson[i].lunch_item_details[j].lunch_item_id,
                                        titlename: responseJson[i].lunch_item_details[j].item_name,
                                        company_id: responseJson[i].lunch_item_details[j].company_id,
                                        icon: responseJson[i].lunch_item_details[j].image,
                                        date: responseJson[i].date,
                                        guestname: "",
                                        guestemail: "",
                                        comments: comments,
                                        halaal: responseJson[i].lunch_item_details[j].halaal,
                                        item_ingredients: responseJson[i].lunch_item_details[j].item_ingredients,
                                        guest: "",
                                        isSwitch: false,
                                        active: isOrderedItem
                                    })
                                }
                                data[index].orderList = lunchItemList;
                                // data[index].guestOrderList = lunchGuestListData;
                            }
                            else {
                                let lunchItemList = [];
                                let lunchGuestListData = [];
                                let comments = "";
                                for (let j = 0; j < responseJson[i].lunch_item_details.length; j++) {
                                    let isOrderedItem = false;
                                    let orderid = "";
                                    lunchItemList.push({
                                        orderid: orderid,
                                        id: responseJson[i].lunch_item_details[j].lunch_item_id,
                                        titlename: responseJson[i].lunch_item_details[j].item_name,
                                        company_id: responseJson[i].lunch_item_details[j].company_id,
                                        icon: responseJson[i].lunch_item_details[j].image,
                                        date: responseJson[i].date,
                                        guestname: "",
                                        guestemail: "",
                                        comments: comments,
                                        guest: "",
                                        halaal: responseJson[i].lunch_item_details[j].halaal,
                                        isSwitch: false,
                                        item_ingredients: responseJson[i].lunch_item_details[j].item_ingredients,
                                        active: isOrderedItem
                                    })
                                }
                                data.push({
                                    id: responseJson[i].lunch_setup_id,
                                    titlename: ConstantValues.JULY_STR,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20",
                                    orderList: lunchItemList,
                                    // guestOrderList: lunchGuestListData,
                                    comments: comments,
                                    lunchdate: responseJson[i].date,
                                    isSelectOrder: false,
                                    dynamicGuestList: dynamicguestData,
                                    dynamicInputData: [],
                                    isAddGuest: false,
                                })
                            }
                        }
                    }
                    // console.log("data------------------------checking 1" + JSON.stringify(data))
                }
                for (let index = 0; index < data.length; index++) {
                    for (let k = 0; k < data[index].orderList.length; k++) {
                        let guestName = "";
                        let guestEmail = "";
                        let additionalComments = "";
                        let guestList = [];
                        let orderid = "";
                        let isGuestOrderExist = false;
                        for (let order = 0; order < this.state.lunchorderList.length; order++) {
                            let submittedOrderItem = this.state.lunchorderList[order];
                            let lunchItem = data[index].orderList[k];
                            // console.log("Lunch Item: ", lunchItem);
                            // console.log("  submitted order item: ", submittedOrderItem);
                            if ((lunchItem.id == submittedOrderItem.lunch_item_id)
                                && (data[index].id == submittedOrderItem.lunch_setup_id) && submittedOrderItem.guest == 0) {
                                // console.log(" data[index].orderList[k].active---------" + JSON.stringify(data[index].orderList[k]))
                                data[index].orderList[k].active = true;
                                data[index].orderList[k].comments = submittedOrderItem.comments;
                                data[index].comments = submittedOrderItem.comments;
                                data[index].orderList[k].orderid = submittedOrderItem.lunch_order_id;
                                data[index].isAddGuest = true
                                data[index].orderid = submittedOrderItem.lunch_order_id;
                                data[index].isSelectOrder = true;
                            }
                            if ((lunchItem.id == submittedOrderItem.lunch_item_id)
                                && (data[index].id == submittedOrderItem.lunch_setup_id) && submittedOrderItem.guest == 1) {
                                isGuestOrderExist = true;
                                guestName = submittedOrderItem.guest_name;
                                guestEmail = submittedOrderItem.guest_email;
                                // console.log(" submittedOrderItem.comments ", submittedOrderItem.comments);
                                orderid = submittedOrderItem.lunch_order_id;
                                additionalComments = submittedOrderItem.comments;
                                // console.log("  additionalComments: ", additionalComments);
                                guestList.push({
                                    item_id: submittedOrderItem.lunch_item_id,
                                    guestName: submittedOrderItem.guest_name,
                                    guestEmail: submittedOrderItem.guest_email,
                                    comments: submittedOrderItem.comments,
                                    orderid: submittedOrderItem.lunch_order_id
                                });
                            }
                        }
                        if (isGuestOrderExist) {
                            let dynamicguestData = [];
                            dynamicguestData.push({
                                lunchsetupIndex: index,
                                id: dynamicguestData.length + 1,
                                orderList: this.getOrderList(data[index].orderList),
                                value: "",
                                guest_name: guestName,
                                guest_email: guestEmail,
                                comments: additionalComments,
                                isaddGuestSwitch: true,
                                orderid: orderid
                            });
                            let oList = dynamicguestData[dynamicguestData.length - 1].orderList;
                            // console.log("---------------------------------------dynamicguestData-------------------------------" + JSON.stringify(dynamicguestData))
                            for (let i = 0; i < oList.length; i++) {
                                for (let j = 0; j < guestList.length; j++) {
                                    if (guestList[j].item_id == oList[i].id) {
                                        dynamicguestData[dynamicguestData.length - 1].orderList[i].active = true;
                                    }
                                }
                            }
                            data[index].dynamicGuestList = dynamicguestData;
                            // console.log("O LIST: ", JSON.stringify(data[index].dynamicGuestList));
                        }
                    }
                }
                this.setState({ lunchmenuList: data })
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
            // if (data.length == 0) {
            //     this.setState({ isLunchSetupsCurrentlyUnavailable: false })
            // }
            // else {
            //     this.setState({ isLunchSetupsCurrentlyUnavailable: true })
            // }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    lunchOrdersCreate = async () => {
        const { userData, lunchmenuList } = this.state
        let ordersList = [];
        // ( send empty while creating and send id when updating )
        // ( send 0 or 1 )
        // guest:       ( send 0 or 1 )
        for (let i = 0; i < lunchmenuList.length; i++) {
            for (let j = 0; j < lunchmenuList[i].orderList.length; j++) {
                // console.log("lunchmenuList[i].orderList[j]" + JSON.stringify(lunchmenuList[i].orderList[j]))
                // console.log("lunchmenuList[i].orderList[j].company_id" + lunchmenuList[i].orderList[j].company_id)
                if (lunchmenuList[i].orderList[j].active) {
                    ordersList.push({
                        // lunch_order_id:lunchmenuList[i].orderList[j].orderid ,
                        lunch_order_id: lunchmenuList[i].orderid ? lunchmenuList[i].orderid : "",
                        company_id: lunchmenuList[i].orderList[j].company_id,
                        user_id: userData[0].id,
                        lunch_item_id: lunchmenuList[i].orderList[j].id,
                        date: lunchmenuList[i].orderList[j].date,
                        guest: 0,
                        guest_name: "",
                        guest_email: "",
                        lunch_setup_id: lunchmenuList[i].id,
                        comments: lunchmenuList[i].comments
                    })
                }
            }
            for (let k = 0; k < lunchmenuList[i].dynamicGuestList.length; k++) {
                // console.log(" lunchmenuList[i].dynamicGuestList" + JSON.stringify(lunchmenuList[i].dynamicGuestList[k]))
                for (let l = 0; l < lunchmenuList[i].dynamicGuestList[k].orderList.length; l++) {
                    // console.log(" lunchmenuList[i].dynamicGuestList[k].orderList[l]" + JSON.stringify(lunchmenuList[i].dynamicGuestList[k].orderList[l]))
                    if (lunchmenuList[i].dynamicGuestList[k].orderList[l].active) {
                        ordersList.push({
                            lunch_order_id: lunchmenuList[i].dynamicGuestList[k].orderid ? lunchmenuList[i].dynamicGuestList[k].orderid : "",
                            company_id: lunchmenuList[i].dynamicGuestList[k].orderList[l].company_id,
                            user_id: userData[0].id,
                            lunch_item_id: lunchmenuList[i].dynamicGuestList[k].orderList[l].id,
                            lunch_setup_id: lunchmenuList[i].id,
                            guest: 1,
                            date: lunchmenuList[i].dynamicGuestList[k].orderList[l].date,
                            guest_name: lunchmenuList[i].dynamicGuestList[k].guest_name,
                            guest_email: lunchmenuList[i].dynamicGuestList[k].guest_email,
                            comments: lunchmenuList[i].dynamicGuestList[k].comments
                        })
                    }
                }
            }
        }
        this.setState({ isLoading: true });
        await ApiLunchOrdersCreate(
            userData[0].token,
            ordersList,
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson == "true") {
                // Lunch Order has been successfully Submitted”
                Alert.alert(
                    '',
                    ConstantValues.LUNCH_ORDER_SUBMITED_SUCCESSFULLY_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.getOpenLunchOrdersList.bind(this)
                        }
                    ],
                    { cancelable: true },
                )
                // this.getOpenLunchOrdersList()
            }
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
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
    getOrderList = (ordersList) => {
        // console.log("ordersList------------------" + JSON.stringify(ordersList))
        let data = [];
        for (let i = 0; i < ordersList.length; i++) {
            data.push({
                id: ordersList[i].id,
                titlename: ordersList[i].titlename,
                icon: ordersList[i].icon,
                date: ordersList[i].date,
                guestname: "",
                guestemail: "",
                item_ingredients: ordersList[i].item_ingredients,
                halaal: ordersList[i].halaal,
                guest: ordersList[i].guest,
                company_id: ordersList[i].company_id,
                isSwitch: false,
                active: false
            })
        }
        // console.log("ordersList(data)------------------" + JSON.stringify(data))
        return data;
    }
    addAnotherGuest = (item, index) => {
        item.dynamicGuestList.push({
            lunchsetupIndex: index,
            id: item.dynamicGuestList.length + 1,
            orderList: this.getOrderList(item.orderList),
            value: "",
            guest_name: "",
            guest_email: "",
            comments: "",
            isaddGuestSwitch: false
        })
        this.setState({
        })
    }
    addGuest = (item, index) => {
        // console.log("Add Guest:---------------------item" + JSON.stringify(item))
        // console.log("index" + index + "item" + JSON.stringify(item))
        // console.log("item.dynamicGuestList.length-----test" + item.dynamicGuestList.length)
        item.isAddGuest = !item.isAddGuest;
        // guestOrderList
        // console.log("index" + index + "item2-----test" + JSON.stringify(item))
        if (item.dynamicGuestList.length == 0) {
            item.dynamicGuestList.push({
                lunchsetupIndex: index,
                id: item.dynamicGuestList.length + 1,
                orderList: this.getOrderList(item.orderList),
                value: "",
                guest_name: "",
                guest_email: "",
                comments: "",
                isaddGuestSwitch: false
            })
        }
        this.setState({
        })
        // console.log("index" + index + "item2-----test" + JSON.stringify(item))
    }
    onSelectItem = (item, itemorder, index) => {
        const { orderList, lunchmenuList } = this.state;
        // console.log("item----s, index" + JSON.stringify(item) + "" + index)
        // console.log("itemorder----s, index" + JSON.stringify(itemorder) + "" + index)
        itemorder.active = !itemorder.active;
        for (let i = 0; i < this.state.lunchmenuList.length; i++) {
            if (item.id == this.state.lunchmenuList[i].id) {
                // console.log("this.state.lunchmenuList[i].id" + this.state.lunchmenuList[i].id + "item.id" + item.id)
                for (let j = 0; j < this.state.lunchmenuList[i].orderList.length; j++) {
                    if (itemorder.id == this.state.lunchmenuList[i].orderList[j].id) {
                        // console.log(" 1  itemorder.id" + itemorder.id + "this.state.lunchmenuList[i].orderList[j].id" + this.state.lunchmenuList[i].orderList[j].id)
                        if (itemorder.active == true) {
                            // if (this.state.lunchmenuList[i].orderList[j].active == true) {
                            // console.log("check 1" + this.state.lunchmenuList[i].orderList[j].active)
                            item.isSelectOrder = true;
                        }
                        else {
                            // console.log("check 2" + this.state.lunchmenuList[i].orderList[j].active)
                            item.isSelectOrder = false;
                        }
                        this.setState({})
                    }
                    else {
                        // console.log("2  itemorder.id" + item.id + "this.state.lunchmenuList[i].orderList[j].id" + this.state.lunchmenuList[i].orderList[j].id)
                        this.state.lunchmenuList[i].orderList[j].active = false;
                    }
                }
            }
        }
        this.setState({
        })
    }
    onChangeSelectGuestOrderItem = async (viewitem, guestitem, key) => {
        // console.log(" guestitem, key" + JSON.stringify(guestitem) + "----" + key + "viewitem" + viewitem)
    }
    onChangeGuestName = async (item, guestitem, key, index) => {
    }
    onChangeGuestEmail = async (item, guestitem, key, index) => {
    }
    // onPress={() => { this.onSelectGuestOrderItem(index,item, guestitem, key, index) }}
    onSelectGuestOrderItem = async (item, guestitem, key, index) => {
        const { orderList, lunchmenuList } = this.state;
        let data = lunchmenuList;
        // console.log("index------saitest" + index)
        // console.log("key--item" + JSON.stringify(key))
        // console.log("item--item" + JSON.stringify(item))
        // console.log("guestitem--item" + JSON.stringify(guestitem))
        data[item.lunchsetupIndex].dynamicGuestList[index].orderList[key].active = !guestitem.active;
        // console.log("lunchmenuList(data)" + JSON.stringify(data))
        for (let i = 0; i < data[item.lunchsetupIndex].dynamicGuestList[index].orderList.length; i++) {
            // console.log("data[item.lunchsetupIndex].dynamicGuestList[index].orderList" +
            data[item.lunchsetupIndex].dynamicGuestList[index].orderList[i].active
            if (data[item.lunchsetupIndex].dynamicGuestList[index].orderList[key].id != data[item.lunchsetupIndex].dynamicGuestList[index].orderList[i].id) {
                data[item.lunchsetupIndex].dynamicGuestList[index].orderList[i].active = false
            }
            {
            }
        }
        await this.setState({
            lunchmenuList: data
        })
    }
    onMenuOrderParticularDate = (item, index) => {
        const { orderList } = this.state;
        // console.log("CLICKED ITEM: ", JSON.stringify(item), index);
        // console.log("index" + index + "item" + JSON.stringify(item))
        item.isSwitch = !item.isSwitch
        let isMenuListOpen = false
        this.setState({
        })
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
        this.lunchOrdersCreate()
    }
    renderRowCurrentLunchNotAvailableView() {
        return <CurrentBookingsView
            userData={this.props.userData}
            // onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
        />
    }
    renderRowLunchSetupsAvailable() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView contentContainerStyle={{
                    paddingVertical: 5
                }}>
                    {
                        this.state.lunchmenuList.map((item, mainindexkey) =>
                        (
                            <View style={{ paddingHorizontal: 10, }}>
                                <View style={{
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 3,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    marginTop: 3
                                }}>
                                    <TouchableOpacity style={{
                                        paddingVertical: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        alignItems: 'center',
                                        backgroundColor: this.state.isOrderDateOpen ? this.state.header_background != "" ?
                                            this.state.header_background :
                                            colors.COLOR_THEME : colors.COLOR_WHITE,
                                    }}
                                        onPress={() => { this.onMenuOrderParticularDate(item, mainindexkey) }}
                                    >
                                        {DateButton(this.state.isOrderDateOpen, item, this.state.header_background)}
                                    </TouchableOpacity>
                                    {item.isSwitch &&
                                        <View>
                                            <View style={{ height: 0.5, backgroundColor: colors.GREY_COLOR }}>
                                            </View>
                                            {
                                                item.orderList.map((itemorder, index) =>
                                                (
                                                    <View>
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
                                                                    width: 90 / 2,
                                                                    height: 90 / 2,
                                                                    alignSelf: 'center',
                                                                    paddingVertical: 5,
                                                                    flex: 1
                                                                }}
                                                            >
                                                            </Image>
                                                            <View style={{
                                                                justifyContent: 'center',
                                                                marginRight: 10,
                                                                flex: 6
                                                            }}>
                                                                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                                                    <Text style={{
                                                                        fontSize: fontsProps.md,
                                                                        fontWeight: 'bold', color: '#616161',
                                                                    }}>
                                                                        {/* Order Title */}
                                                                        {itemorder.titlename}
                                                                    </Text>
                                                                    <Text style={{
                                                                        fontSize: fontsProps.md,
                                                                        fontWeight: 'bold',
                                                                        color: this.state.header_background != "" ?
                                                                            this.state.header_background :
                                                                            colors.COLOR_THEME,
                                                                        paddingLeft: 5
                                                                    }}>
                                                                        {itemorder.halaal == "1" &&
                                                                            "(Halaal)"
                                                                            // :
                                                                            // "Non Halaal"
                                                                        }
                                                                        {/* ({itemorder.titlename}) */}
                                                                    </Text>
                                                                </View>
                                                                <Text style={{
                                                                    fontSize: fontsProps.sm,
                                                                    color: '#616161',
                                                                    paddingHorizontal: 10
                                                                }}>
                                                                    {itemorder.item_ingredients}</Text>
                                                            </View>
                                                            <TouchableOpacity style={{
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                flexDirection: 'row',
                                                                justifyContent: 'flex-end'
                                                            }}
                                                                onPress={() => { this.onSelectItem(item, itemorder, mainindexkey) }}
                                                            >
                                                                <Image source={
                                                                    itemorder.active ?
                                                                        Constantimages.checkfill_icon
                                                                        : Constantimages.checkcircle_icon
                                                                }
                                                                    style={{
                                                                        width: 25, height: 25, resizeMode: 'contain',
                                                                        tintColor:
                                                                            itemorder.active ?
                                                                                this.state.header_background != "" ?
                                                                                    this.state.header_background :
                                                                                    colors.COLOR_THEME
                                                                                : colors.GREY_COLOR,
                                                                    }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ height: 0.5, backgroundColor: colors.GREY_COLOR }}>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    }
                                </View>
                                {item.isSwitch &&
                                    <View>
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
                                                borderWidth: 1,
                                                marginBottom: 5,
                                                borderColor: this.state.header_background != "" ?
                                                    this.state.header_background :
                                                    colors.COLOR_THEME,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,
                                                backgroundColor: colors.COLOR_WHITE,
                                                paddingVertical: Platform.OS == 'ios' ? 30 : null,
                                                height: Platform.OS == 'ios' ? 70 : null
                                            }}
                                            placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                                            // placeholder={"hello"}
                                            underlineColorAndroid="transparent"
                                            numberOfLines={2}
                                            multiline={true}
                                            value={item.comments}
                                            onChangeText={text => {
                                                let { lunchList } = this.state;
                                                item.comments = text;
                                                this.setState({
                                                });
                                            }}
                                            keyboardType='default'
                                            returnKeyType="done"
                                        />
                                        {item.isAddGuest &&
                                            <View style={{
                                                width: '100%', height: 5, marginTop: 5, marginBottom: 10, backgroundColor: this.state.header_background != "" ?
                                                    this.state.header_background :
                                                    colors.COLOR_THEME
                                            }}>
                                            </View>
                                        }
                                    </View>
                                }
                                {item.isSwitch &&
                                    <View style={{
                                        backgroundColor: colors.COLOR_WHITE,
                                        elevation: 3,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                    }}>
                                        <TouchableOpacity style={{
                                            paddingVertical: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 20,
                                            alignItems: 'center',
                                            margin: 3
                                        }}
                                            onPress={() => {
                                                this.addGuest(item, mainindexkey)
                                            }}
                                        >
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}
                                            ></View>
                                            <View style={{
                                            }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    color: '#616161',
                                                    paddingHorizontal: 10
                                                }}>Add Guest</Text>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}
                                            >
                                                <Image source={
                                                    item.isAddGuest ? Constantimages.drop_up_icon :
                                                        Constantimages.drop_icon}
                                                    style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }
                                {/* {item.isAddGuest && item.isSwitch &&
                                <View>
                                    {
                                        item.dynamicGuestList.map((item, key) => (
                                            item.view
                                        ))
                                    }
                                </View>
                            } */}
                                {/* { item.isSwitch &&
                                    <FlatList
                                        
                                        data={this.state.lunchorderList}
                                    
                                        renderItem={this.ItemView}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                } */}
                                {item.dynamicGuestList.length > 0 && item.isSwitch &&
                                    // item.isAddGuest &&
                                    // {/* {item.isAddGuest && item.isSwitch && */}
                                    <FlatList
                                        //   data={this.state.dummyArray}
                                        data={item.dynamicGuestList}
                                        //data defined in constructor
                                        //   ItemSeparatorComponent={ItemSeparatorView}
                                        //Item Separator View
                                        renderItem={item.isAddGuest ? this.ItemView : this.EmptyView}
                                        // renderItem={this.ItemView}
                                        keyExtractor={(item, index) => "index" + index}
                                    />
                                }
                                {item.isSwitch && item.dynamicGuestList.length > 0 && item.isAddGuest &&
                                    <View style={{
                                        backgroundColor: colors.COLOR_WHITE,
                                        elevation: 3,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        // marginTop: 3
                                    }}>
                                        <TouchableOpacity style={{
                                            paddingVertical: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 20,
                                            alignItems: 'center',
                                            margin: 3
                                        }}
                                            onPress={() => {
                                                //  this.addGuest(item, key)
                                                item.dynamicGuestList.length == 0 ?
                                                    this.addGuest(item, mainindexkey) : this.addAnotherGuest(item, mainindexkey)
                                            }}
                                        >
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}
                                            ></View>
                                            <View style={{
                                            }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    color: '#616161',
                                                    paddingHorizontal: 10
                                                }}>{item.dynamicGuestList.length > 0 && "Add Another Guest"}</Text>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}
                                            >
                                                <Image source={
                                                    item.isSwitch ? Constantimages.drop_up_icon :
                                                        Constantimages.drop_icon}
                                                    style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        ))
                    }
                    {/* <MaterialButton
                        title={ConstantValues.SUBMIT_STR}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 5,
                            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 15,
                            marginHorizontal: paddingProps.md,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 30
                        }}
                        titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}
                        buttonPress={() => { this.onSubmitDetails() }}
                    /> */}
                    <ButtonImageTitle
                        type={""}
                        title={ConstantValues.SUBMIT_STR}
                        imagesrc={Constantimages.doublearrrow_icon}
                        imagestyle={{
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                            tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                        }}


                        style={{
                            // flex:1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                            borderRadius: 5,
                            elevation: 5,
                            alignSelf: 'center',
                            height: ConstantValues.SUBMIT_BUTTON_SIZE,
                            marginHorizontal: paddingProps.sm,
                            marginTop: 48 / PixelRatio.get()
                        }}
                        titleStyle={{
                            fontSize: 15,
                            color: colors.COLOR_WHITE,
                            textAlign: 'center',
                            paddingHorizontal: 25,
                            paddingVertical: 15,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}
                        buttonPress={() => {
                            this.onSubmitDetails()
                            imagecolor = ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                        }}
                    />

                    {/* <Text style={{
                        fontSize: fontsProps.sm,
                        color: '#616161',
                        textAlign: 'center'
                    }}>{this.state.isLunchSubmitted ? "Lunch selections have been Submitted" : "Please submit your lunch selections"}
                    </Text> */}
                    <Text style={{
                        fontSize: fontsProps.sm,
                        color: '#616161',
                        textAlign: 'center',
                        marginTop: 10
                    }}>{this.state.lunchorderList.length > 0 ? "Lunch selections have been Submitted" : "Please submit your lunch selections"}
                    </Text>
                </ScrollView>
                {/* </View> */}
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
    EmptyView = ({ item, index, }) => {
        // console.log("ItemView" + JSON.stringify(item) + "index" + index);
        return (
            <View />)
    }
    ItemView = ({ item, index, }) => {
        // console.log("ItemView" + JSON.stringify(item) + "index" + index);
        return (
            <View>
                <View
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
                        value={item.guest_name}
                        onChangeText={text => {
                            let { lunchList } = this.state;
                            item.guest_name = text;
                            this.setState({
                            });
                        }}
                        underlineColorAndroid="transparent"
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
                            backgroundColor: colors.COLOR_WHITE,
                            borderColor: this.state.header_background != "" ?
                                this.state.header_background :
                                colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                        }}
                        value={item.guest_email}
                        onChangeText={text => {
                            let { lunchList } = this.state;
                            item.guest_email = text;
                            this.setState({
                            });
                        }}
                        underlineColorAndroid="transparent"
                        keyboardType='default'
                        returnKeyType="done"
                    />
                </View>
                <View>
                    {
                        item.orderList.map((guestitem, key) => (
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
                                    <Image source={{ uri: guestitem.icon }}
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
                                        flex: 6
                                    }}>
                                        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontWeight: 'bold', color: '#616161',
                                            }}>
                                                {/* Order Title */}
                                                {guestitem.titlename}
                                            </Text>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontWeight: 'bold',
                                                color: this.state.header_background != "" ?
                                                    this.state.header_background :
                                                    colors.COLOR_THEME,
                                                paddingLeft: 5
                                            }}>
                                                {guestitem.halaal == "1" ?
                                                    "(Halaal)"
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontSize: fontsProps.sm,
                                            color: '#616161',
                                            paddingHorizontal: 10
                                        }}>
                                            {guestitem.item_ingredients}</Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end'
                                    }}
                                        onPress={() => { this.onSelectGuestOrderItem(item, guestitem, key, index) }}
                                    >
                                        <Image source={
                                            guestitem.active ?
                                                Constantimages.checkfill_icon
                                                : Constantimages.checkcircle_icon
                                        }
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
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
                    value={item.comments}
                    onChangeText={text => {
                        let { lunchList } = this.state;
                        item.comments = text;
                        this.setState({
                        });
                    }}
                    underlineColorAndroid="transparent"
                    numberOfLines={2}
                    multiline={true}
                    keyboardType='default'
                    returnKeyType="done"
                />
                <View style={{
                    width: '100%', height: 5,
                    marginBottom: 10, marginTop: 5,
                    backgroundColor: this.state.header_background != "" ?
                        this.state.header_background :
                        colors.COLOR_THEME
                }}>
                </View>
            </View>
        );
    };
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
        // else {
        //     return <View />
        // }
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
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    Panel_text: {
        fontSize: 18,
        color: '#000',
        padding: 10
    },
    Panel_Button_Text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 21
    },
    Panel_Holder: {
        borderWidth: 1,
        borderColor: '#FF6F00',
        marginVertical: 5
    },
    Btn: {
        padding: 10,
        backgroundColor: '#FF6F00'
    }
})
