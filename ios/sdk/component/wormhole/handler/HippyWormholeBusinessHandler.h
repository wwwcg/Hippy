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

NS_ASSUME_NONNULL_BEGIN

@class HippyBridge;
@class HippyRootView;
@class HippyWormholeWrapperView;
@class HippyWormholeViewModel;

@interface HippyWormholeBusinessHandler : NSObject<HippyWormholeDataSource, HippyWormholeDelegate, HippyBridgeDelegate>

@property (nonatomic, strong, readonly) HippyBridge *bridge;
@property (nonatomic, strong, readonly) HippyRootView *rootView;

- (void)configureJSBundle:(NSURL *)commonBundlePath
          indexBundlePath:(NSURL *)indexBundlePath
               moduleName:(NSString *)moduleName
                  isDebug:(BOOL)isDebug
           replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules;

- (HippyWormholeWrapperView *)wormholeWrapperView:(NSString *)wormholeId;

- (void)clear;

- (void)notifyWormholeEvent:(HippyWormholeEvent)event extraData:(NSDictionary *)extraData;

#pragma mark - For Native Interfaces
/// 根据原始数据生成一个WormholeViewModel
- (HippyWormholeViewModel *)wormholeViewModelWithRawData:(NSDictionary *)rawData;

/// 添加一个WormholeViewModel至数据源
- (void)enqueueWormholeViewModel:(HippyWormholeViewModel *)viewModel;

/// 移除一个WormholeViewModel从数据源
- (void)dequeueWormholeViewModel:(HippyWormholeViewModel *)viewModel;

@end

NS_ASSUME_NONNULL_END
