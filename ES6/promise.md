# Promise与异步编程
JS 最强大的一方面就是它能及其轻易地处理异步编程。作为因互联网而生的语言，JS 从一开始就必须能够响应点击或按键之类的用户交互行为。Node.js 通过使用回调函数来代替事件，进一步推动了 JS 中的异步编程。

### 异步编程背景
JS 引擎建立在单线程事件循环的概念上。单线程（**Single-threaded**）意味着同一时刻只能执行一段代码，与 JAVA 或 C++ 这种允许同时执行多段不同代码的多线程语言形成了反差。

JS 引擎在同一时刻只能执行一段代码，所以引擎无须留意那些“可能”运行的代码。代码会被放置在作业队列（**job queue**）中，每当一段代码准备被执行，它就会被添加到作业队列。当 JS 引擎结束当前代码的执行后，事件循环就会执行队列中的下一个作业。事件循环（**event loop**）是 JS 引擎的一个内部处理线程，能监视代码的执行并管理作业队列。要记住既然是一个队列，作业就会从队列中的第一个开始，依次运行到最后一个。

###### 事件模型
当用户点击一个按钮或按下键盘上的一个键时，一个事件（**event**）————例如 `onclick` ————就被触发了。该事件可能会对此交互进行响应，从而将一个新的作业添加到作业队列的尾部。这就是 JS 关于异步编程的最基本形式。事件处理程序代码直到事件发生后才会被执行，此时它会拥有合适的上下文。

###### 回调模式
当 **Node.js** 被创建时，它通过普及回调函数编程模式提升了异步编程模型。回调函数模式类似于事件模型，因为异步代码也会在后面的一个时间点才执行。不同之处在于需要调用的函数（即回调函数）是作为参数传入的。

### Promise 基础
**Promise** 是为异步操作的结果所准备的占位符。函数可以返回一个 **Promise** ，而不必订阅一个事件或向函数传递一个回调参数。

### Promise 的生命周期
每个 **Promise** 都会经历一个短暂的生命周期，初始为 **pending state** ，这表示异步操作尚未结束。一个挂起的 **Promise** 也被认为是 **unsettled** 。一旦异步操作结束 **Promise** 就会被认为是 **settled** ， 并进入两种可能状态之一：
1. **fulfilled**：**Promise** 的异步操作已成功结束。
2. **rejected**：**Promise** 的异步操作未成功结束，可能是一个错误，或有其他原因导致。

内部的 ``[[PromiseState]]`` 属性会被设置为 `pending`、 `fulfilled` 或者 `rejected` ，以反映 **Promise** 的状态。该属性并未在 **Promise** 对象上被暴露出来，因此无法在编程方式判断 **Promise** 到底处于哪种状态。不过可以使用 `then()` 方法在 **Promise** 的状态改变时执行一些特定操作。

`then()` 方法在所有的 **Promise** 上都存在，并且接受两个参数。第一个参数是 **Promise** 被完成时要调用的函数，与异步操作关联的任何附加数据都会被传入这个完成函数。第二个参数则是 **Promise** 被拒绝时要调用的函数，与完成函数相似，拒绝函数会被传入与拒绝相关联的任何附加数据。

用这种方式实现 `then()` 方法的任何对象都被称为一个 **thenable** 。所有的 **Promise** 都是 **thenable** ，反之则未必成立。

`then()` 调用如下：
```js
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, 1000)
    })

    // 同时监听 成功与失败
    promise.then(
        data => {
            // 完成
            console.log(data)
        },
        err => {
            // 拒绝
            console.log(err)
        }
    )

    // 只监听成功
    promise.then(data => {
        // 完成
        console.log(data)
    })

    // 只监听失败
    promise.then(null, err => {
        // 拒绝
        console.log(err)
    })
```

**Promise** 也具有一个 `catch()` 方法，其行为等同于只传递拒绝处理函数给 `then()` 。如下：
```js
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("error")
        }, 1000)
    })

    // 只监听失败
    promise.then(null, err => {
        // 拒绝
        console.log(err)
    })

    // 监听失败
    promise.catch(err => {
        // 拒绝
        console.log(err)
    })
```

`then()` 与 `catch()` 背后的意图是让你组合使用它们来正确处理异步操作的结果。

### 创建未决的 **Promise**
新的 **Promise** 使用 `Promise` 构造器来创建。此构造器接受单个参数：一个被称为执行器（**executor**）的函数，包含初始化 Promise 的代码。该执行器会被传递两个名为 `resolve()` 与 `reject()` 的函数作为参数。 `resolve()` 函数在执行器成功时调用，`reject()` 函数则表明执行器操作已失败。

