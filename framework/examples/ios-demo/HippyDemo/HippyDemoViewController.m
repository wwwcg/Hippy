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

#import "HippyDemoViewController.h"
#import "UIViewController+Title.h"
#import "HippyPageCache.h"
@import hippy;


@interface HippyDemoViewController () <HippyBridgeDelegate, HippyRootViewDelegate> {
    HippyBridge *_hippyBridge;
    HippyRootView *_hippyRootView;
    BOOL _fromCache;
}

@end

@implementation HippyDemoViewController

- (instancetype)initWithDriverType:(DriverType)driverType
                        renderType:(RenderType)renderType
                   useHermesEngine:(BOOL)usingHermes
                          debugURL:(NSURL *)debugURL
                       isDebugMode:(BOOL)isDebugMode {
    self = [super init];
    if (self) {
        _driverType = driverType;
        _renderType = renderType;
        _useHermesEngine = usingHermes;
        _debugURL = debugURL;
        _debugMode = isDebugMode;
    }
    return self;
}

- (instancetype)initWithPageCache:(HippyPageCache *)pageCache {
    self = [super init];
    if (self) {
        _driverType = pageCache.driverType;
        _renderType = pageCache.renderType;
        _debugURL = pageCache.debugURL;
        _debugMode = pageCache.isDebugMode;
        _hippyRootView = pageCache.rootView;
        _hippyBridge = pageCache.hippyBridge;
        _fromCache = YES;
    }
    return self;
}

- (void)dealloc {
    [[HippyPageCacheManager defaultPageCacheManager] addPageCache:[self toPageCache]];
    NSLog(@"%@ dealloc", self.class);
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setNavigationAreaBackground:[UIColor whiteColor]];
    [self setNavigationItemTitle:@"Demo"];
    
    [self registerLogFunction];
    
    if (_fromCache) {
        [self runHippyCache];
    } else {
        [self runHippyDemo];
    }
}

- (void)runHippyCache {
    _hippyRootView.frame = self.contentAreaView.bounds;
    [self.contentAreaView addSubview:_hippyRootView];
}


#pragma mark - Hippy Setup

- (void)registerLogFunction {
    // Register your custom log function for Hippy,
    // use HippyDefaultLogFunction as an example, it outputs logs to stderr.
    HippySetLogFunction(^(HippyLogLevel level, HippyLogSource source, NSString *fileName, NSNumber *lineNumber, NSString *message) {
        // output hippy sdk's log to your App log
        // this is a demo imp, output to console:
        HippyDefaultLogFunction(level, source, fileName, lineNumber, message);
    });
    
    HippySetFatalHandler(^(NSError * _Nonnull error) {
        // do error report or something else...
        // fatal error will also output by HippySetLogFunction above.
        NSLog(@"Hippy Fatal Error occurred! msg:%@", error.description);
    });
}

- (void)runHippyDemo {
    // Necessary configuration:
    // `moduleName` corresponds to the Hippy App name on the JS side
    NSString *moduleName = @"Demo";
    
    // Set launch options for hippy bridge
    HippyLaunchOptions *launchOptions = [HippyLaunchOptions new];
    launchOptions.debugMode = _debugMode;
    launchOptions.useHermesEngine = _useHermesEngine;
    
    // Prepare initial properties for js side
    NSDictionary *initialProperties = @{ @"isSimulator": @(TARGET_OS_SIMULATOR) };
    
    HippyBridge *bridge = nil;
    HippyRootView *rootView = nil;
    if (_debugMode) {
        bridge = [[HippyBridge alloc] initWithDelegate:self
                                             bundleURL:_debugURL
                                        moduleProvider:nil
                                         launchOptions:launchOptions
                                           executorKey:nil];
        rootView = [[HippyRootView alloc] initWithBridge:bridge
                                              moduleName:moduleName
                                       initialProperties:initialProperties
                                                delegate:self];
    } else {
        NSURL *vendorBundleURL = [self vendorBundleURL];
        NSURL *indexBundleURL = [self indexBundleURL];
        bridge = [[HippyBridge alloc] initWithDelegate:self
                                             bundleURL:vendorBundleURL
                                        moduleProvider:nil
                                         launchOptions:launchOptions
                                           executorKey:moduleName];
        rootView = [[HippyRootView alloc] initWithBridge:bridge
                                             businessURL:indexBundleURL
                                              moduleName:moduleName
                                       initialProperties:initialProperties
                                                delegate:self];
    }
    
    // Config whether jsc is inspectable, Highly recommended setting,
    // since inspectable of JSC is disabled by default since iOS 16.4
#if DEBUG
    // Note: Open it only in non-release versions.
    [bridge setInspectable:YES];
#endif
    
    _hippyBridge = bridge;
    rootView.frame = self.contentAreaView.bounds;
    rootView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    [self.contentAreaView addSubview:rootView];
    _hippyRootView = rootView;
}


