---
title: ios面试集锦
description: ios面试问题记录
date: 2026-06-05
category: 面试
series: 面试
stage: iOS面试
tags:
  - notes
published: true
---

# iOS面试题集锦

提前说明，这里作为记录本人实际面试和网上记录的一些面试心得，不会区分初级，中级，高级;也不会有什么顺序，仅供温故知新。

## KVO & KVC

被问频率：较高（4/5）

**初级理解：** `KVC`（Key-Value Coding）是通过字符串 `key` 间接读写对象属性的一套机制；`KVO`（Key-Value Observing）是在属性变化时自动通知观察者的机制。二者常配合使用——`KVC` 改值会触发 `KVO` 回调（前提是属性可被 KVO 监听）。

**深入：**

> ##### KVC 核心

- **本质：** 运行时通过 `key` 字符串访问对象内部数据，绕过常规 getter/setter 语法
- **常用 API：**
  - 读：`value(forKey:)`、`value(forKeyPath:)`、`value(forUndefinedKey:)`
  - 写：`setValue(_:forKey:)`、`setValue(_:forKeyPath:)`
  - 批量：`dictionaryWithValues(forKeys:)`、`setValuesForKeys(_:)`
- **查找顺序（setValue）：** 先找 `set<Key>:` → `_set<Key>:` → `@accessInstanceVariablesDirectly` 为 YES 时直接访问 `_key` / `_isKey` / `key` / `isKey` → 调 `setValue(_:forUndefinedKey:)`
- **查找顺序（valueForKey）：** 先找 `get<Key>` / `is<Key>` → `@accessInstanceVariablesDirectly` 为 YES 时访问实例变量 → `value(forUndefinedKey:)`
- **KeyPath：** 点语法链式访问，如 `person.address.city`，中间任一环节为 `nil` 则整条返回 `nil`（不 crash）
- **集合操作符：** `@count`、`@sum`、`@avg`、`@max`、`@min` 等，用于数组/集合聚合

::: details KVC 基础用法

```swift
class Person: NSObject {
    @objc dynamic var name: String = ""
    @objc var age: Int = 0
}

let p = Person()
p.setValue("Tom", forKey: "name")
p.setValue(25, forKey: "age")
print(p.value(forKey: "name")!) // Tom

// 批量赋值（JSON 映射常用）
p.setValuesForKeys(["name": "Jerry", "age": 30])
```

:::

> ##### KVO 核心

- **本质：** 基于 **isa-swizzling**（运行时替换被观察对象的类）生成子类，重写 setter，在值变化时调用 `observeValue(forKeyPath:of:change:context:)`
- **注册/移除：**
  - `addObserver(_:forKeyPath:options:context:)`
  - `removeObserver(_:forKeyPath:context:)` — **必须成对调用**，否则 crash
- **options 常用：**
  - `.new` / `.old`：回调里拿到新旧值
  - `.initial`：注册时立刻回调一次
  - `.prior`：变化前后各回调一次
- **触发条件：** 通过 **KVO 兼容的 setter** 改值才会触发——`person.name = "x"` ✅；直接改 `_name` ❌；`willChangeValue` / `didChangeValue` 手动触发 ✅
- **Swift 注意：** 被观察属性需 `@objc dynamic`（或继承 `NSObject` 且声明 `@objc dynamic`）

::: details KVO 标准写法

```swift
class ProfileVC: UIViewController {
    private var observation: NSKeyValueObservation?

    override func viewDidLoad() {
        super.viewDidLoad()
        let user = User()
        observation = user.observe(\.name, options: [.new, .old]) { obj, change in
            print("name: \(change.oldValue ?? "") → \(change.newValue ?? "")")
        }
        user.name = "Alice" // 触发回调
    }
    // block-based KVO 随 observation 释放自动 remove，推荐
}
```

:::

::: details 传统 KVO（需手动 remove）

```swift
class LegacyObserver: NSObject {
    private let target: Person

    init(target: Person) {
        self.target = target
        super.init()
        target.addObserver(self, forKeyPath: "name", options: [.new, .old], context: nil)
    }

    override func observeValue(forKeyPath keyPath: String?,
                               of object: Any?,
                               change: [NSKeyValueChangeKey: Any]?,
                               context: UnsafeMutableRawPointer?) {
        guard keyPath == "name" else { return }
        print("changed: \(change?[.newKey] ?? "")")
    }

    deinit {
        target.removeObserver(self, forKeyPath: "name") // ✅ 必须
    }
}
```

:::

> ##### KVC 与 KVO 的关系

| 操作 | 是否触发 KVO |
| --- | --- |
| `setValue(_:forKey:)` 走 setter | ✅ |
| `setValue(_:forKey:)` 直接写 ivar | ✅（KVC 内部会调 will/didChange） |
| 普通 `obj.prop = val` | ✅（走 setter） |
| 直接改实例变量 | ❌ |
| `NSMutableArray` 的 KVC 集合代理 | ✅（`addObject` 等） |

> ##### 高频误区

- **KVC 只是语法糖** → 片面。它能访问 `@private` ivar、触发特殊查找逻辑，功能比点语法强
- **所有属性都能 KVO** → 错。需 `@objc dynamic` 或手动 will/didChange；Swift 纯 struct 不支持
- **block-based KVO 不用 remove** → 对。`NSKeyValueObservation` 释放即自动注销；传统 API 必须手动 remove
- **KVO 线程安全** → 错。回调线程 = 改值线程，UI 更新需切主线程
- **KVC 找不到 key 就 crash** → 默认会抛 `NSUnknownKeyException`；可重写 `setValue(_:forUndefinedKey:)` 兜底

> ##### 学习路线

| 阶段 | 做什么 | 目标 |
| --- | --- | --- |
| 基础 | 用 KVC 做 JSON → Model 映射 | 理解 key 查找顺序 |
| 基础 | `@objc dynamic` + block KVO 监听属性 | 掌握现代写法 |
| 源码 | 读 `NSKVONotifying_` 子类生成逻辑 | 理解 isa-swizzling |
| 实战 | 对比 KVO / Delegate / Notification / Combine | 建立选型直觉 |
| 排查 | Instruments 查 KVO 泄漏（未 remove） | 避免经典 crash |

