import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    PixelRatio
} from 'react-native';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';

export default function HeaderLogoProfile({ title, backcolor, headerstyle, headerlogo, profilename }) {
    return (
        <View style={headerstyle}>
            <View style={{ flex: 1 }}>

                <Image
                    source={headerlogo}
                    style={{
                        width: 90,
                        height: 60,
                        resizeMode: 'contain',
                        alignSelf: 'flex-start'
                    }}
                />
            </View>

            <View style={{ justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    color: colors.COLOR_WHITE,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    textAlign: 'center',
                }}>
                    Hi {profilename}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
});
