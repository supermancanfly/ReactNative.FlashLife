import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import Svg, { SvgXml } from 'react-native-svg';

import Tick from '../../assets/svg/Tick.svg';
import green_leaf from '../../assets/svg/lunch_green_leaf.svg';


const MenuItemCardView = ({
    item,
    itemOrder,
    itemIndex,
    onMenuItemSelect }) => {
    // console.log("Item Index", itemIndex);

    const selectRemoveButtonView = (item,
        itemOrder
    ) => {
        return <View key={itemOrder}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // padding: 10.0
                marginLeft: 16.0,
                marginRight: 16.0,
                marginTop: 10.0
            }}>
                <View>
                    <Text style={{
                        fontWeight: "600",
                        fontSize: 13.0,
                        color: itemOrder.halaal == "1" ? "#6FAA19" : "#A1A4B0",
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>
                        {itemOrder.halaal == "1" ? "Halaal" : "Non-halaal"}
                    </Text>
                    {
                        itemOrder.vegetarian == 1 && <View style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}>{
                                // itemOrder.halaal == "1" &&
                                <SvgXml width="17"
                                    height="17"
                                    xml={green_leaf}

                                />}
                            <Text style={{
                                fontWeight: "600",
                                fontSize: 13.0,
                                color: "#6FAA19", //"green",
                                marginHorizontal: 3.0,
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            }}>
                                Vegetarian
                            </Text>

                        </View>
                    }



                </View>
                <View>{(itemOrder.active) ? <TouchableOpacity style={{
                    borderColor: "black",
                    borderRadius: 5.0,
                    alignSelf: "baseline",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 38.0,
                    width: 120.0,
                    padding: 10.0,
                    borderWidth: 1.0
                }} onPress={onMenuItemSelect}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: 15.0,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>Remove</Text>

                </TouchableOpacity> : <TouchableOpacity style={{
                    backgroundColor: "black",
                    borderRadius: 5.0,
                    alignSelf: "baseline",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 38.0,
                    width: 120.0,
                    padding: 10.0,

                }}
                    onPress={onMenuItemSelect}>
                    <Text style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 15.0,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>Select</Text>

                </TouchableOpacity>}
                </View>
            </View>

            <View style={{
                // height: 10.0,
                marginVertical: 10.0

            }}>
            </View>
        </View>
    }

    getCustomOpasity = () => {

        let isNoItemSelected = false;
        for (let index = 0; index < item.orderList.length; index++) {
            const element = item.orderList[index];
            if (element.active) {
                isNoItemSelected = true;
            }
        }
        return isNoItemSelected;
    }

    return (<View key={itemOrder}
        style={{
            opacity: (getCustomOpasity() ? (itemOrder.active) ? 1.0 : 0.5 : 1.0)
            // padding: 10.0
        }}>
        {itemIndex != 0 && <View style={{
            height: 1.0,
            backgroundColor: "#E3E3E3",
            // marginVertical: 10.0
        }}>
        </View>}

        <View style={{
            flexDirection: "row",
            // padding: 10.0
            marginTop: itemIndex != 0 ? 15.0 : 0
        }}>
            <Image
                source={{ uri: itemOrder.icon }}
                style={styles.productImage}>
            </Image>

            <View style={{
                marginLeft: 15.0,
                marginRight: 15.0,
                flex: 1
            }}>

                <Text style={{
                    color: "black",
                    fontWeight: "700",
                    fontSize: 16.0
                }}>
                    {itemOrder.titlename}
                </Text>


                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text style={{
                        flex: 1,
                        fontSize: 13.0,
                        color: "#60626B",
                        fontWeight: "400",
                        marginTop: 5.0,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>{itemOrder.item_ingredients}

                    </Text>
                    {itemOrder.active &&
                        <View pointerEvents="none">
                            <SvgXml width="18"
                                height="18"
                                xml={Tick}
                            />
                        </View>}
                </View>
            </View>
        </View>
        {selectRemoveButtonView(item, itemOrder)}
    </View>);
};

const styles = StyleSheet.create({
    productImage: {
        width: 99,
        height: 90,
        // alignSelf: 'center',
        // paddingVertical: 5,
        borderRadius: 12,
        marginLeft: 15
    }
})
export default MenuItemCardView;