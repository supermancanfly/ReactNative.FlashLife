import React, { useState } from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
import BottomButtonsView from "../utills/BottomButtonsView";
import Group_black from '../../../../assets/svg/Group_black.svg';
import Group_green from '../../../../assets/svg/Group_green.svg';
import Group_info from '../../../../assets/svg/Group_info.svg';
import { SvgXml } from "react-native-svg";
const AccordionContentType = ({ onNext, onBack }) => {
    const [tempData, setTempData] = useState([
        {
            title: 'General',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: true
        },
        {
            title: 'EeziAirtime',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: false
        },
        {
            title: 'Global airtime',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: false
        },
        {
            title: 'Topic',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: false
        },
        {
            title: 'Topic',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: false
        },
        {
            title: 'Topic',
            description: `Prepaid airtime and data are the best-selling products in South Africa and generate profit for you. Prepaid mobile airtime in South Africa's Africa'c most in-demand product and is guaranteed to bring customers to you. The process to sell airtime in quick and easy, thus saving you time.`,
            isExpanded: false
        }
    ]);

    const renderListView = (item, index) => {
        return <View style={styles.container_border}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}><Text style={{
                fontSize: (item.isExpanded) ? 17 : 14,
                marginVertical: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
            }}>{item.title}</Text>
                <SvgXml xml={(item.isExpanded) ? Group_black : Group_green} height="20" width="20" onPress={() => {
                    if (item.isExpanded) {
                        item.isExpanded = !item.isExpanded;
                    } else {
                        item.isExpanded = true;
                    }
                    setTempData([...tempData]);
                }} />

            </View>
            {item.isExpanded && <Text style={{
                fontSize: 14,
                marginVertical: 5,
                color: colors.COLOR_BLACK,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{item.description}</Text>}
        </View>
    }
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
                    }}>LESSON 2: AIRTIME</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Airtime</Text>


                    <View>{tempData.map((item, index) => renderListView(item, index))}</View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                        backgroundColor: '#CDDEFD',
                        borderRadius: 10,
                        padding: 10
                    }}>
                        <SvgXml xml={Group_info} height="20" width="20" />
                        <Text style={{
                            fontSize: 13,
                            marginVertical: 5,
                            marginHorizontal: 10,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>This would be a tip</Text>
                    </View>
                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={4}
                    earnedPoints={1}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}

export default AccordionContentType;

const styles = StyleSheet.create({
    container_border:
    {
        borderColor: "#00000014",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: colors.COLOR_WHITE,
        marginVertical: 5
    }
})