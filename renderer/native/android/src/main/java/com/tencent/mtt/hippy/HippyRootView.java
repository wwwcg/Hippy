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

package com.tencent.mtt.hippy;

import android.content.Context;
import android.os.Parcelable;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.ViewTreeObserver.OnDrawListener;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.tencent.mtt.hippy.dom.node.NodeProps;
import com.tencent.mtt.hippy.uimanager.NativeViewTag;
import com.tencent.mtt.hippy.utils.LogUtils;

import com.tencent.renderer.NativeRender;
import com.tencent.renderer.NativeRenderContext;
import com.tencent.renderer.NativeRendererManager;

import java.lang.ref.WeakReference;
import java.util.Map;

import static android.content.res.Configuration.ORIENTATION_UNDEFINED;
import static com.tencent.renderer.NativeRenderer.SCREEN_SNAPSHOT_ROOT_ID;

public class HippyRootView extends FrameLayout {

    private static final String TAG = "HippyRootView";
    protected boolean firstViewAdded = false;
    @Nullable
    private GlobalLayoutListener mGlobalLayoutListener;
    private DrawListener mOnDrawListener;

    public HippyRootView(Context context, int instanceId, int rootId) {
        super(new NativeRenderContext(context, instanceId, rootId));
        setId(rootId);
        Map<String, Object> tagMap = NativeViewTag.createViewTag(NodeProps.ROOT_NODE, rootId);
        setTag(tagMap);
        if (rootId != SCREEN_SNAPSHOT_ROOT_ID) {
            getViewTreeObserver().addOnGlobalLayoutListener(getGlobalLayoutListener());
            getViewTreeObserver().addOnDrawListener(getDrawListener());
        }
    }

    @Override
    public void onViewAdded(View child) {
        if (!firstViewAdded) {
            firstViewAdded = true;
            NativeRender nativeRenderer = NativeRendererManager.getNativeRenderer(getContext());
            if (nativeRenderer != null) {
                nativeRenderer.onFirstPaint(getId());
            }
        }
    }

    @Override
    protected void dispatchRestoreInstanceState(SparseArray<Parcelable> container) {
        // No-op do not onRestoreInstanceState for sub views
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // No-op since UIManagerModule handles actually laying out children.
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        setMeasuredDimension(MeasureSpec.getSize(widthMeasureSpec),
                MeasureSpec.getSize(heightMeasureSpec));
    }

    @Override
    protected void onSizeChanged(int w, int h, int ow, int oh) {
        super.onSizeChanged(w, h, ow, oh);
        NativeRender nativeRenderer = NativeRendererManager.getNativeRenderer(getContext());
        if ((w != ow || h != oh) && nativeRenderer != null) {
            nativeRenderer.updateDimension(w, h);
            nativeRenderer.onSizeChanged(getId(), w, h, ow, oh);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        try {
            getViewTreeObserver().removeOnGlobalLayoutListener(getGlobalLayoutListener());
        } catch (Throwable e) {
            e.printStackTrace();
        }
        getViewTreeObserver().addOnGlobalLayoutListener(getGlobalLayoutListener());
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        try {
            getViewTreeObserver().removeOnGlobalLayoutListener(getGlobalLayoutListener());
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public void onFcpBatchEnd() {
        DrawListener drawListener = getDrawListener();
        drawListener.onFcpBatchEnd();
    }

    private class DrawListener implements ViewTreeObserver.OnDrawListener {

        private boolean mFirstContentfulPaint = false;

        public void onFcpBatchEnd() {
            LogUtils.d(TAG, "onFcpBatchEnd: id " + HippyRootView.this.getId() + ", time " + System.currentTimeMillis());
            mFirstContentfulPaint = true;
        }

        @Override
        public void onDraw() {
            Context context = getContext();
            if (context != null && mFirstContentfulPaint) {
                LogUtils.d(TAG, "onDraw: id " + HippyRootView.this.getId() + ", time " + System.currentTimeMillis());
                NativeRender nativeRenderer = NativeRendererManager.getNativeRenderer(context);
                if (nativeRenderer != null) {
                    nativeRenderer.onFirstContentfulPaint(HippyRootView.this.getId());
                }
                mFirstContentfulPaint = false;
            }
        }
    }

    private DrawListener getDrawListener() {
        if (mOnDrawListener == null) {
            mOnDrawListener = new DrawListener();
        }
        return mOnDrawListener;
    }

    private GlobalLayoutListener getGlobalLayoutListener() {
        if (mGlobalLayoutListener == null) {
            mGlobalLayoutListener = new GlobalLayoutListener(this);
        }
        return mGlobalLayoutListener;
    }

    private class GlobalLayoutListener implements ViewTreeObserver.OnGlobalLayoutListener {

        private int mOrientation = ORIENTATION_UNDEFINED;
        private final WeakReference<View> mRootViewRef;

        GlobalLayoutListener(View rootView) {
            mRootViewRef = new WeakReference<>(rootView);
        }

        @Override
        public void onGlobalLayout() {
            Context context = getContext();
            if (context == null) {
                return;
            }
            int orientation = context.getResources().getConfiguration().orientation;
            if (orientation != mOrientation) {
                mOrientation = orientation;
                sendOrientationChangeEvent(mOrientation);
                NativeRender nativeRenderer = NativeRendererManager.getNativeRenderer(context);
                if (nativeRenderer != null) {
                    View rootView = mRootViewRef.get();
                    int width = (rootView != null) ? rootView.getWidth() : -1;
                    int height = (rootView != null) ? rootView.getHeight() : -1;
                    nativeRenderer.updateDimension(width, height);
                }
            }
        }

        private void sendOrientationChangeEvent(int orientation) {
            LogUtils.d(TAG, "sendOrientationChangeEvent: orientation=" + orientation);
        }
    }
}
