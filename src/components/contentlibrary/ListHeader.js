import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
export default function ListHeader({ title }) {
    // console.log("title"+title)
    return (
      
        <View
        style={{
            width: "100%",
            backgroundColor: colors.COLOR_WHITE,
            alignSelf: "center",
        }}
    >
        <Text style={{
            alignSelf: "center",
            color: colors.GREY_COLOR,
            fontWeight:'bold',
            paddingVertical: 10,
        }}>{title}</Text>
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
