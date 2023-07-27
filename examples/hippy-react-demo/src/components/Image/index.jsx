import React from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
} from '@hippy/react';

const url404 = 'https://example.org/404';
const png1 = 'https://user-images.githubusercontent.com/12878546/148736102-7cd9525b-aceb-41c6-a905-d3156219ef16.png';
const gif1 = 'https://user-images.githubusercontent.com/12878546/148736255-7193f89e-9caf-49c0-86b0-548209506bd6.gif';
// Import the image to base64
import png2 from './bubble.png';
import gif2 from './animate.gif'
// import apng1 from './ball.png'
import holderImg from './holder.png'
import apng1 from './iphone-xs-issue.png'

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
  container_style: {
    alignItems: 'center',
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
  image_style: {
    borderColor: '#4c9afa',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
  },
  info_style: {
    marginTop: 10,
    marginLeft: 16,
    fontSize: 16,
    color: '#4c9afa',
  },
  button_style: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 5,
    paddingHorizontal: 4,
  }
});

const bubbleInsets = {
  top: 6,
  left: 12,
  right: 12,
  bottom: 16,
};

function formatTime(d) {
  return `${d.getHours()}:${d.getMinutes()}:${(d.getSeconds() + d.getMilliseconds() / 1000).toFixed(3)}`;
}

function replacer(key, value) {
  if (typeof value === 'string') {
    return value.length > 100 ? value.substring(0, 99) + '…' : value;
  } else if (typeof value === 'object' && (key === 'target' || key === 'currentTarget')) {
    return `[${value.meta.component.name}:${value.nodeId}]`;
  }
  return value;
}

function formatEvent(e) {
  return JSON.stringify(e, replacer, 2);
}

function Case({ title, style, children }) {
  return <View style={typeof style === 'array' ? [styles.case_style, ...style] : [styles.case_style, style]}>
    {children}
    <Text style={styles.title_style}>{title}</Text>
  </View>
}

const renderTitle = title => (
  <View style={styles.itemTitle}>
    <Text style>{title}</Text>
  </View>
);

let prefetchUrl = null;
let loadStartTime = 0;

