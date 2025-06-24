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
#include "connector/dom_interceptor.h"
#include "connector/js2ark.h"

#include "dom/animation/animation_manager.h"
#include "dom/diff_utils.h"
#include "dom/dom_action_interceptor.h"
#include "dom/dom_event.h"
#include "dom/dom_node.h"
#include "dom/layer_optimized_render_manager.h"
#include "dom/render_manager.h"
#include "dom/root_node.h"
#include "dom/scene_builder.h"
#include "driver/js_driver_utils.h"
#include "driver/modules/animation_module.h"
#include "footstone/serializer.h"
#include "footstone/deserializer.h"
#include "footstone/one_shot_timer.h"
#include "footstone/string_view_utils.h"
#include "footstone/task_runner.h"
#include "footstone/worker.h"
#include "oh_napi/data_holder.h"
#include "footstone/worker_impl.h"
#pragma clang diagnostic ignored "-Wdeprecated"
#include "nlohmann/json.hpp"
#include <cstdint>


namespace hippy {
inline namespace dom {

using DomNode = hippy::DomNode;
using Task = footstone::Task;
using TaskRunner = footstone::TaskRunner;
using Serializer = footstone::value::Serializer;
using Deserializer = footstone::value::Deserializer;
using WorkerImpl = footstone::runner::WorkerImpl;
using StringViewUtils = footstone::stringview::StringViewUtils;
using json = nlohmann::json;
using Scene = hippy::dom::Scene;

using HippyValueArrayType = footstone::value::HippyValue::HippyValueArrayType;

constexpr char kDomWorkerName[] = "dom_worker";
constexpr char kDomRunnerName[] = "dom_task_runner";

class DomInterceptor : public DomManager {
  public:
  DomInterceptor(HippyDomInterceptor handler) : DomManager(DomManagerType::kJson), handler_(handler) {}
  ~DomInterceptor() override {
    event_callback_map_.clear();
    function_callback_map_.clear();
    animation_map_.clear();
  }

  void SetRenderManager(const std::weak_ptr<RenderManager> &render_manager) override {
    throw std::runtime_error("Not implemented");
  }

  std::weak_ptr<RenderManager> GetRenderManager() override {
    throw std::runtime_error("Not implemented");
  }

  std::shared_ptr<DomNode> GetNode(const std::weak_ptr<RootNode> &weak_root_node,
                                   uint32_t id) override {
    throw std::runtime_error("Not implemented");
  }

  void CreateDomNodes(const std::weak_ptr<RootNode> &weak_root_node,
                      std::vector<std::shared_ptr<DomInfo>> &&nodes,
                      bool needSortByIndex) override {
    auto root_node = weak_root_node.lock();
    if (!root_node || nodes.size() == 0) {
      return;
    }
    handler_.CreateDomNodes(handler_.context, id_, GetNodesJson(nodes).str().c_str(), needSortByIndex);
  }

  void UpdateDomNodes(const std::weak_ptr<RootNode> &weak_root_node,
                      std::vector<std::shared_ptr<DomInfo>> &&nodes) override {
    auto root_node = weak_root_node.lock();
    if (!root_node || nodes.size() == 0) {
      return;
    }
    handler_.UpdateDomNodes(handler_.context, id_, GetNodesJson(nodes).str().c_str());
  }

  void MoveDomNodes(const std::weak_ptr<RootNode> &weak_root_node,
                    std::vector<std::shared_ptr<DomInfo>> &&nodes) override {
    auto root_node = weak_root_node.lock();
    if (!root_node || nodes.size() == 0) {
      return;
    }
    handler_.MoveDomNodes(handler_.context, id_, GetNodesJson(nodes).str().c_str());
  }

  void DeleteDomNodes(const std::weak_ptr<RootNode> &weak_root_node,
                      std::vector<std::shared_ptr<DomInfo>> &&nodes) override {
    auto root_node = weak_root_node.lock();
    if (!root_node || nodes.size() == 0) {
      return;
    }
    handler_.DeleteDomNodes(handler_.context, id_, GetNodesJson(nodes).str().c_str());
  }

  void UpdateAnimation(const std::weak_ptr<RootNode> &weak_root_node,
                       std::vector<std::shared_ptr<DomNode>> &&nodes) override {
    throw std::runtime_error("Not implemented");
  }

  void EndBatch(const std::weak_ptr<RootNode> &weak_root_node) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    handler_.EndBatch(handler_.context, id_);
  }

  void AddEventListener(const std::weak_ptr<RootNode> &weak_root_node, uint32_t dom_id,
                        const std::string &event_name, uint64_t listener_id, bool use_capture,
                        const EventCallback &cb) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    event_callback_map_[listener_id] = std::move(cb);
    json params = {
      {"id", dom_id},
      {"event", event_name},
      {"listener", listener_id},
      {"capture", use_capture}
    };

    handler_.AddEventListener(handler_.context, id_, params.dump().c_str());
  }

