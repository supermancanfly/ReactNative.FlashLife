import React from "react";
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { SvgXml } from "react-native-svg";
import { ConstantValues } from "../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../utils/StyleComponents";
import SchoolFill from '../../../assets/svg/SchoolFill.svg';
import More from '../../../assets/svg/More.svg';
import { useReducer } from "react";
import { useSelector } from "react-redux";
const BottomTabView = ({ props }) => {
    const { footer_tabs } = useSelector(state => state.applicationReducer);
    const renderRowNavOrder = (tab, index) => {
        return <TouchableOpacity key={index}
            style={{
                flex: 1,
                alignItems: 'center',
            }}
            onPress={() => {
                props.navigation.navigate('Main')
            }}>
            <View pointerEvents="none">
                <SvgXml width="22"
                    height="18"
                    fill={"#A1A4B0"}
                    xml={tab.inactiveicon}
                />
            </View>
            <Text style={{
                color: tab.inactivetabcolor,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                fontSize: fontsProps.sm,
                paddingTop: 5,
                fontWeight: '600',
                textAlign: 'center'
            }}>{tab.tabname}</Text>
        </TouchableOpacity>
    }
    return (<View style={{
        width: '100%',
        height: ConstantValues.BOTTOM_TAB_HEIGHT,
        backgroundColor: colors.COLOR_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingVertical: 10,
        borderTopWidth: 0.3,
        borderColor: colors.GREY_COLOR
    }}>
        {footer_tabs && footer_tabs.map((tab, index) => (renderRowNavOrder(tab, index)))}
        <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => { }}>
            <View pointerEvents="none">
                <SvgXml width="22"
                    height="18"
                    fill={'#000000'}
                    xml={SchoolFill}
                />

            </View>
            <Text style={{
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                paddingTop: 5,
                fontSize: fontsProps.sm,
                fontWeight: '600',
            }}>{ConstantValues.TRAINING_STR}</Text>

        </TouchableOpacity>
        <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => { }}>
            <View pointerEvents="none">
                <SvgXml width="22"
                    height="18"
                    fill={"#A1A4B0"}
                    xml={More}
                />

            </View>
            <Text style={{
                color: "#A1A4B0",
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                paddingTop: 5,
                fontSize: fontsProps.sm,
                fontWeight: '600',
            }}>{ConstantValues.MORE_STR}</Text>
        </TouchableOpacity>
    </View>)

}
export default BottomTabView;