export default function ImageExpo() {
  const [reset, setReset] = React.useState(false);
  const [resizeUrl, setResizeUrl] = React.useState(png1);
  const [layoutEventText, setLayoutEventText] = React.useState('');
  const [[layoutWidth, layoutHeight], setLayoutSize] = React.useState([100, 75]);
  const [loadEventText, setLoadEventText] = React.useState('');
  const [loadEventUrl, setLoadEventUrl] = React.useState(png1);
  const [touchEventText, setTouchEventText] = React.useState('');
  const [getSizeText, setGetSizeText] = React.useState('');
  const [prefetchText, setPrefetchText] = React.useState('');
  const [fetchUrl, setFetchUrl] = React.useState(null);

  const getSize = url => Image.getSize(
    url,
    (w, h) => setGetSizeText(formatTime(new Date()) + ' success\nwidth=' + w + ' height=' + h + '\n' + getSizeText),
    (e) => setGetSizeText(formatTime(new Date()) + ' failure\n' + JSON.stringify(e) + '\n' + getSizeText)
  );

  return (
    <>
      <ScrollView style={styles.container_style}>
        {renderTitle('defaultSource & source')}
        <ScrollView horizontal={true}>
          <Case title='defaultSource'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={reset ? null : holderImg} />
          </Case>
          <Case title='png'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={holderImg}
              source={reset ? null : { uri: png1 }} />
          </Case>
          <Case title='gif'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={holderImg}
              source={reset ? null : { uri: gif2 }} />
          </Case>
          <Case title='apng'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={holderImg}
              source={reset ? null : { uri: apng1 }} />
          </Case>
          <Case title='soruce 404'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={holderImg}
              source={reset ? null : { uri: url404 }} />
          </Case>
        </ScrollView>

        {renderTitle('capInsets')}
        <View style={{ flexDirection: 'row' }}>
          <Case title='150x150'>
            <Image
              style={[styles.image_style, { width: 150, height: 150 }]}
              source={{ uri: png2 }}
              capInsets={reset ? null : bubbleInsets} />
          </Case>
          <Case title='75x150'>
            <Image
              style={[styles.image_style, { width: 75, height: 150 }]}
              source={{ uri: png2 }}
              capInsets={reset ? null : bubbleInsets} />
          </Case>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Case title='75x75'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              source={{ uri: png2 }}
              capInsets={reset ? null : bubbleInsets} />
          </Case>
          <Case title='defaultSource'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              defaultSource={holderImg}
              capInsets={reset ? null : bubbleInsets} />
          </Case>
        </View>

        {renderTitle('tintColor')}
        <ScrollView horizontal={true}>
          <Case title='png'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              tintColor={reset ? null : 'red'}
              source={{ uri: png2 }} />
          </Case>
          <Case title='gif'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              tintColor={reset ? null : 'red'}
              // defaultSource={holderImg}
              source={{ uri: gif2 }} />
          </Case>
          <Case title='apng'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              tintColor={reset ? null : 'red'}
              // defaultSource={holderImg}
              source={{ uri: apng1 }} />
          </Case>
          <Case title='defaultSource'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              tintColor={reset ? null : 'red'}
              defaultSource={holderImg} />
          </Case>
          <Case title='capInstes'>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              tintColor={reset ? null : 'red'}
              source={{ uri: png2 }}
              capInsets={bubbleInsets} />
          </Case>
        </ScrollView>

        {renderTitle('resizeMode')}
        <View style={{ flexDirection: 'row' }}>
          <Case title='cover'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              resizeMode={reset ? null : 'cover'}
              source={{ uri: resizeUrl }}
              defaultSource={holderImg} />
          </Case>
          <Case title='contain'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              resizeMode={reset ? null : 'contain'}
              source={{ uri: resizeUrl }}
              defaultSource={holderImg} />
          </Case>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Case title='stretch'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              resizeMode={reset ? null : 'stretch'}
              source={{ uri: resizeUrl }}
              defaultSource={holderImg} />
          </Case>
          <Case title='repeat'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              resizeMode={reset ? null : 'repeat'}
              source={{ uri: resizeUrl }}
              defaultSource={holderImg} />
          </Case>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Case title='center'>
            <Image
              style={[styles.image_style, { width: 150, height: 75 }]}
              resizeMode={reset ? null : 'center'}
              source={{ uri: resizeUrl }}
              defaultSource={holderImg} />
          </Case>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(png1) }}>png 1</Text>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(png2) }}>png 2</Text>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(gif1) }}>gif 1</Text>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(gif2) }}>gif 2</Text>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(apng1) }}>apng</Text>
          <Text style={styles.button_style} onClick={() => { setResizeUrl(null) }}>null</Text>
        </View>

        {renderTitle('onLayout')}
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1 }}>
            <Case title={`${layoutWidth}x${layoutHeight}`} style={{ width: 150, height: 150, borderWidth: 1, borderColor: 'black', alignItems: 'center' }}>
              <Image
                style={[styles.image_style, { width: layoutWidth, height: layoutHeight }]}
                source={{ uri: png1 }}
                defaultSource={holderImg}
                onLayout={e => setLayoutEventText(formatTime(new Date()) + ' onLayout\n' + formatEvent(e) + '\n' + layoutEventText)} />
            </Case>
            <Text
              style={styles.button_style}
              onClick={() => {
                setLayoutSize([Math.floor(Math.random() * 149) + 1, Math.floor(Math.random() * 119) + 1]);
              }}>
              resize
            </Text>
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{layoutEventText}</Text>
            </ScrollView>
          </View>
        </View>

        {renderTitle('onLoad, onLoadStart, onLoadEnd, onError, onProgress')}
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Case>
              <Image
                style={[styles.image_style, { width: 75, height: 75 }]}
                source={{ uri: loadEventUrl }}
                defaultSource={holderImg}
                onLoad={e => setLoadEventText(formatTime(new Date()) + ' onLoad\n' + formatEvent(e) + '\n' + loadEventText)}
                onLoadStart={e => setLoadEventText(formatTime(new Date()) + ' onLoadStart\n' + formatEvent(e) + '\n' + loadEventText)}
                onLoadEnd={e => setLoadEventText(formatTime(new Date()) + ' onLoadEnd\n' + formatEvent(e) + '\n' + loadEventText)}
                onError={e => setLoadEventText(formatTime(new Date()) + ' onError\n' + formatEvent(e) + '\n' + loadEventText)}
                onProgress={e => setLoadEventText(formatTime(new Date()) + ' onProgress\n' + formatEvent(e) + '\n' + loadEventText)}
              />
            </Case>
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{loadEventText}</Text>
            </ScrollView>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(png1) }}>png 1</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(png2) }}>png 2</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(gif1) }}>gif 1</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(gif2) }}>gif 2</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(apng1) }}>apng</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(url404) }}>404</Text>
          <Text style={styles.button_style} onClick={() => { setLoadEventUrl(null) }}>null</Text>
        </View>

        {renderTitle('手势事件')}
        <Text>onTouchDown, onTouchMove, onTouchEnd, onTouchCancel, onClick, onLongClick, onPressIn, onPressOut</Text>
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Case>
              <Image
                style={[styles.image_style, { width: 150, height: 100 }]}
                source={{ uri: png1 }}
                defaultSource={holderImg}
                onTouchDown={e => setTouchEventText(formatTime(new Date()) + ' onTouchDown\n' + formatEvent(e) + '\n' + touchEventText)}
                onTouchMove={e => setTouchEventText(formatTime(new Date()) + ' onTouchMove\n' + formatEvent(e) + '\n' + touchEventText)}
                onTouchEnd={e => setTouchEventText(formatTime(new Date()) + ' onTouchEnd\n' + formatEvent(e) + '\n' + touchEventText)}
                onTouchCancel={e => setTouchEventText(formatTime(new Date()) + ' onTouchCancel\n' + formatEvent(e) + '\n' + touchEventText)}
                onClick={e => setTouchEventText(formatTime(new Date()) + ' onClick\n' + formatEvent(e) + '\n' + touchEventText)}
                onLongClick={e => setTouchEventText(formatTime(new Date()) + ' onLongClick\n' + formatEvent(e) + '\n' + touchEventText)}
                onPressIn={e => setTouchEventText(formatTime(new Date()) + ' onPressIn\n' + formatEvent(e) + '\n' + touchEventText)}
                onPressOut={e => setTouchEventText(formatTime(new Date()) + ' onPressOut\n' + formatEvent(e) + '\n' + touchEventText)}
              />
            </Case>
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{touchEventText}</Text>
            </ScrollView>
          </View>
        </View>

        {renderTitle('getSize')}
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.button_style} onClick={() => getSize(png1)}>png 1</Text>
            <Text style={styles.button_style} onClick={() => getSize(gif1)}>gif 1</Text>
            <Text style={styles.button_style} onClick={() => getSize(url404)}>404</Text>
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{getSizeText}</Text>
            </ScrollView>
          </View>
        </View>

        {renderTitle('prefetch')}
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={[styles.image_style, { width: 75, height: 75 }]}
              source={{ uri: fetchUrl }}
              defaultSource={holderImg}
              onLoadStart={() => loadStartTime = Date.now()}
              onLoad={e => {
                if (e.url === fetchUrl) {
                  const now = Date.now();
                  setPrefetchText(formatTime(new Date()) + '\nload from ' + loadStartTime + ' to ' + now + ' cost=' + (now - loadStartTime) + 'ms\n' + prefetchText);
                }
              }}
            />
            <Text
              style={styles.button_style}
              onClick={() => {
                prefetchUrl = gif1 + '?_t=' + Date.now();
                setFetchUrl(null);
                setPrefetchText(formatTime(new Date()) + '\nnew url is ' + prefetchUrl + '\n' + prefetchText);
              }}>
              new url
            </Text>
            <Text
              style={styles.button_style}
              onClick={() => {
                Image.prefetch(prefetchUrl);
                setPrefetchText(formatTime(new Date()) + '\ncall prefetch ' + prefetchUrl + '\n' + prefetchText);
              }}>
              prefetch
            </Text>
            <Text
              style={styles.button_style}
              onClick={() => {
                setFetchUrl(prefetchUrl);
                setPrefetchText(formatTime(new Date()) + '\nset source ' + prefetchUrl + '\n' + prefetchText);
              }}>
              count time
            </Text>
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{prefetchText}</Text>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.button_style, { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 50, right: 0 }]}
        onClick={() => {
          setLayoutEventText('');
          setLoadEventText('');
          setTouchEventText('');
          setGetSizeText('');
          setReset(!reset);
        }}>
        <Text style={{ fontSize: 10 }}>reset:</Text>
        <Text style={{ fontSize: 10 }}>{reset.toString()}</Text>
      </View>
    </>
  );
}
