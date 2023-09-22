import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated, Platform } from 'react-native';
import { colors } from './StyleComponents';
import ApplicationDataManager from '../utils/ApplicationDataManager'
export default class FloatingLabelInputLogin extends Component {
  state = {
    isFocused: false,
    action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground() != null ?
      ApplicationDataManager.getInstance().getActionButtonBackground() : colors.GREY_COLOR,
  };
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
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
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 13],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000000',
          this.state.action_button_background
        ],
      }),
    };
    return (
      <View style={{ paddingTop: 10, }}>
        <Animated.Text style={[labelStyle, { fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold" }]}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{
            fontSize: 13,
            color: '#000000',
            paddingVertical: 5,
            paddingLeft: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555',
            marginTop: 5,
            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"

          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
