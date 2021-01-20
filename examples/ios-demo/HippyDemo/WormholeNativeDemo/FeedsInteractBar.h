//
//  FeedsInteractBar.h
//  HippyDemo
//
//  Created by cirolong on 2020/8/29.
//  Copyright © 2020 tencent. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface FeedsInteractBarModel : NSObject

@property (nonatomic, assign) NSInteger likeNumber;
@property (nonatomic, assign) BOOL selfLiked;
@property (nonatomic, assign) NSInteger commentsNumber;
@property (nonatomic, assign) BOOL enableShare;
@property (nonatomic, assign) BOOL enableMoreOption;

@end

@interface FeedsInteractBar : UIView

@property (nonatomic, strong, readonly) FeedsInteractBarModel *model;

- (instancetype)initWithFrame:(CGRect)frame model:(FeedsInteractBarModel *)model;

- (void)updateInteractBarContent:(FeedsInteractBarModel *)model;

@end

NS_ASSUME_NONNULL_END
