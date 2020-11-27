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

#import "HippyWormholeThreadUtil.h"

@implementation HippyWormholeThreadUtil

+ (void)performOnMainThreadWithBlock:(dispatch_block_t)block{
    [[self class] performOnMainThreadWithBlock:block waitUntilDone:NO];
}


+ (void)performOnMainThreadWithBlock:(dispatch_block_t)block waitUntilDone:(BOOL)wait{
    if (!block) {
        return ;
    }
    if ([NSThread isMainThread]) {
        block();
    }else {
        if (wait) {
            dispatch_sync(dispatch_get_main_queue(), block);
        }else {
            dispatch_async(dispatch_get_main_queue(), block);
        }
    }
}


@end
