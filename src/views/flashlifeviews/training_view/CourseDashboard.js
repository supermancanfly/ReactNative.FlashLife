import React, { useState } from "react";
import { View, Text, SafeAreaView, FlatList, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { colors, fontsProps } from "../../../utils/StyleComponents";
import TrainingAppbar from "./appbar_view";
import TrainingGradientView from "./card_view/TrainingGradientView";
import SchoolFill from '../../../assets/svg/SchoolFill.svg'
import { SvgXml } from "react-native-svg";
import ProgressIndicatorView from "./card_view/ProgressIndicatorView";
import LockFill from '../../../assets/svg/LockFill.svg';
import LockCircle from '../../../assets/svg/LockCircle.svg';
import GoodJob from '../../../assets/svg/GoodJob.svg';
import ButtonImageTitle from "../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../utils/ConstantImages";
import { ConstantValues } from "../../../utils/ConstantValues";
import CourseCardView from "./card_view/CourseCardView";
import BottomTabView from "../footer_view/BottomTabView";
import { ApiGetAllCourses, ApiGetCoursesByCourseId, ApiGetCourseProgress } from "../../../network/Services";
import { useEffect } from "react";
import ProgressDialog from "../../../components/dialogs/ProgressDialog";
import QuizCardView from "./card_view/QuizCardView";
const CourseDashboard = props => {
    const userData = props.user_data;
    const [courseList, setCourseList] = useState(null);
    const [lessonsList, setLessonsList] = useState([])
    const [quizList, setQuizList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isQuizable, setIsQuizable] = useState(false)
    const [completedLessonCount, setCompletedLessonCount] = useState(0);
    useEffect(() => {
        getAllCourses();
    }, []);

    const getAllCourses = async () => {
        setIsLoading(true)
        let params = `?courseId=${props.couse_id}`;
        await ApiGetCoursesByCourseId(params).then((responseJson) => {
            setIsLoading(false)
            setCourseList(responseJson)
            let assendList = responseJson?.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber)
            setLessonsList(assendList)
            getCourseProgress(assendList)
            let tempQuizQuestions = [];
            let resQuizData = [];//;
            let tempQuizChoiceData = [];
            // console.log("quiz questions", JSON.stringify(responseJson.quizzes[0].quizQuestions));
            for (let index = 0; index < responseJson.quizzes[0].quizQuestions.length; index++) {
                const element = responseJson.quizzes[0].quizQuestions[index];
                tempQuizChoiceData = [];
                for (let j = 0; j < element.quizAnswerChoices.length; j++) {
                    const indexData = element.quizAnswerChoices[j];
                    tempQuizChoiceData.push({
                        isChecked: false,
                        answerNumber: indexData.answerNumber,
                        choice: indexData.choice,
                        image: indexData.image,
                        isCorrect: indexData.isCorrect,
                        quizAnswerChoiceId: indexData.quizAnswerChoiceId
                    });
                }
                tempQuizQuestions.push({
                    quizAnswerChoices: tempQuizChoiceData,
                    quizQuestionId: element.quizQuestionId,
                    questionNumber: element.questionNumber,
                    question: element.question,
                    answerType: element.answerType,
                    isSelectedTrue: false,
                    isSelectedFalse: false
                })

                // console.log("temp questions",JSON.stringify(tempQuizQuestions));
            }
            resQuizData.push(
                {
                    quizQuestions: tempQuizQuestions,
                    quizId: responseJson.quizzes[0].quizId,
                    name: responseJson.quizzes[0].name,
                    title: responseJson.quizzes[0].title,
                    image: responseJson.quizzes[0].image,
                    minPercentage: responseJson.quizzes[0].minPercentage,
                    mode: responseJson.quizzes[0].mode
                }

            );
            setQuizList(resQuizData);
        }).catch((e) => {
            setIsLoading(false)
            console.log("Error", e.toString());
        })
    }

    const getCourseProgress = async (assendList) =>{
        setIsLoading(true)
        await ApiGetCourseProgress(userData[0].access_token, userData[0].id, props.couse_id).then((responseJson) => {
            setIsLoading(false)
            let lessonListWithCourseProgress = []
            var completedCourseCount = 0
            if(responseJson.status === 'success'){
                assendList.forEach(element =>{
                    console.log("PROGRESS:", responseJson.lessons[element.lessonId])
                    const course_progress = responseJson.lessons[element.lessonId].progress
                    const lesson_status = responseJson.lessons[element.lessonId].status
                    console.log("Lesson Status:",lesson_status)
                    if(lesson_status == 'completed'){
                        completedCourseCount ++;
                    }
                    lessonListWithCourseProgress.push({...element, progress: course_progress, status: lesson_status})
                })
                setCompletedLessonCount(completedCourseCount)
                if(responseJson.quiz){
                    setIsQuizable(responseJson.quiz.status == "open")
                }
            }
            else{
                lessonListWithCourseProgress = assendList
            }
            
            setLessonsList(lessonListWithCourseProgress)

        }).catch((e) => {
            setIsLoading(false)
            console.log("Error", e.toString());
            setLessonsList(assendList)
        })
    }

    // const isQuizable = () =>{
    //     let isQuizable = true
    //     for(var i = 0 ; i < lessonsList.length ; i ++){
    //         if(lessonsList[i].status != 'completed'){
    //             isQuizable = false
    //             break;
    //         }
    //     }
    //     return isQuizable
    // }

    const renderCourseLeassonView = () => {
        return <View style={{
            backgroundColor: colors.COLOR_WHITE,
            padding: 15,
            borderRadius: 10,
            marginTop: 50
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgXml height={20}
                        width={20}
                        xml={SchoolFill}
                    />
                    <Text style={{
                        color: colors.COLOR_THEME,
                        fontSize: fontsProps.md,
                        marginHorizontal: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>Course Lessons</Text>
                </View>
                <TouchableOpacity onPress={props.onPressTerms}>
                    <View style={{
                        backgroundColor: '#DC143C',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: colors.COLOR_WHITE,
                            fontSize: fontsProps.sm,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}>Terms To Know</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {lessonsList && lessonsList.map((item, index) => (
                <View key={index.toString()} >
                    
                    <TouchableOpacity onPress={() => props.onItemPress(item, lessonsList, item.lessonNumber, quizList)}>
                        <CourseCardView item={item} />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#EAEDF2', height: 2, marginVertical: 5 }} />
                </View>))}

            {quizList && quizList.map((item, index) => {
                return <View key={index.toString()} >

                    {index != 0 && <View style={{ backgroundColor: '#EAEDF2', height: 2, marginVertical: 5 }} />}
                    <TouchableOpacity onPress={() => isQuizable ? props.onQuizPress(item) : null}>
                        <QuizCardView item={item} isQuizable = {isQuizable} />
                    </TouchableOpacity>
                </View>
            })}
        </View>
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <TrainingAppbar title={'Course Dashboard'}
                isShowBack={true}
                onBackPress={props.onBackPress}
            />
            {courseList && <ScrollView style={{ flex: 1, }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EAEDF2',
                    padding: 15,
                    marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT
                }}>
                    <TrainingGradientView
                        title={courseList.title}
                        description={courseList.body}
                        lessonsTotal={lessonsList.length}
                        lessonCompleted = {completedLessonCount}
                    />
                    {renderCourseLeassonView()}
                    <ButtonImageTitle
                        type={"check"}
                        title={'Start Next Lesson'}
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
                        buttonPress={props.onPressStart}
                    />
                </View>
            </ScrollView>}
            {isLoading && <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={colors.COLOR_THEME}
            />}
        </SafeAreaView>
    )

}
export default CourseDashboard;