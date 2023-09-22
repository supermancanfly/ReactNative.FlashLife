
import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
export default function ProfileField({ title, value }) {
    return (
        <View style={{ flexDirection: 'row', paddingVertical: paddingProps.tosm, marginHorizontal: paddingProps.md, borderBottomWidth: 1, borderColor: colors.COLOR_LIGHT_GRAY }} >
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontsProps.sm,color:colors.GREY_COLOR  }}>{title}</Text>
            </View>
            <View style={{ flex: 2 }}>
                <Text style={{ fontSize: fontsProps.sm, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_BLACK }}>{value}</Text>
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