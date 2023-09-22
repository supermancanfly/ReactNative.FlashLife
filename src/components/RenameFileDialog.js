import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import Constantimages from '../utils/ConstantImages';
export const RenameFileDialog= ({
     visible, 
     title,
     background,
     buttoncolor,
    //  onOpenFile,
    //  onDeleteFile, 
     onFileRename,
     handleRenameFileChanged,
     filename,
     
     openFileRenameOptionsDialog }) => {

    // galory
    return <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => {
            !visible
        }}
    >
        <TouchableWithoutFeedback
            onPress={openFileRenameOptionsDialog}
        >
            <View style={styles.loader}>
                <View style={styles.content}>
                    {/* <Text style={{ color:colors.COLOR_THEME, paddingVertical: 10, marginLeft: 5,
                         fontWeight: '600' }}>{filename}</Text> */}
                    {/* <View style={{ height: 2, width: '100%', backgroundColor: colors.COLOR_THEME }}></View> */}
                    <TextInput
                                // ref={input => { this.textCountryAddress = input }}
                                style={{
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 10,
                                    
                                }}
                                // placeholder={ConstantValues.SELECT_COUNTRY_STR}
                                underlineColorAndroid="transparent"
                                value={filename}
                                onChangeText={handleRenameFileChanged}
                                // editable={false}
                            />
                   <View style={{ height: 1, width: '100%', backgroundColor: colors.GREY_COLOR }}></View>
                    <TouchableOpacity style={{ paddingVertical: 10, flexDirection: 'row',paddingHorizontal:5,
                     alignItems: 'center',justifyContent:'center',backgroundColor:buttoncolor }} onPress={onFileRename}>

                        {/* <Image style={styles.icon_style}
                            source={Constantimages.delete_icon} /> */}
                        <Text style={{ paddingLeft: 5,color:colors.COLOR_WHITE }}>Rename</Text>
                    </TouchableOpacity>
                     {/*
                    <View style={{ height: 1, width: '100%', backgroundColor: colors.GREY_COLOR }}></View>
                    <TouchableOpacity style={{ paddingVertical: 10,
                         flexDirection: 'row', alignItems: 'center'
                          }} onPress={onaddFileProceed}>

                        <Image style={styles.icon_style}
                            source={Constantimages.file_icon} />
                        <Text style={{ paddingLeft: 5 }}>Add File from Device</Text>
                    </TouchableOpacity> */}
                 

                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon_style: {
        width: 25, height: 25, marginLeft: 5
    },
    content: {
        // padding: 35,
        // padding: 10,
        width: dimensionsProps.fullWidth - 35,
        // borderRadius: 10,
        backgroundColor: colors.COLOR_WHITE,
        // marginHorizontal:5,
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

        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius:5
    },
    loadingContent: {
        flex: 3,
        fontSize: 16,
        paddingHorizontal: 10,
    }
})
export default RenameFileDialog;