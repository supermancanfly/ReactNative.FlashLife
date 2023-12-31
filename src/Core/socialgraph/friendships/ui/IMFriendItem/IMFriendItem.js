import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { IMConversationIconView } from '../../../../chat';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { FriendshipConstants } from '../..';

const IMFriendItem = memo((props) => {
  const {
    item,
    index,
    onFriendAction,
    onFriendItemPress,
    displayActions,
    appStyles,
    followEnabled,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const user = item.user;
  let actionTitle = followEnabled
    ? FriendshipConstants.localizedFollowActionTitle(item.type)
    : FriendshipConstants.localizedActionTitle(item.type);

  var name = 'No name';
  /**
   * 02-09-2022
    @param {} displayActions 
    @param {} actionTitle 
   * @returns 
   */
  // if (user.firstName && user.lastName) {
  //   name = user.firstName + ' ' + user.lastName;
  // } else if (user.fullname) {
  //   name = user.fullname;
  // } else if (user.firstName) {
  //   name = user.firstName;
  // }

  if (user.preferredName) {
    // console.log("preferred Name",user.preferredName);
    name = user.preferredName + ' ' + user.lastName;
  } else {
    name = user.firstName + ' ' + user.lastName;
  }

  const renderActions = (displayActions, actionTitle) => {
    if (displayActions && actionTitle) {
      return (
        <TouchableOpacity
          style={
            followEnabled
              ? styles.addFlexContainerFollow
              : styles.addFlexContainer
          }
        // onPress={() => onFriendAction(item, index)}
        >
          <TouchableOpacity
            // onPress={() => onFriendAction(item, index)}
            style={followEnabled ? [styles.followButton] : [styles.addButton]}>
            <Text
              style={
                followEnabled
                  ? [styles.followActionTitle]
                  : [styles.name, { padding: 0 }]
              }>
              {actionTitle}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      // onPress={() => onFriendItemPress && onFriendItemPress(item)}
      style={styles.friendItemContainer}
      onPress={() => onFriendAction(item, index)}
    >
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[user]}
          appStyles={appStyles}
        />
        {name && <Text style={styles.name}>{name}</Text>}
      </View>
      {/* {renderActions(displayActions, actionTitle)} */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
});

IMFriendItem.propTypes = {
  onFriendAction: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  actionIcon: PropTypes.bool,
  item: PropTypes.object,
  index: PropTypes.number,
};

IMFriendItem.defaultProps = {
  displayActions: true,
};

export default IMFriendItem;