  void RemoveEventListener(const std::weak_ptr<RootNode> &weak_root_node, uint32_t dom_id,
                           const std::string &event_name, uint64_t listener_id) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    event_callback_map_.erase(listener_id);
    json params = {
      {"id", dom_id},
      {"event", event_name},
      {"listener", listener_id}
    };

    handler_.RemoveEventListener(handler_.context, id_, params.dump().c_str());
  }
    
  void HandleEventListener(const char* param) {
    auto event_json = json::parse(param);
    std::vector<std::function<void()>> ops = {[this, event_json = std::move(event_json)] {
      auto self = this;
      double id = event_json["id"];
      std::string event_name = event_json["eventName"];
      std::string event_params = event_json["eventParams"];
      json capture_list = event_json["captureList"];
      json bubble_list = event_json["bubbleList"];
      json current_capture = event_json["currentCapture"];
      json current_bubble = event_json["currentBubble"];
      bool use_capture = event_json["capture"];
      bool use_bubble = event_json["bubble"];

      auto event = std::make_shared<DomEvent>(event_name, static_cast<uint32_t>(id), use_capture, use_bubble, std::make_shared<std::string>(std::move(event_params)));
      // 执行捕获流程
      for (const auto& target : capture_list) {
        double targetId = target["id"];
        event->SetCurrentTargetId(static_cast<uint32_t>(targetId));  // 设置当前节点，cb里会用到
        json listeners = target["listeners"];
        for (double listenerId : listeners) {
          auto it = self->event_callback_map_.find(static_cast<uint32_t>(listenerId));
          if (it != self->event_callback_map_.end()) {
            event->SetEventPhase(EventPhase::kCapturePhase);
            it->second(event);  // StopPropagation并不会影响同级的回调调用
          }
        }
        if (event->IsPreventCapture()) {  // cb 内部调用了 event.StopPropagation 会阻止捕获
          return;  // 捕获流中StopPropagation不仅会导致捕获流程结束，后面的目标事件和冒泡都会终止
        }
      }
      // 执行本身节点回调
      event->SetCurrentTargetId(event->GetTargetId());
      for (double listenerId : current_capture) {
        auto it = self->event_callback_map_.find(static_cast<uint32_t>(listenerId));
        if (it != self->event_callback_map_.end()) {
          event->SetEventPhase(EventPhase::kAtTarget);
          it->second(event);
        }
      }
      if (event->IsPreventCapture()) {
        return;
      }
      for (double listenerId : current_bubble) {
        auto it = self->event_callback_map_.find(static_cast<uint32_t>(listenerId));
        if (it != self->event_callback_map_.end()) {
          event->SetEventPhase(EventPhase::kAtTarget);
          it->second(event);
        }
      }
      if (event->IsPreventBubble()) {
        return;
      }
      // 执行冒泡流程
      for (const auto& target : bubble_list) {
        double targetId = target["id"];
        event->SetCurrentTargetId(static_cast<uint32_t>(targetId));
        json listeners = target["listeners"];
        for (double listenerId : listeners) {
          auto it = self->event_callback_map_.find(static_cast<uint32_t>(listenerId));
          if (it != self->event_callback_map_.end()) {
            event->SetEventPhase(EventPhase::kBubblePhase);
            it->second(event);
          }
          if (event->IsPreventBubble()) {
            break;
          }
        }
      }
    }};
    PostTask(hippy::Scene(std::move(ops)));
  }

  void CallFunction(const std::weak_ptr<RootNode> &weak_root_node, uint32_t dom_id,
                    const std::string &name, const DomArgument &param, uint32_t cb_id,
                    const CallFunctionCallback &cb) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    std::string buffer;
    if (!param.ToJson(buffer)) {
      return;
    }
    json params = {
      {"id", dom_id},
      {"method", name},
      {"buffer", buffer}
    };
    if (cb) {
      params["callback"] = cb_id;
      function_callback_map_[cb_id] = cb;
    }
    handler_.CallFunction(handler_.context, id_, params.dump().c_str());
  }
    
  void HandleFunctionCallback(const char* param) {
    auto callback_json = json::parse(param);
    uint32_t cb_id = callback_json["callback"];
    std::string buffer = callback_json["buffer"];
    auto it = function_callback_map_.find(cb_id);
    if (it != function_callback_map_.end()) {
      auto cb = it->second;
      function_callback_map_.erase(cb_id);
      auto args = std::make_shared<hippy::DomArgument>(buffer);
      cb(args);
    }
  }

  void SetRootSize(const std::weak_ptr<RootNode> &weak_root_node, float width,
                   float height) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    handler_.SetRootSize(handler_.context, id_, width, height);
  }

  void DoLayout(const std::weak_ptr<RootNode> &weak_root_node) override {
    auto root_node = weak_root_node.lock();
    if (!root_node) {
      return;
    }
    handler_.DoLayout(handler_.context, id_);
  }

  byte_string GetSnapShot(const std::shared_ptr<RootNode> &root_node) override {
    throw std::runtime_error("Not implemented");
  }

  bool SetSnapShot(const std::shared_ptr<RootNode> &root_node, const byte_string &buffer) override {
    throw std::runtime_error("Not implemented");
  }
    
  void CallAnimation(int32_t op, std::shared_ptr<Animation> animation, const char *params, bool is_set) {
    auto animation_id = animation->GetId();
    if (op == kAnimationOpCreate) {
      animation_map_[animation_id] = animation;
    } else if (op == kAnimationOpDestroy) {
      animation_map_.erase(animation_id);
    }
    handler_.CallAnimation(handler_.context, id_, op, animation_id, params, is_set);
  }
    
  void HandleAnimationEvent(uint32_t animation_id, std::string& event_name) {
    auto it = animation_map_.find(animation_id);
    if (it != animation_map_.end()) {
      auto animation = it->second;
      if (event_name == kAnimationStartKey) {
        if (auto start_cb = animation->GetAnimationStartCb()) {
          PostTask(Scene({start_cb}));
        }
      } else if (event_name == kAnimationEndKey) {
        if (auto end_cb = animation->GetAnimationEndCb()) {
          PostTask(Scene({end_cb}));
        }
      } else if (event_name == kAnimationCancelKey) {
        if (auto cancel_cb = animation->GetAnimationCancelCb()) {
          PostTask(Scene({cancel_cb}));
        }
      } else if (event_name == kAnimationRepeatKey) {
        if (auto repeat_cb = animation->GetAnimationRepeatCb()) {
          PostTask(Scene({repeat_cb}));
        }
      }
    }
  }

 private:
  friend class DomNode;
  std::ostringstream GetNodesJson(std::vector<std::shared_ptr<DomInfo>> &nodes) {
    size_t count = nodes.size();
    std::ostringstream oss;
    oss << '[';
    for (size_t i = 0; i < count; ++i) {
      if (i != 0) {
        oss << ',';
      }
      oss << StringViewUtils::ToStdString(StringViewUtils::ConvertEncoding(*nodes[i]->stringify, string_view::Encoding::Utf8).utf8_value());
    }
    oss << ']';
    return oss;
  }

  HippyDomInterceptor handler_;
  std::unordered_map<uint64_t, EventCallback> event_callback_map_;
  std::unordered_map<uint32_t, CallFunctionCallback> function_callback_map_;
  std::unordered_map<uint32_t, std::shared_ptr<Animation>> animation_map_;
};

} // namespace dom

