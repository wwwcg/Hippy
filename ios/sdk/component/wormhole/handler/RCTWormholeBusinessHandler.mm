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

#import "HippyWormholeBusinessHandler.h"
#import "HippyRootView.h"
#import "HippyBridge.h"
#import "HippyVirtualWormholeNode.h"
#import "HippyWormholeFactory.h"
#import "HippyVirtualNode.h"
#import "HippyWormholeWrapperView.h"
#import "HippyWormholeItem.h"
#import "HippyWormholeViewModel.h"
#import "HippyShadowView.h"
#import "HippyWormholeTagShadowView.h"
#import "HippyNativeVueViewModel.h"
#import "HippyWormholeThreadUtil.h"
#import "HippyWormholeEngine.h"
#import "HippyNativeVueManager.h"
#import "HippyConvert.h"

@interface HippyWormholeBusinessHandler () <HippyWormholeViewModelDelegate>
{
    NSMutableArray<NSString *> *_wormholeViewModelKeys;
    NSMutableDictionary<NSString *, HippyWormholeViewModel *> *_wormholeViewModelDict;
}

@property (nonatomic, strong, readwrite) HippyBridge *bridge;
@property (nonatomic, strong, readwrite) HippyRootView *rootView;

@end

@implementation HippyWormholeBusinessHandler

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        _wormholeViewModelKeys = [NSMutableArray array];
        _wormholeViewModelDict = [NSMutableDictionary dictionary];
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationBecomeActive:)
                                                     name:UIApplicationWillEnterForegroundNotification object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationEnterBackground:)
                                                     name: UIApplicationDidEnterBackgroundNotification object:nil];
    }
    
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Public Methods
- (void)configureJSBundle:(NSURL *)commonBundlePath
          indexBundlePath:(NSURL *)indexBundlePath
               moduleName:(NSString *)moduleName
                  isDebug:(BOOL)isDebug
           replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
{
    if (!commonBundlePath.absoluteString.length || !indexBundlePath.absoluteString.length)
    {
        return;
    }
    
    if (self.rootView || self.bridge)
    {
        return;
    }
    
    NSArray *tmpReplaceModules = [replaceModules copy];
    
    BOOL isSimulator = NO;
#if TARGET_IPHONE_SIMULATOR
    isSimulator = YES;
#endif
    
    NSDictionary *debugKey = @{@"DebugMode": @(isDebug)};
    if (tmpReplaceModules)
    {
        self.bridge = [[HippyBridge alloc] initWithBundleURL:commonBundlePath moduleProvider:^NSArray<id<HippyBridgeModule>> *{
            return tmpReplaceModules;
        } launchOptions:debugKey];
    }
    else
    {
        self.bridge = [[HippyBridge alloc] initWithDelegate:self bundleURL:commonBundlePath moduleProvider:nil launchOptions:debugKey executorKey:nil];
    }
    
    self.bridge.wormholeDataSource = self;
    self.bridge.wormholeDelegate = self;
    
    if (isDebug)
    {
        self.rootView = [[HippyRootView alloc] initWithBridge:self.bridge
                                                 moduleName:moduleName
                                          initialProperties:nil
                                               shareOptions:nil
                                                   delegate:nil];
    }
    else
    {
        self.rootView = [[HippyRootView alloc] initWithBridge: self.bridge
                                                businessURL: indexBundlePath
                                                 moduleName: moduleName
                                          initialProperties: @{@"isSimulator": @(isSimulator)}
                                              launchOptions: nil
                                               shareOptions: nil
                                                  debugMode: NO
                                                   delegate: nil];
    }
}

- (HippyWormholeWrapperView *)wormholeWrapperView:(NSString *)wormholeId;
{
    if (wormholeId.length == 0)
    {
        return nil;
    }
    
    HippyWormholeWrapperView *wrapperView = [self.bridge.wormholeFactory wormholeWrapperViewForWormholeId:wormholeId];
    return wrapperView;
}

- (void)clear
{
    [_wormholeViewModelKeys removeAllObjects];
    [_wormholeViewModelDict removeAllObjects];
    
    _wormholeViewModelKeys = nil;
    _wormholeViewModelDict = nil;
    
    [self.bridge.wormholeFactory clear];
    self.bridge.wormholeFactory = nil;
    
    self.bridge = nil;
    self.rootView = nil;
}

