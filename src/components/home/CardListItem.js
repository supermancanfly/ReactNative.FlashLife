import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
export default function CardListItem({ item, index, cardstyle, header_background_color, onPress }) {
    // console.log("title   card_sub_text" + item.card_sub_text + "----------" + item.headertitle)
    return (
        <View style={cardstyle}>
            <View style={{
                justifyContent: 'center',
                flex: 1
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image
                        source={item.icon}
                        // style={styles.icon}
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            // tintColor:item.color,
                            height: 20
                        }}

                    >
                    </Image>
                    <Text style={{ paddingLeft: 6, color: item.maincolor, fontWeight: '700' }}>
                        {item.headertitle}

                    </Text>
                </View>
                <Text style={{
                    flex: 1,
                    fontWeight: 'bold',
                    flexWrap: 'wrap',
                    fontSize: 16,

                    paddingTop: 8
                }}>
                    {item.title}
                </Text>
                {/* action_text: responseJson[i].action_text, */}

                {(item.action_text != "" || item.card_sub_text) != "" &&
                    <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>
                        {item.card_sub_text != "" &&
                            <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>{
                                item.card_sub_text}</Text>
                        }

                        {(item.action_text != "" && item.card_sub_text) != "" &&
                            <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>{' '}</Text>
                        }
                        {
                            <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>{
                                item.action_text}</Text>
                        }
                        {item.action_text != "" ?
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
                        }
                    </View>
                }

                {/* {item.content_type == 8 &&
                    // 
                    <View style={{
                        flexDirection: 'row', paddingTop: 8,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>
                            {item.subtitle != "" && item.subtitle}

                        </Text>

                    </View>
                } */}
            </View>
            {/* {item.day == "" ? */}
            {/* {item.card_interaction == "content_feed_info" &&

<View style={{
}}>
    <ImageBackground
        source={Constantimages.info_circle_icon}
        style={styles.imageContainer}
>
       
    </ImageBackground>

</View>
            } */}
            {item.card_interaction == "content_feed_close" ?
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
                        /* {item.headertitle == "Information" && item.day != "" ? */
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

                            {/* {item.card_interaction == "content_feed_close" ? */}
                            {/* {item.day != "" && item.headertitle != "System Notification"
                                && item.headertitle != "Birthdays" ? */}
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
                                                // resizeMode: 'contain',
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
                                    // item.headertitle == "Birthdays" ?
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
            }
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
