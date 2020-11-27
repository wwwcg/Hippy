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

#import "HippyWormholeFactory.h"
#import "objc/runtime.h"
#import "HippyWormholeItem.h"
#import "HippyWormholeWrapperView.h"
#import "HippyBridge+Private.h"
#import <os/lock.h>
#import "HippyWormholeLockDictionary.h"

API_AVAILABLE(ios(10.0))
@interface HippyWormholeFactory () {
    __weak HippyBridge *_bridge;
    NSMapTable *_wormholeWrapperMapTable;
    
    HippyWormholeLockDictionary *_wormholeViewModelDict;
    HippyWormholeLockDictionary *_wormholeNodeDict;
    
    os_unfair_lock _unfairLock;
    NSRecursiveLock *_lock;
    NSMutableDictionary *_wormholeIdCache;
    NSMutableDictionary *_indexKeyCache;
    NSMutableDictionary *_hippyTagsDict;
}

@end

@implementation HippyWormholeFactory

- (instancetype) initWithBridge:(HippyBridge *)bridge {
    self = [super init];
    if (self) {
        _bridge = bridge;
        _wormholeWrapperMapTable = [NSMapTable strongToWeakObjectsMapTable];
        _wormholeNodeDict = [HippyWormholeLockDictionary dictionary];
        _wormholeViewModelDict = [HippyWormholeLockDictionary dictionary];
        _wormholeIdCache = [NSMutableDictionary dictionary];  // (rootTag + index)为key 唯一映射 wormholeId
        _indexKeyCache = [NSMutableDictionary dictionary];    // wormholeId为key 唯一映射 索引key(rootTag + index)
        _hippyTagsDict = [NSMutableDictionary dictionary];
        
        if (@available(iOS 10.0, *)) {
            _unfairLock = OS_UNFAIR_LOCK_INIT;
        } else {
            _lock = [NSRecursiveLock new];
        }
    }
    return self;
}

- (NSDictionary *)nodeCache
{
    return [_wormholeNodeDict fetchDictionary];
}
- (NSMapTable *)wrapperCache
{
    return _wormholeWrapperMapTable;
}
- (NSDictionary *)viewModelCache
{
    return [_wormholeViewModelDict fetchDictionary];
}

- (void)setWormholeWrapperView:(HippyWormholeWrapperView *)wrapperView forWormholeId:(NSString *)wormholeId {
    if (wormholeId.length == 0)
    {
        return;
    }
    
    [self p_SetObject:wrapperView forKey:wormholeId mapTable:_wormholeWrapperMapTable];
}

- (void)setWormholeNode:(HippyVirtualWormholeNode *)node forWormholeId:(NSString *)wormholeId {
    if (!node || wormholeId.length == 0)
    {
        return;
    }
    
    [_wormholeNodeDict setObject:node forKey:wormholeId];
}

- (void)setWormholeNodeWithHippyTag:(NSNumber *)hippyTag forWormholeId:(NSString *)wormholeId
{
    [_hippyTagsDict setObject:hippyTag forKey:wormholeId];
}

- (void)setWormholeViewModel:(HippyWormholeViewModel *)model forWormholeId:(NSString *)wormholeId
{
    if (wormholeId.length == 0 || !model)
    {
       return;
    }
    
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        
        [self p_SetWormholeViewModel:model forWormholeId:wormholeId];
        
        os_unfair_lock_unlock(&_unfairLock);
    } else {
        [_lock lock];
        
        [self p_SetWormholeViewModel:model forWormholeId:wormholeId];
        
        [_lock unlock];
    }
}

- (void)removeWormholeWrapperView:(NSString *)wormholeId
{
    if (wormholeId.length == 0)
    {
       return;
    }
    
    [self p_RemoveObjectForKey:wormholeId mapTable:_wormholeWrapperMapTable];
}

- (void)removeWormholeNode:(NSString *)wormholeId
{
    if (wormholeId.length == 0)
    {
       return;
    }
    
    [_wormholeNodeDict removeObjectForKey:wormholeId];
}

- (void)removeWormholeViewModel:(NSString *)wormholeId
{
    if (wormholeId.length == 0)
    {
       return;
    }
    
    [_wormholeViewModelDict removeObjectForKey:wormholeId];
}

- (HippyWormholeWrapperView *)wormholeWrapperViewForWormholeId:(NSString *)wormholeId {
    if (wormholeId.length == 0)
    {
        return nil;
    }
    
    return (HippyWormholeWrapperView *)[self p_ObjectForKey:wormholeId mapTable:_wormholeWrapperMapTable];
}