如下：
```js
    function promise(err) {
        return new Promise((resolve, reject) => {
            if(err) {
                reject(err)
            }else {
                resolve(1)
            }
        })
    }

    promise(false)
        .then(data => {
            console.log("data1", data)
        })
        .catch(err => {
            console.log("err1", err)
        })

    promise(Error(1))
        .then(data => {
            console.log("data2", data)
        })
        .catch(err => {
            console.log("err2", err)
        })
```

Promise 的执行器会立即执行，是同步的。调用 `resolve()` 触发的是一个异步操作。传递给 `then()` 与 `catch()` 的函数会异步地被执行，并且它们也被添加到了作业队列（先进队列再执行）。

如下：
```js
    const promise = new Promise((resolve, reject) => {
        console.log(1)
        resolve()
    })

    promise.then(() => {
        console.log(2)
    })

    console.log(3)

    // 输出
    // 1
    // 3
    // 2
```

### 创建已决的 Promise
基于 **Promise** 执行器行为的动态本质， `Promise` 构造器就是创建未决的 **Promise** 的最好方式。但若你想让一个 **Promise** 代表一个已知的值，那么安排一个单纯传值给 `resolve()` 函数的作业并没有意义。相反，有两种方法可使用指定值来创建已决的 Promise。

###### 使用 **Promise.resolve()**
`Promise.resolve()` 方法接受单个参数并返回一个处于完成态的 **Promise** 。这意味着没有任何作业调度会发生，并且只需要向 **Promise** 添加一个或更多的完成处理函数来提取这个参数值。

如下：
```js
    const promise = Promise.resolve(1)

    promise.then(data => {
        console.log(data)   // 1
    })
```

### 使用 Promise.reject()
使用 `Promise.reject()` 方法来创建一个已拒绝的 **Promise** 。

如下：
```js
    const promise = Promise.reject(1)

    promise.catch(err => {
        console.log(err)   // 1
    })
```

> 若你传递一个 `Promise` 给 `Promise.resolve()` 或 `Promise.reject()` 方法，该 `Promise` 会不作修改原样返回。

### 执行器错误
如果在执行器内部抛出错误，那么 Promise 的拒绝处理函数就会被调用。

如下：
```js
    let promise = new Promise((resolve, reject) => {
        throw new Error("error")
    })

    promise.catch(err => {
        console.log(err) // error
    })
```

在每个执行器之内并没有显式的 `try-catch` ，因此错误就被捕捉并传递给了拒绝处理函数。上述例子等价于：
```js
    const promise = new Promise((resolve, reject) => {
        try {
            throw new Error("error")
        }catch (err) {
            reject(err)
        }
    })

    promise.catch(err => {
        console.log(err) // error
    })
```

### 全局的 Promise 拒绝处理
**Promise** 最有争议的方面之一就是：当一个 **Promise** 被拒绝时若缺少拒绝处理函数，就会静默失败。

由于 **Promise** 的本质，判断一个 **Promise** 的拒绝是否已被处理并不直观。如下：
```js
    let rejected = Promise.reject(42)

    // 在此刻 rejected 不会被处理

    // 一段时间后……
    rejected.catch(function(value) {
        // 现在 rejected 已经被处理了
        console.log(value)
    })
```

无论 **Promise** 是否已被解决，你都可以在任何时候调用 `then()` 或 `catch()` 并使它们正确工作，这导致我们很难准确知道一个 **Promise** 何时会被处理。

虽然下个版本的 ES 可能会处理此问题，不过浏览器与 Node.js 已经实施了变更来解决开发者
的这个痛点。/*这里只介绍 浏览器解决方案，Node.js会在node笔记中提到。*/

### 浏览器的拒绝处理
浏览器能触发两个事件，来帮助识别未处理的拒绝。这两个事件会被 `window` 对象触发，并完全等效于 **Node.js** 的相关事件：
+ `unhandledrejection`：当一个 **Promise** 被拒绝、而在事件循环的一个轮次中没有任何拒绝处理函数被调用，该事件就会被触发。
+ `rejectionHandled`：若一个 **Promise** 被拒绝、并在事件循环的一个轮次之后再有拒绝处理函数被调用，该事件就会被触发。

浏览器事件的处理函数会接收到包含下列属性的一个对象：
+ `type`：事件的名称（ `"unhandledrejection"` 或 `"rejectionhandled"` ）；
+ `promise`：被拒绝的 **Promise** 对象；
+ `reason`：**Promise** 中的拒绝值（拒绝原因）。

