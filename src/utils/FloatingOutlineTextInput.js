import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated } from 'react-native';
import { colors } from './StyleComponents';
import ApplicationDataManager from '../utils/ApplicationDataManager'
export default class FloatingOutlineTextInput extends Component {
  state = {
    isFocused: false,
    action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground()!=null?
    ApplicationDataManager.getInstance().getActionButtonBackground():colors.GREY_COLOR,
  };
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
        this.props.value === '' ? 0 : 1);
  }
  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }
  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 20,
      backgroundColor:'white',
      zIndex: 1,
     
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [13, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#555', 
        // colors.COLOR_THEME
        this.state.action_button_background
      ],
      }),
    };
    return (
      <View style={{ 
          paddingTop: 10,
        backgroundColor:'white',
        // alignItems:'center'
flex:1,
    //   paddingLeft:10
       }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{
              flex:1,
            fontSize: 13,
            color: '#000000',
            width: '100%',
            
            // textAlignVertical:'center',
            
           
            // backgroundColor:'transparent',
            backgroundColor:'white',
           
            // borderBottomWidth: 0.5,
            // borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555'
         
            borderWidth:1,
            borderRadius:5
            // borderColor:'green',
          }}
        //   textAlign='center'
        //   textAlignVertical={'top'}
        // textAlignVertical={'bottom'}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
