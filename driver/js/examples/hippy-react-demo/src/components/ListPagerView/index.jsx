import React from 'react';
import {
  ListPagerView,
  View,
  StyleSheet,
  Text,
} from '@hippy/react';


const STYLE_LOADING = 100;
const mockDataArray = [
  { style: 1 },
  { style: 2 },
  { style: 1 },
  { style: 2 },
  { style: 5},
  { style: 2 },
  { style: 5 },
  { style: 2 },
  { style: 5},
  { style: 2 },
  { style: 1 },
  { style: 2 },
];

const styles = StyleSheet.create({
  container: {
    collapsable: false,
    flex: 1,
  },
  itemContainer: {
    padding: 12,
  },
  loading: {
    fontSize: 11,
    color: '#aaaaaa',
    alignSelf: 'center',
  },
  pullContainer: {
    flex: 1,
    height: 50,
    backgroundColor: '#4c9afa',
  },
  pullContent: {
    lineHeight: 50,
    color: 'white',
    height: 50,
    textAlign: 'center',
  },
  pullFooter: {
    height: 40,
    flex: 1,
    backgroundColor: '#4c9afa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: 'red',
    collapsable: false,
  },
  container2: {
    flex: 1,
    backgroundColor: 'blue',
    collapsable: false,
  },
  container3: {
    flex: 1,
    backgroundColor: 'yellow',
    collapsable: false,
  },
});


function Style1({ index }) {
  return (
    <View style={ [styles.container1]}
          onClick={(event) => {
            console.log('click style1', event.target.nodeId, event.currentTarget.nodeId);
          }}
    >
      <Text style={{ fontSize: 31 }} >{ `${index}: Style 1 UI` }</Text>
    </View>
  );
}

function Style2({ index }) {
  return (
    <View style={styles.container2}>
      <Text style={{ fontSize: 31 }} >{ `${index}: Style 2 UI` }</Text>
    </View>
  );
}

function Style5({ index }) {
  return (
    <View style={styles.container3}>
      <Text style={{ fontSize: 31 }}>{ `${index}: Style 5 UI` }</Text>
    </View>
  );
}


export default class ListPagerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: mockDataArray,
      fetchingDataFlag: false,
    };
    this.mockFetchData = this.mockFetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.getRowType = this.getRowType.bind(this);
    this.getRowKey = this.getRowKey.bind(this);
    this.getRowStyle = this.getRowStyle.bind(this);
    this.renderPullHeader = this.renderPullHeader.bind(this);
    this.renderPullFooter = this.renderPullFooter.bind(this);
    this.onAppear = this.onAppear.bind(this);
    this.onDisappear = this.onDisappear.bind(this);
    this.onWillAppear = this.onWillAppear.bind(this);
    this.onWillDisappear = this.onWillDisappear.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onHeaderReleased = this.onHeaderReleased.bind(this);
    this.onHeaderPulling = this.onHeaderPulling.bind(this);
    this.onFooterPulling = this.onFooterPulling.bind(this);
  }

/**
   * 页面加载更多时触发
   * 这里触发加载更多还可以使用 PullFooter 组件。
   * onEndReached 更适合用来无限滚动的场景。
   */
async onEndReached() {
  const { dataSource } = this.state;
  // ensure that only one fetching task would be running
  if (this.loadMoreDataFlag) {
    return;
  }
  this.loadMoreDataFlag = true;
  this.setState({
    footerRefreshText: '加载更多...',
  });
  let newData = [];
  try {
    newData = await this.mockFetchData();
  } catch (err) {}
  if (newData.length === 0) {
    this.setState({
      footerRefreshText: '没有更多数据',
    });
  }
  this.listPager.collapsePullFooter();
  const newDataSource = [...dataSource, ...newData];
  this.setState({ dataSource: newDataSource });
  this.loadMoreDataFlag = false;
}

  // item完全曝光
  onAppear(index) {
    console.log('onAppear', index);
  }

  onScroll(obj) {
    console.log('onScroll', obj.contentOffset.y);
    if (obj.contentOffset.y <= 0) {
      if (!this.topReached) {
        this.topReached = true;
        console.log('onTopReached');
      }
    } else {
      this.topReached = false;
    }
  }

 /**
   * 下拉超过内容高度，松手后触发
   */
 async onHeaderReleased() {
  if (this.fetchingDataFlag) {
    return;
  }
  this.fetchingDataFlag = true;
  console.log('onHeaderReleased');
  this.setState({
    headerRefreshText: '刷新数据中，请稍等',
  });
  let dataSource = [];
  try {
    dataSource = await this.mockFetchData();
    dataSource = dataSource.reverse();
  } catch (err) {}
  this.fetchingDataFlag = false;
  this.setState({
    dataSource,
    headerRefreshText: '1秒后收起',
  }, () => {
    this.listPager.collapsePullHeader({ time: 1000 });
  });
}

/**
 * 下拉过程中触发
 *
 * 事件会通过 contentOffset 参数返回拖拽高度，我们已经知道了内容高度，
 * 简单对比一下就可以显示不同的状态。
 *
 * 这里简单处理，其实可以做到更复杂的动态效果。
 */
