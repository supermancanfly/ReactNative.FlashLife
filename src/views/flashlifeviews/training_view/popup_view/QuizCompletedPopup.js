import React from "react";
import { View, Text, Modal, Platform, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SvgXml } from "react-native-svg";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors } from "../../../../utils/StyleComponents";
import GoodJob from '../../../../assets/svg/GoodJob.svg';
import Sad from '../../../../assets/svg/Sad.svg';
import Completed from '../../../../assets/svg/Completed.svg';
import Passed from '../../../../assets/svg/Passed.svg';
const QuizCompletedPopup = ({ isVisible, isQuizSuccessed, quizResult, courseData, onReviewAnswers, onRetryQuiz, onBackToTrainingCourses, onReviewCourseLessons}) => {
    const backButtonView = () => {
        return <TouchableOpacity style={[styles.button_style, { backgroundColor: colors.COLOR_BLACK, }]} 
            onPress = {isQuizSuccessed ? onBackToTrainingCourses : onReviewCourseLessons}
            // onPress={() => { onDashboard((isQuizSuccessed) ? ConstantValues.BACK_TO_DASHBOARD : ConstantValues.BACK_TO_TRAINING_COURSES) }}
        >
            <Image
                source={Constantimages.forword_double_arrow}
                style={[styles.image_style, { transform: [{ rotate: '180deg' }], tintColor: colors.COLOR_THEME, marginHorizontal: 10 }]}
            />
            <View style={{ flex: 1 }}>
                <Text style={[styles.title_style]}>{(isQuizSuccessed) ?  ConstantValues.BACK_TO_TRAINING_COURSES : ConstantValues.REVIEW_COURSE_LESSONS}
                </Text>
            </View>
        </TouchableOpacity>
    }
    return (
        <Modal transparent={true}
            visible={isVisible}
            animationType={'slide'}>
            <View style={{
                flex: 1,
                backgroundColor: '#00000099',
                justifyContent: 'center',
                alignItems: 'center'
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
                        {(isQuizSuccessed) ? <SvgXml width="100"
                            height="100"
                            fill={"#000000"}
                            xml={Passed} /> : <SvgXml width="100"
                                height="100"
                                fill={'#000000'}
                                xml={Sad} />}

                    </View>
                    <Text style={{
                        fontSize: 30,
                        color: isQuizSuccessed ? colors.COLOR_BLACK : colors.COLOR_DARK_RED,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{(isQuizSuccessed) ?  'You Passed!!!' : 'Almost!'}</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 10,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{(isQuizSuccessed) ?  `You have passed ${courseData.name}! Your quiz score was ${quizResult.score_percent}% and you’ve earned ${parseInt(courseData.points)} points.` : `You didn't score enough points to pass. Your quiz score was ${quizResult.score_percent}%. You can always re-take the quiz when you're ready.` }</Text>
                    {!isQuizSuccessed && <ButtonImageTitle
                        type={"check"}
                        title={(isQuizSuccessed) ?  ConstantValues.REVIEW_ANSWERS : ConstantValues.RETRY_QUIZ}
                        imagesrc={Constantimages.forword_double_arrow}
                        imagestyle={styles.image_style}
                        style={styles.button_style}
                        titleStyle={styles.title_style}
                        buttonPress={isQuizSuccessed ? onReviewAnswers : onRetryQuiz }
                    />}
                    {backButtonView()}
                </View>
            </View>

        </Modal>
    )

}
export default QuizCompletedPopup;

const styles = StyleSheet.create({
    button_style: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.COLOR_THEME,
        borderRadius: 10,
        elevation: 5,
        height: ConstantValues.SUBMIT_BUTTON_SIZE,
        marginTop: 10
    },
    title_style: {
        fontSize: 14,
        color: colors.COLOR_WHITE,
        textAlign: 'center',
        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
    },
    image_style: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: (ConstantValues.COMPANY_ID_STR == "37") ? colors.COLOR_WHITE : colors.COLOR_BLACK
    }
})