# 迭代器与生成器

### 迭代器
迭代器是被设计专用与迭代的对象，带有特定接口。所有的迭代器对象都拥有 `next()` 方法，会返回一个结果对象。该结果对象有两个属性：对应下一个值的 `value`，以及一个布尔类型的 `done`，其值为 `true` 时表示没有更多值可供使用。迭代器持有一个指向集合位置的内部指针，每当调用了 `next()` 方法，迭代器就会返回相应的下一个值。

如果在最后一个值返回后再调用 `next()` ，所返回的 `done` 属性值会是 `true` ，并且 `value` 属性值会是迭代器自身的返回值（**return value** ， 即使用 return 语句明确返回的值）。

在**ES5**中创建一个迭代器。如下：
```js
    function createIterator(items) {
        var i = 0

        return {
            next: function() {
                var done = (i >= items.length)
                var value = !done ? items[i++] : undefined

                return {
                    done: done,
                    value: value
                }
            }
        }
    }

    var iterator = createIterator([ 1, 2, 3 ])

    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next()) // "{ value: 2, done: false }"
    console.log(iterator.next()) // "{ value: 3, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

`createIterator()` 函数返回一个带有 `next()` 方法的对象。每当调用此方法时， `items` 数组的下一个值就会成为所返回的 `value` 属性的值。当 `i` 的值为 3 时， `done` 属性变成 `true` ，并且利用三元运算符讲 `value` 设置为 `undefined`。

### 生成器
生成器（**generator**）是能返回一个迭代器的函数。生成器函数由放在 `function` 关键字之后的一个星号（`*`）来表示，并能使用新的 `yield` 关键字。将星号紧跟在 `function` 关键字后，或是在中间留空格都可以。如下：
```js
    function* createIterator() {
        yield 1
        yield 2
        yield 3
    }

    // 生成器调用会返回一个迭代器
    const iterator = createIterator()

    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next()) // "{ value: 2, done: false }"
    console.log(iterator.next()) // "{ value: 3, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

`createIterator()` 前面的星号让此函数变成一个生成器。 `yield` 关键字也是 ES6 新增的，指定了迭代器在被 `next()` 方法调用时应当按顺序返回的值。

?> 生成器函数最有意思的方面是它们会在每次 `yield` 语句后停止执行，直到迭代器的 `next()` 方法再次被调用，才继续执行后面的 `yield` 语句。

> `yield` 关键字只能用在生成器内部，用于其他任意位置都是语法错误，即使在生成器内部的函数中也不行，正如此例：
```js
    function* createIterator(items) {
        items.forEach(function(item) {
            // 语法错误
            yield item + 1
        })
    }
```

### 生成器函数表达式
我们不但可以使用函数声明的方式创建一个生成器，也可以使用函数表达式来创建，只要在 `function` 关键字与圆括号之间使用一个星号（`*`）即可。如下：
```js
    const createIterator = function* () {
        yield 1
        yield 2
        yield 3
    }

    const iterator = createIterator()

    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next()) // "{ value: 2, done: false }"
    console.log(iterator.next()) // "{ value: 3, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

!> 注意：不能将箭头函数创建为生成器。

### 生成器对象方法
由于生成器就是函数，因此也可以被添加到对象中。如下：
```js
    const obj = {
        *createIterator(items) {
            for(let i = 0; i < items.length; i++) {
                yield items[i]
            }
        }
    }

    let iterator = obj.createIterator([ 1, 2, 3 ])

    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next()) // "{ value: 2, done: false }"
    console.log(iterator.next()) // "{ value: 3, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

在使用ES6速记法中，由于 `createIterator()` 方法没有使用 `function` 关键字来定义，星号就紧贴在方法名之前，不过可以在星号和方法名之间留下空格。

