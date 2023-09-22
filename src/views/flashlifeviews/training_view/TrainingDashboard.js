import React from "react";
import { useState } from "react";
import { View, TouchableOpacity, Text, Image, SafeAreaView, Platform, ScrollView } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { Switch } from "react-native-paper";
import { SvgXml } from "react-native-svg";
import { ConstantValues } from "../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../utils/StyleComponents";
import SchoolFill from '../../../assets/svg/SchoolFill.svg';
import LeassonCardView from "./card_view/TrainingCardView";
import VerifiedFill from '../../../assets/svg/VerifiedFill.svg';
import TrainingAppbar from "./appbar_view";
import TrainingGradientView from "./card_view/TrainingGradientView";
import BottomTabView from "../footer_view/BottomTabView";
import TrainingCardView from "./card_view/TrainingCardView";
import CourseDashboard from "./CourseDashboard";
import TermsKnow from "./TermsKnow";
import LeassonPage from "./leasson_view/LeassonPage";
import HeaderLogoProfile from "../../../components/shared/HeaderLogoProfile";
import Constantimages from "../../../utils/ConstantImages";
import QuizView from "./quiz_view/QuizView";
import AccordionContentType from "./lesson_two_view/AccordionContentType";
import LessonTwoDashboard from "./lesson_two_view/LessonTwoDashboard";
import { ApiGetAllCourses, ApiMyLmsTracking, ApiSaveCourseActivity, ApiGetCoursesByCourseId } from "../../../network/Services";
import { useEffect } from "react";
import ProgressDialog from "../../../components/dialogs/ProgressDialog";
const TrainingDashboard = (props) => {
    const userData = props.userData;
    const [enableTrainingView, setTrainingView] = useState(true);
    const [enableCourseView, setCourseView] = useState(false);
    const [enableTermsView, setTermsView] = useState(false);
    const [enableLeassonView, setLeassonView] = useState(false);
    const [enableQuizView, setQuizView] = useState(false);
    const [enableLessonTwoView, setLessonTwoView] = useState(false);
    const [courseList, setCourseList] = useState([]);
    const [lmsTracking, setLmsTracking] = useState({});
    const [courseId, setCourseId] = useState();
    const [courseData, setCourseData] = useState({})
    const [stepIndex, setStepIndex] = useState(0)
    const [showCheckIn, setShowCheckIn] = useState(false)
    
    const [lessonData, setLessonData] = useState();
    const [quizData, setQuizData] = useState({})
    const [isLoading, setLoading] = useState(false);
    const [lessonList, setLessonList] = useState([]);
    const [lessonNumber, setLessonNumber] = useState();
    const [courseLessons, setCourseLessons] = useState();
    const [quizList, setQuizList] = useState([]);
    
    useEffect(() => {
        getAllCourses();
    }, []);

    const getAllCourses = async () => {
        setLoading(true);
        let params = "?entityID=9";

        await ApiGetAllCourses(params).then(responseJson => {
            setLoading(false);
            if (responseJson) {
                // setCourseList(responseJson);
                getMyLmsTracking(responseJson);
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error)

            // //Hello, I fixed api error handler
        })
    }

    const saveCourseActivity = (courseActivity) =>{
        return new Promise(function(resolve, reject){
            setLoading(true);
            ApiSaveCourseActivity(userData[0].access_token,  {...courseActivity, user_id: userData[0].id,}).then(responseJson => {
                setLoading(false);
                if (responseJson) {
                    console.log(responseJson)
                    resolve(responseJson)
                }
            }).catch((error) => {
                setLoading(false);
                reject(error)
            })
        });
    }

    const getMyLmsTracking = async(_courseList) =>{
        console.log("Get My LMS Tracking...")
        setLoading(true);
        await ApiMyLmsTracking(userData[0].access_token, userData[0].id).then(responseJson => {
            console.log(responseJson,"resdilee")
            setLoading(false);
            if (responseJson) {
                console.log(responseJson)
                if(responseJson.status == 'success'){
                    let courseCompleted = []
                    let courseToComplete = []
                    responseJson.assigned_courses.forEach(element => {
                        const course_details = _courseList.find(course => course.courseId === element.course_id )
                        if(element.status === 'complete'){
                            courseCompleted.push({ ...course_details, ...element,})
                        }
                        else{
                            courseToComplete.push({...course_details, ...element, })
                        }
                    });
                    setCourseList(_courseList)
                    setLmsTracking({
                        user_summary: responseJson.user_summary,
                        courses_completed: courseCompleted,
                        courses_to_complete: courseToComplete
                    })

                }
            }
        }).catch((error) => {
            console.log("mylms track error")
            setLoading(false);
            console.log(error)

            // //Hello, I fixed api error handler
        })
    }

    const renderCourseCompleteView = () => {
        return <View style={{
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 10,
            padding: 10,
            marginTop: 50
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View pointerEvents="none">
                    <SvgXml width="22"
                        height="18"
                        fill={"#A1A4B0"}
                        xml={SchoolFill} />
                </View>
                <Text style={{
                    color: colors.COLOR_THEME,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    fontSize: fontsProps.md,
                    marginHorizontal: 5
                }}>Courses to Complete</Text>
            </View>

            {lmsTracking.courses_to_complete.map((item, index) => (
                <View key={index.toString()}>
                    {index != 0 && <View style={{ backgroundColor: '#EAEDF2', height: 2, marginVertical: 5 }} />}
                    <TouchableOpacity onPress={() => {
                        setCourseData(item)
                        setCourseId(item.courseId)
                        setCourseLessons(item.lessons)
                        var nextItemId = item?.next_item?.id ?? "";
                        var nextItemType = item?.next_item?.type ?? "";
                        var nextItemLessonId = item?.next_item?.lesson_id ?? "";
                        console.log(nextItemId, nextItemType, nextItemLessonId)
                        if(nextItemType != ""){
                            openNextItem(item.courseId, nextItemId, nextItemType, nextItemLessonId)
                            
                        }
                        else{
                            setCourseView(true);
                            setTrainingView(false);
                        }

                    }}>
                        <TrainingCardView item={item} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    }
    const openNextItem = async (courseId, nextItemId, nextItemType, nextItemLessonId) =>  {
        setLoading(true)
        let params = `?courseId=${courseId}`;
        await ApiGetCoursesByCourseId(params).then((responseJson) => {
            setLoading(false)
            let assendList = responseJson?.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber)
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

            if(nextItemType == "lesson_step"){
                console.log("Lesson List", assendList)
                for(var i = 0 ; i < assendList.length ; i ++){
                    if(assendList[i].lessonId == nextItemLessonId){
                        for(var j = 0 ; j < assendList[i].lessonSteps.length ; j ++){
                            if(nextItemId == assendList[i].lessonSteps[j].lessonStepId){
                                console.log(assendList[i].lessonSteps[j], j)
                                setLessonList(assendList);
                                setQuizList(resQuizData);
                                setLessonNumber(assendList[i].lessonNumber);
                                setCourseView(false);
                                setTrainingView(false);
                                setQuizView(false);
                                // setCurrentStepData(assendList[i].lessonSteps[j])
                                setShowCheckIn(false)
                                setStepIndex(j)
                                setLessonData(assendList[i]);
                                setLeassonView(true);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            else if(nextItemType == "lesson_checkin"){
                console.log("Open Check IN")
                for(var i = 0 ; i < assendList.length ; i ++){
                    if(assendList[i].lessonId == nextItemLessonId){
                        setLessonList(assendList);
                        setQuizList(resQuizData);
                        setLessonNumber(assendList[i].lessonNumber);
                        setCourseView(false);
                        setTrainingView(false);
                        setQuizView(false);
                        // setCurrentStepData(assendList[i].lessonSteps[j])
                        setShowCheckIn(true)
                        setStepIndex(0)
                        setLessonData(assendList[i]);
                        setLeassonView(true);
                        break;
                    }
                }
            }
            else if (nextItemType == "quiz"){
                console.log(nextItemId)
                
                openQuiz(resQuizData[0])
                setTrainingView(false);
            }
            
        }).catch((e) => {
            setLoading(false)
            console.log("Error", e.toString());
        })
    }
    const openLesson = (value, lessonList, lessonNumber, _quizList) => {
        if(lessonNumber == 1 || value.status != 'locked'){
            console.log(value)
            saveCourseActivity({
                previous: lessonNumber == 1 ? {} : {},
                current: {
                    type: 'lesson_step',
                    id: value.lessonSteps[0].lessonStepId
                }
            }).then(() =>{
                setLessonList(lessonList);
                setQuizList(_quizList);
                setLessonNumber(lessonNumber);
                setShowCheckIn(false)
                setStepIndex(0)
                setCourseView(false);
                setLeassonView(true);
                setQuizView(false);
                setLessonData(value);
            }).catch((e) =>{
                console.log(e.toString())
            });
            
        }
        else {

            // setLessonList(lessonList);
            // setLessonNumber(lessonNumber);
            // setCourseView(false);
            // setLeassonView(true);
            // setQuizView(false);
            // setLessonData(value);
        }

    }
    const renderCompletedCourseView = () => {
        return <View style={{
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 10,
            padding: 10,
            marginTop: 20
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View pointerEvents="none">
                    <SvgXml width="22"
                        height="18"
                        fill={"#A1A4B0"}
                        xml={VerifiedFill} />
                </View>
                <Text style={{
                    color: colors.COLOR_THEME,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    fontSize: fontsProps.md,
                    marginHorizontal: 5
                }}>Completed Courses</Text>
            </View>
            {lmsTracking.courses_completed.map((item, index) => (
                <View key={index.toString()}>
                    {index != 0 && <View style={{ backgroundColor: '#EAEDF2', height: 2, marginVertical: 5 }} />}
                    <TouchableOpacity onPress={() => {
                        setCourseData(item)
                        setCourseId(item.courseId)
                        setCourseLessons(item.lessons)
                        setCourseView(true);
                        setTrainingView(false);
                    }}>
                        {/* props.navigation.navigate('course_dashboard_view') */}
                        <TrainingCardView item={item} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    }
    const renderTrainingDashboardView = () => {
        return <View style={{ flex: 1 }}>
            {/* <TrainingAppbar title={ConstantValues.TRAINING_STR} /> */}
            <HeaderLogoProfile
                title={"Show"}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    flexDirection: 'row',
                    backgroundColor: colors.COLOR_THEME,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                }}
                headerlogo={Constantimages.flash_header_logo}
                profilename={userData && userData[0].preferred_name}
            />
            {courseList.length > 0 ? <ScrollView style={{
                flex: 1,

            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EAEDF2',
                    padding: 15,
                    marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT
                }}>
                    <TrainingGradientView
                        title={'Learning courses'}
                        description={'Grab a coffee and dive in!'}
                        pointsEarned = {lmsTracking?.user_summary?.total_points ?? 0}
                        userCourses = {lmsTracking?.user_summary?.courses ?? {completed: 0, total: 0}}
                        fromScreen={ConstantValues.TRAINING_STR} />
                    {lmsTracking?.courses_to_complete && lmsTracking?.courses_to_complete.length > 0 && <View style={{ marginTop: 20 }}>

                        {renderCourseCompleteView()}
                        {/* {renderCompletedCourseView()} */}
                    </View>}

                    {lmsTracking?.courses_completed && lmsTracking?.courses_completed.length > 0 && <View style={{ marginTop: 20 }}>
                        {renderCompletedCourseView()}
                        {/* {renderCompletedCourseView()} */}
                    </View>}

                </View>
            </ScrollView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                <Text  ></Text>
            </View>}
        </View>

    }
    const openQuiz = (value) =>{
        setCourseView(false);
        setQuizView(true);
        setShowCheckIn(false)
        setStepIndex(0)
        setLeassonView(false);
        setQuizData(value)
    }
    const renderCourseDashboardView = () => {
        return <CourseDashboard
            onPressTerms={() => {
                setCourseView(false);
                setTermsView(true);
            }}
            onPressStart={() => {
                setCourseView(false);
                setShowCheckIn(false)
                setStepIndex(0)
                setLeassonView(true);
            }}
            onBackPress={() => {
                setCourseView(false);
                getAllCourses()
                setTrainingView(true)
            }}
            onQuizPress = {(value) =>{
                openQuiz(value)
            }}
            onItemPress={openLesson}
            couse_id={courseId}
            user_data = {userData}
            courseProgress = {courseLessons}
        />
    }
    const renderTermsView = () => {
        return <TermsKnow onBackPress={() => {
            setCourseView(true);
            setTermsView(false)
        }}
            onPressStart={() => {
                setTermsView(false);
                setShowCheckIn(false)
                setStepIndex(0)
                setLeassonView(true);
            }}
            couse_id={courseId} />
    }
    const renderLeassonView = () => {
        return <LeassonPage
            onBackPress={() => {
                setLeassonView(false)
                setCourseView(true)
            }}
            onPressDashboard={(value) => {
                if (value === ConstantValues.BACK_TO_DASHBOARD) {
                    setLeassonView(false);
                    setCourseView(true);
                    setTermsView(false);
                    setTrainingView(false);
                } else if (value === ConstantValues.BACK_TO_TRAINING_COURSES) {
                    setLeassonView(false);
                    setLessonTwoView(false);
                    setTermsView(false);
                    getAllCourses()
                    setTrainingView(true);
                }
                else {
                    setLeassonView(false);
                    setLessonTwoView(true);
                    setTermsView(false);
                    setTrainingView(false);
                }
            }}
            onPressReview={(value) => {
                setLeassonView(false);
                setCourseView(true);
                setTermsView(false);
                setTrainingView(false);

            }}
            isShowQuizView={enableQuizView}
            onPressContinue={() => { }}
            onItemData={lessonData}
            couse_id={courseId}
            lessonList={lessonList}
            lessonNumber={lessonNumber - 1}
            saveCourseActivity = {saveCourseActivity}
            quizList = {quizList}
            courseTitle = {courseData.title}
            groupPresentationType = {courseList.groupPresentationType ?? 'Accordion'}
            openQuiz = {openQuiz}
            stepIndex = {stepIndex}
            showCheckIn = {showCheckIn}
        />
    }

    const renderLessonTwoView = () => {
        return <LessonTwoDashboard
            onBackPress={() => {
                setCourseView(true);
                setLessonTwoView(false);
                setQuizView(false);
            }}
            onNext={() => {
                setCourseView(true);
                setLessonTwoView(false);
                setQuizView(false);
            }} onPressDashboard={() => {
                setLessonTwoView(false);
                setCourseView(true);
            }}
        />
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>

            <View style={{ flex: 1 }}>
                {enableTrainingView && renderTrainingDashboardView()}
                {enableCourseView && renderCourseDashboardView()}
                {enableTermsView && renderTermsView()}
                {enableLeassonView && renderLeassonView()}
                {enableLessonTwoView && renderLessonTwoView()}
                {enableQuizView && <QuizView
                    quizData={quizData}
                    courseData = {courseData}
                    userData = {userData}
                    onPressDashboard={(value) => {
                        if (value === ConstantValues.BACK_TO_TRAINING_COURSES) {
                            setQuizView(false);
                            if(Platform.OS == 'android'){
                                getAllCourses()
                                setTrainingView(true);
                            }else{
                                setTimeout(() => {
                                    getAllCourses()
                                    setTrainingView(true);
                                }, 500);
                            }                            
                        } else {
                            setQuizView(false);
                            if(Platform.OS == 'android'){
                                setCourseView(true);
                            }else{
                                setTimeout(() => {
                                    setCourseView(true);
                                }, 500);
                            }
                            
                        }

                    }}
                    onPressContinue={() => {
                        setLeassonCheckIn(false);
                        setEnableQuiz(true);
                    }}
                    onBackPress={() => {
                        setQuizView(false);
                        setCourseView(true)
                    }}
                />}
            </View>
            {isLoading && <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={colors.COLOR_THEME}
            />}

        </SafeAreaView>
    )

}
export default TrainingDashboard;