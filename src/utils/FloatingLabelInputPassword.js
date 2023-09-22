import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from './StyleComponents';
import Constantimages from './ConstantImages';
import { fontsProps, dimensionsProps, paddingProps } from './StyleComponents';
import PropTypes from 'prop-types';
export default class FloatingLabelInputPassword extends Component {
  state = {
    isFocused: false,
    isPasswordToggle: false,
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
  onChangePasswordToggle = () => {
    this.setState({
      isPasswordToggle: !this.state.isPasswordToggle
    })
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
        outputRange: [13, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#555', colors.COLOR_THEME],
      }),
    };
    return (
      <View style={{ paddingTop: 10 }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <View style={{
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555',
          paddingVertical: 5,
        }}>
          <View style={{ flex: 3 }}>
            <TextInput
              {...props}
              style={{
                fontSize: 13,
                color: '#000000',
                paddingVertical: 5,
                // borderBottomWidth: 0.5, 
                borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555'
              }}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              blurOnSubmit
            />
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => this.props.onChangePasswordToggle}>
              <Image source={
                this.props.isPasswordToggle == true ?
                  Constantimages.hidepassword_toggle_icon
                  :
                  Constantimages.visiblepassword_toggle_icon
              } style={styles.ImageStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
FloatingLabelInputPassword.propTypes = {
  passwordToggle: PropTypes.bool,
  onChangePasswordToggle: PropTypes.func.isRequired,
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  SectionStyle: {
    flexDirection: 'row',
    width: dimensionsProps.fullWidth,
    borderBottomWidth: 0.5,
    margin: 10
  },
  ImageStyle: {
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'contain',
    alignItems: 'center',
    tintColor: colors.COLOR_THEME
  },
});