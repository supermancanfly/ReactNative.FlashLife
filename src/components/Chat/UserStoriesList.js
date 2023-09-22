import React from 'react';
import { FlatList, ScrollView, I18nManager, View,Text } from 'react-native';

import StoryItem from '../../components/Chat/StoryItem';
import PropTypes from 'prop-types';
import { colors } from '../../utils/StyleComponents';
// import dynamicStyles from './styles';
// import { useColorScheme } from 'react-native-appearance';

function UserStoriesList(props) {
  const {
    data,
    // firebaseUsers,
    onStoryItemPress,
    // onUserItemPress,
    // user,
    // displayUserItem,
    // userItemShouldOpenCamera,
    storyItemContainerStyle,
    // userStoryTitle,
    displayLastName,
    showOnlineIndicator,
    // appStyles,
  } = props;

//   const colorScheme = useColorScheme();
//   const styles = dynamicStyles(appStyles, colorScheme);

  const renderItem = ({ item, index }) => {
    // console.log("item"+JSON.stringify(item));
    // console.log("item.userID"+item.key);
    // const isSeen =
    //   item.items && item.idx + 1 === item.items.length && styles.seenStyle;

    return (
      // <View>
      //   <Text>{item.key}</Text>
      //   </View>
      <StoryItem
        onPress={onStoryItemPress}
        item={{ ...item,
          //  lastName: displayLastName ? item.lastName : ' '
           }}
        index={index}
        title={true}
        // appStyles={appStyles}
        // showOnlineIndicator={showOnlineIndicator && item.isOnline}
        imageContainerStyle={
          storyItemContainerStyle ? storyItemContainerStyle : null
          // isSeen
        }
      />
    );
  };

  return (
    <FlatList
    //   ListHeaderComponent={
    //     displayUserItem ? (
    //       <TNStoryItem
    //         onPress={(item, index, refIndex) =>
    //           onUserItemPress(userItemShouldOpenCamera, refIndex, index)
    //         }
    //         appStyles={appStyles}
    //         title={true}
    //         index={0}
    //         item={{ ...user, firstName: userStoryTitle, lastName: '' }}
    //       />
    //     ) : null
    //   }
      style={{ 
          backgroundColor: colors.COLOR_THEME,
        marginBottom: 5,
        flexDirection: 'row',}}
      data={data}
      inverted={I18nManager.isRTL}
      renderItem={renderItem}
      keyExtractor={(item, index) => index + 'item'}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
}

UserStoriesList.propTypes = {
  data: PropTypes.array,
  onStoryItemPress: PropTypes.func,
  onUserItemPress: PropTypes.func,
  displayUserItem: PropTypes.bool,
  userItemShouldOpenCamera: PropTypes.bool,
  storyItemContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

UserStoriesList.defaultProps = {
  displayLastName: true,
};

export default UserStoriesList;
