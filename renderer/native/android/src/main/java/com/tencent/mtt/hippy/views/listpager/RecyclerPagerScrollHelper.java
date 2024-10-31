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

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.view.MotionEvent;

import android.view.View;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.tencent.mtt.hippy.utils.LogUtils;
import com.tencent.mtt.hippy.views.hippylist.HippyRecyclerView;
import java.lang.ref.WeakReference;

public class RecyclerPagerScrollHelper {

    private static final String TAG = "RecyclerPagerScrollHelper";
    private final WeakReference<HippyRecyclerView> recyclerViewRef;
    private ValueAnimator animator = null;
    private int orientation;
    private final PagerOnFlingListener flingListener = new PagerOnFlingListener();
    private int currentPageIndex = 0;
    private boolean firstTouch = true;
    private int flingAnimationState = 0;
    private int offsetY = 0;
    private int offsetX = 0;
    private int startY = 0;
    private int startX = 0;
    private int pageScrollDuration = 160;
    private int preCreateCount = 0;
    private float pageUpDownOffsetRatio = 0.01f;

    public RecyclerPagerScrollHelper(@NonNull HippyRecyclerView recyclerView) {
        recyclerViewRef = new WeakReference<>(recyclerView);
        recyclerView.setOnFlingListener(flingListener);
        PagerOnScrollListener scrollListener = new PagerOnScrollListener();
        recyclerView.addOnScrollListener(scrollListener);
        PagerOnTouchListener touchListener = new PagerOnTouchListener();
        recyclerView.setOnTouchListener(touchListener);
    }

    public void setOrientation(int ori) {
        orientation = ori;
    }

    public void setAutoPageScrollDuration(int duration) {
        pageScrollDuration = duration;
    }

    public void setPageUpDownOffsetRatio(float ratio) {
        if (ratio > 0) {
            pageUpDownOffsetRatio = ratio;
        }
    }

    public void setPreCreateRowsNumber(int count) {
        if (count > 0) {
            preCreateCount = count;
        }
    }

    public int getPreCreateRowsNumber() {
        return preCreateCount;
    }

    public class PagerOnTouchListener implements View.OnTouchListener {

        @Override
        public boolean onTouch(View v, MotionEvent event) {
            if (firstTouch) {
                firstTouch = false;
                final HippyRecyclerView recyclerView = recyclerViewRef.get();
                if (recyclerView != null) {
                    int pageIndex = getPageIndex();
                    offsetY = pageIndex * recyclerView.getHeight();
                }
                offsetY = recyclerView.getContentOffsetY();
                startY = currentPageIndex * recyclerView.getHeight();
            }
            if (event.getAction() == MotionEvent.ACTION_UP || event.getAction() == MotionEvent.ACTION_CANCEL) {
                firstTouch = true;
            }
            return false;
        }
    }

