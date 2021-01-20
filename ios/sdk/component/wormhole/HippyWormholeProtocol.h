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
#import <CoreGraphics/CoreGraphics.h>

NS_ASSUME_NONNULL_BEGIN

@class HippyVirtualNode, UIView, HippyBridge, HippyVirtualWormholeNode, HippyShadowView,  HippyWormholeWrapperView, HippyVirtualWormholeNode, HippyWormholeViewModel;

/**
 * protocol that wormhole-related classes conform to.
 */
@protocol HippyWormholeProtocol <NSObject>

/**
 * unique identifier of wormhole.
 */
@property(nonatomic, copy) NSString *wormholeId;

@end

#pragma mark - HippyWormholeDataSource

/**
 * data source that wormhole-related classes implement.
 */
@protocol HippyWormholeDataSource <NSObject>

@optional

/**
 * create WormholeWrapperView instance. This method should not be called on main thread!
 * @param wormholeId the identifier of Wormhole.
 * @param nvOverlayView native-vue view instance, for acceleration of first frame rendering.
 * @return WormholeWrapperView instance.
 */
- (HippyWormholeWrapperView *)wormholeViewWithWormholeId:(NSString *)wormholeId
                                         nvOverlayView:(UIView * _Nullable)nvOverlayView;

@end

#pragma mark - HippyWormholeDelegate
/**
 * delegate that wormhole-related classes implement.
 */
@protocol HippyWormholeDelegate <NSObject>

@optional

- (void)didReceiveWormholeData:(NSDictionary *)data rootTag:(NSNumber *)rootTag;

- (void)didCreateWormholeNode:(HippyVirtualWormholeNode *)wormholeNode userInfo:(NSDictionary *)userInfo;

- (void)didCreatedViewModel:(HippyWormholeViewModel *)wholeViewModel;

@end

NS_ASSUME_NONNULL_END
