import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
} from '@hippy/react';
import Switch from '../../shared/Switch';

const styles = StyleSheet.create({
  itemStyle: {
    width: 100,
    height: 100,
    lineHeight: 100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#4c9afa',
    fontSize: 80,
    margin: 20,
    color: '#4c9afa',
    textAlign: 'center',
  },
  verticalScrollView: {
    height: 300,
    width: 140,
    margin: 20,
    borderColor: '#eee',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  itemTitle: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: 2,
    backgroundColor: '#fafafa',
    padding: 10,
    marginTop: 10,
  },
});

export default function ScrollExpo(props) {
  const [shouldBounces, setShouldBounces] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [enablePaging, setEnablePaging] = useState(true);

  return (
    <ScrollView>
      <View style={styles.itemTitle}>
        <Text>Horizontal ScrollView</Text>
      </View>
      <View style={{margin : 10, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginRight: 5}}>bounces: </Text>
        <Switch
          value={shouldBounces}
          onValueChange={(value) => setShouldBounces(value)}
        />
        <Text style={{marginLeft: 20, marginRight: 5}}>horizontal: </Text>
        <Switch
          value={isHorizontal}
          onValueChange={(value) => setIsHorizontal(value)}
        />
      </View>
      <View>
        <ScrollView
            horizontal={isHorizontal}
            bounces={shouldBounces}
            style={{ width: 200, paddingHorizontal: 100 }}
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
        </ScrollView>
      </View>
      <View style={styles.itemTitle}>
        <Text>Vertical ScrollView</Text>
      </View>
      <View style={{marginLeft : 20}}>
        <Text>showScrollIndicator(Android): true vs false </Text>
        <Text>showsHorizontalScrollIndicator(iOS): true vs true </Text>
        <Text>showsVerticalScrollIndicator(iOS): true vs false </Text>
        <Text>scrollIndicatorInsets(iOS): '10, 10, 10, 10' vs null </Text>
      </View>
      <ScrollView horizontal={true}>
        <ScrollView
          horizontal={false}
          style={styles.verticalScrollView}
          contentContainerStyle={{ backgroundColor: 'lightgray' }}
          showScrollIndicator={true} // only Android support
          showsVerticalScrollIndicator={true} // only iOS support
          showsHorizontalScrollIndicator={true} // only iOS support
          scrollIndicatorInsets={{ top: 10, left: 10, bottom: 10, right: 10 }} // only iOS support
        >
          <Text style={styles.itemStyle}>A</Text>
          <Text style={styles.itemStyle}>B</Text>
          <Text style={styles.itemStyle}>C</Text>
          <Text style={styles.itemStyle}>D</Text>
          <Text style={styles.itemStyle}>E</Text>
          <Text style={styles.itemStyle}>F</Text>
          <Text style={styles.itemStyle}>A</Text>
        </ScrollView>
        <ScrollView
          horizontal={false}
          style={styles.verticalScrollView}
          contentContainerStyle={{ backgroundColor: 'lightgray' }}
          showScrollIndicator={false} // only Android support
          showsVerticalScrollIndicator={true} // only iOS support
          showsHorizontalScrollIndicator={false} // only iOS support
          // scrollIndicatorInsets={{ top: 10, left: 10, bottom: 10, right: 10 }} // only iOS support
        >
          <Text style={styles.itemStyle}>A</Text>
          <Text style={styles.itemStyle}>B</Text>
          <Text style={styles.itemStyle}>C</Text>
          <Text style={styles.itemStyle}>D</Text>
          <Text style={styles.itemStyle}>E</Text>
          <Text style={styles.itemStyle}>F</Text>
          <Text style={styles.itemStyle}>A</Text>
        </ScrollView>
      </ScrollView>
      <View style={styles.itemTitle}>
        <Text>Paging Enabled ScrollView </Text>
      </View>
      <View style={{margin : 10, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginRight: 5}}>paging: </Text>
        <Switch
          value={enablePaging}
          onValueChange={(value) => setEnablePaging(value)}
        />
      </View>
      <ScrollView
        bounces={false}
        horizontal={false}
        style={styles.verticalScrollView}
        contentContainerStyle={{ backgroundColor: 'orange' }}
        pagingEnabled={enablePaging}
      >
        <Text style={styles.itemStyle}>A</Text>
        <Text style={styles.itemStyle}>B</Text>
        <Text style={styles.itemStyle}>C</Text>
        <Text style={styles.itemStyle}>D</Text>
        <Text style={styles.itemStyle}>E</Text>
        <Text style={styles.itemStyle}>F</Text>
        <Text style={styles.itemStyle}>A</Text>
      </ScrollView>
    </ScrollView>
  );
}
