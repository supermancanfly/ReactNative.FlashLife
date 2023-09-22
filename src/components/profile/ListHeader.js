import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
export default function ListHeader({ title }) {
    return (
        <View style={{
            flexDirection: 'row',
            paddingVertical: paddingProps.sm,
            marginVertical: paddingProps.sm,
            backgroundColor: colors.COLOR_LIGHT_GRAY,
            paddingHorizontal: paddingProps.md
        }} >
            <Text style={{ fontSize: fontsProps.md, paddingVertical: 2, color: colors.COLOR_BLACK }}>{title}</Text>
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
