import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
} from '@hippy/react';

const imgURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAtCAMAAABmgJ64AAAAOVBMVEX/Rx8AAAD/QiL/Tif/QyH/RR//QiH/QiP/RCD/QSL/Qxz/QyH/QiL/QiD/QyL/QiL/QiH/QyH/QiLwirLUAAAAEnRSTlMZAF4OTC7DrWzjI4iietrRk0EEv/0YAAAB0UlEQVRYw72Y0Y6sIAxAKwUFlFH7/x97izNXF2lN1pU5D800jD2hJAJCdwYZuAUyVbmToKh903IhQHgErAVH+ccV0KI+G2oBPMxJgPA4WAigAT8F0IRDgNAE3ARyfeMFDGSc3YHVFkTBAHKDAgkEyHjacae/GTjxFqAo8NbakXrL9DRy9B+BCQwRcXR9OBKmEuAmAFFgcy0agBnIc1xZsMPOI5loAoUsQFmQjDEL9YbpaeGYBMGRKKAuqFEFL/JXApCw/zFEZk9qgbLGBx0gXLISxT25IUBREEgh1II1fph/IViGnZnCcDDVAgfgVg6gCy6ZaClySbDQpAl04vCGaB4+xGcFRK8CLvW0IBb5bQGqAlNwU4C6oEIVTLTcmoEr0AWcpKsZ/H0NAtkLQffnFjkOqiC/TTWBL9AFCwXQBHgI7rXImMgjCZwFa50s6DRBXyALmIECuMASiWNPFgRTgSJwM+XW8PDCmbwndzdaNL8FMYXPNjASDVChnIvWlBI/MKadPV952HszbmXtRERhhQ0vGFA52SVSSVt7MjHvxfRK8cdTpqovn02dUcltMrwiKf+wQ1FxXKCk9en6e/eDNnP44h2thQEb35O/etNv/q3iHza+KuhqqhZAAAAAAElFTkSuQmCC';
const imgURL2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA9QlZEMPc2Mmmj2VkLEJ4Rsx+pEgAAAChSURBVCjPjVLtEsMgCDOAdbbaNu//sttVPes+zvGD8wgQCLp/TORbUGMAQtQ3UBeSAMlF7/GV9Cmb5eTJ9R7H1t4bOqLE3rN2UCvvwpLfarhILfDjJL6WRKaXfzxc84nxAgLzCGSGiwKwsZUB8hPorZwUV1s1cnGKw+yAOrnI+7hatNIybl9Q3OkBfzopCw6SmDVJJiJ+yD451OS0/TNM7QnuAAbvCG0TSAAAAABJRU5ErkJggg==';
const imgURL3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEnRSTlMA/QpX7WQU2m27pi3Ej9KEQXaD5HhjAAAAqklEQVQoz41SWxLDIAh0RcFXTHL/yzZSO01LMpP9WJEVUNA9gfdXTioCSKE/kQQTQmf/ArRYva+xAcuPP37seFII2L7FN4BmXdHzlEPIpDHiZ0A7eIViPcw2QwqipkvMSdNEFBUE1bmMNOyE7FyFaIkAP4jHhhG80lvgkzBODTKpwhRMcexuR7fXzcp08UDq6GRbootp4oRtO3NNpd4NKtnR9hB6oaefweIFQU0EfnGDRoQAAAAASUVORK5CYII=';
const imgURL4 = 'https://user-images.githubusercontent.com/12878546/148736255-7193f89e-9caf-49c0-86b0-548209506bd6.gif';
const DEFAULT_VALUE = 'The 58-letter name Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is the name of a town on Anglesey, an island of Wales.';

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
  button_style: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 5,
    paddingHorizontal: 4,
  },
  itemContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  normalText: {
    fontSize: 14,
    lineHeight: 18,
    color: 'black',
  },
  textBlock: {
    width: 200,
    height: 30,
    lineHeight: 30,
    backgroundColor: '#ccc',
    margin: 5,
  },
  buttonBar: {
    flexDirection: 'row',
    marginTop: 10,
    flexGrow: 1,
  },
  button: {
    height: 24,
    borderColor: '#4c9afa',
    borderWidth: 1,
    borderStyle: 'solid',
    flexGrow: 1,
    flexShrink: 1,
  },
  buttonText: {
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  case_style: {
    marginTop: 10,
    marginLeft: 16,
  },
  title_style: {
    textAlign: 'center',
    fontSize: 12,
  },
  customFont: {
    color: '#0052d9',
    fontSize: 32,
    fontFamily: 'TTTGB',
  },
});

