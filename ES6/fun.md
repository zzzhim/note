# 函数

### 带参数默认值的函数
JS 函数的独特之处是可以接受任意数量的参数，而无视函数声明处的参数数量。这让定义的函数可以使用不同的参数数量来调用，调用时未提供的参数经常使用默认值来代替。

###### 在 ES5 中模拟参数默认值
我们可能会经常见到下面的方式来创建参数的默认值。

```js
    function request(url, timeout, callback) {
        timeout = 3000

        callback = callback || function() {}

        console.log(timeout)
        // ...
    }
```

在上面的 `request` 函数中 `timeout` 和 `callback` 都是可选参数，因为他们都会在参数未被传值的情况下使用默认值。主要是因为 **逻辑或运算符（||）** 在左侧的值为假的情况下总会返回右侧的操作符。不过上面的方法存在 bug , 如果我们传入 `0` 、 `null` 或者 `false` 的话也会导致值会被替换掉。

```js
    request('/', 0) // 3000
    request('/', null) // 3000
    request('/', false) // 3000
```

在这种情况下可以使用 `typeof` 来检测参数的类型。

```js
    function request(url, timeout, callback) {
        timeout = (typeof timeout !== "undefined") ? timeout : 3000

        callback = (typeof callback !== "undefined") ? callback : function() {}

        console.log(timeout)
        // ...
    }

    request('/') // 3000
    request('/', 0) // 0
    request('/', null) // null
    request('/', false) // false
```

这是因为在函数的具名参数未被提供值时会默认是 `undefined`。虽然这种方法更加安全，但依然因为一个很简单的需求而书写了很多的代码。而 `ES6` 中为我们提供了更加简单的为参数提供默认值的方式。

###### ES6 中的参数默认值
ES6中能更容易地为参数提供默认值，它使用了初始化的形式，可以在参数还未被正式传递进来时使用。

```js
    function request(url, timeout = 3000, callback = function() {}) {
        // ...
    }
```

此函数也是只要求第一个参数始终被传递，而其他两个参数都有各自的默认值。但是这种写法比上面ES5的写法更加简洁，因为我们不需要再去额外的判断参数是否传递。

```js
    function request(url, timeout = 3000, callback = function() {}) {
        console.log(timeout)
        // ...
    }

    request('/') // 3000
    request('/', undefined) // 3000
    request('/', 0) // 0
    request('/', null) // null
    request('/', false) // false
```

?> 可以看到当我们传递第二个参数为非 `undefined` 的值时，那么默认值不会被应用。

在函数声明中能指定任意一个参数的默认值，即使该参数排在未指定默认值的参数之前也是可以的。如下：

```js
    function request(url, timeout = 3000, callback) {
        console.log(timeout)
        // ...
    }

    request('/') // 3000
    request('/', undefined) // 3000
    request('/', 0) // 0
    request('/', null) // null
    request('/', false) // false
```

###### 参数默认值如何影响 **arguments** 对象
`arguments` 对象会在使用参数默认值的时候有不同的表现。在ES5的非严格模式下，`arguments` 对象会反映出具名参数的变化。如下：

```js
    function mixArgs(first, second) {
        console.log(first === arguments[0])  // true
        console.log(second === arguments[1]) // true
        first = 'c'
        second = 'd'
        console.log(first === arguments[0])  // true
        console.log(second === arguments[1]) // true
    }

    mixArgs('a', 'b')
```

?> 可以看出在非严格模式下，`arguments` 总是会被更新来反映出具名参数的变化。因此当我们更改了 `first` 和 `second` 的值时，`arguments[0]` 和 `arguments[1]` 也会相应的更新。

在ES5的严格模式下，关于 `arguments` 对象的这种混乱情况被消除了，它不会再反映出具名参数的变化。

```js
    function mixArgs(first, second) {
        'use strict'

        console.log(first === arguments[0])  // true
        console.log(second === arguments[1]) // true
        first = 'c'
        second = 'd'
        console.log(first === arguments[0])  // false
        console.log(second === arguments[1]) // false
    }

    mixArgs('a', 'b')
```

?> 在严格模式下，我们再次修改 `first` 和 `second` 的值时，我们可以看到并不会再影响 `arguments` 了。

!> 在ES6中，在使用参数默认值的函数中， `arguments` 对象的表现总是与 ES5 的严格模式一致，无论此时函数是否明确运行在严格模式下。参数默认值的存在触发了 `arguments` 对象与具名参数的分离。

###### 参数默认值表达式
函数参数的默认值并没有要求一定是基本类型的值。一次我们也可以传入一个函数来产生参数的默认值。如下：

