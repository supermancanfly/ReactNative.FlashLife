// HomeChatComponent.js


import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import Constantimages from "../../utils/ConstantImages"
import { colors } from "../../utils/StyleComponents";
import UserStoriesList from '../../components/Chat/UserStoriesList';
// import { SearchBarAlternate } from '../../..';
// import { TNStoriesTray } from '../../../truly-native';
// import dynamicStyles from './styles';
// import { useColorScheme } from 'react-native-appearance';
// import { IMConversationListView } from '../..';
// import { IMLocalized } from '../../../localization/IMLocalization';

export default function HomeChatComponent(props) {
  const {
    name,
    friends,
    firebaseUsers,
    onSearchBarPress,
    onFriendItemPress,
    // navigation,
    // // appStyles,
    // onSenderProfilePicturePress,
    // onEmptyStatePress,
    // followEnabled,
  } = props;
  //   const colorScheme = useColorScheme();
  //   const styles = dynamicStyles(appStyles, colorScheme);

  //   const emptyStateConfig = {
  //     title: IMLocalized('No Conversations'),
  //     description: IMLocalized(
  //       'Add some friends and start chatting with them. Your conversations will show up here.',
  //     ),
  //     buttonName: IMLocalized('Add friends'),
  //     onPress: onEmptyStatePress,
  //   };

  return (
    <View style={{ flex: 1, backgroundColor: colors.COLOR_WHITE }}>
      <View
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor:colors.COLOR_WHITE,
          margin: 8,
          paddingLeft: 8,
          borderRadius: 12,
          height: 37,
        }}
        // onPress={ }
        >
        <Image style={{
          height: 15,
          width: 15,
          tintColor: colors.GREY_COLOR,
          marginRight: 1,
        }} source={Constantimages.menu_icon} />
        <Text style={{
          padding: 4,
          paddingLeft: 4,
          fontSize: 15,
          color: colors.GREY_COLOR,
          backgroundColor: colors.COLOR_WHITE,
        }}>Home</Text>
        <Image style={{
          height: 15,
          width: 15,
          tintColor: colors.GREY_COLOR,
          marginRight: 1,
        }} source={Constantimages.inscription_icon} />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: colors.COLOR_LIGHT_GRAY,
          margin: 8,
          paddingLeft: 8,
          borderRadius: 12,
          height: 37,
        }}
        // onPress={{}}
        >
        <Image style={{
          height: 15,
          width: 15,
          tintColor: colors.GREY_COLOR,
          marginRight: 1,
        }} source={Constantimages.search_icon} />
        <Text style={{
          padding: 4,
          paddingLeft: 4,
          fontSize: 15,
          color: colors.GREY_COLOR,
          // backgroundColor:colors.COLOR_WHITE,
        }}>Search User</Text>
      </TouchableOpacity>
      <UserStoriesList
            onStoryItemPress={onFriendItemPress}
            storyItemContainerStyle={{  borderWidth: 0,}}
            data={firebaseUsers}
            
            displayLastName={false}
            // appStyles={appStyles}
            showOnlineIndicator={true}
          />
    </View>
  );
}

HomeChatComponent.propTypes = {
    onSearchClear: PropTypes.func,
    onFriendItemPress: PropTypes.func,
    onFriendAction: PropTypes.func,
    onSearchBarPress: PropTypes.func,
    channels: PropTypes.array,
};