> ##### 循序渐进

- **30 秒答：** KVC 用字符串 key 读写属性；KVO 监听属性变化，底层 isa-swizzling 重写 setter；Swift 用 `@objc dynamic` + `observe(_:options:changeHandler:)`
- **2 分钟答：** 加上 KVC 查找顺序、KVO 触发条件、手动 remove vs block KVO、KVC 改值也会触发 KVO
- **记忆口诀：** KVC 字符串找属性，KVO 改值发通知，Swift 记得 dynamic，传统 KVO 别忘 remove

## iOS多线程(GCD)

被问频率：极高（5/5）

**初级理解：** `GCD`（Grand Central Dispatch）是 Apple 提供的**基于队列**的多线程抽象——开发者只管把任务 `dispatch` 到串行/并发队列，系统线程池负责调度。主队列跑 UI；耗时任务丢后台队列；回主队列更新界面。

**深入：**

> ##### 核心概念

| 概念 | 说明 |
| --- | --- |
| **Queue（队列）** | 任务容器，FIFO 顺序 |
| **Serial Queue** | 串行，同一时刻只执行一个任务 |
| **Concurrent Queue** | 并发，可多个任务同时执行 |
| **Sync** | 同步派发，**阻塞**当前线程直到任务完成 |
| **Async** | 异步派发，当前线程立即返回，任务稍后执行 |

- **主队列（Main Queue）：** 串行，绑定主线程，**唯一**安全更新 UI 的地方
- **全局并发队列（Global Queue）：** `DispatchQueue.global(qos:)` — `.userInteractive` > `.userInitiated` > `.default` > `.utility` > `.background`
- **自定义队列：** `DispatchQueue(label:attributes:)` — 默认串行；加 `.concurrent` 变并发

> ##### 常用 API

| API | 场景 |
| --- | --- |
| `async` / `sync` | 基本派发 |
| `DispatchGroup` | 多任务全部完成后回调（`enter/leave`、`notify`） |
| `DispatchSemaphore` | 控制并发数、线程同步 |
| `barrier` | 并发队列上的「写屏障」——写独占、读并发 |
| `DispatchWorkItem` | 可取消、延迟、优先级 |
| `asyncAfter` | 延迟执行（不等价 Timer，一次性） |

::: details 基本用法：后台干活，主线程刷 UI

```swift
DispatchQueue.global(qos: .userInitiated).async {
    let data = self.fetchData() // 后台线程
    DispatchQueue.main.async {
        self.tableView.reloadData() // ✅ 主线程更新 UI
    }
}
```

:::

::: details DispatchGroup 等多任务

```swift
let group = DispatchGroup()
var imageA: UIImage?
var imageB: UIImage?

group.enter()
download(urlA) { img in
    imageA = img
    group.leave()
}

group.enter()
download(urlB) { img in
    imageB = img
    group.leave()
}

group.notify(queue: .main) {
    // 两个都完成后再合成
    self.compose(imageA, imageB)
}
```

:::

::: details Semaphore 限制并发数（如最多 3 个下载）

```swift
let semaphore = DispatchSemaphore(value: 3)
let queue = DispatchQueue.global()

for url in urls {
    queue.async {
        semaphore.wait()
        defer { semaphore.signal() }
        download(url)
    }
}
```

:::

::: details barrier 读写锁模式

```swift
let queue = DispatchQueue(label: "rw", attributes: .concurrent)
var cache: [String: Data] = [:]

// 读：并发
func read(key: String) -> Data? {
    queue.sync { cache[key] }
}

// 写：独占
func write(key: String, data: Data) {
    queue.async(flags: .barrier) {
        cache[key] = data
    }
}
```

:::

> ##### 经典死锁场景

```swift
// ❌ 主线程 sync 主队列 → 死锁
DispatchQueue.main.sync {
    // 永远等不到
}

// ❌ 同一串行队列 sync 自身 → 死锁
let q = DispatchQueue(label: "serial")
q.async {
    q.sync { } // 死锁
}
```

- **原因：** `sync` 会阻塞当前线程等待任务执行；串行队列任务又排在当前任务之后，互相等待
- **安全写法：** 主队列只用 `async`；串行队列避免在自身任务里 `sync` 自身

> ##### GCD vs OperationQueue

| 维度 | GCD | OperationQueue |
| --- | --- | --- |
| 抽象层级 | C API，轻量 | 面向对象，基于 GCD |
| 取消 | WorkItem 可取消 | `cancel()` 原生支持 |
| 依赖 | 需手动 Group | `addDependency` |
| 优先级/KVO | 有限 | 丰富 |
| 适用 | 简单异步 | 复杂任务编排 |

> ##### 与线程的关系

- **GCD 管队列，系统管线程** — 开发者不直接创建/销毁线程
- **一个队列 ≠ 一个线程** — 并发队列任务可能跑在不同线程；串行队列也不保证固定线程
- **`DispatchQueue.main`** 一定在主线程执行
- **Thread.isMainThread** 判断是否在主线程

> ##### 高频误区

- **async 一定开新线程** → 错。只是异步调度；可能在当前线程（如已是主队列）或线程池复用
- **global 队列优先级 = 线程优先级** → 相关但不等同；QoS 影响调度策略与 CPU 分配
- **sync 比 async 快** → 错。sync 阻塞调用方，易卡 UI；仅需要返回值时用 sync
- **DispatchGroup leave 少调** → 永久阻塞 notify
- **子线程更新 UI** → 未定义行为，可能 crash 或渲染异常

> ##### 学习路线

