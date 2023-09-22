import React, { useState } from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { SvgXml } from "react-native-svg";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import InfoBlue from '../../../../assets/svg/Info_blue.svg';
import CheckCircleBlue from '../../../../assets/svg/check_circle_blue.svg';
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
const CancellationORRefundTwo = ({ onBack, onNext }) => {
    const [tempData, setTempData] = useState([{ title: 'Airtime and data vouchers cannot be cancelled or refunded. Be sure to enter the correct MSIDN (cellphone number) when sending airtime or data to a customer.' }, { title: 'Global airtime also cannot be cancelled or refunded. Once airtime has been sent, it cannot be refunded. Be sure to double or triple-check the number.' }])
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <ScrollView style={{ flex: 1, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>

                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={2}
                    earnedPoints={2}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )
}
export default CancellationORRefundTwo;