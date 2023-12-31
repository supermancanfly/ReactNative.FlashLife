import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View,Image } from 'react-native';
// import dynamicStyles from './styles';
// import { useColorScheme } from 'react-native-appearance';
// import FastImage from 'react-native-fast-image';
import { colors } from '../../utils/StyleComponents';
// const Image = FastImage;

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function StoryItem(props) {
  const {
    item,
    index,
    onPress,
    containerStyle,
    imageStyle,
    imageContainerStyle,
    textStyle,
    activeOpacity,
    title,
    appStyles,
    showOnlineIndicator,
  } = props;

  const refs = useRef();
//   const colorScheme = useColorScheme();
//   const styles = dynamicStyles(appStyles, colorScheme);
//   const lastName = item.lastName || '';

  return (
      // console.log("--------------------"+JSON.stringify(item)),
    <TouchableOpacity
      key={index}
      ref={refs}
      activeOpacity={activeOpacity}
      onPress={() => onPress(item, index, refs)}
      style={[{ margin: 8,
        overflow: 'hidden',}, containerStyle]}>
      <View style={[ { width: 66,
      height: 66,
      borderRadius: Math.floor(66 / 2),
      borderColor:'grey',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',},imageContainerStyle]}>
        <Image
          style={[{  width: 60,
            height: 60,
            borderRadius: Math.floor(60 / 2),
            borderColor: 'grey',
            borderWidth: 1,
            overflow: 'hidden',}, imageStyle]}
          source={{ uri: item.profilePictureUrl || defaultAvatar }}
        />
        {/* {showOnlineIndicator && <View style={styles.isOnlineIndicator} />} */}
      </View>
      {/* {title && (
        <Text
          style={[
            styles.text,
            textStyle,
          ]}>{`${item.firstname} ${lastName}`}</Text>
      )} */}
    </TouchableOpacity>
  );
}

StoryItem.propTypes = {
  onPress: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  item: PropTypes.object,
  index: PropTypes.number,
  activeOpacity: PropTypes.number,
  title: PropTypes.bool,
};

export default StoryItem;