| 阶段 | 做什么 | 目标 |
| --- | --- | --- |
| 基础 | 写 async 后台 + main 刷 UI | 建立队列思维 |
| 实战 | Group 等多下载 + Semaphore 限流 | 掌握组合 API |
| 排查 | 主线程 sync 复现死锁 | 理解阻塞模型 |
| 对比 | 同一需求 GCD vs async/await | Swift 并发迁移 |
| 进阶 | barrier 实现线程安全缓存 | 读写锁模式 |

> ##### 循序渐进

- **30 秒答：** GCD 基于队列派发任务；主队列串行跑 UI；后台用 global/自定义队列 async；更新 UI 必须 main.async
- **2 分钟答：** 加上 sync/async 区别、死锁场景、Group/Semaphore/barrier 用途、OperationQueue 对比
- **记忆口诀：** 主队列刷 UI，后台 async 干，sync 小心死锁，Group 等多任务

## runloop

被问频率：较高（4/5）

**初级理解：** `RunLoop` 是线程的**事件循环**——不断从输入源（Source）、定时器（Timer）、Observer 中取事件处理，没有事件就休眠，让 CPU 省电。主线程 RunLoop 默认开启；子线程需手动 `run()`。UIKit 触摸、滚动、Timer、PerformSelector 都依赖 RunLoop。

**深入：**

> ##### 核心结构

```
RunLoop
├── Mode（模式，切换隔离事件）
│   ├── kCFRunLoopDefaultMode      → NSDefaultRunLoopMode
│   ├── UITrackingRunLoopMode      → 滚动时切换
│   └── kCFRunLoopCommonModes      → 占位符，含 Default + EventTracking
├── Source（输入源）
│   ├── Source0：非端口，需手动 mark（touch、performSelector）
│   └── Source1：基于 mach port（系统内核事件）
├── Timer
└── Observer（监听 RunLoop 各阶段）
```

> ##### Mode 机制（面试高频）

| Mode | 场景 |
| --- | --- |
| **NSDefaultRunLoopMode** | 默认，大部分 UI 事件 |
| **UITrackingRunLoopMode** | `UIScrollView` 滑动时切换到此 Mode |
| **kCFRunLoopCommonModes** | 注册到此 = 同时加入 Common 集合，Default 和 Tracking 都能触发 |

- **经典坑：** Timer 加到 Default Mode → 滚动时 RunLoop 切 Tracking Mode → **Timer 暂停**
- **解法：** `RunLoop.main.add(timer, forMode: .common)`

::: details Timer 滚动时不暂停

```swift
let timer = Timer(timeInterval: 1, repeats: true) { _ in
    print("tick")
}
RunLoop.main.add(timer, forMode: .common) // ✅ 而非 .default
```

:::

> ##### RunLoop 与线程

- **一一对应：** 每个线程最多一个 RunLoop（懒创建）
- **主线程：** `UIApplicationMain` 内部自动启动 RunLoop，App 生命周期内不退出
- **子线程：** 默认不启动；需 `RunLoop.current.run()` 或 `run(until:)` 手动跑
- **AutoreleasePool：** RunLoop 每次循环结束 pop 一层自动释放池（主线程）；子线程无 RunLoop 则无自动池，需 `@autoreleasepool` 或手动 run

::: details 子线程中使用 RunLoop

```swift
Thread.detachNewThread {
    let port = Port()
    RunLoop.current.add(port, forMode: .default)
    RunLoop.current.run() // 保持线程存活
}
```

:::

> ##### RunLoop 运行流程（简化）

1. 通知 Observer：`Entry`
2. 处理 Timer 到期事件
3. 处理 Source0
4. **若有事件 → 处理并跳到 9；若无 → 休眠**
5. 被 Source1 / 外部 `CFRunLoopWakeUp` 唤醒
6. 处理 Source1
7. 通知 Observer：`BeforeWaiting` / `AfterWaiting`
8. 处理 Block（GCD 主队列任务在此执行）
9. 通知 Observer：`Exit` → 回到 1

> ##### 典型应用场景

| 场景 | RunLoop 作用 |
| --- | --- |
| **主线程保活** | App 不退出，持续响应事件 |
| **NSTimer / CADisplayLink** | 依赖 RunLoop Timer |
| **PerformSelector** | `perform(_:with:afterDelay:)` 加到当前 RunLoop |
| **滚动流畅性** | Tracking Mode 优先处理触摸，暂停 Default 里低优先级 Timer |
| **线程保活** | 子线程 run + Port 防止线程执行完就销毁 |
| **AutoreleasePool 管理** | 每次 Loop 结束 drain |

::: details performSelector 依赖 RunLoop

```swift
// 1 秒后执行，需当前线程 RunLoop 在跑
perform(#selector(doWork), with: nil, afterDelay: 1.0)

// 取消
NSObject.cancelPreviousPerformRequests(withTarget: self, selector: #selector(doWork), object: nil)
```

:::

> ##### RunLoop 与 GCD 主队列

- **主队列 `DispatchQueue.main.async` 的任务** 通过 Main RunLoop 的 **Source0 / Block** 机制执行
- 因此 `main.async` 的任务在 RunLoop 某次迭代中执行，而非立刻打断当前代码

> ##### 高频误区

- **RunLoop = 线程** → 错。RunLoop 是线程的事件循环机制，线程是执行单元
- **Timer 时间很准** → 错。受 RunLoop 负载影响，可能延迟；精确计时用 GCD Timer 或 CADisplayLink
- **子线程 Timer 默认可用** → 错。子线程需先启动 RunLoop
- **CommonModes 是独立 Mode** → 错。是占位符，注册时会复制到 Common 集合里的各 Mode
- **RunLoop 只能主线程用** → 错。任何线程都有，只是子线程需手动 run

> ##### 学习路线

