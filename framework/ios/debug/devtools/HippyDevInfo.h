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

#import <Foundation/Foundation.h>

@interface HippyDevInfo : NSObject

@property (nonatomic, copy) NSString *scheme;
@property (nonatomic, copy) NSString *ipAddress;
@property (nonatomic, copy) NSString *port;
@property (nonatomic, copy) NSString *versionId;
@property (nonatomic, copy) NSString *wsURL;

- (void)setScheme:(NSString *)scheme;

- (void)parseWsURLWithURLQuery:(NSString *)query;

/// Assemble full websocket url for devtools
/// - Parameters:
///   - clientId: unique id of client
///   - contextName: context name
///   - usingHermes: whether using hermes as js engine
- (NSString *)assembleFullWSURLWithClientId:(NSString *)clientId
                                contextName:(NSString *)contextName
                             isHermesEngine:(BOOL)usingHermes;

@end
