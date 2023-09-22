import React from "react";
import { Image, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from 'react-native';
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors } from "../../../../utils/StyleComponents";


const BottomButtonsView = ({ onBack, onNext,disabled ,nextDisabled}) => {
    return <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
    }}>
        <TouchableOpacity style={styles.button_style}
            onPress={onBack} disabled={disabled} >
            <Image
                source={Constantimages.flash_arrow_icon}
                style={[styles.image_Style, { marginLeft: 5, transform: [{ rotate: '180deg' }] }]}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.title_style}>Back
                </Text>
            </View>
        </TouchableOpacity>

        <ButtonImageTitle
            type={"check"}
            title={'Next'}
            imagesrc={Constantimages.forword_double_arrow}
            imagestyle={styles.image_Style}
            style={styles.button_style}
            titleStyle={styles.title_style}
            buttonPress={onNext}
            nextDisabled={nextDisabled}
        />
    </View>
}

export default BottomButtonsView;

const styles = StyleSheet.create({
    image_Style: {

        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: (ConstantValues.COMPANY_ID_STR == "37") ? colors.COLOR_WHITE : "#B2FA00"
    },
    button_style: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.COLOR_BLACK,
        borderRadius: 5,
        elevation: 5,
        height: ConstantValues.SUBMIT_BUTTON_SIZE,
        marginVertical: 10,
        flex: 1,
        marginHorizontal: 5
    },
    title_style: {
        fontSize: 14,
        color: colors.COLOR_WHITE,
        textAlign: 'center',
        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
    }
})