- (HippyVirtualWormholeNode *)wormholeNodeForWormholeId:(NSString *)wormholeId {
    if (wormholeId.length == 0)
    {
        return nil;
    }
    
    return (HippyVirtualWormholeNode *)[_wormholeNodeDict objectForKey:wormholeId];
}

- (NSNumber *)wormholeHippyTagForWormholeId:(NSString *)wormholeId
{
    return (NSNumber *)[_hippyTagsDict objectForKey:wormholeId];
}

- (HippyWormholeViewModel *)wormholeViewModelForWormholeId:(NSString *)wormholeId{
    if (wormholeId.length == 0)
    {
        return nil;
    }
    
    return (HippyWormholeViewModel *)[_wormholeViewModelDict objectForKey:wormholeId];
}

/// 删除指定Wormhole Ids的缓存（包含wrapperView、Node、viewModel）
- (void)removePartCacheOfRootView:(NSNumber *)rootTag
                      wormholeIds:(NSArray<NSString *> *)wormholeIds
{
    if (!wormholeIds || !rootTag)
    {
        return;
    }
    
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        [self p_RemoveCache:wormholeIds rootTag:rootTag deleteAllFlag:NO];
        os_unfair_lock_unlock(&_unfairLock);
    } else {
        [_lock lock];
        [self p_RemoveCache:wormholeIds rootTag:rootTag deleteAllFlag:NO];
        [_lock unlock];
    }
}

- (void)removeAllCacheOfRootView:(NSNumber *)rootTag
{
    if (!rootTag)
    {
        return;
    }
    
    if (@available(iOS 10.0, *))
    {
        os_unfair_lock_lock(&_unfairLock);
        [self p_RemoveAllCacheOfRootView:rootTag];
        os_unfair_lock_unlock(&_unfairLock);
    }
    else
    {
        [_lock lock];
        [self p_RemoveAllCacheOfRootView:rootTag];
        [_lock unlock];
    }
}

/// 建立索引
- (void)buildIndexOfWormholeId:(NSString *)wormholeId withRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex
{
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        [self p_BuildIndexOfWormholeId:wormholeId withRootTag:rootTag dataIndex:dataIndex];
        os_unfair_lock_unlock(&_unfairLock);
    } else {
        [_lock lock];
        [self p_BuildIndexOfWormholeId:wormholeId withRootTag:rootTag dataIndex:dataIndex];
        [_lock unlock];
    }
}

/// 查找索引
- (NSString *)wormholeIdForRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex
{
    if (!rootTag)
    {
        return nil;
    }
    
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        NSString *wormholeId = [self p_WormholeIdForRootTag:rootTag dataIndex:dataIndex];
        os_unfair_lock_unlock(&_unfairLock);
        
        return wormholeId;
    } else {
        [_lock lock];
        NSString *wormholeId = [self p_WormholeIdForRootTag:rootTag dataIndex:dataIndex];
        [_lock unlock];
        
        return wormholeId;
    }
}

- (HippyWormholeViewModel *)viewModelForRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex
{
    if (!rootTag)
    {
        return nil;
    }
    
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        NSString *wormholeId = [self p_WormholeIdForRootTag:rootTag dataIndex:dataIndex];
        HippyWormholeViewModel *viewModel = nil;
        if (wormholeId)
        {
            viewModel = [_wormholeViewModelDict objectForKey:wormholeId];
        }
        os_unfair_lock_unlock(&_unfairLock);
        
        assert(viewModel);
        
        return viewModel;
    } else {
        [_lock lock];
        NSString *wormholeId = [self p_WormholeIdForRootTag:rootTag dataIndex:dataIndex];
        HippyWormholeViewModel *viewModel = nil;
        if (wormholeId)
        {
            viewModel = [_wormholeViewModelDict objectForKey:wormholeId];
        }
        [_lock unlock];
        
        assert(viewModel);
        
        return viewModel;
    }
}

- (void)p_RemoveAllCacheOfRootView:(NSNumber *)rootTag
{
    NSString *givenRootTag = [NSString stringWithFormat:@"%@", rootTag];
    
    NSMutableArray *existedWormholeIds = [NSMutableArray array];
    for (NSString *key in _wormholeIdCache.allKeys)
    {
        if ([key hasPrefix:givenRootTag])
        {
            [existedWormholeIds addObject:_wormholeIdCache[key]];
        }
    }
    
    if (existedWormholeIds.count > 0)
    {
        [self p_RemoveCache:existedWormholeIds rootTag:rootTag deleteAllFlag:YES];
    }
}

