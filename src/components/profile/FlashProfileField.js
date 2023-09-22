import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, fontsProps, paddingProps } from '../../utils/StyleComponents';
export default function FlashProfileField({ title, value }) {
    return (
        <View style={{
            flexDirection: 'row',
            paddingVertical: paddingProps.tosm,
            marginHorizontal: paddingProps.md,
        }} >
            <View style={{
                flex: 1.3,
            }}>
                <Text style={{
                    fontSize: 14,
                    color: colors.COLOR_BLACK,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-SemiBold" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                }}>{title}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                    fontSize: 13,
                    color: "#60626B",
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Regular" :
                        "Radomir Tinkov - Gilroy-Regular",
                }}>{value}</Text>
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