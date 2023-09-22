import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PixelRatio,
    TouchableOpacity
} from 'react-native';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';

export default function MessagesHeader({ 
    title, backcolor, headerstyle,
     headerlogo, profilename,onaddGroup, buttonPress,rightimage,onBackButtonPressAndroid }) {

    return (
        <View style={
            headerstyle
        }
          
        >
            <TouchableOpacity style={{
                flex: 0.5,
                flexDirection: 'row'
            }}
            onPress={buttonPress}
            >
                <Image
                    source={null}
                    style={{
                        height: 60,
                        resizeMode: 'contain',
                        alignSelf: 'flex-start'
                    }}
                >
                </Image>
                <Image
                    source={headerlogo}
                    style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',

                        alignSelf: 'center'
                    }}
                >
                </Image>
                <Text style={{
                    fontSize: fontsProps.md,
                    color: colors.COLOR_BLACK,
                    alignSelf: 'center',
                    paddingLeft: 5
                }}>
                    {headerlogo != null && "Back"}
                </Text>
            </TouchableOpacity>
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontSize: fontsProps.lg,
                    fontWeight: '700',
                    color: colors.COLOR_WHITE,
                    textAlign: 'center',
                 

                }}
                >
                    {profilename}

                </Text>
            </View>
            <TouchableOpacity style={{
                flex: 0.5,
               

                justifyContent: 'center'

            }}
            onPress={onaddGroup}
            >
                 <Image
                    source={rightimage}
                    style={{
                        width: 30,
                        // height: 25,
                        resizeMode: 'contain',
                        tintColor:colors.COLOR_WHITE,

                        alignSelf: 'flex-end'
                    }}
                >
                </Image>

            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
});
