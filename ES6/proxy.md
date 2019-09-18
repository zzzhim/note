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

> 原文的例子如下：
> 下面这个例子通过返回 `null` 隐藏了代理对象的原型，并且使得该原型不可被修改：
```js
    let target = {};
    let proxy = new Proxy(target, {
        getPrototypeOf(trapTarget) {
            return null;
        },
        setPrototypeOf(trapTarget, proto) {
            return false;
        }
    });
    let targetProto = Object.getPrototypeOf(target);
    let proxyProto = Object.getPrototypeOf(proxy);
    console.log(targetProto === Object.prototype); // true
    console.log(proxyProto === Object.prototype); // false
    console.log(proxyProto); // null
    // 成功
    Object.setPrototypeOf(target, {});
    // 抛出错误
    Object.setPrototypeOf(proxy, {});
```
> 当我试图在控制台执行原文的例子时，Chrome浏览器会抛出 `'getPrototypeOf' on proxy: trap returned neither object nor null` ，原因是因为在 `getPrototypeOf` 返回了一个 `null`，具体为什么会抛出错误，我也没有找到原因。因此我在上述例子中稍微做了一些修改：

下面的例子通过返回原型为 `null` 的空对象，隐藏了代理对象的原型，并且使得该原型不可被修改：
```js
    let target = {}
    let proxy = new Proxy(target, {
        getPrototypeOf(trapTarget) {
            return Object.create(null)
        },
        setPrototypeOf(trapTarget, proto) {
            return false
        }
    })

    const proxyProto = Object.getPrototypeOf(proxy)

    console.log(proxyProto) // 原型为 `null` 的空对象

    // 抛出错误
    Object.setPrototypeOf(proxy, {})
```

如果我们想在两个陷阱函数中使用默认的行为，那么只需调用 `Reflect` 对象上的相应方法。如下：
```js
    let target = {}
    let proxy = new Proxy(target, {
        getPrototypeOf(trapTarget) {
            return Reflect.getPrototypeOf(trapTarget)
        },
        setPrototypeOf(trapTarget, proto) {
            return Reflect.setPrototypeOf(trapTarget, proto)
        }
    })

    let targetProto = Object.getPrototypeOf(target)
    let proxyProto =  Object.getPrototypeOf(proxy)

    console.log(targetProto === Object.prototype) // true
    console.log(proxyProto === Object.prototype)  // true

    // 成功
    Object.setPrototypeOf(target, {})
    // 同样成功
    Object.setPrototypeOf(proxy, {})
```

### 两组方法的不同之处
`Reflect.getPrototypeOf()` 和 `Reflect.setPrototypeOf` 虽然看起来与 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf` 很相似，但它们两个之间仍然有着显著差异。

首先 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf` 属于高级操作，从产生之初便已提供给开发者使用；而 `Reflect.getPrototypeOf()` 和 `Reflect.setPrototypeOf` 属于底层操作，允许开发者访问 `[[GetPrototypeOf]]` 与 `[[SetPrototypeOf]]` 这两个原先仅供语言内部使用的操作。

`Reflect.getPrototypeOf()` 方法是对内部的 `[[GetPrototypeOf]]` 操作的封装（并且附加了一些输入验证），而 `Reflect.setPrototypeOf()` 方法与 `[[SetPrototypeOf]]` 操作之间也有类似的关系。

虽然 `Object` 对象上的同名方法也调用了 `[[GetPrototypeOf]]` 与 `[[SetPrototypeOf]]` ，但它们在调用这两个操作之前添加了一些步骤、并检查返回值，以决定如何行动。

`Reflect.getPrototypeOf()` 方法在接收到的参数不是一个对象时会抛出错误，而 `Object.getPrototypeOf()` 则会在操作之前先将参数值转换为一个对象。如下：
```js
    const result = Object.getPrototypeOf(1)

    console.log(result === Number.prototype) // true

    // 抛错
    Reflect.getPrototypeOf(1)
```

`Reflect.setPrototypeOf()` 方法方法返回一个布尔值用于表示操作是否已成功，成功时返回 `true` ，失败时返回 `false`； `Object.setPrototypeOf()` 方法的操作失败时，它会抛出错误。`Object.setPrototypeOf()` 方法会将传入的第一个参数作为自身的返回值，因此并不适合用来实现 `setPrototypeOf` 代理陷阱的默认行为。如下：
```js
    let target1 = {}
    let result1 = Object.setPrototypeOf(target1, {})

    console.log(result1 === target1) // true

    let target2 = {}
    let result2 = Reflect.setPrototypeOf(target2, {})

    console.log(result2 === target2) // false
    console.log(result2) // true
```

