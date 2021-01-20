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

#import "HippyImageCacheManager.h"
#import "HippyLog.h"
#import <pthread.h>
#import <CommonCrypto/CommonDigest.h>

@interface HippyImageCacheManager() {
    NSCache *_cache;
    NSMutableDictionary * _imageTasks;
}
@end
@implementation HippyImageCacheManager
+ (instancetype) sharedInstance {
    static dispatch_once_t onceToken;
    static HippyImageCacheManager *instance;
    dispatch_once(&onceToken, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}
- (instancetype) init {
    self = [super init];
    if (self) {
        _cache = [[NSCache alloc] init];
        _cache.totalCostLimit = 10 * 1024 * 1024;
        _cache.name = @"com.tencent.HippyImageCache";
        _imageTasks = [[NSMutableDictionary alloc] init];
    }
    return self;
}
- (void) setImageCacheData:(NSData *)data forURLString:(NSString *)URLString {
    if (URLString && data) {
        NSString *key = URLString;
        // 如果是base64图片的话，对key MD5压缩一下
        if ([key hasPrefix: @"data:image/"]) {
          key = [self cachedBase64ForKey: key];
        }
        [_cache setObject:data forKey:key cost:[data length]];
    }
}

- (NSData *) imageCacheDataForURLString:(NSString *)URLString {
    NSData *data = nil;
    if (URLString) {
        NSString *key = URLString;
        // 如果是base64图片的话，对key MD5压缩一下
        if ([key hasPrefix: @"data:image/"]) {
          key = [self cachedBase64ForKey: key];
        }
        data = [_cache objectForKey:key];
    }
    return data;
}

- (void) setImage:(UIImage *)image forURLString:(NSString *)URLString blurRadius:(CGFloat)radius {
    if (URLString && image) {
        NSString *key = URLString;
        // 如果是base64图片的话，对key MD5压缩一下
        if ([key hasPrefix: @"data:image/"]) {
            key = [self cachedBase64ForKey: key];
        }
        key = [key stringByAppendingFormat:@"%.1f", radius];
        CGImageRef imageRef = image.CGImage;
        NSUInteger bytesPerFrame = CGImageGetBytesPerRow(imageRef) * CGImageGetHeight(imageRef);
        [_cache setObject:image forKey:key cost:bytesPerFrame];
    }
}

- (UIImage *) imageForURLString:(NSString *)URLString blurRadius:(CGFloat)radius {
    NSString * key = [self _getCacheKeyWithURLString:URLString blurRadius:radius];
    if (key) {
        return [_cache objectForKey:key];
    }
    return nil;
}

- (NSString * )_getCacheKeyWithURLString:(NSString *)URLString blurRadius:(CGFloat)radius{
    if (URLString && [URLString isKindOfClass:[NSString class]]) {
        NSString *key = URLString;
        // 如果是base64图片的话，对key MD5压缩一下
        if ([key hasPrefix: @"data:image/"]) {
            key = [self cachedBase64ForKey: key];
        }
        return [key stringByAppendingFormat:@"%.1f", radius];
    }
    return nil;
}

- (NSString *)cachedBase64ForKey:(NSString *)key
{
    const char *str = [key UTF8String];
    if (str == NULL) {
        str = "";
    }
    unsigned char r[CC_MD5_DIGEST_LENGTH];
    CC_MD5(str, (CC_LONG)strlen(str), r);
    NSString *filename = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
                                                    r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];

    return filename;
}

@end

@implementation HippyImageCacheManager (ImageLoader)

- (UIImage *)loadImageFromCacheForURLString:(NSString *)URLString radius:(CGFloat)radius isBlurredImage:(BOOL *)isBlurredImage{
    if (isBlurredImage) {
        *isBlurredImage = NO;
    }
    
    UIImage *image = [self imageForURLString:URLString blurRadius:radius];
    if (nil == image) {
        NSData *data = [self imageCacheDataForURLString:URLString];
        if (data) {
            image = [UIImage imageWithData:data];
        }
    }
    else if (radius > __FLT_EPSILON__ && isBlurredImage) {
        *isBlurredImage = YES;
    }
    return image;
}

@end




@implementation HippyImageCacheManager (RequestReuse)

- (BOOL)cancelImageTaskForRequestingWithURLString:(NSString *)URLString radius:(CGFloat)radius {
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    HippyImageTask * task = [self imageTaskForRequestingWithURLString:URLString radius:radius];
    if (task && task.listenResponseCallbacks.count) {
        return false;
    }else if(task){
        [self removeImageTaskWithURLString:URLString radius:radius];
    }
    return true;
}

- (HippyImageTask *)imageTaskForRequestingWithURLString:(NSString *)URLString radius:(CGFloat)radius {
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    if(_imageTasks.count == 0) {
        return nil;
    }
    NSString * key = [self _getCacheKeyWithURLString:URLString blurRadius:radius];
    if (![key isKindOfClass:[NSString class]]) {
        return nil;
    }
    HippyImageTask * task = _imageTasks[key];
    if (task && task.isRequesting) {
        return task;
    }else if(task){
        [_imageTasks removeObjectForKey:key];
    }
    return nil;
}

- (void)addImageTaskWithURLString:(NSString *)URLString radius:(CGFloat)radius imageView:(UIImageView *)imageView{
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    NSString * key = [self _getCacheKeyWithURLString:URLString blurRadius:radius];
    HippyImageTask * imageTask = [HippyImageTask new];
    imageTask.isRequesting = YES;
    imageTask.imageView = imageView;
    assert(!_imageTasks[key]);
    _imageTasks[key] = imageTask;
}

- (void)finishImageTaskWithURLString:(NSString *)URLString radius:(CGFloat)radius image:(UIImage *)image error:(NSError *)error{
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    HippyImageTask * imageTask = [self imageTaskForRequestingWithURLString:URLString radius:radius];
    if (imageTask) {
        [imageTask finishTaskWithImage:image error:error];
        [self removeImageTaskWithURLString:URLString radius:radius];
//        NSLog(@"_imageTasks:count:%d",_imageTasks.count);
//        if (_imageTasks.count == 1) {
//            int i = 9;
//        }
    }
    
}

- (void)removeImageTaskWithURLString:(NSString *)URLString radius:(CGFloat)radius {
    NSString * key = [self _getCacheKeyWithURLString:URLString blurRadius:radius];
    [_imageTasks removeObjectForKey:key];
}


@end

@implementation HippyImageTask

- (void)addListenResponseCallbackWithBlock:(HippyImageResponseBlock) block{
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    if (!_listenResponseCallbacks) {
        _listenResponseCallbacks = [[NSMutableArray alloc] init];
    }
    [_listenResponseCallbacks addObject:block];
}

- (void)finishTaskWithImage:(UIImage *)image error:(NSError *)error {
    HippyAssert([NSThread isMainThread], @"should run on main thread");
    self.isRequesting = NO;
    self.imageView = nil;
    
//    if(block) block(image,error,YES);
    if (self.listenResponseCallbacks.count) {
          for (HippyImageResponseBlock block in self.listenResponseCallbacks) {
              block(image,error);
          }
          self.listenResponseCallbacks = nil;
     }
    
}
@end
