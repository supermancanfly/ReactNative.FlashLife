import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    TextInput
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import Moment from 'moment';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
    ApiGetWhiteLabelSettings,
    ApiGetClubMonthly,
    ApiGetClubScores,
    ApiGetClubCycles,
    ApiGetValueNominations
} from '../network/Services';
export default class ClubDashboardView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isLoading: false,
            userData: this.props.userData,
            whitelabelsettings: [],
            clubMonthList: [],
            valueNominationList: [],
            startmonth: 0,
            endmonth: 0,
            totalMonthsList: [],
            ismonthViewDisplay: false,
            totalMonths: [
                {
                    id: 1,
                    titlename: ConstantValues.JAN_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20",

                },
                {
                    id: 2,
                    titlename: ConstantValues.FEB_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "25"
                },
                {
                    id: 3,
                    titlename: ConstantValues.MAR_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 4,
                    titlename: ConstantValues.APRL_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 5,
                    titlename: ConstantValues.MAY_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 6,
                    titlename: ConstantValues.JUNE_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 7,
                    titlename: ConstantValues.JULY_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 8,
                    titlename: ConstantValues.AUG_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "25"
                },
                {
                    id: 9,
                    titlename: ConstantValues.SEP_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 10,
                    titlename: ConstantValues.OCT_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 11,
                    titlename: ConstantValues.NOV_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 12,
                    titlename: ConstantValues.DEC_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },


            ],
            firsthalfyearlist: [
                {
                    id: 1,
                    titlename: ConstantValues.JAN_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20",

                },
                {
                    id: 2,
                    titlename: ConstantValues.FEB_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "25"
                },
                {
                    id: 3,
                    titlename: ConstantValues.MAR_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 4,
                    titlename: ConstantValues.APRL_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 5,
                    titlename: ConstantValues.MAY_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
                {
                    id: 6,
                    titlename: ConstantValues.JUNE_STR,
                    icon: Constantimages.form_icon,
                    isSwitch: false,
                    points: "20"
                },
            ],
            secondhalfyearlist: [
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
    componentDidMount() {
        // this.getWhiteLabelSettings();
        this.getClubCycles()
        // this.getClubMonthly("yes")
        this.getClubMonthly("yes", "", "")
        // this.getClubScores();


    }

    getClubCycles = async () => {
        const { userData } = this.state;
        // console.log("getClubCycles---------------------------------------sai test---");
        //   let params = "?user_id=" + userData[0].id;
        let params = "?company_id=" + userData[0].employee_company_id
        await ApiGetClubCycles(userData[0].token, params).then(responseJson => {
            // console.log("ApiGetClubCycles response" + JSON.stringify(responseJson))
            this.setState({ isLoading: false })
            let data = [];

            if (responseJson.length > 0) {
                // this.getClubMonthly("yes", responseJson[0].start_month, responseJson[0].end_month)
                //    this.getClubMonthly("yes",9, 6)
                this.setState({
                    startmonth: responseJson[0].start_month,
                    endmonth: responseJson[0].end_month,

                })
                // this.setState({
                //     startmonth: 6,
                //     endmonth: 9,

                // })
                //    this.getClubMonthly("yes",11, 9)
                if (responseJson[0].end_month == 9) {
                    // this.getClubMonthly("yes",this.state.startmonth, 9)
                    this.getClubMonthly("", this.state.startmonth, 9)
                }
                else {
                    // this.getClubMonthly("yes",this.state.startmonth, this.state.endmonth) 
                    this.getClubMonthly("", this.state.startmonth, this.state.endmonth)

                }
                //    responseJson[0].start_month, responseJson[0].end_month
                // console.log("this.state.startmonth------live----------------------********************************" + this.state.startmonth + "this.state.endmonth" + this.state.endmonth)
                //    this.getClubMonthly("yes", this.state.startmonth, this.state.endmonth)
                //    this.getClubMonthly("yes", responseJson[0].start_month, responseJson[0].end_month)
                // this.getClubMonthly("yes",12, 1)
                // this.getClubMonthly("yes",1, 12)
                // this.getClubMonthly("yes",11, 9) 
                // this.getClubMonthly("yes",12,9) 
                // this.getClubMonthly("yes",12, 10) //not working
                // this.getClubMonthly("yes", responseJson[0].start_month, responseJson[0].end_month)
                //    this.getClubMonthly("yes",6, 9)
                //  6 9
                //  jun july agu sept oct nov dec 

                //    if(responseJson[0].start_month>responseJson[0].end_month ){
                //        console.log("responseJson[0].start_month"+responseJson[0].start_month+"responseJson[0].end_month"+responseJson[0].end_month)
                //    }
                //    {
                //     id: 1,
                //     titlename: ConstantValues.JAN_STR,
                //     icon: Constantimages.form_icon,
                //     isSwitch: false,
                //     points: "20",

                // },

                // this.setState({
                //   clubScoresList:responseJson
                // })
                // console.log("clubScoresList--------------------"+JSON.stringify(this.state.clubScoresList))
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }

    // ApiGetClubCycles
    getClubScores = async () => {
        const { userData } = this.state;
        //   console.log("getClubMonthly---");
        //   let params = "?user_id=" + userData[0].id;
        let params = "?company_id=" + userData[0].employee_company_id
        await ApiGetClubScores(userData[0].token, params).then(responseJson => {
            // console.log("ApiGetClubScores response" + JSON.stringify(responseJson))
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                // this.setWhiteLables(responseJson)
                this.setState({
                    clubScoresList: responseJson
                })
                //   console.log("clubScoresList--------------------"+JSON.stringify(this.state.clubScoresList))
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    getClubMonthly = async (value, startmonth, endmonth) => {
        const { userData } = this.state;

        //   let params = "?user_id=" + userData[0].id;
        let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
        // "?user_id=" + userData[0].id+"&company_id"+userData[0].employee_company_id+"&category="+value+"&end_month"+endmonth+"&start_month"+startmonth;
        // let params = "?user_id=" + userData[0].id + "&company_id" + userData[0].employee_company_id + "&category=" + value;
        if (value == "") {

            params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id + "&end_month=" + endmonth + "&start_month=" + startmonth;
        }
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            // console.log("ApiGetClubMonthly response---t" + JSON.stringify(responseJson))
            this.setState({ isLoading: false })
            // console.log("startmonth-----------------------" + startmonth + "-----" + endmonth)
            if (responseJson.length > 0) {
                // this.setWhiteLables(responseJson)
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson
                    })

                }
                else {
                    // console.log("params" + params)
                    // console.log("----------------------------------5555555555555555555555555555555555555555--------------------" + JSON.stringify(responseJson))
                    // console.log("params" + params)
                    let data = []
                    if (startmonth > endmonth) {
                        data.push({
                            id: this.state.totalMonths[startmonth - 1].id,
                            titlename: this.state.totalMonths[startmonth - 1].titlename,
                            icon: Constantimages.form_icon,
                            isSwitch: false,
                            points: "20"
                        })

                        if (startmonth == 12) {
                            // console.log("startmonth" + startmonth)            
                            for (let k = 0; k < endmonth; k++) {
                                // console.log("this.state.totalMonths[k].id----" + this.state.totalMonths[k].id)
                                data.push({
                                    id: this.state.totalMonths[k].id,
                                    titlename: this.state.totalMonths[k].titlename,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20"
                                })
                            }
                        }

                        // 11 9
                        // 12 9
                        for (let j = startmonth; j < 12; j++) {
                            // console.log("J" + this.state.totalMonths[j].id)
                            data.push({
                                id: this.state.totalMonths[j].id,
                                titlename: this.state.totalMonths[j].titlename,
                                icon: Constantimages.form_icon,
                                isSwitch: false,
                                points: "20"
                            })
                            // console.log("this.state.totalMonths[j].id--2" + this.state.totalMonths[j].id)
                            if (this.state.totalMonths[j].id == 12) {
                                // console.log("this.state.totalMonths[j].id" + this.state.totalMonths[j].id)
                                // console.log("endmonth" + endmonth)

                                for (let k = 0; k < endmonth; k++) {
                                    // console.log("this.state.totalMonths[k].id----" + this.state.totalMonths[k].id)
                                    data.push({
                                        id: this.state.totalMonths[k].id,
                                        titlename: this.state.totalMonths[k].titlename,
                                        icon: Constantimages.form_icon,
                                        isSwitch: false,
                                        points: "20"
                                    })
                                }
                            }

                            else {
                            }
                        }


                    }
                    else {


                        // console.log("---------------------------------else-----------");


                        data.push({
                            id: this.state.totalMonths[startmonth - 1].id,
                            titlename: this.state.totalMonths[startmonth - 1].titlename,
                            icon: Constantimages.form_icon,
                            isSwitch: false,
                            points: "20"
                        })

                        for (let j = startmonth; j < 12; j++) {
                            // console.log("J" + this.state.totalMonths[j].id)
                            if (endmonth == this.state.totalMonths[j].id) {
                                data.push({
                                    id: this.state.totalMonths[j].id,
                                    titlename: this.state.totalMonths[j].titlename,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20"
                                })
                                break;

                            }
                            data.push({
                                id: this.state.totalMonths[j].id,
                                titlename: this.state.totalMonths[j].titlename,
                                icon: Constantimages.form_icon,
                                isSwitch: false,
                                points: "20"
                            })
                            // console.log("this.state.totalMonths[j].id--2" + this.state.totalMonths[j].id)
                            // if (this.state.totalMonths[j].id == 12) {
                            //     console.log("this.state.totalMonths[j].id" + this.state.totalMonths[j].id)
                            //     console.log("endmonth" + endmonth)

                            //     for (let k = 0; k < endmonth; k++) {
                            //         console.log("this.state.totalMonths[k].id----" + this.state.totalMonths[k].id)
                            //         data.push({
                            //             id: this.state.totalMonths[k].id,
                            //             titlename: this.state.totalMonths[k].titlename,
                            //             icon: Constantimages.form_icon,
                            //             isSwitch: false,
                            //             points: "20"
                            //         })
                            //     }
                            // }

                            // else{ 
                            // }
                        }
                    }
                    this.setState({
                        totalMonthsList: data
                    })


                    let pData = [];
                    // {itemyears.id == item.month && item.valid_month_points == null ? 0 : itemyears.id == item.month && item.valid_month_points}
                    for (let i = 0; i < responseJson.length; i++) {

                        pData.push({
                            id: i,
                            month: responseJson[i].month,
                            valid_month_points: responseJson[i].valid_month_points,
                            max_points_pm_total: responseJson[i].max_points_pm_total,
                            CSI: responseJson[i].CSI,
                            vacancy_share: responseJson[i].vacancy_share,
                            wellness: responseJson[i].wellness,
                            virtual_transaction: responseJson[i].virtual_transaction,
                            market_visit: responseJson[i].market_visit,
                            values_nominated: responseJson[i].values_nominated,
                            values_nominator: responseJson[i].values_nominator,
                            flash_book: responseJson[i].flash_book,
                            isSwitch: false,

                        })
                    }

                    this.setState({
                        // pointsByMonth: responseJson
                        pointsByMonth: pData
                    })
                    this.getValueNominations();
                }
                //   console.log("clubMonthList--------------------"+JSON.stringify(this.state.clubMonthList[0].club_scoring))
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    getValueNominations = async () => {
        const { userData } = this.state;
        //   console.log("get Value Nominatons---");
        let params = "?nominated_user_id=" + userData[0].id;
        //   nominated_user_id=223
        //   let params = "?nominated_user_id=223"
        this.setState({ isLoading: true })
        await ApiGetValueNominations(userData[0].token, params).then(responseJson => {
            // console.log("getValueNominations response" + JSON.stringify(responseJson))
            this.setState({ isLoading: false })
            let data = []
            if (responseJson.length > 0) {
                // this.setWhiteLables(responseJson)
                for (let i = 0; i < responseJson.length; i++) {

                    let name = "";
                    let surname = "";
                    let nomiteduser = ""

                    if (userData[0].id == responseJson[i].nominated_user_id) {

                        name = responseJson[i].nominated_user_details.name;
                        surname = responseJson[i].nominated_user_details.surname;
                        nomiteduser = "R"

                    }
                    else if (userData[0].id == responseJson[i].nominator_user_id) {
                        name = responseJson[i].nominator_user_details.name;
                        surname = responseJson[i].nominator_user_details.surname;
                        nomiteduser = "G"
                    }

                    data.push({
                        value_name: responseJson[i].value.value_name,
                        date: responseJson[i].date,
                        uname: name,
                        surname: surname,
                        isSwitch: false,
                        value_image: responseJson[i].value.value_image,
                        behaviour: responseJson[i].behaviour,
                        specific: responseJson[i].specific,
                        impact: responseJson[i].impact,
                        nomiteduser: nomiteduser
                    })
                }
                this.setState({
                    // valueNominationList: responseJson
                    valueNominationList: data
                })
                //   console.log("getValueNominations list--------------------"+JSON.stringify(this.state.valueNominationList))
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
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
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                />
            )
        }
    }

    onSelectMonth(item) {
        // console.log("onSelectMonth------------" + JSON.stringify(item))

    }
    renderRowSecondMonthList() {
        // console.log("this.state.totalMonthsList.length-----check" + this.state.totalMonthsList.length)

        let isViewDisplay = false;
        let dynamicList = []
        // if(this.state.totalMonthsList.length > 6 && this.state.pointsByMonth.length>6){
        for (let i = 6; i < this.state.totalMonthsList.length; i++) {
            // console.log("this.state.totalMonthsList[i].id----test" + this.state.totalMonthsList[i].id + "this.state.endmonth test" + this.state.endmonth)

            dynamicList.push(
                <TouchableOpacity
                    style={{
                        flexDirection: 'row', alignSelf: 'center',
                        width: dimensionsProps.fullWidth / 6,
                    }}

                >
                    <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
                        {this.state.totalMonthsList[i].titlename}
                    </Text>
                </TouchableOpacity>
            )
            // console.log("dynamicList" + dynamicList.length)

        }

        // }
        return dynamicList;



    }
    renderRowMonth() {
        // console.log("this.state.totalMonthsList.length-----check" + this.state.totalMonthsList.length)

        let isViewDisplay = false;
        let dynamicList = []
        for (let i = 0; i < this.state.totalMonthsList.length; i++) {
            // console.log("this.state.totalMonthsList[i].id----test" + this.state.totalMonthsList[i].id + "this.state.endmonth test" + this.state.endmonth)
            //   if (this.state.totalMonthsList[i].id == this.state.endmonth) {
            //       console.log("this.state.totalMonthsList[i].id---2---"+this.state.totalMonthsList[i].id)
            //     isViewDisplay = true;
            //     break;
            //   }
            //   if(!isViewDisplay){
            // console.log("this.state.totalMonthsList[i].id3"+this.state.totalMonthsList[i].id)
            // return (
            //                   <TouchableOpacity
            //         style={{
            //             flexDirection: 'row', alignSelf: 'center',
            //             width: dimensionsProps.fullWidth / 6,
            //         }}

            //     >
            //         <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
            //             {this.state.totalMonthsList[i].titlename}
            //             </Text>
            //     </TouchableOpacity>
            //             )

            //      if (this.state.totalMonthsList[i].id == this.state.endmonth) {
            //       console.log("this.state.totalMonthsList[i].id---2---"+this.state.totalMonthsList[i].id)
            //     isViewDisplay = true;
            //     break;
            //   }
            // 11 9
            if (i == 6) {
                break;
            }
            if (!isViewDisplay) {
                dynamicList.push(
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row', alignSelf: 'center',
                            width: dimensionsProps.fullWidth / 6,
                        }}

                    >
                        <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
                            {this.state.totalMonthsList[i].titlename}
                        </Text>
                    </TouchableOpacity>
                )
            }
            // console.log("dynamicList" + dynamicList.length)
            //   }
            //   if(isViewDisplay){
            //       return;
            //   }


        }
        return dynamicList;

        // return;
        //     let isViewDisplay=false;
        //     if (item.id==this.state.endmonth) {

        //     }
        //     if(!this.state.isViewDisplay){
        //         return (
        //               <TouchableOpacity
        //     style={{
        //         flexDirection: 'row', alignSelf: 'center',
        //         width: dimensionsProps.fullWidth / 6,
        //     }}
        //     key={index}
        // >
        //     <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
        //         {item.titlename}
        //         </Text>
        // </TouchableOpacity>
        //         )

        //     }
    }

    onValueBahaviorExpand(item) {
        const { valueNominationList } = this.state;
        // console.log("item" + JSON.stringify(item))
        item.isSwitch = !item.isSwitch
        this.setState({
            valueNominationList
        })

    }

    renderRowCategoriesEarn() {
        return <View>
            {this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].club_scoring.map((item, index) => (
                <TouchableOpacity
                    style={{
                        width: '100%',
                        paddingVertical: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 20,
                        alignItems: 'center',
                        borderBottomColor: '#e4e4e4',
                        borderBottomWidth: 1,
                        borderTopWidth: 1,
                        borderTopColor: '#e4e4e4'
                    }}>

                    <Image source={{ uri: item.category_image }}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                        }}
                    >
                    </Image>
                    <Text style={{
                        fontSize: fontsProps.md,
                        color: colors.GREY_COLOR, paddingHorizontal: 5
                    }}>
                        {item.category_name}
                    </Text>
                </TouchableOpacity>))}
        </View>
    }
    render() {
        return (
            <View style={{
                flex: 1,
                marginBottom: Platform.OS === 'ios' ? 0 : 70,
                // marginTop: Platform.OS === 'ios' ? 40 : 0,
            }}>
                <ScrollView
                // contentContainerStyle={{
                //     flex:1
                // }}
                >
                    <View style={{
                        margin: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        borderRadius: 5,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                    }}>
                        <Text style={{
                            fontSize: fontsProps.md, color: colors.GREY_COLOR,
                            textAlign: 'center', fontWeight: 'bold', paddingTop: 10
                        }}>
                            {/* {ConstantValues.TOTAL_POINTS_STR} */}
                                Total Points Redeemable
                                </Text>
                        <Text style={{
                            fontSize: fontsProps.lg,
                            color: this.state.header_background != "" ? this.state.header_background
                                : colors.COLOR_THEME,
                            textAlign: 'center',
                            fontWeight: 'bold', paddingBottom: 10
                        }}>
                            {/* {this.state.clubScoresList.length>0 && this.state.clubScoresList[0].yearly_points} */}

                            {this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].yearly_points}
                            {/* {this.state.clubMonthList.length > 0 && this.state.clubMonthList[0].yearly_points} */}
                        </Text>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                borderBottomColor: '#e4e4e4',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#e4e4e4'
                            }}>
                            <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
                                {/* {ConstantValues.CYCLES_COMPLETED_STR} */}
                                Months Completed
                                </Text>
                            <Text style={{
                                fontSize: fontsProps.md,
                                color: colors.GREY_COLOR,
                            }}>

                                {this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].months_completed}
                                {/* {this.state.clubMonthList.length > 0 && this.state.clubMonthList[0].months_completed} */}
                                {/* {this.state.clubMonthList.length>0 && this.state.clubMonthList[0].cycles_completed} */}

                            </Text>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                            }}>
                            <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
                                {ConstantValues.GRACE_MONTH_AVAILABLE_STR}</Text>
                            <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>

                                {this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].grace_month == "1" ? ConstantValues.YES_STR : ConstantValues.NO_STR}
                                {/* {this.state.clubMonthList.length > 0 && this.state.clubMonthList[0].grace_month == "1" ? ConstantValues.YES_STR : ConstantValues.NO_STR} */}
                            </Text>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                // borderBottomColor: '#e4e4e4',
                                // borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#e4e4e4',
                                alignItems: 'center',
                            }}>
                            <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>
                                On Track To Earn Leave
                        </Text>
                            <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>{this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].leave_on_track == "1" ? ConstantValues.YES_STR : ConstantValues.NO_STR}</Text>
                        </View>
                    </View>
                    <View style={{
                        margin: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        borderRadius: 5,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                    }}>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                borderBottomColor: '#e4e4e4',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#e4e4e4'
                            }}>
                            <Text style={{
                                fontSize: 16,
                                color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                            }}>{ConstantValues.CATEGORIES_STILL_TO_EARN_STR}</Text>
                        </View>
                        {
                            this.renderRowCategoriesEarn()
                        }
                    </View>
                    <View style={{
                        margin: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        borderRadius: 5,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                    }}>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                borderBottomColor: '#e4e4e4',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#e4e4e4'
                            }}>
                            <Text style={{
                                fontSize: 16, color: this.state.header_background != "" ?
                                    this.state.header_background : colors.COLOR_THEME,
                            }}>{ConstantValues.POINTS_BY_MONTH_STR}</Text>
                        </View>
                        <View style={{

                            flexDirection: 'row', width: '100%',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            backgroundColor: colors.COLOR_LIGHT_GRAY
                        }}>
                            {this.renderRowMonth()}

                        </View>
                        <View style={{

                            flexDirection: 'row',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                        }}>
                            {this.state.totalMonthsList.map((itemyears, index) => (
                                <View style={{
                                    flexDirection: 'row',
                                    width: dimensionsProps.fullWidth / 6,
                                    alignSelf: 'center',
                                }}
                                    key={index}
                                >

                                    {this.state.pointsByMonth.slice(0, 12).map((item, pindex) => (

                                        <TouchableOpacity
                                            style={{
                                               
                                            }}

                                            onPress={this.props.onSelctMonthDetails.bind(this, item,itemyears)}
                                        >
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                                                textAlign: 'center',

                                            }}>
                                                {/* {itemyears.id+""+item.month} */}
                                                {/* {item.valid_month_points}  */}
                                                {/* {itemyears.id == item.month && item.valid_month_points == null ? 0 : itemyears.id == item.month && item.valid_month_points} */}
                                                {itemyears.id == item.month && item.valid_month_points == null ? 0 : itemyears.id == item.month && item.valid_month_points}
                                                {/* {itemyears.id == item.month && item.valid_month_points == null ? 0 :  item.valid_month_points:""} */}
                                                {/* {itemyears.id == item.month ? item.valid_month_points :  item.month } */}
                                                {/* { item.valid_month_points} */}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {/* <View style={{
                            flex: 1,
                            flexDirection: 'row', width: '100%', 
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            backgroundColor: colors.COLOR_LIGHT_GRAY
                        }}>
                            {this.state.firsthalfyearlist.map((item, index) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignSelf: 'center',
                                    width:dimensionsProps.fullWidth/6, }}
                                    key={index}
                                >
                                    <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>{item.titlename}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{
                            flex: 1,
                             flexDirection: 'row',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                        }}>
                            {this.state.pointsByMonth.slice(0, 4).map((item, index) => (
                                <TouchableOpacity
                                    style={{
                                         flexDirection: 'row',
                                     width:dimensionsProps.fullWidth/6,
                                     alignSelf: 'center', 
                                    
                                     }}
                                    key={index}
                                >
                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                                        textAlign: 'center',
                                        paddingHorizontal:5
                                    }}>
                                        {item.valid_month_points==null ?0:item.valid_month_points}
                                     
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View> */}
                        {/* {this.state.clubMonthList.length>6&&
                        <View style={{
                            flex: 1,
                            flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 5,
                            paddingVertical: 5,
                            backgroundColor: colors.COLOR_LIGHT_GRAY
                        }}>
                            {this.state.secondhalfyearlist.map((item, index) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignSelf: 'center', }}
                                    key={index}
                                >
                                    <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>{item.titlename}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
    } */}
                        {/* {this.state.clubMonthList.length>6&& */}
                        {/* <View style={{
                            // flex: 1,
                            flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 5,
                            paddingVertical: 5,
                            backgroundColor: colors.COLOR_LIGHT_GRAY
                        }}>
                           {this.state.totalMonthsList.slice(6, 12).map((item, index) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignSelf: 'center', }}
                                    key={index}
                                >
                                    <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, }}>{item.titlename}</Text>
                                </TouchableOpacity>
                            ))}
                        </View> */}
                        {/* } */}
                        {this.state.totalMonthsList.length > 6 && this.state.pointsByMonth.length > 6 &&
                            <View style={{

                                flexDirection: 'row', width: '100%',
                                paddingHorizontal: 5,
                                paddingVertical: 5,
                                backgroundColor: colors.COLOR_LIGHT_GRAY
                            }}>

                                {this.renderRowSecondMonthList()}
                            </View>
                        }
                        {this.state.totalMonthsList.length > 6 && this.state.pointsByMonth.length > 6 &&
                            <View style={{

                                flexDirection: 'row',
                                paddingHorizontal: 5,
                                paddingVertical: 5,
                            }}>
                                {this.state.totalMonthsList.map((itemyears, index) => (
                                    <View style={{
                                        flexDirection: 'row',
                                        width: dimensionsProps.fullWidth / 6,
                                        alignSelf: 'center',
                                    }}
                                        key={index}
                                    >
                                        {this.state.pointsByMonth.slice(5, 11).map((item, pindex) => (
                                            <TouchableOpacity
                                                style={{
                                                    // backgroundColor:item.month>=item.max_points_pm_total?colors.GRADIENT_COLOR1:colors.COLOR_RED
                                                }}
                                                //  onPress={this.onSelectMonth.bind(this,item)}
                                                onPress={this.props.onSelctMonthDetails.bind(this, item, itemyears)}
                                            >
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                                                    textAlign: 'center',

                                                }}>

                                                    {itemyears.id == item.month && item.valid_month_points == null ? 0 : itemyears.id == item.month && item.valid_month_points}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}
                            </View>
                            // <View style={{

                            //     flexDirection: 'row',
                            //     paddingHorizontal: 5,
                            //     paddingVertical: 5,
                            // }}>
                            //     {this.state.totalMonths.map((itemyears, index) => (
                            //         <View style={{
                            //             flexDirection: 'row',
                            //             width: dimensionsProps.fullWidth / 6,
                            //             alignSelf: 'center',
                            //         }}
                            //             key={index}>
                            //             {this.state.pointsByMonth.slice(5, 11).map((item, pindex) => (
                            //                 <TouchableOpacity>
                            //                     <Text style={{
                            //                         fontSize: fontsProps.md,
                            //                         color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                            //                         textAlign: 'center',
                            //                         paddingHorizontal: 5
                            //                     }}>

                            //                         {itemyears.id == item.month && item.valid_month_points == null ? 0 : itemyears.id == item.month && item.valid_month_points}

                            //                     </Text>
                            //                 </TouchableOpacity>
                            //             ))}
                            //         </View>))}
                            // </View>
                        }

                    </View>

                    <View style={{
                        margin: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        borderRadius: 5,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                    }}>
                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                borderBottomColor: '#e4e4e4',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#e4e4e4'
                            }}>
                            <Text style={{
                                fontSize: 16,
                                color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                            }}>{ConstantValues.VALUES_NOMINATIONS_STR}</Text>
                        </View>
                        {this.state.valueNominationList.map((item, index) => (
                            <View>
                                <TouchableOpacity
                                    style={{
                                        width: '100%',
                                        paddingVertical: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomColor: '#e4e4e4',
                                        borderBottomWidth: 1,
                                        borderTopWidth: 1,
                                        borderTopColor: '#e4e4e4'
                                    }}
                                    onPress={this.onValueBahaviorExpand.bind(this, item)}
                                >
                                    <View style={{ paddingHorizontal: 10, }}>
                                        <Image source={{ uri: item.value_image }}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                paddingHorizontal: 5
                                            }}
                                        >
                                        </Image>
                                    </View>
                                    <View>
                                        <Text style={{
                                            fontSize: fontsProps.md,
                                            fontWeight: 'bold',
                                            fontSize: fontsProps.md,
                                            color: colors.GREY_COLOR,
                                        }}>
                                            {item.value_name}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{
                                                fontSize: fontsProps.md, color: colors.GREY_COLOR,
                                                // paddingHorizontal: 5
                                            }}>{item.nomiteduser == "R" ? ConstantValues.BY_STR : "To"}</Text>
                                            <Text style={{
                                                fontSize: fontsProps.md, color: this.state.header_background != "" ? this.state.header_background : colors.COLOR_THEME,
                                                paddingHorizontal: 5,
                                            }}>{item.uname + " " + item.surname}</Text>
                                            <View style={{
                                                height: 14, alignSelf: 'center', width: 1,
                                                backgroundColor: colors.GREY_COLOR
                                            }}>
                                            </View>
                                            <Text style={{
                                                fontSize: fontsProps.md, color: colors.GREY_COLOR,
                                                paddingHorizontal: 5
                                            }}>

                                                {Moment(item.date).format('ll')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        paddingRight: 5,
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        flexDirection: 'row'
                                    }}>
                                        <View style={{
                                            width: 25, height: 25, borderRadius: 25 / 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // alignSelf:'flex-end',
                                            // backgroundColor: this.state.header_background != "" ? this.state.header_background
                                            // : colors.COLOR_THEME,
                                            backgroundColor: item.nomiteduser == "R" ? this.state.header_background != "" ? this.state.header_background
                                                : colors.COLOR_THEME : colors.GREY_COLOR
                                            // backgroundColor: item.nomiteduser=="R"?colors.GRADIENT_COLOR1:colors.GREY_COLOR
                                        }}>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                color: colors.COLOR_WHITE,
                                                // paddingHorizontal: 5
                                            }}>{item.nomiteduser}</Text>
                                        </View>
                                        <Image
                                            source={item.isSwitch ? Constantimages.drop_up_icon : Constantimages.arrow_down_icon}
                                            // source={null}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                tintColor: colors.GREY_COLOR,
                                            }}
                                        >
                                        </Image>
                                    </View>


                                </TouchableOpacity>
                                {item.isSwitch &&
                                    <View style={{ marginHorizontal: 5 }}>

                                        <Text style={{
                                            fontSize: fontsProps.lg,
                                            fontWeight: 'bold',
                                            color: colors.GREY_COLOR,

                                            marginTop: 10,
                                        }}>Behaviour
                    </Text>
                                        <TextInput

                                            style={{
                                                flexDirection: 'row',
                                                color: colors.COLOR_BLACK,
                                                width: '100%',
                                                textAlignVertical: 'top',
                                                borderWidth: 1,
                                                marginTop: 10,
                                                borderColor: this.state.header_background != "" ?
                                                    this.state.header_background : colors.COLOR_THEME,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,

                                                paddingVertical: Platform.OS == 'ios' ? 10 : null,
                                                // height: Platform.OS == 'ios' ? 70 : null
                                            }}

                                            underlineColorAndroid="transparent"
                                            editable={false}
                                            value={item.behaviour}

                                            keyboardType='default'
                                            returnKeyType="done"
                                        />


                                        <Text style={{
                                            fontSize: fontsProps.lg,
                                            fontWeight: 'bold',
                                            color: colors.GREY_COLOR,

                                            marginTop: 10,
                                        }}>Situation
                    </Text>
                                        <TextInput

                                            style={{
                                                flexDirection: 'row',
                                                color: colors.COLOR_BLACK,
                                                width: '100%',
                                                textAlignVertical: 'top',
                                                borderWidth: 1,
                                                marginTop: 10,
                                                borderColor: this.state.header_background != "" ?
                                                    this.state.header_background : colors.COLOR_THEME,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,

                                                paddingVertical: Platform.OS == 'ios' ? 10 : null,
                                                // height: Platform.OS == 'ios' ? 70 : null
                                            }}

                                            underlineColorAndroid="transparent"
                                            editable={false}
                                            value={item.specific}

                                            keyboardType='default'
                                            returnKeyType="done"
                                        />



                                        <Text style={{
                                            fontSize: fontsProps.lg,
                                            fontWeight: 'bold',
                                            color: colors.GREY_COLOR,

                                            marginTop: 10,
                                        }}>Impact
                    </Text>
                                        <TextInput

                                            style={{
                                                flexDirection: 'row',
                                                color: colors.COLOR_BLACK,
                                                width: '100%',
                                                textAlignVertical: 'top',
                                                borderWidth: 1,
                                                marginTop: 10,
                                                borderColor: this.state.header_background != "" ?
                                                    this.state.header_background : colors.COLOR_THEME,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,

                                                paddingVertical: Platform.OS == 'ios' ? 30 : null,
                                                height: Platform.OS == 'ios' ? 70 : null
                                            }}

                                            underlineColorAndroid="transparent"
                                            editable={false}
                                            value={item.impact}
                                            numberOfLines={4}
                                            multiline={true}
                                            keyboardType='default'
                                            returnKeyType="done"
                                        />


                                    </View>

                                }
                            </View>
                        ))}
                    </View>


                </ScrollView>
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
