import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import EllipseCheckIn from '../../assets/svg/EllipseCheckIn.svg';
import EllipseUncheck from '../../assets/svg/EllipseUncheck.svg';
import EllipseClose from '../../assets/svg/EllipseClose.svg';
import Darkerinfo from '../../assets/svg/Darkerinfo.svg';
// Darkerinfo
import Tooltip from 'react-native-walkthrough-tooltip';
import { SvgXml } from 'react-native-svg';
export default function RowTwoCardType({ item, index, cardstyle, header_background_color, onPress,
    setToolTipVisible, onUpdateFeedContent, onOpenMailApp, onOpenToolTipInfo, landingData }) {
    // console.log("RowTwoCardType  landingData" + JSON.stringify(landingData))
    return (
        <TouchableOpacity style={cardstyle}
            onPress={
                () => onPress(item)
                // item.card_interaction == "content_feed_action"?

                // item.action_type_id == 1 ? () =>{console.log("none")} : item.action_type_id==2?()=>onPress(item): ()=>onOpenMailApp(item) ? () => onUpdateFeedContent(item)

                //  :null
            }
            // disabled={item.card_interaction == "content_feed_action"? false:true}
            disabled={
                item.card_interaction &&
                    item.card_interaction != "content_feed_close" &&
                    item.card_interaction != "content_feed_acknowledge" &&
                    item.card_interaction != "content_feed_info" &&
                    item.card_interaction != ""

                    ?
                    true
                    :
                    false}
        >
            <View style={{
                justifyContent: 'center',
                flex: 1
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {/* <Image
                        source={item.icon}
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20
                        }}
                    >
                    </Image> */}
                    <View pointerEvents="none">
                        <SvgXml width="20"
                            height="20"
                            xml={item.icon} />
                    </View>
                    <Text style={{
                        paddingLeft: 6,
                        color: item.maincolor,
                        fontSize: 12,
                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                        // fontWeight: '400'
                        fontWeight: '700',
                        // fontWeight:'bold'
                    }}>
                        {item.headertitle}
                    </Text>
                </View>
                <Text style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    fontSize: 16,
                    fontWeight: '700',
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                    paddingTop: 8
                }}>
                    {item.title}
                </Text>
                {(item.action_text != "" || item.card_sub_text) != "" &&
                    <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>
                        {item.card_sub_text != "" &&
                            <Text style={{
                                color: "#60626B",
                                fontSize: 12,
                                fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            }}>{
                                    item.card_sub_text}</Text>
                        }

                        {(item.action_text != "" && item.card_sub_text) != "" &&
                            <Text style={{
                                color: "#60626B",
                                fontSize: 12,
                                fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            }}>{' '}</Text>
                        }
                        {
                            <Text style={{
                                color: "#60626B",
                                fontSize: 12,
                                fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            }}>{
                                    item.action_text}</Text>
                        }
                        {item.action_text != "" ?
                            <Image
                                source={Constantimages.arrow_right_icon}
                                style={{
                                    height: 25,
                                    width: 25,
                                    resizeMode: 'contain',

                                    // tintColor: colors.GREY_COLOR
                                    tintColor: 'red'

                                }}
                            >
                            </Image>
                            :
                            null
                        }
                    </View>
                }
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
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 5
                                }}>
                                    {landingData.card_info_heading}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR,
                                  
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

        </TouchableOpacity>
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
    icon: {
        resizeMode: 'contain',
        width: 20,
        height: 20
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
