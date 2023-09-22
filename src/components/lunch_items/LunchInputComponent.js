import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import Constantimages from "../../utils/ConstantImages"
import { colors } from "../../utils/StyleComponents"
import Moment from 'moment';
import { TextInput } from 'react-native-paper';
var newlabeltext="Any specific requests?";
// LunchInputComponent.js
export default function LunchInputComponent({onChangeTextInput,onFocusChangeTextInput,labletext}){
  
    return (
         
       <TextInput
                                    // ref={input => { this.textInput = input }}
                                    mode="outlined"
                                    style={{
                                         paddingHorizontal: 16,
                                           borderRadius: 8,
                                            // borderWidth: 1,
                                            // borderColor:  '#000000'
                                        // flexDirection: 'row',
                                        // flex:1,
                                        //                                 color: colors.COLOR_BLACK,
                                        //                                 width: '100%',
                                        //                                 textAlignVertical: 'top',
                                                                        
                                        //                                 marginBottom: 5,
                                        //                                 // borderColor: 
                                        //                                 //     colors.COLOR_THEME,
                                                                      
                                        //                                 paddingHorizontal: 10,
                                        //                                 backgroundColor: colors.COLOR_WHITE,
                                        //                                 paddingVertical: Platform.OS == 'ios' ? 30 : null,
                                        //                                 height: Platform.OS == 'ios' ? 70 : null
                                    }}
                                    onFocus={()=>{
                                        // console.log("onFocus1"+newlabeltext)
                                        //  onFocusChangeTextInput(true)
                                      newlabeltext="Notes"
                                        // console.log("onFocus2"+newlabeltext)
                                    }
                                    }
                                    // this.setState({ isPasswordActive: true, })

                                    
                                    onBlur={()=>{
                                        // this.setState({ isPasswordActive: false, })
                                        // onFocusChangeTextInput(true)
                                        if(labletext==""){
                                          newlabeltext="Any specific requests?"
                                        }
                                    }
                                    }
                                        
                                    label={newlabeltext}
                                    value={labletext}
                                //   Any specific requests?
                                    onChangeText={(text)=>{
                                      onChangeTextInput(text)

                                    }
                                        // this.handlePasswordChange
                                        }
                                    theme={
                                        // this.state.invalidpassword != "" ?
                                        // {
                                        //     colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                        // }
                                        // :
                                        {
                                            colors: { text: '#000000', primary: '#000000', underlineColor: 'transparent',
                                            background: '#FFFFFF',
                                            
                                            borderRadius:8 }
                                        }
                                    }
                                   
                                />
    )
}