### 可迭代对象与 for-of 循环
与迭代器紧密相关的是，可迭代对象（**iterable**）是包含 `Symbol.iterator` 属性的对象。这个 `Symbol.iterator` 知名符号定义了为指定对象返回迭代器的函数。在ES6中，所有的集合对象（数组、 Set 和 Map ）以及字符串都是可迭代对象，因此它们都被指定了默认的迭代器。

> 生成器创建的所有迭代器都是可迭代对象，因为生成器默认就会为 `Symbol.iterator` 属性赋值。

### 访问默认迭代器
想要访问对象上的默认迭代器，可以使用 `Symbol.iterator` 。如下：
```js
    const arr = [ 1, 2, 3 ]
    const iterator = arr[Symbol.iterator]()

    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next()) // "{ value: 2, done: false }"
    console.log(iterator.next()) // "{ value: 3, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

### 检测一个对象是否能进行迭代
```js
    function isIterator(obj) {
        return typeof obj[Symbol.iterator] === "function"
    }

    console.log(isIterator([ 1, 2, 3 ])) // true
    console.log(isIterator('123456'))    // true
    console.log(isIterator(new Map()))   // true
```

?> 这个 `isIterable()` 函数仅仅查看对象是否存在一个类型为函数的默认迭代器。 `for-of` 循环在执行之前会做类似的检查。

### 创建可迭代对象
我们在自定义对象时，默认情况下不是可迭代对象，但是我们可以创建一个包含生成器的 `Symbol.iterator` 属性，让它们成为可迭代对象。如下：
```js
    let collection = {
        items: [],
        *[Symbol.iterator]() {
            for (let item of this.items) {
                yield item
            }
        }
    }

    collection.items.push(1)
    collection.items.push(2)
    collection.items.push(3)

    for (let item of collection) {
        console.log(item) // 1 , 2 , 3
    }
```

这个默认迭代器是用 `Symbol.iterator` 方法创建的，此方法是一个生成器（名称之前依然有星号）。接下来该生成器使用了一个 `for-of` 循环来对 `this.items` 中的值进行迭代，并使用了 `yield` 来返回每个值。 `collection` 对象依靠 `this.items` 的默认迭代器来工作，而非在定义的值上手动进行迭代。

### 集合的迭代器
ES6 具有三种集合对象类型：数组、Map 和 Set。这三种类型都拥有如下的迭代器：
+ `entries()`：返回一个包含键值对的迭代器。
+ `values()`：返回一个包含集合中的值的迭代器。
+ `keys`：返回一个包含集合中的键的迭代器。

**entries()** 迭代器

`entries()` 迭代器会在每次 `next()` 被调用时返回一个双项数组，此数组代表了集合中每个元素的键与值：对于数组来说，第一项是数值索引；对于Set，第一项也是值（因为它的值也会被视为键）；对于Map，第一项就是键。

如下：
```js
    const colors = [ "red", "green", "blue" ]
    const nums = new Set([ 1, 2, 3, 4 ])
    const map = new Map([ [ "title", "ES6" ], [ "content", "entries" ] ])

    for(let entry of colors.entries()) {
        console.log(entry)
        // 输出
        // [ 0, "red" ]
        // [ 1, "green" ]
        // [ 2, "blue" ]
    }

    for(let entry of nums.entries()) {
        console.log(entry)
        // 输出
        // [ 1, "1" ]
        // [ 2, "2" ]
        // [ 3, "3" ]
        // [ 4, "4" ]
    }

    for(let entry of map.entries()) {
        console.log(entry)
        // 输出
        // [ "title", "ES6" ]
        // [ "content", "entries" ]
    }
```

**values()** 迭代器

`values()` 迭代器仅仅能返回储存在集合内的值。

如下：
```js
    const colors = [ "red", "green", "blue" ]
    const nums = new Set([ 1, 2, 3, 4 ])
    const map = new Map([ [ "title", "ES6" ], [ "content", "entries" ] ])

    for(let entry of colors.values()) {
        console.log(entry)
        // 输出
        // "red"
        // "green"
        // "blue"
    }

    for(let entry of nums.values()) {
        console.log(entry)
        // 输出
        // 1
        // 2
        // 3
        // 4
    }

    for(let entry of map.values()) {
        console.log(entry)
        // 输出
        // "ES6"
        // "entries"
    }
