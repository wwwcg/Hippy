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

#import "HippyWormholeEngine.h"
#import "HippyWormholeBusinessHandler.h"
#import "HippyEventDispatcher.h"
#import "HippyBridge+private.h"
#import "HippyWormholeFPSLabel.h"
#import "HippyWormholeThreadUtil.h"
#import "HippyWormholeViewModel.h"
#import "HippyAssert.h"
#import "HippyWormholeFactory.h"
#import "HippyWormholeLockDictionary.h"
#import "HippyBridge+Private.h"

#define ITEM_DELETE_CACHE_SIZE 16

static NSString * const kWormholePostMessageModuleName = @"wormhole";
static NSString * const kWormholePostMessageEventName = @"onWormholeMessageReceived";

@interface HippyWormholeEngine()
{
    BOOL _hasStarted;
    NSInteger _deleteItemCacheCount;
}
@property (nonatomic, strong, readwrite) HippyWormholeBusinessHandler *businessHandler;
@property (nonatomic, strong, readwrite) HippyWormholeFactory *wormholeFactory;
@property (nonatomic, strong, readwrite) HippyWormholeFPSLabel *fpsLabel;
@property (atomic, strong) NSMapTable *bridgeMap;
@property (nonatomic, strong) HippyWormholeLockDictionary *deleteItemCacheDict;

@end

@implementation HippyWormholeEngine{
    
}

#pragma mark - Life Cycle
+ (instancetype)sharedInstance
{
    static HippyWormholeEngine *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[HippyWormholeEngine alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        _releaseMode = YES;
        _bridgeMap = [NSMapTable strongToWeakObjectsMapTable];
        _deleteItemCacheCount = 0;
        self.deleteItemCacheDict = [HippyWormholeLockDictionary dictionary];
    }
    return self;
}

#pragma mark - Public Methods
- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug
{
    if (_hasStarted)
    {
        return;
    }
    [self.businessHandler configureJSBundle:commonBundlePath indexBundlePath:indexBundlePath moduleName:moduleName isDebug:isDebug replaceModules:replaceModules];
    _hasStarted = YES;
    [self setNativeVueHandler:[NSClassFromString(@"IOSNativeVueEngine") shareInstance]];
}

- (void)launchEngine:(NSURL *)commonBundlePath
     indexBundlePath:(NSURL *)indexBundlePath
 nativeVueBundlePath:(NSURL *)nvBundlePath
          moduleName:(NSString *)moduleName
      replaceModules:(nullable NSArray<id<HippyBridgeModule>> *)replaceModules
             isDebug:(BOOL)isDebug {
    //load native vue code
    NSData *data = [NSData dataWithContentsOfURL:nvBundlePath];
    if (data) {
        [[HippyWormholeEngine sharedInstance] loadNativeVueDomData:data];
    }
    [self launchEngine:commonBundlePath indexBundlePath:indexBundlePath moduleName:moduleName replaceModules:replaceModules isDebug:isDebug];
}

- (BOOL)loadNativeVueDomData:(NSData *)data {
    if (!data) {
        return NO;
    }
    return [[HippyNativeVueManager shareInstance] loadResource:data];
}

- (void)setNativeVueHandler:(id<NativeVueProtocol>)handler{
    if (handler) {
        [HippyNativeVueManager shareInstance].handler = handler;
        [self _registerDeviceInfoToNativeVueContext];
    }
}

- (void)shutdownEngine
{
    [self.businessHandler clear];
    self.businessHandler = nil;
    
    _hasStarted = NO;
}

- (void)bindTargetBridge:(HippyBridge *)targetBridge
                 rootTag:(nonnull NSNumber *)rootTag
  enableWormholeDelegate:(BOOL)enableDelegate
enableWormholeDataSource:(BOOL)enableDataSource
{
    if (!targetBridge || !rootTag) {
        return;
    }
    if (enableDelegate)
    {
        targetBridge.wormholeDelegate = self.businessHandler;
    }
    
    if (enableDataSource)
    {
        targetBridge.wormholeDataSource = self.businessHandler;
    }
    [self.bridgeMap setObject:targetBridge forKey:rootTag];
}

- (void)cancelBindBridgeByRootTag:(NSNumber *)rootTag
{
    HippyBridge *targetBridge = [self.bridgeMap objectForKey:rootTag];
    if (!targetBridge) {
        return;
    }
    targetBridge.wormholeDelegate = nil;
    targetBridge.wormholeDataSource = nil;
    [self.bridgeMap removeObjectForKey:rootTag];
}

