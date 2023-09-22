// .js

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ScrollView,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    Platform
} from 'react-native';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, dimensionsProps, fontsProps } from '../../utils/StyleComponents';
import { apiErrorHandler, showRedeemSuccessPopup, ValidateAlertPop, ValidateAlertPopRewards } from '../../utils/CommonMethods';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ClubRewordHeader from '../../components/club/ClubRewordHeader';
import Constantimages from '../../utils/ConstantImages';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ButtonImageTitle from '../../components/shared/ButtonImageTitle';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import {
    ApiRewordRedemptionCreate,
    ApiGetClubMonthly,
    ApiUpdateClubMonthPoints
} from '../../network/Services';
export default class RedemRewordView extends React.Component {
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
            max_month_points: 0,
            quantity: "1",
            clubMonthList: [],
            pointsByMonth: this.props.pointsByMonth,
            dropDownDetails: [],
            isDropDownVisible: false,
            filteredData: [],
            searchedUserName: "",
            selectedUserObject: null,
            selectedQuantityBorderColor: colors.COLOR_THEME,
            userVoucherValue: this.props.rewordDetails.min_value
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInRedeemRewardsView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getClubMonthly("yes");
        if (this.props.rewordDetails.usersList.length) {
            var usersDataPrepare = [];
            for (let index = 0; index < this.props.rewordDetails.usersList.length; index++) {
                usersDataPrepare.push({
                    user_id: this.props.rewordDetails.usersList[index].id,
                    first_name: this.props.rewordDetails.usersList[index].name,
                    last_name: this.props.rewordDetails.usersList[index].surname,
                    preferred_name: this.props.rewordDetails.usersList[index].preferred_name,
                    search_text: ""
                });

            }
        }


