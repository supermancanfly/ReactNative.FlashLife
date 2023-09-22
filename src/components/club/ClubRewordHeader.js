import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Moment from 'moment';
// import Tooltip from 'rn-tooltip';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
// import { Tooltip } from 'react-native-elements';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SvgXml } from 'react-native-svg';
import DefaultAvatar from '../../assets/svg/DefaultAvatar.svg';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function ClubRewordHeader({
    points,
    user_image,
    header_background_color,
    percentage,
    club,
    app_club,
    randcurrencypoints,
    currency_symbol,
    onPressView
    // clubMonthList
}) {

    return (
        <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: "red",
            marginHorizontal: 16,
        }} onPress={onPressView}>
            <View>
                <Text style={{
                    fontSize: 12, paddingBottom: 4,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-SemiBold" :
                        "Radomir Tinkov - Gilroy-SemiBold",
                }}>Rewards Balance</Text>
                <Text style={{
                    fontSize: 28,
                    color: colors.COLOR_BLACK,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                }}>{currency_symbol}{points}
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "flex-end"
            }}>
                <View style={{
                    paddingHorizontal: 7
                }}>
                    {club == 0 || app_club == 0 ?
                        <View>
                            {user_image != "" ? <Image
                                source={{ uri: user_image }}
                                style={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: 40,
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                }}>
                            </Image> :
                                <SvgXml width="80"
                                    height="80"
                                    xml={DefaultAvatar} />
                            }
                        </View> : <AnimatedCircularProgress
                            size={40}
                            width={5}
                            fill={percentage}
                            tintColor={header_background_color}
                            backgroundColor={colors.COLOR_WHITE}>
                            {(fill) => user_image != "" ? (
                                <Image
                                    source={{ uri: user_image }}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: 60 / 2
                                    }}>
                                </Image>) :
                                (<SvgXml width="30"
                                    height="30"
                                    xml={DefaultAvatar} />)
                            }
                        </AnimatedCircularProgress>
                    }
                </View>
                <Image
                    source={Constantimages.arrow_right_icon}
                    style={{
                        height: 30,
                        resizeMode: 'contain',
                        tintColor: "#60626B"
                    }}>
                </Image>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({

});
