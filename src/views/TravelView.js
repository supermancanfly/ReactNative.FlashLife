import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Platform,
    FlatList,
    Image,
    TouchableOpacity
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
export default class TravelView extends React.Component {
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
            // clubMonthList:[],
            clubMonthList: [],
            pointsByMonth: []
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInTravelView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        // this.getClubMonthly("yes")
        // this.getClubMonthly("")
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
            callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInTravelView}
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
    getClubMonthly = async (value) => {
        const { userData } = this.state;
        //   let params = "?user_id=" + userData[0].id;
        // let params = "?user_id=" + userData[0].id+"&company_id"+userData[0].employee_company_id+"&category=yes";
        let params = "?user_id=" + userData[0].id + "&company_id" + userData[0].employee_company_id + "&category=" + value;
        // https://instaccess.co.za/instaccess_backend/index.php/api/clubMonthly?company_id=&user_id=&category=yes
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            if (responseJson.length > 0) {
                // this.setWhiteLables(responseJson)
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson
                    })
                }
                else {
                    this.setState({
                        pointsByMonth: responseJson
                    })
                }
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

            }}>

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
        flex: 1,
        padding: 5,
        borderRadius: 5,
        margin: 5,
        elevation: 5
    },
})