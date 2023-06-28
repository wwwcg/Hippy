import React from 'react';
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
} from '@hippy/react';

// Import the image to base64 for defaultSource props.
// import defaultSource from './defaultSource.jpg';
// import HippyLogoImg from './hippyLogoWhite.png';
import xsIssueImage from './iphone-xs-issue.png';

// const imageUrl = 'https://user-images.githubusercontent.com/12878546/148736102-7cd9525b-aceb-41c6-a905-d3156219ef16.png';

const styles = StyleSheet.create({
  container_style: {
    alignItems: 'center',
  },
  image_style: {
    width: 300,
    height: 280,
    margin: 16,
    // borderColor: '#4c9afa',
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderRadius: 4,
  },
  info_style: {
    marginTop: 15,
    marginLeft: 16,
    fontSize: 16,
    color: '#4c9afa',
  },
  img_result: {
    width: 300,
    marginTop: -15,
    marginLeft: 16,
    fontSize: 16,
    color: '#4c9afa',
    borderColor: '#4c9afa',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
  },
});

export default class ImageExpo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gifLoadResult: {},
    };
  }
  render() {
    // const { width: gifWidth, height: gifHeight, url: gifUrl } = this.state.gifLoadResult;

    return (
      <ScrollView style={styles.container_style}>
        <Text style={styles.info_style}>Default:</Text>
        <Image
          style={[styles.image_style]}
          source={{ uri: xsIssueImage }}
        />


      </ScrollView>
    );
  }
}