| 阶段 | 做什么 | 目标 |
| --- | --- | --- |
| 基础 | 理解主线程 RunLoop 为何 App 不退出 | 建立事件循环模型 |
| 实战 | Timer 加 common mode 对比滚动行为 | 理解 Mode 切换 |
| 源码 | 读 CFRunLoop.c 或 Apple 文档 RunLoop 结构 | 搞懂 Source/Timer/Observer |
| 排查 | 主线程卡顿 + Time Profiler 看 RunLoop 迭代 | 定位长任务阻塞 |
| 进阶 | 子线程保活 + Port 方案（了解即可，慎用） | 理解线程生命周期 |

> ##### 循序渐进

- **30 秒答：** RunLoop 是线程事件循环，处理 Source/Timer/Observer；主线程自动跑；滑动时切 Tracking Mode，Timer 需加 common mode
- **2 分钟答：** 加上 Mode 机制、与 GCD 主队列关系、AutoreleasePool、子线程需手动 run、performSelector 依赖
- **记忆口诀：** 一线一 Loop，主线程自动跑，滚动切 Mode Timer 停，common mode 解烦恼

> ##### RunLoop 实现原理（补充）

- **底层：** `NSRunLoop` 是 `CFRunLoop` 的封装；核心数据结构为 `__CFRunLoop`，内部维护 **Mode → Items** 字典
- **休眠/唤醒：** 无事件时通过 `mach_msg` 进入内核休眠；Source1 / Timer / `CFRunLoopWakeUp` 唤醒后继续循环
- **线程绑定：** `CFRunLoopGetCurrent()` 用线程字典 TLS 存 RunLoop，保证一线一 Loop
- **与 AutoreleasePool：** 主线程 RunLoop 在 `kCFRunLoopEntry`  push 池，在 `BeforeWaiting` / `Exit` pop 池

## iOS 内存管理机制

被问频率：极高（5/5）

**初级理解：** iOS 使用 **ARC**（Automatic Reference Counting）自动管理堆对象生命周期——编译器插入 `retain` / `release` / `autorelease`；引用计数归零对象销毁。`strong` 强引用、`weak` 弱引用不增加计数、`unowned` 类似 weak 但假定对象存活。

**深入：**

> ##### 引用计数规则

| 修饰符 | 计数 | 对象释放后 |
| --- | --- | --- |
| `strong` | +1 | 指针变 dangling（若仍持有） |
| `weak` | 不增加 | 自动置 `nil` |
| `unowned` | 不增加 | **不**置 nil，访问可能 crash |
| `copy` | +1，且拷贝一份 | 常用于 NSString/Block 防可变 |

> ##### 内存区域

- **栈（Stack）：** 值类型、局部变量，函数返回自动回收
- **堆（Heap）：** 引用类型实例，ARC 管理
- **AutoreleasePool：** 延迟 release；RunLoop 迭代 / `@autoreleasepool {}` 边界 drain

> ##### 循环引用与解决

- **典型：** 闭包捕获 `self` + `self` 持有闭包；Delegate 未 weak；Timer 强引用 target
- **解决：** 闭包 `[weak self]` / `[unowned self]`；delegate `weak`；Timer 用 block 版或中间 proxy

::: details 闭包循环引用

```swift
class VM {
    var onFinish: (() -> Void)?
    func load() {
        onFinish = { [weak self] in
            self?.refresh()
        }
    }
}
```

:::

> ##### 高频误区

- **ARC = 无内存泄漏** → 错。循环引用、Timer、Notification 未移除仍会泄漏
- **weak 一定安全** → 错。多线程下 weak 变 nil 与使用的竞态仍需注意
- **值类型不占堆** → 片面。含引用类型字段或过大时可能堆分配
- **deinit 一定调用** → 循环引用时 deinit 永不执行

> ##### 循序渐进

- **30 秒答：** ARC 编译期插 retain/release；strong/weak/copy；循环引用用 weak self 和 weak delegate
- **2 分钟答：** 加上栈堆区别、AutoreleasePool、Side Table（weak 表）、常见泄漏场景

## NSThread、GCD、NSOperation 多线程

被问频率：极高（5/5）

**初级理解：** iOS 三种多线程方式——**NSThread** 直接操作线程（最重）；**GCD** 基于队列派发（最常用）；**NSOperation** 面向对象任务编排（基于 GCD，适合依赖/取消）。现代 Swift 还可选 **async/await + Actor**。

**深入：**

| 方式 | 特点 | 适用 |
| --- | --- | --- |
| **NSThread** | 手动创建/启动，可设 name、stackSize | 需绑定特定线程、RunLoop 保活（少用） |
| **GCD** | 队列 + block，系统管线程池 | 绝大多数异步场景 |
| **OperationQueue** | 封装 GCD，支持 dependency、cancel、KVO | 复杂任务链、可取消下载 |
| **Swift Concurrency** | `Task`、`async/await`、`Actor` | 新项目首选 |

::: details NSOperation 依赖链（ABC 完成再 D 的一种写法）

```swift
let opA = BlockOperation { fetchA() }
let opB = BlockOperation { fetchB() }
let opC = BlockOperation { fetchC() }
let opD = BlockOperation { mergeResults() }

opD.addDependency(opA)
opD.addDependency(opB)
opD.addDependency(opC)

let queue = OperationQueue()
queue.addOperations([opA, opB, opC, opD], waitUntilFinished: false)
```

:::

> ##### 选型建议

- 简单后台任务 → GCD `async`
- 多任务完成回调 → `DispatchGroup` 或 Operation 依赖
- 需取消/暂停 → `Operation` + `isCancelled` 检查
- 数据竞争 → 串行队列 / `Actor` / 锁（见「多线程读写与加锁」）

## 多线程读写与加锁

被问频率：较高（4/5）

**初级理解：** 多线程并发读写同一资源需 **同步**——读多写少可用读写锁；简单场景用 **串行队列** 代替锁更安全。

**深入：**

| 方案 | 说明 |
| --- | --- |
| **`os_unfair_lock` / `NSLock`** | 互斥，轻量 |
| **`pthread_rwlock`** | 读共享、写独占 |
| **GCD barrier** | 并发队列 + 写 barrier（见 GCD 章节） |
| **串行 Queue** | 所有读写同一 queue，Swift 推荐 |
| **`@MainActor` / `Actor`** | 编译期隔离，Swift 6 方向 |
| **`DispatchSemaphore`** | 信号量，控制并发数 |

