import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
// import FormsListItem from '../../components/forms/FormsListItem';
export default function FormsListItem({ item, index,
    onPressItem,
    header_background_color,
    itemname,
    numofitems
}) {
    return (
        <TouchableOpacity style={{
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            alignItems: 'center',
            backgroundColor: colors.COLOR_WHITE,
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            margin: 3
        }}
            onPress={onPressItem}
        >
            <Text style={{
                fontSize: 15,
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
            }}>{itemname}</Text>
            <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingHorizontal: 5,
                    textAlign: 'center',
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-SemiBold" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                }}>{numofitems}</Text>
                <Image source={Constantimages.arrow_right_icon}
                    style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        tintColor: '#aeaeae'
                    }} />
            </View>
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
