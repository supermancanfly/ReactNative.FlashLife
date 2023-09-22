import React from "react";
import { Platform, View, Text, ScrollView} from "react-native";
import { SvgXml } from "react-native-svg";
import Quiz from '../../../../assets/svg/Quiz.svg'
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import FastImage from "react-native-fast-image";
const Image = FastImage;
const QuizBasicInfo = props => {
    const { onStartQuiz, quizData, courseTitle } = props;
    // console.log("quiz data",JSON.stringify(quizData));
    let imageUrl = null;
    if (quizData && quizData.image) {
        imageUrl = `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${quizData.image}`
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EAEDF2',
            marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT
        }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10,
                }}>
                    <Text style={{
                        color: '#676767',
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{courseTitle}</Text>
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.md,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{quizData.name}</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{quizData.title}</Text>
                    <View pointerEvents={'none'} style={{
                        alignItems: 'center',
                        marginVertical: 10
                    }}>{imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} /> :
                        <SvgXml height={120}
                            width={120}
                            fill={'#000000'}
                            xml={Quiz} />}


                    </View>
                    <Text style={{
                        fontSize: fontsProps.md,
                        marginVertical: 5,
                        textAlign: 'center',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>In order to finish this course, you must pass this quiz with {quizData.minPercentage}%.</Text>
                </View>

                <ButtonImageTitle
                    type={"check"}
                    title={'Start Quiz'}
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
                        borderRadius: 5,
                        elevation: 5,
                        height: ConstantValues.SUBMIT_BUTTON_SIZE,
                        marginVertical: 10
                    }}
                    titleStyle={{
                        fontSize: 14,
                        color: colors.COLOR_WHITE,
                        textAlign: 'center',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}
                    buttonPress={onStartQuiz}
                />
            </ScrollView>
        </View>
    )
}
export default QuizBasicInfo;