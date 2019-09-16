# 代理与反射接口
<!-- **ES5** 与 **ES6** 都推进了 **JS** 功能的公开。例如，**JS** 运行环境包含一些不可枚举、不可写入的对象属性，然而在 **ES5** 之前我们无法定义它们自己的不可枚举属性或者不可写入属性。 -->
**ES6** 为了让开发者能进一步接近 **JS** 引擎的能力，这些能力原先只存在于内置对象上。JS通过代理（**proxy**）暴露了在对象上的内部工作，代理是一种封装，能够拦截并改变 **JS** 引擎的底层操作。

<!-- ### 数组的问题
在 **ES6** 之前， **JS** 的数组对象拥有特定的行为方式，无法被开发者在自定义对象中进行模拟。当 -->

### 代理与反射是什么？
通过调用 `new proxy()` ，我们可以创建一个代理用来代替另一个对象（被称为代理目标），这个代理对目标对象进行了虚拟，因此该代理与该目标对象表面上可以被当作同一个对象来对待。

代理允许你拦截在目标对象上的底层操作，而这原本是 **JS** 引擎的内部能力。拦截行为使用了一个能够响应特定操作的函数（被称为陷阱）。

被 `Reflect` 对象所代表的反射接口，是给底层操作提供默认行为的方法的集合，这些操作是能够被代理重写的。每个代理陷阱都有一个对应的反射方法，每个方法都与对应的陷阱函数同名，并且接收的参数也与之一致。并且接收的参数也与之一致。下表总结了这些行为：

> ![Reflect](/img.png) 

### 创建一个简单的代理
当使用 `Proxy` 构造器来创建一个代理时，需要传递两个参数：目标对象以及一个处理器（**handler**），后者是定义了一个或多个陷阱函数的对象。如果未提供陷阱函数，代理会对所有操作采取默认行为。

为了创建一个仅进行传递的代理，你需要使用不包含任何陷阱函数的处理器：
```js
    let target = {}
    let proxy = new Proxy(target, {})

    proxy.name = "proxy"
    console.log(proxy.name)  // proxy
    console.log(target.name) // proxy

    proxy.name = "target"
    console.log(proxy.name)  // target
    console.log(target.name) // target
```

该例中的 `proxy` 代理对象进行的所有操作最终都会传递给 `target` 目标对象。因此当我们为 `proxy` 代理对象添加 `name` 属性时，`target` 目标对象也会进行相应的变化。当然，缺少陷阱函数的代理没有什么用处，但是如果我们为它定义一个陷阱函数呢？

### 使用 set 陷阱函数验证属性值
假如我们想要创建一个对象，并且规定该对象的属性值必须是数值，这就意味着我们每次新增属性的时候都要进行验证，并且在属性值不为数值类型的时候抛出错误。

我们可以使用 `set` 陷阱函数来重写设置属性值时的默认行为，该陷阱函数能接受四个参数：
1. `trapTarget`：将接收属性的对象（即代理的目标对象）；
2. `key`：需要写入的属性的键（字符串类型或符号类型）；
3. `value`：将被写入属性的值；
4. `receiver`：操作发生的对象（通常是代理对象）；

`Reflect.set()` 是 `set` 陷阱函数对应的反射方法，同时也是 `set` 操作的默认行为。
`Reflect.set()` 方法与 `set` 陷阱函数一样，能接受这四个参数，让该方法能在陷阱函数内部被方便使用。。该陷阱函数需要在属性被设置完成的情况下返回 `true` ，否则就要返回 `false`，而 `Reflect.set()` 也会基于操作是否成功而返回相应的结果。

