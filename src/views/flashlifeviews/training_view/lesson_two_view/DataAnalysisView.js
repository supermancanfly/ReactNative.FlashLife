import React from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import AirtimeDisable from '../../../../assets/svg/Airtime_disable.svg';
import DataEnable from '../../../../assets/svg/Data_enable.svg';
import SellingDisable from '../../../../assets/svg/Selling_disable.svg';
import { SvgXml } from "react-native-svg";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
const DataAnalysisView = ({ onBack, onNext }) => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <ScrollView style={{ flex: 1, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: '#676767',
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>AIRTIME AND DATA SALES</Text>
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.sm,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>LESSON 2: DATA</Text>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: 'center'
                    }}>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={AirtimeDisable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Airtime</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={DataEnable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Data</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={SellingDisable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Selling</Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Data</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        color: colors.COLOR_BLACK,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>You will be able to offer data bundles for the major cellular networks. Data is used by your customers to browse the internet or to use mobile apps like Facebook and Whatsapp.</Text>
                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={4}
                    earnedPoints={3}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )
}

export default DataAnalysisView;