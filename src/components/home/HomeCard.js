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
import ShieldFail from '../../assets/svg/ShieldFail.svg';
import { SvgXml } from 'react-native-svg';
import ArrowRight from '../../assets/svg/ArrowRight.svg';
import DefaultAvatar from '../../assets/svg/DefaultAvatar.svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function HomeCard({ cardstyle, header_background_color, max_month_points,
    percentage, club, app_club, user_image, preferred_name,
    department_name,
    onPressClub,
    onProfileImageClick
}) {

    return (
        <TouchableOpacity style={cardstyle}
            onPress={() => {
                // if (club == 0) {
                onPressClub();
                // }
            }}>
            {(club == 1 && app_club == 1) &&
                <View style={{
                    justifyContent: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <SvgXml width="25"
                            height="25"
                            xml={ShieldFail} />
                        <Text
                            style={{
                                color: header_background_color,
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Black"
                                    : "Radomir Tinkov - Gilroy-Black",
                                fontSize: 12,
                                fontWeight: '700'
                            }}>Flash Club</Text>
                    </View>
                </View>
            }

            <View style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
            }}>{club == 0 || app_club == 0 ?
                <View>
                    {user_image != "" ?
                        <Image source={{
                            uri: user_image
                        }}
                            style={{
                                height: 80,
                                width: 80,
                                borderRadius: 40,
                            }} />
                        :
                        <SvgXml width="80"
                            height="80"
                            xml={DefaultAvatar} />
                    }
                </View>
                :
                <TouchableOpacity onPress={onProfileImageClick}>
                    <AnimatedCircularProgress
                        size={80}
                        width={5}
                        fill={percentage}
                        tintColor={header_background_color}
                        backgroundColor={colors.COLOR_WHITE}>
                        {
                            (fill) => user_image != "" ? (
                                <Image source={{
                                    uri: user_image
                                }}
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 60 / 2,
                                    }}
                                />)
                                :
                                (<SvgXml width="60"
                                    height="60"
                                    xml={DefaultAvatar} />
                                )
                        }
                    </AnimatedCircularProgress>
                </TouchableOpacity>}

                {club == 0 || app_club == 0 ?
                    <View style={{
                        justifyContent: 'center',
                        flex: 1.5,
                        marginLeft: 10,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            paddingBottom: 5,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-Black" :
                                "Radomir Tinkov - Gilroy-Black",
                        }}>{preferred_name}</Text>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: "#60626B",
                        }}>{department_name}</Text>
                    </View>
                    :
                    <View style={{
                        justifyContent: 'center',
                        flex: 1.5,
                        marginLeft: 10,
                    }}>
                        <TouchableOpacity onPress={onPressClub}>
                            <Text style={{
                                fontWeight: '600',
                                fontSize: 12,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Black"
                                    : "Radomir Tinkov - Gilroy-Black",

                            }}>Flash Points</Text>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <Text style={{
                                    color: header_background_color,
                                    // fontWeight: '900',
                                    fontSize: 25,
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Gilroy-Black" :
                                        "Radomir Tinkov - Gilroy-Black",
                                }}>{max_month_points}</Text>
                                <Text style={{
                                    fontSize: 25,
                                    // fontWeight: '900',
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Gilroy-Black" :
                                        "Radomir Tinkov - Gilroy-Black",
                                    color: header_background_color,
                                }}>/20</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                <Image
                    source={Constantimages.arrow_right_icon}
                    style={{
                        height: 25,
                        width: 25,
                        tintColor: colors.COLOR_BLACK,
                        resizeMode: 'contain',
                    }}
                />
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
    }
});
