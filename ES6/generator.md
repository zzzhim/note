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
```