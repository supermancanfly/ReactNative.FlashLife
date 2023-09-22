import Moment from 'moment';
import React from "react";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ProgressDialog from "../../components/dialogs/ProgressDialog";
import { ApiGetFormsList, ApiRedeemRewardsList } from "../../network/Services";
import ApplicationDataManager from "../../utils/ApplicationDataManager";
import { apiErrorHandler } from "../../utils/CommonMethods";
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from "../../utils/ConstantValues";
import { colors } from "../../utils/StyleComponents";

export default class RedeemedRewardsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadProgressDialog: false,
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            userData: this.props.userData,
            redeemRewardsList: [
            ]
        };

    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInRedeemRewardsPage(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        this.getRedeemedRewardsData();
    }

    renderProgressDialogLoader() {
        if (this.state.isLoadProgressDialog) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background_color}
                />
            );
        }
    }

    getRedeemedRewardsData = async () => {
        const { userData } = this.state;
        this.setState({
            isLoadProgressDialog: true
        });

        await ApiRedeemRewardsList(userData[0].token, userData[0].id, userData[0].employee_company_id).then(response => {
            this.setState({ isLoadProgressDialog: false });
            var resData = [];
            if (response.length > 0) {
                // console.log("REQ RES 1:", JSON.stringify(response));

                for (let index = 0; index < response.length; index++) {
                    resData.push({
                        userId: response[index].user_id,
                        companyId: response[index].company_id,
                        redeemedDate: Moment(response[index].date).format('MMM-DD'),
                        redeemedPoints: response[index].points_redeemed,
                        rewardId: response[index].reward_id,
                        rewardVoucherCode: response[index].reward_voucher_code == "" ? this.getRewardVoucherCode(response[index]) : response[index].reward_voucher_code,
                        vendorName: response[index].reward_details.reward_name
                    });

                }
                // console.log("FINAL RES OBJECT : ", JSON.stringify(resData));
                this.setState({
                    redeemRewardsList: resData
                });


            }
        }).catch(error => {
            // console.log("ERROR : ", JSON.stringify(error));
            this.setState({ isLoadProgressDialog: false });
            //Hello, I fixed api error handler
        })

    }

    getRewardVoucherCode(indexData) {
        // console.log("INDEX DATA : ", JSON.stringify(indexData));
        if (indexData.reward_details.reward_type_details.length) {
            return indexData.reward_details.reward_type_details[0].reward_type_name;
        } else {
            return "";
        }


    }


    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                marginBottom: 80,
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    marginHorizontal: 15.0,
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 5


                }}>
                    {this.showInfoCardView()}
                </View>
            </SafeAreaView>

        );
    }
    showInfoCardView() {
        if (this.state.isLoadProgressDialog) {
            return this.renderProgressDialogLoader();
        } else {
            if (this.state.redeemRewardsList && this.state.redeemRewardsList.length) {
                return <View style={{
                    flexDirection: "column",
                    marginBottom: 60.0,
                    padding: 10.0
                }}>
                    <View style={{
                        flexDirection: "row",
                        padding: 5.0
                    }}>

                        <Text style={{
                            fontWeight: "700", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                "Radomir Tinkov - Gilroy-Medium",

                        }}>{ConstantValues.DATE}</Text>
                        <Text style={{
                            flex: 1,
                            fontWeight: "700", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                "Radomir Tinkov - Gilroy-Medium", marginLeft: '12%'

                        }}>{ConstantValues.VENDOR}</Text>
                        <Text style={{
                            flex: 1,
                            fontWeight: "700", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                "Radomir Tinkov - Gilroy-Medium", marginLeft: '6%'


                        }}>{ConstantValues.VALUE}</Text>
                        <Text style={{
                            flex: 2,
                            fontWeight: "700", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                "Radomir Tinkov - Gilroy-Medium",


                        }}>{ConstantValues.CODE}</Text>

                    </View>
                    <View style={{
                        backgroundColor: colors.COLOR_BLACK,
                        height: 1.0,

                    }}>
                    </View>

                    <View>
                        <FlatList

                            data={this.state.redeemRewardsList}
                            renderItem={this.renderItems} keyExtractor={(item) => item.id}>


                        </FlatList>
                    </View>
                </View>

            } else {

                return <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Image
                        source={Constantimages.redeem_rewards_icon} />
                    <View style={{
                        height: 5,
                        width: 0
                    }} />
                    <Text style={{
                        fontSize: 15.0, fontWeight: "bold", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                            "Radomir Tinkov - Gilroy-Medium",
                    }}>No rewards redeemed yet</Text>
                    <View style={{
                        height: 10,
                        width: 0
                    }} />
                    <Text style={{
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                            "Radomir Tinkov - Gilroy-Medium",
                    }}>{'Please check back after redeeming\n                your next voucher.'}</Text>
                </View>
            }
        }
    }

    renderItems = ({ item, index }) => {
        // console.log("ITEMS :", item);
        return <View>
            <View style={{
                flexDirection: "row",
                padding: 5
            }}>
                <Text style={{
                    fontSize: 12.0, fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium", fontWeight: "300",
                }}>{item.redeemedDate}</Text>
                <Text style={{
                    flex: 1,
                    fontSize: 12.0, fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium", fontWeight: "300", marginLeft: '9%'

                }}>{item.vendorName}</Text>
                <Text style={{
                    flex: 1,
                    fontSize: 12.0, fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium", fontWeight: "300", marginLeft: '6%'
                }}>{item.redeemedPoints}</Text>
                <Text style={{
                    flex: 2,
                    fontSize: 12.0, fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium", fontWeight: "300",

                }}>{item.rewardVoucherCode}</Text>
            </View>
            <View style={{
                backgroundColor: colors.COLOR_GREY_300,
                height: 1.0,
            }}></View>
        </View>
    }
};


const redeemRewardsStyle = StyleSheet.create({

    header_text_style: {
        flex: 1, fontWeight: "700", fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
            "Radomir Tinkov - Gilroy-Medium",
    },
    values_text_style: {
        flex: 1, fontSize: 12.0, fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
            "Radomir Tinkov - Gilroy-Medium", fontWeight: "300",
    }
});