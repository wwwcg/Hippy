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

#import "HippyWormholeTagViewManager.h"
#import "HippyWormholeTagView.h"
#import "HippyWormholeTagShadowView.h"

@implementation HippyWormholeTagViewManager

HIPPY_EXPORT_MODULE(TKDWormhole)

HIPPY_EXPORT_VIEW_PROPERTY(params, NSDictionary);

- (UIView *)view {
    return [HippyWormholeTagView new];
}

- (HippyShadowView *)shadowView{
    return [HippyWormholeTagShadowView new];
}

HIPPY_EXPORT_METHOD(sendEventToWormholeView:(nonnull NSNumber *)reactTag message:(NSDictionary *)message)
{
    [self.bridge.uiManager addUIBlock:^(HippyUIManager *uiManager, NSDictionary<NSNumber *,__kindof UIView *> *viewRegistry) {
        HippyWormholeTagView *view = viewRegistry[reactTag];
        [view sendEventToWormholeView:message];
    }];
}

@end