- (void)notifyWormholeEvent:(HippyWormholeEvent)event extraData:(NSDictionary *)extraData
{
    if (!extraData || ![extraData isKindOfClass:[NSDictionary class]])
    {
        return;
    }
    
    NSString *wormholeId = nil;
    NSInteger index = -1;
    if (extraData[@"wormholeId"] && [extraData[@"wormholeId"] isKindOfClass:[NSString class]])
    {
        wormholeId = extraData[@"wormholeId"];
    }
    
    if (extraData[@"index"] && [extraData[@"index"] isKindOfClass:[NSNumber class]])
    {
        index = [extraData[@"index"] integerValue];
    }
    
    NSString *eventName = nil;
    switch (event) {
        case HippyWormholeEventViewDidAppear:
            eventName = @"Wormhole.didAppear";
            break;
        case HippyWormholeEventViewDidDisappear:
            eventName = @"Wormhole.didDisappear";
            break;
        case HippyWormholeEventEnterForeground:
            eventName = @"Wormhole.enterForeground";
            break;
        case HippyWormholeEventEnterBackground:
            eventName = @"Wormhole.enterBackground";
            break;
        default:
            break;
    }
    
    if (eventName)
    {
        NSLog(@"ciro debug:[wormholeView didTrigEvent]:%@, wormholeId:%@, index:%ld", eventName, wormholeId, index);
        
        [self.rootView.bridge.eventDispatcher dispatchEvent:@"EventDispatcher"
                                                 methodName:@"receiveNativeEvent"
                                                       args:@{@"eventName": eventName, @"extra": extraData}];
    }
}

#pragma mark - Private Methods

#pragma mark - HippyBridgeDelegate


- (void)loadSourceForBridge:(HippyBridge *)bridge onProgress:(HippySourceLoadProgressBlock)onProgress onComplete:(HippySourceLoadBlock)loadCallback{
    //虫洞需要优先nv文件，接着加载js文件
    NSURL * bundleURL = bridge.bundleURL;
    NSURL * nvURL = [[HippyNativeVueManager shareInstance] nvFileURLWithMainBundleURL:bundleURL];
    if ([nvURL isKindOfClass:[NSURL class]]) {
        HippyLogInfo(@"%s nvUrl:%@ bundleUrl:%@",__FUNCTION__,nvURL.absoluteString, bundleURL.absoluteString);
        [HippyJavaScriptLoader loadBundleAtURL:nvURL onProgress:onProgress onComplete:^(NSError *error, NSData *source, int64_t sourceLength) {
                    if(!error && source && sourceLength > 100){
                       HippyLogInfo(@"nvFileUrl load success");
                       [[HippyNativeVueManager shareInstance] loadResource:source];
                    }else {
                       HippyLogInfo(@"nvFileUrl load error:%@", error);
                    }
                    [HippyJavaScriptLoader loadBundleAtURL:bundleURL onProgress:onProgress onComplete:^(NSError *error, NSData *source, int64_t sourceLength) {
                          loadCallback(error, source, sourceLength);
                    }];
              }];
    }else {
        HippyLogInfo(@"%s not nv with bundleUrl:%@",__FUNCTION__, bundleURL.absoluteString);
        [HippyJavaScriptLoader loadBundleAtURL:bundleURL onProgress:onProgress onComplete:^(NSError *error, NSData *source, int64_t sourceLength) {
              loadCallback(error, source, sourceLength);
        }];
    }
}



#pragma mark - HippyWormholeDataSource
- (HippyWormholeWrapperView *)wormholeViewWithWormholeId:(NSString *)wormholeId
                                         nvOverlayView:(UIView * _Nullable)nvOverlayView
{
    HippyAssert([NSThread isMainThread],@"should run on the main thread");
    HippyWormholeWrapperView * wormholdView = [self.bridge.wormholeFactory wormholeWrapperViewForWormholeId:wormholeId];
    HippyVirtualWormholeNode * node = [self.bridge.wormholeFactory wormholeNodeForWormholeId:wormholeId];
    
    if (!node && wormholdView)
    {
        NSNumber *reactTag = [self.bridge.wormholeFactory wormholeReactTagForWormholeId:wormholeId];
        if (reactTag)
        {
            // 再次寻找
            node = (HippyVirtualWormholeNode *)[self.bridge.uiManager nodeForReactTag:reactTag];
        }
    }
    
    if (!wormholdView) {
        wormholdView = [[HippyWormholeWrapperView alloc] initWithWormholeId:wormholeId natvieView:nvOverlayView];
        [self.bridge.wormholeFactory setWormholeWrapperView:wormholdView forWormholeId:wormholeId];
    }
    
    if (node) {
        [self setContentViewWithWormholeId:wormholeId node:node wrapView:wormholdView];
    }
    
    return wormholdView;
}

