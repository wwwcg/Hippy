import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ConsoleModule,
} from '@hippy/react';
import HomeEntry from './pages/entry';
import Entry2 from './pages/entry2';
import RemoteDebug from './pages/remote-debug';
import SafeAreaView from './shared/SafeAreaView';
// import VConsole from '@tencent/hippy-react-vconsole'
import Utils from "./utils";

const styles = StyleSheet.create({
  buttonContainer: {
    height: Utils.isiPhoneX() ? 48 + 30 : 48 ,
    backgroundColor: '#e6e6e6',
    flexDirection: 'row',
  },
  button: {
    height: 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#eee',
  },
  buttonText: {
    color: '#242424',
    fontSize: 16,
  },
  blankPage: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      pageIndex: 0,
    });
  }

  componentDidMount() {
    ConsoleModule.debug('~~~~~~~~~~~~~~~~~ This is a debug log from ConsoleModule ~~~~~~~~~~~~~~~~~');
    ConsoleModule.warn('~~~~~~~~~~~~~~~~~ This is a warn log from ConsoleModule ~~~~~~~~~~~~~~~~~');
    ConsoleModule.info('~~~~~~~~~~~~~~~~~ This is a info log from ConsoleModule ~~~~~~~~~~~~~~~~~');
    ConsoleModule.error('~~~~~~~~~~~~~~~~~ This is a error log from ConsoleModule ~~~~~~~~~~~~~~~~~');
    ConsoleModule.log('~~~~~~~~~~~~~~~~~ This is a normal log from ConsoleModule ~~~~~~~~~~~~~~~~~');
  }

  render() {
    const { pageIndex } = this.state;
    const { __instanceId__: instanceId } = this.props;

    const renderPage = () => {
      switch (pageIndex) {
        case 0:
          return <HomeEntry />;
        case 1:
          return <Entry2 />;
        case 2:
          return <RemoteDebug instanceId={instanceId} />;
        default:
          return <View style={styles.blankPage} />;
      }
    };

    const renderButton = () => {
      const buttonArray = ['基础组件', '扩展组件及模块', '调试'];
      return (
        buttonArray.map((text, i) => (
          <View
            key={`button_${i}`}
            style={styles.button}
            onClick={() => this.setState({ pageIndex: i })}
          >
            <Text
              style={[styles.buttonText, i === pageIndex ? { color: '#4c9afa' } : null]}
              numberOfLines={1}
            >
              {text}
            </Text>
          </View>
        ))
      );
    };

    return (
      <SafeAreaView statusBarColor="#4c9afa">
        {renderPage()}
        <View style={styles.buttonContainer}>
          {renderButton()}
        </View>
        {/*<VConsole />*/}
      </SafeAreaView>
    );
  }
}
