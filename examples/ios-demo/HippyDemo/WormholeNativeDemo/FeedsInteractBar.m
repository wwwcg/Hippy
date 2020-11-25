//
//  FeedsInteractBar.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/29.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "FeedsInteractBar.h"

@implementation FeedsInteractBarModel

@end


@interface FeedsInteractBar ()

@property (nonatomic, strong) FeedsInteractBarModel *model;

/// 点赞数
@property (nonatomic, strong) UIView *likeView;
@property (nonatomic, strong) UIImageView *likeImageView;
@property (nonatomic, strong) UILabel *likeLabel;

/// 评论数
@property (nonatomic, strong) UIView *commentsView;
@property (nonatomic, strong) UIImageView *commentsImageView;
@property (nonatomic, strong) UILabel *commentsLabel;

/// 分享
@property (nonatomic, strong) UIView *shareView;
@property (nonatomic, strong) UIImageView *shareImageView;

/// 更多
@property (nonatomic, strong) UIView *moreView;
@property (nonatomic, strong) UIImageView *moreImageView;

@end

@implementation FeedsInteractBar

- (instancetype)initWithFrame:(CGRect)frame model:(FeedsInteractBarModel *)model
{
    self = [super initWithFrame:frame];
    if (self)
    {
        self.model = model;
        [self updateInteractBarContent:model];
    }
    
    return self;
}

- (void)updateInteractBarContent:(FeedsInteractBarModel *)model
{
    NSInteger itemsNum = 4;
    if (!model.enableShare)
    {
        itemsNum--;
    }
    
    if (!model.enableMoreOption)
    {
        itemsNum--;
    }
    
    CGFloat itemWidth = CGRectGetWidth(self.bounds) / itemsNum;
    CGFloat itemHeight = CGRectGetHeight(self.bounds);
    
    [self updateLikeView:model  itemWidth:itemWidth itemHeight:itemHeight];
    [self updateCommentsView:model  itemWidth:itemWidth itemHeight:itemHeight];
    [self updateShareView:model  itemWidth:itemWidth itemHeight:itemHeight];
    [self updateMoreView:model  itemWidth:itemWidth itemHeight:itemHeight];
}

- (void)updateLikeView:(FeedsInteractBarModel *)model itemWidth:(CGFloat)itemWidth itemHeight:(CGFloat)itemHeight
{
    if (!self.likeView)
    {
        self.likeView = [[UIView alloc] initWithFrame:CGRectZero];
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onLikeClick)];
        [self.likeView addGestureRecognizer:tapGesture];
        if (!self.likeImageView)
        {
            self.likeImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"unliked"]];
            [self.likeView addSubview:self.likeImageView];
        }
        
        if (!self.likeLabel)
        {
            self.likeLabel = [[UILabel alloc] initWithFrame:CGRectZero];
            self.likeLabel.font = [UIFont systemFontOfSize:12.0f];
            [self.likeView addSubview:self.likeLabel];
        }
        
        [self addSubview:self.likeView];
    }
    
    [self.likeLabel setText:[self formatNumber:model.likeNumber]];
    [self.likeLabel setFrame:CGRectMake(itemWidth / 2.0f + 3.0f, 0, itemWidth/ 2.0f - 3.0f, itemHeight)];
    
    if (model.selfLiked)
    {
        [self.likeImageView setImage:[UIImage imageNamed:@"liked"]];
    }
    else
    {
        [self.likeImageView setImage:[UIImage imageNamed:@"unliked"]];
    }
    [self.likeImageView setFrame:CGRectMake(itemWidth / 2.0f - 24.0f - 3.0f, (itemHeight - 24.0f) / 2.0f, 24.0f, 24.0f)];
    
    [self.likeView setFrame:CGRectMake(0, 0, itemWidth, itemHeight)];
}

