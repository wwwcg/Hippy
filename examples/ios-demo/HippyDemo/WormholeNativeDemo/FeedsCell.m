//
//  FeedsCell.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "FeedsCell.h"
#import "FeedsCellData.h"
#import "UIImageView+LoadUrl.h"
#import "HippyWormholeViewModel.h"
#import "MBProgressHUD.h"
#import "FeedsInteractBar.h"
#import "HippyWormholeWrapperView.h"
#import "HippyWormholeBusinessHandler.h"
#import "HippyBridge.h"

static const CGFloat gCellPaddingHorizontal = 12.0f;
static const CGFloat gCellPaddingVertical = 6.0f;

@interface FeedsCell() <HippyWormholeViewModelDelegate>

@property (nonatomic, strong) FeedsCellData *data;
@property (nonatomic, strong) NSIndexPath *indexPath;

@property (nonatomic, strong) UILabel *feedsTitleLabel;
@property (nonatomic, strong) UIImageView *feedsCoverImageView;
@property (nonatomic, strong) FeedsInteractBar *interactBar;

@end

@implementation FeedsCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self)
    {
        self.backgroundColor = [UIColor whiteColor];
        self.layer.cornerRadius = 5.0f;
        self.layer.masksToBounds = YES;
        self.clipsToBounds = YES;
    }
    
    return self;
}

- (void)bindData:(FeedsCellData *)data atIndexPath:(NSIndexPath *)indexPath
{
    if (!data)
    {
        return;
    }
    
    self.data = data;
    self.indexPath = indexPath;
    
    for (UIView *subView in self.contentView.subviews)
    {
        [subView removeFromSuperview];
    }
    
    if (self.data.model.type == FeedsType_Normal)
    {
        self.selectionStyle = UITableViewCellSelectionStyleDefault;
        // Native布局
        [self updateNormalFeeds:self.data.model];
    }
    else if (self.data.model.type == FeedsType_Dynamic)
    {
        // 从Wormhole取子视图
        
        __block CGFloat cellHeight = 132.0f;
        if (data.model.wormholeViewModel)
        {
            if (!data.model.wormholeViewModel.delegate)
            {
                data.model.wormholeViewModel.delegate = self;
            }
            
            HippyWormholeViewModel *viewModel = data.model.wormholeViewModel;
            viewModel.indexPath = indexPath;
            HippyWormholeWrapperView *div = viewModel.view;
            if (div)
            {
                [self.contentView addSubview:(UIView *)div];
                cellHeight = CGRectGetHeight(div.frame) + gCellPaddingVertical * 2.0f;
            }
        }
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.data.cellHeight = cellHeight;
    }
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
    
    // Configure the view for the selected state
}

- (void)setFrame:(CGRect)frame
{
    CGRect originalFrame = frame;
    
    originalFrame.origin.x += gCellPaddingHorizontal;
    originalFrame.origin.y += gCellPaddingVertical;
    originalFrame.size.width -= gCellPaddingHorizontal * 2.0f;
    originalFrame.size.height -= gCellPaddingVertical * 2.0f;
    
    [super setFrame:originalFrame];
}

- (void)updateNormalFeeds:(FeedsModel *)model
{
    if (!self.feedsTitleLabel)
    {
        self.feedsTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(12, 5, CGRectGetWidth(self.bounds) - 24, 30)];
        self.feedsTitleLabel.font = [UIFont boldSystemFontOfSize:16];
        self.feedsTitleLabel.textAlignment = NSTextAlignmentLeft;
        self.feedsTitleLabel.textColor = [UIColor blackColor];
//        self.feedsTitleLabel.backgroundColor = [UIColor redColor];
    }
    self.feedsTitleLabel.text = model.title;
    [self.contentView addSubview:self.feedsTitleLabel];
    
    
    if (!self.feedsCoverImageView)
    {
        self.feedsCoverImageView = [[UIImageView alloc] initWithFrame:CGRectMake(12, 8 + 30 + 5, 50, 50)];
    }
    [self.feedsCoverImageView loadImageFromUrl:model.coverUrl];
    [self.contentView addSubview:self.feedsCoverImageView];
    
    CGFloat interactBarHeight = 40.0f;
    if (model.interactModel && model.interactModel.likeNumber >= 0 && model.interactModel.commentsNumber >= 0)
    {
        if (!self.interactBar)
        {
            self.interactBar = [[FeedsInteractBar alloc] initWithFrame:CGRectMake(12, 8 + 30 + 5 + 50 + 5, CGRectGetWidth(self.bounds) - 24, interactBarHeight) model:model.interactModel];
        }
        else
        {
            [self.interactBar updateInteractBarContent:model.interactModel];
        }
        [self.contentView addSubview:self.interactBar];
        
        self.interactBar.hidden = NO;
    }
    else
    {
        if (self.interactBar)
        {
            self.interactBar.hidden = YES;
        }
        interactBarHeight = 0;
    }
    
    self.data.cellHeight = 8 + 30 + 5 + 50 + 5 + interactBarHeight + 12;
    
    [self layoutIfNeeded];
}

#pragma mark - HippyWormholeViewModelDelegate

- (void)wormholeWillAppear:(HippyWormholeViewModel *)viewModel
{
    //[self showHUD:[NSString stringWithFormat:@"Wormhole[%d] will Appear.", (int)viewModel.rowIndex]];
}

- (void)wormholeWillDisappear:(HippyWormholeViewModel *)viewModel
{
    //[self showHUD:[NSString stringWithFormat:@"Wormhole[%d] will Disappear.", (int)viewModel.rowIndex]];
}

- (void)wormholeDidOnClick:(HippyWormholeViewModel *)viewModel
{
    if (viewModel && viewModel.wormholeId.length > 0)
    {
        UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
        if (window)
        {
            NSString *message = [NSString stringWithFormat:@"您点击了广告: %@", viewModel.params[@"data"][@"title"]];
            UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示" message:message preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                
            }];
            [alert addAction:confirmAction];
            [window.rootViewController presentViewController:alert animated:YES completion:nil];
        }
    }
}

- (void)wormholeViewModel:(HippyWormholeViewModel *)viewModel didChangedSize:(CGSize)size
{
    NSIndexPath *indexPath = viewModel.indexPath;
    if (indexPath)
    {
        [self.tableView beginUpdates];
        [self.tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationNone];
        [self.tableView endUpdates];
    }
}

#pragma mark -
- (void)showHUD:(NSString *)mesasge
{
    UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:window animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.label.text = mesasge;
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.4 * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        [MBProgressHUD hideHUDForView:window animated:YES];
    });
}

@end