inline namespace animation {

class AnimationDelegator : public Animation, public std::enable_shared_from_this<AnimationDelegator> {
 public:
  AnimationDelegator(
      std::string &param,
      bool is_set,
      std::shared_ptr<DomInterceptor> dom_interceptor)
      : Animation(), param_(param), is_set_(is_set), weak_dom_interceptor_(dom_interceptor) {}
  
  ~AnimationDelegator() override = default;
  
  virtual void AddEventListener(const std::string& event, AnimationCb cb) override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      Animation::AddEventListener(event, cb);
      dom_interceptor->CallAnimation(kAnimationOpAddListener, shared_from_this(), event.c_str(), false);
    }
  }
  virtual void RemoveEventListener(const std::string& event) override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      Animation::RemoveEventListener(event);
      dom_interceptor->CallAnimation(kAnimationOpRemoveListener, shared_from_this(), event.c_str(), false);
    }
  }
  void Init() {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      dom_interceptor->CallAnimation(kAnimationOpCreate, shared_from_this(), param_.c_str(), is_set_);
    }
  }
  virtual void Start() override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      dom_interceptor->CallAnimation(kAnimationOpStart, shared_from_this(), "", false);
    }
  }
  virtual void Destroy() override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      dom_interceptor->CallAnimation(kAnimationOpDestroy, shared_from_this(), "", false);
    }
  }
  virtual void Pause() override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      dom_interceptor->CallAnimation(kAnimationOpPause, shared_from_this(), "", false);
    }
  }
  virtual void Resume() override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      dom_interceptor->CallAnimation(kAnimationOpResume, shared_from_this(), "", false);
    }
  }
  virtual void Update(std::any param) override {
    auto dom_interceptor = weak_dom_interceptor_.lock();
    if (dom_interceptor) {
      std::string json_str = std::any_cast<std::string>(param);
      dom_interceptor->CallAnimation(kAnimationOpUpdate, shared_from_this(), json_str.c_str(), false);
    }
  }
 private:
  std::string param_;
  bool is_set_;
  std::weak_ptr<DomInterceptor> weak_dom_interceptor_;
};

} // namespace animation
} // namespace hippy

