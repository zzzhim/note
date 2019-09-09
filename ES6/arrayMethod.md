# 增强的数组功能
数组是 JS 中的一种基本对象。ES6 中添加了许多方法来增强数组，并且还增加了创建类型话数组（**typed array**）的能力。

### Array.of() 方法
在 ES6 之前，调用 `new Array()` 构造器时，存在一个怪异点，根据传入参数的类型与数量的不同，实际上会导致一些不同的结果。

如下：
```js
    let arr = new Array(2)

    console.log(arr.length) // 2
    console.log(arr[0])     // undefined
    console.log(arr[1])     // undefined

    arr = new Array("2")
    console.log(arr.length) // 1
    console.log(arr[0])     // "2"

    arr = new Array(2, "3")
    console.log(arr.length) // 2
    console.log(arr[0])     // 2
    console.log(arr[1])     // "3"

    arr = new Array(3, 4)
    console.log(arr.length) // 2
    console.log(arr[0])     // 3
    console.log(arr[1])     // 4
```

当我们对 `Array` 构造器传入单个的数值类型时，数组的长度会被设置为该参数；但是当我们使用单个的非数值类型来调用时，该参数就会成为目标数组的唯一项；如果使用多个参数来调用，也会作为目标数组的项。这种行为其实是很奇怪的，也是非常具有风险的，因为可能有些时候我们并不能确定参数的类型。

ES6 引入了 `Array.of()` 来解决这个问题。 `Array.of()` 方法总会创建一个包含所有参数的数组。

如下：
```js
    let arr = Array.of(2)
    console.log(arr.length) // 1
    console.log(arr[0])     // 2

    arr = Array.of(1, 2, 3)
    console.log(arr.length) // 3
    console.log(arr[0])     // 1
    console.log(arr[1])     // 2
    console.log(arr[2])     // 3

    arr = Array.of("3")
    console.log(arr.length) // 1
    console.log(arr[0])     // "3"
```

> `Array.of()` 方法并没有使用 `Symbol.species` 属性来决定返回值的类型，而是使用了当前的构造器来做决定。

### Array.from() 方法
在 ES5 中我们将非数组对象转换成真正的数组，可能经常使用这种方法。如下：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
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
        function makeArray(arr) {
            return Array.prototype.slice.call(arr)
        }
        var arr = document.getElementsByTagName("div")

        console.log(Object.prototype.toString.call(arr)) // [object HTMLCollection]
        arr = makeArray(arr)

        console.log(Object.prototype.toString.call(arr)) // [object Array]
    </script>
```

上面的方法通过改变 `slice()` 方法的 `this` ，来将 **HTML集合** 转换为了数组。但是调用 `Array.prototype.slice.call(arr)` 并没有明确体现出我们这段代码的目的。ES6 新增了 `Array.from()` 方法来提供一种明确清晰的方式以解决这方面的需求。

如下：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
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
        function makeArray(arr) {
            return Array.from(arr)
        }
        var arr = document.getElementsByTagName("div")

        console.log(Object.prototype.toString.call(arr)) // [object HTMLCollection]
        arr = makeArray(arr)

        console.log(Object.prototype.toString.call(arr)) // [object Array]
    </script>
```

此处调用了 ` Array.from()` 方法，将一个 **HTML集合** 转换为了数组。

> `Array.from()` 方法同样使用 `this` 来决定要返回什么类型的数组。
>
> 注意： `Array.from()` 方法创建的是一个新的， **浅拷贝** 的数组实例。

###### 映射转换
如果想在数组转换时进行进一步的处理，我们可以向 `Array.from()` 方法传递一个映射用的函数作为第二个参数。此函数会将类数组对象的每一个值转换为目标形式，并将其存储在目标数组的对应位置上。

如下：
```js
    function translate() {
        return Array.from(arguments, value => value + 1)
    }

    const numbers = translate(1, 2, 3)

    console.log(numbers) // 2, 3, 4
```

如果映射函数需要在对象上工作，你可以手动传递第三个参数给 `Array.from()` 方法，从而指定映射函数内部的 `this` 值。

