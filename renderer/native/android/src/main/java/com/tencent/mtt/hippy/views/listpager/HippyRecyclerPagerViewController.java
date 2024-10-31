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

import static com.tencent.mtt.hippy.dom.node.NodeProps.OVER_PULL;
import static com.tencent.renderer.NativeRenderer.SCREEN_SNAPSHOT_ROOT_ID;

import android.content.Context;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.HippyPagerLinearLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import android.view.View;
import androidx.recyclerview.widget.RecyclerView.LayoutManager;
import com.tencent.mtt.hippy.annotation.HippyController;
import com.tencent.mtt.hippy.annotation.HippyControllerProps;
import com.tencent.mtt.hippy.common.HippyArray;
import com.tencent.mtt.hippy.dom.node.NodeProps;
import com.tencent.mtt.hippy.uimanager.ControllerManager;
import com.tencent.mtt.hippy.uimanager.ControllerRegistry;
import com.tencent.mtt.hippy.uimanager.HippyViewController;
import com.tencent.mtt.hippy.utils.PixelUtil;
import com.tencent.mtt.hippy.views.hippylist.HippyListUtils;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerListAdapter;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerView;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerViewWrapper;
import com.tencent.renderer.NativeRenderContext;
import com.tencent.renderer.node.ListViewRenderNode;
import com.tencent.renderer.node.RenderNode;
import com.tencent.renderer.utils.MapUtils;
import java.util.Map;


@HippyController(name = HippyRecyclerPagerViewController.CLASS_NAME)
public class HippyRecyclerPagerViewController<HRW extends HippyRecyclerViewWrapper> extends HippyViewController<HRW> {

    public static final String CLASS_NAME = "ListPagerView";
    public static final String SCROLL_TO_INDEX = "scrollToIndex";
    public static final String SCROLL_TO_CONTENT_OFFSET = "scrollToContentOffset";
    public static final String SCROLL_TO_TOP = "scrollToTop";
    public static final String HORIZONTAL = "horizontal";

    @Override
    public int getChildCount(HRW viewGroup) {
        return viewGroup.getChildCountWithCaches();
    }

    @Override
    public View getChildAt(HRW viewGroup, int index) {
        return viewGroup.getChildAtWithCaches(index);
    }

    @Override
    public void onViewDestroy(HRW viewGroup) {
        ((HRW) viewGroup).getRecyclerView().onDestroy();
    }

    /**
     * view 被Hippy的RenderNode 删除了，这样会导致View的child完全是空的，这个view是不能再被recyclerView复用了
     * 否则如果被复用，在adapter的onBindViewHolder的时候，view的实际子view和renderNode的数据不匹配，diff会出现异常
     * 导致item白条，显示不出来，所以被删除的view，需要把viewHolder.setIsRecyclable(false)，刷新list后，这个view就 不会进入缓存。
     */
    @Override
    protected void deleteChild(ViewGroup parentView, View childView) {
        super.deleteChild(parentView, childView);
        ((HRW) parentView).getRecyclerView().disableRecycle(childView);
    }

    @Override
    public void onBatchStart(HRW view) {
        super.onBatchStart(view);
        view.onBatchStart();
    }

    @Override
    public void onBatchComplete(HRW view) {
        super.onBatchComplete(view);
        view.onBatchComplete();
        view.setListData();
    }

    @Override
    protected View createViewImpl(Context context) {
        return createViewImpl(context, null);
    }

    @Override
    protected View createViewImpl(@NonNull Context context, @Nullable Map<String, Object> props) {
        HippyRecyclerView hippyRecyclerView = initDefault(context, props, new HippyRecyclerPagerView(context));
        return new HippyRecyclerViewWrapper(context, hippyRecyclerView);
    }

    @Override
    public RenderNode createRenderNode(int rootId, int id, @Nullable Map<String, Object> props,
            @NonNull String className, @NonNull ControllerManager controllerManager, boolean isLazyLoad) {
        return new ListViewRenderNode(rootId, id, props, className, controllerManager, isLazyLoad);
    }

    @Override
    public void updateLayout(int rootId, int id, int x, int y, int width, int height,
            ControllerRegistry componentHolder) {
        super.updateLayout(rootId, id, x, y, width, height, componentHolder);
        // nested list may not receive onBatchComplete, so we have to call dispatchLayout here
        View view = componentHolder.getView(rootId, id);
        if (view instanceof HippyRecyclerViewWrapper) {
            ((HippyRecyclerViewWrapper<?>) view).getRecyclerView().dispatchLayout();
        }
    }

