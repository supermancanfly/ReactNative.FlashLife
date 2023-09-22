import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import BottomButtonsView from "../utills/BottomButtonsView";
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg'
import { SvgXml } from "react-native-svg";
const QuestionsView = ({ onBack, onNext, quizData }) => {
    let quizQuestions = quizData?.quizQuestions.sort((a, b) => a.questionNumber - b.questionNumber)
   


    const [tempData, setTempData] = useState([
        {
            title: 'Vodacom',
            isChecked: false
        },
        {
            title: 'MTN',
            isChecked: false
        },
        {
            title: 'CellC',
            isChecked: false
        },
        {
            title: 'Telkom',
            isChecked: false
        },
        {
            title: 'Safaricom',
            isChecked: false
        },
        {
            title: 'Glo',
            isChecked: false
        },
    ])

    const renderButtonView = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 15
        }}>
            <TouchableOpacity onPress={() => {
            }}
                style={styles.button_style}>
                <Text style={{
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
            }}
                style={styles.button_style}>
                <Text style={{
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>False</Text>
            </TouchableOpacity>
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
                    <View>
                        {currentQuestions.map((item, index) => {
                            return <View key={index} >
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
                                }}>QUIZ : QUESTION {item.questionNumber}</Text>
                                <Text style={{
                                    fontSize: 25,
                                    marginVertical: 5,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                }}>Question {item.questionNumber}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    marginVertical: 5,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                }}>You will be able to sell prepaid airtime and data for the following South African networks.</Text>
                                <Text style={{
                                    fontSize: 14,
                                    marginVertical: 5,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                }}>Choose the correct answer</Text>
                                {/* <Text>{item.questionNumber}</Text> */}
                                <Text style={{
                                    fontSize: 14,
                                    flex: 1,
                                    // marginLeft: ,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.question}</Text>
                                {renderButtonView()}
                            </View>
                        })}


                        {/* {tempData.map((item, index) => {
                        return <View key={index.toString()}>
                            {index != 0 && <View style={{
                                backgroundColor: '#133C8B1F',
                                height: 1,
                                marginVertical: 5
                            }} />}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 10
                            }}>
                                <SvgXml xml={(item.isChecked) ? CheckCircleFill : CheckCircleGreen}
                                    height={20}
                                    width={20}
                                    onPress={() => {
                                        // if (item.isChecked) {
                                        //     item.isChecked = !item.isChecked;
                                        // } else {
                                        //     item.isChecked = true;
                                        // }
                                        // setTempData([...tempData])
                                    }}
                                />
                                <Text style={{
                                    fontSize: 14,
                                    flex: 1,
                                    marginLeft: 10,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.title}</Text>

                            </View>

                        </View>
                    })} */}
                    </View>

                </View>
                <BottomButtonsView onBack={handlePrevPage} onNext={handleNextPage} disabled={currentPage === 2} nextDisabled={currentPage === totalPages} />
            </ScrollView>
        </View>
    )

}

export default QuestionsView;
const styles=StyleSheet.create({
    button_style: {
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 7,
        marginHorizontal: 5,
        justifyContent: 'center'
    },
})