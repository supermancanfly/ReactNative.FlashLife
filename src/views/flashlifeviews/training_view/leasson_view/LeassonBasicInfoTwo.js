import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View, Image, StyleSheet, ScrollView } from "react-native";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";


const LeassonBasicInfoTwo = ({ props, onNext, onBack, onItemData }) => {

    // const body=onItemData.lessonSteps[1].lessonStepItemGroups[0].lessonStepItemGroupItems[0]
    // let imageUrl=`https://qacms.flash.co.za/image/${body.mobileImage}`

    const [itemBody, setItemBody] = useState()


    useEffect(() => {
        getItemdata()
    }, [])

    const getItemdata = () => {

        const data = onItemData.lessonSteps[1].lessonStepItemGroups
        let itembody = [];
        data.forEach(element => {
            for (let index = 0; index < element.lessonStepItemGroupItems.length; index++) {
                const newElement = element.lessonStepItemGroupItems[index];

                itembody.push(newElement)

            }
        });
        setItemBody(itembody)
    }


    const bottomView = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom:30

        }}>
            <TouchableOpacity style={styles.button_style}
                onPress={onBack}>
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
            />
        </View>
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{
                flex: 1,
                backgroundColor: '#EAEDF2'
            }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: '#676767',
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>WATER AND ELECTRICITY SALES</Text>
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.sm,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>LESSON 1: {onItemData.title.toUpperCase()}</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{onItemData.lessonSteps[1].title}</Text>

                    {itemBody && itemBody.map((item, index) => {
                        return (
                            <View key={index} >
                                <Text style={{
                                    fontSize: fontsProps.md,
                                    marginVertical: 5,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.body}</Text>
                                <Image source={{ uri: `https://qacms.flash.co.za/image/${item.mobileImage}` }} style={{ width: "100%", height: 400 }} />

                            </View>
                        )
                    })}




                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    progressbarColor={'#B8B8B8'}
                    sections={onItemData.lessonSteps.length}
                    earnedPoints={onItemData.lessonSteps[1].stepNumber}

                />
                {bottomView()}
            </View>
        </ScrollView>
    )
}
export default LeassonBasicInfoTwo;

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