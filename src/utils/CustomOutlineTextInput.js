import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 65, 
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: -8,
    left: 25,
    padding: 5,
    zIndex: 50,
  },
  textInput: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: "red",
    justifyContent: 'flex-end',
    height: 44,
    marginHorizontal:15,
    borderRadius: 5,
    paddingHorizontal: 25,
  }
})

const CustomOutlineTextInput = ({ label, style, ...props}) => (
  <View style={{
    height: 65, 
    position: 'relative',}}>
   
      <Text style={{  position: 'absolute',
      left: 0,}}>{label}</Text>
    <TextInput style={{ flex: 1, 
       fontSize: 13,
       color: '#000000',
       paddingVertical: 5,
       borderColor:'red',
       borderWidth: 0.5,}}/>
  </View>
);

export default CustomOutlineTextInput;