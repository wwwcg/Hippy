/*!
* iOS SDK
*
* Tencent is pleased to support the open source community by making
* Hippy available.
*
* Copyright (C) 2019 THL A29 Limited, a Tencent company.
* All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

#import <Foundation/Foundation.h>
#import "HippyBridgeDelegate.h"
#import "HippyWormholeProtocol.h"
#import "HippyWormholePublicDefines.h"
#import "HippyNativeVueManager.h"

//!!IMPORTANT!!! To make sure WormholeSDK works better, pleas install NativeVueSDK first.
//pod 'NativeVueSDK', :git => "http://git.code.oa.com/NativeVue/nativevue-engine.git", :tag => '0.0.9'

NS_ASSUME_NONNULL_BEGIN
@class HippyWormholeBusinessHandler;
@class HippyWormholeViewModel;
@class HippyWormholeFactory;

@interface HippyWormholeEngine : NSObject

/**
 * singleton of HippyWormholeEngine.
 */
+ (instancetype)sharedInstance;

#pragma mark - Properties

/**
 * load wormhole jsbundle, implement HippyWormholeDataSource / HippyWormholeDelegate.
 */
@property (nonatomic, strong, readonly) HippyWormholeBusinessHandler *businessHandler;

/**
 * utils for memory-cache of WormholeNode, WormholeView, WrapperView and etc.
 */
@property (nonatomic, strong, readonly) HippyWormholeFactory *wormholeFactory;

/**
 * check whether app is release mode, default is YES.
*/
@property (nonatomic, assign, getter=isReleaseMode) BOOL releaseMode;

#pragma mark - Public Methods
/**
 * launch Wormhole Engine.
 * @param commonBundlePath hippy commonBundlePath.
 * @param indexBundlePath hippy indexBundlePath.
 * @param moduleName name of module.
 * @param replaceModules customized replaceModules.
 * @param isDebug whether debug mode is enabled.
*/
- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug;

/**
 * launch Wormhole Engine.
 * @param commonBundlePath hippy commonBundlePath.
 * @param indexBundlePath hippy indexBundlePath.
 * @param nvBundlePath native vue bundle path.
 * @param moduleName name of module.
 * @param replaceModules customized replaceModules.
 * @param isDebug whether debug mode is enabled.
*/
- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
 nativeVueBundlePath:(NSURL *)nvBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug;

/**
 * shutdown Wormhole Engine.
 */
- (void)shutdownEngine;

/**
 * bind Target Bridge to Wormhole Bridge, make it possible for bridges' communication(eg. Data Transmission, Event Communication).
 * @param targetBridge business target bridge.
 * @param rootTag root tag of target bridge.
 * @param enableDelegate whether RCTWormholeBusinessHandler is enabled to implement RCTWormholeDelegate.
 * @param enableDataSource whether RCTWormholeBusinessHandler is enabled to implement RCTWormholeDataSource.
 */
- (void)bindTargetBridge:(HippyBridge *)targetBridge
                 rootTag:(NSNumber *)rootTag
  enableWormholeDelegate:(BOOL)enableDelegate
enableWormholeDataSource:(BOOL)enableDataSource;

/**
 * cancel bind between Target Bridge and Wormhole Bridge.
 * @param rootTag root tag of target bridge.
 */
- (void)cancelBindBridgeByRootTag:(NSNumber *)rootTag;

/**
 * load native vue file.
 * @param data native vue dom data.
 * @return whether dom data is loaded(BOOL value).
 */
- (BOOL)loadNativeVueDomData:(NSData *)data;

/**
 * post message to Wormhole.
 * @param message the message body.
 */
- (void)postWormholeMessage:(NSDictionary *)message;

/**
 * dispatch Event to Wormhole.
 * @param eventName event name.
 * @param data event data.
*/
- (void)dispatchWormholeEvent:(NSString *)eventName data:(id)data;

/**
 * open or close FPS Monitor, for debug mode only.
 * @param on whether FPS monitor is opened.
*/
- (void)switchFPSMonitor:(BOOL)on;

#pragma mark - For Native Case
/**
 * @param data raw data of wormhole.
 * @return WormholeViewModel instance.
 */
- (HippyWormholeViewModel *)newWormholeViewModel:(NSDictionary *)data;

@end

NS_ASSUME_NONNULL_END
