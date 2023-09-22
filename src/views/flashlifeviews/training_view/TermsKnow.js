import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Platform } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { SvgXml } from "react-native-svg";
import { colors, fontsProps } from "../../../utils/StyleComponents";
import TrainingAppbar from "./appbar_view";
import HelpCenterFill from '../../../assets/svg/HelpCenterFill.svg'
import { ConstantValues } from "../../../utils/ConstantValues";
import Constantimages from "../../../utils/ConstantImages";
import ButtonImageTitle from "../../../components/shared/ButtonImageTitle";
import TermsCardView from "./card_view/TermsCardView";
import BottomTabView from "../footer_view/BottomTabView";
import { ApiGetCoursesByCourseId } from "../../../network/Services";
import ProgressDialog from "../../../components/dialogs/ProgressDialog";
const TermsKnow = props => {

    const [glossaryTerms, setGlossaryTerms] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAllCourses()
    }, [])


    const getAllCourses = async () => {
        setIsLoading(true)
        let params = `?courseId=${props.couse_id}`;
        await ApiGetCoursesByCourseId(params).then((responseJson) => {
            setIsLoading(false)
            console.log('API Response:', responseJson)
            setGlossaryTerms({
                title: responseJson.title,
                terms: responseJson.glossaryTerms
            })

        }).catch((e) => {
            setIsLoading(false)
            console.log("Error", e.toString());
        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <TrainingAppbar
                title={'Terms To Know'}
                isShowBack={true}
                onBackPress={props.onBackPress}
            />
            {glossaryTerms ? <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: 15, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>
                    <LinearGradient
                        colors={['rgba(139, 212, 31, 1)', 'rgba(0, 193, 147, 1)']}
                        style={{
                            borderRadius: 10,
                            padding: 15,
                        }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>{glossaryTerms.title}</Text>
                        <Text style={{
                            fontSize: 14,
                            marginVertical: 5,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}>{'Please familiarise yourself with these terms. You can access this glossary throughout this course if you need to.'}</Text>
                    </LinearGradient>
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE,
                        borderRadius: 10,
                        padding: 10,
                        flex: 1,
                        marginVertical: 10,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <SvgXml height={20}
                                width={20}
                                xml={HelpCenterFill}
                            />
                            <Text style={{
                                color: colors.COLOR_THEME,
                                fontSize: fontsProps.md,
                                marginHorizontal: 5,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                            }}>Terms To Know</Text>
                        </View>
                        {glossaryTerms.terms.map((item, index) => (
                            <View key={index.toString()}>
                                {index != 0 && <View style={{ backgroundColor: '#EAEDF2', height: 2, marginVertical: 5 }} />}
                                <TermsCardView item={item} />
                            </View>
                        ))}
                    </View>
                    <ButtonImageTitle
                        type={"check"}
                        title={'Continue to Lesson'}
                        imagesrc={Constantimages.forword_double_arrow}
                        imagestyle={{
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                            tintColor: (ConstantValues.COMPANY_ID_STR == "37") ? colors.COLOR_WHITE : "#B2FA00"
                        }}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_BLACK,
                            borderRadius: 5,
                            elevation: 5,
                            height: ConstantValues.SUBMIT_BUTTON_SIZE,
                        }}
                        titleStyle={{
                            fontSize: 14,
                            color: colors.COLOR_WHITE,
                            textAlign: 'center',
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}
                        buttonPress={props.onPressStart}
                    // props.navigation.navigate('leasson_view')
                    />
                </View>

            </ScrollView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                <Text></Text>
            </View>}
            {/* <BottomTabView /> */}

            {isLoading && <ProgressDialog
                visible={isLoading}
                title={ConstantValues.LOADING_STR}
                background={colors.COLOR_THEME}
            />}
        </SafeAreaView>
    )

}

export default TermsKnow;