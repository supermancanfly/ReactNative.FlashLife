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
export default function HomeSubCard({ cardstyle, header_background_color, temp, direction,
    windspeed,
    weatherCondition,
    weathericon
}) {
    return (
        <TouchableOpacity style={cardstyle}
        >

            <Image
                source={
                    weathericon != null ?
                        { uri: "http://openweathermap.org/img/wn/" + weathericon + "@2x.png" }
                        :
                        null
                }
                style={{
                    height: 60,
                    width: 60,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                }}
            >
            </Image>
            <Text style={{
                fontWeight: '700',
                fontSize: 16,

                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :

                    "Radomir Tinkov - Gilroy-Bold",
                color: colors.COLOR_BLACK
            }}>{temp} °C</Text>

            <Text style={{
                fontWeight: '600',
                fontSize: 12,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                color: "#60626B"
            }}>{direction} | {windspeed}</Text>
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
    }
});