### 对象可扩展性的陷阱函数
ES5 通过 `Object.preventExtensions()` 与 `Object.isExtensible()` 方法给对象增加了可扩展
性。

ES6 通过 `preventExtensions` 与 `isExtensible` 陷阱函数允许代理拦截对于底层对象的方法调用。这两个陷阱函数都接受名为 `trapTarget` 的单个参数，此参数代表方法在哪个对象上被调用。同时 `Reflect` 上面也存在对应的  `Reflect.preventExtensions()` 与 `Reflect.isExtensible()` 方法，用于实现默认的行为。这两个方法都返回布尔值，因此它们可以在对应的陷阱函数内直接使用。

> `Object.isExtensible()` 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。
>
> `Object.preventExtensions()` 方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。

###### 两个基本范例
下列代码实现了 `isExtensible` 与 `preventExtensions` 陷阱函数的默认行为。
```js
    let target = {}
    let proxy = new Proxy(target, {
        isExtensible(trapTarget) {
            return Reflect.isExtensible(trapTarget)
        },
        preventExtensions(trapTarget) {
            return Reflect.preventExtensions(trapTarget)
        }
    })

    console.log(Object.isExtensible(target)) // true
    console.log(Object.isExtensible(proxy)) // true

    // 正常运行
    Object.defineProperty(target, "name", { value: "zzzhim" })

    // 让对象变得不可扩展
    Object.preventExtensions(proxy)

    console.log(Object.isExtensible(target)) // false
    console.log(Object.isExtensible(proxy)) // false

    // 抛出错误：Cannot define property value, object is not extensible
    Object.defineProperty(target, "value", { value: 111 })
```

我们也可以在 `preventExtensions` 陷阱函数上返回 `false`，来让代理上的 `Object.preventExtensions()` 操作失败。如下：
> 原文代码如下：
```js
    let target = {}
    let proxy = new Proxy(target, {
        isExtensible(trapTarget) {
            return Reflect.isExtensible(trapTarget)
        },
        preventExtensions(trapTarget) {
            return false
        }
    })
    console.log(Object.isExtensible(target)) // true
    console.log(Object.isExtensible(proxy)) // true
    Object.preventExtensions(proxy)
    console.log(Object.isExtensible(target)) // true
    console.log(Object.isExtensible(proxy)) // true
```
> 此代码在 `Chrome` 和 `FireFox` 执行时分别会抛出 `'preventExtensions' on proxy: trap returned falsish at Function.preventExtensions ` 和 ` proxy preventExtensions handler returned false` 错误。

!> `Object.isExtensible()` 方法与 `Reflect.isExtensible()` 方法几乎一样，只在接收到的参数不是一个对象时才有例外。此时 `Object.isExtensible()` 总是会返回 `false` ，而 `Reflect.isExtensible()` 则会抛出一个错误。

### 属性描述符的陷阱函数
ES5 的最重要的特征之一就是引入了 `Object.defineProperty()` 方法用于定义属性的特征，它能让我们直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并且能让属性变成只读或是不可枚举的。我们还可以利用 `Object.getOwnPropertyDescriptor()` 方法检索这些特性。

代理允许我们使用 `defineProperty` 与 `getOwnPropertyDescriptor` 陷阱函数，来分别拦截对于 `Object.defineProperty()` 与 `Object.getOwnPropertyDescriptor()`。

`defineProperty` 陷阱函数接受下列三个参数：
1. `trapTarget` ：需要被定义属性的对象（即代理的目标对象）；
2. `key` ：属性的键（字符串类型或符号类型）；
3. `descriptor` ：为该属性准备的描述符对象。

`defineProperty` 陷阱函数要求你在操作成功时返回 `true` ，否则返回 `false` 。 `getOwnPropertyDescriptor` 陷阱函数则只接受 `trapTarget` 与 `key` 这两个参数，并会返回对应的描述符。 `Reflect.defineProperty()` 与 `Reflect.getOwnPropertyDescriptor()` 方法作为上述陷阱函数的对应方法，接受与之相同的参数。