#pragma mark - HippyBridgeDelegate

- (BOOL)shouldStartInspector:(HippyBridge *)bridge {
    return bridge.debugMode;
}

- (NSURL *)inspectorSourceURLForBridge:(HippyBridge *)bridge {
    // You can customize to any url.
    // By default, we resolve the devtools address from the debug url passed to the bridge.
    return bridge.debugURL;
}

- (CGFloat)fontSizeMultiplierForHippy:(HippyBridge *)bridge {
    // This is a demo implementation, you can customize it.
    // The default value is 1.0.
    // The font size multiplier is used to scale the font size of the text in the Hippy view.
    // For example, if you set it to 2.0, the font size will be twice as large as the default size.
    return 1.0;
}

- (BOOL)shouldUseRootViewSizeAsWindowSizeInDimensions {
    // 可选设置，3.4版本后默认值为YES
    // 用于设置是否将Dimensions中的window尺寸信息绑定为RootView尺寸。
    return YES;
}

- (CGSize)defaultWindowSizeInDimensionsBeforeRootViewMount {
    // 可选设置，仅在shouldUseRootViewSizeAsWindowSizeInDimensions为YES时生效。
    // 用于设置在RootView挂载前Dimensions中window信息的默认值。
    // 适用于一些特殊场景，例如在iPad上以分屏模式启动时，js可能会在入口函数执行前获取Dimensions信息。
    return self.view.bounds.size;
}

#pragma mark - HippyRootViewDelegate

// Some imp of HippyRootViewDelegate methods, optional...


#pragma mark - Others

- (NSString *)currentJSBundleDir {
    NSString *dir = nil;
    if (DriverTypeVue2 == _driverType) {
        dir = @"res/vue2";
    } else if (DriverTypeVue3 == _driverType) {
        dir = @"res/vue3";
    } else if (DriverTypeReact == _driverType) {
        dir = @"res/react";
    }
    return dir;
}

- (NSURL *)vendorBundleURL {
    NSString *path = [[NSBundle mainBundle] pathForResource:@"vendor.ios" ofType:@"js" inDirectory:[self currentJSBundleDir]];
    return [NSURL fileURLWithPath:path];
}

- (NSURL *)indexBundleURL {
    NSString *path = [[NSBundle mainBundle] pathForResource:@"index.ios" ofType:@"js" inDirectory:[self currentJSBundleDir]];
    return [NSURL fileURLWithPath:path];
}

- (void)removeRootView:(NSNumber *)rootTag bridge:(HippyBridge *)bridge {
    [[[self.contentAreaView subviews] firstObject] removeFromSuperview];
}

- (HippyPageCache *)toPageCache {
    HippyPageCache *pageCache = [[HippyPageCache alloc] init];
    pageCache.hippyBridge = _hippyBridge;
    pageCache.rootView = _hippyRootView;
    pageCache.driverType = _driverType;
    pageCache.renderType = _renderType;
    pageCache.debugURL = _debugURL;
    pageCache.debugMode = _debugMode;
    
    // Render view hierarchy into image context
    UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat preferredFormat];
    UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:_hippyRootView.bounds.size format:format];
    UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext * _Nonnull context) {
        [_hippyRootView drawViewHierarchyInRect:_hippyRootView.bounds afterScreenUpdates:YES];
    }];

    pageCache.snapshot = image;
    return pageCache;
}

- (BOOL)shouldAutorotate {
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAllButUpsideDown;
}

@end
