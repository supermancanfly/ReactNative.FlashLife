import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
    TextInput,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import Constantimages from "../../utils/ConstantImages"
import { colors } from "../../utils/StyleComponents"
import Moment from 'moment';

export const DateButton = (isOrderDateOpen, item, header_background) => {
    const getSelectedMealValue = () => {
        let selectedItemsCount = 0;
        let selectedMealText = null;
        for (let index = 0; index < item.orderList.length; index++) {
            if (item.orderList[index].active) {
                selectedItemsCount = selectedItemsCount + 1;
            }
        }

        for (let guestIndex = 0; guestIndex < item.dynamicGuestList.length; guestIndex++) {
            for (let guestOrdersIndex = 0; guestOrdersIndex < item.dynamicGuestList[guestIndex].orderList.length; guestOrdersIndex++) {
                if (item.dynamicGuestList[guestIndex].orderList[guestOrdersIndex].active) {
                    selectedItemsCount = selectedItemsCount + 1;
                }

            }
        }

        if (selectedItemsCount == 1) {
            selectedMealText = `${selectedItemsCount} Meal Selected`;
        } else if (selectedItemsCount > 1) {
            selectedMealText = `${selectedItemsCount} Meals Selected`;
        }
        return selectedMealText;
    }

    const orderedMenuItemView = () => {
        if (item.isSelectOrder && item.orderid) {
            let orderItemfor = "Ordered for you";
            if (item.dynamicGuestList.length == 1) {
                orderItemfor = "Ordered for you and " + item.dynamicGuestList[0].guest_name;
            } else if (item.dynamicGuestList.length > 1) {
                orderItemfor = "Ordered";
            }
            return <Text style={{
                fontSize: 13,
                fontWeight: "600",
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                color: "#6FAA19",//"#60626B",
                // paddingHorizontal: 10,
            }}>{orderItemfor}</Text>
        } else if (item.isSelectOrder && getSelectedMealValue() != null) {
            return <Text style={{
                fontSize: 13,
                fontWeight: "600",
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                color: "#60626B",
                // paddingHorizontal: 10
            }}>{`${getSelectedMealValue()}`}
                {/* Ordered */}
            </Text>
        } else if (item.dynamicGuestList.length > 0) {
            let orderItemfor = "Ordered";
            if (item.dynamicGuestList.length == 1) {
                orderItemfor = "Ordered for " + item.dynamicGuestList[0].guest_name;
            } else if (item.dynamicGuestList.length > 1) {
                orderItemfor = "Ordered";
            }
            return <Text style={{
                fontSize: 13,
                fontWeight: "600",
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                color: "#6FAA19",//"#60626B",
                // paddingHorizontal: 10,
            }}>{orderItemfor}</Text>
        }
        else {
            return <></>
        }
    }

    return (

        <View style={{
            flex: 1,
            flexDirection: 'row',
        }}>
            <View style={{
                flex: 1
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    // paddingHorizontal: 10
                }}>
                    {Moment(item.lunchdate).format("ddd - DD MMM")}

                </Text>
                {orderedMenuItemView()}
            </View>
            <View style={{
                // flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }}>

                <Image source={
                    item.isSwitch ? Constantimages.arrowup_icon :
                        Constantimages.arrow_down_icon}
                    style={{
                        width: item.isSwitch ? 17 : 30,
                        height: item.isSwitch ? 17 : 30,
                        resizeMode: 'contain',
                        tintColor: "#32333A",
                    }} />
            </View>
        </View>

    )
}