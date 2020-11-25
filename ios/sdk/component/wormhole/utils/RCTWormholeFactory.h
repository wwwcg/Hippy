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
#import "HippyBridge.h"

@class HippyWormholeWrapperView;
@class HippyVirtualWormholeNode;
@class HippyWormholeViewModel;

@interface HippyWormholeFactory : NSObject

- (void)setWormholeWrapperView:(HippyWormholeWrapperView *)wrapperView forWormholeId:(NSString *)wormholeId;

- (void)setWormholeNode:(HippyVirtualWormholeNode *)node forWormholeId:(NSString *)wormholeId;
- (void)setWormholeNodeWithReactTag:(NSNumber *)reactTag forWormholeId:(NSString *)wormholeId;

- (void)setWormholeViewModel:(HippyWormholeViewModel *)model forWormholeId:(NSString *)wormholeId;

- (void)removeWormholeWrapperView:(NSString *)wormholeId;

- (void)removeWormholeNode:(NSString *)wormholeId;

- (void)removeWormholeViewModel:(NSString *)wormholeId;

/// 建立索引
- (void)buildIndexOfWormholeId:(NSString *)wormholeId withRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex;

/// 查找索引
- (NSString *)wormholeIdForRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex;
- (HippyWormholeViewModel *)viewModelForRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex;

/// 删除指定Wormhole Ids的缓存（包含wrapperView、Node、viewModel）
- (void)removePartCacheOfRootView:(NSNumber *)rootTag wormholeIds:(NSArray<NSString *> *)wormholeIds;
- (void)removeAllCacheOfRootView:(NSNumber *)rootTag;

- (HippyVirtualWormholeNode *)wormholeNodeForWormholeId:(NSString *)wormholeId;
- (NSNumber *)wormholeReactTagForWormholeId:(NSString *)wormholeId;

- (HippyWormholeWrapperView *)wormholeWrapperViewForWormholeId:(NSString *)wormholeId;

- (HippyWormholeViewModel *)wormholeViewModelForWormholeId:(NSString *)wormholeId;

- (NSDictionary *)nodeCache;
- (NSMapTable *)wrapperCache;
- (NSDictionary *)viewModelCache;

- (void)clear;

@end

@interface HippyBridge (WormholeFactory)

@property(nonatomic, strong) HippyWormholeFactory *wormholeFactory;

@end
