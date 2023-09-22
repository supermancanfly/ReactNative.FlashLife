import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ActivityIndicator
} from 'react-native';
import { colors, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
const LocationProgressDialog = ({ visible, title, background }) => (
  <Modal
    visible={visible}
    transparent={true}
  >
    <View
      transparent={true}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {ConstantValues.PLEASE_WAIT_STR}
        </Text>
        <View style={styles.loading}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={background != "" ? background : colors.COLOR_THEME} />
          </View>
          <View style={styles.loadingContent}>
            <Text>{title}</Text>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: dimensionsProps.fullWidth - 35,
    borderRadius: 5,
    backgroundColor: colors.COLOR_WHITE,
    elevation: 10,
    height: 150,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  loader: {
  },
  loadingContent: {
    fontSize: 16,
    paddingHorizontal: 10,
  }
})
export default LocationProgressDialog;