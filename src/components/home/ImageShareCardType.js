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
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import { color } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import EllipseClose from '../../assets/svg/EllipseClose.svg';

export default function ImageShareCardType({ item, index, cardstyle, onPress, onOpenMailApp, onOpenWebViewLink }) {
    // console.log("title" + item)
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 12,
            // marginRight: 5,
            marginTop: index == 0 ? 0 : 10,
        }}>
            <View style={cardstyle}>
                <View style={{
                    // justifyContent: 'center',
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

                            <SvgXml
                                width="20"
                                height="20"
                                xml={item.icon} />
                        </View>

                        <Text style={{
                            paddingLeft: 6,
                            color: item.maincolor,
                            fontSize: 12,
                            fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            // fontWeight: '400',
                            fontWeight: '700',

                        }}>{item.headertitle}</Text>

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
                </View>
                {item.day == "" ?

                    <View style={{

                    }}>
                        {/* <ImageBackground
                            source={Constantimages.elipse_icon}
                            style={{
                                height: 30,
                                width: 30,
                                borderRadius: 30 / 2,
                                resizeMode: 'contain',
                                alignSelf: 'flex-end',
                                justifyContent: 'center',
                                tintColor: colors.GREY_COLOR

                            }}
                        >
                            <Image
                                source={Constantimages.close_icon}
                                style={{
                                    height: 30 / 2,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    tintColor: colors.GREY_COLOR

                                }}
                            >
                            </Image>
                        </ImageBackground> */}

                        {/* <SvgXml width="20" 
                        height="20" 
                        xml={item.icon} /> */}

                        <SvgXml width="30"
                            height="30"
                            xml={EllipseClose} />

                    </View>

                    :

                    <View style={{
                        flex: 1,

                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    }}>
                        {item.headertitle == "Information" && item.day != "" ?
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
                            // <SvgXml width="25" 
                            // height="25" 
                            // xml={ArrowRight} />

                            :


                            <View

                                style={{
                                    height: 90,
                                    width: 100,
                                    borderRadius: 8,
                                    backgroundColor: item.color,

                                    alignSelf: 'flex-end'

                                }}
                            >

                            </View>

                        }
                    </View>
                }
            </View>
            <View style={{
                width: '100%',
                height: 1,
                backgroundColor: "#E3E3E3"
            }}>

            </View>

            {/* {item.action_type_id == "8" &&
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        paddingVertical: 22, color: "#0097F7",
                        fontSize: 16, fontWeight: 'bold'
                    }}>Tap to view</Text>
                </TouchableOpacity>
            } */}

            {/* {item.action_type_id == "7" && */}
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={
                    () => onOpenWebViewLink(item)
                }>
                    <Text style={{
                        paddingVertical: 22, color: "#0097F7",
                        fontSize: 16,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",

                    }}>Apply</Text>
                </TouchableOpacity>
                <View style={{
                    width: 1,
                    backgroundColor: "#E3E3E3",
                }}>

                </View>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={
                        () => onOpenMailApp(item)
                    }


                >


                    <Text style={{
                        paddingVertical: 22, color: "#0097F7",
                        fontSize: 16,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                    }}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* } */}
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
    }
});
