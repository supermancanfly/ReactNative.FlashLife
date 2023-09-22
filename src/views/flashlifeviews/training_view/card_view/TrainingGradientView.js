import React from "react";
import { Dimensions, Platform, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "./ProgressIndicatorView";

const TrainingGradientView = ({ title, description, pointsEarned, userCourses, fromScreen, lessonsTotal, lessonCompleted }) => {

    const earnedPointsView = () => {
        return <View style={{
            flexDirection: 'row',
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 10,
            padding: 30,
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: -50,
            left: 10,
            right: 10,
        }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>{pointsEarned}</Text>
                <Text style={{
                    fontSize: 13,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>Points earned</Text>
            </View>
            <View style={{ width: 2, height: '100%', backgroundColor: '#00C193' }}></View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>{userCourses.completed}/{userCourses.total}</Text>
                <Text style={{
                    fontSize: 13,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>Courses completed</Text>
            </View>
        </View>
    }

    const leassonCompleteView = () => {
        return <View style={{
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 10,
            padding: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: -40,
            left: 10,
            right: 10
        }}>
            <Text style={{
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                fontSize: 25,
                color: colors.COLOR_THEME
            }}>{`${lessonCompleted}/${lessonsTotal}`}</Text>
            <Text style={{
                fontSize: fontsProps.md,
                color: '#B8B8B8',
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",

            }}>Lessons completed</Text>
            <ProgressIndicatorView
                style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 30 }}
                sections={lessonsTotal}
                earnedPoints={lessonCompleted}
            />
        </View>
    }
    return (
        <View>
            <LinearGradient
                colors={['rgba(139, 212, 31, 1)', 'rgba(0, 193, 147, 1)']}
                style={{
                    borderRadius: 10,
                    padding: 15,
                    paddingBottom: 70,
                }}>
                <Text style={{
                    fontSize: 25,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                }}>{title}</Text>
                <Text style={{
                    fontSize: 14,
                    marginVertical: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>{description}</Text>
            </LinearGradient>
            {(fromScreen === ConstantValues.TRAINING_STR) ? earnedPointsView() : leassonCompleteView()}
        </View>
    )

}
export default TrainingGradientView;