    protected HippyRecyclerView initDefault(@NonNull Context context,
            @Nullable Map<String, Object> props, HippyRecyclerView recyclerView) {
        LinearLayoutManager layoutManager = new HippyPagerLinearLayoutManager(context);
        layoutManager.setItemPrefetchEnabled(false);
        recyclerView.setItemAnimator(null);
        recyclerView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        boolean enableOverPull = false;
        boolean hasStableIds = true;
        if (props != null) {
            if (MapUtils.getBooleanValue(props, HORIZONTAL)) {
                layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
            }
            enableOverPull = MapUtils.getBooleanValue(props, NodeProps.OVER_PULL, false);
            hasStableIds = MapUtils.getBooleanValue(props, NodeProps.HAS_STABLE_IDS, true);
        }
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.initRecyclerView(hasStableIds);
        if (HippyListUtils.isVerticalLayout(recyclerView)) {
            recyclerView.setEnableOverPull(enableOverPull);
        }
        if (context instanceof NativeRenderContext) {
            int rootId = ((NativeRenderContext) context).getRootId();
            if (rootId == SCREEN_SNAPSHOT_ROOT_ID) {
                recyclerView.setScrollEnable(false);
            }
        }
        return recyclerView;
    }

    @HippyControllerProps(name = "horizontal", defaultType = HippyControllerProps.BOOLEAN)
    public void setHorizontalEnable(final HRW viewWrapper, boolean flag) {
        LayoutManager layoutManager = viewWrapper.getRecyclerView().getLayoutManager();
        if (!(layoutManager instanceof LinearLayoutManager)) {
            return;
        }
        int orientation = ((LinearLayoutManager) layoutManager).getOrientation();
        if (flag) {
            if (orientation != LinearLayoutManager.HORIZONTAL) {
                ((LinearLayoutManager) layoutManager).setOrientation(
                        LinearLayoutManager.HORIZONTAL);
                viewWrapper.getRecyclerView().getAdapter().onLayoutOrientationChanged();
            }
        } else {
            if (orientation == LinearLayoutManager.HORIZONTAL) {
                ((LinearLayoutManager) layoutManager).setOrientation(
                        LinearLayoutManager.VERTICAL);
                viewWrapper.getRecyclerView().getAdapter().onLayoutOrientationChanged();
            }
        }
    }

    @HippyControllerProps(name = "onScrollBeginDrag", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean =
            false)
    public void setScrollBeginDragEventEnable(HRW view, boolean flag) {
        view.getRecyclerViewEventHelper().setScrollBeginDragEventEnable(flag);
    }

    @HippyControllerProps(name = "onScrollEndDrag", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean = false)
    public void setScrollEndDragEventEnable(HRW view, boolean flag) {
        view.getRecyclerViewEventHelper().setScrollEndDragEventEnable(flag);
    }

    @HippyControllerProps(name = "onScrollEnable", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean = false)
    public void setOnScrollEventEnable(HRW view, boolean flag) {
        view.getRecyclerViewEventHelper().setOnScrollEventEnable(flag);
    }

    @HippyControllerProps(name = "exposureEventEnabled", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean =
            false)
    public void setExposureEventEnable(HRW view, boolean flag) {
        view.getRecyclerViewEventHelper().setExposureEventEnable(flag);
    }

    @HippyControllerProps(name = "scrollEnabled", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean = true)
    public void setScrollEnable(HRW view, boolean flag) {
        view.setScrollEnable(flag);
    }

    @HippyControllerProps(name = "scrollEventThrottle", defaultType = HippyControllerProps.NUMBER, defaultNumber =
            30.0D)
    public void setScrollEventThrottle(HRW view, int scrollEventThrottle) {
        view.getRecyclerViewEventHelper().setScrollEventThrottle(scrollEventThrottle);
    }

    @HippyControllerProps(name = "preloadItemNumber")
    public void setPreloadItemNumber(HRW view, int preloadItemNumber) {
        view.getRecyclerViewEventHelper().setPreloadItemNumber(preloadItemNumber);
    }

