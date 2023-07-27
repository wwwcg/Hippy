import React from 'react';
import {
  ListView,
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView
} from '@hippy/react';

const STYLE_LOADING = 100;
const mockDataArray = [
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
  { style: 1 },
  { style: 2 },
  { style: 5 },
];

const hippyBlue = '#4c9afa'
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    collapsable: false,
  },
  itemContainer: {
    padding: 12,
  },
  separatorLine: {
    marginLeft: 12,
    marginRight: 12,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  loading: {
    fontSize: 11,
    color: '#aaaaaa',
    alignSelf: 'center',
  },
  logContainerView: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 250,
    height: 360,
    borderRadius: 4,
    backgroundColor: '#333333', //深灰色
  },
  consoleText: {
    marginLeft: 10,
    fontSize: 11,
    textAlign: 'left',
    color: '#ffffff',
  },
  itemStyle: {
    width: 100,
    height: 100,
    lineHeight: 100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: hippyBlue,
    fontSize: 80,
    margin: 20,
    color: hippyBlue,
    textAlign: 'center',
  },
  topButton: {
    width: 160,
    height: 40,
    lineHeight: 40,
    borderRadius: 8,
    marginLeft: 20,
    paddingHorizontal: 10,
    backgroundColor: hippyBlue,
    color: 'white'
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
      <Text numberOfLines={1}>{ `${index}: Style 1 UI` }</Text>
    </View>
  );
}

function Style2({ index }) {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1}>{ `${index}: Style 2 UI` }</Text>
    </View>
  );
}

function Style5({ index }) {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1}>{ `${index}: Style 5 UI` }</Text>
    </View>
  );
}

export default class ListExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consoleText: '',
      dataSource: mockDataArray,
      fetchingDataFlag: false,
      horizontal: undefined,
    };
    this.delText = 'Delete';
    this.mockFetchData = this.mockFetchData.bind(this);
    this.getRenderRow = this.getRenderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.getRowType = this.getRowType.bind(this);
    this.getRowKey = this.getRowKey.bind(this);
    this.getRowStyle = this.getRowStyle.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onAppear = this.onAppear.bind(this);
    this.onDisappear = this.onDisappear.bind(this);
    this.onWillAppear = this.onWillAppear.bind(this);
    this.onWillDisappear = this.onWillDisappear.bind(this);
    this.rowShouldSticky = this.rowShouldSticky.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  onDelete({ index }) {
    const { dataSource } = this.state;
    const newData = dataSource.filter((item, i) => index !== i);
    this.setState({
      dataSource: newData,
    });
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
    // 只保留小数点后两位
    const y = Math.floor(obj.contentOffset.y * 100) / 100;
    this.logToConsoleView('', `------------ ONSCROLL ${y} ------------`);
  }

  // item完全曝光
  onAppear(index) {
    console.log('onAppear', index);
    this.logToConsoleView(index, `~~~ ${this.getRowType(index)} appeared ~~~`);
  }
  // item完全隐藏
  onDisappear(index) {
    console.log('onDisappear', index);
    this.logToConsoleView(index, '~~~ ~~~ disappeared ~~~ ~~~');
  }

  logToConsoleView(index, logText) {
    const {consoleText} = this.state;
    this.setState({
      // insert consoleText data
      consoleText: `${index} ${logText}\n${consoleText}`,
    });
  }

