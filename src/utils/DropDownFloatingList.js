import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PixelRatio,
    TextInput
} from 'react-native';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../utils/StyleComponents';
export default function DropDownFloatingList({ title, backcolor, headerstyle, headerlogo, profilename, selectedsupporttypevalue }) {

     return (


        <TextInput
            style={{
                color: colors.COLOR_BLACK,
                paddingVertical: 15,
                fontWeight:'400',
                fontSize:fontsProps.lg,
                fontFamily:"CircularStd-Black",
            }}
            placeholder={"Select Support Type"}
            underlineColorAndroid="transparent"
            value={selectedsupporttypevalue}
            editable={false}
        />
    )
}
const styles = StyleSheet.create({
});
