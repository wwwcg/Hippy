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

#import "HippyUIManager+NativeVue.h"

@implementation HippyUIManager (NativeVue)

- (HippyComponentData *)componentDataWithViewName:(NSString *)viewName{
    return [self->_componentDataByName objectForKey:viewName];
}

//- (HippyNativeVueViewModel *)nv_createModelWithTemplateId:(NSString *)templateId templateData:(NSDictionary *)templateData{
//    return [[HippyNativeVueViewModel alloc] initWithTemplateId:templateId templateData:templateData context:self];
//}

- (NSDictionary *)componentDataByName{
    return _componentDataByName;
}
@end
