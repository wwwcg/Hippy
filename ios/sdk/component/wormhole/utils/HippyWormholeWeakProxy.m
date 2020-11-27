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
#import "HippyWormholeWeakProxy.h"

#if DEBUG
@implementation HippyWormholeWeakProxy

- (instancetype)initWithTarget:(id)target
{
    _target = target;
    return self;
}

+ (instancetype)proxyWithTarget:(id)target
{
    return [[HippyWormholeWeakProxy alloc] initWithTarget:target];
}

#pragma mark - private
- (id)forwardingTargetForSelector:(SEL)selector
{
    return _target;
}

#pragma mark - over write
- (void)forwardInvocation:(NSInvocation *)invocation
{
    void *null = NULL;
    [invocation setReturnValue:&null];
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector
{
    return [NSObject instanceMethodSignatureForSelector:@selector(init)];
}

- (BOOL)respondsToSelector:(SEL)aSelector
{
    return [_target respondsToSelector:aSelector];
}

#pragma mark - <NSObject>
- (BOOL)isEqual:(id)object
{
    return [_target isEqual:object];
}

- (NSUInteger)hash
{
    return [_target hash];
}

- (Class)superclass
{
    return [_target superclass];
}

- (Class)class
{
    return [_target class];
}

- (BOOL)isKindOfClass:(Class)aClass
{
    return [_target isKindOfClass:aClass];
}

- (BOOL)isMemberOfClass:(Class)aClass
{
    return [_target isMemberOfClass:aClass];
}

- (BOOL)conformsToProtocol:(Protocol *)aProtocol
{
    return [_target conformsToProtocol:aProtocol];
}

- (BOOL)isProxy
{
    return YES;
}

- (NSString *)description
{
    return [_target description];
}

- (NSString *)debugDescription
{
    return [_target debugDescription];
}

@end

#else

@implementation HippyWormholeWeakProxy

@end

#endif