```

**keys()** 迭代器

`keys()` 迭代器能返回集合中的每一个键。对于数组来说，它只返回数值类型的键，永不返回数组的其他自有属性；Set 的键与值是相同的，因此它的 `keys()` 与 `values()` 返回了相同的迭代器；对于 Map ， `keys()` 迭代器返回了每个不重复的键。

如下：
```js
    const colors = [ "red", "green", "blue" ]
    const nums = new Set([ 1, 2, 3, 4 ])
    const map = new Map([ [ "title", "ES6" ], [ "content", "entries" ] ])

    for(let entry of colors.keys()) {
        console.log(entry)
        // 输出
        // 0
        // 1
        // 2
    }

    for(let entry of nums.keys()) {
        console.log(entry)
        // 输出
        // 1
        // 2
        // 3
        // 4
    }

    for(let entry of map.keys()) {
        console.log(entry)
        // 输出
        // "title"
        // "content"
    }
```

**集合类型的默认迭代器**

当 `for-of` 循环没有显示指定迭代器时，每种集合类型都有一个默认的迭代器供循环使用。 `values()` 方法是数组与 Set 的默认迭代器， 而 `entries()` 方法则是 Map 的默认迭代器。

如下：
```js
    const colors = [ "red", "green", "blue" ]
    const nums = new Set([ 1, 2, 3, 4 ])
    const map = new Map([ [ "title", "ES6" ], [ "content", "entries" ] ])

    // 与使用 colors.values() 相同
    for(let entry of colors) {
        console.log(entry)
        // 输出
        // red
        // green
        // blue
    }

    // 与使用 nums.values() 相同
    for(let entry of nums) {
        console.log(entry)
        // 输出
        // 1
        // 2
        // 3
        // 4
    }

    // 与使用 map.entries() 相同
    for(let entry of map) {
        console.log(entry)
        // 输出
        // [ "title", "ES6" ]
        // [ "content", "entries" ]
    }
```

> 字符串也可以使用迭代器配合 `for-of` 循环，因为我在实际应用中很少用到，对这方面了解的也不多，想要了解的话可以看一下 Understanding ECMAScript 6 ，里面有详细的介绍。

### NodeList 的迭代器
文档对象模型（DOM）具有一种 `NodeList` 类型，用于表示页面文档中元素的集合。需要注意的是 `NodeList` 不是一个数组，是一个类似数组的对象。不过虽然 `NodeList` 不是一个数组，但是可以使用 `forEach()` 对其进行迭代，也可以使用 `Array.from()` 将其转换为实际数组。

DOM关于 `NodeList` 的规定也包含了一个默认迭代器（此规定在 HTML 规范而非 ES6规范中），其表现方式与数组的默认迭代器一致。这意味着我们可以将 `NodeList` 用于 `for-of` 循环，或用于其他使用对象默认迭代器的场合。如下：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title></title>
    </head>
    <body>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </body>
    </html>

    <script>
        const divs = document.getElementsByTagName("div")

        for(let div of divs) {
            console.log(div) // 循环打印 div 元素
        }
    </script>
```

### 传递参数给迭代器
我们可以通过 `next()` 方法向迭代器传递参数。当一个参数被传递给 `next()` 方法时，该参数就会成为生成器内部 `yield` 语句的值。这种能力对于更多高级功能（例如异步编程）来说是非常重要的。

如下：
```js
    function* createIterator() {
        let first = yield 1

        let second = yield first + 2

        yield second + 3
    }

    let iterator = createIterator()

    console.log(iterator.next())  // { value: 1, done: false }
    console.log(iterator.next(4)) // { value: 6, done: false }
    console.log(iterator.next(5)) // { value: 8, done: false }
```

