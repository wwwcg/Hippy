import React, { Component } from 'react';
import {
  ConsoleModule,
} from '@hippy/react';
import HomeEntry from './pages/entry';
import ContainerView from './shared/ContainerView';
import { callNative, callNativeWithPromise } from "@hippy/react"

export default class App extends Component {
  componentDidMount() {
    ConsoleModule.log('~~~~~~~~~~~~~~~~~ This is a log from ConsoleModule ~~~~~~~~~~~~~~~~~');

    callNative("bridge", "foo", "111")
  }

  render() {
    return (
      <ContainerView>
        <HomeEntry />
      </ContainerView>
    );
  }
}
