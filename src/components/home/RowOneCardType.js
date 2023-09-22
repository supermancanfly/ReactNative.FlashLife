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
export default function RowOneCardType({ item, index, cardstyle, header_background_color, onPress,cardInteraction }) {
    // console.log("title   card_sub_text" + item.card_sub_text+"----------"+item.headertitle)

    if (item.card_type == 1) {
        return (

            <View style={cardstyle}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image
                        source={Constantimages.row_one_icon}
                        style={{
                            resizeMode: 'contain',
                            width: 44,
                            height: 44
                        }}
                    >
                    </Image>
                    <Text style={{ 
                        paddingLeft: 6, 
                        color: colors.COLOR_BLACK, 
                        fontSize:12,
                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                        // fontWeight: '400'
                        fontWeight: '700',
                        }}>
                        {item.headertitle}
                    </Text>
                </View>
                <Image
                    source={Constantimages.arrow_right_icon}
                    style={{
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        width: 20,
                        height: 20,
                        tintColor: colors.GREY_COLOR
                    }}
                >
                </Image>
            </View>
        )
    }
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