EXTERN_C_START
uint32_t HippyCreateDomInterceptor(HippyDomInterceptor handler) {
  std::shared_ptr<hippy::DomManager> dom_manager = std::make_shared<hippy::DomInterceptor>(handler);
  auto dom_manager_id = hippy::global_data_holder_key.fetch_add(1);
  dom_manager->SetId(dom_manager_id);
  hippy::global_data_holder.Insert(dom_manager_id, dom_manager);
  std::string worker_name = hippy::dom::kDomWorkerName + std::to_string(dom_manager_id);
  auto worker = std::make_shared<hippy::WorkerImpl>(worker_name, false);
  worker->Start();
  auto runner = std::make_shared<hippy::TaskRunner>(hippy::dom::kDomRunnerName);
  runner->SetWorker(worker);
  worker->Bind({runner});
  dom_manager->SetTaskRunner(runner);
  dom_manager->SetWorker(worker);
  
  hippy::global_dom_manager_num_holder.Insert(dom_manager_id, 1u);
  hippy::bridge::SetCallHostInterceptor([handler](
    const std::shared_ptr<hippy::Scope> &scope,
    const string_view &module,
    const string_view &func,
    const string_view &cb_id,
    const std::string &buffer
  ) {
    auto dom_manager = scope->GetDomManager().lock();
    if (!dom_manager) {
      return false;
    }
    using StringViewUtils = footstone::stringview::StringViewUtils;
    auto module_str = StringViewUtils::ToStdString(
        StringViewUtils::ConvertEncoding(module, string_view::Encoding::Utf8).utf8_value());
    auto func_str = StringViewUtils::ToStdString(
        StringViewUtils::ConvertEncoding(func, string_view::Encoding::Utf8).utf8_value());
    auto cb_id_str = StringViewUtils::ToStdString(
        StringViewUtils::ConvertEncoding(cb_id, string_view::Encoding::Utf8).utf8_value());
    nlohmann::json params = {
      {"module", module_str},
      {"method", func_str},
      {"callback", cb_id_str},
      {"buffer", buffer}
    };
    return handler.CallHost(handler.context, dom_manager->GetId(), params.dump().c_str());
  });
  hippy::SetAnimationInterceptor([](std::shared_ptr<hippy::DomManager> dom_manager,
                                    std::string &param,
                                    bool is_set) -> std::shared_ptr<hippy::Animation> {
    auto dom_interceptor = std::dynamic_pointer_cast<hippy::DomInterceptor>(dom_manager);
    if (!dom_interceptor) {
      return nullptr;
    }
    auto animation = std::make_shared<hippy::AnimationDelegator>(param, is_set, dom_interceptor);
    animation->Init();
    return animation;
  });
  return dom_manager_id;
}

