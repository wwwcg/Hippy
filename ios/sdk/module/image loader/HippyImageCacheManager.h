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
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@class HippyImageTask;
typedef void(^HippyImageResponseBlock)(UIImage *image, NSError * _Nullable error);

@interface HippyImageCacheManager : NSObject
+ (instancetype) sharedInstance;
- (void) setImageCacheData:(NSData *)data forURLString:(NSString *)URLString;
- (NSData *) imageCacheDataForURLString:(NSString *)URLString;
- (void) setImage:(UIImage *)image forURLString:(NSString *)URLString blurRadius:(CGFloat)radius;
- (UIImage *) imageForURLString:(NSString *)URLString blurRadius:(CGFloat)radius;
@end

@interface HippyImageCacheManager (ImageLoader)

- (UIImage *)loadImageFromCacheForURLString:(NSString *)URLString radius:(CGFloat)radius isBlurredImage:(BOOL *)isBlurredImage;

@end

@interface HippyImageCacheManager (RequestReuse)

- (HippyImageTask *)imageTaskForRequestingWithURLString:(NSString *)URLString radius:(CGFloat)radius;

- (void)addImageTaskWithURLString:(NSString *)URLString radius:(CGFloat)radius imageView:(UIImageView *)imageView;

- (void)finishImageTaskWithURLString:(NSString *)URLString radius:(CGFloat)radius image:(UIImage *)image error:(NSError *)error;

- (BOOL)cancelImageTaskForRequestingWithURLString:(NSString *)URLString radius:(CGFloat)radius;

@end

@interface HippyImageTask : NSObject

@property (nonatomic, assign) BOOL isRequesting;
@property (nonatomic, strong, nullable) UIImageView * imageView;//should retain imageView util request did end


@property (nullable, nonatomic, strong) NSMutableArray<HippyImageResponseBlock> * listenResponseCallbacks;
- (void)addListenResponseCallbackWithBlock:(HippyImageResponseBlock)block;
- (void)finishTaskWithImage:(UIImage *)image error:(NSError *)error;

@end
NS_ASSUME_NONNULL_END