let i = 0;
export default class TextExpo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: 16,
      textShadowColor: 'green',
      textShadowOffset: {
        x: 3,
        y: 3,
      },
      breakStrategy: null,
      numberOfLines: 2,
      ellipsizeMode: null,
      opacity: .5,
      verticalAlign: null,
    };
    this.incrementFontSize = this.incrementFontSize.bind(this);
    this.decrementFontSize = this.decrementFontSize.bind(this);
  }

  changeNumberOfLines(delta) {
    const numberOfLines = Math.max(0, Math.min(this.state.numberOfLines + delta, 3));
    this.setState({ numberOfLines })
  }

  changeEllipsizeMode(ellipsizeMode) {
    this.setState({ ellipsizeMode });
  }

  changeBreakStrategy(breakStrategy) {
    this.setState({ breakStrategy });
  }

  changeOpacity(opacity) {
    this.setState({ opacity });
  }

  changeVerticalAlign(align) {
    this.setState({ verticalAlign: align });
  }

  incrementFontSize() {
    const { fontSize } = this.state;
    if (fontSize === 24) {
      return;
    }
    this.setState({
      fontSize: fontSize + 1,
    });
  }

  decrementFontSize() {
    const { fontSize } = this.state;
    if (fontSize === 6) {
      return;
    }
    this.setState({
      fontSize: fontSize - 1,
    });
  }

  render() {
    const {
      fontSize,
      textShadowColor,
      textShadowOffset,
      textShadowRadius,
      breakStrategy,
      numberOfLines,
      ellipsizeMode,
      opacity,
      verticalAlign,
    } = this.state;
    const renderTitle = title => (
      <View style={styles.itemTitle}>
        <Text style>{title}</Text>
      </View>
    );
    const verticalAlignAttr = verticalAlign ? { verticalAlign } : {}
    return (
      <ScrollView style={{ paddingHorizontal: 10 }}>
        {Platform.OS === 'ios' && renderTitle('adjustsFontSizeToFit and minimumFontScale（iOS）')}
        {Platform.OS === 'ios' && (
          <View style={[styles.itemContent, { flexDirection: 'column' }]}>
            <Text style={{ fontSize: 12 }}>adjustsFontSizeToFit=默认值 | minimumFontScale=默认值</Text>
            <Text
              style={[styles.textBlock, { fontSize: 50 }]}>
              Text to scale
            </Text>
            <Text style={{ fontSize: 12 }}>adjustsFontSizeToFit=true | minimumFontScale=默认值</Text>
            <Text
              style={[styles.textBlock, { fontSize: 50 }]}
              adjustsFontSizeToFit={true}>
              Text to scale
            </Text>
            <Text style={{ fontSize: 12 }}>adjustsFontSizeToFit=true | minimumFontScale=0.1</Text>
            <Text
              style={[styles.textBlock, { fontSize: 50 }]}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.1}>
              Text to scale
            </Text>
            <Text style={{ fontSize: 12 }}>adjustsFontSizeToFit=true | minimumFontScale=0.75</Text>
            <Text
              style={[styles.textBlock, { fontSize: 50 }]}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.75}>
              Text to scale
            </Text>
            <Text style={{ fontSize: 12 }}>adjustsFontSizeToFit=false | minimumFontScale=默认值</Text>
            <Text
              style={[styles.textBlock, { fontSize: 50 }]}
              adjustsFontSizeToFit={false}>
              Text to scale
            </Text>
          </View>
        )}

        {Platform.OS === 'ios' && renderTitle('allowFontScaling（iOS）')}
        {Platform.OS === 'ios' && (
          <View style={styles.itemContent}>
            <Text allowFontScaling={true}>true</Text>
            <Text allowFontScaling={false}>false</Text>
            <Text>default</Text>
          </View>
        )}

        {Platform.OS === 'android' && renderTitle('breakStrategy（Android）')}
        {Platform.OS === 'android' && (
          <View style={styles.itemContent}>
            <Text
              style={[styles.normalText, { borderWidth: 1, borderColor: 'gray', width: 300 }]}
              breakStrategy={breakStrategy}>
              {DEFAULT_VALUE}
            </Text>
            <Text style={styles.normalText}>{`breakStrategy: ${breakStrategy || '默认值'}`}</Text>
            <View style={styles.buttonBar}>
              <View style={styles.button} onClick={() => this.changeBreakStrategy(null)}>
                <Text style={styles.buttonText}>默认值</Text>
              </View>
              <View style={styles.button} onClick={() => this.changeBreakStrategy('simple')}>
                <Text style={styles.buttonText}>simple</Text>
              </View>
              <View style={styles.button} onClick={() => this.changeBreakStrategy('high_quality')}>
                <Text style={styles.buttonText}>high_quality</Text>
              </View>
              <View style={styles.button} onClick={() => this.changeBreakStrategy('balanced')}>
                <Text style={styles.buttonText}>balanced</Text>
              </View>
            </View>
          </View>
        )}

        {renderTitle('numberOfLines and ellipsizeMode')}
        <View style={[styles.itemContent]}>
          <Text style={[styles.normalText, { marginBottom: 10 }]}>
            {`numberOfLines=${numberOfLines || '默认值'} | ellipsizeMode=${ellipsizeMode || '默认值'}`}
          </Text>
          <Text
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            style={{
              backgroundColor: '#4c9afa',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              verticalAlign: 'middle',
              width: 300,
            }}>
            <Image style={{ width: 24, height: 24 }} source={{ uri: imgURL2 }} />
            <Text style={{ fontSize: 19, color: 'white' }}>大段富文本大段富文本大段富文本大段富文本</Text>
            <Text>大段富文本大段富文本大段富文本大段富文本大段富文本</Text>
            <Image style={{ width: 24, height: 24 }} source={{ uri: imgURL3 }} />
          </Text>
          <Text
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            style={{
              backgroundColor: '#4c9afa',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              color: 'white',
            }}>
            {'简单文本加换行\n\n简单文本加换行'}
          </Text>
          <Text
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            style={{
              backgroundColor: '#4c9afa',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              verticalAlign: 'middle',
            }}>
            <Text>图片加换行</Text>
            <Image style={{ width: 24, height: 24 }} source={{ uri: imgURL2 }} />
            <Text>{'\n'}</Text>
            <Image style={{ width: 24, height: 24 }} source={{ uri: imgURL3 }} />
            <Text>图片加换行</Text>
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={ellipsizeMode}
            style={{
              backgroundColor: '#4c9afa',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              lineHeight: 50,
              width: 160,
            }}>单行加大lineHeight、单行加大lineHeight</Text>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeNumberOfLines(1)}>
              <Text style={styles.buttonText}>加一行</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeNumberOfLines(-1)}>
              <Text style={styles.buttonText}>减一行</Text>
            </View>
          </View>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeEllipsizeMode(null)}>
              <Text style={styles.buttonText}>默认值</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeEllipsizeMode('clip')}>
              <Text style={styles.buttonText}>clip</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeEllipsizeMode('head')}>
              <Text style={styles.buttonText}>head</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeEllipsizeMode('middle')}>
              <Text style={styles.buttonText}>middle</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeEllipsizeMode('tail')}>
              <Text style={styles.buttonText}>tail</Text>
            </View>
          </View>
        </View>

        {Platform.OS === 'android' && renderTitle('enableScale（Android）')}
        {Platform.OS === 'android' && (
          <View style={[styles.itemContent, { flexDirection: 'column' }]}>
            <Text style={styles.textBlock} enableScale={true}>true</Text>
            <Text style={styles.textBlock} enableScale={false}>false</Text>
            <Text style={styles.textBlock}>default</Text>
          </View>
        )}

        {Platform.OS === 'ios' && renderTitle('isHighlighted（iOS）')}
        {Platform.OS === 'ios' && (
          <View style={styles.itemContent}>
            <Text isHighlighted={true}>true</Text>
            <Text isHighlighted={false}>false</Text>
            <Text>default</Text>
          </View>
        )}

        {renderTitle('opacity')}
        <View style={[styles.itemContent]}>
          <Text opacity={opacity}>Demo Text</Text>
          <Text>opacity={opacity == null ? '默认值' : opacity}</Text>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeOpacity(null)}>
              <Text style={styles.buttonText}>默认值</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeOpacity(0)}>
              <Text style={styles.buttonText}>0</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeOpacity(.5)}>
              <Text style={styles.buttonText}>.5</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeOpacity(1)}>
              <Text style={styles.buttonText}>1</Text>
            </View>
          </View>
        </View>

        {renderTitle('verticalAlign')}
        <View style={[styles.itemContent]}>
          <Text key={`${verticalAlign}`} {...verticalAlignAttr} style={[styles.textBlock, { height: 50, lineHeight: 50 }]}>
            <Text style={{ fontSize: 36 }}>大</Text>
            <Text style={{ fontSize: 24 }}>中</Text>
            <Text style={{ fontSize: 12 }}>小</Text>
          </Text>
          <Text>verticalAlign={verticalAlign || '默认值'}</Text>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeVerticalAlign(null)}>
              <Text style={styles.buttonText}>默认值</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeVerticalAlign('top')}>
              <Text style={styles.buttonText}>top</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeVerticalAlign('middle')}>
              <Text style={styles.buttonText}>middle</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeVerticalAlign('baseline')}>
              <Text style={styles.buttonText}>baseline</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeVerticalAlign('bottom')}>
              <Text style={styles.buttonText}>bottom</Text>
            </View>
          </View>
        </View>

        {renderTitle('嵌套 opacity')}
        <View style={[styles.itemContent]}>
          <Text style={styles.textBlock}>
            <Text>【</Text>
            <Text opacity={0}>0</Text>
            <Text>】【</Text>
            <Text opacity={0.5}>0.5</Text>
            <Text>】【</Text>
            <Text opacity={1}>1</Text>
            <Text>】</Text>
          </Text>
        </View>

        {renderTitle('嵌套 verticalAlign')}
        <View style={[styles.itemContent, { height: Platform.OS === 'android' ? 160 : 70 }]}>
          <Text style={[styles.normalText,
          { lineHeight: 50, backgroundColor: '#4c9afa', paddingHorizontal: 10, paddingVertical: 5 }]}>
            <Image style={{ width: 24, height: 24, verticalAlign: 'top' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 18, height: 12, verticalAlign: 'middle' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 12, verticalAlign: 'baseline' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 36, height: 24, verticalAlign: 'bottom' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'top' }} source={{ uri: imgURL4 }} />
            <Image style={{ width: 18, height: 12, verticalAlign: 'middle' }} source={{ uri: imgURL4 }} />
            <Image style={{ width: 24, height: 12, verticalAlign: 'baseline' }} source={{ uri: imgURL4 }} />
            <Image style={{ width: 36, height: 24, verticalAlign: 'bottom' }} source={{ uri: imgURL4 }} />
            <Text style={{ fontSize: 16, verticalAlign: 'top' }}>字</Text>
            <Text style={{ fontSize: 16, verticalAlign: 'middle' }}>字</Text>
            <Text style={{ fontSize: 16, verticalAlign: 'baseline' }}>字</Text>
            <Text style={{ fontSize: 16, verticalAlign: 'bottom' }}>字</Text>
          </Text>
          {Platform.OS === 'android' && (<>
            <Text>legacy mode:</Text>
            <Text style={[styles.normalText,
            { lineHeight: 50, backgroundColor: '#4c9afa', marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5 }]}>
              <Image style={{ width: 24, height: 24, verticalAlignment: 0 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 18, height: 12, verticalAlignment: 1 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 24, height: 12, verticalAlignment: 2 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 36, height: 24, verticalAlignment: 3 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 24, height: 24, top: -10 }} source={{ uri: imgURL4 }} />
              <Image style={{ width: 18, height: 12, top: -5 }} source={{ uri: imgURL4 }} />
              <Image style={{ width: 24, height: 12 }} source={{ uri: imgURL4 }} />
              <Image style={{ width: 36, height: 24, top: 3 }} source={{ uri: imgURL4 }} />
              <Text style={{ fontSize: 16 }}>字</Text>
              <Text style={{ fontSize: 16 }}>字</Text>
              <Text style={{ fontSize: 16 }}>字</Text>
              <Text style={{ fontSize: 16 }}>字</Text>
            </Text>
          </>)}
        </View>

        {renderTitle('嵌套 tintColor & backgroundColor')}
        <View style={[styles.itemContent]}>
          <Text style={[styles.normalText,
            { lineHeight: 30, backgroundColor: '#4c9afa', paddingHorizontal: 10, paddingVertical: 5 }]}>
            <Image style={{ width: 24, height: 24, verticalAlign: 'middle', tintColor: 'orange' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'middle', tintColor: 'orange', backgroundColor: '#ccc' }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'middle', backgroundColor: '#ccc' }} source={{ uri: imgURL2 }} />
            <Text style={{ verticalAlign: 'middle', backgroundColor: '#090' }}>text</Text>
          </Text>
        </View>

        {renderTitle('textShadow')}
        <View style={[styles.itemContent, { height: 60 }]} onClick={() => {
          let textShadowColor = 'red';
          let textShadowOffset = { x: 10, y: 1 };
          if (i % 2 === 1) {
            textShadowColor = 'grey';
            textShadowOffset = { x: 1, y: 1 };
          }
          i += 1;
          this.setState({
            textShadowColor,
            textShadowOffset,
          });
        }}>
          <Text style={[styles.normalText,
            { color: 'black',
              textShadowOffset,
              // support declaring textShadowOffsetX & textShadowOffsetY separately
              // textShadowOffsetX: 1,
              // textShadowOffsetY: 1,
              textShadowRadius: 3,
              textShadowColor,
            }]}>Text shadow is green with radius 3 and offset 3</Text>
        </View>

        {renderTitle('fontSize')}
        <View style={[styles.itemContent, { height: 101 }]}>
          <Text style={[styles.normalText, { fontSize }]}>
            { `Text fontSize is ${fontSize}` }
          </Text>
          <View style={styles.button} onClick={this.incrementFontSize}>
            <Text style={styles.buttonText}>放大字体</Text>
          </View>
          <View style={styles.button} onClick={this.decrementFontSize}>
            <Text style={styles.buttonText}>缩小字体</Text>
          </View>
        </View>

        {renderTitle('color')}
        <View style={[styles.itemContent, { height: 80 }]}>
          <Text style={[styles.normalText, { color: '#242424' }]}>Text color is black</Text>
          <Text style={[styles.normalText, { color: 'blue' }]}>Text color is blue</Text>
          <Text style={[styles.normalText, { color: 'rgb(228,61,36)' }]}>This is red</Text>
        </View>

        {renderTitle('fontStyle')}
        <View style={[styles.itemContent, { height: 100 }]}>
          <Text style={[styles.normalText, { fontStyle: 'normal' }]}>Text fontStyle is normal</Text>
          <Text style={[styles.normalText, { fontStyle: 'italic' }]}>Text fontStyle is italic</Text>
        </View>

        {renderTitle('fontWeight')}
        <View style={[styles.itemContent, { height: 100 }]}>
          <Text style={[styles.normalText, { fontWeight: 'normal' }]}>Text fontWeight is normal</Text>
          <Text style={[styles.normalText, { fontWeight: 'bold' }]}>Text fontWeight is bold</Text>
          <Text style={[styles.normalText, { fontWeight: '100' }]}>Text fontWeight is 100</Text>
          <Text style={[styles.normalText, { fontWeight: '200' }]}>Text fontWeight is 200</Text>
          <Text style={[styles.normalText, { fontWeight: '300' }]}>Text fontWeight is 300</Text>
        </View>

        {renderTitle('textDecoration')}
        <View style={[styles.itemContent, { height: 100 }]}>
          <Text numberOfLines={1} style={[styles.normalText, { textDecorationLine: 'underline', textDecorationColor: 'red' }]}>
            underline, red
          </Text>
          <Text numberOfLines={1} style={[styles.normalText, { textDecorationLine: 'underline', textDecorationStyle: 'dotted' }]}>
            underline，dotted
          </Text>
          <Text numberOfLines={1} style={[styles.normalText, { textDecorationLine: 'underline', textDecorationStyle: 'dashed' }]}>
            underline，dashed
          </Text>
          <Text numberOfLines={1} style={[styles.normalText, { textDecorationLine: 'line-through', textDecorationColor: 'red' }]}>
            line-through
          </Text>
          <Text numberOfLines={1} style={[styles.normalText, { textDecorationLine: 'underline line-through', textDecorationColor: 'red' }]}>
            underline line-through
          </Text>
        </View>

        {renderTitle('lineHeight')}
        <View style={[styles.itemContent, { height: 120 }]}>
            <Text numberOfLines={1} style={{ fontSize: 30, lineHeight: 10 }}>
                Text with lineHeight 20
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 30, lineHeight: 20 }}>
                Text with lineHeight 40
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 30, lineHeight: 30 }}>
                Text with lineHeight 60
            </Text>
        </View>

        {renderTitle('LetterSpacing')}
        <View style={[styles.itemContent, { height: 100 }]}>
          <Text numberOfLines={1} style={[styles.normalText, { letterSpacing: -1 }]}>
            Text width letter-spacing -1
          </Text>
          <Text numberOfLines={1} style={[styles.normalText, { letterSpacing: 5 }]}>
            Text width letter-spacing 5
          </Text>
        </View>

        {renderTitle('Custom font')}
        <View style={[styles.itemContent, { height: 100 }]}>
          <Text numberOfLines={1} style={styles.customFont}>Hippy 跨端框架</Text>
        </View>

        {renderTitle('margin')}
        <View style={[styles.itemContent]}>
          <Text style={[
            { lineHeight: 50, backgroundColor: '#4c9afa', marginBottom: 5 }]}>
            <Image style={{ width: 24, height: 24, verticalAlign: 'top', backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'middle', backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'baseline', backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
            <Image style={{ width: 24, height: 24, verticalAlign: 'bottom', backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
          </Text>
          {Platform.OS === 'android' && (<>
            <Text>legacy mode:</Text>
            <Text style={[styles.normalText,
              { lineHeight: 50, backgroundColor: '#4c9afa', marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5 }]}>
              <Image style={{ width: 24, height: 24, verticalAlignment: 0, backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 24, height: 24, verticalAlignment: 1, backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 24, height: 24, verticalAlignment: 2, backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
              <Image style={{ width: 24, height: 24, verticalAlignment: 3, backgroundColor: '#ccc', margin: 5 }} source={{ uri: imgURL2 }} />
            </Text>
          </>)}
        </View>
      </ScrollView>
    );
  }
}