- (void)updateCommentsView:(FeedsInteractBarModel *)model itemWidth:(CGFloat)itemWidth itemHeight:(CGFloat)itemHeight
{
    if (!self.commentsView)
    {
        self.commentsView = [[UIView alloc] initWithFrame:CGRectZero];
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onCommentsClick)];
        [self.commentsView addGestureRecognizer:tapGesture];
        if (!self.commentsImageView)
        {
            self.commentsImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"comment"]];
            [self.commentsView addSubview:self.commentsImageView];
        }
        
        if (!self.commentsLabel)
        {
            self.commentsLabel = [[UILabel alloc] initWithFrame:CGRectZero];
            self.commentsLabel.font = [UIFont systemFontOfSize:12.0f];
            [self.commentsView addSubview:self.commentsLabel];
        }
        
        [self addSubview:self.commentsView];
    }
    
    [self.commentsLabel setText:[self formatNumber:model.commentsNumber]];
    [self.commentsLabel setFrame:CGRectMake(itemWidth / 2.0f + 3.0f, 0, itemWidth/ 2.0f - 3.0f, itemHeight)];
    
    [self.commentsImageView setFrame:CGRectMake(itemWidth / 2.0f  - 24.0f - 3.0f, (itemHeight - 24.0f) / 2.0f, 24.0f, 24.0f)];
    
    [self.commentsView setFrame:CGRectMake(itemWidth, 0, itemWidth, itemHeight)];
}

- (void)updateShareView:(FeedsInteractBarModel *)model itemWidth:(CGFloat)itemWidth itemHeight:(CGFloat)itemHeight
{
    if (model.enableShare)
    {
        if (!self.shareView)
        {
            self.shareView = [[UIView alloc] initWithFrame:CGRectZero];
            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onShareClick)];
            [self.shareView addGestureRecognizer:tapGesture];
            if (!self.shareImageView)
            {
                self.shareImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"share"]];
                [self.shareView addSubview:self.shareImageView];
            }
            
            [self addSubview:self.shareView];
        }
        
        [self.shareImageView setFrame:CGRectMake((itemWidth - 24.0f) / 2.0f, (itemHeight - 24.0f) / 2.0f - 1.0f, 24.0f, 24.0f)];
        
        [self.shareView setFrame:CGRectMake(itemWidth * 2.0f, 0, itemWidth, itemHeight)];
        
        self.shareView.hidden = NO;
    }
    else
    {
        if (self.shareView)
        {
            self.shareView.hidden = YES;
        }
    }
}

- (void)updateMoreView:(FeedsInteractBarModel *)model itemWidth:(CGFloat)itemWidth itemHeight:(CGFloat)itemHeight
{
    if (model.enableMoreOption)
    {
        if (!self.moreView)
        {
            self.moreView = [[UIView alloc] initWithFrame:CGRectZero];
            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onMoreOptionClick)];
            [self.moreView addGestureRecognizer:tapGesture];
            if (!self.moreImageView)
            {
                self.moreImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"more"]];
                [self.moreView addSubview:self.moreImageView];
            }
            
            [self addSubview:self.moreView];
        }

        [self.moreImageView setFrame:CGRectMake((itemWidth - 24.0f) / 2.0f, (itemHeight - 24.0f) / 2.0f, 24.0f, 24.0f)];
        
        [self.moreView setFrame:CGRectMake(itemWidth * 3.0f, 0, itemWidth, itemHeight)];
        
        self.moreView.hidden = NO;
    }
    else
    {
        if (self.moreView)
        {
            self.moreView.hidden = YES;
        }
    }
}

- (NSString *)formatNumber:(NSInteger)number
{
    NSString *str = nil;
    if (number < 1000)
    {
        str = [NSString stringWithFormat:@"%ld", number];
    }
    else
    {
        str = [NSString stringWithFormat:@"%.1fK", (CGFloat)(number / 1000.0f)];
    }
    
    return str;
}

#pragma mark - Click Handlers
- (void)onLikeClick
{
    
}

- (void)onCommentsClick
{
    
}

- (void)onShareClick
{
    
}

- (void)onMoreOptionClick
{
    
}

@end
