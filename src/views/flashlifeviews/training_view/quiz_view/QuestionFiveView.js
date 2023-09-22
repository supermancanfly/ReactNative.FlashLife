import React, { useState } from "react";
import { View, Text, ScrollView, Platform, Modal, TouchableOpacity } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import Group_green from '../../../../assets/svg/Group_green.svg';
import Group_black from '../../../../assets/svg/Group_black.svg';
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg';
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import { SvgXml } from "react-native-svg";
const QuestionFiveView = ({ onBack, onNext }) => {
    const [dropdownValue, setDropdownValue] = useState('Please select an option');
    const [isModalVisible, setVisible] = useState(false);
    const [tempData, setTempData] = useState([{ title: 'It is good manners', isChecked: false }, { title: 'Airtime/data cannot be cancelled', isChecked: false }, { title: 'The app needs to be sure', isChecked: false }]);
    const dropdownModalView = () => {
        return <Modal transparent={true}
            animationType="slide"
            visible={isModalVisible}>
            <View style={{
                backgroundColor: '#00000099',
                justifyContent: 'center',
                flex: 1
            }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 10,
                    padding: 10,
                    marginHorizontal: "7%"
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 15,
                            marginTop: 5,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>Please select an option</Text>
                        <SvgXml xml={Group_black} height={20} width={20} />
                    </View>

                    <View>{tempData.map((item, index) => {
                        return <View key={index.toString()} style={{ marginTop: 10 }}>
                            {index != 0 && <View style={{
                                backgroundColor: '#707070',
                                height: 0.7,
                                marginVertical: 5
                            }} />}
                            <TouchableOpacity onPress={() => {
                                for (let i = 0; i < tempData.length; i++) {
                                    if (index === i) {
                                        tempData[i].isChecked = true;
                                    } else {
                                        tempData[i].isChecked = false;
                                    }
                                }

                                setTempData([...tempData])
                                setDropdownValue(item.title);
                                setVisible(!isModalVisible);

                            }}>
                                <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <SvgXml xml={(item.isChecked ? CheckCircleFill : CheckCircleGreen)} height={20} width={20} />
                                    <Text style={{
                                        fontSize: 14,
                                        marginHorizontal: 10,
                                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                    }}>{item.title}</Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                    })}</View>
                </View>
            </View>

        </Modal>
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
                    }}>QUIZ: QUESTION 6</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Question 6</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Why is it necessary to double-check and even triple-check a customer’s number when selling a direct top-up?</Text>
                    <Text style={{
                        fontSize: 14,
                        marginTop: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Choose the correct answer</Text>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderColor: '#707070',
                            borderWidth: 0.5,
                            borderRadius: 10,
                            padding: 10,
                            marginVertical: 10
                        }}>
                            <Text style={{
                                fontSize: 13,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>{dropdownValue}</Text>
                            <SvgXml xml={Group_green} height="20" width="20" />
                        </View>
                    </TouchableOpacity>
                </View>
                {isModalVisible && dropdownModalView()}
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}
export default QuestionFiveView;