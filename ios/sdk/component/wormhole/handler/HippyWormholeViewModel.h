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
#import "HippyWormholeProtocol.h"
#import "HippyWormholeWrapperView.h"
#import "HippyNativeVueViewModel.h"

NS_ASSUME_NONNULL_BEGIN
@class HippyWormholeViewModel;

/**
 * delegate of WormholeViewModel.
 */
@protocol HippyWormholeViewModelDelegate  <NSObject>

@optional

- (void)wormholeWillAppear:(HippyWormholeViewModel *)viewModel;

- (void)wormholeWillDisappear:(HippyWormholeViewModel *)viewModel;

- (void)wormholeDidOnClick:(HippyWormholeViewModel *)viewModel;

- (void)wormholeViewModel:(HippyWormholeViewModel *)viewModel didChangedSize:(CGSize)size;

@end

@class HippyWormholeBusinessHandler;
@class HippyVirtualNode;
@class HippyWormholeBaseShadowView;
@class HippyBridge;

/**
 * ViewModel of Wormhole.
 */
@interface HippyWormholeViewModel : NSObject<HippyWormholeProtocol>

#pragma mark - Properties
/**
 * params of WormholeViewModel(include wormholeId).
 */
@property (nonatomic, strong, readonly) NSDictionary *params;

/**
 * delegate of WormholeViewModel.
 */
@property (nonatomic, weak) id<HippyWormholeViewModelDelegate> delegate;

/**
 * WrapperView instance(read only).
 */
@property (nonatomic, strong, nullable, readonly) HippyWormholeWrapperView *view;

/**
 * index path of Wormhole node(for Native case only).
 */
@property (nonnull, strong) NSIndexPath *indexPath;

#pragma mark - Initial Methods
/**
 * Init a WormholeViewModel instance.
 * @param params data of WormholeViewModel.
 * @param rootTag root tag of business root view.
 * @return WormholeViewModel instance.
 */
- (instancetype)initWithParams:(NSDictionary *)params rootTag:(NSNumber *)rootTag;
- (instancetype)init NS_UNAVAILABLE;

#pragma mark - Public Methods
/**
 * Build natvie-vue view in synchronous mode.
 */
- (void)syncBuild;

/**
 * Build natvie-vue view in asynchronous mode with completion block.
 * @param completion build completion block.
 */
- (void)asyncBuildWithCompletion:(HippyNVBuildCompletion)completion;

/**
 * get Width of wormhole view.
 * @return width of wormhole view.
 */
- (CGFloat)viewWidth;

/**
 * get Height of wormhole view.
 * @return height of wormhole view.
 */
- (CGFloat)viewHeight;

/**
 * clear contents of WormholeViewModel.
 */
- (void)clear;

/**
 * attach props of WormholeViewModel to WormholeShadowView.
 * @param shadowView the instance of WormholeShadowView.
 * @param originProps the original props of wormhole shadow view.
 */
- (void)attachViewModelPropsToShadowView:(HippyWormholeBaseShadowView *)shadowView withOriginProps:(NSMutableDictionary *)originProps;

/**
 * update WormholeShadowView when wormhole size changed.
 * @param shadowView the instance of WormholeShadowView.
 * @param size the size of wormhole view after size-changed.
 */
- (void)updateShadowView:(HippyWormholeBaseShadowView *)shadowView onWormholeSizeChanged:(CGSize)size;

#pragma mark - For Native Only
- (void)wormholeWillAppear;

- (void)wormholeWillDisappear;

- (NSDictionary *)toJSONObject;

@end

NS_ASSUME_NONNULL_END
