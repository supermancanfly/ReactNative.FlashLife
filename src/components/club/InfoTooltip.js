import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
import Tooltip from 'react-native-walkthrough-tooltip';
export default function InfoTooltip({
    item,
    onOpenToolTipInfo,
    landingData,
    toolTipVisible
}) {
    // console.log(toolTipVisible + "------------------landingData---------------------" + JSON.stringify(item));
    return (
        <TouchableOpacity
            onPress={
                onOpenToolTipInfo
            }
        >
            <Tooltip
                animated={true}
                isVisible={toolTipVisible}
                contentStyle={
                    {
                        alignSelf: 'flex-end',
                        justifyContent: 'center',

                    }
                }

                content={
                    <View style={{
                        marginHorizontal: 10,
                        borderRadius: 12
                    }}>

                        <Text style={{
                            fontWeight: 'bold', fontSize: 14,
                            color: colors.COLOR_BLACK, paddingVertical: 5
                        }}>
                            {item.info_header}
                        
                            </Text>
                        <Text style={{
                            fontSize: 12,
                            color: colors.GREY_COLOR, paddingBottom: 5, lineHeight: 18
                        }}>
                            {item.info_text}</Text>
                    </View>
                }
                placement='bottom'
                onClose={onOpenToolTipInfo}
            >
                <ImageBackground
                    source={Constantimages.general_icon}
                    style={{
                        height: 19,
                        width: 19,
                        resizeMode: 'contain',
                        justifyContent: 'center',
                        // tintColor:colors.COLOR_THEME

                    }}
                >
                </ImageBackground>
            </Tooltip>
        </TouchableOpacity>


    )
}
const styles = StyleSheet.create({

});