此代码实现了每个陷阱函数的默认行为，如下：
```js
    let target = {}
    let proxy = new Proxy(target, {
        defineProperty(trapTarget, key, descriptor) {
            return Reflect.defineProperty(trapTarget, key, descriptor)
        },
        getOwnPropertyDescriptor(trapTarget, key) {
            return Reflect.getOwnPropertyDescriptor(trapTarget, key)
        }
    })

    Object.defineProperty(proxy, "name", {
        value: "zzzhim"
    })

    console.log(proxy.name) // "zzzhim"

    let descriptor = Object.getOwnPropertyDescriptor(proxy, "name");

    console.log(descriptor.value) // "zzzhim"
```

### 阻止 Object.defineProperty()
`defineProperty` 陷阱函数要求你返回一个布尔值用于表示操作是否已成功。当它返回 `true` 时， `Object.defineProperty()` 会正常执行；如果它返回 `false` ，则会抛出错误。我们可以利用这个特性，来限制可以被 `Object.defineProperty()` 的属性。

如下：
```js
    let target = {}
    let proxy = new Proxy(target, {
        defineProperty(trapTarget, key, descriptor) {
            if(typeof key === "symbol") {
                return false
            }

            return Reflect.defineProperty(trapTarget, key, descriptor)
        }
    })

    const symbol = Symbol("name")

    // 抛出错误
    Object.defineProperty(proxy, symbol, {
        value: "zzzhim"
    })
```

当 `key` 值为 `Symbol` 类型时，我们在 `defineProperty` 陷阱函数中返回 `false`，导致程序抛出错误。

> 你可以让陷阱函数返回 `true` ，同时不去调用 `Reflect.defineProperty()` 方法，这样 `Object.defineProperty()` 就会静默失败，如此便可在未实际去定义属性的情况下抑制运行错误。

### 描述符对象的限制
为了确保 `Object.defineProperty()` 与 `Object.getOwnPropertyDescriptor()` 方法的行为一致，传递给 `defineProperty` 陷阱函数的描述符对象必须是正规的。出于同一原因， `getOwnPropertyDescriptor` 陷阱函数返回的对象也始终需要被验证。

任意对象都能作为 `Object,defineProperty()` 方法的第三个参数；然而能够传递给 `defineProperty` 陷阱函数的描述对象参数，则只有 `enumerable `、 `configurable` 、 `value` 、 `writable` 、 `get` 与 `set` 这些属性。

如下：
```js
    let proxy = new Proxy({}, {
        defineProperty(trapTarget, key, descriptor) {
            console.log(descriptor) // 描述对象输出 {{ value: value }} 并没有 name 属性
            return  Reflect.defineProperty(trapTarget, key, descriptor)
        }
    })

    Object.defineProperty(proxy, "name", {
        value: "value",
        name: "zzzhim"
    })
```

`getOwnPropertyDescriptor` 陷阱函数有一个微小差异，要求返回值必须是 `null` 、 `undefined` ，或者是一个对象。当返回值是一个对象时，只允许该对象拥有 `enumerable `、 `configurable` 、 `value` 、 `writable` 、 `get` 与 `set` 这些属性。如果返回的对象包含了不被许可的自有属性，则程序会抛出错误。

如下：
```js
    let proxy = new Proxy({}, {
        getOwnPropertyDescriptor(trapTarget, key) {
            return {
                name: "zzzhim"
            }
        }
    })

    // 抛错
    Object.getOwnPropertyDescriptor(proxy, "name")
```

?> `Object.getOwnPropertyDescriptor()` 的返回值总是拥有可信任的结构，无论是否使用了代理。

### 重复的描述符方法

###### defineProperty() 方法
`Object.defineProperty()` 方法与 `Reflect.defineProperty()` 方法几乎一模一样，只是返回值有区别。

如下：
```js
    let target = {}
    let result1 = Object.defineProperty(target, "name", { value: "target" })

    console.log(target === result1) // true

    let result2 = Reflect.defineProperty(target, "name", { value: "target" })

    console.log(result2) // true
```

?> 如上，前者返回的是调用它时的第一个参数，而后者在操作成功时返回 `true` 、失败时返回 `false`。

