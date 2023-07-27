import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
} from '@hippy/react';

import imageUrl from './defaultSource.jpg';

const hippyBlue = '#4c9afa'
const styles = StyleSheet.create({
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
  rectangle: {
    width: 100,
    height: 80,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1
  },
  bigRectangle: {
    width: 200,
    height: 100,
    borderColor: '#eee',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 10,
    marginVertical: 10,
  },
  smallRectangle: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});

export default function ViewExpo() {
  const renderTitle = title => (
    <View style={styles.itemTitle}>
      <Text>{title}</Text>
    </View>
  );
  return (
    <ScrollView style={{ paddingHorizontal: 10 }}>
      {renderTitle('opacity : 0.0 vs 0.5 vs 1.0')}
      <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray' }}>
        <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} opacity={0.0} />
        <View style={[styles.rectangle, { backgroundColor: hippyBlue, marginLeft: 20 }]} opacity={0.5} />
        <View style={[styles.rectangle, { backgroundColor: hippyBlue, marginLeft: 20 }]} opacity={1.0} />
      </View>
      {renderTitle('overflow : default vs hidden vs visible')}
      <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray' }}>
        <View style={[styles.rectangle, { backgroundColor: 'orange', paddingLeft: 10 }]} >
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, opacity: 0.5 }]} />
        </View>
        <View style={[styles.rectangle, { backgroundColor: 'orange', marginLeft: 20, paddingLeft: 10, overflow: 'hidden' }]} >
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, opacity: 0.5 }]} />
        </View>
        <View style={[styles.rectangle, { backgroundColor: 'orange', marginLeft: 20, paddingLeft: 10, overflow: 'visible' }]} >
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, opacity: 0.5 }]} />
        </View>
      </View>
      {renderTitle('backgroundColor')}
      <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
      {renderTitle('backgroundImage')}
      <View style={[styles.rectangle, {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundImage: imageUrl,
      }]}
      accessible={true}
      accessibilityLabel={'背景图'}
      accessibilityRole={'image'}
      accessibilityState={{
        disabled: false,
        selected: true,
        checked: false,
        expanded: false,
        busy: true,
      }}
      accessibilityValue={{
        min: 1,
        max: 10,
        now: 5,
        text: 'middle',
      }}
    ><Text style={{ color: 'white' }}>背景图</Text></View>
      {renderTitle('backgroundImage linear-gradient')}
      <View style={[styles.rectangle, {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 2,
        backgroundImage: 'linear-gradient(30deg, blue 10%, yellow 40%, red 50%);',
      }]} ><Text style={{ color: 'white' }}>渐变色</Text></View>
      {renderTitle('border props')}
      <View style={[styles.rectangle, { borderColor: '#242424', borderRadius: 4, borderWidth: 1, borderStyle: 'solid' }]} />
      {renderTitle('flex props')}
      <View style={[styles.bigRectangle, {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }]}
      >
        <View style={[styles.smallRectangle, { backgroundColor: 'yellow' }]} />
        <View style={[styles.smallRectangle, { backgroundColor: 'blue' }]} />
        <View style={[styles.smallRectangle, { backgroundColor: 'green' }]} />
      </View>
    </ScrollView>
  );
}
