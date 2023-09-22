import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Platform,

} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
export default function ThreeRowFullImageCardType({ item, index, cardstyle, header_background_color, onPress }) {
    // console.log("title   card_sub_text" + item.card_sub_text + "----------" + item.headertitle)
    // console.log("ThreeRowFullImageCardType" + item.notificationImage.replace(" ", "%20"))
    var cardimage = item.notificationImage.replace(" ", "%20");
    return (

        <ImageBackground
            style={cardstyle}
            source={
                cardimage != null ?
                    {
                        uri: cardimage
                    }
                    :
                    Constantimages.image_lady_fall_card
            }
        >


            <LinearGradient
                colors={[
                    'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'
                ]}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    right: 0, bottom: 0,
                    flexDirection: 'row',
                    // backgroundColor: 'rgba(0,0,0,.6)', 
                    // backgroundColor: 'rgba(245,246,252,.6)', 


                }}>

                <View style={{
                    flex: 1, justifyContent: 'flex-end',
                    alignItems: 'flex-end', paddingBottom: 16,
                    paddingHorizontal: 16
                }}>
                    <Text style={{
                        color: colors.COLOR_WHITE,
                        fontWeight: '700',
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                        fontSize: 16,
                        lineHeight: 20
                    }}>{item.title}</Text>
                </View>

                <View style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center', paddingBottom: 16
                }}>
                    <Image
                        source={item.subtitleIcon}
                        style={{

                            resizeMode: 'contain',
                            width: 25,
                            alignSelf: 'flex-end',
                            tintColor: colors.COLOR_WHITE,
                            height: 25

                        }}
                    >
                    </Image>
                    {/* <SvgXml width="20" 
                        height="20" 
                        xml={item.icon} /> */}
                    <View style={{ flexDirection: 'row', bottom: 16, right: 16, position: 'absolute' }}>
                        <Text style={{
                            color: colors.COLOR_WHITE,
                            fontSize: 12,
                            lineHeight: 18,

                            fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :

                                "Radomir Tinkov - Gilroy-SemiBold",
                        }}>Flash Club</Text>
                        {/* <Image
                            source={item.icon}
                            style={{

                                resizeMode: 'contain',
                                width: 20,
                                marginLeft: 7,
                                height: 20,

                            }}
                        >
                        </Image> */}
                        <SvgXml width="20" 
                        height="20" 
                        xml={item.icon} />
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
        //   </LinearGradient>
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
