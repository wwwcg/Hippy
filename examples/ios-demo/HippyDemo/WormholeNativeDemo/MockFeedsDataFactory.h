//
//  MockFeedsDataFactory.h
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FeedsCellData.h"

NS_ASSUME_NONNULL_BEGIN

@interface MockFeedsDataFactory : NSObject

+ (NSArray<FeedsCellData *> *)dataSource;

@end

NS_ASSUME_NONNULL_END
