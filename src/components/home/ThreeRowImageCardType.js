import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    PixelRatio,
    Dimensions
} from 'react-native';
import { colors, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import { SvgUri, SvgXml } from 'react-native-svg';
import { block } from 'react-native-reanimated';
import CustomImageDialog from './CustomImageDialog';

export default function ThreeRowImageCardType({ item, index, cardstyle, header_background_color,
    onPress, onLikeContentFeed, onGifFeedView, onHuntIconPress,
    closeCustomImgeView,
    onPressCloseCustomDialog,
    onOpenActionView
}) {

    // console.log("Content feed", JSON.stringify(item));
    let imageWidth = null;
    let imageHeight = dimensionsProps.fullWidth * 0.25;
    var isContentFeedGif = false;
    var huntImageFormat = "";
    if (item != null) {
        if (item.card_interaction == "hunt") {
            var splitUrl = item.huntImage.split('.');
            huntImageFormat = splitUrl[splitUrl.length - 1];
        }

        if (item.content_feed_type == "Gif") {
            isContentFeedGif = true;
        } else {
            if (item.notificationImage) {
                Image.getSize(item.notificationImage, (width, height) => {
                    const screenWidth = Dimensions.get('window').width;
                    const scaleFactor = width / screenWidth;
                    const height1 = height / scaleFactor;
                    imageWidth = screenWidth;
                    imageHeight = height1;
                }, (error) => {
                    console.error(`Couldn't get the image size: ${error.message}`);
                });
            }
        }

    }
    return (
        <TouchableOpacity style={cardstyle} onPress={() => {
            // onPress(item);
            // console.log("ITEM DETAILS", JSON.stringify(item));
            if (item.card_action == 4 ||
                (item.action_type_id == 11 && item.video_url != null) ||
                item.card_action == 7 ||
                item.card_action == 8 ||
                item.card_action == 2 ||
                item.card_action == 10
            ) {
                onOpenActionView(item);
            }

            else {
                onPress(item);
            }
        }}>
            <View style={{
                flex: 1,
                flexDirection: "row",
            }}>
                <View style={{
                    flex: 1.1,
                    padding: 15.0
                }}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View pointerEvents="none">
                            <SvgXml width="20"
                                height="20"
                                xml={item.icon} />
                        </View>
                        <Text style={{
                            marginLeft: 5.0,
                            flex: 1,
                            color: item.maincolor,
                            fontSize: 12,
                            fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            fontWeight: '700',

                        }}>
                            {item.headertitle}
                        </Text>
                    </View>

                    {/**
                 * Card Title
                 */}

                    <View style={{
                        flexDirection: "row",
                    }}>
                        <Text style={{
                            fontSize: 15.5,
                            fontWeight: 'bold',
                            marginTop: 5,
                        }}>
                            {item.title}
                        </Text>
                    </View>

                    {
                        /**
                         * Card Sub Title
                         */
                    }
                    {(item.action_text != "" || item.card_sub_text) != "" &&
                        <View style={{
                            marginTop: 5
                        }}
                            onPress={() => {
                                // onPress(item)
                                if (item.content_feed_type == "Landing" &&
                                    item.landing_header != "" &&
                                    item.landing_text != "") {

                                    onPress(item);
                                } else if (item.card_action == 4 ||
                                    (item.action_type_id == 11 && item.video_url != null) ||
                                    item.card_action == 7 ||
                                    item.card_action == 8 ||
                                    item.card_action == 2 ||
                                    item.card_action == 10
                                ) { onOpenActionView(item); }

                                else if (item.app_link == null || item.app_link == "") {
                                    { onPressCloseCustomDialog(true) }

                                } else {
                                    if (isContentFeedGif) {
                                        onGifFeedView(item);
                                    } else {
                                        onPress(item);
                                    }

                                }
                            }}>
                            {item.card_sub_text != "" &&
                                <Text style={{
                                    color: "#60626B",
                                    fontSize: 12,
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Circular Std" : "CircularStd-Medium",
                                }}>
                                    {item.card_sub_text}
                                </Text>
                            }
                        </View>
                    }

                    {item.action_text != "" &&
                        <TouchableOpacity style={{
                            marginTop: 5.0,
                        }}
                            onPress={() => {
                                if (item.content_feed_type == "Landing" &&
                                    item.landing_header != "" &&
                                    item.landing_text != "") {
                                    onPress(item);
                                } else if (item.card_action == 4 ||
                                    (item.action_type_id == 11 && item.video_url != null) ||
                                    item.card_action == 7 ||
                                    item.card_action == 8 ||
                                    item.card_action == 2 ||
                                    item.card_action == 10
                                ) {
                                    onOpenActionView(item);
                                }

                                else if (item.app_link == null || item.app_link == "") {
                                    { onPressCloseCustomDialog(true) }

                                } else {
                                    if (isContentFeedGif) {
                                        onGifFeedView(item);
                                    } else {
                                        onPress(item);
                                    }

                                }
                            }}>

                            <View style={{
                                flexDirection: "row",
                                flex: 1,
                                alignItems: "center",
                            }}>
                                {/* <View> */}
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        color: "#0097F7",
                                        fontSize: 12,
                                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                                    }}>
                                        {item.action_text}
                                    </Text>
                                </View>

                                <View>
                                    {actionTypeTextValidation(item)}
                                </View>



                            </View>

                        </TouchableOpacity>

                    }
                </View>
                {/**
             * Image View
             */}
                <View style={{
                    justifyContent: "flex-start",
                    // backgroundColor: "yellow",
                    flex: 0.6,
                    // padding: 15.0
                    paddingTop: 15.0,
                    paddingRight: 15.0,
                    paddingBottom: 15.0
                }}>
                    <View>
                        {(item.notificationImage || isContentFeedGif) ?
                            <TouchableOpacity style={{

                            }}
                                onPress={() => {

                                    if (item.content_feed_type == "Landing" &&
                                        item.landing_header != "" &&
                                        item.landing_text != "") {
                                        onPress(item);
                                    } else if (item.card_action == 4 ||
                                        (item.action_type_id == 11 && item.video_url != null) ||
                                        item.card_action == 7 ||
                                        item.card_action == 8 ||
                                        item.card_action == 2 ||
                                        item.card_action == 10
                                    ) {
                                        onOpenActionView(item);
                                    }

                                    else if (item.app_link == null || item.app_link == "") {

                                        { onPressCloseCustomDialog(true) }

                                    } else {

                                        if (isContentFeedGif) {
                                            onGifFeedView(item);
                                        } else {
                                            onPress(item);
                                        }

                                    }
                                }}>
                                <Image
                                    source={
                                        {
                                            uri: item.day != "" ?
                                                (isContentFeedGif ? item.gif : item.notificationImage) : null
                                        }
                                    }
                                    style={{
                                        height: 90,//imageHeight,
                                        width: 99,//"100%",
                                        alignSelf: 'flex-end',
                                        borderRadius: 8,
                                        overlayColor: 'white',
                                    }}
                                    resizeMode="cover"
                                ></Image>

                            </TouchableOpacity>

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
                    {(item.notificationImage || isContentFeedGif) && item.card_interaction == "like" ?
                        <TouchableOpacity
                            style={{
                                position: "relative",
                                marginTop: -12,
                                marginRight: 30.0,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end'

                            }}

                            onPress={() => {
                                onLikeContentFeed(item);
                            }}>
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: (item.like == 1) ? colors.COLOR_THEME : colors.COLOR_WHITE,
                                borderRadius: 30,
                                // padding: 5,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                width: 65.0,
                                height: 25.0,
                                elevation: 2.5,
                                borderColor: (item.like == 1) ? colors.COLOR_THEME : 'gray',

                                borderWidth: 1

                            }}>
                                <Image
                                    source={Constantimages.like_button}
                                    style={{
                                        height: 17, width: 17,
                                        resizeMode: 'contain',
                                        tintColor: (item.like == 1) ? colors.COLOR_WHITE : 'gray',
                                        padding: 8
                                    }}
                                />
                                <Text style={{
                                    fontSize: 15.0,
                                    paddingLeft: 8,
                                    color: (item.like == 1) ? colors.COLOR_WHITE : 'gray',
                                    fontWeight: '900',
                                    fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                                }}>{item.user_engagement_like.length}</Text>

                            </View>
                        </TouchableOpacity>
                        : <></>}
                    {(item.card_interaction == "hunt" && item.huntImage != "" && item.huntValue == 1) ?
                        < TouchableOpacity
                            style={{
                                position: 'relative',
                                bottom: -5,
                                right: -5,
                                // padding: 5,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            }}
                            onPress={() => {
                                onHuntIconPress(item);
                            }}>
                            {(huntImageFormat == "svg") ? <View>
                                <SvgUri
                                    width="35"
                                    height="35"
                                    uri={item.huntImage}
                                />
                            </View> :

                                <Image
                                    source={{
                                        uri: item.huntImage
                                    }}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        alignSelf: 'flex-end',
                                        borderRadius: 20,
                                        // overlayColor: 'white',
                                        resizeMode: "cover"
                                    }}></Image>
                            }

                        </TouchableOpacity> : <></>
                    }
                </View >
            </View>
        </TouchableOpacity >


    );
}
checkUrl = (url) => {
    var splitUrl = url.split('.');
    return splitUrl[splitUrl.length - 1];
}

const actionTypeTextValidation = (item) => {
    // if (item.action_text) {
    if (item.card_action == 10) {
        return <Image
            source={Constantimages.download_icon}
            style={{
                height: 25,
                width: 25,
                resizeMode: 'contain',
            }} />
    } else {
        return <Image
            source={Constantimages.arrow_right_icon}
            style={{
                marginTop: 5.0,
                height: 20,
                width: 20,
                // resizeMode: 'contain',
                tintColor: "#0097F7",
                // position: "relative",
                // backgroundColor: "green",
                // alignItems: "flex-start",
                // justifyContent: "flex-start",
                // flex: 1


            }} />
    }

    // } else {
    //     return <></>
    // }
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
