import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import Constantimages from '../utils/ConstantImages';
export const FileMenuOptionsDialog= ({
     visible, 
     title,
     background,
     onOpenFile,
     onDeleteFile, 
     onRenameFile,
     filename,
     openFileMenuOptionsDialog }) => {

    // galory
    return <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => {
            !visible
        }}
    >
        <TouchableWithoutFeedback
            onPress={openFileMenuOptionsDialog}
        >
            <View style={styles.loader}>
                <View style={styles.content}>
                    <Text style={{ color:colors.COLOR_THEME, paddingVertical: 10, marginLeft: 5,
                         fontWeight: '600' }}>{filename}</Text>
                    <View style={{ height: 2, width: '100%', backgroundColor: colors.COLOR_THEME }}></View>
                    <TouchableOpacity style={{ paddingVertical: 10, flexDirection: 'row', 
                    alignItems: 'center' }} onPress={onOpenFile} >

                        <Image style={styles.icon_style}
                            source={Constantimages.fileopen_icon} />
                        <Text style={{ paddingLeft: 5 }}>Open</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, width: '100%', backgroundColor: colors.GREY_COLOR }}></View>
                    <TouchableOpacity style={{ paddingVertical: 10, flexDirection: 'row', 
                    alignItems: 'center' }} onPress={onRenameFile} >

                        <Image style={styles.icon_style}
                            source={Constantimages.rename_file_icon} />
                        <Text style={{ paddingLeft: 5 }}>Rename</Text>
                    </TouchableOpacity>
                   <View style={{ height: 1, width: '100%', backgroundColor: colors.GREY_COLOR }}></View>
                    <TouchableOpacity style={{ paddingVertical: 10, flexDirection: 'row',
                     alignItems: 'center' }} onPress={onDeleteFile}>

                        <Image style={styles.icon_style}
                            source={Constantimages.delete_icon} />
                        <Text style={{ paddingLeft: 5 }}>Delete</Text>
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
export default FileMenuOptionsDialog;