---
title: 创建基于 UIKit 的原生 IOS项目
description: 目前创建项目已经是 swiftUI，但是我还是习惯使用 UIKit，所以在此记录一下。
date: 2026-06-03
category: 教程
series: 
stage:
tags: 
  - ios
  - swift
  - 教程
published: true
---


# 创建一个基于Swift UIKit的iOS 原生项目

## 前置准备

- 一台 `MacOS`电脑
- 安装 `Xcode`，文章使用的 `Xcode` 版本为 16.5

![Xcode版本](/image/005.jpg)

## 开始创建新项目

1. 打开 Xcode，选择 “Create New Project”
2. 在模板选择界面，选择 “iOS”，再选择 “App”，然后点击 “Next”
3. 项目配置：
 - Product Name：项目名称，例如 TestApp
 - Team：如果无，选择 None
 - Organization Identifier：唯一标识符，如 com.**
 - Interface：选择 Storyboard
 - Language：99%情况都选择 Swift（选 Swift）
 - Testing System：暂时不需要
 - Storage：可选可不选（先不选）

点击 Next，选择保存路径并创建项目


图解步骤：

![创建新项目](/image/001.png)

![创建新项目](/image/002.jpg)

![创建新项目](/image/003.jpg)


## 删除Storyboard

新建的项目默认使用 Storyboard，要实现纯代码开发，需要移除与 Storyboard 相关的文件和数据。

1. 删除项目中的`Main.storyboard`文件(如果没有可以不做这一步)

2. 点击项目根目录，切换到 `TARGETS` 下的 `Info`，找到 `Main storyboard file base name` 条目并删除

![删除Storyboard](/image/006.jpg)

![删除Storyboard](/image/007.jpg)

## 设置根视图控制器（`RootViewController`）

打开 `SceneDelegate.swift` 文件，通过代码手动设置根视图控制器，初始化 UI。



```swift {10-12}
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    // 核心代码
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()
    }
}
```

## 创建自定义 ViewController

打开 `ViewController.swift` 文件，添加一行文本

```swift
import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // 设置窗口背景颜色
        view.backgroundColor = .systemPink
        // 添加文本
        let label = UILabel()
        label.text = "Hello world!"
        label.textColor = .white
        label.textAlignment = .center
        label.frame = view.bounds
        // 添加到视图
        view.addSubview(label)
    }
}
```

## 运行项目

点击 Xcode 界面左上角的运行按钮（或者使用快捷键 Cmd + R），模拟器将会启动

![运行项目](/image/008.jpg)

![运行项目](/image/009.jpg)