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
import { SvgXml } from 'react-native-svg';
export default function LongNotificationCard({ item, index, cardstyle, header_background_color, onPress }) {
    // console.log("title" + item)
    return (
        <View style={cardstyle}>
<View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <Image source={item.notificationImage} style={{
                height: 50,
                width: 50,
                resizeMode: 'contain',
                alignItems: 'center',
                tintColor: "#E3E3E3"
            }} />
            <View style={{
                flex: 1, justifyContent: 'center',
              
                paddingLeft: 14
            }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.COLOR_BLACK }}>{item.headertitle}</Text>
               
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
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{ fontSize: 12, color: "#60626B" }}>{item.title}</Text>
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