###### getOwnPropertyDescriptor() 方法
`Object.getOwnPropertyDescriptor()` 方法会在接收的第一个参数是基本类型值时，将该参数转化为对象。而 `Reflect.getOwnPropertyDescriptor()` 方法则会在第一个参数是基本类型值的时候抛出错误。
```js
    let descriptor1 = Object.getOwnPropertyDescriptor(2, "name")
    console.log(descriptor1) // undefined
    // 抛出错误
    let descriptor2 = Reflect.getOwnPropertyDescriptor(2, "name")
```

### ownKeys 陷阱函数
`ownKeys` 代理陷阱拦截了内部方法 `[[OwnPropertyKeys]]` ，并允许你返回一个数组用于重写该行为。返回的这个数组会被用于四个方法：
1. `Object.keys()` 方法；
2. `Object.getOwnPropertyNames()` 方法；
3. `Object.getOwnPropertySymbols()` 方法；
4. `Object.assign()` 方法；

?> 其中 `Object.assign()` 方法会使用该数组来决定哪些属性会被复制。

`ownKeys` 陷阱函数的默认行为由 `Reflect.ownKeys()` 方法实现，会返回一个由全部自有属性的键构成的数组，无论键的类型是字符串还是符号。

`Object.getOwnPropertyNames()` 方法与 `Object.keys()` 方法会将符号值从该数组中过滤出去；

`Object.getOwnPropertySymbols()` 会将字符串值过滤掉；

`Object.assign()` 方法会使用数组中所有的字符串值与符号值；

`ownKeys` 陷阱函数接受单个参数，即目标对象，同时必须返回一个数组或者一个类数组对象，不合要求的返回值会导致错误。我们可以使用 `ownKeys` 陷阱函数去过滤特定的属性，以避免这些属性被 `Object.keys()` 方法，`Object.getOwnPropertyNames()` 、`Object.getOwnPropertySymbols()` 、`Object.assign()`方法使用。

如下，我们过滤掉名为 `name` 的属性：
```js
    let proxy = new Proxy({}, {
        ownKeys(trapTarget) {
            return Reflect.ownKeys(trapTarget).filter(key => key !== "name")
        }
    })

    proxy.name = "zzzhim"
    proxy.age = 23

    let keys = Object.keys(proxy)

    console.log(keys) // [ age ]

    let names = Object.getOwnPropertyNames(proxy)

    console.log(names) // [ age ]
```

> `ownKeys` 陷阱函数也能影响 `for-in` 循环，因为这种循环调用了陷阱函数来决定哪些值能够被用在循环内。

### 使用 apply 与 construct 陷阱函数的函数代理
在所有的代理陷阱中，只有 `apply` 与 `construct` 要求代理目标对象必须是一个函数。

之前提到过，函数拥有两个内部方法：`[[Call]]` 与 `[[Construct]]` ，前者会在函数被直接调用时执行，而后者会在函数被使用 `new` 运算符调用时执行。`[[Call]]` 会在函数被直接调用时执行，而后者会在函数被使用 `new` 运算符调用时执行。

`apply` 与 `construct` 陷阱函数对应着这两个内部方法，并允许我们对其进行重写。当不使用 `new` 去调用一个函数时， `apply` 陷阱函数会接收到下列三个参数（`Reflect.apply()` 也会接收这些参数）：
1. `trapTarget`：被执行的函数（即代理的目标对象）；
2. `thisArg`：调用过程中函数内部的 `this` 值；
3. `argumentsList`：被传递给函数的参数数组；

当使用 `new` 去执行函数时，`construct` 陷阱函数会被调用并接收到下列两个参数：
1. `trapTarget`：被执行的函数（即代理的目标对象）；
2. `argumentsList`：被传递给函数的参数数组；

`Reflect.construct()` 方法同样会接收到这两个参数，还会收到可选的第三个参数 `newTarget`，如果提供了此参数，则它就指定了函数内部的 `new.target` 值。

`apply` 与 `construct`陷阱函数结合起来就能够完全控制任意目标对象函数的行为。

模拟函数的默认行为，如下：
```js
    let targetFun = function() {
        return 23
    }

    let proxy = new Proxy(targetFun, {
        apply(trapTarget, thisArg, argumentsList) {
            return Reflect.apply(trapTarget, thisArg, argumentsList)
        },
        construct(trapTarget, argumentsList) {
            return Reflect.construct(trapTarget, argumentsList)
        }
    })

    // 使用了函数的代理，其目标对象会被视为函数
    console.log(typeof proxy) // function
    console.log(proxy()) // 23

    const instance = new proxy()
    console.log(instance instanceof proxy) // true
    console.log(instance instanceof targetFun) // true
```

