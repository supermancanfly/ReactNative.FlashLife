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
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import LinearGradient from 'react-native-linear-gradient';
export default function FormsEvidenceCard({
    title,
    iconBackgroundColor,
    icon,
    desc,
    // desc1,
    // desc2,
    count,
    buttonPress,
    cardimage,
    categoryData,
    referenceEvidenceData
}) {
    return (
        <View style={{ padding: 16, }}>
            {cardimage != null &&
                <View>
                    <ImageBackground
                        style={{
                            width: '100%', height: 160,
                            borderRadius: 12,
                            overflow: 'hidden'
                        }}
                        source={{
                            uri: cardimage
                        }}>
                        <LinearGradient
                            colors={[
                                'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'
                            ]}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0,
                                right: 0, bottom: 0,
                                flexDirection: 'row',

                            }}></LinearGradient>
                    </ImageBackground>
                </View>
            }
            <View style={{
                flexDirection: 'row',
                // paddingTop: 16,
                // marginVertical: 10,
                marginTop: 15,
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "red"
            }}>
                <View style={{
                    backgroundColor: iconBackgroundColor,
                    borderRadius: 42 / 2,
                    width: 42,
                    height: 42,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    // alignSelf: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={icon}
                        style={{
                            width: 42 / 2,
                            height: 42 / 2,
                            resizeMode: 'contain',
                            tintColor: colors.COLOR_WHITE,
                            paddingLeft: 3,
                        }} />
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingLeft: 8
                }}>
                    <Text style={{
                        color: colors.COLOR_BLACK,
                        lineHeight: 20,
                        fontWeight: '400',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                        fontSize: 16,
                    }}>{desc}</Text>
                    <Text style={{
                        color: "#A1A4B0",
                        lineHeight: 16, fontWeight: '400',
                        fontSize: 12,
                    }}>{categoryData != null && categoryData.total_points} Points</Text>
                </View>
                <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: "#F2F3F5",
                }}>
                    <Text style={{
                        color: iconBackgroundColor,
                        fontWeight: '700',
                        fontSize: 18,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                        textAlign: "center",
                        bottom: 1
                    }}>{count}</Text>
                </View>
            </View>
        </View>
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
