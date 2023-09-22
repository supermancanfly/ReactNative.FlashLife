import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, Image, Text, View, Dimensions, StyleSheet } from "react-native";
import ButtonImageTitle from "../../../../components/shared/ButtonImageTitle";
import Constantimages from "../../../../utils/ConstantImages";
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";
import Markdown, { MarkdownIt, hasParents } from 'react-native-markdown-display';
import CustomizedAccordion from "./CustomizedAccordion";
import IconGroupView from "./IconGroupView";
import VerticalGroupView from "./VerticalGroupView";
import Icon from "react-native-vector-icons/Ionicons";
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg';
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import { SvgXml } from "react-native-svg";
const mdStr = `**bold text** and *italic text*.`;
const markdownItInstance = MarkdownIt({ typographer: true, html: true });
const rules = {
    html_inline: (node, children, parent, styles) => {
        if (node.content.trim() === '<br>') {
            return <Text key={node.key}>{'\n'}</Text>
        }

        return null;
    }
}
const LeassonBasicInfo = (props) => {
    const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(null)
    const [expandedIndexes, setExpandedIndexes] = useState([])
    const [lessonGroupItemCheckedIndex, setLessonGroupItemCheckedIndex] = useState(-1)
    // console.log("onItem data", JSON.stringify(props));
    useEffect(() => {
        setLessonGroupItemCheckedIndex(-1)
    }, [props.onItemData])
    const checkCanNext = () => {
        console.log("Check Can Next")
        if (props.onItemData != null && props.onItemData.length) {
            if (props.onItemData[0].groupPresentationType == "Checklist Immediate" || props.onItemData[0].groupPresentationType == "Checklist Progressive") {
                if (props.onItemData[0].lessonStepItemGroupItems.length == lessonGroupItemCheckedIndex + 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return true
            }
        }
        return true
    }
    const bottomView = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30

        }}>{props.backButtonEnable && <TouchableOpacity style={styles.button_style}
            onPress={props.onBack}>
            <Image
                source={Constantimages.flash_arrow_icon}
                style={[styles.image_Style, { marginLeft: 5, transform: [{ rotate: '180deg' }] }]}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.title_style}>Back
                </Text>
            </View>
        </TouchableOpacity>}
            <ButtonImageTitle
                type={"check"}
                disabled={!checkCanNext()}
                title={'Next'}
                imagesrc={Constantimages.forword_double_arrow}
                imagestyle={styles.image_Style}
                style={styles.button_style}
                titleStyle={styles.title_style}
                buttonPress={props.onNext}
            />
        </View>
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <ScrollView style={{ flex: 1, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: '#676767',
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>{props.courseTitle}</Text>
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.sm,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>LESSON {props.lessonNum}: {props.subTitle}</Text>

                    {props.lessonTitle.map((item, index) => {
                        return <Text
                            key={index}
                            style={{
                                fontSize: 25,
                                marginVertical: 5,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>{item.title}</Text>
                    })}

                    {props.onItemData && props.onItemData.map((item, index) => {
                        return (
                            <View key={index} style={{ width: "100%" }}>

                                {
                                    item.groupPresentationType == "Inline" && <><Markdown style={{
                                        body: {
                                            fontSize: fontsProps.md,
                                            marginVertical: 5,
                                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                        }
                                    }}>
                                        {item.lessonStepItemGroupItems[0].body}
                                        {/* {mdStr} */}
                                    </Markdown>
                                        {item.lessonStepItemGroupItems[0].mobileImage != null && <FastImage source={{ uri: `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${item.lessonStepItemGroupItems[0].mobileImage}` }} style={{ width: "100%", height: 300 }} />}

                                    </>
                                }
                                {
                                    item.groupPresentationType == "Accordion" && item.lessonStepItemGroupItems.map((groupItem, index) => {
                                        return <CustomizedAccordion
                                            key={index}
                                            style={{
                                                borderRadius: 5,
                                                borderColor: "green"
                                            }}
                                            isExpanded={expandedIndexes.indexOf(index) != -1}
                                            onRequestExpanded={() => {
                                                console.log("Expanded??")
                                                // setExpandedAccordionIndex(index)
                                                if (expandedIndexes.indexOf(index) == -1) {
                                                    setExpandedIndexes([...expandedIndexes, index])
                                                    console.log("add")
                                                }
                                                else {
                                                    let newExpandedIndexes = expandedIndexes.filter(element => {
                                                        return element != index
                                                    })
                                                    setExpandedIndexes(newExpandedIndexes)
                                                    console.log("remove")
                                                }
                                            }}
                                            title={groupItem.title}>
                                            <Markdown
                                                rules={rules}
                                                markdownit={markdownItInstance}
                                                style={{
                                                    body: {
                                                        fontSize: fontsProps.md,
                                                        marginVertical: 5,
                                                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                                    },
                                                    link: {
                                                        color: 'blue'
                                                    }
                                                }}>
                                                {groupItem.body}
                                            </Markdown>
                                            {groupItem.mobileImage != null && <FastImage source={{ uri: `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${groupItem.mobileImage}` }} style={{ width: "100%", height: 300 }} />}
                                            {groupItem.tipContent != null && groupItem.tipContent != '' && <View
                                                style={{
                                                    borderRadius: 5,
                                                    backgroundColor: colors.COLOR_LIGHT_INFO,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    padding: 5,
                                                    justifyContent: 'space-between'

                                                }}
                                            >
                                                <Icon
                                                    name={'alert-circle'} size={20} color={'blue'}
                                                ></Icon>
                                                <Text
                                                    style={{ paddingRight: 5 }}
                                                >{groupItem.tipContent}</Text>
                                            </View>}
                                        </CustomizedAccordion>
                                    })
                                }
                                {
                                    item.groupPresentationType == "Checklist Progressive" && <>
                                        {
                                            item.lessonStepItemGroupItems.map((groupItem, index) => {
                                                if (index <= lessonGroupItemCheckedIndex + 1) {
                                                    return <View
                                                        style={{
                                                            // display: index > lessonGroupItemCheckedIndex + 1 ? "none": 'block',
                                                            // borderBottomWidth : index == item.lessonStepItemGroupItems.length - 1 ? 0 : 1, 
                                                        }}
                                                    >
                                                        <View style={{
                                                            marginTop: 5, alignItems: 'center', width: "100%", flexDirection: 'row',
                                                        }}>
                                                            <View
                                                                style={{
                                                                    marginTop: 5, alignItems: 'center', flexDirection: 'row', flex: 10
                                                                }}>
                                                                {groupItem.titleIcon != "" && <Image
                                                                    // source={{ uri: `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${groupItem.titleIcon}` }}
                                                                    style={{ flex: 1, padding: 2, margin: 2, aspectRatio: 1 }}
                                                                    resizeMode={'center'} />}

                                                                <TouchableOpacity
                                                                    disabled={index != lessonGroupItemCheckedIndex + 1}
                                                                    style={{
                                                                        paddingBottom: index == item.lessonStepItemGroupItems.length - 1 ? 0 : 5, marginTop: index == 0 ? 0 : 5, borderBottomColor: 'grey',
                                                                        flex: 9,
                                                                    }}
                                                                    onPress={() => {
                                                                        if (index == lessonGroupItemCheckedIndex + 1) {
                                                                            setLessonGroupItemCheckedIndex(index)
                                                                        }
                                                                    }}>
                                                                    <View
                                                                        style={{

                                                                            marginLeft: 10
                                                                        }}
                                                                    >
                                                                        {groupItem.title != "" && <Text style={{
                                                                            fontSize: 14,
                                                                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                        }}>{groupItem.title}</Text>}
                                                                        <Markdown
                                                                            rules={rules}
                                                                            markdownit={markdownItInstance}
                                                                            style={{
                                                                                body: {
                                                                                    fontSize: fontsProps.md,
                                                                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                                                                },
                                                                                paragraph: { marginBottom: 0, marginTop: 0 },
                                                                                link: {
                                                                                    color: 'blue'
                                                                                }
                                                                            }}>
                                                                            {groupItem.body}
                                                                        </Markdown>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>



                                                            <SvgXml xml={(index <= lessonGroupItemCheckedIndex ? CheckCircleFill : CheckCircleGreen)} height={20} width={20} />


                                                        </View>
                                                        {groupItem.tipContent != "" && <View
                                                            style={{
                                                                borderRadius: 5,
                                                                backgroundColor: colors.COLOR_LIGHT_INFO,
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                padding: 5,
                                                                justifyContent: 'space-between',
                                                                opacity: index > lessonGroupItemCheckedIndex + 1 ? 0.1 : 1,
                                                                transitionDelay: '500ms',
                                                                transitionProperty: 'opacity',
                                                            }}
                                                        ><Icon
                                                            name={'alert-circle'} size={20} color={'blue'}
                                                        ></Icon>
                                                            <Text
                                                                style={{ paddingRight: 5, flex: 10 }}
                                                            >{groupItem.tipContent}</Text>
                                                        </View>}</View>
                                                }
                                                else {
                                                    return <></>
                                                }
                                            })
                                        }
                                    </>
                                }
                                {
                                    item.groupPresentationType == "Checklist Immediate" && <>
                                        {
                                            item.lessonStepItemGroupItems.map((groupItem, index) => {
                                                return <View
                                                    style={{
                                                        // borderBottomWidth : index == item.lessonStepItemGroupItems.length - 1 ? 0 : 1, 
                                                    }}
                                                >
                                                    <View style={{ marginTop: 5, alignItems: 'center', width: "100%", flexDirection: 'row' }}>
                                                        <View
                                                            style={{
                                                                opacity: index > lessonGroupItemCheckedIndex + 1 ? 0.1 : 1,
                                                                marginTop: 5, alignItems: 'center', flexDirection: 'row', flex: 10
                                                            }}>
                                                            {groupItem.titleIcon != "" && <Image
                                                                // source={{ uri: `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${groupItem.titleIcon}` }}
                                                                style={{ flex: 1, padding: 2, margin: 2, aspectRatio: 1 }}
                                                                resizeMode={'center'} />}

                                                            <TouchableOpacity
                                                                disabled={index != lessonGroupItemCheckedIndex + 1}
                                                                style={{
                                                                    paddingBottom: index == item.lessonStepItemGroupItems.length - 1 ? 0 : 5, marginTop: index == 0 ? 0 : 5, borderBottomColor: 'grey',
                                                                    flex: 9,
                                                                }}
                                                                onPress={() => {
                                                                    if (index == lessonGroupItemCheckedIndex + 1) {
                                                                        setLessonGroupItemCheckedIndex(index)
                                                                    }
                                                                }}>
                                                                <View
                                                                    style={{

                                                                        marginLeft: 10
                                                                    }}
                                                                >
                                                                    {groupItem.title != "" && <Text style={{
                                                                        fontSize: 14,
                                                                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                                    }}>{groupItem.title}</Text>}
                                                                    <Markdown
                                                                        rules={rules}
                                                                        markdownit={markdownItInstance}
                                                                        style={{
                                                                            body: {
                                                                                fontSize: fontsProps.md,
                                                                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                                                            },
                                                                            paragraph: { marginBottom: 0, marginTop: 0 },
                                                                            link: {
                                                                                color: 'blue'
                                                                            }
                                                                        }}>
                                                                        {groupItem.body}
                                                                    </Markdown>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>



                                                        <SvgXml xml={(index <= lessonGroupItemCheckedIndex ? CheckCircleFill : CheckCircleGreen)} height={20} width={20} />


                                                    </View>
                                                    {groupItem.tipContent != "" && <View
                                                        style={{
                                                            borderRadius: 5,
                                                            backgroundColor: colors.COLOR_LIGHT_INFO,
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            padding: 5,
                                                            justifyContent: 'space-between',
                                                            opacity: index > lessonGroupItemCheckedIndex + 1 ? 0.1 : 1,
                                                            transitionDelay: '500ms',
                                                            transitionProperty: 'opacity',
                                                        }}
                                                    ><Icon
                                                        name={'alert-circle'} size={20} color={'blue'}
                                                    ></Icon>
                                                        <Text
                                                            style={{ paddingRight: 5, flex: 10 }}
                                                        >{groupItem.tipContent}</Text>
                                                    </View>}</View>
                                            })
                                        }
                                    </>
                                }
                                {
                                    item.groupPresentationType == "Icon List" && <IconGroupView
                                        lessonStepItemGroupItems={item.lessonStepItemGroupItems}
                                    />
                                }
                                {
                                    item.groupPresentationType == "Vertical List" && <VerticalGroupView
                                        lessonStepItemGroupItems={item.lessonStepItemGroupItems}
                                    />
                                }

                                {/* <Markdown>{mdStr}</Markdown> */}

                            </View>
                        )
                    })}


                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={props.sections}
                    earnedPoints={props.earnedPoints}
                    progressbarColor={'#B8B8B8'} />
                {bottomView()}

            </ScrollView>
        </View>
    )
}
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
export default LeassonBasicInfo;