::: details 读写分离（GCD barrier）

```swift
final class SafeCache {
    private var store: [String: Data] = [:]
    private let queue = DispatchQueue(label: "cache", attributes: .concurrent)

    func get(_ key: String) -> Data? {
        queue.sync { store[key] }
    }

    func set(_ key: String, data: Data) {
        queue.async(flags: .barrier) { store[key] = data }
    }
}
```

:::

## Block 实现原理与堆栈同步

被问频率：较高（4/5）

**初级理解：** Block 是带捕获变量的 **C 闭包结构体**——最初在栈上；被 `copy` 到堆上后生命周期独立。OC 里 `__block` 变量可在 Block 内修改，通过转发到堆实现。

**深入：**

> ##### Block 类型

| 类型 | 存储 | 说明 |
| --- | --- | --- |
| `_NSConcreteStackBlock` | 栈 | 函数内创建，未 copy |
| `_NSConcreteMallocBlock` | 堆 | copy 后或全局 |
| `_NSConcreteGlobalBlock` | 全局 | 无捕获变量 |

> ##### 堆栈同步

- Block **捕获**外部变量：值拷贝；对象指针 retain
- **`__block`**：变量包装成结构体，栈 Block copy 到堆时 **`__block` 变量也 copy 到堆**，栈与堆指向同一份堆数据 → 「同步」
- ARC 下 Block 作为属性需 `copy`（property `copy`）确保堆上存活

::: details __block 修改外部变量

```objc
__block int count = 0;
void (^blk)(void) = ^{
    count++; // __block 转发到堆
};
blk();
// count == 1
```

:::

## Runtime 与消息发送

被问频率：较高（4/5）

**初级理解：** Objective-C 是 **动态语言**——方法调用本质是 **消息发送** `objc_msgSend(receiver, sel, ...)`，Runtime 在运行时查方法 IMP 并执行。

**深入：**

> ##### 消息发送流程

1. **查缓存** `cache_t` — class 的方法缓存，命中率极高
2. **查方法列表** — 当前类 `method_list`
3. **沿继承链向上** — 父类 → … → `NSObject`
4. **动态解析** `resolveInstanceMethod:` — 运行时添加方法
5. **消息转发**
   - `forwardingTargetForSelector:` — 转给其他对象
   - `methodSignatureForSelector:` + `forwardInvocation:` — 完整转发
6. **仍无法处理** → `doesNotRecognizeSelector:` crash

> ##### Runtime 常见能力

- **方法交换** `method_exchangeImplementations`（Hook，调试/ AOP）
- **动态添加** `class_addMethod`
- **关联对象** `objc_setAssociatedObject`
- **KVO / Category** 都依赖 Runtime

## weak 的实现原理

被问频率：较高（4/5）

**初级理解：** `weak` 不增加引用计数；对象 dealloc 时 Runtime **自动把所有 weak 指针置 nil**，避免悬垂指针。

**深入：**

- 对象 dealloc 时，从 **Side Table（弱引用表）** 取出所有 weak 引用地址，逐个置 `nil`
- iOS 64 位：`isa` 指针部分位存引用计数 / weak 标记；Side Table 分离存储
- **Swift weak** 与 OC 机制一致，由 Runtime / Swift runtime 协同
- **unowned** 不注册 weak 表，不置 nil，对象已释放再访问 → crash

## SEL 的使用和原理

被问频率：一般（3/5）

**初级理解：** `SEL`（Selector）是 **方法的名称签名**，编译期注册为常量字符串指针，运行时映射到 IMP。

**深入：**

- **本质：** `typedef struct objc_selector *SEL` — 方法名唯一标识（同名同参同返回）
- **用法：** `@selector(doWork)`、`#selector(doWork)`、`perform(_:with:afterDelay:)`
- **与 IMP：** `SEL` 是「选什么方法」，`IMP` 是「方法函数指针」
- **`NSSelectorFromString`** 动态构造，需方法已存在
- **注意：** 多参 selector 拼写错误编译不报错，运行 unrecognized selector

## NSNotificationCenter 实现原理

被问频率：一般（3/5）

**初级理解：** **观察者模式** 的广播中心——发布者 `post`，订阅者 `addObserver`，一对多解耦。

**深入：**

- 内部维护 **通知名 → 观察者列表**（对象 + selector 或 block）
- `post` 时在 **posting 线程** 同步遍历调用 observer（block 版在 posting 线程执行）
- **弱引用 table** 持有 observer 对象，对象释放自动移除（block 版需手动 remove 或 iOS 9+ 返回 token）
- **与 KVO 区别：** Notification 显式 post；KVO 属性变化自动触发
- **Swift 替代：** Combine、`NotificationCenter.default.publisher`

## Category

被问频率：较高（3/5）

**初级理解：** Objective-C **分类**——在不改原类、不子类化的前提下扩展方法；Runtime 运行时把 category 的 `method_list` **合并**进类。

**深入：**

- **不能**添加实例变量（可借关联对象 `objc_setAssociatedObject`）
- **同名方法：** Category 优先级 **高于** 原类（后加载覆盖）
- **加载时机：** `load` 方法在类加载时调用（每个 category 的 +load 都会调）
- **Swift Extension** 类似，纯 Swift 类型编译期静态派发；`@objc` extension 可走 Runtime

## self 和 super 的区别

被问频率：一般（3/5）

**初级理解：** `self` 是当前对象指针；`super` 是 **编译期开始的父类起点**，消息从父类查 IMP，但 **方法内 self 仍指向子类实例**。

**深入：**

- `[self method]` → 从 **当前类** 查方法（动态，可子类 override）
- `[super method]` → 从 **父类** 查 IMP，**receiver 仍是 self**（子类对象）
- 典型用途：子类 override 后在内部调用 **父类实现** `super.viewDidLoad()`

