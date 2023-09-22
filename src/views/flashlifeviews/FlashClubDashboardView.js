import React, { useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    TextInput,
    StatusBar,
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { ConstantValues } from '../../utils/ConstantValues';
import { apiErrorHandler, ValidateAlertPop } from '../../utils/CommonMethods';

import Moment from 'moment';
import { colors, fontsProps, dimensionsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ClubHeaderCard from '../../components/club/ClubHeaderCard';
import ProgressClubCard from '../../components/club/ProgressClubCard';
import FlashProfileView from '../flashlifeviews/FlashProfileView';
import Cow from '../../assets/svg/Cow.svg';
import { SvgXml } from 'react-native-svg';
import {
    ApiGetClubMonthly,
    ApiGetClubScores,
    ApiGetClubCycles,
    ApiGetValueNominations,
    ApiGetReferences
} from '../../network/Services';
import ActualMonthsView from '../ActualMonthsView';
export default class FlashClubDashboardView extends React.Component {
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
            max_month_points: 0,
            max_points_pm: 0,
            max_points_pm_sec2: 0,
            totalMonthsList: [],
            ismonthViewDisplay: false,
            categoryList: [],
            categoryListSec1: [],
            categoryListSec2: [],
            previceValue: 0,
            currentValue: 4,
            toolTipVisible: false,
            monthsTooltip: false,
            graceTooltip: false,
            trackTooltip: false,
            homeLocationData: this.props.homeLocationData,
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
            monthcount: 0,
            featureData: this.props.featureData,
            myClubUserInfo: [],
            myClubMonthInfo: [],
            myClubGraceInfo: [],
            myClubOnTrackInfo: [],
            landingData: [],
            total_points_firstsection: 0,
            total_points_secondsection: 0,
        }

    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashDashboardView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getClubCycles()
        this.getClubMonthly("yes", "", "")
    }
    getRefernceLinkData = () => {
        const { userData } = this.state;
        let data = [];
        let params = "?company_id=" + this.state.userData[0].employee_company_id
        ApiGetReferences(userData[0].token, params).then(responseJson => {
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    if (responseJson[i].section == "my_club_user") {
                        this.setState({
                            myClubUserInfo: responseJson[i]
                        })
                    }
                    else if (responseJson[i].section == "my_club_month") {
                        this.setState({
                            myClubMonthInfo: responseJson[i]
                        })
                    }
                    else if (responseJson[i].section == "my_club_grace") {
                        this.setState({
                            myClubGraceInfo: responseJson[i]
                        })
                    }
                    else if (responseJson[i].section == "my_club_ontrack") {
                        this.setState({
                            myClubOnTrackInfo: responseJson[i]
                        })
                    }
                }
            }
            this.getCategoryList();

        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    getCategoryList = async () => {
        const { userData } = this.state;
        this.setState({
            isLoading: true,
        })
        let params = "?company_id=" + userData[0].employee_company_id
        let dataArray1 = [];
        let dataArray2 = [];
        await ApiGetClubScores(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            if (response.length > 0) {
                let total_points_temp = 0;
                for (let i = 0; i < response.length; i++) {
                    if (i == 0) {
                        total_points_temp = response[i].total_points
                        this.setState({
                            total_points_firstsection: response[i].total_points,
                        })
                    }
                    let color = "#E3E3E3";
                    if (response[i].club_scoring_id == 1) {
                        color = "#F33051";
                    }
                    else if (response[i].club_scoring_id == 2) {
                        color = "#0052B0";
                    }
                    else if (response[i].club_scoring_id == 3) {
                        color = "#9031FA";
                    }
                    else if (response[i].club_scoring_id == 4) {
                        color = "#FF8900";
                    }
                    else if (response[i].club_scoring_id == 5) {
                        color = "#0097F7";
                    }
                    else if (response[i].club_scoring_id == 6) {
                        color = "#08BF91";
                    }
                    else if (response[i].club_scoring_id == 7) {
                        color = "#8BD41F";
                    }
                    else if (response[i].club_scoring_id == 8) {
                        color = "#9031FA";
                    }

                    if (this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].club_scoring.length != 0) {
                        for (let j = 0; j < this.state.clubMonthList[this.state.clubMonthList.length - 1].club_scoring.length; j++) {
                            if (response[i].club_scoring_id == this.state.clubMonthList[this.state.clubMonthList.length - 1].club_scoring[j].club_scoring_id) {
                                color = "#E3E3E3";
                            }
                            else {

                            }

                        }
                    }
                    if (response[i].total_points == total_points_temp) {
                        dataArray1.push({
                            club_scoring_id: response[i].club_scoring_id,
                            category_image: response[i].category_image,
                            category_name: response[i].category_name,
                            total_points: response[i].total_points,
                            color: color,
                            tag: response[i].tag
                        })
                    }
                    else {
                        dataArray2.push({
                            club_scoring_id: response[i].club_scoring_id,
                            category_image: response[i].category_image,
                            category_name: response[i].category_name,
                            total_points: response[i].total_points,
                            color: color,
                            tag: response[i].tag
                        })
                    }
                    this.setState({
                        categoryListSec1: dataArray1,
                        categoryListSec2: dataArray2,
                    });
                }
            }
            else {

            }
        }).catch(error => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })

    }
    componentWillUnmount() {
    }
    getClubCycles = async () => {
        const { userData } = this.state;
        let params = "?company_id=" + userData[0].employee_company_id
        await ApiGetClubCycles(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            let data = [];
            if (responseJson.length > 0) {
                this.setState({
                    startmonth: responseJson[0].start_month,
                    endmonth: responseJson[0].end_month,
                })
                if (responseJson[0].end_month == 9) {
                    this.getClubMonthly("", this.state.startmonth, 9)
                }
                else {
                    this.getClubMonthly("", this.state.startmonth, this.state.endmonth)
                }
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    getClubScores = async () => {
        const { userData } = this.state;
        let params = "?company_id=" + userData[0].employee_company_id
        await ApiGetClubScores(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                this.setState({
                    clubScoresList: responseJson
                })
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    getClubMonthly = async (value, startmonth, endmonth) => {
        const { userData } = this.state;
        let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
        if (value == "") {
            params = "?user_id=" + userData[0].id + "&company_id=" +
                userData[0].employee_company_id + "&end_month=" + endmonth + "&start_month=" + startmonth;
        }
        this.setState({ isLoading: true })
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson,
                        max_month_points: responseJson[responseJson.length - 1].valid_month_points,
                    });
                    if (responseJson[responseJson.length - 1].club_scoring[0].length != 0) {
                        this.setState({
                            max_month_points: responseJson[responseJson.length - 1].valid_month_points,
                        });
                    }
                }

                else {
                    if (responseJson[responseJson.length - 1].club_scoring.length != 0) {
                        this.setState({
                            max_points_pm: responseJson[responseJson.length - 1].club_scoring[0].total_points
                        });
                    }
                    let data = []
                    if (startmonth > endmonth) {
                        data.push({
                            id: this.state.totalMonths[startmonth - 1].id,
                            titlename: this.state.totalMonths[startmonth - 1].titlename,
                            icon: Constantimages.form_icon,
                            isSwitch: false,
                            points: "20",
                        });
                        if (startmonth == 12) {
                            for (let k = 0; k < endmonth; k++) {
                                data.push({
                                    id: this.state.totalMonths[k].id,
                                    titlename: this.state.totalMonths[k].titlename,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20",
                                });
                            }
                        }
                        for (let j = startmonth; j < 12; j++) {
                            data.push({
                                id: this.state.totalMonths[j].id,
                                titlename: this.state.totalMonths[j].titlename,
                                icon: Constantimages.form_icon,
                                isSwitch: false,
                                points: "20",
                            });
                            if (this.state.totalMonths[j].id == 12) {
                                for (let k = 0; k < endmonth; k++) {
                                    data.push({
                                        id: this.state.totalMonths[k].id,
                                        titlename: this.state.totalMonths[k].titlename,
                                        icon: Constantimages.form_icon,
                                        isSwitch: false,
                                        points: "20",
                                    });
                                }
                            }
                            else {
                            }
                        }
                    }

                    else {
                        data.push({
                            id: this.state.totalMonths[startmonth - 1].id,
                            titlename: this.state.totalMonths[startmonth - 1].titlename,
                            icon: Constantimages.form_icon,
                            isSwitch: false,
                            points: "20",

                        });
                        for (let j = startmonth; j < 12; j++) {
                            if (endmonth == this.state.totalMonths[j].id) {
                                data.push({
                                    id: this.state.totalMonths[j].id,
                                    titlename: this.state.totalMonths[j].titlename,
                                    icon: Constantimages.form_icon,
                                    isSwitch: false,
                                    points: "20",

                                });
                                break;
                            }
                            data.push({
                                id: this.state.totalMonths[j].id,
                                titlename: this.state.totalMonths[j].titlename,
                                icon: Constantimages.form_icon,
                                isSwitch: false,
                                points: "20",

                            })
                        }
                    }
                    this.setState({
                        totalMonthsList: data
                    });
                    let pData = [];
                    for (let i = 0; i < responseJson.length; i++) {
                        pData.push({
                            id: i,
                            month: responseJson[i].month,
                            valid_month_points: responseJson[i].valid_month_points,
                            max_points_pm_total: responseJson[i].club_scoring.length != 0 ? responseJson[i].club_scoring[0].max_points_pm_total : 0,
                            CSI: responseJson[i].CSI,
                            vacancy_share: responseJson[i].vacancy_share,
                            wellness: responseJson[i].wellness,
                            virtual_transaction: responseJson[i].virtual_transaction,
                            market_visit: responseJson[i].market_visit,
                            values_nominated: responseJson[i].values_nominated,
                            values_nominator: responseJson[i].values_nominator,
                            flash_book: responseJson[i].flash_book,
                            isSwitch: false,
                            monthPoints: responseJson[i].month_points,
                            monthDate: responseJson[i].date
                        })
                    }
                    this.setState({
                        pointsByMonth: pData
                    });
                    var test = this.state.pointsByMonth.slice(5, this.state.pointsByMonth.length).map((item, pindex) => {
                    });
                }
            }
            this.getValueNominations();
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler

        })
    }
    getValueNominations = async () => {
        const { userData } = this.state;
        let params = `?nominated_user_id=${userData[0].id}&company_id=${userData[0].employee_company_id}`;
        this.setState({ isLoading: true })
        await ApiGetValueNominations(userData[0].token, params).then(responseJson => {
            // console.log("Value Res", JSON.stringify(responseJson));
            this.setState({ isLoading: false })
            let data = []
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    let name = "";
                    let surname = "";
                    let nomiteduser = "";
                    let preferred_name = "";
                    if (userData[0].id == responseJson[i].nominated_user_id) {
                        name = responseJson[i].nominator_user_details.name;
                        surname = responseJson[i].nominator_user_details.surname;
                        nomiteduser = "R";
                        preferred_name = responseJson[i].nominator_user_details.preferred_name;

                    }
                    else if (userData[0].id == responseJson[i].nominator_user_id) {
                        name = responseJson[i].nominated_user_details.name;
                        surname = responseJson[i].nominated_user_details.surname;
                        nomiteduser = "G";
                        preferred_name = responseJson[i].nominated_user_details.preferred_name;

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
                        nomiteduser: nomiteduser,
                        preferred_name: preferred_name
                    })
                }
                this.setState({
                    valueNominationList: data
                });
            }
            this.getRefernceLinkData();
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    renderProgressDialogLoader() {
        if (this.state.isLoading) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background}
                />
            )
        }
    }
    onSelectMonth(item) { }
    renderRowSecondMonthList() {

        let dynamicList = [];
        let isViewDisplay = false;
        for (let i = 6; i < 12; i++) {
            if (this.state.totalMonthsList[i]) {
                for (let j = 0; j < this.state.pointsByMonth.length; j++) {
                    const element = this.state.pointsByMonth[j];
                    if (this.state.totalMonthsList[i].id == element.month) {
                        isViewDisplay = true;
                        break;
                    }

                }
            }

        }

        if (isViewDisplay) {
            for (let i = 6; i < 12; i++) {
                if (this.state.totalMonthsList[i]) {
                    dynamicList.push(
                        <TouchableOpacity key={dynamicList.length}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{
                                fontSize: fontsProps.md, color: colors.COLOR_BLACK,
                                textAlign: 'center',
                                fontFamily: "CircularStd-Black",
                            }}>
                                {this.state.totalMonthsList[i].titlename}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    dynamicList.push(
                        <TouchableOpacity
                            style={{
                                flex: 1,

                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style={{
                                fontSize: fontsProps.md, color: colors.COLOR_BLACK,
                                textAlign: 'center',
                                fontFamily: "CircularStd-Black",
                            }}>
                            </Text>
                        </TouchableOpacity>
                    )
                }

            }
        }


        if (dynamicList.length > 0) {
            return <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
                paddingHorizontal: 5,
                backgroundColor: colors.COLOR_LIGHT_GRAY
            }}>
                {dynamicList.map((item, index) => (<View style={{
                    flex: 1,
                }}>{item}</View>))}
            </View>
        } else {
            return <></>
        }
    }
    renderRowMonthValues() {
        let dynamicList = [];
        for (let i = 0; i < this.state.totalMonthsList.length; i++) {
            if (i == 6) {
                break;
            }

            let isExist = false;

            for (let j = 0; j < 6; j++) {
                if (this.state.pointsByMonth[j]) {
                    if (this.state.totalMonthsList[i].id == this.state.pointsByMonth[j].month &&
                        this.state.pointsByMonth[j].valid_month_points >= 20) {
                        isExist = true;
                        dynamicList.push(
                            <TouchableOpacity key={dynamicList.length}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={
                                    this.props.onSelctMonthDetails.bind(this, this.state.pointsByMonth[j], null)
                                }>
                                <View>
                                    <SvgXml width="22"
                                        height="22"
                                        xml={Cow}
                                    />
                                </View>
                            </TouchableOpacity >
                        )
                    }
                    else if (this.state.totalMonthsList[i].id == this.state.pointsByMonth[j].month &&
                        this.state.pointsByMonth[j].valid_month_points < 20) {
                        isExist = true;
                        dynamicList.push(
                            <TouchableOpacity key={dynamicList.length}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}

                                onPress={
                                    this.props.onSelctMonthDetails.bind(this, this.state.pointsByMonth[j], null)
                                }>
                                <Text
                                    style={{
                                        fontSize: fontsProps.md,
                                        color:
                                            "#F33051",
                                        textAlign: 'center',
                                        fontFamily: "CircularStd-Black",
                                    }}>
                                    {this.state.pointsByMonth[j].valid_month_points}
                                </Text>
                            </TouchableOpacity>
                        )
                    } else {
                    }

                }
            }

            if (!isExist) {
                dynamicList.push(
                    <TouchableOpacity key={dynamicList.length}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{
                            fontSize: fontsProps.md,
                            color: colors.COLOR_BLACK,
                            textAlign: 'center',
                            fontFamily: "CircularStd-Black",
                        }}>
                        </Text>
                    </TouchableOpacity>
                )
            }
        }

        return dynamicList;

    }
    renderRowThreeMonthValues() {
        let isViewDisplay = false;
        let dynamicList = [];
        for (let i = 6; i < 12; i++) {
            if (this.state.totalMonthsList[i]) {
                for (let index = 0; index < this.state.pointsByMonth.length; index++) {
                    const element = this.state.pointsByMonth[index];
                    if (this.state.totalMonthsList[i].id == element.month) {
                        isViewDisplay = true;
                        break;
                    }
                }
            }
        }
        if (isViewDisplay) {
            for (let i = 6; i < 12; i++) {
                let isExist = false;
                if (this.state.totalMonthsList[i]) {
                    for (let j = 0; j < this.state.pointsByMonth.length; j++) {
                        if (this.state.totalMonthsList[i].id == this.state.pointsByMonth[j].month) {
                            isExist = true;
                            if (this.state.pointsByMonth[j].valid_month_points >= 20) {
                                dynamicList.push(
                                    <TouchableOpacity
                                        key={i.toString()}
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignSelf: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={
                                            this.props.onSelctMonthDetails.bind(this, this.state.pointsByMonth[j], null)
                                        }>
                                        <View pointerEvents="none">
                                            <SvgXml width="22"
                                                height="22"
                                                xml={Cow}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                );
                            } else {
                                dynamicList.push(
                                    <TouchableOpacity
                                        key={i.toString()}
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignSelf: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={
                                            this.props.onSelctMonthDetails.bind(this, this.state.pointsByMonth[j], null)
                                        }>
                                        <Text style={{

                                            fontSize: fontsProps.md,
                                            color: this.state.totalMonthsList[i].valid_month_points >= 20 ?
                                                colors.COLOR_THEME
                                                :
                                                this.state.totalMonthsList[i].valid_month_points <= 14 ?
                                                    "#F33051"
                                                    :
                                                    colors.ORANGE_COLOR,
                                            textAlign: 'center',
                                            fontFamily: "CircularStd-Black",
                                        }}>
                                            {this.state.pointsByMonth[j].valid_month_points}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        }
                    }
                } else {
                }

                if (!isExist) {
                    dynamicList.push(
                        <TouchableOpacity
                            key={i.toString()}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                color: colors.COLOR_BLACK,
                                textAlign: 'center',
                                fontFamily: "CircularStd-Black",
                            }}>
                            </Text>
                        </TouchableOpacity>
                    );
                }
            }
        }

        if (dynamicList.length > 0) {
            return <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
                paddingHorizontal: 5,
            }}>
                {dynamicList.map((item, index) => (<View style={{
                    flex: 1,
                }}>{item}</View>))}
            </View>
        } else {
            return <></>
        }

    }
    renderRowMonth() {
        let isViewDisplay = false;
        let dynamicList = []
        for (let i = 0; i < this.state.totalMonthsList.length; i++) {
            if (i == 6) {
                break;
            }
            if (!isViewDisplay) {
                dynamicList.push(
                    <TouchableOpacity key={dynamicList.length}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{
                            fontSize: fontsProps.md, color: colors.COLOR_BLACK,
                            textAlign: 'center',
                            fontFamily: "CircularStd-Black",
                        }}>
                            {this.state.totalMonthsList[i].titlename}
                        </Text>
                    </TouchableOpacity>
                )
            }
        }
        return dynamicList;
    }
    onValueBahaviorExpand(item) {
        const { valueNominationList } = this.state;
        item.isSwitch = !item.isSwitch
        this.setState({
            valueNominationList
        })
    }
    renderCategoryItem(item, index) {
        return <TouchableOpacity
            key={index}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: "flex-start",
                height: 80
            }}
            onPress={() => {
                this.props.navigateSubmitFormPage(item.tag)
            }}>

            <View style={{
                backgroundColor: item.color,
                borderRadius: 50 / 2,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {(item.category_image != null) && <Image source={{ uri: item.category_image }}
                    style={{
                        width: 25,
                        height: 25,
                        tintColor: colors.COLOR_WHITE
                    }} />}

            </View>
            <View style={{
                alignItems: 'center',
                top: 5
            }}>
                <Text style={{
                    color: colors.GREY_COLOR,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Regular" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                    fontSize: 11,
                    textAlign: 'center',
                }}>{item.category_name.replace(" ", "\n")}
                </Text>
            </View>
        </TouchableOpacity>

    }
    renderCategoryItemSplit(points) {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10
        }}>
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: "#E3E3E3",
            }}>
            </View>
            <Text style={{
                marginHorizontal: 10,
                color: colors.COLOR_BLACK,
                textAlign: 'center',
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-Bold",
                fontWeight: '700',
                fontSize: fontsProps.sm,
            }}
            >
                {points} POINTS
            </Text>
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: "#E3E3E3",
            }}>
            </View>
        </View>
    }
    renderCategorySectionlist() {
        return <View style={{
            flexDirection: 'row',
            marginVertical: 5

        }}>
            {this.state.categoryListSec1.slice(0, 4).map((item, index) => {
                return this.renderCategoryItem(item, index)
            })}
        </View>
    }
    renderRowCategoriesEarn() {
        return (
            <View style={{
                marginVertical: 10,
                marginHorizontal: 16,
                backgroundColor: 'white',
                borderRadius: 5,
            }}>
                {this.renderCategoryItemSplit(this.state.categoryListSec1.length > 0 &&
                    this.state.categoryListSec1[0].total_points)}
                {this.renderCategorySectionlist()}
                {this.renderCategoryItemSplit(this.state.categoryListSec2.length > 0
                    && this.state.categoryListSec2[0].total_points)}
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    {this.state.categoryListSec2.map((item, index) => {
                        return this.renderCategoryItem(item, index)
                    })}
                </View>
            </View>

        )
    }

    clubPointsHistoryView = () => {
        return <View>
            <Text style={styles.club_points_text}>
                Club Points History
            </Text>
            <View style={{
                flex: 1,
                marginVertical: 10,
                marginHorizontal: 16,
                backgroundColor: 'white',
                borderRadius: 5,

            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    backgroundColor:
                        "#E8F6D2",
                }}>
                    {this.renderRowMonth()}
                </View>

                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                }}>
                    {this.renderRowMonthValues()}
                </View>
                <View>
                    {this.renderRowSecondMonthList()}
                </View>
                <View key={this.state.totalMonthsList.length.toString()}>
                    {this.renderRowThreeMonthValues()}
                </View>
            </View>
        </View>
    }

    getGraceMonthValue = () => {
        const { clubMonthList } = this.state;
        let value = ConstantValues.NO_STR;
        if (clubMonthList.length > 0 &&
            clubMonthList[clubMonthList.length - 1].grace_month == 1) {
            value = ConstantValues.YES_STR;
        }
        return value;
    }

    renderValuesView = () => {
        return <View>
            <Text style={styles.values_text}>
                Values
            </Text>
            <View style={{
                marginVertical: 10,
                marginHorizontal: 16,
                backgroundColor: 'white',
                borderRadius: 5,
            }}>
                {this.state.valueNominationList.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomColor: '#e4e4e4',
                                borderBottomWidth: 1,
                            }}
                            onPress={this.onValueBahaviorExpand.bind(this, item)}
                            key={index}>
                            {(item.value_image) ? <View style={{ paddingHorizontal: 10, }}>
                                <Image source={{ uri: item.value_image }}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        paddingHorizontal: 5
                                    }}>
                                </Image>
                            </View> : <View style={{ paddingHorizontal: 10, }}>
                                <Image source={{ uri: 'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg' }}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        paddingHorizontal: 5
                                    }}>
                                </Image>
                            </View>}
                            <View>
                                <Text style={{
                                    fontSize: fontsProps.md,
                                    fontWeight: '400',
                                    color: colors.COLOR_BLACK,
                                }}>
                                    {item.value_name}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        fontSize: fontsProps.md, color: colors.GREY_COLOR,
                                    }}>{item.nomiteduser == "R" ? ConstantValues.BY_STR : "To"}</Text>
                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        color: "#0097F7",
                                        paddingHorizontal: 5,
                                    }}>{item.preferred_name + " " + item.surname}</Text>
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
                                    backgroundColor: item.nomiteduser == "R" ? "#E8F6D2" : "#F2F3F5"
                                }}>
                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        color: colors.COLOR_BLACK,
                                    }}>
                                        {item.nomiteduser}</Text>
                                </View>
                                <Image
                                    source={item.isSwitch ? Constantimages.drop_up_icon : Constantimages.arrow_down_icon}
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
                            <View style={{ padding: 10 }}>
                                <Text style={{
                                    fontSize: fontsProps.lg,
                                    fontWeight: 'bold',
                                    color: colors.GREY_COLOR,
                                }}>Behaviour
                                </Text>
                                <TextInput
                                    style={[styles.situation_textInput, {
                                        borderColor: this.state.header_background != "" ?
                                            this.state.header_background : colors.COLOR_THEME,
                                    }]}
                                    multiline={true}
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
                                    style={[styles.situation_textInput, {
                                        borderColor: this.state.header_background != "" ?
                                            this.state.header_background : colors.COLOR_THEME,
                                    }]}
                                    multiline={true}
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
                                    style={[styles.impact_textInput, {
                                        borderColor: this.state.header_background != "" ?
                                            this.state.header_background : colors.COLOR_THEME,
                                    }]}
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
        </View>
    }

    renderMyprogressView = () => {
        return <View>
            <Text style={{
                color: colors.COLOR_BLACK,
                paddingLeft: 16,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                fontWeight: '600',
                fontSize: fontsProps.sm,
                paddingTop: 10
            }}>
                My Progress
            </Text>
            <ProgressClubCard
                header_background_color={this.state.header_background}
                cardstyle={{
                    marginVertical: 10,
                    marginHorizontal: 16,
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                track={this.state.clubMonthList.length > 0 &&
                    this.state.clubMonthList[this.state.clubMonthList.length - 1].leave_on_track == "1" ?
                    ConstantValues.YES_STR : ConstantValues.NO_STR}
                months={this.state.clubMonthList.length > 0 && this.state.clubMonthList[this.state.clubMonthList.length - 1].months_completed}
                gracemonths={this.getGraceMonthValue()}
                myClubMonthInfo={this.state.myClubMonthInfo}
                myClubGraceInfo={this.state.myClubGraceInfo}
                myClubOnTrackInfo={this.state.myClubOnTrackInfo}
                onOpenToolTipMonthsInfo={() => {
                    this.setState({
                        monthsTooltip: !this.state.monthsTooltip,
                    })
                }}
                onOpenToolTipGraceMonthsInfo={() => {
                    this.setState({
                        graceTooltip: !this.state.graceTooltip,
                    })
                }}
                onOpenToolTipTrackToEarnInfo={() => {
                    this.setState({
                        trackTooltip: !this.state.trackTooltip,
                    })
                }}
                monthsTooltip={this.state.monthsTooltip}
                graceTooltip={this.state.graceTooltip}
                trackTooltip={this.state.trackTooltip}
            />
        </View>
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <ScrollView contentContainerStyle={{
                    paddingBottom: dimensionsProps.fullHeight * 0.12
                }} >
                    <ClubHeaderCard
                        header_background_color={this.state.header_background != "" ? this.state.header_background
                            : colors.COLOR_THEME}
                        cardstyle={{
                            height: 123,
                            backgroundColor: colors.COLOR_WHITE,
                            borderRadius: 12,
                            paddingHorizontal: 18,
                            paddingTop: 18,
                            marginHorizontal: 16,
                            paddingBottom: 32
                        }}
                        max_month_points={this.state.max_month_points}
                        percentage={
                            (this.state.max_month_points) * 100 / 20
                        }
                        club={this.state.userData[0].club}
                        app_club={this.state.featureData[0].app_club}
                        user_image={this.state.userData[0].user_image}
                        preferred_name={this.state.userData[0].preferred_name}
                        department_name={this.state.userData[0].department_name}
                        onOpenToolTipInfo={() => {
                            this.setState({
                                toolTipVisible: !this.state.toolTipVisible,
                                landingData: this.state.myClubUserInfo
                            })
                        }}
                        landingData={this.state.myClubUserInfo}
                        toolTipVisible={this.state.toolTipVisible}
                        onPressView={this.props.onUserProfileShow}

                    />
                    {this.renderMyprogressView()}
                    {(this.state.categoryListSec1.length > 0 || this.state.categoryListSec2.length > 0) &&
                        <View>
                            <Text style={styles.categories_text}>
                                Categories Earned
                            </Text>
                            {this.renderRowCategoriesEarn()}
                        </View>}
                    {this.state.totalMonthsList.length > 0 && this.clubPointsHistoryView()}
                    {this.state.valueNominationList.length > 0 && this.renderValuesView()}
                </ScrollView>
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    impact_textInput: {
        flexDirection: 'row',
        color: colors.COLOR_BLACK,
        width: '100%',
        textAlignVertical: 'top',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS == 'ios' ? 30 : null,
        height: Platform.OS == 'ios' ? 70 : null
    },
    situation_textInput: {
        flexDirection: 'row',
        color: colors.COLOR_BLACK,
        width: '100%',
        textAlignVertical: 'top',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS == 'ios' ? 10 : null,
    },
    behaviour_textInput: {
        flexDirection: 'row',
        color: colors.COLOR_BLACK,
        width: '100%',
        textAlignVertical: 'top',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS == 'ios' ? 10 : null,
    },
    values_text: {
        color: colors.COLOR_BLACK,
        paddingLeft: 16,
        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
            "Radomir Tinkov - Gilroy-SemiBold",
        fontWeight: '600',
        fontSize: fontsProps.sm,
    },
    club_points_text: {
        color: colors.COLOR_BLACK,
        paddingLeft: 16,
        fontFamily: Platform.OS === 'ios' ?
            "Gilroy-SemiBold" :
            "Radomir Tinkov - Gilroy-SemiBold",
        fontWeight: '600',
        fontSize: fontsProps.sm,
    },
    categories_text: {
        color: colors.COLOR_BLACK,
        paddingLeft: 16,
        fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
            "Radomir Tinkov - Gilroy-SemiBold",
        fontWeight: '600',
        fontSize: fontsProps.sm,
    }
})
