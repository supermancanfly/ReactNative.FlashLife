import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PixelRatio,
    TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
const VIEW_WIDTH = 40;
export default function HeaderBackTitleProfile({ title, backcolor, headerstyle, headerlogo, profilename, buttonPress, profilePictureURL }) {
    const [imgErr, setImgErr] = useState(false);
    const defaultAvatar =
        'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

    const onImageError = () => {
        setImgErr(true);
    };
    const userProfileView = () => {
        if (profilePictureURL == "") {
            return <View style={styles.singleChatItemIcon}>
                <FastImage
                    style={styles.singleChatItemIcon}
                    source={{ uri: defaultAvatar }}
                />
            </View>
        } else {
            return <View style={styles.singleChatItemIcon}>
                <FastImage
                    style={styles.singleChatItemIcon}
                    onError={onImageError}
                    source={imgErr ? { uri: defaultAvatar } : { uri: profilePictureURL }}
                />
            </View>
        }

    }
    return (
        <View style={[headerstyle, {
            height: 60,
            justifyContent: "space-between",
            alignItems: "center",
        }]}>
            <View style={{
                justifyContent: "flex-start",
                alignItems: "flex-start", flex: 1
            }}>
                <TouchableOpacity
                    onPress={buttonPress}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: "center",

                    }}>
                        <Image
                            source={headerlogo}
                            style={{
                                width: 20,
                                height: 15,
                                resizeMode: 'contain',
                                alignSelf: 'center'
                            }}
                        />
                        <Text style={{
                            fontSize: fontsProps.lg,
                            color: colors.COLOR_BLACK,
                            fontFamily:
                                Platform.OS === 'ios' ?
                                    "Gilroy-SemiBold" :
                                    "Radomir Tinkov - Gilroy-SemiBold",
                        }}>
                            {headerlogo != null && "Back"}
                        </Text>

                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: (profilename.length > 10 && title != ConstantValues.MESSAGE_LIST) ? 3 : 2,
                flexDirection: "row",
                alignItems: "center",
            }}>
                {(title === ConstantValues.MESSAGE_LIST) ? userProfileView() : <View style={{
                    width: 20
                }}></View>}
                {
                    profilename.length < 4 && <View style={{ width: 25 }}></View>
                }
                {
                    profilename.length < 7 && <View style={{ width: 15 }}></View>
                }
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                        fontSize: fontsProps.xl,
                        color: colors.COLOR_WHITE,
                        textAlign: 'left',
                        flex: 1,
                        marginHorizontal: -10,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-SemiBold" :
                            "Radomir Tinkov - Gilroy-SemiBold"
                    }}>{profilename}
                </Text>
            </View>

        </View>

    )
}
const styles = StyleSheet.create({
    singleChatItemIcon: {
        height: VIEW_WIDTH,
        borderRadius: VIEW_WIDTH / 2,
        width: VIEW_WIDTH,
    },
});