onHeaderPulling(evt) {
  if (this.fetchingDataFlag) {
    return;
  }
  console.log('onHeaderPulling', evt.contentOffset);
  // if (evt.contentOffset > styles.pullContent.height) {
  //   this.setState({
  //     headerRefreshText: '松手，即可触发刷新',
  //   });
  // } else {
  //   this.setState({
  //     headerRefreshText: '继续下拉，触发刷新',
  //   });
  // }
}

onFooterPulling(evt) {
  console.log('onFooterPulling', evt);
}


  /**
   * 渲染 pullHeader 组件
   */
  renderPullHeader() {
    const { headerRefreshText, horizontal } = this.state;
    return (
      !horizontal ? <View style={styles.pullContainer}>
        <Text style={styles.pullContent}>{headerRefreshText}</Text>
      </View> : <View style={{
        width: 40,
        height: 300,
        backgroundColor: '#4c9afa',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          lineHeight: 25,
          color: 'white',
          width: 40,
          paddingHorizontal: 15,
        }}>{headerRefreshText}</Text>
      </View>
    );
  }

  /**
   * 渲染 pullFooter 组件
   */
  renderPullFooter() {
    const { horizontal } = this.state;
    return !horizontal ? <View style={styles.pullFooter}>
      <Text style={{
        color: 'white',
      }}
      >{this.state.footerRefreshText}</Text>
    </View> : <View style={{
      width: 40,
      height: 300,
      backgroundColor: '#4c9afa',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{
        color: 'white',
        lineHeight: 25,
        width: 40,
        paddingHorizontal: 15,
      }}
      >{this.state.footerRefreshText}</Text>
    </View>;
  }

  // item完全隐藏
  onDisappear(index) {
    console.log('onDisappear', index);
  }
  // item至少一个像素曝光
  onWillAppear(index) {
    console.log('onWillAppear', index);
  }
  // item至少一个像素隐藏
  onWillDisappear(index) {
    console.log('onWillDisappear', index);
  }
  getRowType(index) {
    const self = this;
    const item = self.state.dataSource[index];
    return item.style;
  }
  // configure listItem style to full screen
  getRowStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
  }

  getRowKey(index) {
    return `row-${index}`;
  }

  renderRow(index) {
    console.log('renderRow', index);
    const { dataSource } = this.state;
    let styleUI = null;
    const rowData = dataSource[index];
    switch (rowData.style) {
      case 1:
        styleUI = <Style1 index={index} />;
        break;
      case 2:
        styleUI = <Style2 index={index} />;
        break;
      case 5:
        styleUI = <Style5 index={index} />;
        break;
      case STYLE_LOADING:
        styleUI = <Text style={styles.loading}>Loading now...</Text>;
        break;
      default:
      // pass
    }
    return (
      <View style={ [ styles.container, { backgroundColor: `#${Math.floor(Math.random() * 0xffffff).toString(16)}` } ]}
            onClickCapture={(event) => {
              console.log('onClickCapture style outer', event.target.nodeId, event.currentTarget.nodeId);
            }}
            onTouchDown={(event) => {
              // outer onTouchDown would not be called, because style1 invoked event.stopPropagation();
              console.log('onTouchDown style outer', event.target.nodeId, event.currentTarget.nodeId);
              return false;
            }}
            onClick={(event) => {
              console.log('click style outer', event.target.nodeId, event.currentTarget.nodeId);
              // return false means trigger bubble
              return false;
            }}>
        <View style={styles.itemContainer}>
          {styleUI}
        </View>
      </View>
    );
  }

  mockFetchData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataArray), 1600);
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <View style={{ flex: 1, collapsable: false }}>
        <ListPagerView
          style={[{ backgroundColor: '#ffffff' }, { flex: 1 }]}
          ref={(ref) => {
            this.listPager = ref;
          }}
          preCreateRowsNumber={2} // configure pre-create rows number
          preloadItemNumber={8}
          // all below props are same as ListView
          bounces={true}
          showScrollIndicator={false}
          numberOfRows={dataSource.length}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          getRowType={this.getRowType}
          getRowStyle={this.getRowStyle} // configure listItem style if needed
          getRowKey={this.getRowKey}
          initialListSize={15} // configure initial render list data size
          renderPullHeader={this.renderPullHeader}
          renderPullFooter={this.renderPullFooter}
          onHeaderReleased={this.onHeaderReleased}
          onHeaderPulling={this.onHeaderPulling}
          onFooterReleased={this.onEndReached}
          onFooterPulling={this.onFooterPulling}
          onAppear={this.onAppear}
          onDisappear={this.onDisappear}
          onWillAppear={this.onWillAppear}
          onWillDisappear={this.onWillDisappear}
          onScroll={this.onScroll}
          scrollEventThrottle={1000} // 1s
          onScrollBeginDrag={params => console.log('onScrollBeginDrag', params)}
          onScrollEndDrag={params => console.log('onScrollEndDrag', params)}
        />
      </View>
    );
  }
}
