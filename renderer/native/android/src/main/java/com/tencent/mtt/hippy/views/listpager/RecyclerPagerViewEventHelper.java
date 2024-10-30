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

import android.graphics.Rect;
import android.view.View;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerView;
import com.tencent.mtt.hippy.views.hippylist.RecyclerViewEventHelper;
import com.tencent.mtt.hippy.views.list.HippyListItemView;

public class RecyclerPagerViewEventHelper extends RecyclerViewEventHelper {

    private Rect reusableExposureStateRect = new Rect();

    public RecyclerPagerViewEventHelper(HippyRecyclerView recyclerView) {
        super(recyclerView);
    }

    private int calculateExposureState(View view) {
        if (view == null) {
            return HippyListItemView.EXPOSURE_STATE_INVISIBLE;
        }
        boolean visibility = view.getGlobalVisibleRect(reusableExposureStateRect);
        if (!visibility) {
            return HippyListItemView.EXPOSURE_STATE_INVISIBLE;
        }
        // visible area size of view
        float visibleArea = reusableExposureStateRect.height() * reusableExposureStateRect.width();
        // total area size of view
        float viewArea = view.getMeasuredWidth() * view.getMeasuredHeight();
        if (visibleArea >= viewArea) {
            return HippyListItemView.EXPOSURE_STATE_FULL_VISIBLE;
        } else if (visibleArea > viewArea * 0.1f) {
            return HippyListItemView.EXPOSURE_STATE_PART_VISIBLE;
        } else {
            return HippyListItemView.EXPOSURE_STATE_INVISIBLE;
        }
    }

    @Override
    protected void checkExposureView(View view) {
        if (view instanceof HippyListItemView) {
            HippyListItemView itemView = (HippyListItemView) view;
            int newState = calculateExposureState(view);
            itemView.moveToExposureState(newState);
        }
    }
}