```js
    function getValue() {
        return 1
    }

    function add(num1, num2 = getValue()) {
        return num1 + num2
    }

    console.log(add(1, 10)) // 11
    console.log(add(1)) // 2
```

我们同时也可以将前面的参数作为后面参数的默认值。如下：

```js
    function add(num1, num2 = num1) {
        return num1 + num2
    }

    console.log(add(1)) // 2
    console.log(add(1, 1)) // 2
```

?> 上面的代码中，我们为两个参数都设置了默认值，意味着只传入第一个参数，会让两个参数获得相同的值，因此 `add(1)` 和 `add(1, 1)` 都会返回 2。也就是说我们实际上可以将前面声明的参数，作为默认值传递给后面的参数。

!> 这里要注意，引用其他参数来作为参数的默认值时，仅能够引用前面的参数，因此前面的参数是不能使用后面的参数作为默认值的。详情可以参考 `let` 与 `const` 产生的暂时性死区。

### 剩余参数
剩余参数（**rest parameter**）由三个点 （`...`）和一个紧跟着的具名参数指定，它会是包含传递给函数的其余参数的一个数组。

```js
    function pick(num1, ...arr) {
        console.log(num1) // 1
        console.log(arr)  // [2, 3, 4, 5, 6]
    }

    pick(1, 2, 3, 4, 5, 6)
```

?> 在上面的函数中 `arr` 是一个包含了 `num1` 之后的参数的剩余参数。它与包含了所有参数的 `arguments` 有所不同，后者不会把第一个参数也包含进去。

需要注意的是剩余参数有两个限制：
1. 一个函数里面只能有一个剩余参数，并且它必须被放在最后面。
```js
    //  语法错误：Rest parameter must be last formal parameter
    function pick(num1, ...arr, num2) {
        // ...
    }

    pick(1, 2, 3, 4, 5, 6) 
```

2. 剩余参数不能在对象字面量的 `setter` 属性中使用。这是因为对象字面量 `setter` 被限定只能使用单个参数；而剩余参数按照定义是不限制参数数量的，所以不能在此处使用。
```js
    const object = {
        // 语法错误：Setter function argument must not be a rest parameter
        set name(...value) {

        }
    }
```

### 函数构造器增强
`Function` 构造器允许动态创建一个新函数。如下
```js 
    const add = new Function('num1', 'num2', 'return num1 + num2')

    console.log(add(1, 2)) // 3
```

ES6增强了 `Function` 构造器的能力，允许我们使用默认参数以及剩余参数。如下：
```js
    const add = new Function('num1 = 1', 'num2 = 2', 'return num1 + num2')

    console.log(add()) // 3
```

```js
    const add = new Function('...num', 'return num[0] + num[1]')

    console.log(add(1, 2)) // 3
```

### 扩展运算符
剩余参数允许我们把多个独立的参数合并到一个数组中，而扩展运算符则允许将一个数组进行分割，并将各个项作为分离的参数传给函数。如下：
```js
    const values = [1, 2, 3, 4, 5]

    // 等价于 console.log(Math.max(1, 2, 3, 4, 5))
    console.log(Math.max(...values)) // 5
```

### ES6的名称属性
ES6中给所有的函数都添加了自己的 `name` 属性值。

函数声明的情况下，`name` 属性返回一个函数声明的名称
```js
    function doSomething() {}
    console.log(doSomething.name) // "doSomething" 
```

而匿名函数表达式的情况下，`name` 属性则是该函数所赋值的变量名称
```js
    const doAnotherThing = function() {}
    console.log(doAnotherThing.name) // doAnotherThing
```

!> 这里需要注意的一点是，当一个函数表达式赋值一个声明函数时，因为该函数表达式拥有自己的名称，该函数的名称将会是 **函数表达式** 声明的名称，因为此名称的优先级要高于赋值目标的变量名。
```js
    const doAnotherThing = function doSomething() {}
    console.log(doAnotherThing.name) // "doSomething" 
```

在使用 `bind` 所创建的函数将会在函数的名称前加上 `bound`
```js
    function foo() {}
    console.log(foo.bind(null).name) // "bound foo"
```

当通过 get 和 set 访问器来存取属性时, "get" 或 "set" 会出现在函数名称前。
```js
    const o = { 
        get foo() {},
        set foo(x) {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(o, "foo")
    console.log(descriptor.get.name) // "get foo"
    console.log(descriptor.set.name) // "set foo"
```

!> `getter` 和 `setter` 函数都必须要用 `Object.getOwnPropertyDescriptor()` 来检索。

### 明确函数双重作用