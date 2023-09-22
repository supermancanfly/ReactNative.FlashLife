import { StyleSheet, Dimensions } from 'react-native';
import { colors, fontsProps, fontFamilyProps, dimensionsProps, paddingProps } from './StyleComponents';
export default CommonStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyleTwo: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.GREY_COLOR
  },
  switchtextStyle: {
    fontSize: fontsProps.sm, paddingHorizontal: 5, color: colors.COLOR_WHITE, textAlign: 'center', alignSelf: 'center'
  },
  switchcircleStyle: {
    width: 20,
    height: 20,
    tintColor: colors.COLOR_WHITE,
    paddingHorizontal: 5,
  },
  InputSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GREY_COLOR,
    borderRadius: 5,
    elevation: 3,
    margin: 10
  },
  textInputStyle: {
    height: 50,
    flex: 1,
    paddingVertical: 10,
    borderWidth: 0,
    borderBottomColor: colors.COLOR_WHITE,
  }
})
