//
//  MockFeedsDataFactory.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/19.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "MockFeedsDataFactory.h"
#import "FeedsModel.h"
#import "HippyWormholeViewModel.h"
#import "FeedsInteractBar.h"
#import "HippyWormholeEngine.h"

@implementation MockFeedsDataFactory

+ (NSArray *)mockRawDataSource
{
    static NSArray *dataArray;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        dataArray = @[
            @{
                @"id":@(1),
                @"title":@"许家印的“特斯拉速度”",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/533f52fc83e449e5999728c8dbab5557.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(2),
                @"title":@"海关总署：驻休斯敦总领馆全体馆员核酸阴性",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/378a8a5ddbf244bcbad9b6f7dcf51df3.jpeg",
                @"likeNum":@(1032),
                @"selfLiked":@(YES),
                @"commentNum":@(234),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(1000),
                @"title":@"[广告]--Nike,永不止步！",
                @"type":@(2),
                @"coverUrl":@"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596476976953&di=296ecd6b4a91719a814bfc0ff8d44904&imgtype=0&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D756258046%2C2809017249%26fm%3D214%26gp%3D0.jpg",
                @"commonBundleName": @"vendor.ios",
                @"businessBundleName": @"index.ios",
                @"bundlePath": @"hippy-ads-card",
                @"templateType":@(1),
            },
            @{
                @"id":@(3),
                @"title":@"特斯拉Autopilot神话终结，通用这项技术有望解放双手？",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/aaeac67fc73746f09105631617153cad.jpeg",
                @"likeNum":@(645),
                @"selfLiked":@(NO),
                @"commentNum":@(306),
                @"enableShare":@(YES),
                @"enableMore":@(NO)
            },
            @{
                @"id":@(4),
                @"title":@"张文宏、张定宇等80位医师获中国医师奖",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/533f52fc83e449e5999728c8dbab5557.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(5),
                @"title":@"台当局预告将禁爱奇艺腾讯等大陆影音平台落地",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/378a8a5ddbf244bcbad9b6f7dcf51df3.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(6),
                @"title":@"中国医师队伍达386.7万人 紧缺专业的医师数量增长迅速",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/aaeac67fc73746f09105631617153cad.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(YES),
                @"commentNum":@(20),
                @"enableShare":@(NO),
                @"enableMore":@(NO)
            },
            @{
                @"id":@(7),
                @"title":@"第二次寒冬来临？这可能是自动驾驶的新节点",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/533f52fc83e449e5999728c8dbab5557.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(8),
                @"title":@"四川雅安将防汛应急响应降为Ⅲ级",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/533f52fc83e449e5999728c8dbab5557.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(2000),
                @"title":@"[广告]--Tencent，科技向善！",
                @"type":@(2),
                @"coverUrl":@"https://upload.hbrchina.org/2019/0509/1557408791146.png",
                @"commonBundleName": @"vendor.ios",
                @"businessBundleName": @"index.ios",
                @"bundlePath": @"hippy-ads-card",
                @"templateType":@(2),
            },
            @{
                @"id":@(9),
                @"title":@"三大运营商上半年5G投资880亿 SpaceX猎鹰火箭完成第99次发射任务",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/378a8a5ddbf244bcbad9b6f7dcf51df3.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(10),
                @"title":@"让手机更冰爽：新型散热材料是如何上位的？",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/aaeac67fc73746f09105631617153cad.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(11),
                @"title":@"湖南两名医生获评中国医师奖",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/533f52fc83e449e5999728c8dbab5557.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(12),
                @"title":@"海天味业市值超中石化 投资者“打酱油”莫疯狂",
                @"type":@(1),
                @"cover":@"http://5b0988e595225.cdn.sohucs.com/images/20180725/aaeac67fc73746f09105631617153cad.jpeg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(13),
                @"title":@"“海高斯”减弱为强热带风暴，广东防风应急响应降至Ⅲ级",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(14),
                @"title":@"亚马逊首签职业足球俱乐部，为其体育直播版图再添一瓦",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(15),
                @"title":@"松下预计再投1亿美元，提高特斯拉电池产能",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(16),
                @"title":@"玉磨铁路王岗山隧道4名被困人员获救 生命体征平稳",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(17),
                @"title":@"特斯拉PK拼多多，争议背后各自的考量",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(18),
                @"title":@"手握500万，罗永浩为何会放弃法拉利，转而选择了理想汽车？",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(19),
                @"title":@"7月中国新能源车销量同比增长19.3%，但特斯拉在华销量环比下跌",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(20),
                @"title":@"英国有望在明春成为全球首个批准无人驾驶系统汽车上路的国家",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(21),
                @"title":@"新加坡财团有意收购纽卡斯尔，准备开启对俱乐部的尽职调查",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(22),
                @"title":@"国家卫健委：采取更有力措施提高医务人员薪酬待遇",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
            @{
                @"id":@(23),
                @"title":@"空场复赛时球迷互动需求增加，VR技术平台愈发抢手",
                @"type":@(1),
                @"cover":@"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=11489128,1556229282&fm=26&gp=0.jpg",
                @"likeNum":@(73),
                @"selfLiked":@(NO),
                @"commentNum":@(20),
                @"enableShare":@(YES),
                @"enableMore":@(YES)
            },
        ];
    });
    
    return dataArray;
}

