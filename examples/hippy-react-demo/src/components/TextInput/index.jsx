import React, { Component } from 'react';
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  Text,
  Platform,
} from '@hippy/react';

const DEFAULT_VALUE = 'The 58-letter name Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is the name of a town on Anglesey, an island of Wales.';

const styles = StyleSheet.create({
  container_style: {
    padding: 10,
  },
  input_style: {
    fontSize: 12,
    width: 300,
    height: 36,
    backgroundColor: '#ccc',
    margin: 5,
  },
  input_style_block: {
    height: 100,
    lineHeight: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'gray',
    underlineColorAndroid: 'transparent',
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
  buttonBar: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  button: {
    height: 24,
    borderColor: '#4c9afa',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  buttonText: {
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

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
export default class TextInputExpo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiline: true,
      singlelineValue: 'singleline value',
      singlelineDefaultValue: 'singleline defaultValue',
      multilineValue: 'multiline\nvalue',
      multilineDefaultValue: 'multiline\nDefaultValue',
      keyboardType: undefined,
      count1: 0,
      count2: 0,
      endEditingEventText: '',
      textContent: '',
      returnKeyType: undefined,
      keyboardHeight: 0,
      lastKeyboardEvent: [],
    };
    this.changeInputContent = this.changeInputContent.bind(this);
  }

  changeKeyboardType(keyboardType) {
    this.setState({ keyboardType });
  }

  changeReturnKeyType(returnKeyType) {
    this.setState({ returnKeyType });
  }

  changeInputContent() {
    this.setState({
      textContent: `当前时间毫秒：${Date.now()}`,
    });
  }

  async onFocus() {
    const value = await this.input.isFocused();
    this.setState({
      event: 'onFocus',
      isFocused: value,
    });
  }

  async onBlur() {
    const value = await this.input.isFocused();
    this.setState({
      event: 'onBlur',
      isFocused: value,
    });
  }

  changeBreakStrategy(breakStrategy) {
    this.setState({ breakStrategy });
  }

  changeKeyboardEvent(eventName, keyboardHeight) {
    const { lastKeyboardEvent } = this.state;
    lastKeyboardEvent.push(eventName);
    this.setState({
      keyboardHeight,
      lastKeyboardEvent,
    })
  }

  render() {
    const {
      multiline,
      singlelineValue,
      singlelineDefaultValue,
      multilineValue,
      multilineDefaultValue,
      keyboardType,
      count1,
      count2,
      endEditingEventText,
      returnKeyType,
      keyboardHeight,
      lastKeyboardEvent,
    } = this.state;
    const { textContent, event, isFocused, breakStrategy } = this.state;
    const renderTitle = title => (
      <View style={styles.itemTitle}>
        <Text>{title}</Text>
      </View>
    );
    return (
      <ScrollView style={styles.container_style}>
        {renderTitle('multiline')}
        <View style={styles.itemContent}>
          <TextInput style={styles.input_style} multiline={true} defaultValue={'true\ntrue'} />
          <TextInput style={styles.input_style} multiline={false} defaultValue={'false\nfalse'} />
          <TextInput style={styles.input_style} defaultValue={'default\ndefault'} />
          <TextInput style={styles.input_style} multiline={multiline} defaultValue={`dynamic\n${multiline}`} />
          <TextInput style={styles.input_style} multiline={!multiline} defaultValue={`dynamic\n${!multiline}`} />
          <View style={styles.button} onClick={() => this.setState({ multiline: !multiline })}>
            <Text style={styles.buttonText}>change</Text>
          </View>
        </View>


        {Platform.OS === 'android' && renderTitle('caretColor（Android）')}
        {Platform.OS === 'android' && (
          <View style={styles.itemContent}>
            <Text>red</Text>
            <TextInput style={styles.input_style} caretColor={'red'} />
            <Text>default</Text>
            <TextInput style={styles.input_style} />
          </View>
        )}

        {renderTitle('value, defaultValue and onChangeText')}
        <View style={styles.itemContent}>
          <TextInput
            style={styles.input_style}
            value={multilineValue}
            onChangeText={text => this.setState({ multilineValue: text })}
          />
          <Text>value={multilineValue}</Text>
          <TextInput
            style={styles.input_style}
            value={singlelineValue}
            multiline={false}
            onChangeText={text => this.setState({ singlelineValue: text })}
          />
          <Text>value={singlelineValue}</Text>
          <TextInput
            style={styles.input_style}
            defaultValue={multilineDefaultValue}
            onChangeText={text => this.setState({ multilineDefaultValue: text })}
          />
          <Text>defalutValue={multilineDefaultValue}</Text>
          <TextInput
            style={styles.input_style}
            defaultValue={singlelineDefaultValue}
            multiline={false}
            onChangeText={text => this.setState({ singlelineDefaultValue: text })}
          />
          <Text>defalutValue={singlelineDefaultValue}</Text>
          <View style={styles.button} onClick={() => this.setState({
            multilineValue: multilineValue + 'append',
            singlelineValue: singlelineValue + 'append',
            multilineDefaultValue: multilineDefaultValue + 'append',
            singlelineDefaultValue: singlelineDefaultValue + 'append',
          })}>
            <Text style={styles.buttonText}>append</Text>
          </View>
        </View>

        {renderTitle('editable')}
        <View style={styles.itemContent}>
          <Text>multiline</Text>
          <TextInput style={styles.input_style} editable={true} defaultValue='true' />
          <TextInput style={styles.input_style} editable={false} defaultValue='false' />
          <TextInput style={styles.input_style} defaultValue='default' />
          <Text>singleline</Text>
          <TextInput style={styles.input_style} multiline={false} editable={true} defaultValue='true' />
          <TextInput style={styles.input_style} multiline={false} editable={false} defaultValue='false' />
          <TextInput style={styles.input_style} multiline={false} defaultValue='default' />
        </View>

        {renderTitle('keyboardType')}
        <View style={styles.itemContent}>
          <TextInput style={styles.input_style} multiline={true} defaultValue='multiline' keyboardType={keyboardType} />
          <TextInput style={styles.input_style} multiline={false} defaultValue='singleline' keyboardType={keyboardType} />
          <Text>keyboardType: {keyboardType || '默认值'}</Text>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeKeyboardType(undefined)}>
              <Text style={styles.buttonText}>默认值</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeKeyboardType('default')}>
              <Text style={styles.buttonText}>default</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeKeyboardType('numeric')}>
              <Text style={styles.buttonText}>numeric</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeKeyboardType('password')}>
              <Text style={styles.buttonText}>password</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeKeyboardType('email')}>
              <Text style={styles.buttonText}>email</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeKeyboardType('phone-pad')}>
              <Text style={styles.buttonText}>phone-pad</Text>
            </View>
          </View>
        </View>

        {renderTitle('maxLength')}
        <View style={styles.itemContent}>
          <TextInput
            style={styles.input_style}
            maxLength={10}
            onChangeText={text => this.setState({ count1: text.length })} />
          <Text>multiline {count1}/10</Text>
          <TextInput
            style={styles.input_style}
            multiline={false}
            maxLength={10}
            onChangeText={text => this.setState({ count2: text.length })} />
          <Text>singleline {count2}/10</Text>
        </View>

        {Platform.OS === 'android' && renderTitle('numberOfLines（Android）')}
        {Platform.OS === 'android' && (
          <View style={styles.itemContent}>
            <TextInput style={styles.input_style} numberOfLines={3} defaultValue='有height、有numberOfLines' />
            <TextInput style={[styles.input_style, { height: undefined }]} numberOfLines={3} defaultValue='无height、有numberOfLines' />
            <TextInput style={styles.input_style} defaultValue='有height、无numberOfLines' />
            <TextInput style={[styles.input_style, { height: undefined }]} defaultValue='无height、无numberOfLines' />
          </View>
        )}

        {renderTitle('onEndEditing and onSelectionChange')}
        <View style={{ flexDirection: 'row', height: 200 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input_style, { width: undefined }]}
              multiline={true} defaultValue='multiline'
              onEndEditing={e => this.setState({
                endEditingEventText: formatTime(new Date()) + ' onEndEditing\n' + formatEvent(e) + '\n' + endEditingEventText,
              })}
              onSelectionChange={e => this.setState({
                endEditingEventText: formatTime(new Date()) + ' onSelectionChange\n' + formatEvent(e) + '\n' + endEditingEventText,
              })} />
            <TextInput
              style={[styles.input_style, { width: undefined }]}
              multiline={false} defaultValue='singleline'
              onEndEditing={e => this.setState({
                endEditingEventText: formatTime(new Date()) + ' onEndEditing\n' + formatEvent(e) + '\n' + endEditingEventText,
              })}
              onSelectionChange={e => this.setState({
                endEditingEventText: formatTime(new Date()) + ' onSelectionChange\n' + formatEvent(e) + '\n' + endEditingEventText,
              })} />
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black' }}>
            <ScrollView>
              <Text style={{ fontSize: 9, fontFamily: 'monospace' }}>{endEditingEventText}</Text>
            </ScrollView>
          </View>
        </View>

        {renderTitle('placeHolder and placeholderTextColor')}
        <View style={styles.itemContent}>
          <Text>multiline</Text>
          <TextInput style={styles.input_style} />
          <TextInput style={styles.input_style} placeholder='placeHolder' />
          <TextInput style={styles.input_style} placeholder='placeHolder in red' placeholderTextColor='red' />
          <Text>singleline</Text>
          <TextInput style={styles.input_style} multiline={false} />
          <TextInput style={styles.input_style} multiline={false} placeholder='placeHolder' />
          <TextInput style={styles.input_style} multiline={false} placeholder='placeHolder in red' placeholderTextColor='red' />
        </View>

        {renderTitle('blur, focus, clear, isFocused')}
        <View style={styles.itemContent}></View>
        <TextInput
          ref={(ref) => {
            this.input = ref;
          }}
          style={styles.input_style}
          caretColor='yellow'
          underlineColorAndroid='grey'
          placeholderTextColor='#4c9afa'
          placeholder="text"
          defaultValue={textContent}
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
        />
        <Text style={styles.itemContent}>{`事件: ${event} | isFocused: ${isFocused}`}</Text>
        <View style={styles.buttonBar}>
          <View style={styles.button} onClick={this.changeInputContent}>
            <Text style={styles.buttonText}>点击改变输入框内容</Text>
          </View>
          <View style={styles.button} onClick={() => this.input?.focus()}>
            <Text style={styles.buttonText}>Focus</Text>
          </View>
          <View style={styles.button} onClick={() => this.input?.blur()}>
            <Text style={styles.buttonText}>Blur</Text>
          </View>
          <View style={styles.button} onClick={() => this.input?.clear()}>
            <Text style={styles.buttonText}>Clear</Text>
          </View>
        </View>

        {renderTitle('returnKeyType')}
        <View style={styles.itemContent}>
          <TextInput style={styles.input_style} multiline={true} defaultValue='multiline' returnKeyType={returnKeyType} />
          <TextInput style={styles.input_style} multiline={false} defaultValue='singleline' returnKeyType={returnKeyType} />
          <Text>returnKeyType: {returnKeyType || '默认值'}</Text>
          <View style={styles.buttonBar}>
            <View style={styles.button} onClick={() => this.changeReturnKeyType(undefined)}>
              <Text style={styles.buttonText}>默认值</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeReturnKeyType('done')}>
              <Text style={styles.buttonText}>done</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeReturnKeyType('go')}>
              <Text style={styles.buttonText}>go</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeReturnKeyType('next')}>
              <Text style={styles.buttonText}>next</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeReturnKeyType('search')}>
              <Text style={styles.buttonText}>search</Text>
            </View>
            <View style={styles.button} onClick={() => this.changeReturnKeyType('send')}>
              <Text style={styles.buttonText}>send</Text>
            </View>
          </View>
        </View>

        {Platform.OS === 'android' && renderTitle('breakStrategy')}
        {Platform.OS === 'android' && (
          <>
            <TextInput
              style={styles.input_style_block}
              breakStrategy={breakStrategy}
              defaultValue={DEFAULT_VALUE} />
            <Text style={{}}>{`breakStrategy: ${breakStrategy}`}</Text>
            <View style={styles.buttonBar}>
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
          </>
        )}

        {renderTitle('autoFocus and onKeyboardXxx')}
        <View style={styles.itemContent}>
          <TextInput
            style={styles.input_style}
            autoFocus={true}
            onKeyboardWillShow={({keyboardHeight}) => { this.changeKeyboardEvent('show', keyboardHeight) }}
            onKeyboardWillHide={() => { this.changeKeyboardEvent('hide', 0) }}
            onKeyboardHeightChanged={({keyboardHeight}) => { this.changeKeyboardEvent('change', keyboardHeight) }}
          />
          <Text>keyboardHeight={keyboardHeight} | lastEvent={lastKeyboardEvent.toString()}</Text>
          <View style={{ height: 260 }} />
        </View>
      </ScrollView>
    );
  }
}
