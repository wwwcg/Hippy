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

#import "NSObject+NativeVue.h"
#import "objc/runtime.h"


@implementation NVDeallocObject

- (void)dealloc{
   // NSLog(@"NVDeallocObject-dealloc");
}

@end


@implementation NSObject (NativeVue)

- (NSObject *)dy_leakObject{
    return objc_getAssociatedObject(self, @selector(dy_leakObject));
}


- (void)setDy_leakObject:(NSObject *)dy_leakObject{
    objc_setAssociatedObject(self, @selector(dy_leakObject), dy_leakObject, OBJC_ASSOCIATION_RETAIN);
}


- (NSString *)Hippy_requestUrl{
     return objc_getAssociatedObject(self, @selector(Hippy_requestUrl));
}

- (void)setHippy_requestUrl:(NSString *)Hippy_requestUrl{
    objc_setAssociatedObject(self, @selector(Hippy_requestUrl), Hippy_requestUrl, OBJC_ASSOCIATION_RETAIN);
}

- (void)setHippy_from_nativevue:(BOOL)Hippy_from_nativevue{
    objc_setAssociatedObject(self, @selector(Hippy_from_nativevue), @(Hippy_from_nativevue), OBJC_ASSOCIATION_RETAIN);
}

- (BOOL)Hippy_from_nativevue{
   return [objc_getAssociatedObject(self, @selector(Hippy_from_nativevue)) boolValue];
}

@end

@implementation NSDictionary (NativeVue)

- (NSString *)nv_convertToJsonStringWithOption:(NSJSONWritingOptions)option{
    NSDictionary * dic = self;
    if([self isKindOfClass:[NSString class]]){
        return (NSString *)self;
    }
    if (option == NSJSONWritingPrettyPrinted) {
//        dic = [self rij_convertToOnlyNumberAndStringDictionary];
    }
    
    if (!dic) {
        return @"";
    }
    NSError *error;
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:option error:&error];
    
    NSString *jsonString;
    
    if (!jsonData) {
        NSLog(@"rij_convertToJsonString_error:%@",error);
    }else{
        
        jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
        
    }
    
    //    NSMutableString *mutStr = [NSMutableString stringWithString:jsonString];
    //
    //    NSRange range = {0,jsonString.length};
    
    //去掉字符串中的空格
    
    //    [mutStr replaceOccurrencesOfString:@" " withString:@"" options:NSLiteralSearch range:range];
    
    //    NSRange range2 = {0,mutStr.length};
    
    //去掉字符串中的换行符
    //    [mutStr replaceOccurrencesOfString:@"\n" withString:@"" options:NSLiteralSearch range:range2];
    return jsonString;
}

- (NSString *)nv_convertToJsonString{
    return [self nv_convertToJsonStringWithOption:NSJSONWritingPrettyPrinted];
    
}



@end


@implementation NSString (NativeVue)


- (NSDictionary *)nv_stringToDictionary{
    if ([self  isKindOfClass:[NSString class]]) {
        NSString * string = (NSString *)self;
        NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error = nil;
        NSDictionary* res = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
        if ([res isKindOfClass:[NSDictionary class]]) {
            return res;
        }
    }
    return nil;
}


@end
