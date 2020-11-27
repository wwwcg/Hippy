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
#import "HippyShadowView.h"
#import "HippyVirtualNode.h"
@class HippyNVComponentTreeBuilder;
NS_ASSUME_NONNULL_BEGIN

@interface HippyNVComponent : NSObject

@property(nonatomic, strong, nonnull, readonly) NSNumber *tag;
@property(nonatomic, strong, nonnull, readonly) UIView *view;
@property(nonatomic, strong, nonnull, readonly) NSString *viewName;
@property(nonatomic, strong, nonnull, readonly) HippyShadowView *shadowView;
@property(nonatomic, strong, nonnull, readonly) HippyVirtualNode *virtualNode;
@property(nonatomic, strong, nullable, readonly) HippyNVComponent *parentComponent;

- (instancetype)initWithJsonData:(NSDictionary *)jsonData builder:(HippyNVComponentTreeBuilder *)builder;

- (void)insertSubcomponent:(HippyNVComponent *)subcomponent atIndex:(NSInteger)index;

- (CGRect)frame;

@end

NS_ASSUME_NONNULL_END
