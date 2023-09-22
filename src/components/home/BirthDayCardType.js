import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import { SvgXml } from 'react-native-svg';
import EmptyProfileAvatar from '../../assets/svg/EmptyProfileAvatar.svg';
import { getUserName } from '../../utils/CommonMethods';

export default function BirthDayCardType({ item, index, cardstyle, header_background_color, onPress,
    onPressSeeMore, showmoreList, onPressProfile }) {
    let showBirthList;
    if (item.isShowMore) {
        showBirthList = item.subList;
    } else if (showmoreList != undefined) {
        showBirthList = showmoreList;
    } else {
        showBirthList = [];
    }


    if (item.subList.length == 1) {
        return (

            <View style={{
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 12,
                flexDirection: 'row',
                marginTop: index == 0 ? 0 : 10,
            }}>



                <View style={{ flex: 1, marginVertical: 18 }}>
                    {!item.isActive &&
                        <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 18, marginBottom: 5 }}>
                            <View style={{ flex: 1, }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>

                                    <SvgXml
                                        width="20"
                                        height="20"
                                        xml={item.icon} />
                                    <Text style={{
                                        paddingLeft: 6,
                                        color: item.maincolor,
                                        fontSize: 12,
                                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",

                                        fontWeight: '700',

                                    }}>Today's Birthdays</Text>

                                </View>


                            </View>

                        </View>
                    }
                    <Text style={{
                        // paddingLeft: 6,
                        // color: item.maincolor,
                        color: colors.COLOR_BLACK,
                        fontSize: 12,
                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                        fontWeight: '700',
                        marginHorizontal: 18,
                        // marginBottom:5
                    }}>Happy Birthday</Text>
                    <Text style={{
                        // paddingLeft: 6,
                        // color: item.maincolor,
                        color: colors.COLOR_BLACK,
                        fontSize: 12,
                        marginHorizontal: 18,
                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                        fontWeight: '700',
                        marginBottom: 5
                    }}>{getUserName(item.subList[0])}
                    </Text>
                    {/* {item.subList[0].name + " " + item.subList[0].surname}! */}
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        marginHorizontal: 18,
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // paddingVertical: 10,
                        // paddingHorizontal: 18
                    }}
                        onPress={() => {
                            onPressProfile(item.subList[0])
                        }}
                    >
                        <Text style={{
                            fontSize: 12,
                            fontWeight: '400',
                            color: "#0097F7",

                        }}>
                            View Profile {'>'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center', marginRight: 18
                }}>
                    {item.subList[0].user_image != "" ?
                        <Image
                            source={

                                {
                                    uri: item.subList[0].user_image
                                }

                            }

                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: 12,

                            }}
                        >
                        </Image>
                        :

                        <SvgXml
                            width="60"
                            height="60"
                            xml={EmptyProfileAvatar} />
                    }
                </View>
            </View>

        );

    }

    else {
        return (

            <View>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 12,

                    marginTop: index == 0 ? 0 : 10,
                }}>
                    {!item.isActive &&
                        <View style={{ flex: 1, flexDirection: 'row', margin: 18, }}>
                            <View style={{ flex: 1, }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <View pointerEvents="none">

                                        <SvgXml
                                            width="20"
                                            height="20"
                                            xml={item.icon} />
                                    </View>
                                    <Text style={{
                                        paddingLeft: 6,
                                        color: item.maincolor,
                                        fontSize: 12,
                                        fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",

                                        fontWeight: '700',

                                    }}>Today's Birthdays</Text>

                                </View>


                            </View>

                        </View>
                    }
                    {
                        (item.content_type == 14
                            // && item.isActive
                        ) &&
                        <View style={{

                        }}>

                            {item.subList.length == 0 &&
                                <View style={{}}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: "#60626B",
                                        marginLeft: 18,
                                        paddingVertical: 9
                                        // paddingBottom:9
                                    }}>
                                        {/* No Birthdays coming up in next 7 days */}
                                        No Birthdays today
                                    </Text>
                                </View>
                            }
                            {item.subList.length > 0 &&
                                showBirthList.map((subitem, index) => (

                                    <View key={index}
                                        style={{

                                        }}>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',

                                            alignItems: 'center',
                                            paddingVertical: 10,
                                            paddingHorizontal: 18
                                        }}
                                            onPress={() => {
                                                onPressProfile(subitem)
                                            }}
                                        >
                                            {subitem.user_image != "" ?
                                                <Image
                                                    source={

                                                        {
                                                            uri: subitem.user_image
                                                        }

                                                    }

                                                    style={{
                                                        height: 60,
                                                        width: 60,
                                                        borderRadius: 12,

                                                    }}
                                                >
                                                </Image>
                                                :

                                                <SvgXml
                                                    width="60"
                                                    height="60"
                                                    xml={EmptyProfileAvatar} />
                                            }
                                            <View style={{
                                                paddingVertical: 9,
                                                paddingLeft: 18,
                                                flex: 1
                                            }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    color: colors.COLOR_BLACK,
                                                    fontWeight: 'bold',

                                                    textDecorationStyle: 'solid'
                                                }}>{getUserName(subitem)}
                                                </Text>
                                                {/* {subitem.name + " " + subitem.surname} */}
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '400',
                                                    color: "#60626B",

                                                }}>
                                                    {subitem.department_name}
                                                </Text>
                                            </View>
                                            <View style={{
                                                paddingVertical: 9,

                                                justifyContent: 'center',


                                            }}>

                                                <Image
                                                    source={Constantimages.arrow_right_icon}
                                                    style={{
                                                        height: 25,

                                                        resizeMode: 'contain',

                                                        tintColor: colors.COLOR_BLACK,
                                                        alignSelf: 'flex-end'

                                                    }}
                                                >
                                                </Image>
                                            </View>
                                        </TouchableOpacity>
                                        {item.subList.length - 1 != index &&
                                            <View style={{
                                                height: 1, backgroundColor: "#F2F3F5",
                                            }}></View>
                                        }
                                    </View>
                                ))}
                            {(!item.isShowMore && item.subList.length > 3) &&
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 18
                                }}
                                    onPress={() => {
                                        onPressSeeMore(item)
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: "#0097F7",

                                    }}>
                                        See All
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
            </View>

        )

    }
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        resizeMode: 'contain',
        width: 20,
        height: 20
    },
    imageContainer: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        tintColor: colors.GREY_COLOR

    },
    closeIcon: {
        height: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: colors.GREY_COLOR
    },
    title: {
        fontSize: 16,
        color: colors.COLOR_BLACK,
        fontWeight: 'bold',
        paddingLeft: 6,
        textDecorationStyle: 'solid'
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '400',
        color: "#60626B",
        paddingLeft: 6,
    }
});