如下：
```js
    let target = {
        name: "target"
    }

    let proxy = new Proxy(target, {
        set(trapTarget, key, value, receiver) {
            // 忽略已有属性，避免影响它们
            if(!trapTarget.hasOwnProperty(key)) {
                if(isNaN(value)) {
                    throw new TypeError("Property must be a number.")
                }
            }

            // 添加属性
            return Reflect.set(trapTarget, key, value, receiver)
        }
    })

    // 添加一个新属性，且添加的属性值为 number 类型
    proxy.count = 1
    console.log(proxy.count)  // 1
    console.log(target.count) // 1

    // 为已存在属性 name 赋值一个非数值类型的值
    proxy.name = "name"
    console.log(proxy.name)  // name
    console.log(target.name) // name

    // 抛出错误
    proxy.num = "num"
```

这段代码定义了一个代理陷阱，用于对 `target` 对象新增属性的值进行验证。此代码只验证新增属性的值，当我们为新增值添加一个非 `Number` 类型的值时，会抛出错误。

使用 `set` 代理陷阱允许我们在写入属性值的时候进行拦截，而 `get` 代理陷阱则允许我们在读取属性值的时候进行拦截。

### 使用 get 陷阱函数进行对象外形验证
**JS** 语言有趣但有时却令人困惑的特性之一，就是读取对象不存在的属性时并不会抛出错误，而是会把 `undefined` 当作该属性的值。

如下：
```js
    let obj = {}
    console.log(obj.name) // undefined
```

对象外形（**Object Shape**）指的是对象已有的属性与方法的集合。使用 `get` 陷阱函数，该陷阱函数会在读取属性时被调用，即使该属性在对象中并不存在，它能接受三个参数：
1. `trapTarget`：将接收属性的对象（即代理的目标对象）；
2. `key`：需要读取的属性的键（字符串类型或符号类型）；
3. `receiver`：操作发生的对象（通常是代理对象）；

`Reflect.get()` 方法同样接收这三个参数，并且默认会返回属性的值。

我们可以通过 `get` 陷阱函数与 `Reflect.get()` 方法在目标属性不存在时抛出错误。如下：
```js
    let target = {
        name: "target"
    }

    let proxy = new Proxy(target, {
        get(tarpTarget, key, receiver) {
            if(!(key in receiver)) {
                throw new TypeError("Property " + key + " doesn't exist.")
            }
            
            return Reflect.get(tarpTarget, key, receiver)
        }
    })

    console.log(proxy.name) // target

    // nme 属性不存在抛出错误
    console.log(proxy.nme)
```

在此处的例子中我们使用了 `in` 来判断 `receiver` 是否存在对应的属性，之所以使用 `receiver` 并没有使用 `tarpTarget`，而是用了 `in` ，这是因为 `receiver` 本身就是拥有一个 `has` 陷阱函数的代理对象，在此处使用 `trapTarget` 会跳过 `has` 陷阱函数数，并可能给你一个错误的结果。

### 使用 has 陷阱函数隐藏属性
`in` 运算符用于判定指定对象中是否存在某个属性，如果对象的属性名与指定的字符串或符号值想匹配，那么 `in` 运算符应当返回 `true`，无论该属性是对象自身的属性还是其原型的属性。

如下：
```js
    let obj1 = {
        name: "zzzhim"
    }

    let obj2 = Object.create(obj1)

    obj2.sex = "男"

    console.log("name" in obj2) // true
    console.log("sex" in obj2)  // true
```

`has` 陷阱函数会在使用 `in` 运算符的情况下被调用，并且会被传入两个参数：
1. `trapTarget`：需要读取属性的对象（即代理的目标对象）；
2. `key`：需要检查的属性的键（字符串类型或者符号类型）；

`Reflect.has()` 方法接受与之相同的参数，并向 `in` 运算符返回默认的响应结果。使用 `has` 陷阱函数以及 `Reflect.has()` 方法，允许你修改部分属性在接受 `in` 检测时的行为，但保留其他属性的默认行为。

