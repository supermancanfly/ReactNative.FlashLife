import { PermissionsAndroid,Platform,Alert } from 'react-native';
export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert("You can use the location");
      this.enableLocationService();
    } else {
      Alert.alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}
