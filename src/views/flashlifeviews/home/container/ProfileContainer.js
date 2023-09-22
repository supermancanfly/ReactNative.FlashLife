// import React from 'react'
// import { useState } from 'react';
// import { } from 'react-native';
// import FlashProfileView from '../../FlashProfileView';

// const ProfileContainer = (props) => {
//     const [isChildSelected, setChildSelected] = useState(false);

//     const processData = () => {
//         if (isChildSelected) {
//             setChildSelected(false);
//         }
//     }

//     const onPress = () => {
//         props.navigation.navigate('Register')
//     }

//     return (
//         <View>
//             <FlashProfileView
//                 onProfileDisplay={() => { }}
//                 onPress={this.onPress}
//                 title="profiletab"
//                 isViewChange={isChildSelected}
//                 navigation={props.navigation}
//                 userData={props.userData}
//                 featureData={props.featureData}
//                 homeLocationData={props.homeLocationData}
//                 callBackForMoreTabInFlashProfileView={(value) => { this.onChangeTabView(value) }}
//             />
//         </View>
//     )
// }

// export default ProfileContainer;