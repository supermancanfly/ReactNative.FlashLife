import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    PixelRatio
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import Moment from 'moment';
import { SvgXml } from 'react-native-svg';
export default function HeaderHomeLogo({ title, backcolor, headerstyle, headerlogo, profilename, headertitle }) {
    let newsIcon = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.15917 0.833313H12.8418C15.6733 0.833313 17.25 2.46498 17.25 5.26081V14.73C17.25 17.5716 15.6733 19.1666 12.8418 19.1666H5.15917C2.3725 19.1666 0.75 17.5716 0.75 14.73V5.26081C0.75 2.46498 2.3725 0.833313 5.15917 0.833313ZM5.40667 5.10498V5.09582H8.14658C8.54167 5.09582 8.8625 5.41665 8.8625 5.8099C8.8625 6.21415 8.54167 6.53498 8.14658 6.53498H5.40667C5.01158 6.53498 4.69167 6.21415 4.69167 5.81998C4.69167 5.42582 5.01158 5.10498 5.40667 5.10498ZM5.40667 10.6783H12.5933C12.9875 10.6783 13.3083 10.3575 13.3083 9.96331C13.3083 9.56915 12.9875 9.2474 12.5933 9.2474H5.40667C5.01158 9.2474 4.69167 9.56915 4.69167 9.96331C4.69167 10.3575 5.01158 10.6783 5.40667 10.6783ZM5.40667 14.8675H12.5933C12.9591 14.8308 13.235 14.5182 13.235 14.1525C13.235 13.7766 12.9591 13.465 12.5933 13.4283H5.40667C5.13167 13.4008 4.86584 13.5291 4.71917 13.7675C4.5725 13.9966 4.5725 14.2991 4.71917 14.5375C4.86584 14.7666 5.13167 14.9041 5.40667 14.8675Z" fill="#FFFFFF"/>
</svg>`;
    return (
        <View style={headerstyle}>
            <Image
                source={headerlogo}
                style={{
                    width: 90,
                    height: 60,
                    resizeMode: 'contain',
                    alignSelf: 'flex-start'
                }} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: "center"
                }}>
                    <Text style={{
                        fontSize: 28,
                        color: colors.COLOR_WHITE,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                    }}>{headertitle}
                    </Text>
                    {headertitle === 'News' && <SvgXml
                        width={25}
                        height={25}
                        xml={newsIcon}
                        style={{
                            marginHorizontal: 5
                        }}
                        color={colors.COLOR_WHITE}
                    />}

                </View>
                <Text style={{
                    fontSize: 18,
                    color: colors.COLOR_BLACK,
                    paddingVertical: 10,
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Bold" :
                        "Radomir Tinkov - Gilroy-Bold"
                }}>{Moment(new Date()).format("ddd DD MMM")}
                </Text>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
});
