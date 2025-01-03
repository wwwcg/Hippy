/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2022 THL A29 Limited, a Tencent company.
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

#pragma once

#include "napi/native_api.h"
#include <cstdint>

EXTERN_C_START
constexpr int32_t kAnimationOpCreate = 1;
constexpr int32_t kAnimationOpUpdate = 2;
constexpr int32_t kAnimationOpStart = 3;
constexpr int32_t kAnimationOpResume = 4;
constexpr int32_t kAnimationOpPause = 5;
constexpr int32_t kAnimationOpDestroy = 6;
constexpr int32_t kAnimationOpAddListener = 7;
constexpr int32_t kAnimationOpRemoveListener = 8;
typedef struct {
  char context[128];
  void (*CreateDomNodes)(const char *context, uint32_t dom_interceptor_id, const char *nodes,
                         bool need_sort_by_index);
  void (*UpdateDomNodes)(const char *context, uint32_t dom_interceptor_id, const char *nodes);
  void (*MoveDomNodes)(const char *context, uint32_t dom_interceptor_id, const char *nodes);
  void (*DeleteDomNodes)(const char *context, uint32_t dom_interceptor_id, const char *nodes);
  void (*UpdateAnimation)(const char *context, uint32_t dom_interceptor_id, int32_t op, uint32_t animation_id, const char *params, bool is_set);
  void (*EndBatch)(const char *context, uint32_t dom_interceptor_id);
  void (*AddEventListener)(const char *context, uint32_t dom_interceptor_id, const char *params);
  void (*RemoveEventListener)(const char *context, uint32_t dom_interceptor_id, const char *params);
  void (*CallFunction)(const char *context, uint32_t dom_interceptor_id, const char *params);
  void (*SetRootSize)(const char *context, uint32_t dom_interceptor_id, float width, float height);
  void (*DoLayout)(const char *context, uint32_t dom_interceptor_id);
  bool (*CallHost)(const char *context, uint32_t dom_interceptor_id, const char *params);
} HippyDomInterceptor;

uint32_t HippyCreateDomInterceptor(HippyDomInterceptor handler);
void HippyDomInterceptorSendEvent(uint32_t dom_interceptor_id, uint32_t root_id, const char *param);
void HippyDomInterceptorDoCallback(uint32_t dom_interceptor_id, uint32_t root_id, const char *param);
void HippyDestroyDomInterceptor(uint32_t dom_interceptor_id);
void HippyBridgeCallFunction(uint32_t scope_id, const char *action_name, const char *buffer);
EXTERN_C_END
