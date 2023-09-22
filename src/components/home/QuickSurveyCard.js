import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import { SvgXml } from 'react-native-svg';
// import Darkerinfo from '../../assets/svg/Darkerinfo.svg';
import EllipseCheckIn from '../../assets/svg/EllipseCheckIn.svg';
import EllipseUncheck from '../../assets/svg/EllipseUncheck.svg';
import EllipseClose from '../../assets/svg/EllipseClose.svg';
import Darkerinfo from '../../assets/svg/Darkerinfo.svg';
export default function QuickSurveyCard({ item,
    cardstyle,
    list,
    header_background_color,
    action_button_background, onSubmitPress, mainitem,
    onCheckRatingValue, landingData, toolTipVisible, setToolTipVisible, onOpenMailApp, onUpdateFeedContent, onCreateSurvey, onOpenToolTipInfo }) {
    // console.log("QuickSurveyCard Items", item);
    return (
        <View style={cardstyle}>
            <View style={{
                justifyContent: 'center',
                flex: 1
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={Constantimages.user_survey_icon}
                            style={{
                                resizeMode: 'contain',
                                width: 20,
                                height: 20
                            }}
                        >
                        </Image>
                        <Text style={{
                            paddingLeft: 6,
                            color: "#6FAA19",
                            fontSize: 12,
                            fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            fontWeight: '400'
                        }}>
                            {item.headertitle}</Text>
                    </View>
                    {item.card_interaction == "content_feed_close" &&
                        <TouchableOpacity style={{
                        }} onPress={() => onUpdateFeedContent(item)}>
                            <View pointerEvents="none">
                                <SvgXml width="20"
                                    height="20"
                                    xml={EllipseClose} />


                            </View>
                        </TouchableOpacity>
                    }
                    {item.card_interaction == "content_feed_info" &&
                        <TouchableOpacity style={{
                        }} onPress={() => setToolTipVisible(item)}>

                            <Tooltip
                                animated={true}
                                isVisible={item.istooltipvisible}
                                contentStyle={
                                    {
                                        alignSelf: 'flex-end',
                                        justifyContent: 'center',
                                    }
                                }
                                content={
                                    <View style={{
                                        marginHorizontal: 10,
                                        borderRadius: 12
                                    }}>

                                        <Text style={{
                                            fontWeight: 'bold', fontSize: 14,
                                            color: colors.COLOR_BLACK, paddingVertical: 5
                                        }}>
                                            {landingData.card_info_heading}</Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: colors.GREY_COLOR,
                                            //  paddingBottom: 5,
                                            lineHeight: 18
                                        }}>
                                            {landingData.card_info_text}</Text>
                                    </View>
                                }
                                placement='bottom'
                                onClose={() => onOpenToolTipInfo(item)}
                            >
                                <View pointerEvents="none">

                                    <SvgXml width="20"
                                        height="20"
                                        xml={Darkerinfo} />
                                </View>
                            </Tooltip>
                        </TouchableOpacity>
                    }
                    {item.card_interaction == "content_feed_acknowledge" &&
                        <TouchableOpacity
                            onPress={() => onUpdateFeedContent(item)}
                        >
                            {item.isActive ?
                                <View pointerEvents="none">
                                    <SvgXml width="20"
                                        height="20"
                                        xml={EllipseCheckIn} />
                                </View>
                                :
                                <View pointerEvents="none">
                                    <SvgXml width="20"
                                        height="20"
                                        xml={EllipseUncheck} />
                                </View>
                            }
                        </TouchableOpacity>
                    }
                    {item.card_interaction == "like" &&
                        <></>
                    }

                </View>
                <Text style={{
                    flex: 1, fontWeight: 'bold', flexWrap: 'wrap',
                    fontSize: 16, paddingTop: 8
                }}>
                    {item.survey_details.question_text}

                </Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{
                            marginBottom: 17, marginTop: 12,
                        }}
                    >
                        {item != null && item.serveyList.map((subitem, index) => (
                            <View key={index}
                                style={{
                                    // flex:1,
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                                }}>
                                <TouchableOpacity
                                    source={Constantimages.elipse_icon}
                                    style={{
                                        flex: 1,
                                        resizeMode: 'contain',
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: subitem.isActive ? header_background_color : "#F2F3F5"
                                    }}
                                    onPress={() => {
                                        onCheckRatingValue(item, subitem)
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        alignSelf: 'center',
                                        color: subitem.isActive ? colors.COLOR_WHITE : colors.COLOR_BLACK
                                    }}>{subitem.value}</Text>
                                </TouchableOpacity>
                                {list.length - 1 != index &&
                                    <View style={{
                                        height: 1,
                                        width: 10,
                                        backgroundColor: colors.GREY_COLOR,
                                        alignSelf: 'center'
                                    }}></View>
                                }
                            </View>
                        ))}

                    </ScrollView>
                </View>
                <TouchableOpacity style={[{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: mainitem.isActive ? header_background_color : action_button_background,
                    borderRadius: 5,
                    elevation: 5,
                    alignSelf: 'center',
                    height: 56,
                    // marginHorizontal: 15,
                    borderRadius: 5,
                    // marginBottom: 16
                }]}
                    //  onPress={onSubmitPress}
                    onPress={() => onCreateSurvey(item)}
                >
                    <View style={{ flex: 0.3 }}>

                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[{
                            fontSize: 16,
                            color: colors.COLOR_WHITE,
                            textAlign: 'center',
                            paddingHorizontal: 25,
                            paddingVertical: 15
                        }]}>{mainitem.isActive ? "Submitted" : "Submit Answer"}</Text>
                    </View>
                    <View style={{ flex: 0.3, alignItems: 'flex-end', marginRight: 10 }}>
                        <Image
                            source={
                                mainitem.isActive ? Constantimages.tick_icon : null

                            }
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: colors.COLOR_WHITE
                            }
                            }
                        />
                    </View>

                </TouchableOpacity>

            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        height: 19,
        width: 19,
        // borderRadius: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        tintColor: colors.GREY_COLOR
    },
    closeIcon: {
        height: 24 / 2,
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: colors.GREY_COLOR
    }
});
