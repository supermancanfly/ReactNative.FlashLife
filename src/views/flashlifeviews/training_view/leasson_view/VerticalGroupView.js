import React from "react";
import { Platform, TouchableOpacity, SafeAreaView, ScrollView, Image, Text, View, Dimensions, StyleSheet } from "react-native";
import Markdown, { MarkdownIt, hasParents } from 'react-native-markdown-display';
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import { SvgXml } from 'react-native-svg'
import CheckCircleGreen from '../../../../assets/svg/checkverticalicon.svg';


const markdownItInstance = MarkdownIt({ typographer: true, html: true });
const rules = {
    html_inline: (node, children, parent, styles) => {
        if (node.content.trim() === '<br>') {
            return <Text key={node.key}>{'\n'}</Text>;
        }
        return null;
    },
};
const isDebug = true;

const IconGroupView = (props) => {
    return (
        <View style={{
            padding: 5,
            marginRight: 20
        }}>
                {console.log("SSSS")}
            {props.lessonStepItemGroupItems.sort((a, b) => (a.itemNumber - b.itemNumber)).map((tp, idx) => {
                console.log(tp)
                if (tp.body.length > 3) {
                    return (
                        <View key={idx} style={{ flexDirection: 'row' }}>
                            <SvgXml
                                xml={CheckCircleGreen}
                                width={20}
                                height={20}
                                style={{ marginRight: 5, marginTop: 15 }}
                            />
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
                                {tp.body}
                            </Markdown>
                        </View>
                    )
                }
            })}
        </View>
    );
}

export default IconGroupView;
