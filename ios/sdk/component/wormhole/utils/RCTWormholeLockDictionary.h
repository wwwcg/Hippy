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
#import <Foundation/Foundation.h>

@interface HippyWormholeLockDictionary : NSObject

- (instancetype)initWithMutableDictionary:(NSMutableDictionary *)dic;
+ (instancetype)dictionary;
+ (instancetype)dictionaryWithMutableDictionary:(NSMutableDictionary *)dic;

- (id)objectForKey:(id)aKey;
- (void)setObject:(id)anObject forKey:(id<NSCopying>)aKey;
- (void)removeObjectForKey:(id)aKey;

- (void)setValue:(id)value forKey:(NSString *)key;
- (id)valueForKey:(NSString *)key;

- (NSArray *)allKeys;
- (NSArray *)allValues;
- (NSArray *)allKeysForObject:(id)object;

- (void)setDictionary:(NSMutableDictionary*)dic;
- (void)addEntriesFromDictionary:(NSDictionary *)otherDictionary;

- (void)removeAllObjects;
- (void)removeObjectsForKeys:(NSArray *)keys;

- (NSUInteger)count;

- (BOOL)writeToFile:(NSString *)path atomically:(BOOL)useAuxiliaryFile;

- (NSDictionary *)fetchDictionary;
- (void)enumerateKeysAndObjectsUsingBlock:(void (^)(id key, id obj, BOOL *stop))block;

@end
