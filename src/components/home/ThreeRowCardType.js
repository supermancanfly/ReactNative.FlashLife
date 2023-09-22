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
import { SvgXml } from 'react-native-svg';
import ArrowRight from '../../assets/svg/ArrowRight.svg';
import Down from '../../assets/svg/Down.svg';
// 
export default function ThreeRowCardType({ item, index, cardstyle, header_background_color, onPress,
    onUpdateFeedContent, onFileDownload, onOpenMailApp }) {
    
    return (
        <TouchableOpacity style={cardstyle}
            onPress={
                // item.card_interaction == "content_feed_action"?
                //  ()=>onUpdateFeedContent(item)0.32.
                //  :null
                //   ()=>  console.log("press")

                () => onPress(item)
                // item.action_type_id == 10 ? () => onFileDownload(item)
                //  : item.action_type_id==2?  ()=>onOpenMailApp(item) : () => onUpdateFeedContent(item)

            }
            disabled={
                item.card_interaction &&
                    item.card_interaction != "content_feed_close" &&
                    item.card_interaction != "content_feed_acknowledge" &&
                    item.card_interaction != "content_feed_info" &&
                    item.card_interaction != "Array" &&
                   
                    item.card_interaction != ""

                    ?
                    true
                    :
                    false
            }
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
                    color: colors.COLOR_BLACK,
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
                            <TouchableOpacity>
                                {item.card_action == 10 &&
                                    // <Image
                                    //     source={Constantimages.download_icon}
                                    //     style={{
                                    //         height: 25,
                                    //         width: 25,
                                    //         resizeMode: 'contain',

                                    //     }}
                                    // >
                                    // </Image>
                                    
                                    <View pointerEvents="none">
                                    <SvgXml width="20"
                                        height="20"
                                        xml={Down} />
                                </View>
                                }

                            </TouchableOpacity>
                            :
                            null
                        }



                        {/* {item.action_text != "" ?
                            <Image
                                source={Constantimages.arrow_right_icon}
                                style={{
                                    height: 25,
                                    width: 25,
                                    resizeMode: 'contain',
                                    tintColor: colors.GREY_COLOR

                                }}
                            >
                            </Image>
                            :
                            null
                        } */}
                    </View>
                }


            </View>
            <View style={{
                alignItems: 'center', justifyContent: 'center',
            }}>


                <Image
                    source={Constantimages.arrow_right_icon}
                    style={{
                        height: 25,
                        alignSelf: 'flex-end',
                        resizeMode: 'contain',
                        tintColor: colors.COLOR_BLACK
                    }}
                >
                </Image>
                 {/* <SvgXml width="25" 
                        height="25" 
                        xml={ArrowRight} /> */}
            </View>

            {/* {item.card_interaction == "content_feed_close" ?
                <View style={{
                }}>
                    <ImageBackground
                        source={Constantimages.elipse_icon}
                        style={styles.imageContainer}
                    >
                        <Image
                            source={Constantimages.close_icon}
                            style={styles.closeIcon}
                        >
                        </Image>
                    </ImageBackground>

                </View>
                :
                <View style={{
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    {item.content_type == 3 ?
                      
                        <Image
                            source={Constantimages.arrow_right_icon}
                            style={{
                                height: 20,
                                alignSelf: 'flex-end',
                                resizeMode: 'contain',
                                tintColor: colors.COLOR_BLACK
                            }}
                        >
                        </Image>
                        :
                        <View style={{
                        }}>

                           
                            {item.day != "" && item.content_type != 8
                                && item.content_type != 14 ?

                                <View>
                                    {item.notificationImage != "" ?
                                        <Image
                                            source={
                                                {
                                                    uri:
                                                        item.day != "" ?
                                                            item.notificationImage
                                                            : null
                                                }}
                                            style={{
                                                height: 90,
                                                width: 100,
                                                resizeMode: 'contain',
                                                alignSelf: 'flex-end',
                                                borderRadius: 8

                                            }}
                                        ></Image>
                                        :
                                        <View

                                            style={{
                                                height: 90,
                                                width: 100,
                                                borderRadius: 8,

                                                backgroundColor: item.color

                                            }}
                                        >
                                        </View>
                                    }
                                </View>


                                :
                                item.content_type == 14 ?
                                   
                                    <TouchableOpacity onPress={() => {
                                        onPress(item)
                                    }}>
                                        <Image
                                            source={item.isActive ? Constantimages.arrowup_icon : Constantimages.arrow_right_icon}
                                            style={{
                                                height: 30,

                                                resizeMode: 'contain',
                                                alignSelf: 'center',
                                                tintColor: colors.GREY_COLOR

                                            }}
                                        >
                                        </Image>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => {
                                        onPress(item)
                                    }}>

                                        {item.isActive ?
                                            <Image
                                                source={Constantimages.checked_new_icon}
                                                style={{
                                                    height: 24,
                                                    resizeMode: 'contain',
                                                    alignSelf: 'center',


                                                }}
                                            >
                                            </Image>

                                            :
                                            <Image
                                                source={Constantimages.unchecked_new_icon}
                                                style={{
                                                    height: 24,
                                                    resizeMode: 'contain',
                                                    alignSelf: 'center',


                                                }}
                                            >
                                            </Image>
                                        }
                                    </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
            } */}
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
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        tintColor: colors.GREY_COLOR

    },
    closeIcon: {
        height: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: colors.GREY_COLOR
    }
});
