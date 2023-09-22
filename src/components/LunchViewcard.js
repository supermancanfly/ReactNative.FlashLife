import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Image, ScrollView, Dimensions, ImageBackground, Modal,
    Platform,
    TextInput
} from 'react-native';
import { color } from 'react-native-reanimated';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
import GuestCardView from '../components/GuestCardView';
function LunchViewcard({
    // keyIndex,
    appcolor,
    orderList,
    cardData,
    buttonPress,
    guestbuttonPress
}) {

    // console.log("Card data: ", cardData ? JSON.stringify(cardData) : "");
    // console.log("orderList" + JSON.stringify(orderList));

    return (
        <View>
            <View style={{
                backgroundColor: colors.COLOR_WHITE,
                elevation: 3,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                marginTop: 3
            }}>
                <TouchableOpacity style={{
                    paddingVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',

                    margin: 3
                }}
                    onPress={buttonPress}
                >
                    <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}
                    >
                        <View style={{
                        }}>
                            <Text style={{ fontSize: 16, color: '#616161', paddingHorizontal: 10 }}>Mon 11 Jan</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}
                        >
                            <Image source={Constantimages.checkfill_icon}
                                style={{
                                    width: 25, height: 25, resizeMode: 'contain',

                                    tintColor:
                                        appcolor
                                }} />

                            <Image source={
                                cardData.isSwitch ? Constantimages.drop_up_icon :
                                    Constantimages.drop_icon}
                                style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                        </View>
                    </View>

                </TouchableOpacity>

                {cardData.isSwitch &&
                    <View>

                        <View style={{ height: 0.5, backgroundColor: colors.GREY_COLOR }}>
                        </View>
                        {
                            orderList.map((item, key) =>
                            (
                                <View>
                                    <View style={{
                                        backgroundColor: '#FFFFFF',
                                        flex: 1,
                                        flexDirection: 'row',
                                        padding: 5,
                                        borderRadius: 5,
                                        margin: 5,
                                        justifyContent: 'space-between'
                                    }}>

                                        <Image source={item.icon}
                                            style={{
                                                width: 90 / 2,
                                                height: 90 / 2,
                                                alignSelf: 'center',

                                                paddingVertical: 5,
                                            }}
                                        >
                                        </Image>


                                        <View style={{
                                            justifyContent: 'center',

                                        }}>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontWeight: 'bold', color: '#616161',
                                                paddingHorizontal: 10
                                            }}>
                                                Order Title({item.titlename})</Text>
                                            <Text style={{
                                                fontSize: fontsProps.sm,
                                                color: '#616161',
                                                paddingHorizontal: 10
                                            }}>
                                                Ingredients</Text>
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end'
                                        }}
                                        >
                                            <Image source={
                                                item.active ?
                                                    Constantimages.checkfill_icon
                                                    : Constantimages.checkcircle_icon
                                            }
                                                style={{
                                                    width: 25, height: 25, resizeMode: 'contain',

                                                    tintColor:
                                                        item.active ?
                                                            appcolor
                                                            : colors.GREY_COLOR,
                                                }} />


                                        </View>

                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.GREY_COLOR }}>
                                    </View>

                                </View>

                            ))
                        }

                    </View>
                }
            </View>
            {cardData.isSwitch &&
                <View style={{
                    // margin: 5
                }}>

                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                        // marginTop: 10,
                    }}>Guest Name
                    </Text>

                    <TextInput
                        // ref={input => { this.textFraud = input }}
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            // textAlignVertical: 'top',
                            borderWidth: 1,
                            // marginTop: 10,
                            marginBottom: 5,
                            borderColor: appcolor,
                            borderRadius: 5,
                            paddingHorizontal: 10,

                            paddingVertical: Platform.OS == 'ios' ? 5 : 5,
                            // height: Platform.OS == 'ios' ? 70 : null
                        }}
                        // style={{ flex: 1, paddingVertical: 10 }}
                        placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                        underlineColorAndroid="transparent"
                        // numberOfLines={2}
                        // multiline={true}
                        // value={this.state.additionalnotes}
                        // onChangeText={this.handleAdditionalSettings}
                        keyboardType='default'
                        returnKeyType="done"
                    />

                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                        // marginTop: 10,
                    }}>Guest Email
                    </Text>
                    <TextInput

                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',

                            borderWidth: 1,

                            marginBottom: 5,
                            borderColor: appcolor,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 5 : 5,

                        }}
                        placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                        underlineColorAndroid="transparent"

                        keyboardType='default'
                        returnKeyType="done"
                    />
                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginVertical: 5
                        // marginTop: 10,
                    }}>{ConstantValues.ADDITIONAL_NOTES_STR}
                    </Text>
                    <TextInput
                        // ref={input => { this.textFraud = input }}
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            textAlignVertical: 'top',
                            borderWidth: 1,
                            // marginTop: 10,
                            marginBottom: 5,
                            borderColor: appcolor,
                            borderRadius: 5,
                            paddingHorizontal: 10,

                            paddingVertical: Platform.OS == 'ios' ? 30 : null,
                            height: Platform.OS == 'ios' ? 70 : null
                        }}
                        placeholder={ConstantValues.SPECIFIC_ORDER_DETAILS_STR}
                        underlineColorAndroid="transparent"
                        numberOfLines={2}
                        multiline={true}
                        // value={this.state.additionalnotes}
                        // onChangeText={this.handleAdditionalSettings}
                        keyboardType='default'
                        returnKeyType="done"
                    />
                    <GuestCardView
                        // key={key}
                        appcolor={appcolor}
                        orderList={[]}
                        cardData={cardData}
                        guestbuttonPress={guestbuttonPress}
                    // buttonPress={() => { this.update_guest_Layout(item, key) }}
                    />
                </View>}

        </View>
    );
}


const styles = StyleSheet.create({

})

export default LunchViewcard;