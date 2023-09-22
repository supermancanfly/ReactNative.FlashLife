import React, {  useEffect, useState } from "react";
import { Platform, TouchableOpacity , SafeAreaView, ScrollView, Image, Text, View, Dimensions, StyleSheet } from "react-native";
import  Icon  from "react-native-vector-icons/Ionicons";
import Markdown, { MarkdownIt, hasParents } from 'react-native-markdown-display';
import FastImage from "react-native-fast-image";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
const markdownItInstance = MarkdownIt({typographer: true, html: true});
const rules = {
    html_inline:(node, children, parent, styles) => {
      if(node.content.trim() === '<br>') {
        return <Text key={node.key}>{'\n'}</Text>
      }
  
      return null;
    }
  }
const isDebug = true
const IconGroupView = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    // const [selectedTitle, setSelectedTitle] = useState("");
    // const [selectedBody, setSelectedBody] = useState("");
    // const [sellectedImage, setSellectedImage] = useState(null);
    useEffect(() => {
        setSelectedIndex(0)
        // setSelectedTitle(props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[0].title : "")
        // setSelectedBody(props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[0].body : "")
        // setSellectedImage(props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[0].mobileImage : null)
      }, [props])
    return (
        <View style={{
            // backgroundColor: '#EAEDF2',
            padding: 10,
            
        }}>
            <View
                style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap'}}
            >
            {
                props.lessonStepItemGroupItems.map((element, index) =>{
                    // console.log(element)
                    const imagUri = `${isDebug? 'https://qacms.flash.co.za': 'https://prod.za.flashcontentmanager.flash-infra.cloud'}/image/${element.titleIcon}`
                    console.log(element.tipContent)
                    // return <FastImage source={{ uri:  imagUri}} style={{ width: 50, height: 50 }} />
                    return <TouchableOpacity style={{ flexBasis: '20%', padding: 5}} onPress={() =>{
                        setSelectedIndex(index)
                    }}>
                        <Image source={{ uri:  imagUri}} style={{ 
                            opacity: selectedIndex == index ? 1: 0.5,
                            aspectRatio: 1 }} />
                            <Text numberOfLines={1} style={{ opacity: selectedIndex == index ? 1: 0.5, textAlign: 'center', fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold", fontSize: 14}}>{element.title}</Text>
                    </TouchableOpacity>
                })
            }
            </View>
            <Text
                style={{
                    fontSize: 22,
                    marginVertical: 5,
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                }}>{props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[selectedIndex].title : ""}</Text>
                <><Markdown 
                    rules={rules}
                    markdownit={markdownItInstance}
                    style={{
                        body: {fontSize: fontsProps.md,
                            marginVertical: 5,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",},
                        link: {
                            color: 'blue'
                        }
                    }}>
                        {props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[selectedIndex].body : ""}
                        {/* {mdStr} */}
                        </Markdown>
                        {(props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[selectedIndex].mobileImage : null) != null &&  <FastImage source={{ uri: `https://prod.za.flashcontentmanager.flash-infra.cloud/image/${props.lessonStepItemGroupItems[selectedIndex].mobileImage}` }} style={{ width: "100%", height: 300 }} />}
                        {(props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[selectedIndex].tipContent : null) != null && props.lessonStepItemGroupItems[selectedIndex].tipContent != '' && <View
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
                                                        style={{paddingRight: 5}}
                                                        >{props.lessonStepItemGroupItems.length ? props.lessonStepItemGroupItems[selectedIndex].tipContent : ""}</Text>
                                                    </View>}
                    </>
        </View>
    );
}

export default IconGroupView