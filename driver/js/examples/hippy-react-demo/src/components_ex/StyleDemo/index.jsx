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
    marginVertical: 10,
  },
  rectangle: {
    width: 60,
    height: 30,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 30,
  },
  rectangleWithBackgroundColor: {
    width: 60,
    height: 30,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 30,
    backgroundColor: hippyBlue,
  },
  rectangleWithRedBorder: {
    width: 60,
    height: 30,
    fontSize: 12,
    borderColor: 'red',
    borderWidth: 1,
    textAlign: 'center',
    lineHeight: 30,
  },
  rectangleWithColourfulBorder: {
    width: 60,
    height: 30,
    fontSize: 12,
    borderTopColor: 'red',
    borderLeftColor: 'green',
    borderRightColor: 'purple',
    borderBottomColor: 'blue',
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
      {renderTitle('backgroundColor & backgroundImage')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithBackgroundColor, { marginLeft: 0 }]} />
        <View style={[styles.rectangle, {
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'black',
          borderRadius: 2,
          backgroundImage: 'linear-gradient(30deg, blue 10%, yellow 40%, red 50%);',
        }]} ><Text style={{ color: 'white' }}>渐变色</Text>
        </View>
        <View style={[styles.rectangle, {
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20,
          backgroundImage: demoImageUri2,
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
        ><Text style={{ color: 'white' }}>背景图</Text>
        </View>
      </View>
      {/*<View style={{ margin: 10, flexDirection: 'row' }} >*/}
      {/*  <Text style={[styles.rectangleWithBackgroundColor, { marginLeft: 0 }]} />*/}
      {/*  <Text style={[styles.rectangle, {*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*    marginLeft: 20,*/}
      {/*    borderWidth: 2,*/}
      {/*    borderStyle: 'solid',*/}
      {/*    borderColor: 'black',*/}
      {/*    borderRadius: 2,*/}
      {/*    backgroundImage: 'linear-gradient(30deg, blue 10%, yellow 40%, red 50%);',*/}
      {/*  }]} >*/}
      {/*    渐变色*/}
      {/*  </Text>*/}
      {/*  <Text style={[styles.rectangle, {*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*    marginLeft: 20,*/}
      {/*    backgroundImage: demoImageUri2,*/}
      {/*    color: 'white'*/}
      {/*  }]}>*/}
      {/*    背景图*/}
      {/*  </Text>*/}
      {/*</View>*/}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <Image style={[styles.rectangleWithBackgroundColor, { marginLeft: 0 }]} />
        <Image style={[styles.rectangle, {
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'black',
          borderRadius: 2,
          backgroundImage: 'linear-gradient(30deg, blue 10%, yellow 40%, red 50%);',
        }]} >
          <Text style={{ color: 'white' }}>渐变色</Text>
        </Image>
        <Image style={[styles.rectangle, {
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20,
          backgroundImage: demoImageUri2,
          color: 'white'
        }]}>
          <Text style={{ color: 'white' }}>背景图</Text>
        </Image>
      </View>

      {renderTitle('borderColor')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={ styles.rectangleWithRedBorder} />
        <View style={[styles.rectangleWithColourfulBorder, { marginLeft: 20 }]} />
        <Text style={[styles.rectangleWithColourfulBorder, { marginLeft: 20 }]} >文本</Text>
        <Image style={[styles.rectangleWithColourfulBorder, { marginLeft: 20 }]} source={{ uri: demoImageUri }} />
      </View>

      {renderTitle('borderRadius')}
      <View style={[styles.rectangleWithColourfulBorder, { borderRadius: 10, marginLeft: 10 }]} />
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithColourfulBorder, { borderTopLeftRadius: 20, marginLeft: 0 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderTopRightRadius: 20, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderBottomLeftRadius: 20, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderBottomRightRadius: 20, marginLeft: 20 }]} />
      </View>

      {renderTitle('borderWidth')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithColourfulBorder, { borderWidth: 0, marginLeft: 0 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderWidth: 1, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderWidth: 2, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderWidth: 3, marginLeft: 20 }]} />
      </View>
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithColourfulBorder, { borderTopWidth: 1, marginLeft: 0 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderLeftWidth: 2, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderBottomWidth: 3, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderRightWidth: 4, marginLeft: 20 }]} />
      </View>
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangle, { borderColor: 'red', borderTopWidth: 1, marginLeft: 0 }]} />
        <View style={[styles.rectangle, { borderColor: 'red', borderLeftWidth: 2, marginLeft: 20 }]} />
        <View style={[styles.rectangle, { borderColor: 'red', borderBottomWidth: 3, marginLeft: 20 }]} />
        <View style={[styles.rectangle, { borderColor: 'red', borderRightWidth: 4, marginLeft: 20 }]} />
      </View>
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithBackgroundColor, { borderColor: 'red', borderTopWidth: 1, marginLeft: 0 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { borderColor: 'red', borderLeftWidth: 2, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { borderColor: 'red', borderBottomWidth: 3, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { borderColor: 'red', borderRightWidth: 4, marginLeft: 20 }]} />
      </View>

      {renderTitle('borderStyle')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithRedBorder, { borderStyle: 'solid', marginLeft: 0 }]} />
        <View style={[styles.rectangleWithRedBorder, { borderStyle: 'dotted', marginLeft: 20 }]} />
        <View style={[styles.rectangleWithRedBorder, { borderStyle: 'dashed', marginLeft: 20 }]} />
      </View>
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithColourfulBorder, { borderStyle: 'solid', marginLeft: 0 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderStyle: 'dotted', marginLeft: 20 }]} />
        <View style={[styles.rectangleWithColourfulBorder, { borderStyle: 'dashed', marginLeft: 20 }]} />
      </View>

      {renderTitle('visibility')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithBackgroundColor, { visibility: 'hidden', marginLeft: 0 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { visibility: 'visible', marginLeft: 20 }]} />
      </View>

      {renderTitle('opacity')}
      <View style={{ margin: 10, flexDirection: 'row' }} >
        <View style={[styles.rectangleWithBackgroundColor, { opacity: 0, marginLeft: 0 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { opacity: 0.5, marginLeft: 20 }]} />
        <View style={[styles.rectangleWithBackgroundColor, { opacity: 1, marginLeft: 20 }]} />
      </View>

    </ScrollView>
  );
}
