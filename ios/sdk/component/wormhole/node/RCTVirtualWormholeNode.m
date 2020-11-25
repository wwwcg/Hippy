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

#import "HippyVirtualWormholeNode.h"
#import "HippyBridge.h"
#import "HippyWormholeFactory.h"
#import "objc/runtime.h"
#import "HippyWormholeEngine.h"
#import "HippyWormholeBusinessHandler.h"

@implementation HippyVirtualWormholeNode{
    BOOL _didCreatedLayouted;
}
@synthesize wormholeId = _wormholeId;

- (instancetype)initWithTag:(NSNumber *)reactTag viewName:(NSString *)viewName props:(NSDictionary *)props
{
    if (self = [super initWithTag:reactTag viewName:viewName props:props]) {
        self.dataType = HippyBaseListViewItemDataTypeWormhole;
        self.wormholeId = props[@"params"][@"wormholeId"];
    }
    return self;
}

- (BOOL)isLazilyLoadType {
    return YES;
}

- (BOOL)createViewLazily {
    return YES;
}

- (void)dispatchDidCreatedWormholeNodeIfNeed{
    HippyAssert([NSThread isMainThread], @"should run on the main thread");

    if (_didCreatedLayouted || !_wormholeId) {
        return ;
    }
    HippyBridge *bridge = self.bridge;
    HippyAssert(bridge,@"can't be nil");
    NSString *wormholeId = self.props[@"params"][@"wormholeId"];
    
    if (wormholeId.length == 0)
    {
        return;
    }
    
    if (_wormholeId.length > 0)
    {
        HippyWormholeFactory *wormholeFactory = [HippyWormholeEngine sharedInstance].wormholeFactory;
        [wormholeFactory setWormholeNode:self forWormholeId:_wormholeId];
        [wormholeFactory setWormholeNodeWithReactTag:self.reactTag forWormholeId:_wormholeId];
    }
    
    if ([bridge.wormholeDelegate respondsToSelector:@selector(didCreateWormholeNode:userInfo:)])
    {
        [bridge.wormholeDelegate didCreateWormholeNode:self userInfo:@{@"node": self, @"wormholeId": wormholeId}];
    }
    _didCreatedLayouted = true;
}

- (void)setFrame:(CGRect)frame {
    CGRect oldFrame = self.frame;
    BOOL notifySizeChanged = NO;
    if (!CGRectEqualToRect(oldFrame, frame))
    {
        // 虫洞节点有变化，通知feeds节点更新
        notifySizeChanged = YES;
    }
    
    [super setFrame:frame];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self dispatchDidCreatedWormholeNodeIfNeed];
    });
}

- (void)setProps:(NSDictionary *)props {
    [super setProps:props];
}

@end

@implementation HippyVirtualWormholeContainerNode

- (BOOL)isLazilyLoadType {
    return YES;
}

- (BOOL)createViewLazily {
    return YES;
}

@end


@implementation HippyVirtualWormholeSessionNode

- (BOOL)isLazilyLoadType {
    return YES;
}

- (BOOL)createViewLazily {
    return YES;
}

@end