对于 `next()` 的首次调用是一个特殊情况，传给它的任意参数都会被忽略。由于传递给 `next()` 的参数会成为 `yield` 语句的值，该 `yield` 语句指的是上次生成器中断执行处的语句；然而 `next()` 方法第一次被调用时，生成器函数才刚刚开始执行，没有“上一次中断处的 `yield` 语句”可以赋值。所以第一次调用 `next()` 时，不能向其传递参数。

### 在迭代器中抛出错误
能传递给迭代器的不仅是数据，还可以是错误条件。

如下：
```js
    function* createIterator() {
        let first = yield 1
        let second
        try {
            second = yield first + 2 // yield 4 + 2 ，然后抛出错误
        } catch (ex) {
            second = 6; // 当出错时，给变量另外赋值
        }
        yield second + 3
    }
    let iterator = createIterator()
    console.log(iterator.next()) // "{ value: 1, done: false }"
    console.log(iterator.next(4)) // "{ value: 6, done: false }"
    console.log(iterator.throw(new Error("Boom"))) // "{ value: 9, done: false }"
    console.log(iterator.next()) // "{ value: undefined, done: true }"
```

我们使用 `try-catch` 在代码中进行错误捕捉，当错误被抛出时， `catch` 部分捕捉到错误，并且将 `second` 重新赋值为 `6` ，然后再继续执行到下一个 `yield` 处并返回了 9 。

?> `next()` 方法指示迭代器继续执行（可能会带着给定的值），而 `throw()` 方法则指示迭代器通过抛出一个错误继续执行。在调用点之后会发生什么，根据生成器内部的代码来决定。

### 生成器的 return 语句
由于生成器是函数，我们也可以在内部使用 `return` 语句，既可以让生成器早一点退出执行，也可以指定在 `next()` 方法最后一次调用时的返回值。

如下：
```js
    function* createIterator() {
        yield 1
        return 2
    }

    const iterator = createIterator()

    console.log(iterator.next()) // { value: 1, done: false }
    console.log(iterator.next()) // { value: 2, done: true }
    console.log(iterator.next()) // { value: undefined, done: true }
```

上面代码中，当我们第二次调用 `next()` 方法时，值 `2` 会被返回在 `value` 字段中，此时的 `done` 字段的值第一次变成了 `true`。此后我们再调用 `next()` ，`value` 属性都会重新变回 `undefined`。

>
> 扩展运算符与 `for-of` 循环会忽略 `return` 语句所指定的任意值。一旦它们看到 `done` 的值为 `true` ，它们就会停止操作而不会读取对应的 `value` 值。
>> 如下：
```js
    function* createIterator1() {
        yield 1
        return 2
    }
    function* createIterator2() {
        yield 1
        yield 2
    }
    const iterator1 = createIterator1()
    const iterator2 = createIterator2()
    for(let i of iterator1) {
        console.log(i)
        // 输出
        // 1
    }
    for(let i of iterator2) {
        console.log(i)
        // 输出
        // 1
        // 2
    }
```

### 生成器委托
在某些情况下，将两个迭代器的值合并在一起会更有用。生成器可以用星号（`*`）配合 `yield` 这一特殊形式来委托其他的迭代器。

如下：
```js
    function* numIterator() {
        yield 1
        yield 2
    }

    function* colorIterator() {
        yield "red"
        yield "green"
    }

    function* createCombinedIterator() {
        yield *numIterator()
        yield *colorIterator()
        yield true
    }

    const iterator = createCombinedIterator()

    console.log(iterator.next()) // { value: 1, done: false }
    console.log(iterator.next()) // { value: 2, done: false }
    console.log(iterator.next()) // { value: "red", done: false }
    console.log(iterator.next()) // { value: "greed", done: false }
    console.log(iterator.next()) // { value: true, done: false }
    console.log(iterator.next()) // { value: undefined, done: true }
```

