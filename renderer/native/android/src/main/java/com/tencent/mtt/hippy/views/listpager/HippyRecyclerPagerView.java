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

package com.tencent.mtt.hippy.views.listpager;

import android.content.Context;

import androidx.recyclerview.widget.LinearLayoutManager;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerListAdapter;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerView;
import com.tencent.mtt.hippy.views.hippylist.RecyclerViewEventHelper;

public class HippyRecyclerPagerView<ADP extends HippyRecyclerListAdapter> extends HippyRecyclerView {

    private final RecyclerPagerScrollHelper mPagerScrollHelper;

    public HippyRecyclerPagerView(Context context) {
        super(context);
        mPagerScrollHelper = new RecyclerPagerScrollHelper(this);
    }

    @Override
    protected void init() {
        // enable nested scrolling
        setNestedScrollingEnabled(false);
    }

    @Override
    public void initRecyclerView(boolean hasStableIds) {
        Adapter adapter = new HippyRecyclerPagerAdapter<HippyRecyclerView>(this);
        adapter.setHasStableIds(hasStableIds);
        setAdapter(adapter);
        intEventHelper();
        setItemViewCacheSize(DEFAULT_ITEM_VIEW_CACHE_SIZE);
        LayoutManager layoutManager = getLayoutManager();
        if (layoutManager instanceof LinearLayoutManager) {
            mPagerScrollHelper.setOrientation(((LinearLayoutManager) layoutManager).getOrientation());
        }
    }

    @Override
    public void setListData() {
        int lastCount = renderNodeCount;
        super.setListData();
        if (renderNodeCount > lastCount) {
            recyclerViewEventHelper.checkSendExposureEvent();
        }
    }

    @Override
    protected RecyclerViewEventHelper createEventHelper() {
        return new RecyclerPagerViewEventHelper(this);
    }

    public void setAutoPageScrollDuration(int duration) {
        mPagerScrollHelper.setAutoPageScrollDuration(duration);
    }

    public void setPageUpDownOffsetRatio(float ratio) {
        mPagerScrollHelper.setPageUpDownOffsetRatio(ratio);
    }

    public void setPreCreateRowsNumber(int count) {
        mPagerScrollHelper.setPreCreateRowsNumber(count);
    }

    public int getPreCreateRowsNumber() {
       return mPagerScrollHelper.getPreCreateRowsNumber();
    }
}