- (void)dispatchWormholeEvent:(NSString *)eventName data:(id)data
{
    if (!data || eventName.length == 0)
    {
        return;
    }
    
    BOOL shouldDispatchEvent = YES;
    if ([eventName isEqualToString:@"Wormhole.itemDeleted"] && [data isKindOfClass:[NSDictionary class]])
    {
        NSArray *items = [((NSDictionary *)data) objectForKey:@"items"];
        NSNumber *rootTag = [((NSDictionary *)data) objectForKey:@"rootTag"];
        
        if (!rootTag || !items)
        {
            return;
        }
        
        _deleteItemCacheCount = (_deleteItemCacheCount + items.count);
        if (_deleteItemCacheCount < ITEM_DELETE_CACHE_SIZE)
        {
            // 先缓存起来
            shouldDispatchEvent = NO;
            NSArray *cachedItems = [_deleteItemCacheDict objectForKey:rootTag];
            if (!cachedItems)
            {
                [_deleteItemCacheDict setObject:items forKey:rootTag];
            }
            else
            {
                NSMutableArray *tmpArray = [NSMutableArray arrayWithArray:cachedItems];
                [tmpArray addObjectsFromArray:items];
                [_deleteItemCacheDict setObject:tmpArray forKey:rootTag];
            }
        }
        else
        {
            // 缓存池满，发送deleteItem指令
            NSDictionary *sendData = @{@"rootTag": rootTag, @"items": [_deleteItemCacheDict objectForKey:rootTag]};
            [self.businessHandler.bridge.eventDispatcher dispatchEvent:@"EventDispatcher"
                                                            methodName:@"receiveNativeEvent"
                                                                  args:@{@"eventName": eventName, @"extra": sendData}];
            
            // 清除缓存
            HippyWormholeFactory *factory = self.businessHandler.bridge.wormholeFactory;
            [factory removePartCacheOfRootView:rootTag wormholeIds:[_deleteItemCacheDict objectForKey:rootTag]];
            
            _deleteItemCacheCount = 0;
            [_deleteItemCacheDict removeAllObjects];
            return;
        }
    }
    
    if ([eventName isEqualToString:@"Wormhole.rootDeleted"] && [data isKindOfClass:[NSDictionary class]])
    {
        NSArray *rootTags = [((NSDictionary *)data) objectForKey:@"rootTags"];
        
        if (!rootTags)
        {
            return;
        }
        
        for (NSNumber *rootTag in rootTags)
        {
            HippyWormholeFactory *factory = self.businessHandler.bridge.wormholeFactory;
            [factory removeAllCacheOfRootView:rootTag];
        }
    }
    
    if (shouldDispatchEvent)
    {
        [self.businessHandler.bridge.eventDispatcher dispatchEvent:@"EventDispatcher"
                                                        methodName:@"receiveNativeEvent"
                                                              args:@{@"eventName": eventName, @"extra": data}];
    }
}

- (void)postWormholeMessage:(NSDictionary *)message
{
/*message格式:
    {
        "fromModule": "fun",             //发消息模块名，如果是虫洞则固定为wormhole
        "toModule": "wormhole",          //收消息模块名，如果是虫洞则固定为wormhole
        "rootTag": 10,                   //整数，通信的业务模块的rootTag
        "eventName": "listDidScroll",    //消息名
        "extData":{                      //可扩展字段
        }
    }
*/
    NSString *fromModule = message[@"fromModule"];
    NSString *toModule = message[@"toModule"];
    NSNumber *rootTag = message[@"rootTag"];
    NSString *eventName = message[@"eventName"];
    if (!(fromModule && toModule && eventName && rootTag)) {
        return;
    }
    if ([toModule isEqualToString:kWormholePostMessageModuleName]) {
        [self dispatchWormholeEvent:kWormholePostMessageEventName data:message];
    } else {
        HippyBridge *targetBridge = [self.bridgeMap objectForKey:rootTag];
        [targetBridge.eventDispatcher dispatchEvent:@"EventDispatcher"
                                         methodName:@"receiveNativeEvent"
                                               args:@{@"eventName": kWormholePostMessageEventName, @"extra": message}];
    }
}

- (void)switchFPSMonitor:(BOOL)on
{
#if DEBUG
    if (on)
    {
        [HippyWormholeThreadUtil performOnMainThreadWithBlock:^{
            self.fpsLabel.hidden = NO;
        }];
    }
    else
    {
        [HippyWormholeThreadUtil performOnMainThreadWithBlock:^{
            [self.fpsLabel removeFromSuperview];
            self.fpsLabel = nil;
        }];
    }
#endif
}

#pragma mark - For Native Case
- (HippyWormholeViewModel *)newWormholeViewModel:(NSDictionary *)data
{
    HippyAssert(![NSThread isMainThread], @"Wormhole ViewModel should not be created on Main Thread!");
    
    if (!data || ![data isKindOfClass:[NSDictionary class]])
    {
        return nil;
    }
    
    HippyWormholeViewModel *viewModel = [self.businessHandler wormholeViewModelWithRawData:data];
    [self.businessHandler enqueueWormholeViewModel:viewModel];
    
    return viewModel;
}

#pragma mark - Lazy Load
- (HippyWormholeBusinessHandler *)businessHandler
{
    if (!_businessHandler)
    {
        _businessHandler = [[HippyWormholeBusinessHandler alloc] init];
    }
    
    return _businessHandler;
}

- (HippyWormholeFactory *)wormholeFactory
{
    return self.businessHandler.bridge.wormholeFactory;
}

- (HippyWormholeFPSLabel *)fpsLabel
{
    if (!_fpsLabel)
    {
        CGFloat width = 55.0f;
        CGFloat height = 20.0f;
        CGFloat x = CGRectGetWidth([UIScreen mainScreen].bounds) - width;
        CGFloat y = 64.0f;
        _fpsLabel = [[HippyWormholeFPSLabel alloc] initWithFrame:CGRectMake(x, y, width, height)];
        UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
        if (window)
        {
            [window addSubview:_fpsLabel];
        }
    }
    
    return _fpsLabel;
}

#pragma mark - initNativeEngine{

- (void)_registerDeviceInfoToNativeVueContext{
    NSDictionary * deviceInfo = [self.businessHandler.bridge.batchedBridge deviceInfo];
    [deviceInfo enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
        [[HippyNativeVueManager shareInstance] registerGlobalVaribleWithKey:key value:obj];
    }];
}

@end