        this.setState({ dropDownDetails: usersDataPrepare, filteredData: this.state.dropDownDetails });

    }

    onRedemReward = async () => {
        const {
            userData,
            quantity
        } = this.state;
        this.setState({ isLoading: true, });

        ApiRewordRedemptionCreate(
            this.state.userData[0].token,
            this.props.rewordDetails.reward_id,
            this.props.rewordDetails.company_id,
            this.state.userData[0].id,
            quantity,
            this.props.rewordDetails.reward_type_details.length > 0 ? this.props.rewordDetails.reward_type_details[0].reward_type_name : "",
            this.state.selectedUserObject != null ? this.state.selectedUserObject.user_id : "",
            this.state.userVoucherValue
        ).then(responseJson => {
            if (responseJson.status == "success") {
                showRedeemSuccessPopup(responseJson.result, this.props);
            }
            else {
                this.setState({ isLoading: false, });
                showRedeemSuccessPopup(responseJson.message, this.props);
            }
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }


    updateClubMonthPoints = async (successMessage) => {
        await ApiUpdateClubMonthPoints(this.state.userData[0].token, this.state.userData[0].id,).then(responseJson => {
            this.setState({ isLoading: false });
            showRedeemSuccessPopup(successMessage, this.props);
        }).catch((error) => {
            this.setState({ isLoading: false });
        })
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
        let params = "?user_id=" + userData[0].id + "&company_id" + userData[0].employee_company_id + "&category=" + value;

        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            if (responseJson.length > 0) {
                if (value == "yes") {
                    this.setState({
                        clubMonthList: responseJson,
                        max_month_points: responseJson[responseJson.length - 1].valid_month_points,
                    })
                }

            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }

    renderSeperator = () => (
        <View style={{ width: '100%', height: 1, backgroundColor: '#E3E3E3' }}>

        </View>
    )

    handleTextInputChange = (newText) => {
        if (this.props.rewordDetails.reward_type_details[0].reward_type_name == "Voucher-Variable") {
            if (Number(newText) > Number(this.props.rewordDetails.max_value) || Number(newText) < Number(this.props.rewordDetails.min_value)) {
                this.setState({ selectedQuantityBorderColor: colors.COLOR_RED });
            } else if (newText === "") {
                this.setState({ selectedQuantityBorderColor: colors.COLOR_RED });
            }
            else {
                this.setState({ selectedQuantityBorderColor: colors.COLOR_THEME })
            }
            this.setState({ userVoucherValue: newText })
        } else {
            this.setState({ quantity: newText })
        }


    }

    renderThirdSection = () => (
        <View style={{
            marginVertical: 12,
            marginHorizontal: 16,
        }}>

            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Text style={{
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                }}>Voucher Value</Text>
                <Text style={{
                    marginHorizontal: 5.0,
                    color: colors.COLOR_BLACK,
                    fontSize: 14,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                        "Radomir Tinkov - Gilroy-Regular",
                }}>{this.props.currency_symbol} {this.props.rewordDetails.reward_value}</Text>

            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 15,
            }}>
                <Text style={{
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                }}>Select Quantity</Text>
                <TextInput
                    style={{
                        height: 25,
                        paddingVertical: (Platform.OS === 'ios') ? 3 : 0,
                        paddingHorizontal: (Platform.OS === 'ios') ? 15 : 10,
                        borderRadius: 5,
                        borderColor:
                            this.state.header_background_color != "" ? this.state.header_background_color
                                : colors.COLOR_THEME,
                        borderWidth: 2,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",
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
        </View>
    )

    renderSecondSection = () => (
        <View style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            marginVertical: (Platform.OS === 'ios') ? 12 : 10,
            marginHorizontal: 16,
        }}>
            <Text style={{
                alignSelf: 'center',
                fontSize: 15,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
            }}>{this.props.rewordDetails.reward_name}
            </Text>
            <Text style={{
                alignSelf: 'center',
                fontSize: 13,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-Regular",
            }}>{this.props.rewordDetails.reward_description}
            </Text>
            {/* ‘voucher’ & ‘voucher-variable’  */}
            {this.props.rewordDetails.reward_type_details[0].reward_type_name === "Voucher-Variable" && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 14,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                    }}>Min : </Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",
                    }}>{this.props.rewordDetails.min_value}</Text>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                    }}>Max : </Text>
                    <Text style={{
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",
                    }}>{this.props.rewordDetails.max_value}</Text>

                </View>
            </View>}

        </View>
    )
    renderItem = () => (

        <View style={{
            borderRadius: 8,
            borderColor: '#E3E3E3',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 85,
            width: 184,
            alignSelf: 'center',
            marginVertical: 12,
            marginHorizontal: 16,
        }}>

            <Image
                source={{ uri: this.props.rewordDetails.reward_image }}
                style={{
                    width: 150,
                    height: 50,
                    resizeMode: 'contain'
                }}
            >
            </Image>

        </View>
    );

    renderRewardTypesView = () => {
        if (this.props.rewordDetails.reward_type_details[0].reward_type_name == "Give") {
            return this.renderGiveRewardView();
        } else if (this.props.rewordDetails.reward_type_details[0].reward_type_name == "Voucher-Variable") {
            return this.renderVoucherVariableView();
        } else {
            return this.renderThirdSection();
        }
    }

    renderVoucherVariableView = () => {

        return <View style={{
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            marginVertical: 12,
            marginHorizontal: 10,
            flex: 1,
        }}>
            <Text>Select Value</Text>
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",

            }}>
                <Text style={{
                    marginHorizontal: 5.0,
                    color: colors.COLOR_BLACK,
                }}>{this.props.currency_symbol}</Text>
                <TextInput
                    style={{
                        height: 25,
                        paddingVertical: (Platform.OS === 'ios') ? 3 : 0,
                        paddingHorizontal: (Platform.OS === 'ios') ? 15 : 10,
                        borderRadius: 5,
                        borderColor: this.state.selectedQuantityBorderColor,
                        borderWidth: 2,
                        textAlign: "center"
                    }}
                    underlineColorAndroid="transparent"
                    textAlignVertical='center'
                    value={this.state.userVoucherValue}
                    returnKeyType="done"
                    keyboardType='numeric'
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    onChangeText={this.handleTextInputChange}
                />
            </View>
        </View>
    }
    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <HeaderBackTitleProfile
                    title={"Show"}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                            : colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={Constantimages.flash_back_icon}
                    profilename={"Redeem"}
                    buttonPress={
                        this.props.onBackReword
                    }
                />
                <View style={{
                    // flex: 1,
                    backgroundColor: colors.COLOR_WHITE,
                    marginHorizontal: 16,
                    paddingVertical: 8,
                    marginTop: 8,
                    borderRadius: 5,
                    marginBottom: 8
                }}>
                    <ScrollView style={{}} >
                        <ClubRewordHeader
                            points={this.state.clubMonthList.length > 0 ? (this.state.clubMonthList[0].yearly_points) * this.props.randcurrencypoints : 0}
                            user_image={this.state.userData[0].user_image}
                            header_background_color={this.state.header_background_color != "" ? this.state.header_background_color
                                : colors.COLOR_THEME}
                            percentage={(this.state.max_month_points) * 100 / 20
                            }
                            club={this.state.userData[0].club}
                            app_club={this.props.featureData[0].app_club}
                            randcurrencypoints={
                                // 5
                                this.props.randcurrencypoints
                            }
                            currency_symbol={this.props.currency_symbol}
                            onPressView={this.props.onProfileView}

                        />
                        {this.renderSeperator()}
                        {this.renderItem()}
                        {this.renderSecondSection()}
                        {this.renderSeperator()}
                        {this.renderRewardTypesView()}
                        {this.props.rewordDetails.reward_type_details[0].reward_type_name == "Give" && this.renderGiveRewardUsersView()}
                        <ButtonImageTitle
                            type={"outline"}
                            title={(this.props.rewordDetails.reward_type_details[0].reward_type_name == "Give") ? "GIVE REWARD NOW" : "REDEEM NOW"}
                            imagesrc={Constantimages.doublearrrow_icon}
                            imagestyle={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: ConstantValues.COMPANY_ID_STR == "37" ?
                                    colors.COLOR_WHITE : "#B2FA00"
                            }}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                borderRadius: 5,
                                elevation: 5,
                                alignSelf: 'center',
                                height: ConstantValues.SUBMIT_BUTTON_SIZE,
                                marginHorizontal: 15,
                                borderRadius: 5,
                                marginVertical: 16
                            }}
                            titleStyle={{
                                fontSize: 15,
                                color: colors.COLOR_WHITE,
                                textAlign: 'center',
                                paddingVertical: (Platform.OS === 'ios') ? 0 : 15,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Regular" :
                                    "Radomir Tinkov - Gilroy-Regular",
                            }}
                            buttonPress={() => {
                                if (this.state.selectedUserObject == null && this.props.rewordDetails.reward_type_details[0].reward_type_name == "Give") {
                                    ValidateAlertPop("Please select employee");
                                } else if ((this.props.rewordDetails.reward_type_details[0].reward_type_name == "Voucher-Variable") && (Number(this.state.userVoucherValue) < Number(this.props.rewordDetails.min_value))) {
                                    ValidateAlertPop("Please enter minimum value");
                                } else {
                                    this.onRedemReward();
                                }

                            }}
                            imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
                        />
                    </ScrollView>
                    {this.renderProgressDialogLoader()}
                </View>
            </View>
        );
    }

    showAvailableUsersList = () => {


        return <Modal
            visible={this.state.isDropDownVisible}
            transparent={true}
            onRequestClose={() => {
            }}
            style={{

                position: 'absolute',
                zIndex: 1
            }}
        >

            <TouchableWithoutFeedback
                onPress={() => {
                    this.setState({
                        isDropDownVisible: false
                    })
                }}>
                <View
                    transparent={true}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        flex: 1,
                        paddingVertical: 50,
                    }}>
                    <View style={{
                        width: dimensionsProps.fullWidth - 45,
                        backgroundColor: colors.COLOR_WHITE,
                        borderRadius: 10,
                        alignSelf: 'center'
                    }}>
                        {this.state.dropDownDetails.length > 0 &&
                            <View>
                                <Text style={{
                                    paddingHorizontal: 5,
                                    paddingVertical: 10,
                                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                                }}>Select User</Text>
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderWidth: 1,
                                        paddingLeft: 20,
                                        borderRadius: 10,
                                        marginHorizontal: 5,
                                        marginBottom: 10,
                                        borderColor: '#B7BAC2',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onChangeText={(text) => this.searchFilterFunction(text,)}
                                    value={this.state.searchedUserName}
                                    underlineColorAndroid="transparent"
                                    placeholder="Search"
                                />
                            </View>
                        }
                        <View style={{
                            borderBottomWidth: 0.5,
                            borderColor: colors.COLOR_THEME,
                            marginRight: 5
                        }}>
                        </View>
                        <FlatList
                            data={this.state.dropDownDetails.sort((a, b) => a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase()))}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={{
                                        paddingHorizontal: 5
                                    }} key={index}
                                        onPress={() => this.setState({
                                            isDropDownVisible: false,
                                            selectedUserObject: item,
                                        })
                                        }>
                                        <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.first_name + " " + item.last_name}</Text>
                                    </TouchableOpacity>
                                );
                            }}>
                        </FlatList>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </Modal>


    }

    searchFilterFunction = (text) => {
        this.setState({ searchedUserName: text })
        let newData = this.state.filteredData;
        let newfilteredData = newData.filter(function (item) {
            return item.first_name.toUpperCase().includes(text.toUpperCase());
        });

        if (newfilteredData.length > 0) {
            this.setState({ dropDownDetails: newfilteredData });

        }
        else {
            this.setState({ dropDownDetails: this.state.filteredData });
        }
    }
    renderGiveRewardUsersView = () => {
        return <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }}>
            <Text style={{
                fontSize: fontsProps.md,
                paddingBottom: 5,
                fontWeight: 'bold',

            }}>Who are you sending to?</Text>

            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderColor: colors.GREY_COLOR,
                borderWidth: 1,
                borderRadius: 5,

            }}
                onPress={() => {
                    this.setState({ isDropDownVisible: true })
                    this.setState({ filteredData: this.state.dropDownDetails });
                }
                }>
                <TextInput
                    placeholder="Select Employee"
                    value={this.state.selectedUserObject ? this.state.selectedUserObject.first_name + " " + this.state.selectedUserObject.last_name : ""}
                    editable={false}
                    style={{
                        height: 50,
                        paddingLeft: 5,
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                    }}
                />
                <Image source={Constantimages.drop_icon} />
            </TouchableOpacity>

            {this.showAvailableUsersList()}
        </View>
    }

    renderGiveRewardView = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            marginVertical: 12,
            marginHorizontal: 10,
            flex: 1,
        }}>
            <Text style={{

            }}>Reward value to give</Text>
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",

            }}>
                <Text style={{
                    marginHorizontal: 5.0,
                    color: colors.COLOR_BLACK,
                }}>{this.props.currency_symbol}</Text>
                <TextInput
                    style={{
                        width: 70,
                        height: 30,
                        paddingVertical: 5,
                        borderRadius: 5,
                        // marginLeft: 20,
                        // marginTop: 15,
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
        </View>
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