#pragma mark - HippyWormholeDelegate

- (void)didReceiveWormholeData:(NSDictionary *)data rootTag:(NSNumber *)rootTag {
    if (!data)
    {
        HippyAssert(data, @"data source can't be nil!");
        return;
    }
    
    // 数据形式 [ {rootTag: 10, items: [data1, data2, ...]}, {rootTag: 11, items: [data3, data4, ...]} ]
    NSDictionary *singleItem = @{ @"rootTag": rootTag, @"items": @[data] };
    [self.bridge.eventDispatcher dispatchEvent:@"EventDispatcher"
                                    methodName:@"receiveNativeEvent"
                                          args:@{@"eventName": @"Wormhole.dataReceived", @"extra": @[singleItem]}];
}

- (void)didCreatedViewModel:(HippyWormholeViewModel *)wholeViewModel{
    
    [HippyWormholeThreadUtil performOnMainThreadWithBlock:^{
        NSLog(@"did create wormhole view model.");
    }];
}

- (void)didCreateWormholeNode:(HippyVirtualWormholeNode *)wormholeNode userInfo:(NSDictionary *)userInfo
{
    if (!userInfo || !wormholeNode)
    {
        return;
    }
    
    NSString *wormholeId = userInfo[@"wormholeId"];
    
    if (wormholeId.length == 0)
    {
        return;
    }
    
    HippyWormholeFactory *wormholeFactory = [self.bridge wormholeFactory];
    // create WrapperView first
    HippyWormholeWrapperView *wrapperView = [wormholeFactory wormholeWrapperViewForWormholeId:wormholeId];
    if (!wrapperView) {
        return ;
    }
    [self setContentViewWithWormholeId:wormholeId node:wormholeNode wrapView:wrapperView];
}

#pragma mark -
- (void)setContentViewWithWormholeId:(NSString *)wormholeId
                                node:(HippyVirtualWormholeNode *)node
                            wrapView:(HippyWormholeWrapperView *)wrapperView
{
    UIView *wormholeView = [self.bridge.uiManager createViewFromNode:node];
    wrapperView.wormholeNode = node;
    
    if (wormholeView)
    {
        [wrapperView setContentView:wormholeView];
        
        NSLog(@"ciro debug:[WormholeEvent DidAppear]. wormholeId:%@", wormholeId);
        NSInteger index = ((HippyWormholeItem *)wormholeView).businessIndex;
        if (wormholeId.length > 0)
        {
            [self notifyWormholeEvent:HippyWormholeEventViewDidAppear extraData:@{@"wormholeId": wormholeId, @"index": @(index)}];
        }
    }
}

#pragma mark - For Native Interfaces

/// 根据原始数据生成一个WormholeViewModel
- (HippyWormholeViewModel *)wormholeViewModelWithRawData:(NSDictionary *)rawData
{
    HippyAssert(![NSThread isMainThread], @"Wormhole ViewModel should not be created on Main Thread!");
    HippyWormholeViewModel *viewModel = [[HippyWormholeViewModel alloc] initWithParams:rawData rootTag:@(10)];
    [viewModel syncBuild];  //NativeVue同步构建
    return viewModel;
}

/// 添加一个WormholeViewModel至数据源
- (void)enqueueWormholeViewModel:(HippyWormholeViewModel *)viewModel
{
    if (!viewModel || viewModel.wormholeId.length == 0)
    {
        return;
    }
    
    NSString *wormholeId = viewModel.wormholeId;
    if ([_wormholeViewModelKeys containsObject:wormholeId])
    {
        // 已经存在
        return;
    }
    
    [_wormholeViewModelKeys addObject:wormholeId];
    [_wormholeViewModelDict setObject:viewModel forKey:wormholeId];
}

/// 移除一个WormholeViewModel从数据源
- (void)dequeueWormholeViewModel:(HippyWormholeViewModel *)viewModel
{
    if (!viewModel || viewModel.wormholeId.length == 0)
    {
        return;
    }
    
    NSString *wormholeId = viewModel.wormholeId;
    
    [_wormholeViewModelKeys removeObject:wormholeId];
    [_wormholeViewModelDict removeObjectForKey:wormholeId];
}

#pragma mark - Handle Notifications

- (void)applicationBecomeActive:(NSNotification *)notification
{
    [self notifyWormholeEvent:HippyWormholeEventEnterForeground extraData:@{}];
}

- (void)applicationEnterBackground:(NSNotification *)notification
{
    [self notifyWormholeEvent:HippyWormholeEventEnterBackground extraData:@{}];
}

@end
