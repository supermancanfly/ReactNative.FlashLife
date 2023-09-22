// import React from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, Modal
// } from 'react-native';
// import { AppColors } from '../components/app_colors';
// import LinearGradient from 'react-native-linear-gradient';
// import { AppText, ScreenDimens } from '../components/app_constants';
// function VocherCard({ }) {
//     let src = true ? require('../assets/circle_red.png') : require('../assets/circle_green.png');
//     return (
//         // console.log("keyIndex"+keyIndex),
//         <View style={{
//             marginTop: 30,
//             marginHorizontal: 8,
//             justifyContent: 'center',

//         }}>
//             <ImageBackground style={{
//                 width: 145,
//                 height: 145,
//                 zIndex: 1,
//                 position: 'absolute',
//                 paddingHorizontal: 5,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}

//                 source={
//                     src} >

//                 <View style={{ flexDirection: 'row' }}>

//                     <Text style={{
//                         fontSize: 50,
//                         fontWeight: 'bold',
//                         color: AppColors.white_color,
//                         fontStyle: 'italic'
//                     }}>
//                         "0"
//                         <Text style={{ fontSize: 14, color: AppColors.white_color, fontStyle: 'normal' }}> days</Text></Text>
//                 </View>


//                 <Text style={{ fontSize: 15, color: AppColors.white_color }}>TO GO</Text>
//             </ImageBackground>
//             <View style={{
//                 flex: 1,
//                 marginLeft: ScreenDimens.width / 5,
//                 paddingLeft: 65,
//                 paddingRight: 3,
//                 borderRadius: 25,
//                 borderWidth: 1,
//                 borderColor: AppColors.grey_color,
//                 marginHorizontal: 10,
//                 paddingVertical: 12
//             }}>

//                 <View>
//                     <Text style={{ fontSize: 15, marginBottom: 2 }}>COVID - 19</Text>
//                     <View style={{
//                         flex: 1,
//                         flexDirection: 'row',
//                     }}>
//                         <Image style={{
//                             width: 15,
//                             height: 15,
//                             resizeMode: 'center'
//                         }}
//                             source={require('../assets/green_check_icon.png')} />
//                         <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}>you took your last test on
//                             <Text style={{ fontWeight: 'bold' }}> 01-Dec-20
//                             </Text>
//                         </Text>
//                     </View>
//                     {
//                         <View style={{
//                             flexDirection: 'row',
//                         }}>
//                             <Image style={{
//                                 width: 15,
//                                 height: 15,
//                                 resizeMode: 'center'
//                             }}
//                                 source={require('../assets/green_check_icon.png')} />
//                             <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}>
//                                 you tested negative on
//                                 <Text style={{ fontWeight: 'bold' }}> 01-dec-20</Text></Text>
//                         </View>
//                     }
//                     {false &&
//                         <View>
//                             <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}> You have not submitted any test data</Text>

//                         </View>
//                     }

//                     <View style={{
//                         flexDirection: 'row',
//                     }}>
//                         <Image style={{
//                             width: 15,
//                             height: 15,
//                             resizeMode: 'center'
//                         }}
//                             source={require('../assets/grey_lab_icon_small.png')} />
//                         <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}>
//                             yournexttestonstring{" "}

//                             <Text style={{ fontWeight: 'bold' }}>

//                                 next_test_date
//                             </Text></Text>
//                     </View>
//                     {<View style={{
//                         flexDirection: 'row',
//                     }}>
//                         <Image style={{
//                             width: 15,
//                             height: 15,
//                             resizeMode: 'center',
//                             tintColor: 'red'
//                         }}
//                             source={require('../assets/exclamatory.png')} />
//                         <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}>didnotconfirmteststring</Text>
//                     </View>}

//                     {<View style={{
//                         flexDirection: 'row',
//                     }}>
//                         <Image style={{
//                             width: 15,
//                             height: 15,
//                             resizeMode: 'center'
//                         }}
//                             source={require('../assets/red_heart_icon.png')} />
//                         <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}>
//                             doinggreatstring
//                         </Text>
//                     </View>}
//                 </View>
//                 {/* {name == "default" &&
//                     <View>
//                         <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 10, }}> You have not submitted any test data</Text>

//                     </View>
//                 } */}

//                 <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                     colors={[
//                         '#38C2C0',
//                         '#53C3D9',
//                         '#48C3D4',
//                     ]}
//                     style={{
//                         flexDirection: 'row',
//                         marginHorizontal: 5,
//                         borderRadius: 30,
//                         paddingHorizontal: 10,
//                         paddingVertical: 5,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         alignSelf: 'center',
//                         marginVertical: 5
//                     }}
//                 >
//                     <TouchableOpacity style={{
//                     }}

//                     >
//                         <Text style={{ color: AppColors.white_color, textAlign: 'center', fontSize: 12 }}>
//                             {AppText.update_your_info_text}
//                         </Text>
//                     </TouchableOpacity>
//                 </LinearGradient>
//             </View>

//         </View>

//     );
// }

// export default TestCard;