### 验证函数的参数
`apply` 与 `construct` 陷阱函数在函数的执行方式上开启了很多的可能性。

如下，我们可以通过 `apply` 陷阱函数保证参数必须是数值类型，并且函数不能使用 `new` 调用。
```js
    const sum = function (...values) {
        console.log(values)
    }
    
    const sumProxy = new Proxy(sum, {
        apply(trapTarget, thisArg, argumentsList) {
            argumentsList.forEach(value => {
                if(typeof value !== "number") {
                    throw new TypeError("All arguments must be numbers.")
                }
            })

            return Reflect.apply(trapTarget, thisArg, argumentsList)
        },
        construct(trapTarget, argumentsList) {
            throw new TypeError("This function can't be called with new.")
        }
    })

    console.log(sumProxy(1, 2, 3, 4)) // [ 1, 2, 3, 4 ]

    
    console.log(sumProxy("1", 2, 3, "4")) // 抛错

    const newSum = new sumProxy()  // 抛错
```

相反的，你也可以限制函数必须使用 `new` 运算符调用，同时确保它的参数都是数值。

### 调用构造器而无须使用 new
前面介绍了我们可以通过 `new.target` 来判断函数是否使用了 `new`。就像这样：
```js
    function Numbers(...values) {
        if(typeof new.target === "undefined") {
            throw new TypeError("This function must be called with new.")
        }

        this.values = values
    }

    const instance = new Numbers(1, 2, 3)

    console.log(instance.values) // [ 1, 2, 3 ]

    // 抛出错误
    Numbers(1, 2, 3)
```

上面的这个例子，`Numbers` 函数必须要使用 `new` 才能够正常执行，在用户不知情的情况下，通常会造成不必要的错误。我们可以使用 `apply` 陷阱函数来规避必须使用 `new` 调用这个限制，如下：
```js
    function Numbers(...values) {
        if(typeof new.target === "undefined") {
            throw new TypeError("This function must be called with new.")
        }

        this.values = values
    }

    const proxy = new Proxy(Numbers, {
        apply(trapTarget, thisArg, argumentsList) {
            return Reflect.construct(trapTarget, argumentsList)
        }
    })

    const instance1 = new proxy(1, 2, 3)

    console.log(instance1.values) // [ 1, 2, 3 ]

    const instance2 = proxy(1, 2, 3)

    console.log(instance2.values) // [ 1, 2, 3 ]
```

`proxy` 函数允许我们调用 `Numbers` 并且无须使用 `new` ，并且这种调用方式的效果与使用 `new` 是完全一致的。

### 可被调用的类构造器
前面说明了构造器必须始终使用 `new` 来调用，原因是类构造器的内部方法 `[[Call]]` 被明确要求抛出错误。然而代理可以拦截对于 `[[Call]]` 方法的调用，意味着我们可以借助代理创建一个可以被直接调用的类构造器。

如下，我们想让类构造器不使用 `new` 的情况下也能够正常工作，我们可以使用 `apply` 陷阱函数来创建一个新的实例：
```js
    class Person {
        constructor(name) {
            this.name = name
        }
    }

    const PersonProxy = new Proxy(Person, {
        apply(trapTarget, thisArg, argumentsList) {
            return new trapTarget(...argumentsList)
        }
    })

    const obj = PersonProxy("zzzhim")

    console.log(obj.name) // zzzhim
    console.log(obj instanceof Person) // true
```

### 可被撤销的代理
代理在被创建之后，通常就不能再从目标对象上被解绑了。我之前使用的例子都是使用了不可被撤销的代理。

有些情况下我们可能想要撤销一个代理使它不能够再被使用。我们可以使用 `Proxy.revocable()` 方法来创建一个可被撤销的代理，该方法接收的参数与 `Proxy` 构造器相同：
1. `proxy`：可被撤销的代理对象；
2. `revoke`：用于撤销代理的函数；

当 `revoke()` 函数被调用后，就不能再对该 `proxy` 对象进行更多操作，任何与该代理对象交互的意图都会触发代理的陷阱函数，从而抛出一个错误。

如下：
```js
    const target = {
        name: "zzzhim"
    }

    const { proxy, revoke } = Proxy.revocable(target, {})

    console.log(proxy.name) // zzzhim

    revoke()

    // 抛出错误
    console.log(proxy.name)
```