/* Tencent is pleased to support the open source community by making Hippy available.
 * Copyright (C) 2018 THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.tencent.mtt.hippy.bridge.bundleloader;

import static com.tencent.mtt.hippy.bridge.HippyBridge.URI_SCHEME_FILE;
import static com.tencent.vfs.UrlUtils.PREFIX_FILE;

import android.text.TextUtils;
import com.tencent.mtt.hippy.bridge.HippyBridge;
import com.openhippy.connector.NativeCallback;
import com.tencent.mtt.hippy.utils.LogUtils;

@SuppressWarnings({"unused"})
public class HippyFileBundleLoader implements HippyBundleLoader {

  final String mFilePath;

  private boolean mCanUseCodeCache;

  private String mCodeCacheTag;

  @SuppressWarnings("unused")
  public HippyFileBundleLoader(String filePath) {
    this(filePath, false, "");
  }

  public HippyFileBundleLoader(String filePath, boolean canUseCodeCache, String codeCacheTag) {
    this.mFilePath = filePath;
    this.mCanUseCodeCache = canUseCodeCache;
    this.mCodeCacheTag = codeCacheTag;
  }

  @SuppressWarnings("unused")
  public void setCodeCache(boolean canUseCodeCache, String codeCacheTag) {
    this.mCanUseCodeCache = canUseCodeCache;
    this.mCodeCacheTag = codeCacheTag;
  }

  @Override
  public void load(HippyBridge bridge, NativeCallback callback) {
    if (TextUtils.isEmpty(mFilePath)) {
      return;
    }

    String uri =
        (!mFilePath.startsWith(URI_SCHEME_FILE)) ? (URI_SCHEME_FILE + mFilePath) : mFilePath;
    boolean ret = bridge.runScriptFromUri(uri, null, mCanUseCodeCache, mCodeCacheTag, callback);
    LogUtils.d("HippyFileBundleLoader", "load: ret" + ret);
  }

  @Override
  public String getPath() {
    if (mFilePath != null && !mFilePath.startsWith(PREFIX_FILE)) {
      return PREFIX_FILE + mFilePath;
    } else {
      return mFilePath;
    }
  }

  @Override
  public String getRawPath() {
    return mFilePath;
  }

  @Override
  public String getBundleUniKey() {
    return getPath();
  }

  @Override
  public boolean canUseCodeCache() {
    return mCanUseCodeCache;
  }

  @Override
  public String getCodeCacheTag() {
    return mCodeCacheTag;
  }


}
