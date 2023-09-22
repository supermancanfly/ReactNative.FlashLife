import React from "react";
import { View, Text, Platform, } from 'react-native';
import { SvgXml } from "react-native-svg";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import EmptyProfileAvatar from '../../../../assets/svg/EmptyProfileAvatar.svg';
import { ConstantValues } from "../../../../utils/ConstantValues";
import FastImage from 'react-native-fast-image';
import { parseInt } from "lodash";
const Image=FastImage;
const TrainingCardView = ({ item, onPress }) => {
    const courseProgressIndicatorView = () => {
        let listViews = [];
        for (let index = 0; index < item?.lessons?.total; index++) {
            listViews.push(<View key={index.toString()} style={{
                height: 5,
                flex: 1,
                borderRadius: 30,
                marginHorizontal: 1,
                backgroundColor: (index < item?.lessons?.completed) ? colors.COLOR_THEME : '#E5E5E5'
            }}>
            </View>)

        }
        return listViews;
    }

    // let imageUrl=`https://qacms.flash.co.za/image/${item.defaultIcon}`
    // let imageUrl=`${ConstantValues.LMS_BASE_URL/item.defaultIcon}`
    let imageUrl=`https://prod.za.flashcontentmanager.flash-infra.cloud/image/${item.defaultIcon}`
    return <View style={{
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
    }}>
        <View pointerEvents="none">
            {/* <SvgXml width="50"
                height="50"
                xml={EmptyProfileAvatar}
        
                 /> */}
                <Image source={{uri:imageUrl}} style={{width:50,height:50,resizeMode:'cover'}} />
        </View>
        <View style={{ marginHorizontal: 10, flex: 1 }}>
            <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{item.name}</Text>
              
            {/* <Text style={{
                fontSize: fontsProps.tosm,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{item.description}</Text> */}
            <Text style={{
                fontSize: fontsProps.sm,
                color: colors.COLOR_BLACK,
                paddingVertical:5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{parseInt(item.points)} points</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={{
                fontSize: fontsProps.xl,
                color: colors.COLOR_THEME,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
            }}>{item?.lessons?.completed ?? 0}/{item?.lessons?.total ?? 0}</Text>
            <Text style={{
                fontSize: fontsProps.sm,
                color: '#b8b8b8',
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>Lessons completed</Text>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>{courseProgressIndicatorView()}</View>
        </View>
    </View>
}
export default TrainingCardView;