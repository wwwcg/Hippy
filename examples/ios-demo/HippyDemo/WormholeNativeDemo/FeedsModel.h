//
//  FeedsModel.h
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, FeedsType)
{
    // 普通Feeds
    FeedsType_Normal = 1,
    // 动态化Feeds(由Hippy生成)
    FeedsType_Dynamic = 2,
};

@class RCTWormholeViewModel;
@class FeedsInteractBarModel;
@interface FeedsModel : NSObject

@property (nonatomic, assign) NSInteger feedsId;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *coverUrl;
@property (nonatomic, assign) FeedsType type;  // feeds样式type
@property (nonatomic, strong, nullable) id extraInfo;
@property (nonatomic, strong) FeedsInteractBarModel *interactModel;

/// 只有动态样式(type==FeedsType_Dynamic)，才需要此model
@property (nonatomic, strong, nullable) RCTWormholeViewModel *wormholeViewModel;

@end

NS_ASSUME_NONNULL_END
