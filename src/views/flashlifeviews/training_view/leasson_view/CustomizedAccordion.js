import React, {  useEffect, useState } from "react";
import { Platform, TouchableOpacity , SafeAreaView, ScrollView, Image, Text, View, Dimensions, StyleSheet } from "react-native";
import  Icon  from "react-native-vector-icons/Ionicons";
// import { TouchableOpacity } from "react-native-gesture-handler";

const CustomizedAccordion = (props) => {
    const [isExpanded, setIsExpanded] = useState(props.isExpanded ?? false);
    useEffect(()=>{
        setIsExpanded(props.isExpanded)
    }, [props])
    return (
        <View style={{
            // backgroundColor: '#EAEDF2',
            padding: 10,
            borderRadius: 5,
            borderColor : 'grey',
            borderWidth: 1,
            marginBottom: 5
            
        }}>
            <TouchableOpacity onPress={() => props.onRequestExpanded()}>
                <View style={{ flexDirection: 'row',}}>
                  <Text style={{
                    fontSize: 14,
                    textAlign: 'center',
                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold"
                  }}>{props.title}</Text>
                  <View
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        }}
                    >
                    <Icon
                        
                        name={isExpanded ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={20} color={isExpanded ? 'grey' : 'green'}
                    >
                </Icon>
                  </View>
                  
               </View>
            </TouchableOpacity>
            
            {
                isExpanded && props.children
            }
            {/* {props.children} */}
        </View>
    );
}

export default CustomizedAccordion