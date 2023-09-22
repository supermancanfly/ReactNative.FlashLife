import React, { useEffect } from "react";
import { useState } from "react";
import { Platform, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
import QuizCompletedPopup from "../popup_view/QuizCompletedPopup";
import QuizMultipleChoicePopup from "./QuizMultipleChoicePopup";
import Group_green from '../../../../assets/svg/Group_green.svg';
import Group_black from '../../../../assets/svg/Group_black.svg';
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg';
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import { ApiPostQuizSubmission} from "../../../../network/Services";
import ProgressDialog from "../../../../components/dialogs/ProgressDialog";
import { SvgXml } from "react-native-svg";

const questionsPerPage = 1;
const QuizBasicInfoTwo = props => {

    const { onPressDashboard, onPressContinue, quizData , userData, courseData, onRetryQuiz} = props;
    const [isQuizCompleted, setQuizCompleted] = useState(false);
    const [isBackEnable, setBackEnable] = useState(false)
    const quizQuestions = quizData?.quizQuestions.sort((a, b) => a.questionNumber - b.questionNumber)
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = quizQuestions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(quizQuestions.length / questionsPerPage);
    const [isMultipleChoiceVisible, setMultipleChoiceVisible] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('Please select an option');
    const [multipleChoiceData, setMultipleChoiceData] = useState([])
    const [quizChoiceValue, setQuizChoiceValue] = useState([])
    const [multipleClicked, setMultipleClicked] = useState([])
    const [clickedItems, setClickedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isBoolValueUpdate, setBoolValueUpdate] = useState(false);
    const [quizresult, setQuizResult] = useState({});
    const handleNextPage = () => {
        setDropdownValue('Please select an option');
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setBackEnable(true)
        }
        if (currentPage === totalPages) {
            var correctAnswers = 0
            if(quizData.clickedItems && quizData.clickedItems.length){
                quizData.clickedItems.map(item =>{
                    correctAnswers += item.isCorrect
                })
            }
            console.log(correctAnswers, quizData.quizId)
            saveQuizResult({correct_answers: correctAnswers, quiz_id: quizData.quizId }).then(result =>{
                console.log(result)
                setQuizResult(result)
                setQuizCompleted(true)
            }).catch(error =>{
                console.log(error)
            })
            // setQuizCompleted(true)
        } else {
            setCurrentPage(currentPage + 1);
            setBackEnable(true)
        }

    };
    const saveQuizResult = (quizResult) =>{
        return new Promise(function(resolve, reject){
            setIsLoading(true);
            ApiPostQuizSubmission(userData[0].access_token,  {...quizResult, user_id: userData[0].id,}).then(responseJson => {
                setIsLoading(false);
                if (responseJson) {
                    console.log(responseJson)
                    resolve(responseJson)
                }
            }).catch((error) => {
                setIsLoading(false);
                reject(error)
            })
        });
    }
    const handlePrevPage = () => {
        if (currentPage > 1) {
            let pageIndex = currentPage - 1;
            setCurrentPage(pageIndex);
            if (pageIndex === 1) {
                setBackEnable(false)
            }
        }
    };


    const bottomView = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30
        }}>
            {isBackEnable && <TouchableOpacity style={styles.button_styleIcon}
                onPress={handlePrevPage}>
                <Image
                    source={Constantimages.flash_arrow_icon}
                    style={[styles.image_Style, { marginLeft: 5, transform: [{ rotate: '180deg' }] }]}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.title_style}>Back
                    </Text>
                </View>
            </TouchableOpacity>}
            <ButtonImageTitle
                type={"check"}
                title={(currentPage === totalPages) ? "Submit" : "Next"}
                imagesrc={Constantimages.forword_double_arrow}
                imagestyle={styles.image_Style}
                style={styles.button_styleIcon}
                titleStyle={styles.title_style}
                buttonPress={handleNextPage}
            />
        </View>
    }
    const updateBoolValue = (item, value) => {
        for (let index = 0; index < quizQuestions.length; index++) {
            const element = quizQuestions[index];
            if (item.quizQuestionId === element.quizQuestionId) {
                if (value) {
                    element.isSelectedTrue = true;
                    element.isSelectedFalse = false;
                } else {
                    element.isSelectedTrue = false;
                    element.isSelectedFalse = true;
                }

            }
        }
        setQuizChoiceValue([...quizQuestions])
    }

    const checkAnswerIsCorrect = (answerString, willcheck) =>{
        const finalWord = answerString.replace("True/False (", "").replace("is the correct answer)","").trim().toLowerCase()
        if(finalWord == 'true' && willcheck){
            return true
        }
        else if(finalWord != 'true' && !willcheck){
            return true
        }
        else{
            return false
        }
    }

    const buttonsView = (item) => {
        // console.log("item", JSON.stringify(quizQuestions));
        
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 15
        }}>
            <TouchableOpacity onPress={() => {
                updateBoolValue(item, true);
                checkAnswerValue({
                    questionId: item.quizQuestionId,
                    answerType: item.answerType,
                    value: String('True'),
                    isCorrect: checkAnswerIsCorrect(item.answerType, true)
                });
            }}
                style={[styles.button_style, { backgroundColor: (item.isSelectedTrue) ? colors.COLOR_THEME : colors.COLOR_WHITE, borderColor: (item.isSelectedTrue) ? colors.COLOR_THEME : colors.COLOR_BLACK }]}>
                <Text style={{
                    color: (item.isSelectedTrue) ? colors.COLOR_WHITE : colors.COLOR_BLACK,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                updateBoolValue(item, false);
                checkAnswerValue({
                    questionId: item.quizQuestionId,
                    answerType: item.answerType,
                    value: String('Flse'),
                    isCorrect: checkAnswerIsCorrect(item.answerType, false)
                })
            }}
                style={[styles.button_style, , { backgroundColor: (item.isSelectedFalse) ? colors.COLOR_THEME : colors.COLOR_WHITE, borderColor: (item.isSelectedFalse) ? colors.COLOR_THEME : colors.COLOR_BLACK }]}>
                <Text style={{
                    color: (item.isSelectedFalse) ? colors.COLOR_WHITE : colors.COLOR_BLACK,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>False</Text>
            </TouchableOpacity>
        </View>
    }
    const checkAnswerValue = (item) => {
        console.log("CheckAnswerValue:", quizData.clickedItems)
        var updateClickedItems = quizData.clickedItems?.length ? [...quizData.clickedItems] : []
        if (item.answerType === "Multiple Choice Single") {
            var isAlready = false
            for(var i = 0 ; i < updateClickedItems.length ; i ++){
                if(updateClickedItems[i].quizQuestionId == currentQuestions[0].quizQuestionId){
                    updateClickedItems[i] = {...item, quizQuestionId: currentQuestions[0].quizQuestionId};
                    isAlready = true;
                    break;
                }
            }
            if(isAlready == false){
                quizData.clickedItems = [...updateClickedItems, {...item, quizQuestionId: currentQuestions[0].quizQuestionId}];
            }
            else{
                quizData.clickedItems = updateClickedItems
            }
        }
        else {
            var isAlready = false
            for(var i = 0 ; i < updateClickedItems.length ; i ++){
                if(updateClickedItems[i].questionId == item.questionId){
                    updateClickedItems[i] = item;
                    isAlready = true;
                    break;
                }
            }
            if(isAlready == false){
                quizData.clickedItems = [...updateClickedItems, item];
            }
            else{
                quizData.clickedItems = updateClickedItems
            }
            
        }
    }
    const renderBooleanView = (item, index) => {
        return (
            <View key={index} >
                <Text style={{
                    color: '#676767',
                    fontSize: fontsProps.md,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>{courseData.title}</Text>
                <Text style={{
                    color: '#DC143C',
                    fontSize: fontsProps.sm,
                    marginVertical: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>QUIZ: QUESTION {item.questionNumber}</Text>
                <Text style={{
                    fontSize: 25,
                    marginVertical: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                }}>Is the following statement true or false?</Text>
                <Text style={{
                    fontSize: fontsProps.md,
                    marginVertical: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>{item.question}</Text>

                {buttonsView(item, index)}
            </View>
        )
    }

    const renderMultiSingleChoiceView = (item, index) => {
        // console.log("item88888888888",item);
        
        return <View key={index} style={{
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 10
        }}>
            <Text style={{
                color: '#676767',
                fontSize: fontsProps.md,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{courseData.title}</Text>
            <Text style={{
                color: '#DC143C',
                fontSize: fontsProps.sm,
                marginVertical: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>QUIZ: QUESTION {item.questionNumber}</Text>
            <Text style={{
                fontSize: 25,
                marginVertical: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
            }}>Question {item.questionNumber}</Text>
            <Text style={{
                fontSize: 14,
                marginVertical: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
            }}>{item.question}</Text>
            <View>{item.quizAnswerChoices.map((item, index) => {
                    return <View key={index.toString()} style={{ marginTop: 10 }}>
                        {index != 0 && <View style={{
                            backgroundColor: '#707070',
                            height: 0.7,
                            marginVertical: 7
                        }} />}
                        <TouchableOpacity onPress={() => {
                            updateMultipleChoiceValue(item);
                            setQuizChoiceValue([...quizQuestions])
                            checkAnswerValue({
                                questionId: item.quizAnswerChoiceId,
                                answerType: "Multiple Choice Single",
                                value: item.choice,
                                isCorrect: item.isCorrect
                            });
                            // setDropdownValue(item.title);
                            // setVisible(!isModalVisible);

                        }}>
                            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <SvgXml xml={(item.isChecked ? CheckCircleFill : CheckCircleGreen)} height={20} width={20} />
                                <Text style={{
                                    fontSize: 14,
                                    marginHorizontal: 10,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                }}>{item.choice}</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                })}</View>
        </View>
    }

    const updateMultipleChoiceValue = item => {
        for (let index = 0; index < quizQuestions.length; index++) {
            const element = quizQuestions[index];
            if(currentQuestions[0].quizQuestionId == element.quizQuestionId){
                for (let j = 0; j < element.quizAnswerChoices.length; j++) {
                    if (item.quizAnswerChoiceId === element.quizAnswerChoices[j].quizAnswerChoiceId) {
                        if (element.quizAnswerChoices[j].isChecked) {
                            element.quizAnswerChoices[j].isChecked = false;
                        } else {
                            element.quizAnswerChoices[j].isChecked = true;
                        }
                    } else {
                        element.quizAnswerChoices[j].isChecked = false;
                    }
                }
            }
            
        }
    }
    return (
        <View style={{
            flex: 1,
            marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT
        }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10,
                }}>
                    {currentQuestions.map((item, index) => {
                        if (item.answerType === "Multiple Choice Single") {
                            return renderMultiSingleChoiceView(item, index);
                        } else {
                            return renderBooleanView(item, index)
                        }
                    })}
                </View>

                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    progressbarColor={'#B8B8B8'}
                    sections={quizQuestions.length}
                    earnedPoints={currentPage}
                />
                {bottomView()}

                <QuizCompletedPopup
                    isVisible={isQuizCompleted}
                    isQuizSuccessed = {quizresult.result != 'failed' ? true : false}
                    quizResult = {quizresult}
                    courseData = {courseData}
                    onReviewAnswers = {() =>{
                        console.log("Review Answers")
                    }}
                    onRetryQuiz = {() =>{
                        console.log("Retry quiz")
                        // onPressContinue()
                        onRetryQuiz()
                    }}
                    onBackToTrainingCourses = {() =>{
                        console.log("Back to Training Courses")
                        onPressDashboard(ConstantValues.BACK_TO_TRAINING_COURSES)
                    }}
                    onReviewCourseLessons = {() =>{
                        onPressDashboard()
                    }}
                />
            </ScrollView>
            {isLoading && <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={colors.COLOR_THEME}
            />}
        </View>


    )
}
export default QuizBasicInfoTwo;

const styles = StyleSheet.create({
    image_Style: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: (ConstantValues.COMPANY_ID_STR == "37") ? colors.COLOR_WHITE : "#B2FA00"
    },
    button_style: {
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 7,
        marginHorizontal: 5,
        justifyContent: 'center'
    },
    button_styleIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.COLOR_BLACK,
        borderRadius: 5,
        elevation: 5,
        flex: 1,
        height: ConstantValues.SUBMIT_BUTTON_SIZE,
        marginVertical: 5,
        marginHorizontal: 5
    },
    title_style: {
        fontSize: 14,
        color: colors.COLOR_WHITE,
        textAlign: 'center',
        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
    }
})