## UIViewController 生命周期

被问频率：较高（4/5）

**初级理解：** 从创建到销毁经历 `loadView` → `viewDidLoad` → 布局 → 显示 → 消失 → `deinit`。

**深入：**

| 阶段 | 方法 | 说明 |
| --- | --- | --- |
| 创建 | `init` / `init(coder:)` | Storyboard 或代码 |
| 加载 View | `loadView` | 可自定义 root view，一般不重写 |
| 视图加载完 | `viewDidLoad` | 只调一次，配 UI、数据 |
| 即将出现 | `viewWillAppear` | 每次显示前 |
| 已出现 | `viewDidAppear` | 动画完成，开计时器 |
| 布局 | `viewWillLayoutSubviews` / `viewDidLayoutSubviews` | 约束变化 |
| 即将消失 | `viewWillDisappear` | 停动画、保存状态 |
| 已消失 | `viewDidDisappear` | |
| 内存警告 | `didReceiveMemoryWarning` | 释放缓存 |
| 销毁 | `deinit` | VC 释放 |

- **注意：** `viewDidLoad` 里勿取 `view.bounds` 做精确布局（可能为 0）；`viewDidLayoutSubviews` 更安全

## UIButton 继承链与扩大点击区域

被问频率：一般（2/5）

**初级理解：** `UIButton` → `UIControl` → `UIView` → `UIResponder` → `NSObject`。系统点击区域 = `bounds`，小于 44pt 时可扩大热区。

**深入：**

::: details 扩大点击区域（重写 pointInside）

```swift
class LargeHitButton: UIButton {
    var hitTestEdgeInsets = UIEdgeInsets(top: -10, left: -10, bottom: -10, right: -10)

    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        bounds.inset(by: hitTestEdgeInsets).contains(point)
    }
}
```

:::

- 或用 **透明父 View** 包裹，父 View 更大

## 点击事件穿透透明 View

被问频率：一般（3/5）

**初级理解：** 透明 View 默认仍响应触摸；要「穿透」需重写 **`hitTest`** 或 **`point(inside:)`** 返回 nil/false。

**深入：**

::: details 穿透透明遮罩

```swift
class PassThroughView: UIView {
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let hit = super.hitTest(point, with: event)
        return hit === self ? nil : hit // 自身不响应，子视图正常
    }
}
```

:::

- **`isUserInteractionEnabled = false`** 整层及子视图都不响应
- **`allowsHitTesting = false`**（SwiftUI）

## iOS 设计模式

被问频率：一般（3/5）

**初级理解：** 常用 **Delegate、Target-Action、Notification、Singleton、Factory、MVC/MVVM/VIPER** 等。

**深入：**

| 模式 | iOS 体现 |
| --- | --- |
| **Delegate** | `UITableViewDelegate`、协议回调 |
| **Target-Action** | `UIButton` → `#selector` |
| **Observer** | KVO、NotificationCenter |
| **Singleton** | `URLSession.shared`、`FileManager.default` |
| **Factory** | `UIStoryboard.instantiateViewController` |
| **Strategy** | 不同 `Layout` / 支付方式可替换 |
| **Decorator** | Category、Wrapper |
| **MVC** | UIKit 默认；VC 易臃肿 |
| **MVVM** | View + ViewModel + Binding（Combine/Rx） |

## 推送如何实现

被问频率：一般（3/5）

**初级理解：** **APNs**（Apple Push Notification service）——App 向 Apple 注册 deviceToken → 业务服务器持 token → 经 APNs 下发 → 系统展示或唤醒 App。

**深入：**

1. App 请求权限 `UNUserNotificationCenter.requestAuthorization`
2. `registerForRemoteNotifications` → 回调 **deviceToken**
3. 上传 token 到业务服务器
4. 服务器用 **.p8 / .p12 证书** 连接 APNs HTTP/2 API 发 push payload
5. **静默推送** `content-available: 1` 唤醒后台；**前台** 走 `userNotificationCenter(_:willPresent:)`

- **Local Notification** 不经过 APNs，本地 `UNNotificationRequest` 调度

## HTTPS

被问频率：较高（4/5）

**初级理解：** HTTP + **TLS** 加密——握手协商密钥，之后对称加密传输；防窃听、篡改（证书校验防中间人）。

**深入：**

> ##### TLS 握手（简化）

1. Client Hello（支持的 cipher、随机数）
2. Server Hello + **证书**（含公钥）
3. 客户端验证证书链（CA）→ 生成 premaster → 用公钥加密发给服务器
4. 双方派生会话密钥 → **对称加密**传输 HTTP

> ##### iOS 实践

- **ATS**（App Transport Security）默认要求 HTTPS
- **`URLSession`** 自动 TLS；自签证书需 `URLSessionDelegate` 处理 `didReceive challenge`
- **Certificate Pinning** 固定公钥/证书防抓包中间人

## 音视频相关

被问频率：一般（3/5）

**初级理解：** iOS 音视频栈——**AVFoundation**（采集/编解码/播放）、**VideoToolbox**（硬编硬解）、**AudioUnit / AVAudioEngine**（音频处理）。

**深入：**

| 模块 | 用途 |
| --- | --- |
| **AVPlayer / AVPlayerItem** | 点播、HLS 流媒体 |
| **AVCaptureSession** | 相机/麦克风采集 |
| **AVAssetReader/Writer** | 转码、剪辑 |
| **VideoToolbox** | H.264/H.265 硬件编解码 |
| **AudioUnit** | 低延迟音频（K 歌、通话） |

- **同步：** 音视频 PTS/DTS、时钟 `CMTime`
- **性能：** 硬解优先；大文件流式读；列表缩略图异步解码 + 缓存

## iOS Animation

被问频率：一般（3/5）

**初级理解：** **UIKit** 动画分 **UIView 动画**（属性动画）和 **Core Animation**（图层树，GPU 加速）。

**深入：**

