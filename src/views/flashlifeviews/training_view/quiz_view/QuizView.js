import React from "react";
import { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import TrainingAppbar from "../appbar_view";
import QuestionFiveView from "./QuestionFiveView";
import QuestionFourView from "./QuestionFourView";
import QuestionsView from "./QuestionsView";
import QuestionThreeView from "./QuestionThreeView";
import QuestionTwoView from "./QuestionTwoView";
import QuizBasicInfo from "./QuizBasicInfo";
import QuizBasicInfoTwo from "./QuizCheckOut";

const QuizView = ({ onBackPress, onPressDashboard, onPressContinue ,quizData, userData, courseData}) => {
    const [enableBasicInfo, setEnableBasicInfo] = useState(true);
    const [enableBasicInfoTwo, setEnableBasicInfoTwo] = useState(false);
    const [enableQuestionsView, setQuestinsView] = useState(false);
    const [enableQuestionTwoView, setQuestionTwo] = useState(false);
    const [enableQuestionThreeView, setQuestionThree] = useState(false);
    const [enableQuestionFourView, setQuestionFourView] = useState(false);
    const [enablequestionFiveView, setQuestionFiveView] = useState(false);

    const onBackQuestionsView = () => {
        setQuestinsView(false);
        setEnableBasicInfoTwo(true);
    }

    const onBackQuestionsViewTwo = () => {
        setQuestionTwo(false);
        setQuestinsView(true);
    }
    const onBackQuestionsViewThree = () => {
        setQuestionTwo(true);
        setQuestionThree(false);
    }
    const onBackQuestionsViewFour = () => {
        setQuestionFourView(false);
        setQuestionThree(true);
    }
    const onBackQuestionsViewFive = () => {
        setQuestionFiveView(false);
        setQuestionFourView(true);
    }
    const onBasicInfoBackPress = () => {
        setEnableBasicInfo(false);
        setEnableBasicInfoTwo(true);
    }
    const onAppbarBackPress = () => {
        if (enableBasicInfoTwo) {
            setEnableBasicInfo(true);
            setEnableBasicInfoTwo(false);
        } else if (enableQuestionsView) {
            onBackQuestionsView();
        } else if (enableQuestionTwoView) {
            onBackQuestionsViewTwo();
        } else if (enableQuestionThreeView) {
            onBackQuestionsViewThree();
        } else if (enableQuestionFourView) {
            onBackQuestionsViewFour()
        } else if (enablequestionFiveView) {
            onBackQuestionsViewFive();
        }
        else {
            onBackPress();
        }

    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <TrainingAppbar
                title={'Quiz'}
                isShowBack={true}
                onBackPress={onAppbarBackPress}
            />
            <ScrollView style={{flex:1}}>
            <View style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#EAEDF2',
                marginBottom:ConstantValues.BOTTOM_TAB_HEIGHT
            
            }}>
                {enableBasicInfo && <QuizBasicInfo
                courseTitle = {courseData.title}
                  quizData={quizData}
                    onStartQuiz={onBasicInfoBackPress} />}
                {enableBasicInfoTwo && <QuizBasicInfoTwo
                userData = {userData}
                courseData = {courseData}
                onRetryQuiz = {onAppbarBackPress}
                  quizData={quizData}
                    onPressDashboard={onPressDashboard}
                    onPressContinue={(value) => {
                        setEnableBasicInfoTwo(false)
                        setQuestinsView(true);
                    }}
                />}
                {/* {enableQuestionsView && <QuestionsView
                quizData={quizData}
                    onBack={onAppbarBackPress}
                    onNext={() => {
                        setQuestinsView(false);
                        setQuestionTwo(true)
                    }}
                />}
                {enableQuestionTwoView && <QuestionTwoView
                    onBack={onAppbarBackPress}
                    onNext={() => {
                        setQuestionThree(true);
                        setQuestionTwo(false);
                    }}
                />}
                {enableQuestionThreeView && <QuestionThreeView
                    onBack={onAppbarBackPress}
                    onNext={() => {
                        setQuestionFourView(true);
                        setQuestionThree(false);
                    }}
                />}
                {enableQuestionFourView && <QuestionFourView
                    onBack={onAppbarBackPress}
                    onNext={() => {
                        setQuestionFourView(false);
                        setQuestionFiveView(true);
                    }}
                />}
                {enablequestionFiveView && <QuestionFiveView
                    onBack={onAppbarBackPress}
                    onNext={onPressDashboard}
                />} */}
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default QuizView;