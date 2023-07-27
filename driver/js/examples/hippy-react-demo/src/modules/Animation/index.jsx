import React from 'react';
import {
  Animation,
  AnimationSet, Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from '@hippy/react';

const SKIN_COLOR = {
  mainLight: '#4c9afa',
  otherLight: '#f44837',
  textWhite: '#fff',
};

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
  container: {
    paddingHorizontal: 10,
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: SKIN_COLOR.otherLight,
  },
  showArea: {
    flexDirection: 'row',
    height: 80,
    marginVertical: 10,
  },
  button: {
    borderColor: SKIN_COLOR.mainLight,
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 30,
    borderRadius: 4,
    marginTop: 0,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 20,
    color: SKIN_COLOR.mainLight,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  colorText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginTop: 8,
  },
});

export default class AnimationExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.horizonAnimation = new Animation({
      startValue: 150, // 开始值
      toValue: 20, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 500, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数
      repeatCount: 'loop',
    });
    this.verticalAnimation = new Animation({
      startValue: 80, // 动画开始值
      toValue: 0, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      direction: 'top',
      repeatCount: 'loop',
    });
    this.verticalMoveAnimation = new Animation({
      startValue: 0, // 开始值
      toValue: -80, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数
      repeatCount: 'loop',
    });

    this.scaleAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 1,
            toValue: 1.2,
            duration: 3000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 1.2,
            toValue: 0.2,
            duration: 3000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });
    this.rotateAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 0,
            toValue: 180,
            duration: 2000,
            delay: 0,
            valueType: 'deg',
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 180,
            toValue: 360,
            duration: 2000,
            delay: 0,
            valueType: 'deg',
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });
    // iOS support skew animation after 2.14.1
    this.skewXAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 0,
            toValue: 20,
            duration: 2000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 20,
            toValue: 0,
            duration: 2000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });
    // iOS support skew animation after 2.14.1
    this.skewYAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 0,
            toValue: 20,
            duration: 2000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 20,
            toValue: 0,
            duration: 2000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });

    this.bgColorAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 'red',
            toValue: 'yellow',
            valueType: 'color', // 颜色动画需显式指定color单位
            duration: 3000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 'yellow',
            toValue: 'blue',
            duration: 3000,
            valueType: 'color',
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });

    this.bgColorAnimation2 = new Animation({
      startValue: 'rgba(60,60,60, 0.7)',
      toValue: '#FFFFFF',
      valueType: 'color', // 颜色动画需显式指定color单位
      duration: 3000,
      delay: 0,
      mode: 'timing',
      timingFunction: 'linear',
      repeatCount: 'loop',
    });

    // TODO iOS暂不支持文字颜色渐变动画
    this.txtColorAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 'white',
            toValue: 'red',
            valueType: 'color', // 颜色动画需显式指定color单位
            duration: 3000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: new Animation({
            startValue: 'red',
            toValue: 'white',
            duration: 3000,
            valueType: 'color',
            delay: 0,
            mode: 'timing',
            timingFunction: 'linear',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });

    // timingFunction cubic-bezier 范例
    this.cubicBezierScaleAnimationSet = new AnimationSet({
      children: [
        {
          animation: new Animation({
            startValue: 0,
            toValue: 1,
            duration: 3000,
            delay: 0,
            mode: 'timing',
            timingFunction: 'cubic-bezier(.45,2.84,.38,.5)',
          }),
          follow: false,
        },
        {
          animation: new Animation({
            startValue: 1,
            toValue: 0,
            duration: 3000,
            mode: 'timing',
            timingFunction: 'cubic-bezier(.17,1.45,.78,.14)',
          }),
          follow: true,
        },
      ],
      repeatCount: 'loop',
    });

    // Width+位移组合动画demo
    this.parentWidthAnimation = new Animation({
      startValue: 180, // 动画开始值
      toValue: 40, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.parentWidthAnimation2 = new Animation({
      startValue: 180, // 动画开始值
      toValue: 40, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.imageLeftMoveAnimation = new Animation({
      startValue: 0, // 动画开始值
      toValue: -70, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });

    // 宽度增加动画、高度增加动画、向右移动动画、向上移动动画
    this.getBiggerAnimation1 = new Animation({
      startValue: 40, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.getBiggerAnimation2 = new Animation({
      startValue: 40, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.moveRightAnimation = new Animation({
      startValue: 0, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.moveUpAnimation = new Animation({
      startValue: 0, // 动画开始值
      toValue: 80, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });

    this.bottomIconMarginLeftAnimation = new Animation({
      startValue: -30, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.bottomIconMarginBottomAnimation = new Animation({
      startValue: -30, // 动画开始值
      toValue: 80, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.bottomIconWidthAnimation = new Animation({
      startValue: 40, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear', // 动画缓动函数,
      repeatCount: 'loop',
    });
    this.bottomIconHeightAnimation = new Animation({
      startValue: 40, // 动画开始值
      toValue: 100, // 动画结束值
      duration: 3000, // 动画持续时长
      delay: 0, // 至动画真正开始的延迟时间
      mode: 'timing', // 动画模式
      timingFunction: 'linear',
      repeatCount: 'loop',
    });

    this.cardScaleAnimation = new Animation({
      startValue: 0,
      toValue: 1,
      duration: 3000,
      mode: 'timing',
      timingFunction: 'ease-in-out',
    });
    this.cardRotateYAnimation = new Animation({
      startValue: 180,
      toValue: 360,
      duration: 3000,
      valueType: 'deg',
      mode: 'timing',
      timingFunction: 'ease-in-out',
      repeatCount: 'loop',
    });
    this.cardRotateYAnimation2 = new Animation({
      startValue: 360,
      toValue: 360,
      duration: 1000000, // 非常大的值，保证不会执行结束
      delay: 0,
      valueType: 'deg',
      mode: 'timing',
      timingFunction: 'linear',
    });

    this.cardRotateAnimationSet = new AnimationSet({
      children: [
        {
          animation: this.cardRotateYAnimation,
          follow: false, // 配置子动画的执行是否跟随执行
        },
        {
          animation: this.cardRotateYAnimation2,
          follow: true,
        },
      ],
      repeatCount: 'none',
    });
  }


  componentDidMount() {
    //  动画参数的设置（只有转换web情况需要调用setRef方法）
    if (Platform.OS === 'web') {
      this.verticalAnimation.setRef(this.verticalRef);
      this.horizonAnimation.setRef(this.horizonRef);
      this.scaleAnimationSet.setRef(this.scaleRef);
      this.bgColorAnimationSet.setRef(this.bgColorRef);
      this.txtColorAnimationSet.setRef(this.textColorRef);
      this.txtColorAnimationSet.setRef(this.textColorRef);
      this.cubicBezierScaleAnimationSet.setRef(this.cubicBezierScaleRef);
      this.rotateAnimationSet.setRef(this.rotateRef);
      this.skewXAnimationSet.setRef(this.skewRef);
      this.skewYAnimationSet.setRef(this.skewRef);
    }
    this.horizonAnimation.onAnimationStart(() => {
      /* eslint-disable-next-line no-console */
      console.log('on animation start!!!');
    });
    this.horizonAnimation.onAnimationEnd(() => {
      /* eslint-disable-next-line no-console */
      console.log('on animation end!!!');
    });
    this.horizonAnimation.onAnimationCancel(() => {
      /* eslint-disable-next-line no-console */
      console.log('on animation cancel!!!');
    });
    this.horizonAnimation.onAnimationRepeat(() => {
      /* eslint-disable-next-line no-console */
      console.log('on animation repeat!!!');
    });
  }

  componentWillUnmount() { // 如果动画没有销毁，需要在此处保证销毁动画，以免动画后台运行耗电
    if (this.horizonAnimation) {
      this.horizonAnimation.destroy();
    }
    if (this.verticalAnimation) {
      this.verticalAnimation.destroy();
    }
    if (this.scaleAnimationSet) {
      this.scaleAnimationSet.destroy();
    }
    if (this.bgColorAnimationSet) {
      this.bgColorAnimationSet.destroy();
    }
    if (this.txtColorAnimationSet) {
      this.txtColorAnimationSet.destroy();
    }
    if (this.cubicBezierScaleAnimationSet) {
      this.cubicBezierScaleAnimationSet.destroy();
    }
    if (this.rotateAnimationSet) {
      this.rotateAnimationSet.destroy();
    }
    if (this.skewXAnimationSet) {
      this.skewXAnimationSet.destroy();
    }
    if (this.skewYAnimationSet) {
      this.skewYAnimationSet.destroy();
    }
  }

  render() {
    const renderTitle = title => (
      <View style={styles.itemTitle}>
        <Text>{title}</Text>
      </View>
    );
    return (
      <ScrollView style={styles.container}>
        {renderTitle('水平位移动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {this.horizonAnimation.start();}}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {this.horizonAnimation.pause();}}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {this.horizonAnimation.resume();}}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.horizonAnimation.updateAnimation({ startValue: 50, toValue: 100 });
          }}>
            <Text style={styles.buttonText}>更新</Text>
          </View>
        </View>
        <View style={styles.showArea}>
          <View
            ref={(ref) => {
              this.horizonRef = ref;
            }}
            style={[styles.square, {
              transform: [{
                translateX: this.horizonAnimation,
              }],
            }]}
          />
        </View>
        {renderTitle('高度形变动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            this.verticalAnimation.start();
            this.verticalMoveAnimation.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {this.verticalAnimation.pause();}}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {this.verticalAnimation.resume();}}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, {flexDirection: 'column', height: 200}]}>
          <View
            ref={(ref) => {
              this.verticalRef = ref;
            }}
            style={[styles.square, {
              height: this.verticalAnimation,
            }]}
          />
          <View style={{
            backgroundColor: 'green',
            width: 50,
            height: 50,
            // top: this.verticalMoveAnimation,
          }}
          ></View>
        </View>
        {renderTitle('旋转动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {this.rotateAnimationSet.start();}}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {this.rotateAnimationSet.pause();}}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {this.rotateAnimationSet.resume();}}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={styles.showArea}>
          <View
            ref={(ref) => {
              this.rotateRef = ref;
            }}
            style={[styles.square, {
              transform: [{
                rotate: this.rotateAnimationSet,
              }],
            }]}
          />
        </View>
        {renderTitle('倾斜动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            this.skewXAnimationSet.start();
            this.skewYAnimationSet.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {
            this.skewXAnimationSet.pause();
            this.skewYAnimationSet.pause();
          }}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.skewXAnimationSet.resume();
            this.skewYAnimationSet.resume();
          }}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={styles.showArea}>
          <View
            ref={(ref) => {
              this.skewRef = ref;
            }}
            style={[styles.square, {
              transform: [{
                skewX: this.skewXAnimationSet,
                skewY: this.skewYAnimationSet,
              }],
            }]}
          />
        </View>

        {renderTitle('缩放动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {this.scaleAnimationSet.start();}}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={styles.button} onClick={() => {this.scaleAnimationSet.pause();}}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {this.scaleAnimationSet.resume();}}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, { marginVertical: 20 }]}>
          <View
            ref={(ref) => {
              this.scaleRef = ref;
            }}
            style={[styles.square, {
              transform: [{
                scale: this.scaleAnimationSet,
              }],
            }]}
          />
        </View>

        {renderTitle('颜色渐变动画（文字渐变仅Android支持）')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            this.bgColorAnimationSet.start();
            this.txtColorAnimationSet.start();
            this.bgColorAnimation2.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {
            this.bgColorAnimationSet.pause();
            this.txtColorAnimationSet.pause();
            this.bgColorAnimation2.pause();
          }}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.bgColorAnimationSet.resume();
            this.txtColorAnimationSet.resume();
            this.bgColorAnimation2.resume();
          }}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, { marginVertical: 20 }]}>
          <View
            ref={(ref) => {
              this.bgColorRef = ref;
            }}
            style={[styles.square, {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.bgColorAnimationSet,
            }]}
          >
            <Text ref={(ref) => {this.textColorRef = ref;}} style={[styles.colorText, {
              color: this.txtColorAnimationSet, // TODO iOS暂不支持文字颜色渐变动画
            }]}>颜色渐变背景和文字</Text>
          </View>
          <View ref={(ref) => {
              this.bgColorRef = ref;
            }}
            style={[styles.square, {
              marginLeft: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.bgColorAnimation2,
            }]}
          ><Text ref={(ref) => {
            this.textColorRef = ref;
          }} style={styles.colorText}>灰色背景</Text></View>
        </View>

        {renderTitle('贝塞尔曲线动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {this.cubicBezierScaleAnimationSet.start();}}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {this.cubicBezierScaleAnimationSet.pause();}}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {this.cubicBezierScaleAnimationSet.resume();}}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, { marginVertical: 20 }]}>
          <View ref={(ref) => {
              this.cubicBezierScaleRef = ref;
            }}
            style={[styles.square, {
              transform: [{
                scale: this.cubicBezierScaleAnimationSet,
              }],
            }]}
          />
        </View>

        {renderTitle('宽度+位移组合动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            this.parentWidthAnimation.start();
            this.parentWidthAnimation2.start();
            this.imageLeftMoveAnimation.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {
            this.parentWidthAnimation.pause();
            this.parentWidthAnimation2.pause();
            this.imageLeftMoveAnimation.pause();
          }}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.parentWidthAnimation.resume();
            this.parentWidthAnimation2.resume();
            this.imageLeftMoveAnimation.resume();
          }}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, { height: 180, marginVertical: 20 }]}>
          <View style={{
            width: 180,
            height: 180,
            backgroundColor: '#ff0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View
              ref={(ref) => {
                this.verticalRef = ref;
              }}
              style={[styles.square, {
                width: this.parentWidthAnimation2,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }]}
            >
              <View style={{backgroundColor: 'pink', width: 180, height: 80}}>
                <Text style={{
                  backgroundColor: 'green',
                  color: '#fff',
                  fontSize: 20,
                  width: 160,
                  height: 60,
                }} >正常情况下我应该是固定不动的</Text>
              </View>
            </View>
          </View>
          <View style={{
            width: 180,
            height: 180,
            marginLeft: 10,
            backgroundColor: '#ff0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View
              ref={(ref) => {
                this.verticalRef = ref;
              }}
              style={[styles.square, {
                width: this.parentWidthAnimation,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }]}
            >
              <View style={{backgroundColor: 'pink', width: 180, height: 80}}>
                <Text style={{
                  backgroundColor: 'green',
                  color: '#fff',
                  fontSize: 20,
                  width: 160,
                  height: 60,
                  left: this.imageLeftMoveAnimation,
                }} >Hippy 2.x iOS兼容方案</Text>
              </View>
            </View>
          </View>
        </View>

        {renderTitle('宽高+位移组合动画2')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            this.getBiggerAnimation1.start();
            this.getBiggerAnimation2.start();
            this.moveUpAnimation.start();
            this.moveRightAnimation.start();
            this.bottomIconMarginLeftAnimation.start();
            this.bottomIconMarginBottomAnimation.start();
            this.bottomIconWidthAnimation.start();
            this.bottomIconHeightAnimation.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {
            this.getBiggerAnimation1.pause();
            this.getBiggerAnimation2.pause();
            this.moveUpAnimation.pause();
            this.moveRightAnimation.pause();
            this.bottomIconMarginLeftAnimation.pause();
            this.bottomIconMarginBottomAnimation.pause();
            this.bottomIconWidthAnimation.pause();
            this.bottomIconHeightAnimation.pause();
          }}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.getBiggerAnimation1.resume();
            this.getBiggerAnimation2.resume();
            this.moveRightAnimation.resume();
            this.moveUpAnimation.resume();
            this.bottomIconMarginLeftAnimation.resume();
            this.bottomIconMarginBottomAnimation.resume();
            this.bottomIconWidthAnimation.resume();
            this.bottomIconHeightAnimation.resume();
          }}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
        </View>
        <View style={[styles.showArea, { height: 180, marginVertical: 20, backgroundColor: '#ff0', }]}>
          <Text>一般写法</Text>
          <View style={[styles.square, {
            position: 'absolute',
            width: this.getBiggerAnimation1,
            height: this.getBiggerAnimation2,
            left: this.moveRightAnimation,
            bottom: this.moveUpAnimation,
          }]}/>
          <View style={{
            width: 100,
            height: 100,
            left: 100,
            bottom: 80,
            position: 'absolute',
            borderColor: '#f00',
            borderWidth: 1,
          }}/>
        </View>
        <View style={[styles.showArea, { height: 180, marginVertical: 20, backgroundColor: '#ff0', }]}>
          <Text>Hippy 2.x iOS兼容写法</Text>
          <View style={{ position: 'absolute', width: 100, height: 100,
            backgroundColor: 'green',
            justifyContent: 'center',
            alignItems: 'center',
            left: this.bottomIconMarginLeftAnimation,
            bottom: this.bottomIconMarginBottomAnimation,
          }}>
            <View style={[styles.square, {
              position: 'absolute',
              width: this.bottomIconWidthAnimation,
              height: this.bottomIconHeightAnimation,
              // left: this.moveRightAnimation,
              // bottom: this.moveUpAnimation,
            }]}/>
          </View>
          <View style={{
            width: 100,
            height: 100,
            left: 100,
            bottom: 80,
            position: 'absolute',
            borderColor: '#f00',
            borderWidth: 1,
          }}/>
        </View>

        {renderTitle('旋转+缩放组合动画')}
        <View style={styles.buttonContainer}>
          <View style={styles.button} onClick={() => {
            // this.cardRotateYAnimation.start();
            // this.cardScaleAnimation.start();
            this.cardRotateYAnimation2.updateAnimation({
              startValue: 360,
              toValue: 360,
              duration: 1000000, // 非常大的值，保证不会执行结束
              valueType: 'deg',
              mode: 'timing',
              timingFunction: 'linear',
            });
            this.cardRotateAnimationSet.start();
          }}>
            <Text style={styles.buttonText}>开始</Text>
          </View>
          <View style={[styles.button]} onClick={() => {
            this.cardRotateYAnimation.pause();
            this.cardScaleAnimation.pause();
            this.cardRotateAnimationSet.pause();
          }}>
            <Text style={styles.buttonText}>暂停</Text>
          </View>
          <View style={styles.button} onClick={() => {
            this.cardRotateYAnimation.resume();
            this.cardScaleAnimation.resume();
            this.cardRotateAnimationSet.resume();
          }}>
            <Text style={styles.buttonText}>继续</Text>
          </View>
          <View style={styles.button} onClick={() => {
            // this.cardRotateYAnimation.destroy();
            // this.cardScaleAnimation.destroy();
            // this.cardRotateAnimationSet.destroy();
            this.cardRotateYAnimation2.updateAnimation({
              startValue: 360,
              toValue: 360,
              duration: 1,
              valueType: 'deg',
              mode: 'timing',
              timingFunction: 'linear',
            });
          }}>
            <Text style={styles.buttonText}>重置</Text>
          </View>
        </View>
        <View style={[styles.showArea, { height: 180, marginVertical: 20, backgroundColor: '#ff0', }]}>
          <View style={[styles.square, {
            // position: 'absolute',
            adjustSelf: 'center',
            width: 100,
            height: 150,
            transform: [
              {
                // scale: this.cardScaleAnimation,
                // rotateY: this.cardRotateYAnimation,
                rotateY: this.cardRotateAnimationSet,
              },
            ],
          }]}/>
        </View>
      </ScrollView>
    );
  }
}
