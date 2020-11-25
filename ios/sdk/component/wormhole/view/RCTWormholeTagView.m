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

#import "HippyWormholeTagView.h"
#import "HippyBridge.h"
#import "HippyWormholeProtocol.h"
#import "HippyBridge.h"
#import "HippyEventDispatcher.h"
#import "HippyWormholeViewModel.h"
#import "NSObject+WhormholdViewModel.h"
#import "HippyUIManager.h"
#import "HippyWormholeEngine.h"
#import "HippyWormholeFactory.h"

@interface HippyWormholeTagView()

@property (nonatomic, copy) NSString *wormholeId;

@end

@implementation HippyWormholeTagView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
    }
    return self;
}


- (NSString *)description
{
    return [NSString stringWithFormat:@"%@; wormholeId:%@", [super description], self.wormholeId];
}

- (void)setParams:(NSDictionary *)params {
    if (_params != params)
    {
        _params = params;
        
        NSInteger dataIndex = _params[@"index"] ? [_params[@"index"] integerValue] : -1000;
        NSNumber *rootTag = self.rootTag;
        
        if ([rootTag isKindOfClass:[NSNull class]])
        {
            assert(NO);
        }
        
        HippyWormholeFactory *factory = [HippyWormholeEngine sharedInstance].wormholeFactory;
        HippyWormholeViewModel *rViewModel = [factory viewModelForRootTag:rootTag dataIndex:dataIndex];
        
        self.wormholeId = rViewModel.wormholeId;
        
        if ([rViewModel isKindOfClass:[HippyWormholeViewModel class]])
        {
            [self addSubview:rViewModel.view];
        }
    }
}

- (void)addSubview:(UIView *)view
{
    self.frame = view.bounds;
    
    NSString *currentId = self.wormholeId;
    
    NSString *preId = nil;
    
    BOOL shouldAddSubview = YES;
    for (UIView *subview in self.subviews)
    {
        if (subview == view)
        {
            shouldAddSubview = NO;
            break;
        }
        
        if ([subview isKindOfClass:NSClassFromString(@"HippyWormholeWrapperView")])
        {
            preId = ((HippyWormholeWrapperView *)subview).wormholeId;
            [((HippyWormholeWrapperView *)subview) clearContentView];
            [subview removeFromSuperview];
            // only one subview exist.
            break;
        }
    }
    
    NSLog(@"ciro debug[TagView addSubview], currId:%@, oldId:%@, isEqual:%d", currentId, preId, (int)[currentId isEqualToString:preId]);
    
    if (shouldAddSubview)
    {
        [super addSubview:view];
    }
}

- (void)sendEventToWormholeView:(NSDictionary *)eventObj {
    UIView *wormholeView = [[[[self subviews] firstObject] subviews] firstObject];
    NSAssert([wormholeView isKindOfClass:NSClassFromString(@"HippyWormholeItem")], @"view is not wormhole view");
    viewEventSend(wormholeView, eventObj);
}

@end
