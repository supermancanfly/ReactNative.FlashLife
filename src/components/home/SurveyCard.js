import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Platform
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import DropdownButton from '../../utils/DropdownButton';
import DropDownFloatingList from '../../utils/DropDownFloatingList';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SvgXml } from 'react-native-svg';
import Darkerinfo from '../../assets/svg/Darkerinfo.svg';
export default function SurveyCard({ mainitem, cardstyle, header_background_color, list, headervisible,
    listitemselected,
    onPressHeader, itemPress,
    onCheckCircleValue, landingData, toolTipVisible, setToolTipVisible,
    onOpenMailApp,
    onUpdateFeedContent, onCreateSurvey, onOpenToolTipInfo }) {
    // console.log("SurveyCard ------------------------------item.serveyList" + JSON.stringify(list))

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
                        {/* <Image
                            source={Constantimages.user_survey_icon}
                            style={{
                                resizeMode: 'contain',
                                width: 20,
                                height: 20
                            }}
                        >
                        </Image> */}
                        <SvgXml width="20"
                            height="20"
                            xml={mainitem.icon} />
                        <Text style={{
                            paddingLeft: 6,
                            color: "#6FAA19",
                            // 
                            // #8BD41F
                            fontSize: 12,
                            fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            // fontWeight: '400'
                            fontWeight: '700',
                        }}>
                            {mainitem.headertitle}</Text>
                    </View>
                    {/* <TouchableOpacity
                        onPress={()=>setToolTipVisible(item)}
                        
                        style={{
                        }}>
                        <ImageBackground
                            source={Constantimages.info_circle_icon}
                            style={styles.imageContainer}

                        >

                        </ImageBackground>

                    </TouchableOpacity> */}

                    {mainitem.card_interaction == "content_feed_close" &&
                        <TouchableOpacity style={{
                        }} onPress={() => onUpdateFeedContent(mainitem)}>
                            {/* <ImageBackground
                                source={Constantimages.elipse_icon}
                                style={{height: 24,
                                    width: 24,
                                    borderRadius: 24 / 2,
                                    resizeMode: 'contain',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'center',
                                    tintColor: colors.GREY_COLOR}}
                            >
                                <Image
                                    source={Constantimages.close_icon}
                                    style={styles.closeIcon}
                                >
                                </Image>
                            </ImageBackground> */}
                            <View pointerEvents="none">
                                <SvgXml width="20"
                                    height="20"
                                    xml={EllipseClose} />


                            </View>
                        </TouchableOpacity>
                    }
                    {mainitem.card_interaction == "content_feed_info" &&
                        <TouchableOpacity style={{
                        }} onPress={() => setToolTipVisible(mainitem)}>
                            {/* <ImageBackground
                                source={Constantimages.info_circle_icon}
                                style={styles.imageContainer}
                            >
                            </ImageBackground> */}
                            <Tooltip
                                animated={true}
                                isVisible={mainitem.istooltipvisible}
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
                                            // paddingBottom: 5,
                                            lineHeight: 18
                                        }}>
                                            {landingData.card_info_text}</Text>
                                    </View>
                                }
                                placement='bottom'
                                onClose={() => onOpenToolTipInfo(mainitem)}
                            >
                                <SvgXml width="20"
                                    height="20"
                                    xml={Darkerinfo} />
                            </Tooltip>

                        </TouchableOpacity>
                    }
                    {mainitem.card_interaction == "content_feed_acknowledge" &&
                        <TouchableOpacity
                            onPress={() => onUpdateFeedContent(mainitem)}
                        >
                            {mainitem.isActive ?
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
                                // <Image
                                //     source={Constantimages.checked_new_icon}
                                //     style={{
                                //         height: 24,
                                //         resizeMode: 'contain',
                                //         alignSelf: 'center',
                                //     }}
                                // >
                                // </Image>
                                // :
                                // <Image
                                //     source={Constantimages.unchecked_new_icon}
                                //     style={{
                                //         height: 24,
                                //         resizeMode: 'contain',
                                //         alignSelf: 'center',


                                //     }}
                                // >
                                // </Image>
                            }
                        </TouchableOpacity>
                    }

                    {/* <Tooltip
                        animated={true}
                        // (Optional) When true,
                        // tooltip will animate in/out when showing/hiding
                        arrowSize={{ width: 16, height: 8 }}
                        // (Optional) Dimensions of arrow bubble pointing
                        // to the highlighted element
                        backgroundColor="rgba(0,0,0,0.5)"
                        // (Optional) Color of the fullscreen background
                        // beneath the tooltip.
                        isVisible={toolTipVisible}
                        // (Must) When true, tooltip is displayed
                        content={
                            <View style={{ marginHorizontal: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.COLOR_BLACK }}>Upload Privacy_survey Info</Text>
                                <Text style={{ fontSize: 12, color: colors.GREY_COLOR }}>your name and file upload action will be recorded in OneDrive and visible to the form owner.</Text>
                            </View>
                        }
                        // (Must) This is the view displayed in the tooltip
                        placement="right"
                        // (Must) top, bottom, left, right, auto.
                        onClose={setToolTipVisible}
                    // (Optional) Callback fired when the user taps the tooltip
                    /> */}

                </View>
                <Text style={{
                    flex: 1, fontWeight: 'bold', flexWrap: 'wrap',
                    fontSize: 16, lineHeight: 20, paddingTop: 8
                }}>{listitemselected ? "Thanks for participating in the survey!" : mainitem.survey_details.question_text}</Text>
                {listitemselected &&
                    <TouchableOpacity style={[{
                        height: 56,
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: header_background_color,
                        borderRadius: 5,
                        elevation: 5,
                        alignSelf: 'center',

                        borderRadius: 5,

                    }]}

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
                            }]}>{"Submitted"}</Text>
                        </View>
                        <View style={{ flex: 0.3, alignItems: 'flex-end', marginRight: 10 }}>
                            <Image
                                source={
                                    Constantimages.tick_icon

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
                }
                <FlatList
                    data={list}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    style={{
                        backgroundColor: colors.COLOR_WHITE,
                        // backgroundColor: 'red',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#E3E3E3",
                        marginTop: 10,

                    }}
                    ListHeaderComponent={

                        !listitemselected &&
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // borderWidth: 1,
                            // backgroundColor: colors.COLOR_WHITE,
                            // borderColor: "#E3E3E3",
                            // borderRadius: 5,
                            paddingHorizontal: 16,
                            marginTop: 10,
                            height: 56,
                        }}
                            onPress={
                                onPressHeader
                            }
                        >
                            <DropDownFloatingList
                                title={"Show"}
                                backcolor={"colors.GREY_COLOR"}
                                headerstyle={{
                                    flexDirection: 'row',
                                    backgroundColor: header_background_color != "" ? header_background_color
                                        : colors.COLOR_THEME,
                                }}
                                headerlogo={Constantimages.flash_header_logo}
                                profilename={"Select an option"}
                                selectedsupporttypevalue={"Select an option"}

                            />
                            <Image source={
                                headervisible ?
                                    Constantimages.arrowup_icon
                                    :
                                    Constantimages.flash_dropdown_icon
                            } style={{
                                height: 17,
                                width: 17,
                                resizeMode: 'contain',
                                alignItems: 'center',
                                tintColor: colors.COLOR_BLACK
                            }} />
                        </TouchableOpacity>


                    }
                    renderItem={({ item, index }) => {
                        if (headervisible) {

                            return (
                                <TouchableOpacity
                                    onPress={
                                        () => { }
                                    }
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                        borderTopWidth: 1,
                                        // backgroundColor: colors.COLOR_WHITE,
                                        borderColor: "#E3E3E3",
                                        paddingVertical: 17,
                                        paddingHorizontal: 16,
                                    }}
                                >

                                    <TouchableOpacity
                                        // onPress={() => onCreateSurvey(mainitem,item)}
                                        onPress={() => {
                                            onCheckCircleValue(mainitem, item)
                                        }}
                                    >
                                        <ImageBackground source={item.isActive ?
                                            Constantimages.checkedcircle_icon
                                            : Constantimages.uncheckedcircle_icon}
                                            style={{
                                                height: 22,
                                                width: 22,
                                                resizeMode: 'contain',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                tintColor: colors.COLOR_BLACK
                                            }} >
                                            <Image source={Constantimages.checked_tick_icon} style={{
                                                height: 17 / 2,
                                                width: 17 / 2,
                                                resizeMode: 'contain',
                                                alignItems: 'center',
                                                tintColor: colors.COLOR_WHITE
                                            }} >
                                            </Image>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    <Text style={{
                                        paddingLeft: 16, fontWeight: '400',
                                        fontSize: 14
                                    }}>{item.date}</Text>
                                </TouchableOpacity>

                            );
                        }
                        else {
                            return null;
                        }
                    }}

                >
                </FlatList>

            </View>

        </View>

    )
}
// QuickSurvey
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
