import React from 'react';
import {Text, TouchableOpacity} from "react-native";
import { colors } from '../../utils/StyleComponents';
import ProgressDialog from '../dialogs/ProgressDialog';
function ProgressDialogView ({isLoading, title
}) {

    return (
        // <TouchableOpacity style={[style]} onPress={buttonPress}>
        //     {/* <Text style={[{titleStyle}]}>{title}</Text> */}
        //     <Text style={[titleStyle]}>{title}</Text>
        // </TouchableOpacity>
            <ProgressDialog
                    visible={isLoading}
                    title={title}
                />
    );
}

export default ProgressDialogView;