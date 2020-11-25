//
//  FeedsCell.h
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class FeedsCellData;
@interface FeedsCell : UITableViewCell

@property (nonatomic, weak) UITableView *tableView;

- (void)bindData:(FeedsCellData *)data atIndexPath:(NSIndexPath *)indexPath;

@end

NS_ASSUME_NONNULL_END
