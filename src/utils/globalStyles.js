import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import { colors, fontFamilyStyles } from '../utils/StyleComponents';
export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    fabbutton: {
        position: 'absolute',
        width: 40,
        height: 40,
        right: 20,
        bottom: 20,
        backgroundColor: colors.GRIDCOLOR,
        borderRadius: 25,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editfabbutton: {
        position: 'absolute',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        right: 10,
        bottom: 10,
        backgroundColor: colors.GRIDCOLOR,
        borderRadius: 25,
        padding: 5,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fabIcon: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },
    editfabIcon:
    {
        tintColor: colors.COLOR_WHITE,
        height: 15,
        width: 15,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    searchView: {
        flexDirection: 'row',
        height: 40,
        borderWidth: 1,
        borderColor: '#009688',
        borderRadius: 7,
        backgroundColor: "#FFFFFF"
    },
  
})