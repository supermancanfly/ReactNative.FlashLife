
// DropdownButton

import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Keyboard,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/StyleComponents';

export default function DropdownButton({ selectedsupporttypevalue, placeholder, onClearFilter, isFromLeaderboard }) {

    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <TextInput
                style={{
                    color: colors.COLOR_BLACK,
                    flex: 1,
                    fontSize: 15,
                }}
                placeholder={placeholder == "" ? "Select Support Type" : placeholder}
                underlineColorAndroid="transparent"
                value={selectedsupporttypevalue}
                editable={false}
                scrollEnabled={false}
                multiline={true}
                onSubmitEditing={() => { Keyboard.dismiss() }}
            />
            {(selectedsupporttypevalue != 'All Departments' && isFromLeaderboard) ? <Ionicons name='close' color={colors.COLOR_RED} size={25} style={{
                marginHorizontal: 10
            }} onPress={onClearFilter} /> : <></>}

        </View>
    )
}
const styles = StyleSheet.create({
});