浏览器的实现中存在的另一个差异就是：拒绝值（ `reason` ）在两种事件中都可用。

如下：
```js
    let rejected = null

    window.onunhandledrejection = function(event) {
        console.log(event.type) // unhandledrejection
        console.log(event.reason.message) // error
        console.log(rejected === event.promise) // true
    }

    window.onrejectionhandled = function(event) {
        console.log(event.type) // rejectionhandled
        console.log(event.reason.message) // error
        console.log(rejected === event.promise) // true
    }

    rejected = Promise.reject(new Error("error"))

    setTimeout(() => {
        console.log("setTimeout") // setTimeout
        rejected.catch(err => {})
    }, 3000)
```

以下代码在浏览器中追踪未被处理的拒绝：
```js
    let possiblyUnhandledRejections = new Map()

    // 当一个拒绝未被处理，将其添加到 Map

    window.onunhandledrejection = function(event) {
        possiblyUnhandledRejections.set(event.promise, event.reason)
    }

    window.onrejectionhandled = function(event) {
        possiblyUnhandledRejections.delete(event.promise, event.reason)
    }

    setInterval(function() {
        console.log("循环处理")
        possiblyUnhandledRejections.forEach((reason, promise) => {
            console.log(reason.message ? reason.message : reason)
        })

        possiblyUnhandledRejections.clear()
    }, 60000)

    let index = 0
    let clear = setInterval(function() {
        Promise.reject(`index${++index}`)

        if(index == 5) {
            clearInterval((clear))
        }
    }, 1000)
```

### 串联 Promise
每次对 `then()` 或 `catch()` 的调用实际上创建并返回了另一个 `Promise` ，仅当前一个 `Promise` 被完成或拒绝时，后一个 `Promise` 才会被决议。

如下：
```js
    const promise = new Promise((resolve, reject) => {
        resolve(1)
    })

    promise.then(data => {
        console.log(data)
    }).then(() => {
        console.log(2)
    })
```

### 捕获错误
Promise 链允许你捕获前一个 Promise 的完成或拒绝处理函数中发生的错误。

如下：
```js
    const promise = new Promise((resolve, reject) => {
        throw new Error("error1")
    })

    promise.catch(err => {
        console.log(err) // error1
        throw new Error("error2")
    }).catch(err => {
        console.log(err) // error2
    })
```

链式 `Promise` 调用能察觉到链中其他 `Promise` 中的错误。

### 在 Promise 链中返回值
Promise 链的另一个重要方面是能从一个 Promise 传递数据给下一个 Promise 的能力。我们只需要指定完成处理函数的返回值，以便沿着一个链继续传递数据。

如下：
```js
    const promise = new Promise((resolve, reject) => {
        resolve(1)
    })

    promise.then(data => {
        console.log(data) // 1
        return ++data
    }).then(data => {
        console.log(data) // 2
        return ++data
    }).then(data => {
        console.log(data) // 3
        return ++data
    }).then(data => {
        console.log(data) // 4
    })
```

### 在 Promise 链中返回 Promise
从完成或拒绝处理函数中返回一个基本类型值，能够在 Promise 之间传递数据，但如果我们返回的是一个 Promise 呢？那么需要采取一个额外步骤来决定如何处理。

如下：
```js
    const promise = new Promise((resolve, reject) => {
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        resolve(40)
    })

    promise.then(data => {
        console.log(data) // 1
        return promise2
    }).then(data => {
        console.log(data) // 40
    })
```

上述的例子意味着，第二个完成处理函数会等到第一个完成处理函数返回的 `promise2` 执行完毕才会调用，第二个处理函数取到的值实际上是 `promise2` 完成后 `resolve` 的值。不过如果 `promise2` 是被拒绝了，情况会稍微有一点不同。如下：
```js
    const promise = new Promise((resolve, reject) => {
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        reject(40)
    })

    promise.then(data => {
        console.log(data) // 1
        return promise2
    }).then(data => {
        // 不会被执行
        console.log(data)
    })
```

由于 `promise2` 被拒绝了，第二个完成处理函数就永不被调用。不过你可以改为对其附加一个拒绝处理函数：
```js
    const promise = new Promise((resolve, reject) => {
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        reject(40)
    })

    promise.then(data => {
        console.log(data) // 1
        return promise2
    }).then(data => {
        // 不会被执行
        console.log(data)
    }).catch(err => {
        console.log(err) // 40
    })
```