- (void)clear
{
    [_wormholeWrapperMapTable removeAllObjects];
    [_wormholeNodeDict removeAllObjects];
    [_wormholeViewModelDict removeAllObjects];
}

#pragma mark - Private Methods
- (void)p_SetObject:(nonnull NSObject *)object forKey:(nonnull NSString *)key mapTable:(NSMapTable *)mapTable
{
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        [mapTable setObject:object forKey:key];
        os_unfair_lock_unlock(&_unfairLock);
    } else {
        [_lock lock];
        [mapTable setObject:object forKey:key];
        [_lock unlock];
    }
}

- (void)p_RemoveObjectForKey:(nonnull NSString *)key mapTable:(NSMapTable *)mapTable
{
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        [mapTable removeObjectForKey:key];
        os_unfair_lock_unlock(&_unfairLock);
    } else {
        [_lock lock];
        [mapTable removeObjectForKey:key];
        [_lock unlock];
    }
}

- (NSObject *)p_ObjectForKey:(nonnull NSString *)key mapTable:(NSMapTable *)mapTable
{
    if (@available(iOS 10.0, *)) {
        os_unfair_lock_lock(&_unfairLock);
        id obj = [mapTable objectForKey:key];
        os_unfair_lock_unlock(&_unfairLock);
        
        return obj;
    } else {
        [_lock lock];
        id obj = [mapTable objectForKey:key];
        [_lock unlock];
        
        return obj;
    }
}

- (void)p_RemoveCache:(NSArray<NSString *> *)wormholeIds rootTag:(NSNumber *)rootTag deleteAllFlag:(BOOL)deleteAllFlag
{
    for (id item in wormholeIds)
    {
        if ([item isKindOfClass:[NSString class]])
        {
            NSString *wormholeId = (NSString *)item;
            if (wormholeId.length > 0)
            {
                [_wormholeWrapperMapTable removeObjectForKey:wormholeId];
                [_wormholeNodeDict removeObjectForKey:wormholeId];
                if (deleteAllFlag)
                {
                    // 有可能“删除”在“创建”之后，导致将新加入的数据清除了
                    [_wormholeViewModelDict removeObjectForKey:wormholeId];
                    [_wormholeIdCache removeObjectForKey:wormholeId];
                }
                
                // 删除索引cache
                [_indexKeyCache removeObjectForKey:wormholeId];
                
                [_hippyTagsDict removeObjectForKey:wormholeId];
            }
        }
    }
}

- (void)p_BuildIndexOfWormholeId:(NSString *)wormholeId withRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex
{
    if (!wormholeId || !rootTag)
    {
        return;
    }
    
    NSString *saveKey = [NSString stringWithFormat:@"%@-%ld", rootTag, dataIndex];
    
    [_wormholeIdCache setObject:wormholeId forKey:saveKey];
    [_indexKeyCache setObject:saveKey forKey:wormholeId];
}

- (NSString *)p_WormholeIdForRootTag:(NSNumber *)rootTag dataIndex:(NSInteger)dataIndex
{
    if (!rootTag)
    {
        return nil;
    }
    
    NSString *saveKey = [NSString stringWithFormat:@"%@-%ld", rootTag, dataIndex];
    
    NSString *wormholeId = [_wormholeIdCache objectForKey:saveKey];
    return wormholeId;
}

- (void)p_SetWormholeViewModel:(HippyWormholeViewModel *)model forWormholeId:(NSString *)wormholeId
{
    [_wormholeViewModelDict setObject:model forKey:wormholeId];
}

@end

@implementation HippyBridge(WormholeFactory)

- (HippyWormholeFactory *)wormholeFactory {
    id batchSelf = self;
//    if ([self isMemberOfClass:[HippyBridge class]]) {
//        batchSelf = [self batchedBridge];
//    }
    HippyWormholeFactory *factory = objc_getAssociatedObject(batchSelf, _cmd);
    if (nil == factory) {
        factory = [[HippyWormholeFactory alloc] initWithBridge:self];
        objc_setAssociatedObject(self, _cmd, factory, OBJC_ASSOCIATION_RETAIN);
    }
    return factory;
}

- (void)setWormholeFactory:(HippyWormholeFactory *)wormholeFactory
{
    objc_setAssociatedObject(self, _cmd, wormholeFactory, OBJC_ASSOCIATION_RETAIN);
}

@end
