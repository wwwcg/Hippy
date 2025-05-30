/*
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
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

#include "renderer/uimanager/hr_keyboard_manager.h"

namespace hippy {
inline namespace render {
inline namespace native {

HRKeyboardManager &HRKeyboardManager::GetInstance() {
  static HRKeyboardManager instance;
  return instance;
}

void HRKeyboardManager::AddKeyboardListener(std::string &key, const HRKeyboardCallback &callback) {
  keyboard_listeners_[key] = callback;
}

void HRKeyboardManager::RemoveKeyboardListener(std::string &key) {
  keyboard_listeners_.erase(key);
}

void HRKeyboardManager::NotifyKeyboardHeightChanged(float height) {
  for (auto &listener : keyboard_listeners_) {
    listener.second(height);
  }
}

} // namespace native
} // namespace render
} // namespace hippy
