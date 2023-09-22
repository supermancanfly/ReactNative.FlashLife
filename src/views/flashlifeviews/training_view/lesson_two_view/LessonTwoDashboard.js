import React, { useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, SafeAreaView } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import TrainingAppbar from "../appbar_view";
import AccordionContentType from "./AccordionContentType";
import AirtimeView from "./AirtimeView";
import ChecklistOne from "../lesson_three_view/ChecklistOne";
import DataAnalysisView from "./DataAnalysisView";
import SellingAnalysisView from "./SellingAnalysisView";
import CancellationORRefundView from "../lesson_three_view/CancellationORRefundView";
import CancellationORRefundTwo from "../lesson_three_view/CacellationORRefundTwo";
import QuestionsView from "../quiz_view/QuestionsView";
import QuestionTwoView from "../quiz_view/QuestionTwoView";
import QuestionThreeView from "../quiz_view/QuestionThreeView";
import QuestionFourView from "../quiz_view/QuestionFourView";
import QuestionFiveView from "../quiz_view/QuestionFiveView";
import LeassonCheckIn from "../leasson_view/LeassonCheckIn";

const LessonTwoDashboard = ({ onBackPress, onNext, onPressDashboard }) => {
    const [enableAccordionView, setAccordionView] = useState(true);
    const [enableAirtimeView, setAirtimeView] = useState(false);
    const [enableDataView, setDataView] = useState(false);
    const [enableSellingView, setSellingView] = useState(false);
    const [enableChecklistOne, setChecklistOne] = useState(false);
    const [enableCancelRefundView, setCancelRefundView] = useState(false);
    const [enableCancelRefundTwo, setCancelRefundTwo] = useState(false);
    const [enableQuestionsView, setQuestinsView] = useState(false);
    const [enableQuestionTwoView, setQuestionTwo] = useState(false);
    const [enableQuestionThreeView, setQuestionThree] = useState(false);
    const [enableQuestionFourView, setQuestionFourView] = useState(false);
    const [enablequestionFiveView, setQuestionFiveView] = useState(false);
    const [lessonCheckIn, setLessonCheckIn] = useState(false);

    const onBackAirtime = () => {
        setAccordionView(true);
        setAirtimeView(false);
    }
    const onBackDataView = () => {
        setAirtimeView(true);
        setDataView(false);
    }
    const onBackSellingView = () => {
        setSellingView(false);
        setDataView(true);
    }
    const onBackCheckListView = () => {
        setChecklistOne(false);
        setDataView(true);
    }
    const onBackCancelRefundView = () => {
        setCancelRefundView(false);
        setChecklistOne(true);
    }
    const onBackCancelRefundViewTwo = () => {
        setCancelRefundTwo(false);
        setCancelRefundView(true);
    }
    const onBackQuestionsView = () => {
        setQuestinsView(false);
        setCancelRefundTwo(true);
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
    const onAppbarPress = () => {
        if (enableAirtimeView) {
            return onBackAirtime();
        } else if (enableDataView) {
            return onBackDataView();
        } else if (enableSellingView) {
            return onBackSellingView();
        } else if (enableChecklistOne) {
            return onBackCheckListView();
        } else if (enableCancelRefundView) {
            return onBackCancelRefundView();
        } else if (enableCancelRefundView) {
            return onBackCancelRefundViewTwo();
        } else if (enableQuestionsView) {
            return onBackQuestionsView();
        } else if (enableQuestionTwoView) {
            return onBackQuestionsViewTwo();
        } else if (enableQuestionThreeView) {
            return onBackQuestionsViewThree();
        } else if (enableQuestionFourView) {
            return onBackQuestionsViewFour();
        } else if (enableQuestionsView) {
            return onBackQuestionsViewFive();
        } else {
            return onBackPress();
        }
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <TrainingAppbar title={'Lessons'}
                isShowBack={true}
                onBackPress={onAppbarPress}
            />
            <ScrollView style={{ flex: 1, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EAEDF2',
                    padding: 15
                }}>
                    {enableAccordionView && <AccordionContentType
                        onBack={onAppbarPress}
                        onNext={() => {
                            setAccordionView(false);
                            setAirtimeView(true);
                        }} />}
                    {enableAirtimeView && <AirtimeView
                        onNext={() => {
                            setAirtimeView(false);
                            setDataView(true)
                        }}
                        onBack={onBackAirtime}
                    />}
                    {enableDataView && <DataAnalysisView
                        onBack={onBackDataView}
                        onNext={() => {
                            setDataView(false);
                            setSellingView(true);
                        }}
                    />}
                    {enableSellingView && <SellingAnalysisView
                        onBack={onBackSellingView}
                        onNext={() => {
                            setSellingView(false);
                            setChecklistOne(true);
                        }}
                    />}
                    {enableChecklistOne && <ChecklistOne
                        onBack={onBackCheckListView}
                        onNext={() => {
                            setChecklistOne(false);
                            setCancelRefundView(true)
                        }}
                    />}
                    {enableCancelRefundView && <CancellationORRefundView
                        onBack={onBackCancelRefundView}
                        onNext={() => {
                            setCancelRefundTwo(true);
                            setCancelRefundView(false);
                        }} />}
                    {enableCancelRefundTwo && <CancellationORRefundTwo
                        onBack={onBackCancelRefundViewTwo}
                        onNext={() => {
                            setCancelRefundTwo(false);
                            // setQuestinsView(true);
                            setLessonCheckIn(true);
                        }}
                    />}
                    {lessonCheckIn && <LeassonCheckIn
                        textFrom={'LESSON 2: LESSON CHECK-IN'}
                        onPressDashboard={(value) => onPressDashboard(value)}
                        onPressContinue={(value) => {
                            setLessonCheckIn(false);
                            onPressDashboard(value);
                        }}
                    />}
                    {/* {enableQuestionsView && <QuestionsView
                        onBack={onBackQuestionsView}
                        onNext={() => {
                            setQuestinsView(false);
                            setQuestionTwo(true)
                        }}
                    />}
                    {enableQuestionTwoView && <QuestionTwoView
                        onBack={onBackQuestionsViewTwo}
                        onNext={() => {
                            setQuestionThree(true);
                            setQuestionTwo(false);
                        }}
                    />}
                    {enableQuestionThreeView && <QuestionThreeView
                        onBack={onBackQuestionsViewThree}
                        onNext={() => {
                            setQuestionFourView(true);
                            setQuestionThree(false);
                        }}
                    />}
                    {enableQuestionFourView && <QuestionFourView
                        onBack={onBackQuestionsViewFour}
                        onNext={() => {
                            setQuestionFourView(false);
                            setQuestionFiveView(true);
                        }}
                    />}
                    {enablequestionFiveView && <QuestionFiveView
                        onBack={onBackQuestionsViewFive}
                        onNext={onNext}
                    />} */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}
export default LessonTwoDashboard;