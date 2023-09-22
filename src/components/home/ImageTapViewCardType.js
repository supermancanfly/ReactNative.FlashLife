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
import EllipseClose from '../../assets/svg/EllipseClose.svg';
export default function ImageTapViewCardType({ item, index, cardstyle, header_background_color, onPress,onOpenMailApp }) {
    // console.log("index" + index+"----------" + item.headertitle)
  
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 12,
            marginTop: index == 0 ? 0 : 10,
        }}>
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
                             fontSize:12,
                             fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                            //  fontWeight: '400'
                            fontWeight: '700',
                           }}>{item.headertitle}</Text>

                    </View>
                    <Text style={{
                        flex: 1,                          flexWrap: 'wrap',
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
                        {item.notificationImage != ""   ?
//                             <Image
//                                 source={Constantimages.arrow_right_icon}
//                                 style={{
//                                     height: 20,
//                                     alignSelf: 'flex-end',
//                                     resizeMode: 'contain',
//                                     tintColor: colors.COLOR_BLACK
//                                 }}
//                             >
// card_image
//                             </Image>
<Image
                                            source={
                                                {
                                                    uri:
                                                        
                                                            item.notificationImage
                                                         
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
            //    marginTop:18,
                backgroundColor: "#E3E3E3"
            }}>

            </View>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={
                    // item.action_type_id==7? ()=>onOpenMailApp(item):
                    () => {
                    // onPress={onOpenMailApp}
                    onPress(item)
                }}
            >
                <Text style={{
                    paddingVertical: 22, color: "#0097F7",
                    fontSize: 16, 
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                            
                     }}>
                    Tap to View
                    </Text>
            </TouchableOpacity>
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
