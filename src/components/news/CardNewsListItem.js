import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
export default function CardNewsListItem({ item, index, cardstyle, header_background_color }) {
    // console.log("title" + item)
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
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20
                        }}
                    >
                    </Image>
                    <Text style={{ paddingLeft: 6, color: item.color, fontWeight: '700' }}>{item.headertitle}</Text>

                </View>
                <Text style={{ flex: 1, fontWeight: 'bold', flexWrap: 'wrap', fontSize: 16, paddingTop: 8 }}>{item.title}</Text>

                {item.subtitle == "View full story" &&
                    <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>

                        <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>{item.subtitle != "" && item.subtitle}</Text>
                        <Image
                            source={item.subtitle == "View full story" ? Constantimages.arrow_right_icon : null}
                            style={{
                                height: 25,
                                width: 25,
                                resizeMode: 'contain',
                                tintColor: colors.GREY_COLOR

                            }}
                        >
                        </Image>
                    </View>
                }


            </View>
            {item.day == "" ?

                <View style={{
                    // flex:1,
                    // backgroundColor:'red'
                }}>
                    <ImageBackground
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
                    </ImageBackground>

                </View>

                :

                <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    // flex: 0.4,
                    // flex:1,

                }}>
                    {item.headertitle == "Information" && item.day != "" ?
                        <Image
                            source={Constantimages.flash_arrow_icon}
                            style={{
                                // height: 25,
                                // height: 35,
                                height: 20,
                                alignSelf: 'flex-end',
                                resizeMode: 'contain',
                                tintColor: colors.COLOR_BLACK
                            }}
                        >

                        </Image>
                        :

                        <Image
                            source={item.day != "" ? item.notificationImage : null}
                            style={{
                                height: 90,
                                width: 100,
                                resizeMode: 'contain',
                                alignSelf: 'flex-end',
                                borderRadius: 12
                            }}
                        >
                        </Image>
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
    }
});
