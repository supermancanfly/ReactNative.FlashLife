import React from "react";
import { View, Text, Modal, Platform, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SvgXml } from "react-native-svg";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors } from "../../../../utils/StyleComponents";
import GoodJob from '../../../../assets/svg/GoodJob.svg';
import InCorrect from '../../../../assets/svg/InCorrect.svg';
import Completed from '../../../../assets/svg/Completed.svg';
import Passed from '../../../../assets/svg/Passed.svg';
const CourseCompletedPopup = ({ isVisible, onPress, isLeassonCompleted, onDashboard, onPressContinue , lessonNumber, lessonTitle, currentLessonNumber, nextTitle}) => {
    const dashboardButtonView = () => {
        return <TouchableOpacity style={[styles.button_style, { backgroundColor: colors.COLOR_BLACK, }]} onPress={() => { onDashboard((isLeassonCompleted) ? ConstantValues.BACK_TO_DASHBOARD : ConstantValues.BACK_TO_TRAINING_COURSES) }}>
            <Image
                source={Constantimages.forword_double_arrow}
                style={[styles.image_style, { transform: [{ rotate: '180deg' }], tintColor: colors.COLOR_THEME, marginHorizontal: 10 }]}
            />
            <View style={{ flex: 1 }}>
                <Text style={[styles.title_style]}>{(isLeassonCompleted) ? ConstantValues.BACK_TO_DASHBOARD : ConstantValues.BACK_TO_TRAINING_COURSES}
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
                        {(isLeassonCompleted) ? <SvgXml width="100"
                            height="100"
                            fill={"#000000"}
                            xml={Completed} /> : <SvgXml width="100"
                                height="100"
                                fill={'#000000'}
                                xml={Passed} />}

                    </View>
                    <Text style={{
                        fontSize: 30,
                        color: colors.COLOR_BLACK,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{(isLeassonCompleted) ? 'Lesson Completed' : 'You Passed!!!'}</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 10,
                        color: colors.COLOR_BLACK,
                        textAlign: 'center',
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{(isLeassonCompleted) ? `You have completed Lesson ${currentLessonNumber} Next up: ${nextTitle}` : 'You have passed Airtime and Data Sales! Your quiz score was 85% and you’ve earned 100 points.'}</Text>
                    <ButtonImageTitle
                        type={"check"}
                        title={(isLeassonCompleted) ? ConstantValues.CONTINUE : ConstantValues.REVIEW_ANSWERS}
                        imagesrc={Constantimages.forword_double_arrow}
                        imagestyle={styles.image_style}
                        style={styles.button_style}
                        titleStyle={styles.title_style}
                        buttonPress={() => { onPressContinue((isLeassonCompleted) ? ConstantValues.CONTINUE : ConstantValues.REVIEW_ANSWERS) }}
                    />
                    {dashboardButtonView()}
                </View>
            </View>

        </Modal>
    )

}
export default CourseCompletedPopup;

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