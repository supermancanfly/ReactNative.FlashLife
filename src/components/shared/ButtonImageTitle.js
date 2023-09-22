import React from 'react';
import { Text, TouchableOpacity, View, Image, Platform } from "react-native";
import { colors } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
import Tooltip from 'react-native-walkthrough-tooltip';
export default function ButtonImageTitle({
    type,
    title,
    imagesrc,
    buttonPress,
    style,
    titleStyle,
    imagestyle,
    onOpenToolTipInfo,
    item,
    toolTipVisible,
    tooltipData,
    onCloseToolTipInfo,
    isShowImageLeft,
    disabled
}) {
    if (type == "") {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 5,
                    borderWidth: 1,
                    elevation: 5,
                    alignSelf: 'center',
                    height: 60,
                    marginHorizontal: 15,
                    borderRadius: 5,
                    marginVertical: 16
                }}
                onPress={() => { onOpenToolTipInfo(item) }}>
                <View style={{ flex: 0.3 }}>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        color: "#A1A4B0",
                        fontSize: 16,
                        textAlign: 'center',
                        paddingHorizontal: 25,
                        paddingVertical: 15,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                    }}>No Submit</Text>
                </View>

                <View
                    style={{
                        flex: 0.3,
                        alignItems: 'flex-end',
                        marginRight: 10
                    }}
                >
                    <Tooltip
                        animated={true}
                        isVisible={toolTipVisible}
                        contentStyle={
                            {
                                flex: 1,
                                alignSelf: 'flex-end',
                                justifyContent: 'center',
                            }
                        }
                        content={
                            <View style={{
                                flex: 1,
                                marginHorizontal: 10,
                                borderRadius: 12,

                            }}>
                                <Text style={{
                                    fontWeight: 'bold', fontSize: 14,
                                    color: colors.COLOR_BLACK, paddingVertical: 5
                                }}>
                                    {tooltipData.length > 0 ? tooltipData[0].reference_label
                                        :
                                        ""
                                    }

                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR, paddingBottom: 5,
                                    lineHeight: 18
                                }}>
                                    {tooltipData.length > 0 ? tooltipData[0].reference_detail : ""}

                                </Text>
                            </View>
                        }
                        placement="top"
                        //  "center"	
                        onClose={onCloseToolTipInfo}
                    >
                        <Image
                            source={Constantimages.newinfo_icon_flash}
                            style={{
                                height: 22,
                                width: 22,
                                left: 16,
                                marginRight: 16,
                                resizeMode: 'contain',
                                alignSelf: 'flex-end',
                            }}
                        >
                        </Image>
                    </Tooltip>
                </View>
            </TouchableOpacity>
        );
    }
    else {
        return (
            <TouchableOpacity style={{...style, opacity: disabled ? 0.3 : 1}} disabled = {disabled ?? false} onPress={buttonPress}>
                <View style={{ flex: 0.3 }}>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={
                        [titleStyle]

                    }>
                        {title}
                    </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end', marginRight: 10 }}>
                    <Image
                        source={
                            imagesrc
                        }
                        style={
                            imagestyle
                        }
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