| API | 说明 |
| --- | --- |
| `UIView.animate` | 块动画，改 frame/alpha/transform |
| **`CABasicAnimation`** | 单属性动画 |
| **`CAKeyframeAnimation`** | 关键帧 |
| **`CATransition`** | 转场 |
| **`CADisplayLink`** | 与屏幕刷新同步，逐帧 |

## 显式动画与隐式动画

被问频率：一般（3/5）

**初级理解：** 改 `CALayer` 属性默认带 **隐式动画**（通过 `actionForKey:`）；**显式动画** 手动 add `CAAnimation` 到 layer。

**深入：**

- **隐式：** `layer.cornerRadius = 20` 可能有动画（除非 `CATransaction.setDisableActions(true)`）
- **显式：** 创建 `CABasicAnimation`，设置 `fromValue`/`toValue`，`layer.add(animation, forKey:)`
- **`UIView.animate`** 底层封装 CA 显式动画

## 为什么必须在主线程操作 UI

被问频率：较高（4/5）

**初级理解：** UIKit / AppKit **非线程安全**——视图树、布局、渲染状态只在主线程一致；子线程改 UI 可能 crash 或画面错乱。

**深入：**

- 主线程 RunLoop 驱动事件与 **Core Animation** 提交渲染
- 布局 `setNeedsLayout` / `layoutSubviews` 假定主线程
- Apple 文档明确：**UI 操作必须在 main thread**
- 后台线程仅做数据，结果 `DispatchQueue.main.async` 更新

## 列表页性能优化

被问频率：较高（4/5）

**初级理解：** 核心是 ** cell 复用 + 异步加载 + 减少主线程工作**。

**深入：**

| 手段 | 说明 |
| --- | --- |
| **Cell 复用** | `dequeueReusableCell`，禁止 `reloadData` 滥用 |
| **高度缓存** | 预算 cell 高度，避免 `automaticDimension` 全量算 |
| **异步解码** | 图片后台 decode 再主线程设 `image` |
| **预加载** | `prefetchDataSource` |
| **离屏渲染** | 避免圆角+阴影+mask 叠加；用图片圆角或 `cornerRadius`+`masksToBounds` 权衡 |
| **Diff** | `UITableViewDiffableDataSource` / IGListKit 局部刷新 |

## 多个网络请求 ABC 完成再执行 D

被问频率：较高（4/5）

**初级理解：** 用 **DispatchGroup**、**Operation 依赖** 或 **async/await TaskGroup** 等多任务完成后再执行汇总。

::: details GCD Group

```swift
let group = DispatchGroup()
var a, b, c: Result?

group.enter(); fetchA { a = $0; group.leave() }
group.enter(); fetchB { b = $0; group.leave() }
group.enter(); fetchC { c = $0; group.leave() }

group.notify(queue: .main) {
    executeD(a: a, b: b, c: c)
}
```

:::

::: details Swift async/await

```swift
func loadAll() async {
    async let ra = fetchA()
    async let rb = fetchB()
    async let rc = fetchC()
    let (a, b, c) = await (ra, rb, rc)
    await executeD(a, b, c)
}
```

:::

## 设计一个数据库（思路）

被问频率：一般（2/5）

**初级理解：** 移动端常用 **SQLite**（Core Data / FMDB / GRDB）或 **Realm**；设计需表结构、索引、迁移、线程策略。

**深入：**

> ##### 设计要点

1. **实体与关系** — 用户、订单、一对多外键
2. **范式** — 适度反范式换查询性能
3. **索引** — 高频 WHERE / JOIN 字段建索引
4. **迁移** — 版本号 + `ALTER` / 重建表
5. **线程** — SQLite 单写多读；写操作串行 queue
6. **缓存层** — 内存 LRU + 磁盘持久化

> ##### iOS 选型

| 方案 | 特点 |
| --- | --- |
| **Core Data** | Apple 官方 ORM，对象图 |
| **GRDB / FMDB** | 直接 SQL，可控 |
| **Realm** | 对象数据库，易用 |
| **SwiftData** | iOS 17+，声明式 |

## GET 和 POST 区别

被问频率：一般（3/5）

**初级理解：** HTTP 两种常用方法——**GET** 取资源、参数在 URL；**POST** 提交 body、可带大量/敏感数据。

**深入：**

| 维度 | GET | POST |
| --- | --- | --- |
| 语义 | 查询（幂等） | 提交/创建 |
| 参数 | Query String | Body（form/json） |
| 缓存 | 可缓存 | 一般不缓存 |
| 书签 | URL 可收藏 | 不可 |
| 长度 | URL 有限制 | Body 可很大 |
| 安全 | 参数暴露在 URL | 相对隐蔽（仍须 HTTPS） |

- **REST：** GET 读、POST 建、PUT 全量更新、PATCH 部分、DELETE 删

## 面向对象六大原则

被问频率：一般（2/5）

**初级理解：** **SOLID** 五原则 + 常见补充 **迪米特法则（LoD）**。

**深入：**

| 原则 | 含义 |
| --- | --- |
| **S** 单一职责 | 一个类只做一件事 |
| **O** 开闭 | 对扩展开放，对修改关闭 |
| **L** 里氏替换 | 子类可替换父类 |
| **I** 接口隔离 | 接口细粒度，不强迫实现无用方法 |
| **D** 依赖倒置 | 依赖抽象而非具体 |
| **LoD** 迪米特 | 少了解对象内部，只与直接朋友通信 |

## OC 内联函数 inline

被问频率：低（1/5）

**初级理解：** `static inline` 建议编译器 **函数调用处展开**，减少栈开销；C/OC 常用在 `.h` 宏替代。

**深入：**

- **优点：** 消除调用开销，类似宏但类型安全
- **缺点：** 代码膨胀；不能取函数地址；调试困难
- **OC 方法** 默认 **动态派发**，不能 inline；C 函数 / `static inline` 在 `.h` 可以
- Swift `@inline(__always)` 类似概念

