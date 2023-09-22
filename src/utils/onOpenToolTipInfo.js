
import React from 'react';
import {
    Alert,
    View,
    Text
} from 'react-native';
import Mailer from 'react-native-mail';
import Tooltip from 'react-native-walkthrough-tooltip';
export const onOpenToolTipInfo = async (value, toolTipVisible) => {

    return <Tooltip
        animated={true}
        // (Optional) When true,
        // tooltip will animate in/out when showing/hiding
        arrowSize={{ width: 16, height: 8 }}
        // (Optional) Dimensions of arrow bubble pointing
        // to the highlighted element
        backgroundColor="rgba(0,0,0,0.5)"
        // (Optional) Color of the fullscreen background
        // beneath the tooltip.
        isVisible={toolTipVisible}
        // (Must) When true, tooltip is displayed
        contentStyle={
            {
                // backgroundColor:'green' 
                marginLeft: 20,
                marginRight: 0
            }
        }

        content={
            <View style={{ marginHorizontal: 10, borderRadius: 12 }}>
                <Text>hi</Text>
                {/* <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.COLOR_BLACK,paddingVertical:5 }}>{this.state.landingData.card_info_heading}</Text>
        <Text style={{ fontSize: 12, color: colors.GREY_COLOR,paddingBottom:5,lineHeight:18 }}>{this.state.landingData.card_info_text}</Text> */}
            </View>
        }
        // (Must) This is the view displayed in the tooltip
        placement="right"
        // (Must) top, bottom, left, right, auto.
        onClose={() => setToolTipVisible(false)}
    // (Optional) Callback fired when the user taps the tooltip
    />

}
