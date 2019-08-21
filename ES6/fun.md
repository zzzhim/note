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
在ES5以及更早版本中，函数根据是否使用 `new` 来调用而有双重用途。当使用 `new` 时，函数内部的 `this` 是一个新对象，并作为函数的返回值。

JS为函数提供了两个不同的内部方法： `[[Call]]` 与 `[[Construct]]` 。当函数未使用 `new` 来进行调用时， `[[Call]]` 方法会被执行，运行的是代码中显示的函数体。而当函数使用 `new` 进行调用时， `[[Construct]]` 方法则会被执行，负责创建一个被称为新目标的新的对象，并且使用该新目标作为 `this` 去执行函数体。拥有 `[[Construct]]` 方法的函数被称为构造器。

!> 并不是所有函数都拥有 `[[Construct]]` 方法，因此不是所有函数都可以使用 `new` 来调用。在 **箭头函数**中，**箭头函数**就未拥有该方法。

### new.target 元属性
ES6 引入了 `new.target` 元属性。元属性指的是“非对象”（例如 `new` ）上的一个属性，并提供关联到它的目标的附加信息。当函数的 `[[Construct]]` 方法被调用时， `new.target` 会被填入 `new` 运算符的作用目标，该目标通常是新创建的对象实例的构造器，并且会成为函数体内部的 `this` 值。而若 `[[Call]]` 被执行， `new.target` 的值则会是 `undefined`。

我们可以通过检查 `new.target` 是否被定义，这个新的元属性就让你能安全地判断函数是否被使用 `new` 进行了调用。
```js
    function Person(name) {
        if(typeof new.target !== 'undefined') {
            this.name = name
        }else {
            throw new Error("You must use new with Person.")
        }
    }

    const person = new Person('奶糖')
    const notAPrson = Person.call(person, '奶糖') // 报错
```

使用 `new.target`, `Person` 构造器会在未使用 `new` 调用时抛出错误。

我们也可以检查 `new.target` 是否被使用特定构造器进行了调用。
```js
    function Person(name) {
        if(new.target !== Person) {
            this.name = name
        }else {
            throw new Error("You must use new with Person.")
        }
    }

    function AnotherPerson(name) {
        Person.call(this, name)
    }

    const person = new Person("奶糖")
    const anotherPerson = new AnotherPerson("奶糖") // 报错
```

### 箭头函数
箭头函数正如名称所示那样使用一个“箭头”（`=>`）来定义，但它的行为在很多重要方面与传统的JS函数不同。
- 没有 `this`、`super`、`arguments`，也没有 `new.target` 绑定：`this`、`super`、`arguments`、以及函数内部的 `new.target`的值的所在由最靠近的非箭头函数来决定。
- 不能被使用 `new` 调用：箭头函数没有 `[[Construct]]` 方法，因此不能被用为构造函数，使用 `new` 调用箭头函数会抛出错误。
- 没有原型：既然不能对箭头函数使用 `new` ，那么它也不需要原型，也就是没有 `prototype` 属性。
- 不能更改 `this`： `this` 的值在函数内部不能被修改，在函数的整个生命周期内其值会保持不变。
- 没有 `arguments` 对象：既然箭头函数没有 `arguments` 绑定，我们必须依赖于具名参数或剩余参数来访问函数的参数。
- 不允许重复的具名参数：箭头函数不允许拥有拥有重复的具名参数，无论是否在严格模式下；而相对来说，传统函数只有在严格模式下才禁止这种重复。

###### 箭头函数语法
当接受单个参数时。
```js
    const fun = value => value
    
    // 等价于
    const fun = function(value) {
        return value
    }
```

当传递多个参数的时候
```js
    const fun = (num1, num2) => num1 + num2
    
    // 等价于
    const fun = function(num1, num2) {
        return num1 + num2
    }
```

当包含多个语句的时候，我们需要将函数体用一对花括号进行包裹，并明确定义一个返回值。
```js
    const fun = (num1, num2) => {
        const num = num1 + num2
        return num
    }

    // 等价于
    const fun = function(num1, num2) {
        const num = num1 + num2
        return num
    }
```

###### 创建立即调用函数表达式
JS 中使用函数的一种流行方式是创建立即调用函数表达式（ immediately-invoked function
expression ， IIFE ）。 IIFE 允许你定义一个匿名函数并在未保存引用的情况下立刻调用它。

在ES5以及更早的版本中你可能会见到这种写法。
```js
    (function(name) {
        return '我的名字是' + name
    }('zzzhim'))

    // 或者

    !function(name) {
        return '我的名字是' + name
    }('zzzhim')
```

?> 上面代码中当程序执行到上面的函数时，函数将会自执行并且返回一个字符串。

我们可以使用箭头函数来完成同样的效果
```js
    (name => '我的名字是' + name)('zzzhim')
```

?> 通过上面的代码我们可以看到使用箭头函数，我们可以达到同样的目的，并且代码更加简洁形象

| 使用传统函数时， (function(){/*函数体*/})() 与 (function(){/*函数体*/}())
这两种方式都是可行的。

| 但若使用箭头函数，则只有下面的写法是有效的： (() => {/*函数体*/})()

### 尾调用优化
在ES6中函数最有趣的改动或许就是一项引擎优化，它改变了尾部调用的系统。尾调用（`this call`）指的是调用函数的语句是另一个函数的最后语句。如下：
```js
    function doSomething() {
        return doSomethingElse(); // 尾调用
    }
```

ES6 在严格模式下力图为特定尾调用减少调用栈的大小（非严格模式的尾调用则保持不变）。当满足以下条件时，尾调用优化会清除当前栈帧并再次利用它，而不是为尾调用创建新的栈帧：
1. 尾调用不能引用当前栈帧中的变量（意味着该函数不能是闭包）；
2. 进行尾调用的函数在尾调用返回结果后不能做额外操作；
3. 尾调用的结果作为当前函数的返回值。

### 总结
在特定参数被传入时，函数的默认参数允许我们更容易指定需要使用的值。而在ES6之前，这要求我们在函数内使用一些额外的代码检测才能实现默认参数。

剩余参数允许我们将余下的所有参数放入指定数组。使用真正的数组并让我们指定哪些参数需要被包含，使得剩余参数成为比 `arguments` 更为灵活的解决方案。

扩展运算符是剩余参数的好伙伴，允许我们在调用函数时将数组解构为分离的参数。在ES6之前我们想把数组的元素作为独立参数传给函数，只能有两种办法：手动指定或者使用 `apply()` 方法。

新增的 `name` 属性能帮我们在调试与执行方面更容易识别函数。

在ES6中，函数的行为被 `[[Call]]` 与 `[[Construct]]` 方法所定义，前者对应普通的函数执行，后者则对应使用了 `new` 的调用。 我们可以使用 `new.target` 元属性来判断函数被调用时是否使用了 `new` 。

ES6 函数的最大变化就是增加了箭头函数。箭头函数被设计用于替代匿名函数表达式，它拥
有更简洁的语法、词法级的 this 绑定，并且没有 arguments 对象。此外，箭头函数不能修
改它们的 this 绑定，因此不能被用作构造器。

尾调用优化允许某些函数的调用被优化，以保持更小的调用栈、使用更少的内存，并防止堆
栈溢出。当能进行安全优化时，它会由引擎自动应用。