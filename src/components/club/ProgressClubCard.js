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
import Tooltip from 'react-native-walkthrough-tooltip';

import Lighterinfo from '../../assets/svg/Lighterinfo.svg';
import { SvgXml } from 'react-native-svg';

export default function ProgressClubCard({ header_background_color, cardstyle,
    track,
    months,
    gracemonths,
    myClubMonthInfo,
    myClubGraceInfo,
    myClubOnTrackInfo,
    onOpenToolTipMonthsInfo,
    onOpenToolTipGraceMonthsInfo,
    onOpenToolTipTrackToEarnInfo,
    monthsTooltip,
    graceTooltip,
    trackTooltip

}) {
    const monthMembershipView = () => {
        return <View style={styles.rowStyle}>
            <Text style={{
                fontSize: fontsProps.lg,
                color: colors.COLOR_BLACK,
                fontWeight: '700',
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Bold" :
                    "Radomir Tinkov - Gilroy-Bold",
            }}>Months of Membership</Text>
            <View style={{
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    fontSize: 16,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                    color: "#939393",
                    paddingHorizontal: 10
                }}>{months}</Text>
                <TouchableOpacity
                    onPress={
                        onOpenToolTipMonthsInfo
                    }>
                    <Tooltip
                        animated={true}
                        isVisible={monthsTooltip}
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
                                    color: colors.COLOR_BLACK, paddingVertical: 5
                                }}>{myClubMonthInfo.reference_label}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR, paddingBottom: 5,
                                    lineHeight: 18
                                }}>{myClubMonthInfo.reference_detail}</Text>
                            </View>
                        }
                        placement='bottom'
                        onClose={onOpenToolTipMonthsInfo}>
                        <SvgXml width="20"
                            height="20"
                            style={{
                                // left: 16,
                                // marginRight: 20,
                                // alignSelf: 'center',
                            }}
                            xml={Lighterinfo} />
                    </Tooltip>
                </TouchableOpacity>
            </View>

        </View>
    }
    const graceMonthAvailableView = () => {
        return <View style={styles.rowStyle}>
            <Text style={{
                fontSize: fontsProps.lg, color: colors.COLOR_BLACK,
                fontWeight: '700',
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Bold" :
                    "Radomir Tinkov - Gilroy-Bold",
            }}>Grace Months Available</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    fontSize: 16,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                    // color: "#939393",
                    paddingHorizontal: 10,
                    color: (gracemonths == ConstantValues.NO_STR) ?
                        colors.COLOR_DARK_RED :
                        header_background_color,
                }}>{gracemonths}</Text>
                <TouchableOpacity
                    onPress={
                        onOpenToolTipGraceMonthsInfo}>
                    <Tooltip
                        animated={true}
                        isVisible={graceTooltip}
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
                                    color: colors.COLOR_BLACK, paddingVertical: 5
                                }}>{myClubGraceInfo.reference_label}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR, paddingBottom: 5,
                                    lineHeight: 18
                                }}>{myClubGraceInfo.reference_detail}</Text>
                            </View>
                        }
                        placement='bottom'
                        onClose={onOpenToolTipGraceMonthsInfo}>
                        <SvgXml width="20"
                            height="20"
                            // style=
                            // {{
                            //     left: 16,
                            //     marginRight: 20,
                            //     alignSelf: 'center',
                            // }}
                            xml={Lighterinfo} />
                    </Tooltip>
                </TouchableOpacity>
            </View>

        </View>
    }

    trackEarnView = () => {
        return <View style={styles.rowStyle}>
            <View>
                <Text style={{
                    fontSize: fontsProps.lg, color: colors.COLOR_BLACK,
                    fontWeight: '700',
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                }}>On Track to Earn Leave</Text>
                {track == ConstantValues.YES_STR &&
                    <Text style={{
                        fontSize: 12,
                        color: "#60626B",
                        fontWeight: '400',
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-SemiBold" :
                            "Radomir Tinkov - Gilroy-SemiBold",
                    }}>Well done, keep it up!</Text>
                }
            </View>

            <View style={{ flexDirection: 'row' }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    fontSize: 16,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold",
                    color: track == ConstantValues.NO_STR ?
                        colors.COLOR_DARK_RED :
                        header_background_color,
                }}>{track}</Text>
                <TouchableOpacity
                    onPress={
                        onOpenToolTipTrackToEarnInfo
                    }>
                    <Tooltip
                        animated={true}
                        isVisible={trackTooltip}
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
                                    color: colors.COLOR_BLACK, paddingVertical: 5,
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Gilroy-Regular" :
                                        "Radomir Tinkov - Gilroy-Regular",
                                }}>{myClubOnTrackInfo.reference_label}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.GREY_COLOR, paddingBottom: 5,
                                    lineHeight: 18,
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Gilroy-Regular" :
                                        "Radomir Tinkov - Gilroy-Regular",
                                }}>{myClubOnTrackInfo.reference_detail}</Text>
                            </View>
                        }
                        placement='bottom'
                        onClose={onOpenToolTipTrackToEarnInfo}>
                        <SvgXml width="20"
                            height="20"
                            style=
                            {{
                                left: 16,
                                marginRight: 20,
                                alignSelf: 'center',
                            }}
                            xml={Lighterinfo} />
                    </Tooltip>
                </TouchableOpacity>
            </View>

        </View>
    }
    return (<View style={cardstyle}>
        {monthMembershipView()}
        {graceMonthAvailableView()}
        {/* {trackEarnView()} */}
    </View>);

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

    },
    rowStyle: {
        // height: 57,
        width: '100%',
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomColor: "#E3E3E3",
        borderBottomWidth: 1,
    }
});
