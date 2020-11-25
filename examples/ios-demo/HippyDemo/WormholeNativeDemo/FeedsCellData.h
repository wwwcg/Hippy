//
//  FeedsCellData.h
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FeedsModel.h"
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface FeedsCellData : NSObject

@property (nonatomic, strong) FeedsModel *model;

@property (nonatomic, assign) CGFloat cellHeight;


@end

NS_ASSUME_NONNULL_END
