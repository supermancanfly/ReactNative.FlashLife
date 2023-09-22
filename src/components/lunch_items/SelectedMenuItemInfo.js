import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard
} from 'react-native';
import Svg, { SvgXml } from 'react-native-svg';
// import orderEdit from '../../../../instaaccessAndroid/src/assets/svg/order_edit.svg';
// import green_leaf from '../../../../instaaccessAndroid/src/assets/svg/lunch_green_leaf.svg';

import orderEdit from './../../assets/svg/order_edit.svg';
import green_leaf from './../../assets/svg/lunch_green_leaf.svg';

const SelectedMenuItemInfo = ({
    itemOrder,
    onEditSelectedItem,
    isShowGuestName,
    guestName,
    commentValue,
    onChangeCommentValue
}) => {

    // console.log("ITEm ORDER", JSON.stringify(itemOrder));
    if (itemOrder) {
        return (
            <View key={itemOrder}
                style={{
                    padding: 10.0
                }}>
                <View style={{
                    backgroundColor: "#EAEDF2",
                    padding: 10.0,
                    borderRadius: 10.0
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'space-between'
                    }}>
                        {(isShowGuestName) ? <Text style={{
                            fontSize: 14.0,
                            fontWeight: "400",
                            color: "#60626B",
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                        }}>{`${guestName}'s meal`}</Text> :
                            <Text style={{
                                fontSize: 14.0,
                                fontWeight: "400",
                                color: "#60626B",
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            }}>Your meal</Text>}
                        <TouchableOpacity onPress={onEditSelectedItem}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>

                                <Text style={{
                                    color: '#0097F7',
                                    fontWeight: "700",
                                    fontSize: 13.0,
                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                    marginHorizontal: 3.0
                                }}>Edit</Text>
                                <SvgXml
                                    xml={orderEdit}
                                    height={13}
                                    width={13} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        fontWeight: "700",
                        fontSize: 13.0,
                        color: "black",
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                    }}>{itemOrder.titlename}
                    </Text>

                    <View style={{
                        flexDirection: "row",
                        marginTop: 5.0,
                        marginHorizontal: 3.0
                    }}>
                        <Text style={{
                            fontWeight: "600",
                            fontSize: 12.0,
                            color: itemOrder.halaal == "1" ? "#6FAA19" : "#60626B",
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                        }}>
                            {itemOrder.halaal == "1" ? "Halaal," : "Non-halaal,"}
                        </Text>

                        {itemOrder.vegetarian == 1 && <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}>{
                                // itemOrder.halaal == "1" &&
                                <SvgXml width="13"
                                    height="13"
                                    xml={green_leaf}

                                />}
                            <Text style={{
                                fontWeight: "600",
                                fontSize: 13.0,
                                color: "#6FAA19",
                                marginHorizontal: 3.0,
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            }}>
                                Vegetarian
                            </Text>
                        </View>}

                    </View>
                    <View>
                        <Text style={{
                            color: "#A1A4B0"
                        }}>Comments</Text>
                        <View style={{
                            borderColor: "#A1A4B0",
                            borderWidth: 1,
                            borderRadius: 5,
                            marginTop: 5
                        }}>
                            <TextInput
                                placeholder='Add Comment'
                                underlineColor='transparent'
                                style={{
                                    backgroundColor: "#EAEDF2",
                                    borderRadius: 5
                                }}
                                value={commentValue}
                                onChangeText={(value) => {
                                    onChangeCommentValue(value);
                                }}
                                multiline={true}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                blurOnSubmit={true}
                            />
                        </View>
                    </View>
                </View>

            </View>
        );
    } else {
        return <></>
    }



};
export default SelectedMenuItemInfo;