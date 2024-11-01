/*!
 * iOS SDK
 *
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import "HippyListPagerView.h"
#import "HippyShadowView.h"
#import "UIView+Hippy.h"
#import "HippyNextShadowListItem.h"
#import "HippyWaterfallViewDataSource.h"

@interface HippyListPagerView ()

/// Pre-create rows cache
@property (nonatomic, strong) NSMutableArray *cachedPreCreateRows;

@end

@implementation HippyListPagerView

- (void)setPreCreateRowsNumber:(NSUInteger)preCreateRowsNumber {
    _preCreateRowsNumber = preCreateRowsNumber;
    if (preCreateRowsNumber > 0) {
        // can only create preCreateRowsNumber * 2 rows with one buffer
        self.cachedPreCreateRows = [NSMutableArray arrayWithCapacity:(preCreateRowsNumber * 2)];
    }
}

#pragma mark - Life Cycle Override

- (void)initCollectionView {
    [super initCollectionView];
    self.collectionView.pagingEnabled = YES;
}

#pragma mark - CollectionView's Delegate Override

- (void)collectionView:(UICollectionView *)collectionView
       willDisplayCell:(UICollectionViewCell *)cell
    forItemAtIndexPath:(NSIndexPath *)indexPath {
    // must call super
    [super collectionView:collectionView willDisplayCell:cell forItemAtIndexPath:indexPath];
    
    // do pre-create
    [self preCreateCellsFromCurrentShowingIndexPath:indexPath];
    
    HippyLogTrace(@"[ListViewDebug] %@ will display cell:%ld", self.hippyTag, indexPath.row);
}

#if HIPPY_DEBUG
- (void)collectionView:(UICollectionView *)collectionView
  didEndDisplayingCell:(UICollectionViewCell *)cell
    forItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([HippyNextBaseListView instancesRespondToSelector:_cmd]) {
        [super collectionView:collectionView didEndDisplayingCell:cell forItemAtIndexPath:indexPath];
    }
    HippyLogTrace(@"[ListViewDebug] %@ did end display cell:%ld", self.hippyTag, indexPath.row);
}
#endif /* HIPPY_DEBUG */

#pragma mark - Private

- (void)preCreateCellsFromCurrentShowingIndexPath:(NSIndexPath * _Nonnull)indexPath {
    if (self.preCreateRowsNumber > 0) {
        for (NSUInteger i = 1; i <= self.preCreateRowsNumber; i++) {
            NSInteger cellsCount = [self.dataSource numberOfCellForSection:indexPath.section];
            // create cells `after` current cell
            if (cellsCount > indexPath.row + i) {
                NSIndexPath *nextIndexPath = [NSIndexPath indexPathForRow:(indexPath.row + i) inSection:indexPath.section];
                HippyNextShadowListItem *nextIndexNode = (HippyNextShadowListItem *)[self.dataSource cellForIndexPath:nextIndexPath];
                // Create cellView if needed
                UIView *cellView = [self createCellViewForIndexPath:nextIndexPath shadowView:nextIndexNode];
                // Add to pre-create-rows cache
                [self.cachedPreCreateRows addObject:cellView];
                HippyLogTrace(@"%@ ListViewDebug preCreate row:%@ id:%@",
                              self.hippyTag, @(indexPath.row + i), nextIndexNode.hippyTag);
            }
            // create cells `before` current cell
            if ((NSInteger)(indexPath.row - i) >= 0) {
                NSIndexPath *lastIndexPath = [NSIndexPath indexPathForRow:(indexPath.row - i) inSection:indexPath.section];
                HippyNextShadowListItem *lastIndexNode = (HippyNextShadowListItem *)[_dataSource cellForIndexPath:lastIndexPath];
                // create if needed
                UIView *cellView = [self createCellViewForIndexPath:lastIndexPath shadowView:lastIndexNode];
                // Add to pre-create-rows cache
                [self.cachedPreCreateRows addObject:cellView];
                HippyLogTrace(@"%@ ListViewDebug preCreate row:%@ id:%@",
                              self.hippyTag, @(indexPath.row - i), lastIndexNode.hippyTag);
            }
        }
        
        // check and drain pre-create-rows cache
        while (self.cachedPreCreateRows.count > self.preCreateRowsNumber * 2) {
            [self.cachedPreCreateRows removeObjectAtIndex:0];
        }
    }
}

@end
