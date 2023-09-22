import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ActivityIndicator
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';

export default function CategoriesClubCard({ header_background_color, cardstyle, }) {

    return (
        <TouchableOpacity style={cardstyle}>
            <View style={{
                width: '100%',
                paddingVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 1,

            }}>
                <Text style={{
                    fontSize: fontsProps.lg, color: colors.COLOR_BLACK,
                    fontWeight: '700',
                    lineHeight: 20,
                    fontFamily: "CircularStd-Black",

                }}>
                    Months Completed
                                </Text>
                <View style={{ flexDirection: 'row' }}>

                    <Text style={{
                        fontSize: fontsProps.md,
                        fontSize: 16,
                        fontFamily: "CircularStd-Black",
                        color: "#939393",
                    }}>
                        1

                            </Text>
                    <Image
                        source={Constantimages.info_circle_icon}
                        style={{
                            height: 19,
                            width: 19,
                            left: 16,
                            marginRight: 20,
                            resizeMode: 'contain',
                            alignSelf: 'center',
                        }}
                    >

                    </Image>
                </View>

            </View>
            <View style={{
                width: '100%',
                paddingVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 1,

            }}>
                <Text style={{
                    fontSize: fontsProps.lg, color: colors.COLOR_BLACK,
                    fontWeight: '700',
                    lineHeight: 20,
                    fontFamily: "CircularStd-Black",

                }}>
                    Grace Months Available
                                </Text>
                <View style={{ flexDirection: 'row' }}>

                    <Text style={{
                        fontSize: fontsProps.md,
                        fontSize: 16,
                        fontFamily: "CircularStd-Black",
                        color: "#939393",
                    }}>
                        1

                            </Text>
                    <Image
                        source={Constantimages.info_circle_icon}
                        style={{
                            height: 19,
                            width: 19,
                            left: 16,
                            marginRight: 20,
                            resizeMode: 'contain',
                            alignSelf: 'center',
                        }}
                    >
                    </Image>
                </View>

            </View>
            <View style={{
                width: '100%',
                paddingVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 1,

            }}>
                <View>
                    <Text style={{
                        fontSize: fontsProps.lg, color: colors.COLOR_BLACK,
                        fontWeight: '700',
                        lineHeight: 20,
                        fontFamily: "CircularStd-Black",

                    }}>
                        On Track to Earn Leave
                </Text>
                    <Text style={{
                        fontSize: 12, color: "#60626B",
                        fontWeight: '400',
                        lineHeight: 20,
                        fontFamily: "CircularStd-Black",


                    }}>
                        Well done, keep it up!
                </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>

                    <Text style={{
                        fontSize: fontsProps.md,
                        fontSize: 16,
                        fontFamily: "CircularStd-Black",
                        color: header_background_color,
                    }}>
                        Yes

                            </Text>
                    <Image
                        source={Constantimages.info_circle_icon}
                        style={{
                            height: 19,
                            width: 19,
                            left: 16,
                            marginRight: 20,
                            resizeMode: 'contain',
                            alignSelf: 'center',
                        }}
                    >

                    </Image>
                </View>

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
    },
    closeContainer: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F2F3F5"

    }
});
