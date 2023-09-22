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
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SvgXml } from 'react-native-svg';
import Darkerinfo from '../../assets/svg/Darkerinfo.svg';
import DefaultAvatar from '../../assets/svg/DefaultAvatar.svg';
import Lighterinfo from '../../assets/svg/Lighterinfo.svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function ClubHeaderCard({ cardstyle,
    header_background_color,
    max_month_points,
    percentage,
    club,
    app_club,
    user_image,
    preferred_name,
    department_name,
    onOpenToolTipInfo,
    landingData,
    toolTipVisible,
    onPressView
}) {
    return (
        <View style={cardstyle}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity
                    onPress={onOpenToolTipInfo}>
                    <Tooltip
                        animated={true}
                        isVisible={toolTipVisible}
                        contentStyle={{
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                        }}
                        content={
                            <View style={{
                                marginHorizontal: 10,
                                borderRadius: 12
                            }}>

                                <Text style={{
                                    fontWeight: 'bold', fontSize: 14,
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 5
                                }}>
                                    {landingData.reference_label}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR,
                                    paddingBottom: 5,
                                    lineHeight: 18
                                }}>{landingData.reference_detail}</Text>
                            </View>
                        }
                        placement='bottom'
                        onClose={onOpenToolTipInfo}>
                        {/* <SvgXml width="20"
                            height="20"
                            xml={Darkerinfo} /> */}

                        <SvgXml width="20"
                            height="20"
                            // style={{
                            //     left: 16,
                            //     marginRight: 20,
                            //     alignSelf: 'center',
                            // }}
                            xml={Lighterinfo} />
                    </Tooltip>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'

            }}>
                <TouchableOpacity onPress={onPressView}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    {club == 0 || app_club == 0 ?
                        <Image source={user_image != "" ?
                            { uri: user_image }
                            :
                            Constantimages.flash_user_account}
                            style={{
                                height: 80,
                                width: 80,
                                borderRadius: 40,
                                backgroundColor: "rgba(0,0,0,0.5)",
                            }}
                        /> :
                        <AnimatedCircularProgress
                            size={80}
                            width={5}
                            fill={percentage}
                            tintColor={header_background_color}
                            backgroundColor={colors.COLOR_WHITE}>
                            {(fill) =>
                                user_image != "" ?
                                    (<Image source={{ uri: user_image }}
                                        style={{
                                            height: 60,
                                            width: 60,
                                            borderRadius: 60 / 2,

                                        }}
                                    />)
                                    :
                                    (<SvgXml width="60"
                                        height="60"
                                        xml={DefaultAvatar} />)
                            }
                        </AnimatedCircularProgress>
                    }
                </TouchableOpacity>
                {club == 0 || app_club == 0 ?
                    <View style={{ justifyContent: 'center', flex: 1.5, marginLeft: 18, }}>
                        <Text style={{
                            fontWeight: 'bold', fontSize: 16, paddingBottom: 5,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Black"
                                : "Radomir Tinkov - Gilroy-Black",
                        }}>{preferred_name}</Text>

                        <Text style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: "#60626B",
                        }}>
                            {department_name}</Text>
                    </View>
                    :
                    <View style={{ justifyContent: 'center', flex: 1.5, marginLeft: 18, }}>
                        <Text style={{ fontWeight: 'bold', }}>
                            {/* Flash Points */}
                            Monthly Flash Points
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Text style={{
                                color: header_background_color,
                                // fontWeight: '500',
                                fontSize: 25,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Black" :
                                    "Radomir Tinkov - Gilroy-Black",

                            }}>{max_month_points}</Text>
                            <Text style={{
                                fontSize: 25,
                                // fontWeight: '300',
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Black" :
                                    "Radomir Tinkov - Gilroy-Black",
                                color: header_background_color,
                            }}>/20</Text>
                        </View>
                    </View>
                }
                {/* <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 0.5, }}>
                    <Image
                        source={Constantimages.flash_arrow_icon}
                        style={{
                            height: 20,
                            resizeMode: 'contain',
                        }}
                    >
                    </Image>
                </View> */}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({

});