    public class PagerOnFlingListener extends RecyclerView.OnFlingListener {
        @Override
        public boolean onFling(int velocityX, int velocityY) {
            final HippyRecyclerView recyclerView = recyclerViewRef.get();
            if (recyclerView == null) {
                return false;
            }
            int pageIndex = currentPageIndex;
            int endPoint;
            int startPoint;
            HippyRecyclerPagerAdapter adapter = ((HippyRecyclerPagerAdapter) recyclerView.getAdapter());
            int count = adapter.getItemCountExceptHeaderAndFooter() - 1;
            if (currentPageIndex == count && adapter.hasPullFooter()) {
                if (adapter.getFooterVisibleHeight() > 0) {
                    return false;
                }
                offsetY = recyclerView.getContentOffsetY();
                LogUtils.d(TAG, "onFling: offsetY " + offsetY + ", startY " + startY);
            }
            if (currentPageIndex == 0 && adapter.hasPullHeader()) {
                if (adapter.getHeaderVisibleHeight() > 0) {
                    return false;
                }
                offsetY = recyclerView.getContentOffsetY();
                LogUtils.d(TAG, "onFling: offsetY " + offsetY + ", startY " + startY);
            }
            if (orientation == RecyclerView.VERTICAL) {
                startPoint = offsetY;
                int absY = Math.abs(offsetY - startY);
                boolean move = absY > (recyclerView.getHeight() * pageUpDownOffsetRatio);
                if ((offsetY > startY && velocityY < 0) || (offsetY < startY && velocityY > 0)) {
                    move = false;
                }
                LogUtils.d(TAG, "onFling: offsetY " + offsetY + ", pageIndex " + pageIndex + ", velocityY " + velocityY
                        + ", absY " + absY + ", move " + move);
                if (velocityY < 0 && move) {
                    pageIndex--;
                } else if (velocityY > 0 && move) {
                    pageIndex++;
                }
                endPoint = pageIndex * recyclerView.getHeight();
            } else {
                startPoint = offsetX;
                if (velocityX < 0) {
                    pageIndex--;
                } else if (velocityX > 0) {
                    pageIndex++;
                }
                endPoint = pageIndex * recyclerView.getWidth();
            }
            if (endPoint < 0) {
                endPoint = 0;
            }
            LogUtils.d(TAG, "onFling: startPoint " + startPoint + ", endPoint " + endPoint);
            if (animator == null) {
                animator = new ValueAnimator().ofInt(startPoint, endPoint);
                animator.setDuration(pageScrollDuration);
                animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                    @Override
                    public void onAnimationUpdate(@NonNull ValueAnimator animation) {
                        int nowPoint = (int) animation.getAnimatedValue();
                        if (orientation == RecyclerView.VERTICAL) {
                            int dy = nowPoint - offsetY;
                            recyclerView.scrollBy(0, dy);
                        } else {
                            int dx = nowPoint - offsetX;
                            recyclerView.scrollBy(dx, 0);
                        }
                    }
                });
                animator.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        if (null != mOnPageChangeListener) {
                            mOnPageChangeListener.onPageChange(currentPageIndex);
                        }
                        recyclerView.stopScroll();
                        startY = offsetY;
                        startX = offsetX;
                        flingAnimationState = 0;
                        int pageIndex = getPageIndex();
                        if (currentPageIndex != pageIndex) {
                            currentPageIndex = pageIndex;
                        }
                        LogUtils.d(TAG, "onAnimationEnd: offsetY " + offsetY + ", startY " + startY + ", currentPageIndex " + currentPageIndex);
                    }
                });
            } else {
                animator.cancel();
                animator.setIntValues(startPoint, endPoint);
            }
            animator.start();
            flingAnimationState = 1;
            return true;
        }
    }

    public class PagerOnScrollListener extends RecyclerView.OnScrollListener {
        @Override
        public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
            LogUtils.d(TAG, "onScrollStateChanged: newState " + newState);
            if (newState == 0) {
                boolean move;
                int vX = 0, vY = 0;
                if (orientation == RecyclerView.VERTICAL) {
                    int absY = Math.abs(offsetY - startY);
                    LogUtils.d(TAG, "onScrollStateChanged: offsetY " + offsetY + ", startY " + startY + ", absY " + absY);
                    move = absY > (recyclerView.getHeight() * pageUpDownOffsetRatio);
                    if (move) {
                        vY = offsetY - startY < 0 ? -1000 : 1000;
                    }
                } else {
                    int absX = Math.abs(offsetX - startX);
                    move = absX > recyclerView.getWidth() / 2;
                    if (move) {
                        vX = offsetX - startX < 0 ? -1000 : 1000;
                    }
                }
                if (flingAnimationState == 0) {
                    LogUtils.d(TAG, "onScrollStateChanged: vY " + vY);
                    flingListener.onFling(vX, vY);
                }
            }
        }

        @Override
        public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
            offsetY += dy;
            offsetX += dx;
        }
    }

    private int getPageIndex() {
        HippyRecyclerView recyclerView = recyclerViewRef.get();
        if (recyclerView == null || recyclerView.getHeight() == 0 || recyclerView.getWidth() == 0) {
            return 0;
        }
        int pageIndex;
        if (orientation == RecyclerView.VERTICAL) {
            pageIndex = offsetY / recyclerView.getHeight();
        } else {
            pageIndex = offsetX / recyclerView.getWidth();
        }
        return pageIndex;
    }

    private int getStartPageIndex() {
        HippyRecyclerView recyclerView = recyclerViewRef.get();
        if (recyclerView == null || recyclerView.getHeight() == 0 || recyclerView.getWidth() == 0) {
            return 0;
        }
        int pageIndex;
        if (orientation == RecyclerView.VERTICAL) {
            pageIndex = startY / recyclerView.getHeight();
        } else {
            pageIndex = startX / recyclerView.getWidth();
        }
        return pageIndex;
    }

    onPageChangeListener mOnPageChangeListener;

    public void setOnPageChangeListener(onPageChangeListener listener) {
        mOnPageChangeListener = listener;
    }

    public interface onPageChangeListener {
        void onPageChange(int index);
    }

}
