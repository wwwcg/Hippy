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

#import "HippyWormholeItem.h"
#import "HippyBridge.h"
#import "HippyTouchHandler.h"
#import "HippyWormholeFactory.h"

@interface HippyWormholeItem () {
    HippyBridge *_bridge;
    HippyTouchHandler *_touchHandler;
}

@end

@implementation HippyWormholeItem
@synthesize wormholeId = _wormholeId;

- (instancetype)initWithBridge:(HippyBridge *)bridge {
    self = [super init];
    if (self) {
        _bridge = bridge;
        _touchHandler = [[HippyTouchHandler alloc] initWithRootView:self bridge:bridge];
        [self addGestureRecognizer:_touchHandler];
        _businessIndex = -1000;  // default value
    }
    return self;
}

- (void)addSubview:(UIView *)view{
    [super addSubview:view];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"%@; wormhole:%@", [super description], _wormholeId];
}

- (void)setParams:(NSDictionary *)params {
    if (_params != params)
    {
        _params = params;
        if (_params[@"wormholeId"])
        {
            _wormholeId = _params[@"wormholeId"];
        }
        
        if (_params[@"index"])
        {
            _businessIndex = [_params[@"index"] integerValue];
        }
    }
}

@end
