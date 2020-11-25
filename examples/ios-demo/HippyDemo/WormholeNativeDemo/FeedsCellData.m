//
//  FeedsCellData.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "FeedsCellData.h"

static const CGFloat gDefaultCellHeight = 80;

@implementation FeedsCellData

- (CGFloat)cellHeight
{
    if (!_model)
    {
        return gDefaultCellHeight;
    }
    else
    {
        return _cellHeight;
    }
}

@end
