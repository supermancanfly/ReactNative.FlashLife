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
const ProgressDialogTop = ({ visible, title }) => (
  <Modal
    visible={visible}
    transparent={true}
  >
    <ActivityIndicator size="small" color={colors.COLOR_WHITE} />
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
    paddingHorizontal: 5,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  loadingContent: {
    flex: 3,
    fontSize: 16,
    paddingHorizontal: 10,
  }
})
export default ProgressDialogTop;