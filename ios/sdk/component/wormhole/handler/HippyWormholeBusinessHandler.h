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
#import <UIKit/UIKit.h>
#import "HippyWormholeProtocol.h"
#import "HippyBridgeDelegate.h"
#import "HippyWormholePublicDefines.h"

NS_ASSUME_NONNULL_BEGIN

@class HippyBridge;
@class HippyRootView;
@class HippyWormholeWrapperView;
@class HippyWormholeViewModel;

@interface HippyWormholeBusinessHandler : NSObject<HippyWormholeDataSource, HippyWormholeDelegate, HippyBridgeDelegate>

#pragma mark - Properties

/// bridge of Wormhole.
@property (nonatomic, strong, readonly) HippyBridge *bridge;

/// rootView of Wormhole.
@property (nonatomic, strong, readonly) HippyRootView *rootView;

#pragma mark - Public Methods
/**
 * init JSBridge and RootView of Wormhole with the given commonBundlePath and indexBundlePath.
 * @param commonBundlePath hippy commonBundlePath.
 * @param indexBundlePath hippy indexBundlePath.
 * @param moduleName name of module.
 * @param isDebug whether debug mode is enabled.
 * @param replaceModules customized replaceModules.
 */
- (void)configureJSBundle:(NSURL *)commonBundlePath
          indexBundlePath:(NSURL *)indexBundlePath
               moduleName:(NSString *)moduleName
                  isDebug:(BOOL)isDebug
           replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules;

/**
 * get RCTWormholeWrapperView instance by wormholeId.
 * @param wormholeId the identifier of wormhole.
 * @return RCTWormholeWrapperView instance.
 */
- (HippyWormholeWrapperView *)wormholeWrapperView:(NSString *)wormholeId;

/**
 * destroy JSBridge and RootView of Wormhole, and related objects caches.
 */
- (void)clear;

/**
 * sent event to Wormhole.
 * @param event event type of wormhole.
 * @param extraData event data.
 */
- (void)notifyWormholeEvent:(HippyWormholeEvent)event extraData:(NSDictionary *)extraData;

#pragma mark - For Native Interfaces
/**
 * generate a RCTWormholeViewModel instance by raw data.
 * @param rawData raw data of wormhole.
 * @return RCTWormholeViewModel instance.
 */
- (HippyWormholeViewModel *)wormholeViewModelWithRawData:(NSDictionary *)rawData;

/**
 * cache a RCTWormholeViewModel instance to the queue.
 * @param viewModel RCTWormholeViewModel instance.
 */
- (void)enqueueWormholeViewModel:(HippyWormholeViewModel *)viewModel;

/**
 * remove a RCTWormholeViewModel instance from the queue.
 * @param viewModel RCTWormholeViewModel instance.
 */
- (void)dequeueWormholeViewModel:(HippyWormholeViewModel *)viewModel;

@end

NS_ASSUME_NONNULL_END