// item至少一个像素曝光
  onWillAppear(index) {
    console.log('onWillAppear', index);
    this.logToConsoleView(index, `~~~🔥 type ${this.getRowType(index)} will Appear 🔥~~~`);
  }
  // item至少一个像素隐藏
  onWillDisappear(index) {
    console.log('onWillDisappear', index);
    this.logToConsoleView(index, '~~~ ~~~🤚 will Disappear 🤚~~~ ~~~');
  }

  onMomentumScrollBegin = (params) => {
    console.log('onMomentumScrollBegin', params);
    this.logToConsoleView('', `\nonMomentumScrollBegin, ${JSON.stringify(params.contentOffset)}\n`);
  }

  onMomentumScrollEnd = (params) => {
    console.log('onMomentumScrollEnd', params);
    this.logToConsoleView('', `\nonMomentumScrollEnd, ${JSON.stringify(params.contentOffset)}\n`);
  }

  onScrollBeginDrag = (params) => {
    console.log('onScrollBeginDrag', params);
    this.logToConsoleView('', `\nonScrollBeginDrag, ${JSON.stringify(params.contentOffset)}\n`);
  }

  onScrollEndDrag = (params) => {
    console.log('onScrollEndDrag', params);
    this.logToConsoleView('', `\nonScrollEndDrag, ${JSON.stringify(params.contentOffset)}\n`);
  }

  rowShouldSticky(index) {
    return index === 2;
  }
  getRowType(index) {
    const self = this;
    const item = self.state.dataSource[index];
    return index === 6 ? 10086 : item.style;
  }
  // configure listItem style if horizontal listview is set
  getRowStyle() {
    const { horizontal } = this.state;
    return horizontal ? {
      width: 100,
      height: 50,
    } : {};
  }

  getRowKey(index) {
    return `row-${index}`;
  }

  getRenderRow(index) {
    const { dataSource } = this.state;
    let styleUI = null;
    const rowData = dataSource[index];
    const isLastItem = dataSource.length === index + 1;
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
    return index === 6 ? (<ScrollView
        horizontal={true}
        bounces={true}
        contentContainerStyle={{ backgroundColor: 'green' }}
        showsHorizontalScrollIndicator={true} // only iOS support
        showScrollIndicator={true} // only Android support
        onScroll={params => console.log('onScroll', params)}
        onMomentumScrollBegin={params => console.log('onMomentumScrollBegin', params)}
        onMomentumScrollEnd={params => console.log('onMomentumScrollEnd', params)}
        onScrollBeginDrag={params => console.log('onScrollBeginDrag', params)}
        onScrollEndDrag={params => console.log('onScrollEndDrag', params)}
    >
      <Text style={styles.itemStyle}>A</Text>
      <Text style={styles.itemStyle}>B</Text>
      <Text style={styles.itemStyle}>C</Text>
      <Text style={styles.itemStyle}>D</Text>
      <Text style={styles.itemStyle}>E</Text>
      <Text style={styles.itemStyle}>F</Text>
    </ScrollView>) : (
        <View style={styles.container}
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
          {!isLastItem ? <View style={styles.separatorLine} /> : null }
        </View>
    );
  }

  mockFetchData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataArray), 600);
    });
  }

  changeDirection() {
    this.setState({
      horizontal: this.state.horizontal === undefined ? true : undefined,
    });
  }

  render() {
    const { dataSource, horizontal, consoleText } = this.state;
    return (
      <View style={{ flex: 1, collapsable: false }}>
        <View style={{height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: 'gray'}}>
          <Text style={styles.topButton} onClick={ () => {
            this.list.scrollToIndex( 0, 50, true )
          }} >
            跳至第50个Item
          </Text>
          <Text style={styles.topButton} onClick={ () => {
            this.list.scrollToContentOffset( 0, 2000, true )
          }} >
            跳至offset y:2000
          </Text>
        </View>
        <ListView
          ref={(ref) => {
            this.list = ref;
          }}
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
          bounces={true}
          // horizontal ListView  flag（only Android support）
          horizontal={horizontal}
          style={[{ backgroundColor: '#ffffff' }, horizontal ? { height: 50 } : { flex: 1 }]}
          numberOfRows={dataSource.length}
          renderRow={this.getRenderRow}
          onEndReached={this.onEndReached}
          getRowType={this.getRowType}
          onDelete={this.onDelete}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
          delText={this.delText}
          editable={true}
          scrollEnabled={true}
          showScrollIndicator={true}
          // configure listItem style if horizontal listview is set
          getRowStyle={this.getRowStyle}
          getRowKey={this.getRowKey}
          initialListSize={15}
          rowShouldSticky={this.rowShouldSticky}
          onAppear={this.onAppear}
          onDisappear={this.onDisappear}
          onWillAppear={this.onWillAppear}
          onWillDisappear={this.onWillDisappear}
          onScroll={this.onScroll}
          scrollEventThrottle={1000} // 1s
          initialContentOffset={500}
        />
        <ScrollView style={styles.logContainerView}>
          <Text style={styles.consoleText}>{this.state.consoleText}</Text>
        </ScrollView>
        <View
            onClick={() => this.changeDirection()}
            style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              width: 67,
              height: 67,
              borderRadius: 30,
              boxShadowOpacity: 0.6,
              boxShadowRadius: 5,
              boxShadowOffsetX: 3,
              boxShadowOffsetY: 3,
              boxShadowColor: '#4c9afa' }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#4c9afa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white' }}>切换方向</Text>
          </View>
        </View>
      </View>
    );
  }
}

