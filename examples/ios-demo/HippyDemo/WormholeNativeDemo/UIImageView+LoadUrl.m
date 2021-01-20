//
//  UIImageView+LoadUrl.m
//  HippyDemo
//
//  Created by cirolong on 2020/8/20.
//  Copyright © 2020 tencent. All rights reserved.
//

#import "UIImageView+LoadUrl.h"

@implementation UIImageView (LoadUrl)

- (void)loadImageFromUrl:(NSString *)url
{
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:url]];
        if (data)
        {
            UIImage *image = [UIImage imageWithData:data];
            if (image)
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    self.image = image;
                });
            }
        }
    });
}

@end
