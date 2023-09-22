import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator } from 'react-native';

import IMConversationView from '../IMConversationView';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { TNEmptyStateView } from '../../truly-native';
import { colors } from '../../../utils/StyleComponents';

const IMConversationList = memo((props) => {
  const {
    onConversationPress,
    emptyStateConfig,
    conversations,
    loading,
    user,
    appStyles,
  } = props;

  // console.log("After click on Message Tab");
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const renderConversationView = ({ item, index }) => (
    <View>
      <IMConversationView
        onChatItemPress={onConversationPress}
        item={item}
        appStyles={appStyles}
        user={user}
      />
      <View style={{
        height: 1,
        backgroundColor: "#B7BAC2",
        marginLeft: 70
      }} />
    </View>

  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatsChannelContainer}>
        {conversations && conversations.length > 0 && (
          <FlatList
            vertical={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={conversations}
            renderItem={renderConversationView}
            keyExtractor={(item) => `${item.id}`}
            removeClippedSubviews={false}


          />
        )}
        {conversations && conversations.length <= 0 && (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={appStyles}
            />
          </View>
        )}
      </View>
    </View>
  );
});

IMConversationList.propTypes = {
  onConversationPress: PropTypes.func,
  conversations: PropTypes.array,
};

export default IMConversationList;