### 响应多个 Promise
**ES6** 提供了能监视多个 `Promise` 的两个方法：`Promise.all()` 与 `Promise.race()` 。


###### Promise.all() 方法
`Promise.all()` 方法接收单个可迭代对象（如数组）作为参数，并返回一个 Promise。这个可迭代对象的元素都是 `Promise` ，只有在它们都完成后，所返回的 **Promise** 才会被完成。

如下：
```js
    const promise1 = new Promise((resolve, reject) => {
        console.log(1)
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            resolve(2)
        }, 3000)
    })

    const promise3 = new Promise((resolve, reject) => {
        console.log(3)
        resolve(3)
    })

    const promise4 = Promise.all([ promise1, promise2, promise3 ])

    promise4.then(data => {
        console.log("----------------------")
        console.log(data) // 三秒后打印：[ 1, 2, 3 ]
    })
```

但是如果传递给 `Promise.all()` 的任意 **Promise** 被拒绝了，那么方法所返回的 **Promise** 就会立刻被拒绝，而不必等待其他的 **Promise** 结束。

如下：
```js
    const promise1 = new Promise((resolve, reject) => {
        console.log(1)
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            resolve(2)
        }, 3000)
    })

    const promise3 = new Promise((resolve, reject) => {
        console.log(3)
        reject(3)
    })

    const promise4 = Promise.all([ promise1, promise2, promise3 ])

    promise4.catch(err => {
        console.log("----------------------")
        console.log(err) // 3
    })
```

!> 虽然 `promise4` 的拒绝函数立刻被调用了，但是 `promise2` 实际上还是会继续执行的。

###### Promise.race() 方法
与等待所有 **Promise** 完成的 `Promise.all()` 方法不同，在来源 **Promise** 中任意一个被完成时， `Promise.race()` 方法所返回的 **Promise** 会立刻做出响应。

如下：
```js
    const promise1 = new Promise((resolve, reject) => {
        console.log(1)
        resolve(1)
    })

    const promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            resolve(2)
        }, 3000)
    })

    const promise3 = new Promise((resolve, reject) => {
        console.log(3)
        resolve(3)
    })

    const promise4 = Promise.race([ promise1, promise2, promise3 ])

    promise4.then(data => {
        console.log("----------------------")
        console.log(data) // 1
    })
```

简单来说传递给 `Promise.race()` 的 **Promise** 其实就像在赛跑一样，看哪个首先到重点。如果最先到达重点的 `Promise` 是被完成状态，则返回的新 **Promise** 也会被完成；如果是被拒绝的，则返回的也是被拒绝的。

如下：
```js
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
           console.log(1)
            resolve(1)
        }, 1000)
    })

    const promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            resolve(2)
        }, 3000)
    })

    const promise3 = new Promise((resolve, reject) => {
        console.log(3)
        reject(3)
    })

    const promise4 = Promise.race([ promise1, promise2, promise3 ])

    promise4.catch(err => {
        console.log("----------------------")
        console.log(err) // 3
    })
```

### 继承 Promise
像其他内置类型一样，我们也可以将 **Promise** 作为一个派生类的基类。进行自定义的 **Promise** ，在内置的 **Promise** 的基础上扩展功能。

如下：
```js
    class MyPromise extends Promise {
        // 使用默认构造器
        success(resolve, reject) {
            return this.then(resolve, reject)
        }

        failure(reject) {
            return this.catch(reject)
        }
    }

    const promise1 = new MyPromise((resolve, reject) => {
        resolve(1)
    })

    promise1.then(data => {
        console.log(data) // 1
    })

    const promise2 = MyPromise.resolve(2)

    promise2.then(data => {
        console.log(data) // 2
    })

    const promise3 = MyPromise.resolve(3)

    promise3.success(data => {
        console.log(data) // 3
    })
```

### 异步任务运行
前面使用了生成器，实现了一个异步任务运行器，现在我们使用 **Promise** 改造一下。

如下：
```js
    function run(taskDef) {
        let task = taskDef()

        let result = task.next()

        function step() {
            if(!result.done) {
                let promise = Promise.resolve(result.value)

                promise.then(data => {
                    console.log(data)
                    result = task.next(data)
                    step()
                }).catch(err => {
                    console.log(err)
                    result = task.throw(err)
                    step()
                })
            }
        }
        step()
    }

    const iterator = function* () {
        let content = yield 1
        content = yield content + 1
        content = yield new Error(content + 1)
        content = yield 4
    }

    run(iterator)

    // 输出
    // 1
    // 2
    // Error: 3
    // 4
```