+ (FeedsModel *)feedsModel:(NSDictionary *)dict index:(NSInteger)index
{
    FeedsModel *model = [FeedsModel new];
    model.feedsId = [dict[@"id"] integerValue];
    model.title = dict[@"title"];
    model.coverUrl = dict[@"cover"];
    NSInteger type = [dict[@"type"] integerValue];
    if (type == 1)
    {
        model.type = FeedsType_Normal;
        FeedsInteractBarModel *interactModel = [FeedsInteractBarModel new];
        interactModel.likeNumber = dict[@"likeNum"] ? [dict[@"likeNum"] integerValue] : -1;
        interactModel.selfLiked = dict[@"selfLiked"] ? [dict[@"selfLiked"] boolValue] : NO;
        interactModel.commentsNumber = dict[@"commentNum"] ? [dict[@"commentNum"] integerValue] : -1;
        interactModel.enableShare = dict[@"enableShare"] ? [dict[@"enableShare"] boolValue] : NO;
        interactModel.enableMoreOption = dict[@"enableMore"] ? [dict[@"enableMore"] boolValue] : NO;
        model.interactModel = interactModel;
    }
    else if (type == 2)
    {
        model.type = FeedsType_Dynamic;
    }
    
    if (model.type == FeedsType_Dynamic)
    {
        // 动态化卡片样式
        NSMutableDictionary *mutableDict = [NSMutableDictionary dictionary];
        NSArray *keys = @[@"commonBundleName", @"businessBundleName", @"bundlePath"];
        for (NSString *key in keys)
        {
            if ([dict objectForKey:key])
            {
                [mutableDict setObject:[dict objectForKey:key] forKey:key];
            }
        }
        
        model.extraInfo = [NSDictionary dictionaryWithDictionary:mutableDict];
        
        model.wormholeViewModel = [[HippyWormholeEngine sharedInstance] newWormholeViewModel:@{@"index": @(index), @"data": dict}];
    }
    
    return model;
}

+ (NSArray<FeedsCellData *> *)dataSource
{
    static NSMutableArray *data;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        data = [NSMutableArray array];
        
        NSArray *rawData = [[self class] mockRawDataSource];
        
        for (int i = 0; i < rawData.count; i++)
        {
            NSDictionary *dict = rawData[i];
            FeedsModel *rawModel = [[self class] feedsModel:dict index:i];
            FeedsCellData *feedsCellData = [FeedsCellData new];
            feedsCellData.model = rawModel;
            
            [data addObject:feedsCellData];
        }
    });
    
    return data;
}

@end
