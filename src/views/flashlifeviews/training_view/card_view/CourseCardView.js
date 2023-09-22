import React from "react";
import { Platform, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "./ProgressIndicatorView";
import LockFill from '../../../../assets/svg/LockFill.svg';
import LockCircle from '../../../../assets/svg/LockCircle.svg';
import GoodJob from '../../../../assets/svg/GoodJob.svg';
import CircleArrowRight from '../../../../assets/svg/CircleArrowRight.svg'
const CourseCardView = props => {
    const { item } = props;

    const iconsView = () => {
        
        if (item.status === 'completed') {
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={GoodJob} />
            </View>
        }else if(item.lessonNumber == 1){
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={CircleArrowRight} />
            </View>
        } else if (item.status === 'locked') {
            return <View pointerEvents="none">
                <SvgXml height={30}
                    width={30}
                    fill={colors.COLOR_BLACK}
                    xml={LockCircle} />
            </View>
        }else if (item.unlock) {
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
        } else if(item.status === 'in_progress' || item.status === 'open'){
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
                        flex: 1,
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Lesson {item.lessonNumber}</Text>
                    <Text style={{
                        fontSize: fontsProps.sm,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{item.title}</Text>
                </View>
                {iconsView()}
            </View>
            <ProgressIndicatorView
                style={{
                    flexDirection: 'row',
                    marginVertical: 5
                }}
                sections={item.progress?.total ?? 0}
                earnedPoints={item.progress?.completed ?? 0}
            />
        </View>
    )
}

export default CourseCardView;