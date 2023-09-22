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
import Moment from 'moment'
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function ProfileSubHeaderCard({ cardstyle, preferred_name,
    department_name,
    headertype,
    onEditUser
}) {
    return (
        <View style={cardstyle}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{
                    fontWeight: 'bold', fontSize: 22, paddingBottom: 5,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>{preferred_name}</Text>
                {headertype == "" &&
                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: "#F2F3F5",
                        borderRadius: 38,
                        paddingHorizontal: 10
                    }}
                        onPress={onEditUser}>
                        <Text style={{
                            color: "#60626B",
                            fontSize: 15,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-Regular" :
                                "Radomir Tinkov - Gilroy-Regular",
                        }}>Edit</Text>
                        <Image
                            source={Constantimages.edit_icon}
                            style={{
                                height: 13,
                                tintColor: "#60626B",
                                resizeMode: 'contain',
                            }}
                        />
                    </TouchableOpacity>
                }
            </View>
            {department_name != '' && <View>
                <Text style={{
                    fontWeight: '400',
                    fontSize: 16,
                    paddingBottom: 5,
                    color: "#60626B",
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                }}>{department_name}</Text>
            </View>}

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
