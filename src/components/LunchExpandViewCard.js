// LunchExpandViewCard.js
import React, { Component } from 'react';

import {

    Image,

    Platform,
    LayoutAnimation,
    StyleSheet,
    View, Text,
    ScrollView,
    UIManager,
    TouchableOpacity
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
export default class LunchExpandViewCard extends Component {

    constructor() {

        super();

        this.state = {

            updated_Height: 0

        }
    }

    componentWillReceiveProps(update_Props) {
        // console.log("update_Props"+JSON.stringify(update_Props))
        if (update_Props.item.isSwitch) {
            this.setState(() => {
                return {
                    updated_Height: null
                }
            });
        }
        else {
            this.setState(() => {
                return {
                    updated_Height: 0
                }
            });
        }
    }

    shouldComponentUpdate(update_Props, nextState) {

        if (update_Props.item.isSwitch !== this.props.item.isSwitch) {

            return true;

        }

        return false;

    }

    render() {

        return (

           
            //   <View style={styles.Panel_Holder}>

            //     <TouchableOpacity activeOpacity={0.7} onPress={this.props.onClickFunction} style={styles.Btn}>

            //       <Text style={styles.Panel_Button_Text}>{this.props.item.titlename} </Text>

            //     </TouchableOpacity>

            //     <View style={{ height: this.state.updated_Height, overflow: 'hidden' }}>

            //       <Text style={styles.Panel_text}>

            //         {this.props.item.body}

            //       </Text>

            //     </View>

            //   </View>
            <TouchableOpacity style={styles.Panel_Holder}  onPress={this.props.onClickFunction}>

            <View 
            // onPress={() =>
            // this.onFormQuestion(item)
            // { }
            // onPress={this.props.onClickFunction}
    

                style={{
                    paddingVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    backgroundColor: colors.COLOR_WHITE,
                    elevation: 3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    margin: 3
                }}
            >
                <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}
                >
                    <View style={{
                        flex: 1,
                    }}>
                        <Text style={{ fontSize: 16, color: '#616161', paddingHorizontal: 10 }}>Mon 11 Jan</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}
                    >
                        <Image source={Constantimages.checkfill_icon}
                            style={{
                                width: 25, height: 25, resizeMode: 'contain',
                              
                                // tintColor: this.state.header_background != "" ?
                                //     this.state.header_background :
                                //     colors.COLOR_THEME,
                            }} />
                        <Text style={{
                            fontSize: fontsProps.md,
                            color: colors.GREY_COLOR, 
                            fontWeight: 'bold',
                            paddingHorizontal: 5, textAlign: 'center'
                        }}>{this.props.item.number_of_questions}</Text>
                        <Image source={Constantimages.arrow_down_icon}
                            style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                    </View>
                </View>
               

            </View>
            <View style={{ height: this.state.updated_Height, overflow: 'hidden' }}>

<Text style={styles.Panel_text}>

  {/* {this.props.item.body} */}
hello
</Text>
</View>
            </TouchableOpacity>

        );
    }
}


const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },

    Panel_text: {
        fontSize: 18,
        color: '#000',
        padding: 10
    },

    Panel_Button_Text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 21
    },

    Panel_Holder: {
        // borderWidth: 1,
        // borderColor: '#FF6F00',
        // marginVertical: 5
    },

    Btn: {
        padding: 10,
        backgroundColor: '#FF6F00'
    }

});