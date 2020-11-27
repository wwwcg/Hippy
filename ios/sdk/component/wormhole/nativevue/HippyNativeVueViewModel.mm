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

#import "HippyNativeVueViewModel.h"
#import "HippyNVComponentTreeBuilder.h"
#import <libkern/OSAtomic.h>
#import "HippyAssert.h"
#import "HippyNVComponent.h"
#import "HippyNativeVueManager.h"

#define MAX_QUEUE_COUNT 5
static dispatch_queue_t HippyNativeVueViewAsyncBuildQueue() {
    static int queueCount;
    static dispatch_queue_t queues[5];
    static dispatch_once_t onceToken;
    static int32_t counter = 0;
    dispatch_once(&onceToken, ^{
        queueCount = (int)[NSProcessInfo processInfo].activeProcessorCount;
        queueCount = queueCount < 1 ? 1 : queueCount > MAX_QUEUE_COUNT ? MAX_QUEUE_COUNT : queueCount;
        for (NSUInteger i = 0; i < queueCount; i++) {
            dispatch_queue_attr_t attr = dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_USER_INITIATED, 0);
            queues[i] = dispatch_queue_create("com.tencent.nativevue.render", attr);
        }
    });
    uint32_t cur = (uint32_t)OSAtomicIncrement32(&counter);
    return queues[(cur) % queueCount];
}


@implementation HippyNativeVueViewModel{
    NSString *_jsonDom;
    NSDictionary *_domData;
    HippyNVComponentTreeBuilder * _treeBuilder;
    BOOL _building;
    __weak HippyUIManager * _context;
    HippyNVComponent * _rootComponent;
    UIView * _view;
}

- (instancetype)initWithJsonDom:(NSString *)jsonDom domData:(NSDictionary *)domData context:(HippyUIManager *)context{
    if (self = [super init]) {
        _jsonDom = jsonDom;
        _domData =domData;
        _context = context;
    }
    return self;
}




- (void)asyncBuildWithCompletion:(HippyNVBuildCompletion)completion {
    if (_treeBuilder) {
        completion(self);
    }else if(!_building){
        _building = true;//多线程构建&布局
        dispatch_async(HippyNativeVueViewAsyncBuildQueue(), ^{
            [self syncBuild];
            completion(self);
        });
    }
}

- (void)syncBuild{
    NSDictionary * virtualDom = [self _getVirtualDom];
    if (![virtualDom isKindOfClass:[NSDictionary class]]) {
        self->_building = false;
        return ;
    }
    double beginTime = CFAbsoluteTimeGetCurrent();
    HippyNVComponentTreeBuilder * builder = [[HippyNVComponentTreeBuilder alloc] initWithContext:self->_context];
    self->_rootComponent = [builder buildComponentTreeWithVirtualDom:[self _getVirtualDom]];
    self->_treeBuilder = builder;
    self->_building = false;
     double endTime = CFAbsoluteTimeGetCurrent();
    NSLog(@"%s_cost_time:%.3lfms",__FUNCTION__, (endTime - beginTime) * 1000);
}

- (UIView * _Nullable)view{
    HippyAssert([NSThread isMainThread],@"only on the main thread");
    if (!_view) {
        _view = [_treeBuilder view];;
    }
    return _view;
}

- (CGFloat)viewWidth{
    return self->_rootComponent.frame.size.width;
}
- (CGFloat)viewHeight{
    return self->_rootComponent.frame.size.height;
}

 //nativevue todo by tomqiu 是个代理
- (NSDictionary *)_getVirtualDom{
    return [[HippyNativeVueManager shareInstance] virtualDomWithJsonDom:_jsonDom domData:_domData];
//    //假
//    NSDictionary * res = [@{
//        @"type":@"View",
//        @"tag":@(0),
//        @"style":@{
//            @"width":@(300),
//            @"padding":@(30),
//            @"backgroundColor":@(4283410490),
//            @"alignItems":@"center"
//        },
//        @"children":@[
//                @{
//                    @"type": @"Text",
//                    @"tag" : @(1),
//                    @"style" : @{
//                            @"backgroundColor":@(11473410490),
//                            @"fontSize" : @(20),
//                            @"text": @"我是NativeVue创建出来的文本"
//                    }
//                },
//                @{
//                    @"type": @"Text",
//                    @"tag" : @(2),
//                    @"style" : @{
//                            @"marginTop":@(20),
//                            @"fontSize" : @(20),
//                            @"text": @"我是NativeVue创建出来的文本2"
//                    }
//                },
//                @{
//                                   @"type": @"Image",
//                                   @"tag" : @(3),
//                                   @"style" : @{
//                                           @"marginTop":@(20),
//                                           @"width":@(100),
//                                           @"height":@(100),
//                                           @"borderRadius":@(10),
//                                           @"source" :
//                                                        @[  @{
//                                               @"uri" : @"http://zxpic.imtt.qq.com/zxpic_imtt/2018/06/08/2000/originalimage/200721_3738332814_3_540_364.jpg"
//                                                  }
//
//                                                ]
//                                   }
//                 },
//                @{
//                                   @"type": @"Text",
//                                   @"tag" : @(6),
//                                   @"style" : @{
//                                           @"fontSize" : @(20),
//                                           @"text": @"我是NativeVue创建出来的文本"
//                                   }
//                               },
//                               @{
//                                   @"type": @"Text",
//                                   @"tag" : @(7),
//                                   @"style" : @{
//                                           @"marginTop":@(20),
//                                           @"fontSize" : @(20),
//                                           @"text": @"我是NativeVue创建出来的文本2"
//                                   }
//                               },
//                               @{
//                                                  @"type": @"Image",
//                                                  @"tag" : @(8),
//                                                  @"style" : @{
//                                                          @"marginTop":@(20),
//                                                          @"width":@(100),
//                                                          @"height":@(100),
//                                                          @"borderRadius":@(10),
//                                                          @"source" :
//                                                                       @[  @{
//                                                              @"uri" : @"http://zxpic.imtt.qq.com/zxpic_imtt/2018/06/08/2000/originalimage/200721_3738332814_3_540_364.jpg"
//                                                                 }
//
//                                                               ]
//                                                  }
//                                }
//        ]
//    } mutableCopy];
//
//
////    NSString * jsonString = @""
//     NSString * pathJson = [[NSBundle mainBundle] pathForResource:@"nv_json" ofType:@"json"];
//
//    NSData * data = [[NSFileManager defaultManager] contentsAtPath:pathJson];
//    NSDictionary * json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
//
//
//    res = json;
  //  return res;
    
}

- (BOOL)buildCompleted{
    return _treeBuilder != nil;
}

- (void)dealloc{
    UIView * view = _view;
    dispatch_async(dispatch_get_main_queue(), ^{
        [view description];//保证主线程释放
    });
}

@end
