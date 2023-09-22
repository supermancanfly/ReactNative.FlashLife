import React, { useState } from "react";
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { Switch } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
const TrainingAppbar = ({ isShowBack, onBackPress, title }) => {
    const [isSwitch, setSwitchValue] = useState(false);
    const userFirstName = "Hello";
    const userLastName = "Rowdy";
    const userText = () => {
        return (
            <View
                style={{
                    width: 35,
                    height: 35,
                    borderRadius: 35 / 2,
                    borderWidth: 2,
                    borderColor: colors.COLOR_WHITE,
                    backgroundColor: colors.COLOR_THEME,
                    marginHorizontal: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 5
                }}>
                <Text
                    style={{
                        color: colors.COLOR_WHITE,
                        fontSize: 14,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                    }}>
                    {userFirstName.slice(0, 1) + '' + userLastName.slice(0, 1)}
                </Text>
            </View>
        );
    };
    return <View style={{
        backgroundColor: colors.COLOR_THEME,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 70,
        justifyContent: 'space-around'
    }}>
        <TouchableOpacity onPress={(isShowBack) ? onBackPress : null}
            style={{
                position: 'absolute',
                left: 10
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Icon name="angle-left"
                    color={colors.COLOR_BLACK}
                    size={30}
                />
                <Text style={{
                    fontSize: fontsProps.lg,
                    color: colors.COLOR_BLACK,
                    marginHorizontal: 10,
                    fontFamily:
                        Platform.OS === 'ios' ?
                            "Gilroy-SemiBold" :
                            "Radomir Tinkov - Gilroy-SemiBold",
                }}>{"Back"}
                </Text>

            </View>
        </TouchableOpacity>

        <Text style={{
            color: colors.COLOR_WHITE,
            fontSize: fontsProps.xl,
            fontFamily: Platform.OS === 'ios' ?
                "Gilroy-SemiBold" :
                "Radomir Tinkov - Gilroy-SemiBold",
            alignSelf: 'center',
        }}>{title}</Text>

        {/* <View style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                    color: colors.COLOR_WHITE,
                    fontSize: 15,
                    marginHorizontal: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>{(isSwitch ? "Online" : "Offline")}</Text>
                <Switch value={isSwitch}
                    color={colors.COLOR_WHITE}
                    onValueChange={() => setSwitchValue(!isSwitch)}
                />
            </View>
            {userText()}
        </View> */}
    </View >

}

export default TrainingAppbar;