如下，我们想要隐藏某个属性：
```js
    let target = {
        name: "target",
        value: 23
    }

    let proxy = new Proxy(target, {
        has(trapTarget, key) {
            if(key === "value") {
                return false
            }else {
                return Reflect.has(trapTarget, key)
            }
        }
    })

    console.log("value" in proxy)    // false
    console.log("name" in proxy)     // true
    console.log("toString" in proxy) // true
    console.log("valueOf" in proxy)  // true
```

我们使用 `has` 陷阱函数检测 `key` 的值是否为 `"value"`。如果是，则返回 `false`，否则返回默认结果。

### 使用 deleteProperty 陷阱函数避免属性被删除
`delete` 运算符能够从指定对象上删除一个属性，在删除成功时返回 `true` ，否则返回 `false`。如果试图用 `delete` 运算符去删除一个不可配置的属性，在严格模式下将会抛出错误；非严格模式下只是单纯返回 `false`。

如下：
```js
    let target = {
        name: "target",
        value: 23
    }

    Object.defineProperty(target, "name", {
        configurable: false
    })

    console.log("value" in target) // true

    let result1 = delete target.value;
    console.log(result1) // true

    console.log("value" in target) // false

    // 严格模式下抛错
    let result2 = delete target.name
    console.log(result2) // false
    console.log("name" in target) // true
```

`deleteProperty` 陷阱函数会在使用 `delete` 运算符去删除对象属性时下被调用，并且会被传入两个参数：
1. `tarpTarget`：需要删除属性的对象（即代理的目标对象）；
2. `key`：需要删除的属性的键（字符串类型或者符号类型）；

`Reflect.deleteProperty()` 方法也接受这两个参数，并提供了 `deleteProperty` 陷阱函数的默认实现。我们可以结合 `Reflect.deleteProperty()` 方法以及 `deleteProperty` 陷阱函数，来修改 `delete` 运算符的行为。

如下，我们使用它们确保 `value` 属性不能被删除：
```js
    let target = {
        name: "target",
        value: 23
    }

    let proxy = new Proxy(target, {
        deleteProperty(trapTarget, key) {
            if(key === "value") {
                return false
            }else {
                return Reflect.deleteProperty(trapTarget, key)
            }
        }
    })

    // 尝试删除 value 属性
    console.log("value" in proxy)   // true
    let result1 = delete proxy.value
    console.log(result1)            // false
    console.log("value" in proxy)   // true

    // 尝试删除 proxy.name
    console.log("name" in proxy)    // true
    let result2 = delete proxy.name
    console.log(result2)            // true
    console.log("name" in proxy)    // false
```

这段代码允许我们在严格模式下保护属性避免其被删除，并且不会抛出错误。

### 原型代理的陷阱函数
代理允许通过 `setPrototypeOf` 与 `getPrototypeOf` 陷阱函数来对这两个方法的操作进行拦截。`Object` 对象上的这两个方法都会调用代理中对应名称的陷阱函数，从而允许你改变这两个方法的行为。

由于存在着两个陷阱函数与原型代理相关联，因此分别有一组方法对应着每个陷阱函数。

`setPrototypeOf` 陷阱函数接受两个参数：
1. `tarpTarget`：需要设置原型的对象（即代理的目标对象）；
2. `proto`：被用作原型的对象；

`Object.setPrototypeOf()` 方法与 `Reflect.setPrototypeOf()` 方法会被传入相同的参数。另一方面， `getPrototypeOf` 陷阱函数只接受 `trapTarget` 参数， `Object.getPrototypeOf()` 方法与 `Reflect.getPrototypeOf()` 方法也是如此。

下面的例子通过返回 `null` 隐藏了代理对象的原型，并且使得该原型不可被修改：
```js
    let target = {}
    let proxy = new Proxy(target, {
        getPrototypeOf(trapTarget) {
            return null
        },
        setPrototypeOf(trapTarget, proto) {
            return false
        }
    })

    const proxyProto = Object.getPrototypeOf(proxy)


    console.log(proxyProto) // null

    // 抛出错误
    // Object.setPrototypeOf(proxy, {})
```