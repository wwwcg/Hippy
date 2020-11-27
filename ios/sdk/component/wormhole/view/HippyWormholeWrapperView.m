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

#import "HippyWormholeWrapperView.h"
#import "HippyVirtualWormholeNode.h"
#import "HippyWormholeEngine.h"
#import "HippyWormholeItem.h"
#import "HippyWormholeBusinessHandler.h"
#import "HippyNativeVueManager.h"

@interface HippyWormholeWrapperView ()

@end

@implementation HippyWormholeWrapperView{
    UIView * _contentView;
    UIView * _natvieView;
}
@synthesize wormholeId = _wormholeId;

- (instancetype)initWithWormholeId:(NSString *)wormholeId natvieView:(UIView * _Nullable)nativeView{
    if (self = [super init]) {
        self.clipsToBounds = true;
        self.wormholeId = wormholeId;
        _natvieView = nativeView;
        _natvieView.userInteractionEnabled = NO;
        if (_natvieView) {
            if ([HippyNativeVueManager shareInstance].debugCard)
            {
                _natvieView.backgroundColor = [UIColor colorWithWhite:0 alpha:0.3];
                [self _addTapGestureWithView:_natvieView];
            }
            
            [self addSubview:_natvieView];
            self.frame = _natvieView.bounds;
        }
    }
    return self;
}

- (void)setContentView:(UIView *)contentView{
    if (_contentView != contentView || contentView.superview != self) {
        if (_contentView.superview == self) {
            [_contentView removeFromSuperview];
        }
        
        if (contentView.superview != self)
        {
            [contentView removeFromSuperview];
        }
        
        [_contentView removeObserver:self forKeyPath:@"frame"];
        
        _contentView = contentView;
        
        [contentView addObserver:self forKeyPath:@"frame" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:NULL];
        [self insertSubview:contentView atIndex:0];//insert contentview below nvview
        self.frame = contentView.bounds;
        [self dispatchViewSizeDidChangedEvent];
        if (![HippyNativeVueManager shareInstance].debugCard) {
            [self _removeNativeView];
        }
    }
}

- (void)clearContentView
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self->_contentView)
        {
            [self->_contentView removeFromSuperview];
            [self->_contentView removeObserver:self forKeyPath:@"frame"];
            if ([self->_contentView isKindOfClass:NSClassFromString(@"HippyWormholeItem")])
            {
                [self->_contentView.bridge.uiManager removeNativeNodeView:self->_contentView];
                NSString *wormholeId = ((HippyWormholeItem *)self->_contentView).wormholeId;
                NSLog(@"ciro debug:[WormholeEvent DidDisappear]. wormholeId:%@", wormholeId);
                NSInteger index = ((HippyWormholeItem *)self->_contentView).businessIndex;
                if (wormholeId.length > 0)
                {
                    [[HippyWormholeEngine sharedInstance].businessHandler notifyWormholeEvent:HippyWormholeEventViewDidDisappear extraData:@{@"wormholeId": wormholeId, @"index": @(index)}];
                }
            }
            self->_contentView = nil;
        }
    });
}

- (void)setDelegate:(id<HippyWormholeWrapperViewDelegate>)delegate{
    if (_delegate != delegate) {
        _delegate = delegate;
        if (_contentView) {//fill delegate
            [self dispatchViewSizeDidChangedEvent];
        }
    }
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"%@; wormhole:%@", [super description], _wormholeId];
}

- (void)dealloc
{
    if (_contentView)
    {
        [_contentView removeObserver:self forKeyPath:@"frame"];
    }
}

#pragma mark - observe
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context
{
    CGRect frame1 = [change[@"new"] CGRectValue];
    CGRect frame2 = [change[@"old"] CGRectValue];
    if (!CGRectEqualToRect(frame1, frame2)) {
        CGRect selfFrame = self.frame;
        selfFrame.size = frame1.size;
        [self setFrame:selfFrame];
        [self dispatchViewSizeDidChangedEvent];
    }
}

#pragma mark -- private
//[HippyWormholeEngine sharedInstance].nativeVueDebugEnabled)
- (void)_removeNativeView{
    UIView * nativeView = _natvieView;
    _natvieView = nil;
    CGFloat delayTime = 0.15;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayTime * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.15 delay:0 options:(UIViewAnimationOptionCurveLinear) animations:^{
                 nativeView.alpha = 0;
             } completion:^(BOOL finished) {
                 [nativeView removeFromSuperview];
                 if ([self.delegate respondsToSelector:@selector(wrapView:didRemoveNativeView:)]) {
                     [self.delegate wrapView:self didRemoveNativeView:nativeView];
                 }
                 NSLog(@"%s %d",__FUNCTION__,finished);
             }];
    });
   
}

- (void)dispatchViewSizeDidChangedEvent{
    if ([self.delegate respondsToSelector:@selector(wrapView:didChangedSize:)]) {
        if ([[NSThread currentThread] isMainThread])
        {
            [self.delegate wrapView:self didChangedSize:self.frame.size];
        }
        else
        {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.delegate wrapView:self didChangedSize:self.frame.size];
            });
        }
    }
}

- (void)_addTapGestureWithView:(UIView *)view{
    view.userInteractionEnabled = YES;
    UITapGestureRecognizer * singleClick = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onReceiveTapGestureRecognizer:)];
    [view addGestureRecognizer:singleClick];
}
//unload nativeview when wrapView did disappear（todo by tomqiu）


- (void)onReceiveTapGestureRecognizer:(UIGestureRecognizer *)gestureRecognizer{
    [self _removeNativeView];
}

@end
