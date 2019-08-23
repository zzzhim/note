# 结构赋值
**解构赋值** 语法是一种**Javascript**表达式。通过**结构赋值**，可以将属性/值从对象/数组中取出，赋值给其他变量。

### 对象解构
在**ES5**中，从对象或数组中获取特定的数据存入本地变量，我们可能要编写许多重复的代码。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    // 获取对象中的指定数据
    const name = person.name
    const age = person.age
    const sex = person.sex
    //...
```

从上面的代码中看到我们想要获取到对象中的指定数据，就必须要逐个赋值，虽然看起来挺简单，但是如果需要提取的数据很多的话，就会变得很麻烦。这就是为什么**ES6**中为何要给对象和数组添加解构赋值的原因。

对象解构语法在赋值语句的左侧使用了对象字面量。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    const { name, age, sex } = person
    console.log(name, age, sex) // zzzhim 23 男
```

在上面的代码中 `person.name`、`person.age`、`person.sex`的值，分别被储存在了`name`、`age`、`sex`的本地变量中。

?> 进行解构赋值时，会把对象上同名的属性的值赋值给对应的变量，来完成解构赋值。

可以看到我们使用**ES6**中的对象解构赋值也可以达到同样的效果，同时代码也更加精简，即使是在处理大量数据的时候，也不会进行重复的操作。

!> 需要注意的是当我们使用解构来配合 `var`、`let` 与 `const`来声明变量的时候，我们必须提供初始化器（也就是等号右边的值）。

###### 无声明赋值
我们在进行变量声明解构赋值的同时，也可以进行**无声明赋值**。如下：
```js
    let name, age, sex
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    // 使用解构赋值来分配对应的值
    ;({ name, age, sex } = person)
    console.log(name, age, sex) // zzzhim 23 男
```

在上面的例子中 `name`、`age`、`sex`变量都已经被声明，然后我们通过解构来获取到了 `person` 上对应的同名属性，来进行赋值。

!> 这里进行解构赋值时，必须使用圆括号包裹解构赋值语句，这是因为 左侧的 `{ name, age, sex }` 会被认为一个块而不是对象字面量，使用圆括号包裹代码块，标识了里面的并不是块语句，而应该被解释为表达式。`(...)`表达式之前有些时候可能需要一个分号，否则可能会被当成上一行的函数执行。

### 默认值
变量可以先赋予默认值，当我们要提取的对象没有对应的属性或者值为 `undefined` 时，变量将会被赋予默认值。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: undefined
    }

    const { name, age, sex = "男", height = "1.85" } = person
    console.log(name, age, sex, height) // zzzhim 23 男 1.85
```

上面的例子我们可以看到，我们给 `sex` 与 `height` 声明了一个默认值，当 `person` 对象上面并没有该属性，或者该属性的值为 `undefined` 时默认值将会被应用。

### 别名：将对象的属性值赋值给不同的变量名
上面的例子中我们都是把对象的属性值赋值给了相同的变量名，ES6中的解构赋值也支持给与对象属性名不同的变量名赋值。如下：
```js
    const person = {
        name: "zzzhim"
    }

    const { name: englishName } = person
    console.log(englishName) // zzzhim
```

`{ name: englishName } = person` 表示要读取 `person` 对象上的 `name` 属性，并把它的值赋值在变量 `englishName` 上面。可以看到这种语法正好与我们使用的传统字面量语法相反，传统语法将名称放在冒号左边、值放在右边。而本例中正好相反，名称在右，值则在左。

### 给别名添加默认值
我们可以给变量别名添加默认值，依然是在本地变量名称后添加等号与默认值。如下：
```js
    const person = {
        name: "zzzhim",
        age: undefined
    }

    const { age: localAge = 23 } = person
    console.log(localAge) // 23
```

### 嵌套的对象解构
使用类似于对象字面量的语法，可以深入到嵌套的对象结构中去提取我们想要的数据。如下：
```js
    const person = {
        name: {
            englishName: 'zzzhim',
            chineseName: '反芹菜联盟盟主'
        }
    }

    const { name: { englishName, chineseName } } = person
    console.log(englishName, chineseName) // zzzhim, 反芹菜联盟盟主
