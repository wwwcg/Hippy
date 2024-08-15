import React from 'react';
import {
  ListView,
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
  { style: 1 },
  { style: 2 },
  { style: 1 },
  { style: 2 },
  { style: 1 },
  { style: 2 },
  { style: 1 },
  { style: 2 },
];

const styles = StyleSheet.create({
  container: {
    collapsable: false,
    flex: 1,
    height: 400,
  },
  itemContainer: {
    padding: 12,
  },
  loading: {
    fontSize: 11,
    color: '#aaaaaa',
    alignSelf: 'center',
  },
});


function Style1({ index }) {
  return (
    <View style={styles.container}
          onClickCapture={(event) => {
            console.log('onClickCapture style1', event.target.nodeId, event.currentTarget.nodeId);
          }}
          onTouchDown={(event) => {
            // if stopPropagation && return false called at the same time, stopPropagation has higher priority
            event.stopPropagation();
            console.log('onTouchDown style1', event.target.nodeId, event.currentTarget.nodeId);
            return false;
          }}
          onClick={(event) => {
            console.log('click style1', event.target.nodeId, event.currentTarget.nodeId);
            return false;
          }}
    >
      <Text style={{ fontSize: 31 }} >{ `${index}: Style 1 UI` }</Text>
    </View>
  );
}

function Style2({ index }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 31 }} >{ `${index}: Style 2 UI` }</Text>
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
    this.getRenderRow = this.getRenderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.getRowType = this.getRowType.bind(this);
    this.getRowKey = this.getRowKey.bind(this);
    this.getRowStyle = this.getRowStyle.bind(this);
    this.onAppear = this.onAppear.bind(this);
    this.onDisappear = this.onDisappear.bind(this);
    this.onWillAppear = this.onWillAppear.bind(this);
    this.onWillDisappear = this.onWillDisappear.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  async onEndReached() {
    const { dataSource, fetchingDataFlag } = this.state;
    // ensure that only one fetching task would be running
    if (fetchingDataFlag) return;
    this.setState({
      fetchingDataFlag: true,
      dataSource: dataSource.concat([{ style: STYLE_LOADING }]),
    });
    const newData = await this.mockFetchData();
    const newDataSource = dataSource.concat(newData);
    this.setState({ dataSource: newDataSource, fetchingDataFlag: false });
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

  getRenderRow(index) {
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
      case STYLE_LOADING:
        styleUI = <Text style={styles.loading}>Loading now...</Text>;
        break;
      default:
      // pass
    }
    return (
      <View style={[styles.container,
        { backgroundColor: `#${Math.floor(Math.random() * 0xffffff).toString(16)}` }]}
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
      setTimeout(() => resolve(mockDataArray), 3000);
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <View style={{ flex: 1, collapsable: false }}>
        <ListView
          onTouchDown={(event) => {
            console.log('onTouchDown ListView', event.target.nodeId, event.currentTarget.nodeId);
          }}
          onClickCapture={(event) => {
            // if calling capture event stopPropagation function in one of node,
            // all capture phase left, target phase and bubbling phase would stop.
            // event.stopPropagation();
            console.log('onClickCapture listview', event.target.nodeId, event.currentTarget.nodeId);
          }}
          onClick={(event) => {
            console.log('click listview', event.target.nodeId, event.currentTarget.nodeId);
            // return false means trigger bubble
            return true;
          }}

          style={[{ backgroundColor: '#ffffff' }, { flex: 1 }]}
          bounces={true}
          pagingEnabled={true}
          showScrollIndicator={false}
          preCreateItemNumber={1} // configure pre-create item number

          numberOfRows={dataSource.length}
          renderRow={this.getRenderRow}
          onEndReached={this.onEndReached}
          getRowType={this.getRowType}
          getRowStyle={this.getRowStyle} // configure listItem style if needed
          getRowKey={this.getRowKey}
          initialListSize={15} // configure initial render list data size
          onAppear={this.onAppear}
          onDisappear={this.onDisappear}
          onWillAppear={this.onWillAppear}
          onWillDisappear={this.onWillDisappear}
          onScroll={this.onScroll}
          scrollEventThrottle={1000} // 1s

          onMomentumScrollBegin={params => console.log('onMomentumScrollBegin', params)}
          onMomentumScrollEnd={params => console.log('onMomentumScrollEnd', params)}
          onScrollBeginDrag={params => console.log('onScrollBeginDrag', params)}
          onScrollEndDrag={params => console.log('onScrollEndDrag', params)}
        />
      </View>
    );
  }
}

