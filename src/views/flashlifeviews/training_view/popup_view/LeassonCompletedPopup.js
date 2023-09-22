import React from "react";
import { View, TouchableOpacity, Text, Modal, Platform } from 'react-native';
import { SvgXml } from "react-native-svg";
import { colors } from "../../../../utils/StyleComponents";
import GoodJob from '../../../../assets/svg/GoodJob.svg';
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import { ConstantValues } from "../../../../utils/ConstantValues";
import Constantimages from "../../../../utils/ConstantImages";
import InCorrect from '../../../../assets/svg/InCorrect.svg';
const LeassonCompletedPopup = ({ isVisible, onPress, isCorrectValue,textMessage }) => {
    console.log(isCorrectValue, "IS Correct")
    return (
        <Modal transparent={true}
            visible={isVisible}
            animationType={'slide'}>
            <View style={{
                flex: 1,
                backgroundColor: '#00000099',
                justifyContent: 'center',
            }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 10,
                    padding: 20,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View pointerEvents="none">
                        {(!isCorrectValue) ? <SvgXml width="70"
                            height="70"
                            fill={"#ffffff"}
                            xml={InCorrect} /> : <SvgXml width="70"
                                height="70"
                                fill={"#000000"}
                                xml={GoodJob} />}

                    </View>
                    <Text style={{
                        fontSize: 30,
                        color: (!isCorrectValue) ? '#DC143C' : colors.COLOR_THEME,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{(!isCorrectValue) ? 'Incorrect!' : 'Good Job!!!'}</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 10,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{textMessage}</Text>
                    <ButtonImageTitle
                        type={"check"}
                        title={!isCorrectValue ?  "Retry Lesson Check In": 'Continue' }
                        imagesrc={Constantimages.forword_double_arrow}
                        imagestyle={{
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                            tintColor: (ConstantValues.COMPANY_ID_STR == "37") ? colors.COLOR_WHITE : "#B2FA00"
                        }}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_BLACK,
                            borderRadius: 10,
                            elevation: 5,
                            height: ConstantValues.SUBMIT_BUTTON_SIZE,
                            marginTop: 10
                        }}
                        titleStyle={{
                            fontSize: 14,
                            color: colors.COLOR_WHITE,
                            textAlign: 'center',
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}
                        buttonPress={onPress}
                    />
                </View>
            </View>
        </Modal>
    )

}

export default LeassonCompletedPopup;