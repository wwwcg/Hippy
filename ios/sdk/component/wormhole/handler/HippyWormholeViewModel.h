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
@interface HippyWormholeViewModel : NSObject<HippyWormholeProtocol>

@property (nonatomic, strong, readonly) NSDictionary *params;
@property (nonatomic, weak) id<HippyWormholeViewModelDelegate> delegate;
@property (nonatomic, strong, nullable, readonly) HippyWormholeWrapperView *view;
@property (nonnull, strong) NSIndexPath *indexPath; // for Native case only

- (instancetype)initWithParams:(NSDictionary *)params rootTag:(NSNumber *)rootTag;
- (instancetype)init NS_UNAVAILABLE;

- (void)syncBuild;
- (void)asyncBuildWithCompletion:(HippyNVBuildCompletion)completion;

- (CGFloat)viewWidth;
- (CGFloat)viewHeight;

- (void)clear;

- (void)attachViewModelPropsToShadowView:(HippyWormholeBaseShadowView *)shadowView withOriginProps:(NSMutableDictionary *)originProps;
- (void)updateShadowView:(HippyWormholeBaseShadowView *)shadowView onWormholeSizeChanged:(CGSize)size;

#pragma mark - For Native Interfaces

- (void)wormholeWillAppear;

- (void)wormholeWillDisappear;

- (NSDictionary *)toJSONObject;

@end

NS_ASSUME_NONNULL_END