## 实现 setter 方法

被问频率：一般（2/5）

**初级理解：** 手动 setter 在赋值前后做校验、KVO、拷贝等；Swift 用 `didSet`/`willSet` 替代多数场景。

::: details OC 手动 setter

```objc
- (void)setName:(NSString *)name {
    if (_name == name) return;
    [_name release];
    _name = [name copy];
}
```

:::

::: details Swift

```swift
var name: String {
    willSet { print("will set \(newValue)") }
    didSet { print("was \(oldValue)") }
}
```

:::

## 写一个单例

被问频率：一般（3/5）

::: details Swift 线程安全单例

```swift
final class NetworkManager {
    static let shared = NetworkManager()
    private init() {}

    // 或 GCD once：
    // static let shared: NetworkManager = {
    //     DispatchQueue.once(token: ...) { NetworkManager() }
    // }()
}
```

:::

- **避免：** 单例里堆业务状态；测试困难；隐式全局依赖

---

## 算法与 coding 题

### 判断字符串是否是有效 IP 地址

被问频率：一般（3/5）

**初级理解：** IPv4 四段 0–255，用 `.` 分隔；IPv6 更复杂，面试常考 IPv4。

::: details Swift IPv4

```swift
func isValidIPv4(_ s: String) -> Bool {
    let parts = s.split(separator: ".", omittingEmptySubsequences: false)
    guard parts.count == 4 else { return false }
    for part in parts {
        guard !part.isEmpty, part.count <= 3,
              part.allSatisfy(\.isNumber),
              let n = Int(part), n >= 0, n <= 255 else { return false }
        if part.count > 1 && part.first == "0" { return false } // 前导零
    }
    return true
}
```

:::

### 大数加法

被问频率：一般（3/5）

**初级理解：** 模拟竖式，从低位相加，进位传递；字符串或数组存 digit。

::: details 字符串大数加

```swift
func bigAdd(_ a: String, _ b: String) -> String {
    let ca = Array(a.reversed()), cb = Array(b.reversed())
    var carry = 0, result = "", i = 0
    while i < ca.count || i < cb.count || carry > 0 {
        let da = i < ca.count ? Int(String(ca[i]))! : 0
        let db = i < cb.count ? Int(String(cb[i]))! : 0
        let sum = da + db + carry
        result.append(String(sum % 10))
        carry = sum / 10
        i += 1
    }
    return String(result.reversed())
}
```

:::

### 删除单链表中一个元素

::: details

```swift
class ListNode {
    var val: Int
    var next: ListNode?
    init(_ val: Int) { self.val = val }
}

func deleteNode(_ head: ListNode?, _ val: Int) -> ListNode? {
    let dummy = ListNode(0)
    dummy.next = head
    var prev: ListNode? = dummy
    while let cur = prev?.next {
        if cur.val == val {
            prev?.next = cur.next
            break
        }
        prev = cur
    }
    return dummy.next
}
```

:::

### 从字符串中得到一个整数

::: details

```swift
func myAtoi(_ s: String) -> Int {
    Int(s.trimmingCharacters(in: .whitespaces)) ?? 0
    // 面试版需处理符号、溢出、前导空格 → 类似 LeetCode 8
}
```

:::

### 数组去重

::: details

```swift
// 保序
func unique<T: Hashable>(_ arr: [T]) -> [T] {
    var seen = Set<T>(), result: [T] = []
    for x in arr where seen.insert(x).inserted { result.append(x) }
    return result
}
// Swift: Array(Set(arr)) 不保序
```

:::

### 统计字符数组中每个字符出现次数

::: details

```swift
func charCount(_ chars: [Character]) -> [Character: Int] {
    chars.reduce(into: [:]) { $0[$1, default: 0] += 1 }
}
```

:::

### 反转二叉树

::: details

```swift
class TreeNode {
    var val: Int
    var left, right: TreeNode?
    init(_ val: Int) { self.val = val }
}

func invertTree(_ root: TreeNode?) -> TreeNode? {
    guard let root else { return nil }
    (root.left, root.right) = (root.right, root.left)
    invertTree(root.left)
    invertTree(root.right)
    return root
}
```

:::

### 如何获取 VC 上所有的 Button

::: details

```swift
extension UIView {
    func allSubviews<T: UIView>(of type: T.Type) -> [T] {
        subviews.flatMap { view -> [T] in
            [view as? T].compactMap { $0 } + view.allSubviews(of: type)
        }
    }
}
// vc.view.allSubviews(of: UIButton.self)
```

:::

### 排序算法有哪些

被问频率：一般（3/5）

| 算法 | 平均 | 最坏 | 空间 | 稳定 |
| --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | ✅ |
| 选择 | O(n²) | O(n²) | O(1) | ❌ |
| 插入 | O(n²) | O(n²) | O(1) | ✅ |
| 快排 | O(n log n) | O(n²) | O(log n) | ❌ |
| 归并 | O(n log n) | O(n log n) | O(n) | ✅ |
| 堆排序 | O(n log n) | O(n log n) | O(1) | ❌ |

- iOS 开发：`sort()` 内省排序 O(n log n)；小数组可能插入排序

### 字符串是否都是数字

::: details

```swift
func isAllDigits(_ s: String) -> Bool {
    !s.isEmpty && s.allSatisfy(\.isNumber)
    // 或 CharacterSet.decimalDigits.isSuperset(of: CharacterSet(charactersIn: s))
}
```

:::

### 合并两个有序数组

::: details 双指针（LeetCode 88 变体）

```swift
func merge(_ nums1: inout [Int], _ m: Int, _ nums2: [Int], _ n: Int) {
    var i = m - 1, j = n - 1, k = m + n - 1
    while j >= 0 {
        if i >= 0 && nums1[i] > nums2[j] {
            nums1[k] = nums1[i]; i -= 1
        } else {
            nums1[k] = nums2[j]; j -= 1
        }
        k -= 1
    }
}
```

:::