    @HippyControllerProps(name = "overScrollEnabled", defaultType = HippyControllerProps.BOOLEAN, defaultBoolean =
            false)
    public void setOverScrollEnable(HRW viewWrapper, boolean flag) {
        HippyRecyclerView<?> recyclerView = viewWrapper.getRecyclerView();
        if (recyclerView != null) {
            if (flag) {
                recyclerView.setOverScrollMode(View.OVER_SCROLL_ALWAYS);
            } else {
                recyclerView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            }
        }
    }

    @HippyControllerProps(name = OVER_PULL, defaultType = HippyControllerProps.BOOLEAN, defaultBoolean = true)
    public void setBounces(HRW viewWrapper, boolean flag) {
        HippyRecyclerView<?> recyclerView = viewWrapper.getRecyclerView();
        if (recyclerView != null) {
            recyclerView.setEnableOverPull(flag);
        }
    }

    @HippyControllerProps(name = "initialContentOffset", defaultType = HippyControllerProps.NUMBER, defaultNumber = 0)
    public void setInitialContentOffset(HRW viewWrapper, int offset) {
        viewWrapper.getRecyclerView().setInitialContentOffset((int) PixelUtil.dp2px(offset));
    }

    @HippyControllerProps(name = "itemViewCacheSize", defaultType = HippyControllerProps.NUMBER, defaultNumber = 0)
    public void setItemViewCacheSize(HRW viewWrapper, int size) {
        viewWrapper.getRecyclerView().setItemViewCacheSize(Math.max(size, 2));
    }

    @HippyControllerProps(name = "autoPageScrollDuration", defaultType = HippyControllerProps.NUMBER, defaultNumber =
            200)
    public void setAutoPageScrollDuration(HRW viewWrapper, int duration) {
        HippyRecyclerView recyclerView = viewWrapper.getRecyclerView();
        if (duration > 0 && recyclerView instanceof HippyRecyclerPagerView) {
            ((HippyRecyclerPagerView) recyclerView).setAutoPageScrollDuration(duration);
        }
    }

    @HippyControllerProps(name = "pageUpDownOffsetRatio", defaultType = HippyControllerProps.NUMBER, defaultNumber =
            0.5)
    public void setPageUpDownOffsetRatio(HRW viewWrapper, float ratio) {
        HippyRecyclerView recyclerView = viewWrapper.getRecyclerView();
        if (recyclerView instanceof HippyRecyclerPagerView) {
            ((HippyRecyclerPagerView) recyclerView).setPageUpDownOffsetRatio(ratio);
        }
    }

    @HippyControllerProps(name = "preCreateRowsNumber", defaultType = HippyControllerProps.NUMBER, defaultNumber = 0)
    public void setPreCreateRowsNumber(HRW viewWrapper, int count) {
        HippyRecyclerView recyclerView = viewWrapper.getRecyclerView();
        if (recyclerView instanceof HippyRecyclerPagerView) {
            ((HippyRecyclerPagerView) recyclerView).setPreCreateRowsNumber(count);
        }
    }

    @Override
    public void onAfterUpdateProps(HRW viewWrapper) {
        super.onAfterUpdateProps(viewWrapper);
        viewWrapper.getRecyclerView().onAfterUpdateProps();
    }

    @Override
    public void dispatchFunction(HRW view, String functionName, HippyArray dataArray) {
        super.dispatchFunction(view, functionName, dataArray);
        switch (functionName) {
            case SCROLL_TO_INDEX: {
                // list滑动到某个item
                int xIndex = dataArray.getInt(0);
                int yIndex = dataArray.getInt(1);
                boolean animated = dataArray.getBoolean(2);
                int duration = dataArray.getInt(3); //1.2.7 增加滚动时间 ms,animated==true时生效
                view.scrollToIndex(xIndex, yIndex, animated, duration);
                break;
            }
            case SCROLL_TO_CONTENT_OFFSET: {
                // list滑动到某个距离
                double xOffset = dataArray.getDouble(0);
                double yOffset = dataArray.getDouble(1);
                boolean animated = dataArray.getBoolean(2);
                int duration = dataArray.getInt(3); //1.2.7 增加滚动时间 ms,animated==true时生效
                view.scrollToContentOffset(xOffset, yOffset, animated, duration);
                break;
            }
            case SCROLL_TO_TOP: {
                view.scrollToTop();
                break;
            }
        }
    }

    private HippyRecyclerListAdapter getAdapter(HRW view) {
        return view.getRecyclerView().getAdapter();
    }
}
