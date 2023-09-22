import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Platform,
    FlatList,
    Image,
    TouchableOpacity,
    SectionList
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, dimensionsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ClubRewordHeader from '../../components/club/ClubRewordHeader';
import Constantimages from '../../utils/ConstantImages';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import VocherDetailsView from '../../views/VocherDetailsView';
import RedemRewordView from '../../views/flashlifeviews/RedemRewordView';
import {
    ApiGetRewords,
    ApiGetClubMonthly,
    ApiGetCurrencyRandValue
} from '../../network/Services';
import { apiErrorHandler } from '../../utils/CommonMethods';
import FastImage from 'react-native-fast-image';

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}

export default class FlashClubRewordsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stickyHeaderIndices: [],
            isLoading: false,
            userData: this.props.userData,
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isVocherDetailsView: false,
            isRedemDetailsView: false,
            rewordList: [],
            rewordDetails: [],
            max_month_points: 0,
            randcurrencypoints: 0,
            currency_symbol: "",
            sectionList: [
                {
                    title: 'Featured',
                    data: [[
                        {
                            id: '0', title: 'overall',
                            image: Constantimages.icon1
                        },
                        {
                            id: '1', title: 'Management Information Department',
                            image: Constantimages.icon2
                        },
                        {
                            id: '2', title: 'High Performance Department',
                            image: Constantimages.icon3
                        },
                        {
                            id: '3', title: 'Tech Cloud',
                            image: Constantimages.icon4
                        },
                    ]]
                },
                {
                    title: 'Entertainment', data: [[
                        {
                            id: '0', title: 'machine distribution',
                            image: Constantimages.icon5
                        },
                        {
                            id: '1', title: 'User distribution',
                            image: Constantimages.icon6
                        },
                        {
                            id: '2', title: 'Storage distribution',
                            image: Constantimages.icon7
                        },
                        {
                            id: '3', title: 'Bone Flow Chart',
                            image: Constantimages.icon8
                        },
                    ]]
                },
            ],
            featuredList: [
                {
                    header: true,
                    id: '0',
                    title: 'Featured',
                    image: Constantimages.flash_header_logo
                },
                { header: false, id: '1', title: 'Management Information Department', image: Constantimages.flash_header_logo },
                { header: false, id: '2', title: 'High Performance Department', image: Constantimages.flash_header_logo },
                { header: false, id: '3', title: 'Tech Cloud', image: Constantimages.flash_header_logo },
                { header: false, id: '4', title: 'Big Data Department', image: Constantimages.flash_header_logo },
                { header: false, id: '5', title: 'New Media Department', image: Constantimages.flash_header_logo },
                { header: false, id: '6', title: 'Internet of Things Center', image: Constantimages.flash_header_logo },
                { header: false, id: '7', title: 'Scientific Research and Information Department', image: Constantimages.flash_header_logo },
                { header: false, id: '8', title: 'Amazon Cloud', image: Constantimages.flash_header_logo },
                { header: false, id: '9', title: 'Ministry Secondary School', image: Constantimages.flash_header_logo },
                { header: false, id: '10', title: 'Manage Cloud', image: Constantimages.flash_header_logo },
                { header: false, id: '11', title: 'Ningbo Materials Institute', image: Constantimages.flash_header_logo },
                {
                    header: true,
                    id: '12',
                    title: 'Entertainment',
                    image: Constantimages.flash_header_logo
                },
                {
                    header: false, id: '13',
                    title: 'User distribution', image: Constantimages.flash_header_logo
                },
                {
                    header: false, id: '14',
                    title: 'Storage distribution',
                    image: Constantimages.flash_header_logo
                },
                { header: false, id: '15', title: 'Bone Flow Chart', image: Constantimages.flash_header_logo },
                { header: false, id: '16', title: 'Computer room distribution', image: Constantimages.flash_header_logo },
                { header: false, id: '17', title: 'Internet of Things Identity Node', image: Constantimages.flash_header_logo },
                {
                    header: false, id: '18', title: 'Monitoring equipment',
                    image: Constantimages.flash_header_logo
                },
            ],
            clubMonthList: [],//this.props.clubMonthList,
            pointsByMonth: this.props.pointsByMonth
        }
        this.onBackSubView = this.onBackSubView.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashClubRewordsView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getCurrencyRandPints();
        this.getClubMonthly("yes")
        this.getRewords()
    }
    componentWillUnmount() {
    }
    renderRowVocherDetails() {
        console.log("VocherDetailsView");
        return <VocherDetailsView
            userData={this.props.userData}
            //   formDetails={this.state.formDetails}
            //   onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
            callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInFlashClubRewordsView}
        />
    }

    renderRowRedemDetails() {
        // console.log("REEDEM POINTS", JSON.stringify(this.state.rewordDetails));
        console.log("RedemRewordView");
        return <RedemRewordView
            userData={this.props.userData}
            navigation={this.props.navigation}
            clubMonthList={this.props.clubMonthList}
            featureData={this.props.featureData}
            randcurrencypoints={this.state.randcurrencypoints}
            currency_symbol={this.state.currency_symbol}
            rewordDetails={this.state.rewordDetails}
            onBackReword={this.onBackSubView}
            onProfileView={this.props.onProfileView}
            callBackForMoreTabInRedeemRewardsView={this.props.callBackForMoreTabInFlashClubRewordsView}


        />
    }


    async onBackSubView() {
        //    console.log("onBackSubView----------------")
        await this.setState({
            isRedemDetailsView: !this.state.isRedemDetailsView,
        })
        this.getClubMonthly("yes");
        this.onCloseRword()
    }
    onCloseRword = () => {
        // console.log("onCloseRword")
        this.props.onBackReword()
    }
    componentWillMount() {
        var arr = [];
        this.state.featuredList.map(obj => {
            if (obj.header) {
                arr.push(this.state.featuredList.indexOf(obj));
            }
        });
        arr.push(0);
        this.setState({
            stickyHeaderIndices: arr
        });
        // console.log("----------------------------stickyHeaderIndices" + JSON.stringify(arr))
        // console.log("----------------------------stickyHeaderIndices" + JSON.stringify(this.state.stickyHeaderIndices))
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
    getClubMonthly = async (value) => {
        const { userData } = this.state;
        // let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
        let params = "?user_id=" + userData[0].id + "&company_id" + userData[0].employee_company_id + "&category=" + value;
        //    this.setState({isLoading:true})
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            // this.setState({ isLoading: false })
            // console.log("clubMonthList--------------------" + JSON.stringify(responseJson));
            if (responseJson.length > 0) {

                // this.setWhiteLables(responseJson)
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson,
                        max_month_points: responseJson[responseJson.length - 1].valid_month_points,
                    })

                }

            }
            // console.log("CLUBMONTHLIST" + this.state.clubMonthList[this.state.clubMonthList.length - 1].yearly_points);
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }

    getCurrencyRandPints = async () => {
        const { userData } = this.state;
        let params = "?company_id=" + this.state.userData[0].employee_company_id;
        this.setState({ isLoading: true })
        await ApiGetCurrencyRandValue(this.state.userData[0].token, params).then(responseJson => {
            // console.log("CURRENCYRAND VALUE:", JSON.stringify(responseJson));
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                this.setState({
                    randcurrencypoints: responseJson[0].points_value * responseJson[0].currency_value,
                    currency_symbol: responseJson[0].currency_symbol
                });
            }

            // console.log("CURRENCY POINTS :", randcurrencypoints);
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })

    }
    getRewords = async () => {
        const { userData } = this.state;
        let params = "?company_id=" + this.state.userData[0].employee_company_id + "&&active=1";
        this.setState({ isLoading: true })
        ApiGetRewords(this.state.userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                let result = groupByKey(responseJson, "section");
                const objectArray = Object.entries(result);
                let sectionnewList = []
                let sectionObjectList = {}
                objectArray.forEach(([key, value]) => {
                    let newvalue = [];
                    newvalue = value;

                    if ((value.length % 2) != 0) {
                        newvalue.push({

                        })
                    }
                    // sectionnewList.push({
                    //     section: key,
                    //     data: [newvalue]
                    // })
                    sectionObjectList[key] = [newvalue]
                });
                let sortedSectionList = this.rewardsSort(sectionObjectList)

                this.setState({ rewordList: sortedSectionList })

            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onPressWantOne = () => {
    }
    rewardsSort = (unSortedList) => {
        let returnArray = []
        const titleArray = ["Digital Cash", "Entertainment", "Lifestyle", "Gaming", "Shopping", "Charity / Donations"]
        returnArray = titleArray.map(titleKey => {
            return {
                section: titleKey,
                data: unSortedList[titleKey] ?? []
            }
        })
        console.log("Sorted List", returnArray)
        return returnArray
    }
    onPressRewordVocher = async (item) => {
        // console.log("onPressRewordVocher--------------------------------------------------------")

        await this.setState({
            isRedemDetailsView: !this.state.isRedemDetailsView,
            rewordDetails: item
        })
        this.onMainClubView()

    }
    onMainClubView = () => {
        // console.log("------------------------------onMainClubView-----------------------")
        this.props.onRedemDetails("rewordsredeme");
    }
    renderFeaturedsectionlist() {
        return <View style={{ flex: 1 }}>
            <SectionList
                style={{
                    flex: 1,
                    marginTop: 25
                }}
                contentContainerStyle={{
                    paddingBottom: 40
                }}
                keyExtractor={(item, index) => item + index}
                sections={this.state.rewordList}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section }) => {
                    return (
                        <Text style={{
                            paddingVertical: 5,
                            marginHorizontal: 16,
                            fontSize: 13,
                            color: colors.COLOR_BLACK,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-SemiBold" :
                                "Radomir Tinkov - Gilroy-SemiBold"
                        }}>{

                                section.section

                            }</Text>
                    )
                }}
                renderItem={this._renderSectionListItem}
            />
        </View>
    }
    _renderSectionListItem = ({ item }) => (
        <FlatList
            data={item}
            renderItem={this._renderItem}
            keyExtractor={item => item.reward_id}
            columnWrapperStyle={{
                flex: 1,
            }}
            numColumns={2}
        />
    );
    _renderItem = ({ item }) => (
        Object.entries(item).length === 0 ?
            <View style={{
                flex: 1,
                borderRadius: 8,
                marginVertical: 8,
                marginHorizontal: 16,
                justifyContent: 'center',
                alignItems: 'center',
                height: (Platform.OS === 'android') ? 100 : 74
            }}>

            </View>
            :
            <TouchableOpacity style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: colors.COLOR_WHITE,
                marginVertical: 8,
                marginHorizontal: 16,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10
            }}
                onPress={this.onPressRewordVocher.bind(this, item)}
            >
                {/* <FastImage
                    style={{ width: '50%', height: 60 }}
                    source={{
                        uri: item.reward_image,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                /> */}
                <Image
                    source={{ uri: item.reward_image }}
                    style={{ width: '50%', height: 50 }}
                    resizeMode={'center'} />
                {(item.reward_type_details[0].reward_type_name === ConstantValues.VOUCHER_VARIABLE_REWARD_TYPE ||
                    item.reward_type_details[0].reward_type_name === ConstantValues.VOUCHER_REWARD_TYPE) &&
                    <View style={{

                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: colors.COLOR_BLACK,
                            fontSize: 10,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-SemiBold" :
                                "Radomir Tinkov - Gilroy-SemiBold"
                        }}>{item.reward_name}</Text>
                        {/* <Text style={{
                            color: colors.COLOR_BLACK,
                            fontSize: 10,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-SemiBold" :
                                "Radomir Tinkov - Gilroy-SemiBold"
                        }}>{item.reward_description}</Text> */}
                    </View>}
            </TouchableOpacity>



    );
    _renderSection = ({ item }) => {
        if (item.header) {
            return <Text style={{}}>{item.title}</Text>
        }
        else {
            return <TouchableOpacity style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: colors.COLOR_WHITE, margin: 8
            }}>
                <Image
                    source={item.image}
                    style={{
                        width: 105,
                        height: 30,
                    }}
                >
                </Image>
                <Text>{item.title}</Text>
            </TouchableOpacity>
        }
    };
    renderFeatureItem = ({ item }) => (
        <Text style={{ fontWeight: "bold" }}>
            {item.header}
        </Text>
    );
    renderEmptyContainer() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={Constantimages.flash_empty_rewards_icon}
                style={{
                    width: 133,
                    height: 176,
                }}
            >
            </Image>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>
                Your Reward List is Empty
            </Text>
            <Text style={{ color: colors.GREY_COLOR, textAlign: 'center' }}>
                Check back later for updates {"\n"} on available Rewards
            </Text>
        </View>
    }
    render() {
        return (
            <View style={{
                flex: 1,
            }}>{!this.state.isRedemDetailsView && <ScrollView contentContainerStyle={{
                paddingBottom: dimensionsProps.fullHeight * 0.12
            }}>
                <ClubRewordHeader
                    // points={this.state.clubMonthList.length > 0 ? (this.state.clubMonthList[this.state.clubMonthList.length - 1].yearly_points) : "0"} 
                    points={this.state.clubMonthList.length > 0 ? (this.state.clubMonthList[0].yearly_points) * this.state.randcurrencypoints : "0"}
                    user_image={this.state.userData[0].user_image}
                    header_background_color={this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME}
                    percentage={(this.state.max_month_points) * 100 / 20
                    }
                    club={this.state.userData[0].club}
                    app_club={this.props.featureData[0].app_club}
                    randcurrencypoints={this.state.randcurrencypoints}
                    currency_symbol={this.state.currency_symbol}
                    onPressView={this.props.onProfileView}
                />
                {this.renderFeaturedsectionlist()}
            </ScrollView>}
                {this.state.isRedemDetailsView && this.renderRowRedemDetails()}
                {this.renderProgressDialogLoader()}
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
    item: {
        backgroundColor: '#FFFFFF',
        flex: 1 / 2,
        padding: 5,
        borderRadius: 5,
        margin: 5,
        elevation: 5
    },
})