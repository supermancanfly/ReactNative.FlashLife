import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Platform,
    TextInput,
    UIManager,
    Keyboard
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import Tooltip from 'react-native-walkthrough-tooltip';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import Moment from 'moment';

import {
    ApiGetLunchSetupOpen,
    ApiLunchOrdersCreate,
    ApiGetOpenLunchOrders,
    ApiGetLunchRules
} from '../network/Services';
import CurrentBookingsView from './CurrentBookingsView';
import { DateButton } from '../components/lunch_items/lunch_items_renders';
import Tick from '../assets/svg/Tick.svg';
import { SvgXml } from 'react-native-svg';
import Darkerinfo from '../assets/svg/Darkerinfo.svg';
import { apiErrorHandler, ValidateAlertPop } from '../utils/CommonMethods';
import green_leaf from '../assets/svg/lunch_green_leaf.svg';
import MenuItemCardView from '../components/lunch_items/MenuItemCardView';
import SelectedMenuItemInfo from '../components/lunch_items/SelectedMenuItemInfo';
import Icon from 'react-native-vector-icons/Ionicons';
import LunchOrderSuccessPopup from '../components/lunch_items/LunchOrderSuccessPopup';
import ButtonImageTitle from '../components/shared/ButtonImageTitle';

export default class LunchView extends React.Component {
    constructor(props) {
        super(props)
        this.onSelectGuestOrderItem = this.onSelectGuestOrderItem.bind(this);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        this.state = {
            isOrderCreateButtonVisible: false,
            ordersopendate: "",
            cutoff_day: "",
            cutoff_time: "",
            lunchmenuList: [],
            lunchRules: [],
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            isLoading: false,
            userData: this.props.userData,
            clubMonthList: [],
            isOrderDateOpen: false,
            valueNominationList: [],
            additionalnotes: "",
            isLunchSubmitted: false,
            lunchordersList: [],
            clubScoresList: [],
            pointsByMonth: [],
            monthcount: 0,
            lunchorderList: [],
            isLunchSetupsCurrentlyUnavailable: true,
            toolTipVisible: false,
            lunchtoolTipVisible: false,
            myLunchOrdersInfo: [],
            keyboardHeight: 0,
            inputHeight: Platform.OS == 'ios' ? 40 : 0,
            isKeyboardShowing: false,
            selectedMealCount: 0,
            isShowOrderSubmittedPopup: false,
            selectedOrderItem: null
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInLunchView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getLunchRules();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height, isKeyboardShowing: true });
    }
    _keyboardDidHide(e) {
        this.setState({ keyboardHeight: 0, isKeyboardShowing: false });
    }


    onChangeComments = (text, item) => {
        let { lunchmenuList } = this.state;
        item.comments = text;
        this.setState({ lunchmenuList });

    }

    getLunchRules = async () => {
        const { userData, lunchorderList } = this.state;
        let params = `?company_id=${userData[0].employee_company_id}&user_id=${userData[0].id}&location_id=${userData[0].employed_location_id}`;
        let data = [];
        await ApiGetLunchRules(this.state.userData[0].token, params).then(responseJson => {
            if (responseJson) {
                this.setState({
                    lunchRules: responseJson,
                    cutoff_day: responseJson.date,
                    cutoff_time: responseJson.time,

                })
            }

        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
        this.getLunchItemWeekRecord();
    }

    getLunchItemWeekRecord = async () => {
        const { lunchorderList, userData } = this.state;
        let params = `?company_id=${userData[0].employee_company_id}&status=open&app=1&location_id=${userData[0].employed_location_id}`;
        this.setState({
            isLoading: true
        });
        let data = [];
        await ApiGetLunchSetupOpen(this.state.userData[0].token, params).then(responseJson => {
            console.log("lunch setup", responseJson);
            this.setState({ isLoading: false });
            if (responseJson.length > 0) {
                this.getOpenLunchOrdersList(responseJson[0].week);

            }
            else {
                this.setState({ isLoading: false, isLunchSetupsCurrentlyUnavailable: false })
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })


    }

    getOpenLunchOrdersList = async (week) => {
        const { userData, lunchorderList } = this.state;
        let params = `?company_id=${userData[0].employee_company_id}&user_id=${userData[0].id}&status=open&week=${week}&location_id=${userData[0].employed_location_id}`;
        console.log("lunch_params", JSON.stringify(params));
        this.setState({ lunchorderList: [] })
        let data = [];

        await ApiGetOpenLunchOrders(userData[0].token, params).then(responseJson => {
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
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
                        orderList: [],

                    })
                }
                this.setState({
                    lunchorderList: data
                })
            }
            this.getLunchSetupOpenList()

        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }

    getLunchSetupOpenList = async () => {
        const { lunchorderList, userData } = this.state;
        let params = `?company_id=${userData[0].employee_company_id}&status=open&app=1&location_id=${userData[0].employed_location_id}`;
        let data = [];
        await ApiGetLunchSetupOpen(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {

                for (let i = 0; i < responseJson.length; i++) {
                    let dynamicguestData = []
                    if (responseJson[i].notification_sent == 1) {
                        if (data.length == 0) {
                            let lunchItemList = [];
                            for (let j = 0; j < responseJson[i].lunch_item_details.length; j++) {
                                let isOrderedItem = false;
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
                                    isSwitch: false,
                                    active: isOrderedItem,
                                    isSeeMore: false,
                                    label: "Notes",
                                    istooltipvisible: false,
                                    deleted: 0,
                                    isOldOrder: false,
                                    isShowEditOption: false,
                                    vegetarian: responseJson[i].lunch_item_details[j].vegetarian,
                                    lunch_setup_id: responseJson[i].lunch_setup_id,
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
                                dynamicInputData: [],
                                item_ingredients: "",
                                isAddGuest: false,
                                isSeeMore: false,
                                label: "Notes",
                                istooltipvisible: false,
                                isShowEditOption: false
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
                                let lunchItemList = data[index].orderList;
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
                                        active: isOrderedItem,
                                        deleted: 0,
                                        isOldOrder: false,
                                        isShowEditOption: false,
                                        vegetarian: responseJson[i].lunch_item_details[j].vegetarian,
                                        lunch_setup_id: responseJson[i].lunch_setup_id,
                                    })
                                }
                                data[index].orderList = lunchItemList;
                            }
                            else {
                                let lunchItemList = [];
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
                                        active: isOrderedItem,
                                        deleted: 0,
                                        isOldOrder: false,
                                        isShowEditOption: false,
                                        vegetarian: responseJson[i].lunch_item_details[j].vegetarian,
                                        lunch_setup_id: responseJson[i].lunch_setup_id,
                                    })
                                }
                                data.push({
                                    id: responseJson[i].lunch_setup_id,
                                    titlename: ConstantValues.JULY_STR,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20",
                                    orderList: lunchItemList,
                                    comments: comments,
                                    lunchdate: responseJson[i].date,
                                    isSelectOrder: false,
                                    dynamicGuestList: dynamicguestData,
                                    dynamicInputData: [],
                                    isAddGuest: false,
                                    label: "Notes",
                                    isShowEditOption: false
                                })
                            }
                        }
                    }

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
                            /**
                             * Validation Submitted Orders to DB
                             */
                            if ((lunchItem.id == submittedOrderItem.lunch_item_id)
                                && (lunchItem.lunch_setup_id == submittedOrderItem.lunch_setup_id)//(data[index].id == submittedOrderItem.lunch_setup_id)
                                && submittedOrderItem.guest == 0) {
                                data[index].orderList[k].active = true;
                                data[index].orderList[k].comments = submittedOrderItem.comments;
                                data[index].comments = submittedOrderItem.comments;
                                data[index].orderList[k].orderid = submittedOrderItem.lunch_order_id;
                                data[index].isAddGuest = true
                                data[index].orderid = submittedOrderItem.lunch_order_id;
                                data[index].isSelectOrder = true;
                                data[index].orderList[k].isOldOrder = true;
                                data[index].isShowEditOption = true;
                            }
                            /**
                             * Validation Guest Submitted Ordes to DB
                             */
                            if ((lunchItem.id == submittedOrderItem.lunch_item_id)
                                && (data[index].id == submittedOrderItem.lunch_setup_id)
                                && submittedOrderItem.guest == 1) {
                                isGuestOrderExist = true;
                                guestName = submittedOrderItem.guest_name;
                                guestEmail = submittedOrderItem.guest_email;
                                orderid = submittedOrderItem.lunch_order_id;
                                additionalComments = submittedOrderItem.comments;
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
                                orderList: this.getOrderList(data[index].orderList, true),
                                value: "",
                                guest_name: guestName,
                                guest_email: guestEmail,
                                comments: additionalComments,
                                isaddGuestSwitch: true,
                                orderid: orderid,
                                isShowGuestEditOption: false
                            });
                            let oList = dynamicguestData[dynamicguestData.length - 1].orderList;
                            for (let i = 0; i < oList.length; i++) {
                                for (let j = 0; j < guestList.length; j++) {
                                    if (guestList[j].item_id == oList[i].id) {
                                        dynamicguestData[dynamicguestData.length - 1].orderList[i].active = true;
                                        dynamicguestData[dynamicguestData.length - 1].orderList[i].isOldOrder = true;
                                        dynamicguestData[dynamicguestData.length - 1].isShowGuestEditOption = true;
                                    }
                                }
                            }
                            data[index].dynamicGuestList.push(
                                dynamicguestData[0]
                            );
                        }
                    }
                }
                this.setState({
                    lunchmenuList: data, isOrderCreateButtonVisible: true,
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
    lunchOrdersCreate = async () => {
        const { userData, lunchmenuList } = this.state
        let ordersList = [];
        for (let i = 0; i < lunchmenuList.length; i++) {
            /**
             * Preparing Lunch Orders
             */

            let isItemSelected = false;
            let orderElement;
            let index = -1;
            for (let j = 0; j < lunchmenuList[i].orderList.length; j++) {
                orderElement = lunchmenuList[i].orderList[j];
                if (orderElement.active) {
                    isItemSelected = true;
                    index = j;
                }
            }
            if (isItemSelected) {
                const orderObj = {
                    lunch_order_id: lunchmenuList[i].orderid ? lunchmenuList[i].orderid : "",
                    company_id: lunchmenuList[i].orderList[index].company_id,
                    user_id: userData[0].id,
                    lunch_item_id: lunchmenuList[i].orderList[index].id,
                    date: lunchmenuList[i].orderList[index].date,
                    guest: 0,
                    guest_name: "",
                    guest_email: "",
                    lunch_setup_id: lunchmenuList[i].orderList[index].lunch_setup_id,//lunchmenuList[i].id,
                    comments: lunchmenuList[i].comments,
                    deleted: lunchmenuList[i].orderList[index].deleted,
                    location_id: userData[0].employed_location_id
                };
                ordersList.push(orderObj);
            } else {
                let isOldOrderSelected = false;
                let index = -1;
                for (let j = 0; j < lunchmenuList[i].orderList.length; j++) {
                    orderElement = lunchmenuList[i].orderList[j];
                    if (orderElement.isOldOrder) {
                        isOldOrderSelected = true;
                        index = j;
                    }
                }
                if (isOldOrderSelected) {
                    const orderObj = {
                        lunch_order_id: lunchmenuList[i].orderid ? lunchmenuList[i].orderid : "",
                        company_id: lunchmenuList[i].orderList[index].company_id,
                        user_id: userData[0].id,
                        lunch_item_id: lunchmenuList[i].orderList[index].id,
                        date: lunchmenuList[i].orderList[index].date,
                        guest: 0,
                        guest_name: "",
                        guest_email: "",
                        lunch_setup_id: lunchmenuList[i].orderList[index].lunch_setup_id,//lunchmenuList[i].id,
                        comments: lunchmenuList[i].comments,
                        deleted: lunchmenuList[i].orderList[index].deleted,
                        location_id: userData[0].employed_location_id
                    };

                    ordersList.push(orderObj);
                }
            }

            /**
             * Preparing Guest List
             */
            for (let k = 0; k < lunchmenuList[i].dynamicGuestList.length; k++) {
                let isGuestItemSelected = false;
                let guestItemIndex = -1;
                for (let l = 0; l < lunchmenuList[i].dynamicGuestList[k].orderList.length; l++) {
                    if (lunchmenuList[i].dynamicGuestList[k].orderList[l].active) {
                        isGuestItemSelected = true;
                        guestItemIndex = l;
                    }
                }
                if (isGuestItemSelected) {
                    const guestOrderObj = {
                        lunch_order_id: lunchmenuList[i].dynamicGuestList[k].orderid ? lunchmenuList[i].dynamicGuestList[k].orderid : "",
                        company_id: lunchmenuList[i].dynamicGuestList[k].orderList[guestItemIndex].company_id,
                        user_id: userData[0].id,
                        lunch_item_id: lunchmenuList[i].dynamicGuestList[k].orderList[guestItemIndex].id,
                        lunch_setup_id: lunchmenuList[i].id,
                        guest: 1,
                        date: lunchmenuList[i].dynamicGuestList[k].orderList[guestItemIndex].date,
                        guest_name: lunchmenuList[i].dynamicGuestList[k].guest_name,
                        guest_email: lunchmenuList[i].dynamicGuestList[k].guest_email,
                        comments: lunchmenuList[i].dynamicGuestList[k].comments,
                        deleted: lunchmenuList[i].dynamicGuestList[k].orderList[guestItemIndex].deleted,
                        location_id: userData[0].employed_location_id
                    };
                    ordersList.push(guestOrderObj);
                } else {
                    let isGuestOldOrderSelected = false;
                    let guestOldOrderIndex = -1;
                    for (let j = 0; j < lunchmenuList[i].dynamicGuestList[k].orderList.length; j++) {
                        const orderElement1 = lunchmenuList[i].dynamicGuestList[k].orderList[j];
                        if (orderElement1.isOldOrder) {
                            isGuestOldOrderSelected = true;
                            guestOldOrderIndex = j;
                        }
                    }
                    if (isGuestOldOrderSelected) {
                        const guestOrderObj = {
                            lunch_order_id: lunchmenuList[i].dynamicGuestList[k].orderid ? lunchmenuList[i].dynamicGuestList[k].orderid : "",
                            company_id: lunchmenuList[i].dynamicGuestList[k].orderList[guestOldOrderIndex].company_id,
                            user_id: userData[0].id,
                            lunch_item_id: lunchmenuList[i].dynamicGuestList[k].orderList[guestOldOrderIndex].id,
                            lunch_setup_id: lunchmenuList[i].id,
                            guest: 1,
                            date: lunchmenuList[i].dynamicGuestList[k].orderList[guestOldOrderIndex].date,
                            guest_name: lunchmenuList[i].dynamicGuestList[k].guest_name,
                            guest_email: lunchmenuList[i].dynamicGuestList[k].guest_email,
                            comments: lunchmenuList[i].dynamicGuestList[k].comments,
                            deleted: lunchmenuList[i].dynamicGuestList[k].orderList[guestOldOrderIndex].deleted,
                            location_id: userData[0].employed_location_id
                        };
                        ordersList.push(guestOrderObj);

                    }
                }
            }
        }
        if (ordersList.length > 0) {
            await this.setState({
                isOrderCreateButtonVisible: false,
            })
            this.setState({ isLoading: true });
            await ApiLunchOrdersCreate(
                userData[0].token,
                ordersList,
            ).then(responseJson => {
                this.setState({ isLoading: false });

                if (responseJson == "true" || responseJson == true) {
                    this.setState({ isShowOrderSubmittedPopup: true });
                    setTimeout(() => {
                        this.getLunchRules();
                        this.setState({ isShowOrderSubmittedPopup: false });

                    }, 2500);
                }
            }).catch(error => {
                this.setState({ isLoading: false, });
                //Hello, I fixed api error handler
            });
        }


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
    getOrderList = (ordersList, idOldOrder) => {
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
                active: false,
                isOldOrder: false,
                deleted: 0,
                vegetarian: ordersList[i].vegetarian,
            })
        }
        return data;
    }
    addAnotherGuest = (item, index) => {
        item.dynamicGuestList.push({
            lunchsetupIndex: index,
            id: item.dynamicGuestList.length + 1,
            orderList: this.getOrderList(item.orderList, false),
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
        if (item.dynamicGuestList.length == 0) {
            item.isAddGuest = !item.isAddGuest;
        }
        item.dynamicGuestList.push({
            lunchsetupIndex: index,
            id: item.dynamicGuestList.length + 1,
            orderList: this.getOrderList(item.orderList, false),
            value: "",
            guest_name: "",
            guest_email: "",
            comments: "",
            isaddGuestSwitch: false,
            isShowGuestEditOption: false,
        })
        this.setState({})
    }
    onSeeMoreItem = (item, itemorder) => {
        itemorder.isSeeMore = !itemorder.isSeeMore;
        this.setState({})
    }
    onSelectItem = async (item, itemorder) => {
        const { orderList, lunchmenuList } = this.state;
        for (let i = 0; i < this.state.lunchmenuList.length; i++) {
            if (item.id == this.state.lunchmenuList[i].id) {
                for (let j = 0; j < this.state.lunchmenuList[i].orderList.length; j++) {

                    if (this.state.lunchmenuList[i].orderList[j].isOldOrder &&
                        this.state.lunchmenuList[i].orderList[j].deleted == 0) {
                        this.state.lunchmenuList[i].orderList[j].deleted = 1;
                    }
                    if (itemorder.id == this.state.lunchmenuList[i].orderList[j].id) {

                        /**
                         * Added By Edukondal if Condition
                         */
                        if (this.state.lunchmenuList[i].orderList[j].active) {
                            this.state.lunchmenuList[i].orderList[j].active = !this.state.lunchmenuList[i].orderList[j].active;
                        } else {
                            this.state.lunchmenuList[i].orderList[j].active = true;
                            this.state.lunchmenuList[i].orderList[j].deleted = 0;
                            if (itemorder.active == true) {
                                item.isSelectOrder = true;
                                item.isShowEditOption = true;
                            }
                            else {
                                item.isSelectOrder = false;
                                item.isShowEditOption = false;
                            }
                            this.setState({
                                lunchmenuList
                            })
                        }

                    }
                    else {
                        this.state.lunchmenuList[i].orderList[j].active = false;
                        this.setState({
                            lunchmenuList
                        })

                    }
                }
            }
        }
        this.setState({ lunchmenuList })
        itemorder.istooltipvisible = !itemorder.istooltipvisible
        this.setState({
            lunchmenuList
        })
        setTimeout(() => {
            itemorder.istooltipvisible = false
            this.setState({})
        }, 1500);
    }
    onChangeSelectGuestOrderItem = async (viewitem, guestitem, key) => { }
    onSelectGuestOrderItem = async (item, guestitem, index) => {
        const { lunchmenuList } = this.state;
        for (let j = 0; j < lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList.length; j++) {
            if (lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].isOldOrder &&
                lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].deleted == 0) {
                lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].deleted = 1;
            }
            if (guestitem.id == lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].id) {
                /**
                 * Added By Edukondal if Condition
                 */
                if (lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].active) {
                    lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].active = !
                        lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].active;
                } else {
                    lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].active = true;
                    lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].deleted = 0;
                    this.setState({
                        lunchmenuList
                    });
                }

            }
            else {
                lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].active = false;
                lunchmenuList[item.lunchsetupIndex].dynamicGuestList[index].orderList[j].isShowGuestEditOption = true;
                this.setState({
                    lunchmenuList
                });

            }
        }
        guestitem.istooltipvisible = !guestitem.istooltipvisible
        this.setState({})
        setTimeout(() => {
            guestitem.istooltipvisible = false
            this.setState({})
        }, 1500);
    }
    onMenuOrderParticularDate = (item, index) => {
        const { orderList } = this.state;
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
        await this.lunchOrdersCreate()
    }

    onCreateOrder = async () => {
        await this.setState({
            isOrderCreateButtonVisible: true,
        })


    }

    onDoubleTapHandler = async () => {

    }
    renderRowCurrentLunchNotAvailableView() {
        return <CurrentBookingsView
            userData={this.props.userData}
            navigation={this.props.navigation}
            callBackMethodFromSubchildBookings={this.props.callBackMethodFromSubchildBookings}
            viewtype={"menu"}
        />
    }
    renderRowLunchSetupsAvailable() {
        return (
            <View style={[styles.mainContainer, { marginBottom: this.state.isKeyboardShowing ? 0 : 70 }]}>
                <ScrollView contentContainerStyle={{
                    paddingVertical: 5
                }}>
                    {this.menuInfoView()}
                    {this.lunchOrderListView()}
                </ScrollView>
                {!this.state.isKeyboardShowing && this.lunchSubmitButtonView()}
                {this.state.isShowOrderSubmittedPopup && <LunchOrderSuccessPopup
                    isShowModal={this.state.isShowOrderSubmittedPopup}
                    lunchItems={this.state.lunchmenuList}
                />}
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
    EmptyView = ({ item, index, }) => {
        return (
            <View />)
    }
    guestMenuItemsView = (item, index) => {
        if (!item.isShowGuestEditOption) {
            return (
                <View>
                    <View
                        style={{
                            marginTop: 5.0
                        }}>
                        <Text style={{
                            fontSize: 14.0,
                            fontWeight: "600",
                            color: "#27282E",
                            marginVertical: 5,
                            marginHorizontal: 10.0,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                        }}>Guest Name
                        </Text>
                        <View style={{
                            backgroundColor: colors.COLOR_WHITE,
                            borderColor: colors.COLOR_THEME,
                            borderRadius: 10,
                            borderWidth: 1,
                            marginBottom: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                            height: 40.0,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: 10.0
                        }}>
                            <TextInput
                                placeholder='Guest name'
                                style={{
                                    flex: 1,
                                    paddingVertical: 0.0
                                }}

                                value={item.guest_name}
                                onChangeText={text => {
                                    item.guest_name = text;
                                    this.setState(this.state.lunchmenuList);
                                }}
                                underlineColorAndroid="transparent"
                                keyboardType='default'
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={() => {
                                item.guest_name = "";
                                this.setState(this.state.lunchmenuList);
                            }}>
                                <Icon name={'close'} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        marginTop: 10.0
                    }}>
                        {item.orderList.map((guestitem, key) => (

                            <MenuItemCardView key={guestitem.id}
                                item={item}
                                itemOrder={guestitem}
                                itemIndex={key}
                                onMenuItemSelect={() => {
                                    let isGuestNameValid = false;
                                    let guestIndex = -1;
                                    if (item.guest_name != "") {
                                        isGuestNameValid = true;
                                        guestIndex = index;
                                    }
                                    if (isGuestNameValid) {
                                        item.isShowGuestEditOption = true;
                                        this.onSelectGuestOrderItem(item, guestitem, index);
                                    } else {
                                        ValidateAlertPop(`Please enter guest name`);
                                    }
                                }}
                            />
                        ))
                        }
                    </View>
                </View>
            );
        }

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
    }

    menuInfoView = () => {
        return <View>
            <View style={styles.lunch_orders_main_container}>
                <Text style={
                    styles.lunch_orders_text
                }>
                    Menu
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                marginTop: 10.0
            }}>

                <Text style={{
                    paddingBottom: 5,
                    paddingLeft: 15,
                    paddingRight: 5,
                    fontWeight: '700',
                    fontSize: 15,
                    color: colors.COLOR_BLACK,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>
                    Place your orders by
                </Text>
                <Text style={{
                    paddingBottom: 5,
                    fontWeight: '700',
                    fontSize: 15,
                    color: colors.COLOR_RED,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>
                    {this.state.cutoff_day == "" ? "" :
                        Moment(this.state.cutoff_day).format("DD MMM")}{" " + this.state.cutoff_time}
                </Text>
            </View>

            {this.customTooltipView()}
        </View>
    }

    customTooltipView = () => {

        return <View style={{
            flexDirection: "row",
            marginTop: 10.0,
            marginHorizontal: 15.0
        }}>
            <TouchableOpacity style={{
            }}
                onPress={() => {
                    this.setState({ lunchtoolTipVisible: !this.state.lunchtoolTipVisible })
                }
                }
            >
                <Tooltip
                    animated={true}
                    arrowSize={{ width: 16, height: 8 }}
                    isVisible={this.state.lunchtoolTipVisible}
                    contentStyle={
                        styles.tool_tip_main_style
                    }
                    placement="bottom"


                    content={
                        <View style={{ marginHorizontal: 10, borderRadius: 12 }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: 14,
                                color: colors.COLOR_BLACK, paddingVertical: 5
                            }}>
                                {this.props.myLunchOrdersInfo.reference_label}
                            </Text>
                            <Text style={{
                                fontSize: 12, color: colors.GREY_COLOR,
                                paddingBottom: 5, lineHeight: 18
                            }}>
                                {this.props.myLunchOrdersInfo.reference_detail}
                            </Text>
                        </View>
                    }
                    onClose={() => this.setState({ lunchtoolTipVisible: false })}>
                    <SvgXml width="20"
                        height="20"
                        xml={Darkerinfo}

                    />
                </Tooltip>
            </TouchableOpacity>
            <Text style={{
                marginHorizontal: 5.0,
                color: "#60626B"
            }}>Only order for the days you’ll be in the office.</Text>

        </View>
    }

    lunchOrderListView = () => {
        return <View style={{
            marginTop: 10.0
        }}>
            {
                this.state.lunchmenuList.map((item, mainindexkey) => (
                    this.lunchMenuCardView(item, mainindexkey)
                ))
            }
        </View>
    }
    lunchMenuCardView = (item, mainindexkey) => {
        return <View key={item.id}
            style={{ paddingHorizontal: 15, marginBottom: 5 }}>
            <View style={{
                backgroundColor: colors.COLOR_WHITE,
                marginTop: 3,
                borderRadius: 12,
                overflow: 'hidden'
            }}>
                <TouchableOpacity style={{
                    paddingVertical: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                }}
                    onPress={() => { this.onMenuOrderParticularDate(item, mainindexkey) }}>
                    {(item.isSelectOrder && item.orderid) ?
                        <View pointerEvents="none" style={{
                            marginRight: 10.0
                        }}>
                            <SvgXml width="18"
                                height="18"
                                xml={Tick}
                            />
                        </View> : <></>}
                    {DateButton(this.state.isOrderDateOpen, item, this.state.header_background)}
                </TouchableOpacity>

                {this.menuItemCard(item, mainindexkey)}
            </View>
        </View>
    }
    getSelectedMenuItemRecord = (orderList) => {
        let itemOrder;

        for (let index = 0; index < orderList.length; index++) {
            if (orderList[index].active) {
                itemOrder = orderList[index];
                this.state.selectedOrderItem = orderList[index];
            }

        }

        return itemOrder;
    }

    showSelectedLunchItemsInfo = (item, mainindexkey) => {
        return <View>
            {(item.isShowEditOption) ? <SelectedMenuItemInfo itemOrder={this.getSelectedMenuItemRecord(item.orderList)}
                onEditSelectedItem={() => {
                    this.state.lunchmenuList[mainindexkey].isShowEditOption = false;
                    this.setState(
                        this.state.lunchmenuList
                    );
                }}
                commentValue={item.comments}
                isShowGuestName={false}
                onChangeCommentValue={(value) => {
                    item.comments = value;
                    this.setState(
                        this.state.lunchmenuList
                    );
                }}
            /> : <></>}
            {
                (item.dynamicGuestList.map((guestItem, index) => {
                    if (guestItem.isShowGuestEditOption) {
                        return <SelectedMenuItemInfo itemOrder={this.getSelectedMenuItemRecord(guestItem.orderList)}
                            onEditSelectedItem={() => {
                                guestItem.isShowGuestEditOption = false;
                                this.setState(
                                    this.state.lunchmenuList
                                );
                            }}
                            isShowGuestName={true}
                            guestName={guestItem.guest_name}
                            commentValue={guestItem.comments}
                            onChangeCommentValue={(value) => {
                                item.dynamicGuestList[index].comments = value;
                                this.setState(
                                    this.state.lunchmenuList
                                );
                            }}
                        />
                    } else {
                        return this.guestMenuItemsView(guestItem, index);
                    }

                }))
            }


        </View>
    }
    menuItemCard = (item, mainindexkey) => {
        return <View>{item.isSwitch &&
            <View>{
                !item.isShowEditOption &&
                <View>{item.orderList.sort((a, b) => a.titlename.toLowerCase().localeCompare(b.titlename.toLowerCase())).map((itemorder, index) => {
                    return <MenuItemCardView key={itemorder.id}
                        item={item}
                        itemOrder={itemorder}
                        itemIndex={index}
                        onMenuItemSelect={() => { this.onSelectItem(item, itemorder) }}
                    />

                })
                }</View>
            }

                <View>{this.showSelectedLunchItemsInfo(item, mainindexkey)}</View>
                {this.guestOrderMenuView(item, mainindexkey)}
            </View>
        }</View>
    }

    getOpacityValue = (orderItems) => {
        let isNoItemSelected = true;
        if (orderItems) {
            for (let index = 0; index < orderItems.length; index++) {
                if (orderItems[index].active) {
                    isNoItemSelected = false;
                }
            }
        }

        return isNoItemSelected;
    }

    selectRemoveButtonView = (item, itemorder) => {

        return <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10.0
        }}>
            <View>
                <Text style={{
                    fontWeight: "600",
                    fontSize: 13.0,
                    color: "#A1A4B0",
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>
                    {itemorder.halaal == "1" ? "Halaal" : "Non-halaal"}
                </Text>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center"
                }}>{itemorder.halaal == "1" &&
                    <SvgXml width="17"
                        height="17"
                        xml={green_leaf}

                    />}
                    <Text style={{
                        fontWeight: "600",
                        fontSize: 13.0,
                        color: "green",
                        marginHorizontal: 3.0,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>
                        Vegetarian
                    </Text>

                </View>


            </View>
            <View>{(itemorder.active) ? <TouchableOpacity style={{
                borderColor: "black",
                borderRadius: 5.0,
                alignSelf: "baseline",
                justifyContent: "center",
                alignItems: "center",
                height: 38.0,
                width: 120.0,
                padding: 10.0,
                borderWidth: 1.0
            }} onPress={() => { this.onSelectItem(item, itemorder) }}>
                <Text style={{
                    color: "black",
                    fontWeight: "700",
                    fontSize: 15.0,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>Remove</Text>

            </TouchableOpacity> : <TouchableOpacity style={{
                backgroundColor: "black",
                borderRadius: 5.0,
                alignSelf: "baseline",
                justifyContent: "center",
                alignItems: "center",
                height: 38.0,
                width: 120.0,
                padding: 10.0,

            }}
                onPress={() => { this.onSelectItem(item, itemorder) }}
            >
                <Text style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: 15.0,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>Select</Text>

            </TouchableOpacity>}

            </View>

        </View>
    }
    getSelectedMealCount() {
        let value = 0;
        let returnText = null;
        const { lunchmenuList } = this.state;
        let touchableOpacityButtonText = "Submit Order";
        for (let index = 0; index < lunchmenuList.length; index++) {
            if (lunchmenuList[index].orderid) {
                touchableOpacityButtonText = "Update Order";
            }

            for (let orderIndex = 0; orderIndex < lunchmenuList[index].orderList.length; orderIndex++) {
                const element = lunchmenuList[index].orderList[orderIndex];
                if (lunchmenuList[index].orderid == undefined ||
                    (!element.active &&
                        element.isOldOrder)) {
                    const element = lunchmenuList[index].orderList[orderIndex];
                    if (lunchmenuList[index].orderList[orderIndex].active) {
                        value = value + 1;
                    }
                } else {
                    if (element.active && !element.isOldOrder) {
                        value = value + 1;
                    }
                }

            }
            for (let guestIndex = 0; guestIndex < lunchmenuList[index].dynamicGuestList.length; guestIndex++) {
                for (let guestOrderIndex = 0; guestOrderIndex < lunchmenuList[index].dynamicGuestList[guestIndex].orderList.length; guestOrderIndex++) {
                    const element1 = lunchmenuList[index].dynamicGuestList[guestIndex].orderList[guestOrderIndex];
                    if (lunchmenuList[index].orderid == undefined ||
                        (!element1.active &&
                            element1.isOldOrder)) {

                        if (element1.active) {
                            value = value + 1;
                        }
                    } else {
                        if (element1.active && !element1.isOldOrder) {
                            value = value + 1;
                        }
                    }
                }
            }
        }

        if (value == 1) {
            returnText = `${touchableOpacityButtonText} (${value} meal)`;
        } else if (value > 1) {
            returnText = `${touchableOpacityButtonText} (${value} meals)`;
        } else {
            returnText = `${touchableOpacityButtonText}`;
        }
        return returnText;

    }
    lunchSubmitButtonView = () => {

        if (!this.state.isShowOrderSubmittedPopup) {
            return <View style={{
                backgroundColor: "white"
            }}>
                <ButtonImageTitle
                    title={this.getSelectedMealCount()}
                    imagesrc={Constantimages.doublearrrow_icon}
                    imagestyle={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                    }}
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
                        borderRadius: 10,
                        height: ConstantValues.SUBMIT_BUTTON_SIZE
                    }}
                    titleStyle={{
                        color: colors.COLOR_WHITE,
                        fontSize: 15,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}
                    buttonPress={
                        this.state.isOrderCreateButtonVisible ?
                            () => { this.onSubmitDetails() } :
                            () => { this.onDoubleTapHandler() }
                    }

                />
            </View>
        }
    }


    guestOrderMenuView = (item, mainindexkey) => {
        const { userData } = this.state;
        return <View style={{
            marginTop: 10.0
        }}>
            {
                item.dynamicGuestList.length > 0 && item.isSwitch &&
                <FlatList
                    data={item.dynamicGuestList}
                    renderItem={({ item, index }) => {
                        if (item.isAddGuest) {
                            return this.guestMenuItemsView(item, index);
                        } else {
                            this.EmptyView(item, index);
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            {userData[0].employed_location_id != ConstantValues.CALL_CENTER_LOCATION_ID && <TouchableOpacity style={{
                borderColor: "black",
                borderWidth: 1.0,
                borderRadius: 5.0,
                padding: 10.0,
                alignItems: "center",
                marginHorizontal: 10.0,
                marginBottom: 10.0
            }} onPress={() => {
                let isItemSelected = false;
                for (let index = 0; index < item.orderList.length; index++) {
                    const element = item.orderList[index];
                    if (element.active) {
                        isItemSelected = true;
                    }
                }
                if (item.isSwitch) {

                    if (item.dynamicGuestList.length > 0) {
                        let isGuestNameValid = false;
                        let guestIndex = -1;
                        for (let index = 0; index < item.dynamicGuestList.length; index++) {
                            if (item.dynamicGuestList[index].guest_name != "") {
                                isGuestNameValid = true;
                                guestIndex = index;
                            } else {
                                isGuestNameValid = false;
                            }
                        }
                        if (isGuestNameValid) {
                            const guestOrdersList = item.dynamicGuestList[guestIndex].orderList;
                            let isGuestItemSelected = false;
                            for (let orderIndex = 0; orderIndex < guestOrdersList.length; orderIndex++) {
                                const element = guestOrdersList[orderIndex];
                                if (element.active) {
                                    isGuestItemSelected = true;
                                }
                            }

                            if (isGuestItemSelected) {
                                this.addGuest(item, mainindexkey);
                            } else {
                                ValidateAlertPop(`Please add one item for guest  ${item.dynamicGuestList[guestIndex].guest_name}`);
                            }
                        } else {
                            ValidateAlertPop(`Please enter guest name`);
                        }

                    } else {
                        this.addGuest(item, mainindexkey);
                    }
                }
            }}>
                <Text style={{
                    color: "black",
                    fontWeight: "700",
                    fontSize: 16.0,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>
                    Order for a guest
                </Text>

            </TouchableOpacity>
            }


        </View >
    }
};
const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        padding: 5,
        borderRadius: 5,
        margin: 5,
        elevation: 5
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    lunch_orders_main_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        alignItems: "center"
    },
    lunch_orders_text: {
        fontSize: 28,
        color: colors.COLOR_BLACK,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",


    },
    tool_tip_main_style:
    {
        marginLeft: 20,
        marginRight: 0,
    },


    itemList: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderRadius: 5,
        margin: 5,
        justifyContent: 'space-between'
    },
    productImage: {
        width: 88,
        height: 88,
        alignSelf: 'center',
        paddingVertical: 5,
        borderRadius: 12,
    },
    productnameText: {
        fontSize: 15,
        fontWeight: '700',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ?
            "Gilroy-Regular" :
            "Radomir Tinkov - Gilroy-Regular",

    },
    seemore_text: {
        fontSize: fontsProps.md,
        fontWeight: 'bold',
        color: '#0097F7',
    },
    ingredient_text: {
        fontSize: fontsProps.sm,
        color: '#616161',
        paddingHorizontal: 10
    },
    tooltip_touch_container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})
