import React, { useState } from "react";
import { View, Text, ScrollView, Platform, TextInput } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";

const QuestionFourView = ({ onBack, onNext }) => {
    const [inputValue, setInputValue] = useState('');
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
                    }}>QUIZ: QUESTION 5</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Question 5</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Why is it more beneficial to sell eeziAirtime than normal airtime?</Text>
                    <Text style={{
                        fontSize: 14,
                        marginTop: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Type your answer below</Text>
                    <Text style={{
                        color: "#DC143C",
                        textAlign: 'right',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Medium",
                    }}>{`(required)`}</Text>
                    <TextInput
                        placeholder="This was a good survey."
                        placeholderTextColor={"#B8B8B8"}
                        value={inputValue}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                        blurOnSubmit={true}
                        returnKeyType="done"
                        onChange={setInputValue}
                        style={{
                            borderColor: '#707070',
                            borderWidth: 0.5,
                            borderRadius: 10,
                            padding: 10,
                            flexWrap: 'wrap',
                            marginVertical: 5
                        }}
                    />
                </View>
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}
export default QuestionFourView;