#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>
#import <Firebase.h>
//#import <Foundation/Foundation.h>
//#import <RNFirebaseNotifications.h>
//#import <RNFirebaseMessaging.h>

//@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate, FIRMessagingDelegate>
#import <UMCore/UMAppDelegateWrapper.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
 
@interface AppDelegate : UMAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate>


@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;

@end

