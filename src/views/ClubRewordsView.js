import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,

} from 'react-native';
import { ConstantValues } from '../utils/ConstantValues';
import MaterialButton from "../components/shared/MaterialButton";
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import Constantimages from '../utils/ConstantImages';
// import { colors, fontsProps, } from '../utils/StyleComponents';
import OutlineTextImageButton from "../components/shared/OutlineTextImageButton";
import ApplicationDataManager from '../utils/ApplicationDataManager';
import VocherDetailsView from './VocherDetailsView';
import {
    ApiGetRewords,
    ApiGetClubMonthly
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class ClubRewordsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            userData: this.props.userData,
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isVocherDetailsView: false,
            rewordList: [],
            vocherList: [
                {
                    id: 1,
                    vochername: "Poetry Gift Vocher1",
                    image: Constantimages.learning_icon
                },
                {
                    id: 2,
                    vochername: "Poetry Gift Vocher2",
                    image: Constantimages.learning_icon
                },
                {
                    id: 3,
                    vochername: "Poetry Gift Vocher3",
                    image: Constantimages.learning_icon
                },
                {
                    id: 4,
                    vochername: "Poetry Gift Vocher4",
                    image: Constantimages.learning_icon
                },
                {
                    id: 5,
                    vochername: "Poetry Gift Vocher3",
                    image: Constantimages.learning_icon
                },
                {
                    id: 6,
                    vochername: "Poetry Gift Vocher4",
                    image: Constantimages.learning_icon
                },
            ],
            clubMonthList: this.props.clubMonthList,
            pointsByMonth: this.props.pointsByMonth
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInClubRewordsView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getClubMonthly("yes")
        this.getRewords()
    }
    componentWillUnmount() {
    }
    renderRowVocherDetails() {
        return <VocherDetailsView
            userData={this.props.userData}
            //   formDetails={this.state.formDetails}
            //   onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
            callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInClubRewordsView}
        />
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
    getClubMonthly = async (value) => {
        const { userData } = this.state;
        let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
        // let params = "?user_id=" + userData[0].id+"&company_id"+userData[0].employee_company_id+"&category="+value;
        //    this.setState({isLoading:true})
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            // this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                // this.setWhiteLables(responseJson)
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson
                    })
                }
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.navigateToMore)
        })
    }
    getRewords = async () => {
        const { userData } = this.state;
        // company_id=54, location_id=1, division_id=65, department_id=22
        let params = "?company_id=" + this.state.userData[0].employee_company_id;
        this.setState({ isLoading: true })
        // let params = "?company_id=" + this.state.userData[0].employee_company_id+"&location_id="+this.state.userData[0].employed_location_id+"&division_id="+this.state.userData[0].division_id+"&department_id="+this.state.userData[0].department_id;
        //    let params="?company_id="+54+"&location_id="+1+"&division_id="+65+"&department_id="+22
        ApiGetRewords(this.state.userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                this.setState({ rewordList: responseJson })
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onPressWantOne = () => {
        // renderRowVocherDetails
        // this.setState({
        //     isVocherDetailsView: !this.state.isVocherDetailsView
        // })
    }
    render() {
        return (
            <View style={{
                flex: 1,
                // marginTop: Platform.OS === 'ios' ? 40 : 0,
                marginBottom: 70,
            }}>
                {/* <ScrollView
                    contentContainerStyle={{
                    }}> */}
                <MaterialButton
                    //  {this.state.clubMonthList.length>0 && this.state.clubMonthList[0].yearly_points}
                    // title={ConstantValues.POINTS_AVAILABLE_STR + ": "+this.state.clubMonthList.length>0 && this.state.clubMonthList[0].yearly_points+" Points "}
                    // title={ConstantValues.POINTS_AVAILABLE_STR + ": "+this.state.clubMonthList.length>0?this.state.clubMonthList[0].yearly_points:""+" Points "}
                    title={this.state.clubMonthList.length > 0 ? ConstantValues.POINTS_AVAILABLE_STR + ": " + this.state.clubMonthList[this.state.clubMonthList.length - 1].yearly_points + " Points" : ConstantValues.POINTS_AVAILABLE_STR + ": 0" + " Points"}
                    style={{
                        flexDirection: 'row',
                        backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 15,
                        marginHorizontal: paddingProps.md,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        elevation: 10,
                        borderRadius: 30
                    }}
                    titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}
                    buttonPress={() => { this.onPressWantOne() }}
                />
                <FlatList
                    data={this.state.rewordList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.item}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderWidth: 2,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    borderColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                    marginBottom: 5,
                                }}>
                                    {item.reward_image != "" && item.reward_image != null ?
                                        <Image source={{ uri: item.reward_image }}
                                            style={{
                                                width: 90 / 2,
                                                height: 90 / 2,
                                                alignSelf: 'center',
                                                paddingVertical: 5,
                                            }}
                                        >
                                        </Image>
                                        :
                                        <Image source={Constantimages.vocher_placeholder_icon}
                                            style={{
                                                width: 90 / 2,
                                                height: 90 / 2,
                                                alignSelf: 'center',
                                                paddingVertical: 5,
                                                tintColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                            }}
                                        >
                                        </Image>
                                    }
                                </View>
                                <Text style={{
                                    fontSize: 15, textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: colors.GREY_COLOR
                                }}>{item.reward_name}</Text>
                                {/* <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}> */}
                                <Text style={{
                                    fontSize: 15,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                }}>{item.reward_points} Points</Text>
                                <OutlineTextImageButton
                                    title={ConstantValues.IWANT_ONE_STR}
                                    style={{
                                        flexDirection: 'row',
                                        borderRadius: 5,
                                        alignItems: 'center',
                                        // justifyContent: 'space-around',
                                        justifyContent: 'center',
                                        marginVertical: 5,
                                        paddingVertical: 5,
                                        marginHorizontal: 5,
                                        alignSelf: 'center',
                                        borderWidth: 1,
                                        borderColor: this.state.header_background_color != "" ?
                                            this.state.header_background_color : colors.COLOR_THEME,
                                        width: 130,
                                        height: 30,
                                        borderRadius: 15
                                    }}
                                    titleStyle={{
                                        paddingHorizontal: 5,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: this.state.header_background_color != "" ? this.state.header_background_color
                                            : colors.COLOR_THEME
                                    }}
                                    buttonPressTypeOne={this.props.onVochersDetails.bind(this, item)}
                                    buttonPressTypeTwo={{}}
                                    buttonimage={Constantimages.arrow_right_icon}
                                    imageStyle={{
                                        width: 25,
                                        height: 25,
                                        paddingLeft: 5,
                                        tintColor: this.state.header_background_color != "" ? this.state.header_background_color
                                            : colors.COLOR_THEME
                                    }}
                                    imagetintcolor={this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME
                                    }
                                />
                            </View>
                        );
                    }}
                    numColumns={2}>
                </FlatList>
                {/* </ScrollView> */}
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