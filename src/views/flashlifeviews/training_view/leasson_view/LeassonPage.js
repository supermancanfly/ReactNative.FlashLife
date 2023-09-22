import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Platform } from 'react-native';
import ProgressDialog from "../../../../components/dialogs/ProgressDialog";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import { ApiGetCoursesByCourseId } from "../../../../network/Services";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomTabView from "../../footer_view/BottomTabView";
import TrainingAppbar from "../appbar_view";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
import QuizView from "../quiz_view/QuizView";
import LeassonBasicInfo from "./LeassonBasicInfo";
import LeassonBasicInfoTwo from "./LeassonBasicInfoTwo";
import LeassonCheckIn from "./LeassonCheckIn";
import LessonBasicInfoThree from "./LessonBasicInfoThree";
const questionsPerPage = 1;
const LeassonPage = props => {
    const { lessonList, lessonNumber, courseTitle , stepIndex, showCheckIn, groupPresentationType} = props;
    const { onBackPress, onPressDashboard, onPressContinue, onItemData } = props;
    const [leassonBasicInfo, setLeassonBasicInfo] = useState(false);
    const [leassonCheckIn, setLeassonCheckIn] = useState(false);
    const [itemBody, setItemBody] = useState([]);
    const [isEnableBackButton, setEnableBackButton] = useState(false);
    const [currentLessonData, setCurrentLessonData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(stepIndex + 1);
    const [currentQuestions, setCurrentQuestionsData] = useState();
    const [lessonQuestions, setLessonQuestionData] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [currentLessonNumber, setCurrentLessonNumber] = useState(lessonNumber);
    const [totalLessons, setTotalLessons] = useState(0);
    const [lessonsList, setLessonsList] = useState();
    useEffect(() => {
        if(showCheckIn){
            setLeassonCheckIn(true)
        }
        else{
            setLeassonBasicInfo(true);
        }
        
    }, []);


    useEffect(() => {
        // getItemdata();
        getAllCourses();
    }, []);

    const getAllCourses = async () => {
        // setIsLoading(true)
        // let params = `?courseId=${props.couse_id}`;
        // await ApiGetCoursesByCourseId(params).then((responseJson) => {
        //     setIsLoading(false)
        let assendingList = lessonList.sort((a, b) => a.lessonNumber - b.lessonNumber);
        let _tempList = [];
        for (let index = 0; index < assendingList.length; index++) {
            const element = assendingList[index];
            _tempList.push({
                isLessonComplete: false,
                lessonData: element
            })
        }
        setLessonsList(_tempList);
        bindingLessonData(_tempList);
        setTotalLessons(_tempList);
        // }).catch((e) => {
        //     setIsLoading(false)
        //     console.log("Error", e.toString());
        // })
    }
    const bindingLessonData = list => {
        setCurrentLessonData(list[currentLessonNumber].lessonData);
        const data = list[currentLessonNumber].lessonData.lessonSteps.sort((a, b) => a.stepNumber - b.stepNumber);
        let body = [];
        data.forEach(element => {
            // for (let index = 0; index < element.lessonStepItemGroups.length; index++) {
                
                const newElement = element.lessonStepItemGroups[0];
                // for (let j = 0; j < newElement.lessonStepItemGroupItems.length; j++) {
                //     let element = newElement.lessonStepItemGroupItems[j];
                    
                // }
                body.push(newElement)
            // }
        });
        setItemBody(body);
        updatePageData(body, list[currentLessonNumber].lessonData, currentPage)

    }

    

    // const getItemdata = () => {
    //     const data = onItemData.lessonSteps.sort((a, b) => a.lessonNumber - b.lessonNumber);
    //     let itembody = [];
    //     data.forEach(element => {
    //         for (let index = 0; index < element.lessonStepItemGroups.length; index++) {
    //             const newElement = element.lessonStepItemGroups[index];
    //             for (let j = 0; j < newElement.lessonStepItemGroupItems.length; j++) {
    //                 let element = newElement.lessonStepItemGroupItems[j];
    //                 itembody.push(element)
    //             }
    //         }
    //     });
    //     setItemBody(itembody)
    // }

    const addMoreLessonsData = lessonNumber => {
        if (Number.parseInt(currentLessonNumber) === Number.parseInt(totalLessons)) {
            console.log("equal");
            setIsLoading(false);
            onPressDashboard(ConstantValues.BACK_TO_DASHBOARD);
            return;
        }
        setCurrentLessonData(lessonsList[lessonNumber].lessonData);
        const data = lessonsList[lessonNumber].lessonData.lessonSteps.sort((a, b) => a.stepNumber - b.stepNumber);
        let body = [];
        data.forEach(element => {
            // for (let index = 0; index < element.lessonStepItemGroups.length; index++) {
                const newElement = element.lessonStepItemGroups[0];
                // for (let j = 0; j < newElement.lessonStepItemGroupItems.length; j++) {
                //     let element = newElement.lessonStepItemGroupItems[j];
                //     body.push(element)
                // }
                body.push(newElement)
            // }
        });
        setItemBody(body);
        updatePageData(body, lessonsList[lessonNumber].lessonData, 1);


    }
    const updatePageData = (body, list, pageIndex) => {
        
        const startIndex = (pageIndex - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const _currentQuestions = body.slice(startIndex, endIndex);
        const _lessonQuestions = list.lessonSteps.slice(startIndex, endIndex);
        const _totalPages = Math.ceil(body.length / questionsPerPage);
        setCurrentQuestionsData(_currentQuestions);
        setLessonQuestionData(_lessonQuestions);
        setTotalPages(_totalPages);
        setIsLoading(false);

        // setLeassonBasicInfo(true);
    }

    const handleNextPage = () => {
        // console.log("c t", currentLessonNumber, lessonsList.length - 1);
        console.log(lessonList[currentLessonNumber])
        console.log("QuizList: ",props.quizList)
        console.log("Condition 1: ", Number.parseInt(currentLessonNumber) === Number.parseInt(lessonsList.length - 1) )
        console.log("Condition 2: ", currentPage < totalPages)
        console.log("Condition 3: ", totalPages === currentPage && currentLessonData.lessonCheckInItems.length > 0 )
        console.log("Condition 4: ", totalPages === currentPage )
        console.log("Condition 5: ", currentLessonData.lessonCheckInItems.length > 0 )
        console.log(totalPages, currentPage)

        setIsLoading(true);
        if (currentPage < totalPages) {
            props.saveCourseActivity({
                previous: {
                    type: 'lesson_step',
                    id:  lessonList[currentLessonNumber].lessonSteps[(currentPage - 1)* questionsPerPage]?.lessonStepId
                },
                current: {
                    type: 'lesson_step',
                    id:  lessonList[currentLessonNumber].lessonSteps[(currentPage)* questionsPerPage]?.lessonStepId
                }
            }).then(result =>{
                setIsLoading(false);
                updatePageData(itemBody, currentLessonData, currentPage + 1);
                setEnableBackButton(true);
                setCurrentPage(currentPage + 1);
            }).catch(e =>{
                setIsLoading(false);
                console.log(e.toString())
            })

            
            return;
        }

        if (totalPages === currentPage && currentLessonData.lessonCheckInItems.length > 0) {
            props.saveCourseActivity({
                previous: {
                    type: 'lesson_step',
                    id: lessonList[currentLessonNumber].lessonSteps[(currentPage - 1)* questionsPerPage]?.lessonStepId
                },
                current: {
                    type: 'lesson_checkin',
                    id: currentLessonData.lessonCheckInItems[0].lessonCheckInItemId
                }
            }).then(result =>{
                setIsLoading(false);
                setLeassonBasicInfo(false)
                setLeassonCheckIn(true);
            }).catch(e =>{
                setIsLoading(false);
                console.log(e.toString())
            })

            
            return;
        } else {
            if (Number.parseInt(currentLessonNumber) === Number.parseInt(lessonsList.length - 1)) {
                props.saveCourseActivity({
                    previous: {
                        type: 'lesson_step',
                        id: lessonList[currentLessonNumber].lessonSteps[(currentPage - 1)* questionsPerPage]?.lessonStepId
                    },
                    current: lessonList[currentLessonNumber].lessonCheckInItems.length > 0 ? {
                        type: 'lesson_checkin',
                        id: lessonList[currentLessonNumber].lessonCheckInItems[0].lessonCheckInItemId
                    } :
                    props.quizList.length ? {
                        type: 'quiz',
                        id: props.quizList[0].quizId
                    } : {}
                }).then(result =>{
                    setIsLoading(false);
                    if(props.quizList.length){
                        props.openQuiz(props.quizList[0])
                    }
                    else{
                        onPressDashboard(ConstantValues.BACK_TO_DASHBOARD);
                    }
                    
                }).catch(e =>{
                    setIsLoading(false);
                    console.log(e.toString())
                })
               
                return;
            }
            else{
                props.saveCourseActivity({
                    previous: {
                        type: 'lesson_step',
                        id: lessonList[currentLessonNumber].lessonSteps[(currentPage - 1)* questionsPerPage]?.lessonStepId
                    },
                    current: {
                        type: 'lesson_step',
                        id: lessonList[currentLessonNumber + 1].lessonSteps[0].lessonStepId
                    }
                }).then(result =>{
                    setIsLoading(false);
                    setLeassonCheckIn(false);
                    setIsLoading(true);
                    setCurrentLessonData([]);
                    setCurrentQuestionsData([]);
                    setLessonQuestionData([]);
                    setTotalPages();
                    setCurrentPage(1);
                    setEnableBackButton(false);
                    setCurrentLessonNumber(currentLessonNumber + 1);
                    addMoreLessonsData(currentLessonNumber + 1);
                }).catch(e =>{
                    setIsLoading(false);
                    console.log(e.toString())
                })
    
                
                return;
            }
           
        }
    };
    const onPreviousPage = () => {
        if (currentPage > 1) {
            let value = currentPage - 1;
            updatePageData(itemBody, currentLessonData, value);
            if (value == 1) {
                setEnableBackButton(false);
            }
            setCurrentPage(value);
        }
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2',
        }}>
            <TrainingAppbar
                title={'Lesson'}
                isShowBack={true}
                onBackPress={onBackPress}
            />
            {currentLessonData && <View style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#EAEDF2'
            }}>
                {leassonBasicInfo && <LeassonBasicInfo
                    onItemData={currentQuestions}
                    sections={currentLessonData?.lessonSteps?.length ?? 0}
                    earnedPoints={currentPage}
                    courseTitle = {courseTitle}
                    lessonTitle={lessonQuestions}
                    lessonNum={currentLessonData.lessonNumber}
                    subTitle={currentLessonData.title}
                    lessonName = {currentLessonData.name}
                    onBack={onPreviousPage}
                    onNext={handleNextPage}
                    backButtonEnable={isEnableBackButton}
                />}


                {leassonCheckIn && <LeassonCheckIn
                    onItemData={currentLessonData}
                    textFrom={`'LESSON ${currentLessonData.lessonNumber}: LESSON CHECK-IN'`}
                    onPressDashboard={(value) => {
                        setIsLoading(true);
                        props.saveCourseActivity({
                            previous: {
                                type: 'lesson_checkin',
                                id: currentLessonData.lessonCheckInItems[0].lessonCheckInItemId
                            },
                            current: {}
                        }).then(() =>{
                            setIsLoading(false);
                            onPressDashboard(value)
                        }).catch(e =>{
                            setIsLoading(false);
                        })
                        
                    }}
                    onPressContinue={(value) => {
                        setIsLoading(true);
                        if (Number.parseInt(currentLessonNumber) === Number.parseInt(lessonsList.length - 1)) {
                            props.saveCourseActivity({
                                previous: {
                                    type: 'lesson_checkin',
                                    id: currentLessonData.lessonCheckInItems[0].lessonCheckInItemId
                                },
                                current: props.quizList.length ? {
                                    type: 'quiz',
                                    id: props.quizList[0].quizId
                                } : {}
                            }).then(result =>{
                                setIsLoading(false);
                                if(props.quizList.length){
                                    props.openQuiz(props.quizList[0])
                                }
                                else{
                                    onPressDashboard(ConstantValues.BACK_TO_DASHBOARD);
                                }
                                
                            }).catch(e =>{
                                setIsLoading(false);
                                console.log(e.toString())
                            })
                           
                        }
                        else{
                            props.saveCourseActivity({
                                previous: {
                                    type: 'lesson_checkin',
                                    id: currentLessonData.lessonCheckInItems[0].lessonCheckInItemId
                                },
                                current: {
                                    type: 'lesson_step',
                                    id: lessonList[currentLessonNumber + 1].lessonSteps[0].lessonStepId
                                }
                            }).then(result =>{
                                
                                setLeassonCheckIn(false);
                                setIsLoading(true);
                                // onPressDashboard(value);
                                setCurrentLessonData([]);
                                setCurrentQuestionsData([]);
                                setLessonQuestionData([]);
                                setTotalPages();
                                setCurrentPage(1);
                                setEnableBackButton(false);
                                setCurrentLessonNumber(currentLessonNumber + 1);
                                addMoreLessonsData(currentLessonNumber + 1)
                                setLeassonBasicInfo(true)
                            }).catch(e =>{
                                setIsLoading(false);
                                console.log(e.toString())
                            })
                        }
                        
                        
                    }}
                    lessonList = {lessonList} lessonNumber = {currentLessonNumber} courseTitle = {courseTitle}
                    onPressDoLessonAgain = {() =>{
                        setLeassonCheckIn(false)
                        setCurrentPage(1)
                        setLeassonBasicInfo(true)
                        console.log("Hello, Lets do lesson again!")
                    }}
                />}
            </View>}

            {isLoading && <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={colors.COLOR_THEME}
            />}
        </SafeAreaView>
    )

}
export default LeassonPage;