# Hippy iOS 3.x SDK集成指引

这篇教程，讲述了如何将 Hippy 3.x SDK 集成到一个现有的 iOS 工程。

> 注：以下文档都是假设您已经具备一定的 iOS 开发经验。

---

## 一、环境准备

- 安装 Xcode

- 安装 [CMake](https://cmake.org/)

  推荐使用Homebrew安装CMake，安装命令如下：

  ```shell
  brew install cmake
  ```

- 安装 [CocoaPods](https://cocoapods.org/)
  
  [CocoaPods](https://cocoapods.org/) 是一个iOS和macOS开发中流行的包管理工具。我们将使用它把Hippy的iOS Framework添加到现有iOS项目中。

  推荐使用Homebrew安装CocoaPods，安装命令如下：

  ```shell
  brew install cocoapods
  ```

 > 若想快速体验，可以直接基于Hippy仓库中的 [iOS Demo](https://github.com/Tencent/Hippy/tree/main/framework/examples/ios-demo) 来开发

## 二、使用 Cocoapods 集成 iOS SDK

具体的操作步骤如下：

1. 首先，确定要集成的Hippy iOS SDK版本，如3.2.0，将其记录下来，接下来将在Podfile中用到。
   > 可到「[版本查询地址](https://github.com/Tencent/Hippy/releases)」查询最新的版本信息

2. 其次，准备好现有iOS工程的 Podfile 文件

    Podfile 文件是CocoaPods包管理工具的配置文件，如果当前工程还没有该文件，最简单的创建方式是通过CocoaPods init命令，在iOS工程文件目录下执行如下命令：

    ```shell
    pod init
    ```

    生成的Podfile将包含一些demo设置，您可以根据集成的目的对其进行调整。

    为了将Hippy SDK集成到工程，我们需要修改Podfile，将 hippy 添加到其中，并指定集成的版本。修改后的Podfile应该看起来像这样:

    ```text
    #use_frameworks!
    platform :ios, '11.0'

    # TargetName大概率是您的项目名称
    target TargetName do

        # 在此指定步骤1中记录的hippy版本号，可访问 https://github.com/Tencent/Hippy/releases 查询更多版本信息
        pod 'hippy', '3.3.0'

    end
    ```

    > 请注意，动态库方式接入 `"3.0.0-beta" ~ "3.2.0-beta"` 版本的 `beta版` Hippy iOS SDK 时需在 `Podfile` 添加 `ENV["use_frameworks"]` 环境变量，`"3.3.0"` 版本起已无需添加，如已添加可直接移除。

    > 默认配置下，Hippy SDK使用布局引擎是[Taitank](https://github.com/Tencent/Taitank)，JS引擎是系统的`JavaScriptCore`，如需切换使用其他引擎，请参照下文[《引擎切换（可选）》](#四引擎切换可选)一节调整配置。

3. 最后，在命令行中执行

    ```shell
    pod install
    ```

    > 请注意，由于 `hippy.podspec` 中依赖 `CMake` 编译部分 `C++` 模块，因此请确保您的开发环境已经正确配置。具体来说，您需要确保已经安装了 `Xcode` 命令行工具。可以在命令行中执行如下指令来安装必要的工具：

    ```shell
    sudo xcode-select --install
    sudo xcode-select --reset
    ```

    命令成功执行后，使用 CocoaPods 生成的 `.xcworkspace` 后缀名的工程文件来打开工程。

## 三、编写SDK接入代码，加载本地或远程的Hippy资源包

Hippy SDK的代码接入简单来说只需两步：

1、初始化一个HippyBridge实例，HippyBridge是Hippy最重要的概念，它是终端渲染侧与前端驱动侧进行通信的`桥梁`，同时也承载了Hippy应用的主要上下文信息。

2、通过HippyBridge实例初始化一个HippyRootView实例，HippyRootView是Hippy应用另一个重要概念，Hippy应用将由它显示出来，因此可以说创建业务也就是创建一个 `HippyRootView`。

目前，Hippy 提供了分包加载接口以及不分包加载接口,使用方式分别如下：

### 方式1. 使用分包加载接口

``` objectivec
/** 此方法适用于以下场景：
 * 在业务还未启动时先准备好JS环境，并加载包1，当业务启动时加载包2，减少包加载时间
 * 我们建议包1作为基础包，与业务无关，只包含一些通用基础组件，所有业务通用
 * 包2作为业务代码加载
*/

// 先加载包1，创建出一个HippyBridge实例
// 假设commonBundlePath为包1的路径
// Tips：详细参数说明请查阅头文件: HippyBridge.h
NSURL *commonBundlePath = getCommonBundlePath();
HippyBridge *bridge = [[HippyBridge alloc] initWithDelegate:self
                                                  bundleURL:commonBundlePath
                                             moduleProvider:nil
                                              launchOptions:your_launchOptions
                                                executorKey:nil];

// 再通过上述bridge以及包2地址创建HippyRootView实例
// 假设businessBundlePath为包2的路径
// Tips：详细参数说明请查阅头文件: HippyRootView.h
HippyRootView *rootView = [[HippyRootView alloc] initWithBridge:bridge
                                                    businessURL:businessBundlePath
                                                     moduleName:@"Your_Hippy_App_Name"
                                              initialProperties:@{}
                                                   shareOptions:nil
                                                       delegate:nil];

// 最后，给生成的rootView设置好frame，并将其挂载到指定的VC上。
rootView.frame = self.view.bounds;
rootView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
[self.view addSubview:rootView];

// 至此，您已经完成一个Hippy应用的初始化，SDK内部将自动加载资源并开始运行Hippy应用。
```

### 方式2. 使用不分包加载接口

``` objectivec
// 与上述使用分包加载接口类似，首先需要创建一个HippyBridge实例，
// 区别是在创建HippyRootView实例时，无需再传入业务包，即businessBundlePath，直接使用如下接口创建即可
// Tips：详细参数说明请查阅头文件: HippyRootView.h
- (instancetype)initWithBridge:(HippyBridge *)bridge
                    moduleName:(NSString *)moduleName
             initialProperties:(nullable NSDictionary *)initialProperties
                  shareOptions:(nullable NSDictionary *)shareOptions
                      delegate:(nullable id<HippyRootViewDelegate>)delegate;
```

> 在Hippy仓库中提供了一个简易示例项目，包含上述全部接入代码，以及更多注意事项。
>
> 建议参考该示例完成SDK到已有项目的集成：[iOS Demo](https://github.com/Tencent/Hippy/tree/main/framework/examples/ios-demo)，更多设置项及使用方式请查阅上述头文件中的具体API说明。

!> 使用分包加载可以结合一系列策略，比如提前预加载bridge, 全局单bridge等来优化页面打开速度。

到这里，您已经完成了接入一个默认配置下的Hippy iOS SDK的全部过程。

## 四、引擎切换（可选）

Hippy 3.x的一个重要特性是支持了多引擎的便捷切换，目前，可切换的引擎有两个，一是布局引擎，二是JS引擎。默认配置下，Hippy使用布局引擎是[Taitank](https://github.com/Tencent/Taitank)，JS引擎是iOS系统内置的`JavaScriptCore`。

如需使用其他布局引擎，如[Yoga](https://github.com/facebook/yoga)，或使用其他JS引擎，可参考如下指引调整Hippy接入配置。

### 4.1 切换JS引擎

在完成上述集成配置后，参考[《Hermes JS引擎切换指引（Beta）》](development/use-hermes-engine.md)进行配置，以切换至Hermes JS引擎。

## 4.2 切换布局引擎

用户若想使用Yoga布局引擎，直接在Podfile文件中指定layout_engine为Yoga即可：

```ruby
ENV['layout_engine'] = 'Yoga'
```

之后，重新执行`pod install`命令更新项目依赖即可。
