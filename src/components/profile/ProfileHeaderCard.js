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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SvgXml } from 'react-native-svg';
import EmptyProfileAvatar from '../../assets/svg/EmptyProfileAvatar.svg'
export default function ProfileHeaderCard({
    cardstyle,
    header_background_color,
    max_month_points,
    percentage,
    club, app_club,
    user_image,
    preferred_name,
    department_name
}) {

    return (
        <TouchableOpacity style={cardstyle}>
            <View style={{
                justifyContent: 'center',
            }}>
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {club == 0 || app_club == 0 ?
                    <View>
                        {user_image != "" ?
                            <Image
                                source={{
                                    uri: user_image
                                }}
                                style={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: 40,
                                }}
                            >
                            </Image>
                            :
                            <SvgXml width="80"
                                height="80"
                                xml={EmptyProfileAvatar} />
                        }
                    </View>
                    :
                    <AnimatedCircularProgress
                        size={80}
                        width={5}
                        fill={percentage}
                        tintColor={header_background_color}
                        backgroundColor={colors.COLOR_WHITE}>
                        {(fill) => (
                            user_image != "" ?
                                <Image source={{
                                    uri: user_image
                                }}
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 60 / 2,

                                    }}></Image> :

                                <SvgXml width="60"
                                    height="60"
                                    xml={EmptyProfileAvatar} />
                        )}
                    </AnimatedCircularProgress>
                }
                {club == 0 || app_club == 0 ?
                    <View style={{
                        justifyContent: 'center',
                        flex: 1.5,
                        marginLeft: 18,
                    }}>
                    </View> :
                    <View style={{
                        justifyContent: 'center',
                        flex: 1.5,
                        marginLeft: 18,
                    }}><View style={{
                        flexDirection: 'row',
                    }}>
                            <Text style={{
                                fontSize: 25,
                                color: header_background_color,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Black" :
                                    "Radomir Tinkov - Gilroy-Black",
                            }}>{max_month_points}</Text>
                            <Text style={{
                                fontSize: 25,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Black" :
                                    "Radomir Tinkov - Gilroy-Black",
                                color: header_background_color,

                            }}>/20</Text>
                        </View>
                    </View>
                }
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flex: 0.5,
                }}>

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
