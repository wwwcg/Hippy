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

#import "HippyNVUtil.h"

@implementation HippyNVUtil

+ (NSNumber * _Nullable)toNSNumber:(NSObject * _Nullable)object {
    if ([object isKindOfClass:[NSString class]]) {
        return @([((NSString *)object) longLongValue]);
    }
    return [object isKindOfClass:[NSNumber class]] ? (NSNumber *)object : nil;
}

+ (NSString * _Nullable)toNSString:(NSString * _Nullable)object{
   if ([object isKindOfClass:[NSNumber class]]) {
       return [((NSNumber *)object) stringValue];
   }
   return [object isKindOfClass:[NSString class]] ? (NSString *)object : nil;
}

+ (NSDictionary * _Nonnull)toNSDictionary:(NSDictionary * _Nullable)object{
    if ([object isKindOfClass:[NSDictionary class]]) {
        return object;
    }
    return @{};
}

+ (NSMutableDictionary * _Nonnull)toNSMutableDictionary:(NSDictionary * _Nullable)object {
    if ([object isKindOfClass:[NSMutableDictionary class]]) {
        return (NSMutableDictionary *)object;
    }
    if ([object isKindOfClass:[NSDictionary class]]) {
        return (NSMutableDictionary *)[object mutableCopy];
    }
    return [@{} mutableCopy];
}
@end
