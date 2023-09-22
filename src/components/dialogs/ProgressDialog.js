import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ActivityIndicator
} from 'react-native';
import { colors, dimensionsProps } from '../../utils/StyleComponents';
const ProgressDialog = ({ visible, title, background, isShowText }) => (
  <Modal
    visible={visible}
    transparent={true}>
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={background != "" ? background : colors.COLOR_WHITE} />
      {(isShowText) && <Text>{title}</Text>}

    </View>
  </Modal>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 35,
    width: dimensionsProps.fullWidth - 35,
    borderRadius: 10,
    backgroundColor: colors.COLOR_WHITE,
    elevation: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "#00000066"
  },
  loadingContent: {
    flex: 3,
    fontSize: 16,
    paddingHorizontal: 10,
  }
})
export default ProgressDialog;