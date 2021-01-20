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

#import "HippyWormholeTagShadowView.h"
#import "HippyWormholeViewModel.h"
#import "HippyWormholeTagView.h"
#import "NSObject+WhormholdViewModel.h"

@interface HippyWormholeTagShadowView ()<HippyWormholeViewModelDelegate>

@property(nonatomic, weak) id<HippyBridgeDelegate> bridgeDelegate;

@end

@implementation HippyWormholeTagShadowView{
    NSDictionary * _params;
}

@synthesize wormholeId = _wormholeId;
@synthesize viewModel = _viewModel;

- (void)setProps:(NSDictionary *)props{
    [super setProps:props];
    if (self.props[@"params"] && [self.props[@"params"] isKindOfClass:[NSDictionary class]]){
        _params = (NSDictionary *)self.props[@"params"];
        _wormholeId = [self.viewModel wormholeId];
        [self.viewModel attachViewModelPropsToShadowView:self withOriginProps:(NSMutableDictionary *)props];//附加viewModel相关属性
    }else {
        HippyAssert(false,@"should contain params");
    }
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"%@; wormhole:%@", [super description], _wormholeId];
}

#pragma mark - getter

- (HippyWormholeViewModel *)viewModel{
    if (!_viewModel) {
        _viewModel = [[HippyWormholeViewModel alloc] initWithParams:self.props[@"params"] rootTag:self.rootTag];
        _viewModel.delegate = self;
        [_viewModel syncBuild];//同步构建
    }
    return _viewModel;
}

- (void)setBridge:(HippyBridge *)bridge {
    [super setBridge:bridge];
    _bridgeDelegate = bridge.delegate;
}

#pragma mark - HippyWormholeViewModelDelegate

- (void)wormholeViewModel:(HippyWormholeViewModel *)viewModel didChangedSize:(CGSize)size
{
    CGFloat height = self.height ? self.height : _viewModel.viewHeight;
    if (fabs(height - size.height) < 1 ) {//最小高度差异更新条件
        return ;
    }
    [_viewModel updateShadowView:self onWormholeSizeChanged:size];
}

- (void)dealloc {
    if ([self.bridgeDelegate respondsToSelector:@selector(componentWillBePurged:)]) {
        [self.bridgeDelegate componentWillBePurged:self];
    }
}

@end
