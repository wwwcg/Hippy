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
#import "HippyWormholeViewModel.h"
#import "HippyBridge.h"
#import "HippyWormholeBaseShadowView.h"
#import "HippyNativeVueViewModel.h"
#import "NSObject+WhormholdViewModel.h"
#import "HippyNativeVueManager.h"
#import "HippyWormholeEngine.h"
#import "HippyWormholeBusinessHandler.h"
#import "HippyNVUtil.h"
#import "HippyWormholeFactory.h"

static NSInteger gWormholeBaseId = 10000;

@interface HippyWormholeViewModel ()<HippyWormholeWrapperViewDelegate>
{
    HippyWormholeWrapperView * _view;
    CGSize _curViewSize;
}

@property (nonatomic, strong) NSDictionary *params;
@property (nonatomic, weak) HippyBridge *bridge;
@property (atomic, strong) HippyNativeVueViewModel *nativeVueModel;

@end

@implementation HippyWormholeViewModel

@synthesize wormholeId = _wormholeId;

- (instancetype)initWithParams:(NSDictionary *)params rootTag:(NSNumber *)rootTag
{
    self = [super init];
    if (self)
    {
        _wormholeId = [NSString stringWithFormat:@"%ld", (long)gWormholeBaseId++];
        NSMutableDictionary *mutableDict = [NSMutableDictionary  dictionary];
        [mutableDict setObject:_wormholeId forKey:@"wormholeId"];
        if (params)
        {
            [mutableDict addEntriesFromDictionary:params];
        }
        self.params = [NSDictionary dictionaryWithDictionary:mutableDict];
        self.bridge = [HippyWormholeEngine sharedInstance].businessHandler.bridge;
        NSInteger dataIndex = self.params[@"index"] ? [self.params[@"index"] integerValue] : -1000;
        [self.bridge.wormholeFactory buildIndexOfWormholeId:_wormholeId withRootTag:rootTag dataIndex:dataIndex];
        if ([self.bridge.wormholeDelegate respondsToSelector:@selector(didReceiveWormholeData:rootTag:)]) {
            [self.bridge.wormholeDelegate didReceiveWormholeData:self.params rootTag:rootTag];
        }

        [self _initNativeVueModel];
        
        // 缓存viewModel
        [self.bridge.wormholeFactory setWormholeViewModel:self forWormholeId:_wormholeId];
    }
    return self;
}

- (void)dealloc
{
    [self clear];
    
    UIView * wrapperView = _view;
    dispatch_async(dispatch_get_main_queue(), ^{//保证view主线程释放
        [wrapperView description];
    });
}

- (NSDictionary *)toJSONObject
{
    NSString *wormholeId = self.wormholeId.length > 0 ? self.wormholeId : @"";
    NSInteger index = self.params[@"index"] ? [self.params[@"index"] integerValue] : 0;
    NSDictionary *data = self.params[@"data"] ? self.params[@"data"] : @{};
    
    return @{
        @"wormholeId": wormholeId,
        @"index": @(index),
        @"data": data
    };
}

- (void)wormholeWillAppear
{
    if ([self.delegate respondsToSelector:@selector(wormholeWillAppear:)])
    {
        [self.delegate wormholeWillAppear:self];
    }
}

- (void)wormholeWillDisappear
{
    if ([self.delegate respondsToSelector:@selector(wormholeWillDisappear:)])
    {
        [self.delegate wormholeWillDisappear:self];
    }
}

#pragma mark - public

- (HippyWormholeWrapperView *)view
{
    UIView *nvOverlayView = _nativeVueModel.view;
    _view = [self.bridge.wormholeDataSource wormholeViewWithWormholeId:_wormholeId nvOverlayView:nvOverlayView];
    _view.delegate = self;
    return _view;
}


- (CGFloat)viewWidth{
    if (_curViewSize.width) {
        return _curViewSize.width;
    }
    return _nativeVueModel.viewWidth ? : 1;
}

- (CGFloat)viewHeight{
    if (_curViewSize.height) {
         return _curViewSize.height;
    }
    return _nativeVueModel.viewHeight ? : 1;
}

- (void)syncBuild{
    [_nativeVueModel syncBuild];
}

- (void)asyncBuildWithCompletion:(HippyNVBuildCompletion)completion{
     [_nativeVueModel asyncBuildWithCompletion:completion];
}

- (void)setBridge:(HippyBridge *)bridge{
    if (_bridge != bridge) {
        _bridge = bridge;
        [_bridge.wormholeDelegate didCreatedViewModel:self];
    }
}

- (void)attachViewModelPropsToShadowView:(HippyWormholeBaseShadowView *)shadowView withOriginProps:(NSMutableDictionary *)originProps
{
    if (!shadowView || !originProps)
    {
        return;
    }
    originProps[@"width"] = @(self.viewWidth);
    originProps[@"height"] = @(self.viewHeight);
}

- (void)updateShadowView:(HippyWormholeBaseShadowView *)shadowView onWormholeSizeChanged:(CGSize)size
{
    HippyBridge *bridge = shadowView.bridge;
    if (!bridge)
    {
        return;
    }
    NSMutableDictionary * newProps = (NSMutableDictionary *)[shadowView.props mutableCopy];
    newProps[@"width"] = @(size.width);
    newProps[@"height"] = @(size.height);
    [bridge.uiManager executeBlockOnUIManagerQueue:^{
        [bridge.uiManager updateViewWithReactTag:shadowView.reactTag props:newProps];
        [bridge.uiManager setNeedsLayout];
    }];
}

- (void)clear
{
    if ([_view isKindOfClass:NSClassFromString(@"HippyWormholeWrapperView")])
    {
        [((HippyWormholeWrapperView *)_view) clearContentView];
    }
    
    _view.delegate = nil;
    _view = nil;
    
    self.params = nil;
    self.bridge = nil;
    
    self.nativeVueModel = nil;
}

#pragma mark - HippyWormholeWrapperViewDelegate

- (void)wrapView:(HippyWormholeWrapperView * _Nullable)wrapView didChangedSize:(CGSize)size{
    
    if (CGSizeEqualToSize(_curViewSize, size))
    {
        return ;
    }
    _curViewSize = size;
    if ([self.delegate respondsToSelector:@selector(wormholeViewModel:didChangedSize:)]) {
        [self.delegate wormholeViewModel:self didChangedSize:size];
    }
}

- (void)wrapView:(HippyWormholeWrapperView *)wrapView didRemoveNativeView:(UIView *)nativeView{
    if (_nativeVueModel) {
        dispatch_async(dispatch_get_global_queue(0, 0), ^{
               self->_nativeVueModel = nil;
        });
    }
}

#pragma mark - init

- (void)_initNativeVueModel{
    NSString * templateId =  [[HippyNativeVueManager shareInstance] templateIdWithData:self.params]; //fetch template id
    if(!templateId) return ;
    templateId = [HippyNVUtil toNSString:templateId];
    NSString * vueDomString = [[HippyNativeVueManager shareInstance] jsonDomWithTemplateId:templateId];
    NSDictionary * domData = self.params;
    HippyUIManager * uiManager = self.bridge.uiManager;
    if ([vueDomString isKindOfClass:[NSString class]] && vueDomString.length) {
        _nativeVueModel = [[HippyNativeVueViewModel alloc] initWithJsonDom:vueDomString domData:domData context:uiManager];
    }
}

@end
