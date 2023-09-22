import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';

export default function HeaderCenterTitle({title,backcolor,headerstyle}) {


    return (
        <View style={
            headerstyle
        }>
                <View
        style={{
            justifyContent: 'center',
            paddingHorizontal: 5
        }}
        // onPress={this.props.onBackForms}
    >
        <Image
            // source={{uri:"http://52.90.219.201/bluehorse/uploads/test_docs_4326.jpg"}}
            source={null}
            style={{
                width: 25,
                height: 25,

                // tintColor: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
            }}
        >
        </Image>
    </View>
            <View style={{
        flex: 1,
        justifyContent: 'center', alignItems: 'center'
    }}>

            <Text style={{ fontSize: fontsProps.lg, fontWeight: 'bold',
                color: title == "More" || (title == ConstantValues.MAIN_GATE_STR || 
                ConstantValues.FORMS_STR) ? colors.COLOR_WHITE : colors.COLOR_BLACK }}>{title}</Text>
                </View>
                <View
        style={{
            justifyContent: 'center',
            paddingHorizontal: 5
        }}
        // onPress={this.props.onBackForms}
    >
        <Image
            // source={{uri:"http://52.90.219.201/bluehorse/uploads/test_docs_4326.jpg"}}
            source={null}
            style={{
                width: 25,
                height: 25,

                // tintColor: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
            }}
        >
        </Image>
    </View>
        </View>)
}
const styles = StyleSheet.create({
});