从上面的例子可以看出，`createCombinedIterator()` 依次委托了 `numIterator()` 与 `colorIterator()`，从外部看就像一个单一的迭代器，用于产生值。当我们每次调用 `next()` 就会委托给合适的生成器，直到创建的迭代器全部清空为止。

### 异步任务运行

###### 一个简单的任务运行器
由于 `yield` 能停止运行，并在重新开始运行前等待 `next()` 方法被调用，我们就可以在没有回调函数的情况下实现异步调用。

如下：
```js
    function run(taskDef) {
        // 创建迭代器
        const task = taskDef()

        // 启动任务
        let result = task.next()

        // 递归使用函数来保持对 `next()` 的调用
        function step() {
            if(!result.done) {
                result = task.next()
                step()
            }
        }

        // 开始执行
        step()
    }

    run(function* () {
        console.log(1)
        yield
        console.log(2)
        yield
        console.log(3)
        yield
        console.log(4)
        yield
    })
```

###### 带数据的任务运行
我们也可以给上面的例子传递数据，只需要稍微改造一下。如下：
```js
    function run(taskDef) {
        // 创建迭代器
        const task = taskDef()

        // 启动任务
        let result = task.next()

        // 递归使用函数来保持对 `next()` 的调用
        function step() {
            if(!result.done) {
                result = task.next(result.value)
                step()
            }
        }

        // 开始执行
        step()
    }

    run(function* () {
        let value = yield 1
        console.log(value) // 1
        value = yield value + 1
        console.log(value) // 2
        value = yield value + 1
        console.log(value) // 3
    })
```

###### 异步任务运行器
由于 `yield` 表达式将它们的值传递给了任务运行器，这就意味着任意函数调用都必须返回一个值，并以某种方式标明该返回值是个异步操作调用，而任务运行器应当等待此操作。

此处是将返回值标明为异步操作的一种方法：
```js
    function fetchData() {
        return function(callback) {
            callback(null, "Hi!")
        }
    }
```

此例的目的是：任何打算让任务运行器调用的函数，都应当返回一个能够执行回调函数的函数。

虽然 `fetchData()` 函数是同步的，但你能延迟对回调函数的调用，从而轻易地将它改造为异步函数，就像这样：
```js
    function fetchData() {
        return function(callback) {
            setTimeout(() => {
                callback(null, "Hi!")
            }, 1000)
        }
    }
```

结合上面的例子，我们可以改造一下我们的任务运行器，当 `result.value` 是一个函数时我们就执行它，而不是仅仅将它传递给 `next()` 方法。

如下：
```js
    // 模拟异步操作
    function fetchData(data) {
        return function(callback) {
            setTimeout(() => {
                callback(null, data)
            }, 3000)
        }
    }

    function run(taskDef) {
        // 创建迭代器
        const task = taskDef()
        // 启动任务
        let result = task.next()

        // 递归使用函数来保持对 `next()` 的调用
        function step() {
            if(!result.done) {
                if(typeof result.value === "function") {
                    result.value((err, data) => {
                        if(err) {
                            console.log(err)
                            return 
                        }

                        result = task.next(data)
                        step()
                    })
                }else {
                    result = task.next(result.value)
                    step()
                }
            }
        }

        // 开始执行
        step()
    }

    run(function* () {
        let value = yield 1
        console.log(value) // 1
        value = yield fetchData(value + 1)
        console.log(value) // 2
        value = yield fetchData(value + 1)
        console.log(value) // 3
    })
```

!> 使用这种方法我们也可以进行异步函数的处理，不过这种方法也有它的缺点，我们无法确定返回的函数是否是异步的，而且返回的函数也必须要有回调方法。

<!-- ### 总结
`Symbol.iterator` 符号被用于定义对象的默认迭代器。内置对象与自定义对象都可以使用这个符号，以提供一个能返回迭代器的方法。当 `Symbol.iterator` 在一个对象上存在时，该对象就会被认为是可迭代对象。 -->

