//
//  TestWormholeViewController.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "TestWormholeViewController.h"
#import "MockFeedsDataFactory.h"
#import "FeedsCell.h"
#import "ViewController.h"
#import "RCTWormholeViewModel.h"
#import "RCTWormholeEngine.h"

#define AdsDebugURL @"http://localhost:38989/index.bundle?platform=ios&dev=true&minify=false"

@interface TestWormholeViewController () <UITableViewDelegate, UITableViewDataSource, UIGestureRecognizerDelegate>
{
    BOOL _debug;
    dispatch_queue_t _dataQueue;
}

@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray<FeedsCellData *> *dataSource;

@end

@implementation TestWormholeViewController

- (instancetype)initWithDebug:(BOOL)debug {
    self = [super init];
    if (self) {
        _debug = debug;
        _dataQueue = dispatch_queue_create("com.wormhole.demo.dataqueue", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    UIBarButtonItem *rightButton = [[UIBarButtonItem alloc] initWithTitle:@"Hippy" style:UIBarButtonItemStylePlain target:self action:@selector(enterHippyDemo)];
    self.navigationItem.rightBarButtonItem = rightButton;

    //优先加载native vue模板
    NSString * pathJson = [[NSBundle mainBundle] pathForResource:@"nv_json" ofType:@"json"];
    NSData *data = [NSData dataWithContentsOfFile:pathJson];
    [[RCTWormholeEngine sharedInstance] loadNativeVueDomData:data];
    
    // 再加载“动态化模板jsbundle”
    NSURL *commonBundlePath = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource: @"base.ios" ofType: @"jsbundle"]];
    NSURL *indexPath = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"ads.ios" ofType:@"jsbundle"]];
    if (_debug) {
        commonBundlePath = [NSURL URLWithString:AdsDebugURL];
    }
    
    NSString *moduleName = @"AdsTemplates";
    [[RCTWormholeEngine sharedInstance] launchEngine:commonBundlePath indexBundlePath:indexPath moduleName:moduleName replaceModules:nil isDebug:_debug];

    [[RCTWormholeEngine sharedInstance] switchFPSMonitor:YES];
    
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    self.tableView.backgroundColor = [UIColor colorWithRed:238.0f/255.0f green:238.0f/255.0f blue:238.0f/255.0f alpha:1.0f];
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.tableView registerClass:[FeedsCell class] forCellReuseIdentifier:NSStringFromClass([FeedsCell class])];
    [self.view addSubview:self.tableView];
    
    self.navigationController.interactivePopGestureRecognizer.delegate = self;

    // Fetch mock data.
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), _dataQueue, ^{
        self.dataSource = [NSMutableArray arrayWithArray:[MockFeedsDataFactory dataSource]];
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadData];
        });
    });
}

#pragma mark - UITableViewDataSource
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    FeedsCell *cell = (FeedsCell *)[tableView dequeueReusableCellWithIdentifier:NSStringFromClass([FeedsCell class]) forIndexPath:indexPath];
    cell.tableView = tableView;
    
    FeedsCellData *cellData = self.dataSource[indexPath.row];
    [cell bindData:cellData atIndexPath:indexPath];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    FeedsCellData *cellData = self.dataSource[indexPath.row];
    if (cellData && cellData.model.wormholeViewModel)
    {
        [cellData.model.wormholeViewModel wormholeWillAppear];
    }
}

- (void)tableView:(UITableView *)tableView didEndDisplayingCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    FeedsCellData *cellData = self.dataSource[indexPath.row];
    if (cellData && cellData.model.wormholeViewModel)
    {
        [cellData.model.wormholeViewModel wormholeWillDisappear];
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.dataSource.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return self.dataSource[indexPath.row].cellHeight;
}

#pragma mark - UITableViewDelegate
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}


#pragma mark - Button Actions Handler
- (void)enterHippyDemo
{
    ViewController *vc = [[ViewController alloc] initWithEnableFeedsDebug:_debug enableWormholeDebug:_debug];
    [self.navigationController pushViewController:vc animated:YES];
}

#pragma mark - UIGestureRecognizerDelegate
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
    if (self.navigationController.viewControllers.count > 1)
    {
        return true;
    }
    return false;
}

@end
