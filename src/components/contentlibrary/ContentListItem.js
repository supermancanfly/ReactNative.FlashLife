import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
export default function ContentListItem({ item,index,checkPermission,header_background_color }) {
    // console.log("title" + item)
    return (

        <TouchableOpacity style={{
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 5,
            marginHorizontal: 16,
            marginTop: index == 0 ? 10 : 0,
                     borderBottomWidth: 1,
            borderBottomColor:  "#E3E3E3"

           
        }}
            onPress={checkPermission}
        >
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 24
            }}
            >
                {item.file_type == "image" ?
                    <Image source={Constantimages.image_file_place_icon}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: header_background_color,
                        }} />
                    :
                    <Image source={Constantimages.file_place_icon}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: header_background_color
                        }} />
                }
            </View>
            <View style={{
                flex: 1,
            }}
            >
                <View style={{ flex: 0.5 }}>
                    <Text style={{
                        fontSize: fontsProps.lg,
                        color: colors.COLOR_BLACK,
                        fontWeight: '400',
                        fontFamily: "CircularStd-Black",
                        marginHorizontal: 5
                    }}>
                        {item.file_name}
                    </Text>
                </View>
                <View style={{
                    flex: 0.5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginHorizontal: 5
                }}>
                    <Text style={{
                        fontSize: fontsProps.sm,
                        fontWeight: '400',
                        color: colors.GREY_COLOR,
                    }}>
                        {item.file_size},
                                    </Text>
                    <Text style={{
                        fontSize: fontsProps.sm,
                        fontWeight: '400',
                        color: colors.GREY_COLOR,
                    }}>
                        Modified on
                                    </Text>
                    <Text style={{
                        fontSize: fontsProps.sm,
                        fontWeight: '400',
                        color: colors.GREY_COLOR,
                    }}>
                        {" " + Moment(item.added_date).format('YYYY-MM-DD')}
                    </Text>
                </View>
            </View>
            <View style={{
                alignItems: 'center', justifyContent: 'center'
            }}
            >
                <Image source={null}
                    style={{
                        width: 25, height: 25,

                        resizeMode: 'contain', tintColor: '#aeaeae'
                    }} />
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
