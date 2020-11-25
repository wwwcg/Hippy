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
#import "HippyNativeVueManager.h"

//!!IMPORTANT!!! To make sure WormholeSDK works well, pleas install NativeVueSDK first.
//pod 'NativeVueSDK', :git => "http://git.code.oa.com/NativeVue/nativevue-engine.git", :tag => '0.0.9'

NS_ASSUME_NONNULL_BEGIN
@class HippyWormholeBusinessHandler;
@class HippyWormholeViewModel;
@class HippyWormholeFactory;

@interface HippyWormholeEngine : NSObject

/**
 * load wormhole jsbundle, implement HippyWormholeDataSource / HippyWormholeDelegate.
 */
@property (nonatomic, strong, readonly) HippyWormholeBusinessHandler *businessHandler;

@property (nonatomic, strong, readonly) HippyWormholeFactory *wormholeFactory;

/**
 * check whether app is release mode, default is YES.
*/
@property (nonatomic, assign, getter=isReleaseMode) BOOL releaseMode;

/**
 * singleton of HippyWormholeEngine.
*/
+ (instancetype)sharedInstance;

/**
 * launch Wormhole Engine.
 * @commonBundlePath: hippy commonBundlePath.
 * @indexBundlePath: hippy indexBundlePath.
 * @moduleName: name of module.
 * @replaceModules:
 * @isDebug: whether debug mode is enabled.
*/
- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug;

/**
 * launch Wormhole Engine.
 * @commonBundlePath: hippy commonBundlePath.
 * @indexBundlePath: hippy indexBundlePath.
 * @nvBundlePath: native vue bundle path
 * @moduleName: name of module.
 * @replaceModules:
 * @isDebug: whether debug mode is enabled.
*/
- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
 nativeVueBundlePath:(NSURL *)nvBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug;

/**
 * load native vue file
 * @data: native vue dom data
 */
- (BOOL)loadNativeVueDomData:(NSData *)data;

/**
 * shutdown Wormhole Engine.
 */
- (void)shutdownEngine;

/**
 * bind Target Bridge to Wormhole Bridge, make it possible for bridges' communication(eg. Data Transmission, Event Communication).
 * @enableDelegate: whether HippyWormholeBusinessHandler is enabled to implement HippyWormholeDelegate.
 * @enableDataSource: whether HippyWormholeBusinessHandler is enabled to implement HippyWormholeDataSource.
 */
- (void)bindTargetBridge:(HippyBridge *)targetBridge
                 rootTag:(NSNumber *)rootTag
  enableWormholeDelegate:(BOOL)enableDelegate
enableWormholeDataSource:(BOOL)enableDataSource;

/**
 * cancel bind between Target Bridge and Wormhole Bridge.
 */
- (void)cancelBindBridgeByRootTag:(NSNumber *)rootTag;


- (void)postWormholeMessage:(NSDictionary *)message;

/**
* dispatch Event to Wormhole.
* @eventName: event name.
* @data: event data.
*/
- (void)dispatchWormholeEvent:(NSString *)eventName data:(id)data;

/**
 * open / close FPS Monitor, for debug mode only.
*/
- (void)switchFPSMonitor:(BOOL)on;

#pragma mark - For Native Case
/**
 * create Wormhole Viewmodel with raw data. This method should not be called on main thread!
 */
- (HippyWormholeViewModel *)newWormholeViewModel:(NSDictionary *)data;

@end

NS_ASSUME_NONNULL_END
