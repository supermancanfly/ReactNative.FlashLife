import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import CourseCompletedPopup from "../popup_view/CourseCompletedPopup";
import LeassonCompletedPopup from "../popup_view/LeassonCompletedPopup";

const LeassonCheckIn = ({ onPressDashboard, onPressContinue, textFrom ,onItemData, lessonList ,lessonNumber , courseTitle, onPressDoLessonAgain }) => {
    const [isShowPopup, setPopup] = useState(false);
    const [isLeassonCompleted, setLeassonCompleted] = useState(false);
    const [isCourseCompleted, setCourseCompleted] = useState(false);
    const[checkInData,setCheckInData]=useState([])
    const[trueValue,setTrueValue]=useState()
    const[message,setMessage]=useState({})
    console.log(message)
    
    console.log(trueValue)
    useEffect(()=>{
        let checkInArray=[];
        const data=onItemData.lessonCheckInItems
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            checkInArray.push(element)
            
        }
       setCheckInData(checkInArray)
    },[trueValue])
  

    const answerValueFtn=(item)=>{

        if(item.answerValue===trueValue){
                setLeassonCompleted(false);
               setPopup(true);
               setMessage(item)

        }else{
                setLeassonCompleted(true);
               setPopup(true);
               setMessage(item)

        }
       
       
    }
    const answerFalseValueFtn=(item)=>{

        if(item.answerValue===trueValue){
                setLeassonCompleted(true);
               setPopup(true);
               setMessage(item)

        }else{
                setLeassonCompleted(false);
               setPopup(true);
               setMessage(item)

        }
       
       
    }
    
   
    const buttonsView = (item) => {
        
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 15
        }}>
            <TouchableOpacity onPress={() => {
                if(item.answerValue == true){
                    setLeassonCompleted(true)
                }
                else{
                    setLeassonCompleted(false)
                }
                setMessage(item)
                setPopup(true)
                // setTrueValue(true)  
                // answerValueFtn(item)
                // setLeassonCompleted(false);
                // setPopup(true); 
            }}
                style={styles.button_style}>
                <Text style={{
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                if(item.answerValue == false){
                    setLeassonCompleted(true)
                }
                else{
                    setLeassonCompleted(false)
                }
                setMessage(item)
                setPopup(true)
            }}
                style={styles.button_style}>
                <Text style={{
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>False</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, marginBottom: 60 }}>
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
                        fontSize: fontsProps.sm,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{textFrom}</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Is the following statement true or false?</Text>
                    {checkInData.map((item,index)=>{
                        return(
                            <View key={index} >
                                 <Text style={{
                                fontSize: fontsProps.md,
                                marginVertical: 5,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                            }}>{item.question}</Text>
                                {buttonsView(item)}

                            </View>
                        )
                    })}
                    {/* {buttonsView()} */}
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.md,
                        marginTop: 10,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Medium",
                    }}>{'DON’T KNOW THE ANSWER?'}</Text>
                    <TouchableOpacity
                        onPress={onPressDoLessonAgain}
                    >
                        <Text style={{
                            color: '#DC143C',
                            fontSize: fontsProps.md,
                            textDecorationLine: 'underline',
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Medium",
                        }}>GO BACK AND DO THE LESSON AGAIN.</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <LeassonCompletedPopup
                isVisible={isShowPopup}
                isCorrectValue={isLeassonCompleted}
                textMessage={!isLeassonCompleted? 'In correct' : message.successMessage}
                onPress={() => {
                    setPopup(!isShowPopup)
                    if(isLeassonCompleted){
                        setCourseCompleted(true)
                    }
                }}
            />
            <CourseCompletedPopup
                isVisible={isCourseCompleted}
                onPress={() => setCourseCompleted(!isCourseCompleted)}
                isLeassonCompleted={true}
                lessonNumber = {onItemData.lessonNumber}
                lessonTitle = {onItemData.title}
                currentLessonNumber = {onItemData.lessonNumber}
                nextTitle = {lessonList.length == (lessonNumber + 1) ? `${courseTitle} + Quiz` : `Lesson ${lessonNumber + 2} - ${lessonList[lessonNumber + 1].title}`}
                onDashboard={(value) => {
                    setCourseCompleted(false);
                    if(Platform.OS == 'android'){
                        onPressDashboard(value);
                    }else{
                        setTimeout(() => {
                            onPressDashboard(value);
                        },500);
                    }                    
                }}
                onPressContinue={(value) => {
                    setCourseCompleted(false);
                    if(Platform.OS == 'android'){
                        onPressContinue(value);
                    }else{
                        setTimeout(() => {
                            onPressContinue(value);
                        },500);
                    }
                }}
            />
        </View>
    )

}
export default LeassonCheckIn;

const styles = StyleSheet.create({
    button_style: {
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 7,
        marginHorizontal: 5,
        justifyContent: 'center'
    }
})