```

从上面的例子中我们看到，解构赋值上使用了花括号，表示应当到 `person` 对象下的 `name` 属性寻找 `englishName` 与 `chineseName` 属性。

当然了**嵌套的对象解构**也同样支持参数默认值与别名。
```js
    const person = {
        name: {
            chineseName: '反芹菜联盟盟主'
        }
    }

    const { name: { englishName = "zzzhim", chineseName: localName } } = person
    console.log(englishName, localName) // zzzhim, 反芹菜联盟盟主
```

### 数组解构
数组解构的语法和对象解构差不多，只是对象字面量（`{}`）替换成了数组字面量（`[]`）。数组结构时，解构是根据数组内部的位置，而不是像对象一样根据对象上的具名属性进行结构。如下：
```js
    const nums = [ 1, 2, 3 ]

    const [ one, two, three ] = nums

    console.log(one)    // 1
    console.log(two)    // 2
    console.log(three)  // 3
```

上面的数组解构从 `nums` 数组中取出了 `1`, `2`, `3`，并将它们赋值给 `one`、`two`、`three`变量。这些值被赋值，是根据它们在数组中的位置进行的，而不是根据变量名称。

当我们只想要取出 `nums` 中第三个值时，我们也可以在数组解构中忽略某一些值。如下：
```js
    const nums = [ 1, 2, 3 ]

    const [ , , three ] = nums

    console.log(three)  // 3
```

!> 与对象解构一样，我们在使用 `var`、`let`、`const` 进行数组解构的时候，也需要提供初始化器。

同样我们也可以在赋值表达式中使用数组解构。如下：
```js
    let one, two, three
    const nums = [ 1, 2, 3 ]

    ;[ one, two, three ] = nums

    console.log(one)    // 1
    console.log(two)    // 2
    console.log(three)  // 3
```

?> 赋值表达式中数组解构与对象结构的区别是，在数组表达式中不必将表达式包含在圆括号（`()`）中。

数组解构中，有一个很实用的例子，可以轻易地互换两个变量的值。如下：
```js
    let a = 1,
        b = 2

    ;[ a, b ] = [ b, a ]

    console.log(a, b) // 2, 1
```

### 默认值
数组解构赋值也支持默认值，当数组指定位置项不存在，或者值为 `undefined`时，那么就会应用默认值。如下：
```js
    const nums = [ 1, undefined ]

    const [ one, two = 2, three = 3 ] = nums

    console.log(one)    // 1
    console.log(two)    // 2
    console.log(three)  // 3
```

### 嵌套的解构
同样的数组也支持嵌套的解构，在整个解构模式中插入另一个数组模式，解构操作就会下行到嵌套的数组中。如下：
```js
    const nums = [ 1, [ 2, 3 ], 4 ]

    const [ one, [ two, three ], four ] = nums

    console.log(one)    // 1
    console.log(two)    // 2
    console.log(three)  // 3
    console.log(four)   // 4
```

### 解构一个函数返回的数组
从一个函数中返回一个数组是十分常见的情况。数组解构，同样也支持解构一个函数返回的数组。
```js
    function fun() {
        return [ 1, 2 ]
    }

    const [ one, two ] = fun()

    console.log(one)    // 1
    console.log(two)    // 2
```

### 剩余项
与函数的剩余参数相同，数组解构也有个类似的、名为剩余项（rest items）的概念，它使用 `...` 语法来将剩余的项目赋值给一个指定的变量。如下：
```js
    const nums = [ 1, 2, 3 ]

    const [ one, ...restNums ] = nums

    console.log(one)         // 1
    console.log(restNums)    // [ 2, 3 ]
```

`nums` 的第一项赋值给了变量 `one`, 而它的剩余参数，则以数组的形式以此添加到了 `restNums` 中。

在 `ES5`中我们想要克隆一个数组，可能会用到 `concat()` 方法来克隆数组，而在 `ES6` 中，我们可以使用**剩余参数**的形式，更加方便的达到同样的目的。

ES5中克隆数组：
```js
    const nums = [ 1, 2, 3 ]

    const copyNums = nums.concat()

    console.log(copyNums) // [ 1, 2, 3 ]
```

[concat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法：用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

ES6中使用**剩余参数**克隆数组：
```js
    const nums = [ 1, 2, 3 ]

    const copyNums = [ ...nums ]

    console.log(copyNums) // [ 1, 2, 3 ]