如下：
```js
    const helper = {
        diff: 1,
        add(value) {
            return value + this.diff
        }
    }

    function translate() {
        return Array.from(arguments, helper.add, helper)
    }

    const numbers = translate(1, 2, 3)

    console.log(numbers) // 2, 3, 4
```

上面的例子中，由于 `helper` 对象使用了 `this`，我们必须在向 `Array.from()` 方法传递第三个参数用于指定映射函数的 `this` 值。

###### 在可迭代对象上使用
`Array.from()` 方法不仅可用于类数组对象，也可用于可迭代对象，这意味着该方法可以将任
意包含 `Symbol.iterator` 属性的对象转换为数组。

如下：
```js
    const numbers = {
        *[Symbol.iterator]() {
            yield 1
            yield 2
            yield 3
        }
    }

    const numbers2 = Array.from(numbers, value => value + 1)
    console.log(numbers2) // 2, 3, 4
```

> 如果一个对象既是类数组对象，又是可迭代对象，那么迭代器就会使用 `Array.from()` 方法来决定需要转换的值。


### find() 与 findIndex() 方法
`find()` 与 `findIndex()` 方法均接受两个参数：一个回调函数、一个可选值用于指定回调函数内部的 `this` 。该会回调函数可接受三个参数：数组的某个元素、该元素对应的索引位置、以及该数组自身，这与 `map()` 和 `forEach()` 方法的回调函数所用的参数一致。该回调函数应当在给定的元素满足你定义的条件时返回 `true` ，而 `find()` 与 `findIndex()` 方法均会在回调函数第一次返回 `true` 时停止查找。

```js
    const numbers = [ 25, 30, 35, 40, 45 ]
    console.log(numbers.find(n => n > 33))       // 35
    console.log(numbers.findIndex(n => n > 33))  // 2
```

> `find()` 方法会返回匹配的值，而 `findIndex()` 方法则会返回匹配位置的索引。

### fill() 方法
`fill()` 方法能使用特定值填充数组中的一个或多个元素。当只使用一个参数的时候，该方法会用该参数的值填充整个数组。如下：
```js
    const arr = [ 1, 2, 3, 4 ]

    console.log(arr.fill(1)) // [ 1, 1, 1, 1 ]

    const arr2 = [ 1, 2, 3, 4 ]

    console.log(arr2.fill(10, 1, 2)) // [ 1, 10, 3, 4 ]
```

`fill` 的第二个参数和第三个参数，分别是填充的起始索引和终止索引（填充不包括终止索引）。

> 如果提供的起始位置或结束位置为负数，则它们会被加上数组的长度来算出最终的位置。

### copyWithin() 方法
`copyWithin()` 方法与 `fill` 类似, 可以一次性修改数组的多个元素。不过，与 `fill()` 使用单个值来填充数组不同， `copyWithin()` 方法允许你在数组内部复制自身元素。

如下：
```js
    let numbers = [ 1, 2, 3, 4, 5, 6 ]

    // 从索引 2 的位置开始粘贴
    // 从数组索引 0 的位置开始复制数据
    numbers.copyWithin(2, 0)

    console.log(numbers.toString()) // 1, 2, 1, 2, 3, 4
```

调用 `copyWithin()` 方法时将第二个参数指定为 `0` ，表示被复制的数据从索引值为 `0` 的元素开始，一直到没有元素可供复制为止。

`copyWithin()` 方法总是会一直复制到数组末尾，不过你还可以提供一个可选参数来限制到底有多少元素会被覆盖。这第三个参数指定了复制停止的位置（不包含该位置自身）。

如下：
```js
    let numbers = [ 1, 2, 3, 4, 5, 6 ]

    // 从索引 2 的位置开始粘贴
    // 从数组索引 0 的位置开始复制数据
    // 在遇到索引 1 时停止复制
    numbers.copyWithin(2, 0, 1)

    console.log(numbers.toString()) // 1, 2, 1, 4, 5, 6
```

> 类似于 `fill()` 方法，如果你向 `copyWithin()` 方法传递负数参数，数组的长度会自动被加到该参数的值上，以便算出正确的索引位置。

### 类型化数组
/*暂时不大理解，等详细理解了，再做笔记。*/