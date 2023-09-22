import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
// import { TextInput } from 'react-native-paper';
export default function OutlineFloatingLabelTextInput({ headerstyle, themecolor, title, backcolor, headerlogo,
    profilename, inputvalue, textlabel, onValueChangeText, updateSize, newStyle, item, onFocus }) {
    // console.log("backgroundColor" + themecolor)
    return (
        <View style={{
            backgroundColor: colors.COLOR_WHITE,
            paddingHorizontal: 20,
            fontSize: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: themecolor
        }}>
            <View>
                {/* {themecolor==colors.COLOR_THEME && */}
                <Text
                    style={{
                        fontSize: 12,
                        marginTop: -10,
                        backgroundColor: colors.COLOR_WHITE,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        paddingHorizontal: 5,
                        color: themecolor
                    }}>

                    {textlabel}
                </Text>
                {/* } */}
                <TextInput
                    style={[{
                        flex: 1,
                        width: '100%',
                        minHeight: 30,

                    }]}

                    multiline={true}
                    onChangeText={onValueChangeText}
                    // placeholder={
                        //     themecolor==colors.COLOR_THEME ?
                        //    "": 
                        // textlabel
                    // }
                    onFocus={() => onFocus(colors.COLOR_THEME)}
                    value={inputvalue}
                    onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height, item)}

                />
            </View>

        </View>
        // <View style={{
        //     paddingTop: 10,
        //     // flex: 1,
        // }}>
        //     <Text
        //         style={{
        //             position: 'absolute',
        //             top: 0,
        //             left: 8,
        //             right: 30,
        //             // bottom: 10,
        //             zIndex: 1,
        //             backgroundColor: colors.COLOR_WHITE,
        //             paddingHorizontal: 20,
        //             fontSize:12,
        //             borderRadius: 10,
        //         }}>
        //         {textlabel}
        //    </Text>
        //     <View
        //         style={{
        //             flex: 1,
        //             width: '100%',
        //             borderWidth: 1,
        //             borderRadius: 10,
        //             borderColor: colors.GREY_COLOR,
        //             // zIndex:1,
        //             // overflow: 'hidden',
        //             // backgroundColor:'green'
        //         }}>
        //         <TextInput
        //             style={[ { flex: 1,width:'100%', 
        //             // backgroundColor: 'red',
        //             // margin:30 
        //             // marginVertical:30
        //         minHeight:30,

        //         }]}

        //             multiline={true}
        //             onChangeText={onValueChangeText}
        //             // placeholder={textlabel}
        //             value={inputvalue}
        //             onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height, item)}

        //         />
        //     </View>
        // </View>
        /* <TextInput
        mode="outlined"
        placeholder={textlabel}
        value={selectedsupporttypevalue}
        onChangeText={onValueChangeText}
            // onPress={() => this.uploadComment()}
        multiline={true}
        maxLength={200}
        numberOfLines={5} */
        // />

        //   <TextInput
        //       mode="outlined"
        //       placeholder={textlabel}
        //       onChangeText={onValueChangeText}

        //       style={[newStyle,{backgroundColor:colors.COLOR_WHITE,
        //     }]}
        //       editable
        //       multiline
        //       value={inputvalue}
        //            label={
        //             textlabel
        //         }
        //          theme={
        //             {
        //                 colors: { text: '#000000', primary:themecolor,flexWrap: "wrap"
        //                 }
        //             }
        //         }
        //       onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height,item)}
        //     />
    )
}
const styles = StyleSheet.create({
    container: {
        height: 65,
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        backgroundColor: '#FFF',
        top: -8,
        left: 25,
        padding: 5,
        zIndex: 50,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        justifyContent: 'flex-end',
        borderRadius: 65,
        paddingHorizontal: 25,
    }
});
