import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
export default function CardListBItem({ item, index, cardstyle, header_background_color, onPress }) {
    // console.log("title" + item)
    return (
        <View>
            <View style={{
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 12,
                marginRight: 5,
                elevation: 3,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                marginTop: index == 0 ? 0 : 10,
            }}>
                <View style={{ flex: 1, flexDirection: 'row', margin: 18, }}>
                    <View style={{ flex: 1, }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Image
                                source={item.icon}
                                style={styles.icon}
                            >
                            </Image>
                            <Text style={{
                                paddingLeft: 6, color: item.color, fontWeight: '700'
                            }}>{item.headertitle}</Text>
                        </View>

                        <View>
                            <Text style={{
                                fontWeight: 'bold', flexWrap: 'wrap',
                                fontSize: 16, paddingTop: 8
                            }}>{item.title}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={() => {
                            onPress(item)
                        }}>
                        <Image
                            source={item.isActive ? Constantimages.arrowup_icon : Constantimages.arrow_down_icon}
                            style={{
                                height: item.isActive ? 17 : 30,
                                width: item.isActive ? 17 : 30,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                tintColor: colors.GREY_COLOR

                            }}
                        >
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
            {
                (item.content_type == 14 && item.isActive) &&
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 12,
                    marginRight: 5,
                    elevation: 3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    // marginTop: index == 0 ? 0 : 10,
                    marginTop:  10,
                }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 18, marginHorizontal: 15 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Image
                                source={item.icon}
                                style={styles.icon}
                            >
                            </Image>
                            <Text style={{ paddingLeft: 6, color: item.color, fontWeight: '700' }}>{item.headertitle}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeContainer}
                            onPress={() => {
                                onPress(item)
                            }}>
                            <Image
                                source={item.isActive ? Constantimages.close_icon : Constantimages.close_icon}
                                style={{
                                    height: item.isActive ? 17 : 30,
                                    width: item.isActive ? 17 : 30,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    tintColor: colors.GREY_COLOR
                                }}
                            >
                            </Image>
                        </TouchableOpacity>
                    </View>
                    {
                        item.subList.map((subitem, index) => (
                            <View style={{}}>
                               <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                               <View style={{
                                    padding: 9,
                                }}>
                                    <Text style={styles.title}>
                                        {subitem.name}
                                    </Text>
                                    <Text style={styles.subtitle}>
                                        {subitem.subtitle}
                                    </Text>
                                </View>
                                <View style={{
                                    padding: 9,

                                    justifyContent:'center',
                                    // alignItems:'flex-end'
                                }}>
                                    <Text style={{ fontSize: 16, color: "#60626B", lineHeight: 16,fontWeight:'700'}}>
                                       09 June
                                    </Text>
                                   
                                </View>

                                   </View>
                                {item.subList.length - 1 != index &&
                                    <View style={{ height: 1, backgroundColor: "#F2F3F5", 
                                    // marginVertical: 9
                                }}></View>
                                }
                            </View>
                        ))}
                </View>
            }
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
    },
    title: {
        color: colors.COLOR_BLACK,
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 12, color: "#60626B", lineHeight: 16
    },
    icon: {
        resizeMode: 'contain',
        width: 20,
        height: 20
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
