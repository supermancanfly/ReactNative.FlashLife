
import React from 'react';
import {
    Alert
} from 'react-native';

import Mailer from 'react-native-mail';
export const onOpenMailApp = async (value) => {
    let data=[]
    let ext = value.notificationImage;
    let ext1 = ext.split('.').pop();
    // fileName.split('.').pop();
    ext = ext1[1];
    // console.log("ext"+ext1+"value.notificationImage"+ext)
    const promise = new Promise(async (resolve, reject) => {
       
        // data.push({
        //     path: value.download_file,
        //     type: ext,
        //     name: "attachments"
        // })

        try {
            //do something and return result on success
          
            Mailer.mail({
                subject:  "",
                recipients: [""],
                //   ccRecipients: ['supportCC@example.com'],
                //   bccRecipients: ['supportBCC@example.com'],
                // body: frauddetails,,
                body: "<h1>" + value.headertitle + "</h1><br><h1>"+ value.title+"</h1><br><h1><a href="+value.web_link+">"+value.web_link+"</a></h1>",
                isHTML: true,
                // attachments: [{
                //     // path:"",
                //     uri: value.notificationImage, // The uri of the file from which to read the data.
                //     type: ext,
                //     name: "attachments"
                // }]
            }, (error, event) => {
    
                if (error) {
                    Alert.alert(
                        error,
                        event,
                        [
                            { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                            { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                        ],
                        { cancelable: true }
                    )
                }
             
            },
            );
            // console.log("result"+JSON.stringify(result))
            // resolve(result);
            resolve();

        } catch (msg) { reject(msg); }

    });

    return promise;
}
