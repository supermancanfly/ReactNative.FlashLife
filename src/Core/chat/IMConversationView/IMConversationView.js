import React, { useEffect, } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import IMConversationIconView from './IMConversationIconView/IMConversationIconView';
import { timeFormat } from '../..';
import dynamicStyles from './styles';
import { firebase } from './../../firebase/config';
import { firebaseUser } from './../../../Core/firebase';
// let  title = " ";
function IMConversationView(props) {
  const { onChatItemPress, item, user, appStyles } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const userID = user.userID || user.id;

  let title = '';
  let participant = item.participants[0];
  if (participant.preferredName) {
    title = participant.preferredName + ' ' + participant.lastName;
  } else {
    title = participant.firstName + ' ' + participant.lastName;
  }
  const getIsRead = () => {
    return item.markedAsRead;
  };


  return (
    <TouchableOpacity
      onPress={() => {
        onChatItemPress(item)
      }}
      style={{ flexDirection: 'row', marginVertical: 10 }}>
      <IMConversationIconView
        participants={item.participants}
        appStyles={appStyles}
      />
      <View style={styles.chatItemContent}>
        <Text
          style={[styles.chatFriendName, !getIsRead() && styles.unReadmessage]}>
          {title}
        </Text>
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.message, !getIsRead() && styles.unReadmessage]}>
            {item.content}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[color = appStyles.colorSet[colorScheme].mainSubtextColor,
            fontWeight = '500',
            !getIsRead() && styles.unReadmessage]}>
            {timeFormat(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

IMConversationView.propTypes = {
  item: PropTypes.object,
  onChatItemPress: PropTypes.func,
};

export default IMConversationView;
