import React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet, Image,
} from '@hippy/react';
import demoImageUri from '../../components/Image/ball.png';
import demoImageUri2 from '../../components/View/defaultSource.jpg';

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
    width: 60,
    height: 30,
    fontSize: 12,
    borderColor: 'white',
    borderWidth: 1,
    textAlign: 'center',
    lineHeight: 30,
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
      {renderTitle('alignItems')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={styles.rectangle} >default: </Text>
        <Text style={styles.rectangle} >flex-start: </Text>
        <Text style={styles.rectangle} >flex-end: </Text>
        <Text style={styles.rectangle} >center: </Text>
        <Text style={styles.rectangle} >stretch: </Text>
        <Text style={styles.rectangle} >baseline: </Text>
      </View>
      <View style={{ height: 50, flexDirection: 'row', backgroundColor: 'lightgray'}}>
        <View style={{ height: 50, flexDirection: 'row', }}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'flex-start'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'stretch'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'baseline'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
      </View>

      {renderTitle('alignSelf')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={styles.rectangle} >default: </Text>
        <Text style={styles.rectangle} >flex-start: </Text>
        <Text style={styles.rectangle} >flex-end: </Text>
        <Text style={styles.rectangle} >center: </Text>
        <Text style={styles.rectangle} >stretch: </Text>
        <Text style={styles.rectangle} >baseline: </Text>
      </View>
      <View style={{ height: 50, flexDirection: 'row', backgroundColor: 'lightgray'}}>
        <View style={{ height: 50, flexDirection: 'row', }}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, alignSelf: 'flex-start' }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, alignSelf: 'flex-end' }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, alignSelf: 'center' }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, alignSelf: 'stretch' }]} />
        </View>
        <View style={{ height: 50, flexDirection: 'row'}}>
          <View style={[styles.rectangle, { backgroundColor: hippyBlue, alignSelf: 'baseline' }]} />
        </View>
      </View>

      {renderTitle('flex')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ flex: 1, backgroundColor: hippyBlue}} > 1 </Text>
        <Text style={{ flex: 2, backgroundColor: 'orange'}} > 2 </Text>
        <Text style={{ flex: 1, backgroundColor: 'green'}} > 1 </Text>
      </View>

      {renderTitle('flexBasis')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ flexBasis: 200, backgroundColor: hippyBlue}} > flexBasis: 200 </Text>
        <Text style={{ flex: 1, backgroundColor: 'orange'}} > 2 </Text>
        <Text style={{ flex: 1, backgroundColor: 'green'}} > 1 </Text>
      </View>

      {renderTitle('flexDirection')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ flex: 1, backgroundColor: hippyBlue}} > row 1 </Text>
        <Text style={{ flex: 2, backgroundColor: 'orange'}} > row 2 </Text>
        <Text style={{ flex: 3, backgroundColor: 'green'}} > row 3 </Text>
      </View>
      <View style={{ flexDirection: 'column', backgroundColor: 'darkgray'}}>
        <Text style={{ flex: 1, backgroundColor: hippyBlue}} > column 1 </Text>
        <Text style={{ flex: 1, backgroundColor: 'orange'}} > column 2 </Text>
        <Text style={{ flex: 1, backgroundColor: 'green'}} > column 3 </Text>
      </View>
      <View style={{ flexDirection: 'column-reverse', backgroundColor: 'darkgray'}}>
        <Text style={{ flex: 1, backgroundColor: hippyBlue}} > column-reverse 1 </Text>
        <Text style={{ flex: 1, backgroundColor: 'orange'}} > column-reverse 2 </Text>
        <Text style={{ flex: 1, backgroundColor: 'green'}} > column-reverse 3 </Text>
      </View>

      {renderTitle('flexWrap')}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > 1 </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > 2 </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > 3 </Text>
        <Text style={{ width: 100, backgroundColor: 'red'}} > 4 </Text>
        <Text style={{ width: 100, backgroundColor: 'yellow'}} > 5 </Text>
        <Text style={{ width: 100, backgroundColor: 'pink'}} > 6 </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'nowrap', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > 1 </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > 2 </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > 3 </Text>
        <Text style={{ width: 100, backgroundColor: 'red'}} > 4 </Text>
        <Text style={{ width: 100, backgroundColor: 'yellow'}} > 5 </Text>
        <Text style={{ width: 100, backgroundColor: 'pink'}} > 6 </Text>
      </View>

      {/*flexGrow*/}
      {renderTitle('flexGrow')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 50, flexGrow: 1, backgroundColor: hippyBlue}} > width: 50, flexGrow 1 </Text>
        <Text style={{ width: 50, flexGrow: 2, backgroundColor: 'orange'}} > width: 50, flexGrow 2 </Text>
        <Text style={{ width: 50, backgroundColor: 'green'}} > width 50 </Text>
      </View>

      {/*flexShrink*/}
      {renderTitle('flexShrink')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 200, flexShrink: 1, backgroundColor: hippyBlue}} > width: 200, flexShrink 1 </Text>
        <Text style={{ width: 200, flexShrink: 2, backgroundColor: 'orange'}} > width: 200, flexShrink 2 </Text>
        <Text style={{ width: 200, backgroundColor: 'green'}} > width 200 </Text>
      </View>

      {renderTitle('justifyContent')}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > flex-start </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > flex-start </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > flex-start </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > flex-end </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > flex-end </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > flex-end </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > center </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > center </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > center </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > space-between </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > space-between </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > space-between </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > space-around </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > space-around </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > space-around </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, backgroundColor: hippyBlue}} > space-evenly </Text>
        <Text style={{ width: 100, backgroundColor: 'orange'}} > space-evenly </Text>
        <Text style={{ width: 100, backgroundColor: 'green'}} > space-evenly </Text>
      </View>

      {/*position: 'absolute',*/}
      {renderTitle('position: absolute')}
      <View style={{ width: 200, height: 200, backgroundColor: 'darkgray' }}>
        <Text style={{ width: 100, height: 100, backgroundColor: 'orange', position: 'relative'}} > 1 </Text>
        <Text style={{ width: 100, height: 100, backgroundColor: 'green'}} > 2 </Text>
        <Text style={{ top: 50, left: 50, width: 100, height: 100,
          backgroundColor: hippyBlue, position: 'absolute'}} > 3 </Text>
      </View>

      {/*backgroundSize*/}
      {renderTitle('backgroundSize: default vs cover vs contain')}
      <View style={{ flexDirection: 'row'}}>
        <View style={{
          backgroundImage: demoImageUri,
          // backgroundSize: 'cover',
          width: 150,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
        <View style={{
          backgroundImage: 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
          // backgroundSize: 'cover',
          marginLeft: 10,
          width: 150,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <View style={{
          backgroundImage: demoImageUri2,
          backgroundSize: 'cover',
          width: 100,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
        <View style={{
          backgroundImage: 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
          backgroundSize: 'cover',
          marginLeft: 10,
          width: 100,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <View style={{
          backgroundImage: demoImageUri2,
          backgroundSize: 'contain',
          width: 100,
          height: 150,
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
        <View style={{
          backgroundImage: 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
          backgroundSize: 'contain',
          marginLeft: 10,
          width: 100,
          height: 150,
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
      </View>

      {/*backgroundPositionX & backgroundPositionY*/}
      {renderTitle('backgroundPositionX & backgroundPositionY')}
      <View style={{ flexDirection: 'row'}}>
        <View style={{
          backgroundImage: demoImageUri2,
          backgroundPositionX: 0,
          // backgroundPositionY: 50,
          backgroundSize: 'cover',
          width: 150,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
        <View style={{
          backgroundImage: demoImageUri,
          backgroundPositionY: 100,
          marginLeft: 10,
          width: 150,
          height: 150,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'orange',
        }}/>
      </View>

      {renderTitle('maxWidth & maxHeight & minWidth & minHeight')}
      <View style={{ flexDirection: 'row',  backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, height: 100, backgroundColor: hippyBlue}} >width: 100; height: 100</Text>
        <Text style={{ maxWidth: 50, maxHeight: 50, backgroundColor: 'orange'}} >maxWidth: 50; maxHeight: 50</Text>
        <Text style={{ minWidth: 20, minHeight: 20, backgroundColor: 'green'}} >minWidth: 20; minHeight: 20</Text>
      </View>

      {/*textAlign*/}
      {renderTitle('textAlign')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, height: 100, backgroundColor: hippyBlue, textAlign: 'left'}} >textAlign: left</Text>
        <Text style={{ width: 100, height: 100, backgroundColor: 'orange', textAlign: 'center'}} >textAlign: center</Text>
        <Text style={{ width: 100, height: 100, backgroundColor: 'green', textAlign: 'right'}} >textAlign: right</Text>
      </View>

      {/*lineHeight*/}
      {renderTitle('lineHeight')}
      <View style={{ flexDirection: 'row', backgroundColor: 'darkgray'}}>
        <Text style={{ width: 100, height: 100, backgroundColor: hippyBlue, lineHeight: 20}} >lineHeight: 20</Text>
        <Text style={{ width: 100, height: 100, backgroundColor: 'orange', lineHeight: 50}} >lineHeight: 50</Text>
        <Text style={{ width: 100, height: 100, backgroundColor: 'green', lineHeight: 100}} >lineHeight: 100</Text>
      </View>

      {/*zIndex*/}
      {renderTitle('zIndex')}
      <View style={{ height: 150, flexDirection: 'row', backgroundColor: 'darkgray'  }}>
        <Text style={{ width: 100, height: 100, backgroundColor: hippyBlue, zIndex: 3, position: 'absolute'}} >View1 zIndex: 3</Text>
        <Text style={{ top: 25, left: 25, width: 100, height: 100, backgroundColor: 'orange', zIndex: 2, position: 'absolute'}} >View2 zIndex: 2</Text>
        <Text style={{ top: 50, left: 50, width: 100, height: 100, backgroundColor: 'green', zIndex: 1, position: 'absolute'}} >View3 zIndex: 1</Text>
      </View>

      {renderTitle('测试布局浮点数取整')}
      <View style={{ height: 1000, flexDirection: 'column', backgroundColor: 'white'  }}>
        <View style={{ height: 100.1, backgroundColor: 'black'}} >
            <Text style={{color: 'white'}}>100.1</Text>
        </View>
        <View style={{ height: 100.2, backgroundColor: 'black'}} >
            <Text style={{color: 'white'}}>100.2</Text>
        </View>
        <View style={{ height: 100.3, backgroundColor: 'black'}} >
            <Text style={{color: 'white'}}>100.3</Text>
        </View>
          <View style={{ height: 100.4, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.4</Text>
          </View>
          <View style={{ height: 100.5, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.5</Text>
          </View>
          <View style={{ height: 100.6, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.6</Text>
          </View>
          <View style={{ height: 100.7, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.7</Text>
          </View>
          <View style={{ height: 100.8, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.8</Text>
          </View>
          <View style={{ height: 100.9, backgroundColor: 'black'}} >
              <Text style={{color: 'white'}}>100.9</Text>
          </View>
      </View>
    </ScrollView>
  );
}
