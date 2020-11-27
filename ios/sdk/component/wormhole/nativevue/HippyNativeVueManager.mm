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

#import "HippyNativeVueManager.h"
#import "NSObject+NativeVue.h"
#import <UIKit/UIKit.h>
#import "HippyWormholeThreadUtil.h"
#import "HippyLog.h"
#import "HippyConvert.h"
#import "HippyWormholeEngine.h"
#define NativeVueLogNotificationName @"_NativeVueLogNotificationName"

@interface HippyNativeVueManager()

@property(atomic, strong) NSDictionary * vueDomMap;
@property(atomic, strong) NSString * routerScript;


@end

@implementation HippyNativeVueManager


+ (instancetype)shareInstance{
    static HippyNativeVueManager * instance ;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [HippyNativeVueManager new];
    });
    return instance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self _addNotifications];
    }
    return self;
}

- (BOOL)loadResource:(NSData *)resource{
    //resource to json
    NSAssert([resource isKindOfClass:[NSData class]], @"resource is not NSData");
    NSString * resourceString = [[NSString alloc] initWithData:resource encoding:NSUTF8StringEncoding];
    NSDictionary * vueDomMap = [resourceString nv_stringToDictionary];
    NSAssert([vueDomMap isKindOfClass:[NSDictionary class]], @"vueDomMap is not NSDictionary");
    if ([vueDomMap isKindOfClass:[NSDictionary class]]) {
        self.vueDomMap = vueDomMap;
        [self initIndexConfig];
    }
    return [vueDomMap isKindOfClass:[NSDictionary class]];
}

- (NSString *)jsonDomWithTemplateId:(NSString *)templatedId{
    if ([templatedId isKindOfClass:[NSString class]] && templatedId.length) {
        NSString * vueDomString = self.vueDomMap[templatedId];
        return vueDomString;
    }
    return nil;
}

- (NSString *)templateIdWithData:(NSDictionary *)domData{
    if (!self.handler) {
        return nil;
    }
    NSString * routerScript = self.routerScript;
    if([routerScript isKindOfClass:[NSString class]] && routerScript.length){
        return [self.handler routerWithScript:routerScript data:domData];
    }
    return nil;
}

- (NSDictionary *)virtualDomWithJsonDom:(NSString *)jsonDom domData:(NSDictionary *)domData{
    return [self.handler virtualDomWithJsonDom:jsonDom domData:domData];
}

- (void)registerGlobalVaribleWithKey:(NSString *)key value:(NSObject *)value{
    
    [self.handler registerGlobalVaribleWithKey:key value:value];
    
}

#pragma mark - private

- (void)initIndexConfig {
    NSString * indexJsonString = self.vueDomMap[@"index"];
    if ([indexJsonString isKindOfClass:[NSString class]] && indexJsonString.length) {
        NSDictionary * indexJson = [indexJsonString nv_stringToDictionary];
        self.routerScript = indexJson[@"router"];
        
        NSDictionary * templateValue = [indexJson[@"template"] nv_stringToDictionary];
        
        if ([templateValue isKindOfClass:[NSDictionary class]] && templateValue[@"attr"]) {
            self.debugCard = [templateValue[@"attr"][@"debug"] boolValue];
        }
    }
}


- (void)_addNotifications{
    //
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onReceiveNativeVueLogNotification:) name:NativeVueLogNotificationName object:nil];
}

#pragma mark - notify

- (void)onReceiveNativeVueLogNotification:(NSNotification *)notification{
    NSString * errorInfo = notification.userInfo[@"error"];
    NSString * debugInfo = notification.userInfo[@"debug"];
    if (errorInfo.length && (self.debugCard || ![HippyWormholeEngine sharedInstance].isReleaseMode)) {
        [HippyWormholeThreadUtil performOnMainThreadWithBlock:^{
            UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"NativeVue Error"
                                                                                             message:errorInfo
                                                                                      preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"复制" style:UIAlertActionStyleDefault
                                                                                    handler:^(UIAlertAction * action) {
                                                                                        //响应事件
            UIPasteboard * pasteboard = [UIPasteboard generalPasteboard];
                 pasteboard.string = (errorInfo ? : @"");
            }];
            [alert addAction:defaultAction];
            id<UIApplicationDelegate> appdelegate =(id<UIApplicationDelegate>)([[UIApplication sharedApplication] delegate]);
            UIViewController *rootViewController = appdelegate.window.rootViewController;
            [rootViewController presentViewController:alert animated:YES completion:nil];
        }];
        HippyLogError(@"%@", errorInfo);
    }else if(debugInfo.length){
        HippyLogInfo(@"%@", debugInfo);
    }
}

- (void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


- (NSURL *)nvFileURLWithMainBundleURL:(NSURL *)bundleURL{
    NSString * url = bundleURL.absoluteString;
    if ([url hasPrefix:@"http"] && [url rangeOfString:@"index.bundle"].length) {
        url = [url stringByReplacingOccurrencesOfString:@"index.bundle" withString:@"../nv.json"];
     //   url = @"https://kd.qpic.cn/kamlin/nv_d4b9f962.json";
        return [NSURL URLWithString:url];
    }
    url = [self fileNameWithPathUrl:url];
    NSURL * URL =  [NSURL URLWithString:url];
    if (URL.isFileURL) {
        if (![[NSFileManager defaultManager] fileExistsAtPath:URL.path]) {
            return nil;
        };
    }
    return URL;
}

- (NSString *)fileNameWithPathUrl:(NSString *)pathUrl{
    NSArray * urls = [pathUrl componentsSeparatedByString:@"?"];
    NSString * fileName = ((NSString *)urls.firstObject).lastPathComponent;
    if (fileName.length) {
         pathUrl = [pathUrl stringByReplacingOccurrencesOfString:fileName withString:@"nv.json"];
    }
    return pathUrl;
}

@end