```

!> 数组剩余参数，也必须是数组解构模式中的最后部分，之后不能有逗号，否则就是语法错误。

### 解构嵌套对象和数组
对象与数组解构能被用在一起，以创建更复杂的解构表达式。
```js
    const createElement = [
        'div',
        {
            className: 'foo',
            style: {
                color: 'red',
                fontSize: '14px'
            }
        },
        [
            '这是一段内容!',
            [
                'h1',
                {},
                '这是一段文本！'
            ]
        ]
    ]

    const [
        ,
        {
            className,
            style: { color, fontSize }
        },
        content
    ] = createElement

    console.log(className) // foo
    console.log(color)     // red
    console.log(fontSize)  // 14px
    console.log(content)   // [ '这是一段内容!', [ 'h1', {}, '这是一段文本！' ] ]
```

此代码将 `createElement` 数组中的，`createElement[1]` 对象中的 `className` 与 `style` 下的 `color`、 `fontSize` 和 `createElement[2]` 的值提取了出来。混合使用对象与数组解构，可以把 `createElement` 中的任何部分提取出来。

### 函数参数解构
解构还有一个特别有用的场景，即在传递函数参数时。
```js
    function setCookie(
        name,
        value,
        {
            secure,
            path,
            domain,
            expires
        }
    ) {
        console.log(secure)  // true
        console.log(path)    // undefined
        console.log(domain)  // undefined
        console.log(expires) // 60000

        // 设置 cookie 的代码

    }

    // 第三个参数映射到 setCookie 的第三个参数上
    setCookie(
        "type",
        "js",
        {
            secure: true,
            expires: 60000
        }
    )
```

上面的代码我们可以看成这样来理解。
```js
    function setCookie(name, value, options) {
        let { secure, path, domain, expires } = options

        console.log(secure)  // true
        console.log(path)    // undefined
        console.log(domain)  // undefined
        console.log(expires) // 60000

        // 设置 cookie 的代码

    }

    // 第三个参数映射到 setCookie 的第三个参数上
    setCookie(
        "type",
        "js",
        {
            secure: true,
            expires: 60000
        }
    )
```

不过上面的代码还有一点小问题，当我们在默认情况下调用函数时，不传递第三个参数的时候，解构赋值会抛出错误。如下：
```js
    function setCookie(
        name,
        value,
        {
            secure,
            path,
            domain,
            expires
        }
    ) {
        console.log(secure)  // true
        console.log(path)    // undefined
        console.log(domain)  // undefined
        console.log(expires) // 60000

        // 设置 cookie 的代码
    }

    // 抛出错误 Cannot destructure property `secure` of 'undefined' or 'null'.
    setCookie("type", "js")
```

这是因为函数调用时，当我们不传递第三个参数时，实际上它会默认等于 `undefined`，这就导致了参数在进行解构时会抛出错误。

想要解决上面的错误，我们可以给函数参数设置一个默认值，当用户不传递或者传递 `undefined` 时，就会应用我们的默认值。如下：
```js
    function setCookie(
        name,
        value,
        {
            secure = true, // 函数参数解构的默认值
            path = "",
            domain,
            expires = 60000
        } = {}
    ) {
        console.log(secure)  // true
        console.log(path)    // ""
        console.log(domain)  // undefined
        console.log(expires) // 60000

        // 设置 cookie 的代码
    }

    setCookie("type", "js")
```

这样的话就不会有错误抛出了。

?> 函数参数解构的默认值，只需向上面的例子中，每个参数后面添加等号指定默认值就可以了。

### 总结
解构使得在 `JS` 中操作对象与数组变得更容易。使用熟悉的对象字面量与数组字面量语法，可以将数据结构分离并只获取你感兴趣的信息。`对象解构模式`允许你从对象中进行提取，而`数组模式`则能用于数组。

`对象`与`数组解构`都能在属性或项未定义时为其提供默认值；在赋值表达式右侧的值为 `null` 或 `undefined` 时，两种模式都会抛出错误。你也可以在深层嵌套的数据结构中使用对象与数组解构，下行到该结构的任意深度。

使用 `var` 、 `let` 或 `const` 的解构声明来创建变量，就必须提供初始化器。解构赋值能替代其他赋值，并且允许你把值解构到对象属性或已存在的变量上。

`参数解构`使用解构语法作为函数的参数，让“选项”（ `options` ）对象更加透明。你实际感兴趣
的数据可以与具名参数一并列出。解构的参数可以是`对象模式`、`数组模式`或`混合模式`，并且你能使用它们的所有特性。
