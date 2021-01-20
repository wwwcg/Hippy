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
#import "HippyComponentData.h"
@class HippyShadowView;
@class HippyUIManager;
@class HippyNVComponent;
NS_ASSUME_NONNULL_BEGIN

@interface HippyNVComponentTreeBuilder : NSObject

- (instancetype)initWithContext:(HippyUIManager *)context;

- (HippyNVComponent *)buildComponentTreeWithVirtualDom:(NSDictionary *)virtualDom;

- (HippyComponentData * _Nullable)componentDataWithViewName:(NSString *)viewName;

- (NSNumber * _Nullable)rootTag;

- (void)addUIBlock:(HippyViewManagerUIBlock)block;

- (HippyUIManager *)uiManager;

- (void)addBridgeTransactionListeners:(id<HippyComponent>)listner;

- (void)registerViewWithTag:(NSNumber *)tag view:(UIView *)view component:(HippyNVComponent *)component;

- (UIView * _Nullable)view;

@end

NS_ASSUME_NONNULL_END