static std::shared_ptr<hippy::DomManager> GetDomManager(uint32_t dom_interceptor_id) {
  uint32_t dom_manager_num = 0;
  auto flag = hippy::global_dom_manager_num_holder.Find(dom_interceptor_id, dom_manager_num);
  FOOTSTONE_DCHECK(dom_manager_num == 1);
  std::any dom_manager;
  flag = hippy::global_data_holder.Find(dom_interceptor_id, dom_manager);
  FOOTSTONE_DCHECK(flag);
  return std::any_cast<std::shared_ptr<hippy::DomManager>>(dom_manager);
}

void HippyDomInterceptorSendEvent(uint32_t dom_interceptor_id, uint32_t root_id, const char *param) {
  auto dom_manager_object = GetDomManager(dom_interceptor_id);
  auto dom_interceptor = std::dynamic_pointer_cast<hippy::DomInterceptor>(dom_manager_object);
  if (dom_interceptor) {
    dom_interceptor->HandleEventListener(param);
  }
}

void HippyDomInterceptorDoCallback(uint32_t dom_interceptor_id, uint32_t root_id, const char *param) {
  auto dom_manager_object = GetDomManager(dom_interceptor_id);
  auto dom_interceptor = std::dynamic_pointer_cast<hippy::DomInterceptor>(dom_manager_object);
  if (dom_interceptor) {
    dom_interceptor->HandleFunctionCallback(param);
  }
}

void HippyDestroyDomInterceptor(uint32_t dom_interceptor_id) {
  auto dom_manager_object = GetDomManager(dom_interceptor_id);
  dom_manager_object->GetWorker()->Terminate();
  bool flag = hippy::global_data_holder.Erase(dom_interceptor_id);
  FOOTSTONE_DCHECK(flag);
}

void HippyBridgeCallFunction(uint32_t scope_id, const char *action_name, const char *buffer) {
  std::any scope_object;
  auto flag = hippy::global_data_holder.Find(scope_id, scope_object);
  if (!flag) {
    FOOTSTONE_LOG(ERROR) << "scope can not found, scope id = " << scope_id << "!!!";
    return;
  }
  auto scope = std::any_cast<std::shared_ptr<hippy::Scope>>(scope_object);
  hippy::JsDriverUtils::CallJs(
    action_name,
    scope,
    [](hippy::CALL_FUNCTION_CB_STATE state, const string_view &msg) {},
    buffer,
    []() {}
  );
}

void HippyDomInterceptorSendAnimationEvent(uint32_t dom_interceptor_id, const char *buffer) {
  auto dom_manager_object = GetDomManager(dom_interceptor_id);
  auto dom_interceptor = std::dynamic_pointer_cast<hippy::DomInterceptor>(dom_manager_object);
  if (dom_interceptor) {
    auto event_json = nlohmann::json::parse(buffer);
    uint32_t animation_id = event_json["id"];
    std::string event_name = event_json["event"];
    dom_interceptor->HandleAnimationEvent(animation_id, event_name);
  }
}
EXTERN_C_END