import React from "react";
import { Platform, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "./ProgressIndicatorView";
import LockFill from '../../../../assets/svg/LockFill.svg';
import LockCircle from '../../../../assets/svg/LockCircle.svg';
import GoodJob from '../../../../assets/svg/GoodJob.svg';
import CircleArrowRight from '../../../../assets/svg/CircleArrowRight.svg'
const QuizCardView = ({ item , isQuizable}) => {
    // console.log("6pm6pm",item)

    const iconsView = () => {
        if (item.leassonComplete) {
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={GoodJob} />
            </View>
        }  else if (item.unlock) {
            return <View style={{
                backgroundColor: '#B8B8B8',
                borderRadius: 20,
                paddingHorizontal: 7,
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: colors.COLOR_WHITE,
                    fontSize: fontsProps.sm,
                    marginHorizontal: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                }}>100 Points</Text>
                <View pointerEvents="none">
                    <SvgXml height={20}
                        width={20}
                        fill={colors.COLOR_BLACK}
                        xml={LockFill} />
                </View>
            </View>
        } else if (isQuizable) {
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={CircleArrowRight} />
            </View>
        }
        else{
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={LockCircle} />
            </View>
        }
    }
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                flexGrow: 1,
                marginRight: 10
            }}>
                <View
                    style = {{
                        flex : 1
                    }}
                >

                    <Text style={{
                        flex:1,
                        fontSize: fontsProps.lg,
                        paddingRight:5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{item.name}</Text>
                    <Text style={{
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{item.title}</Text>
                    </View>
                {iconsView()}
            </View>
            {/* <ProgressIndicatorView
                style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}
                sections={item.quizQuestions.length}
                earnedPoints={0}
            /> */}
        </View>
    )
}

export default QuizCardView;