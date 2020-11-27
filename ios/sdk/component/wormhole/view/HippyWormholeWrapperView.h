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

#import <UIKit/UIKit.h>
#import "HippyWormholeProtocol.h"

NS_ASSUME_NONNULL_BEGIN

@class HippyNativeVueViewModel;
@class HippyVirtualWormholeNode;

#pragma mark - Delegate
@protocol HippyWormholeWrapperViewDelegate  <NSObject>

- (void)wrapView:(HippyWormholeWrapperView * _Nullable)wrapView didChangedSize:(CGSize)size;

- (void)wrapView:(HippyWormholeWrapperView * _Nullable)wrapView didRemoveNativeView:(UIView *)nativeView;

@end

#pragma mark - Interface
@interface HippyWormholeWrapperView : UIView<HippyWormholeProtocol>

@property(nonatomic, weak) id<HippyWormholeWrapperViewDelegate> delegate;
@property(nonatomic, weak) HippyVirtualWormholeNode *wormholeNode;

- (instancetype)initWithWormholeId:(NSString *)wormholeId natvieView:(UIView * _Nullable)nativeView;
- (instancetype)initWithFrame:(CGRect)frame NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

- (void)setContentView:(UIView *)contentView;
- (void)clearContentView;


@end


NS_ASSUME_NONNULL_END
