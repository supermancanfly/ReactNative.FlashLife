import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
 
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { SvgXml } from 'react-native-svg';
export default function StandardNotificationCard({ item, index, cardstyle, header_background_color, onPress }) {
    return (
        <View style={cardstyle}>

            <View

                style={{
                    height: 50,
                    width: 50,
                    borderRadius: 8,
                    resizeMode: 'contain',
                    alignItems: 'center',
                    backgroundColor: item.color
                }}
            />
            <View style={{
                flex: 1, justifyContent: 'center',

                paddingLeft: 14
            }}>
                <Text style={{
                    fontSize: 16,
                    //    fontWeight: '700',
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                    color: colors.COLOR_BLACK
                }}>
                    {item.headertitle}

                </Text>
                <Text style={{
                    color: "#60626B",
                    fontSize: 12,
                    fontWeight: '400',
                    fontFamily: Platform.OS === 'ios' ? "Circular Std" :
                        "CircularStd-Medium",
                }}>{item.title}</Text>
            </View>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={item.subtitleIcon}
                    style={{

                        resizeMode: 'contain',
                        width: 25,

                        alignSelf: 'flex-end',
                        tintColor: colors.COLOR_BLACK,
                        height: 25

                    }}
                >
                </Image>
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
    }
});
