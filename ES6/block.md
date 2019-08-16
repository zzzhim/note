# 块级绑定

### var 声明与变量提升
使用 `var` 关键字声明的变量，无论其实际声明位置在何处，都会被视为声明于所在函数的顶部（如果声明不在任意函数内，则视为在全局作用域的顶部）。这就是所谓的变量提升。

```js
    function getValue(condition) {
        if(condition) {
            var value = "blue"

            return value
        }else {
            console.log(value) // 在此处可以访问，值为undefined
            return null
        }

        console.log(value) // 在此处可以访问，值为undefined
    }
```

对于刚接触 `JS` 的人，或许会认为仅当 `condition` 的值为 **true** 时，变量 `value` 才会被创建。但实际上 `value` 无论何时都会被创建。 `JS` 引擎在后台对 `getValue` 函数进行了调整，就像下面这样：

```js
    function getValue(condition) {
        var value // 未初始化的变量，默认值为undefined

        if(condition) {
            value = "blue"

            return value
        }else {
            console.log(value) // 在此处可以访问，值为undefined
            return null
        }

        console.log(value) // 在此处可以访问，值为undefined
    }

```

`value` 变量的声明被提升到了顶部，而初始化工作则保留在原处。这也代表我们可以在 `else` 分支内 `value` 变量也可以被我们访问到，此处它的值会是 `undefined` ，因为它并没有被初始化。

?> **块级声明：** 块级声明也就是让所声明的变量在指定块的作用域外无法被访问。块级作用域（又被称为词法作用域）在以下情况被创建：

```js
    // 1. 在一个函数内部
    function fun() {
        // no thing
    }

    // 2. 在一个代码块（由一对花括号包裹）内部
    {
        // no thing
    }
```

### let 声明
`let` 声明的语法与 `var` 的语法一致。我们完全可以用 `let` 来代替 `var` 进行变量声明，但会将变量的作用域限制在当前的块级作用域中。由于 `let` 声明不存在变量提升，因此我们需要手动将 `let` 声明放置到顶部，以便让变量在整个代码块都可以被访问到。

```js
    function getValue(condition) {
        if(condition) {
            let value = "blue"

            return value
        }else {
            // value 在此处不可被访问
            return null
        }

        // value 在此处不可被访问
    }
```

?> 这种写法的 `getValue` 函数的行为更接近其他类**C**语言。由于变量 `value` 声明使用的是 `let` 而非 `var`,该声明就没有被提升到函数定义的顶部，因此变量 `value` 在 `if` 代码块外部是无法访问的；并且在 `condition` 的值为 **false** 时，该变量是永远不会被声明并初始化的。

### 禁止重复声明
如果一个标识符已经在代码块内部被定义，那么在此代码块内使用同一个标识符进行 `let` 声明就会导致**抛出错误**。如下：
```js
    var count = 30

    // 语法错误 Identifier 'count' has already been declared
    let count = 40
```
在本例中，`count` 变量被声明了两次：一次使用 `var` ，另一次使用 `let`。 因为 `let` 不能在同一作用域内重复声明一个已有标识符，此处的 `let` 声明就会抛出错误。另一方面，在嵌套的作用域内使用 `let` 声明一个同名的新变量，则不会抛出错误。
```js
    var count = 30

    // 不会抛出错误
    if(condition) {
        let count = 40
    }
```
在此处 `let` 声明并没有抛出错误，这是因为我们并不是在同一 **块级作用域** 再次创建此变量，而是在 `if` 代码块内部创建的，这个新变量会屏蔽全局的 `count` 变量，从而在局部阻止对于后者的访问。

### 常量声明
在 **ES6** 中里也可以使用 `const` 语法进行声明。使用 `const` 声明的变量会被认为是 **常量（constant）** ，意味着它们的值在被设置完成后就不能再被改变。正因为如此，所有的 `const` 变量都需要在声明时进行初始化。如下：
```js
    // 有效的常量
    const maxItems = 30

    // 语法错误：未进行初始化
    const name
```

`maxItems` 变量被初始化了，因此它的 `const` 声明能正常奇效。而 `name` 变量没有被初始化，导致在试图运行这段代码时抛出了错误。

对比 `const` 声明与 `let` 声明

常量声明与 `let` 声明一样，都是块级声明。这意味着常量在声明它们的语句块外部也是无法访问的，并且声明同样不会被提升。如下：
```js
    if (condition) {
        const maxItems = 5;
    }
    // maxItems 在此处无法被访问
```

与 `let` 的另一个相似之处，是 `const` 声明在同一个作用域内定义一个已经声明的变量时同样会抛出错误。如下：
```js
    var message = "Hello!"
    let age = 25

    // 二者都会抛出错误
    const message = "Good!"
    const age = 18
```

两个 `const` 声明都可以单独使用，但是在前面使用 `var` 与 `let` 声明过后的情况下，二者都会抛出错误。

!> `let` 与 `const` 之间有个必须牢记的重大区别：试图对之前用 `const` 声明的常量进行赋值会抛出错误，无论是在严格模式还是非严格模式下：
```js
    const maxItems = 5

    // 抛出错误
    maxItems = 6
```

?> 这里需要注意的是 `maxItems` 变量不能被再次赋值。然而与其他语言不同， **JS** 的常量如果是一个对象，它所包含的值是可以被修改的。这是因为 `const` 声明创建一个值的只读引用。但这并不意味着它所持有的值是不可变的，只是变量标识符不能重新分配。例如，在引用内容是对象的情况下，这意味着可以改变对象的内容（例如，其参数）。
```js
    const person = {
        name: '大白兔奶糖'
    }

    // 正常
    person.name = '奶糖'

    // 抛出错误
    person = {
        name: '软糖'
    }
```

这是因为 `person` 在初始化时被绑定了带有一个属性的对象。修改 `person.name` 是可以的，因为该操作只是修改了 `person` 对象的成员，并没有修改 `person` 的绑定值。但是当我们尝试为 `person` 对象重新赋值时（改变变量绑定），就会导致抛出错误。

!> `const` 阻止的是对于变量绑定的修改，而不阻止我们对成员值的修改。

### 暂时性死区
使用 `let` 或 `const` 声明的变量，在达到声明处之前都是无法访问的，试图访问会导致一个引用错误，即使在我们进行安全的操作时（例如使用 `typeof` 运算符），也是如此。如下：
```js
    if(condition) {
        //  Cannot access 'value' before initialization
        console.log(typeof value)

        // 虽然这里是使用的 let 声明的但是 const 也会出现相同的情况
        let value = "blue"
    }
```

当我们使用 `let` 或 `const` 声明的变量，若试图在定义位置之前使用它，无论如何都不能避免暂时性死区。

### 循环中的块级绑定
我们最需要使用变量的块级作用域的场景，或许就是在 `for` 循环内，也就是想让一次性的循环计数器仅仅能在循环内部使用。如下：
```js
    for(var i = 0; i < 10; i++) {
        process(arr[i])
    }

    // i 在此处也是可以被访问到的
    console.log(i) // 10
```

如果我们把上面的示例换成 `let`，则会这样：
```js
    for (let i = 0; i < 10; i++) {
        process(arr[i])
    }

    // i 在此处不可访问，抛出错误
    console.log(i)
```

### 循环内的函数
长期以来， `var` 的特点使得循环变量在循环作用域之外仍然可被访问，于是在循环内创建函数就变得很有问题。如下:
```js
    var funcs = []

    for(var i = 0; i < 10; i++) {
        funcs.push(function() {
            console.log(i)
        })
    }

    funcs.forEach(function (fun) {
        fun() // 输出数值 10 十次
    })
```

?> 可能我们本来预期这段代码会输出 0 到 9 的数值，但它却在同一行讲数值 10 输出了十次。这是因为变量 `i` 在循环的每次迭代中都被共享了，意味着循环内创建的那些函数都拥有对于同一变量的引用。在循环结束后，变量 `i` 的值会是 `10` ，因此当 `console.log(i)` 被调用时，每次都打印出 `10`。

想要解决上面的问题，我们可以在循环内使用立即调用函数表达式（IIFE），以便在每次迭代中强制创建变量的一个新副本。如下：
```js
    var funcs = []

    for(var i = 0; i < 10; i++) {
        funcs.push((function (value) {
            return function() {
                console.log(value)
            }
        }(i)))
    }

    funcs.forEach(function(fun) {
        fun() // 0 到 9 依次输出
    })
```

虽然使用这种方法可以达到我们预期的效果，但是却增加了我们的代码量，幸运的是，使用 `let` 和 `const` 的块级绑定可以在 **ES6** 中简化这个循环。

### 循环内的 let 声明
`let` 声明通过有效模仿上例中 **IIFE** 的作用而简化了循环。在每次迭代中，都会创建一个新的同名变量并对其进行初始化。这意味着我们完全可以省略 **IIFE** 而获得预期的结果。如下：
```js
    var funcs = []

    for(let i = 0; i < 10; i++) {
        funcs.push(function() {
            console.log(i)
        })
    }

    funcs.forEach(function(fun) {
        fun() // 0 到 9 依次输出
    })
```

?> 与使用 `var` 声明以及 `IIFE` 相比，这样能达到相同的效果，而且更加简洁。在循环中 `let` 声明每次都创建了一个新的 `i` 变量，因此在循环内部创建的函数获得了各自的 `i` 副本，而每个 `i` 副本的值都在每次循环迭代声明变量的时候被确定了。这种方式同样可以应用在 `for-in` 和 `for-of` 循环中。如下：

```js
    var funcs = []
    var object = {
        a: true,
        b: true,
        c: true
    }

    for(let key in object) {
        funcs.push(function() {
            console.log(key)
        })
    }

    funcs.forEach(function(func) {
        func() // 依次输出 "a"、 "b"、 "c"
    })
```

### 循环内的常量声明
ES6 规范没有明确禁止在循环中使用 `const` 声明，然而它会根据循环方式的不同而有不同行为。在常规的 `for` 循环中，我们可以在初始化时使用 `const` ，但循环会在你试图改变该变量的值时抛出错误。如下：
```js
    var funcs = [];
    // 在一次迭代后抛出错误
    for (const i = 0; i < 10; i++) {
        console.log(i) // 会在打印 0 之后抛出错误。
    }
```

?> 因为第一次迭代成功执行后，此时 `i` 的值为 0 。在 `i++` 执行时，一个错误抛出，这是因为该语句试图修改常量的值。

但是当 `const` 变量在 `for-in` 或者 `for-of` 循环中使用时，与 `let` 变量效果相同。如下：
```js
    var funcs = []
    var object = {
        a: true,
        b: true,
        c: true
    }

    for(const key in object) {
        funcs.push(function() {
            console.log(key)
        })
    }

    funcs.forEach(function(func) {
        func() // 依次输出 "a"、 "b"、 "c"
    })
```

?> `const` 能够在 `for-in` 或者 `for-of` 内工作，是因为循环为每次迭代创建了一个新的变量绑定，而不是去修改已绑定的变量的值。

### 全局块级绑定
`let` 与 `const` 不同于 `var` 的另一个方面是在全局作用域上的表现。当在全局作用域上使用 `var` 时，它会创建一个新的全局变量，并且成为全局对象（浏览器上是 `window`）的一个属性。这意味着我们使用 `var` 可能会无意间覆盖某个已有的全局属性。但是当我们在全局作用域上使用 `let` 或 `const`时，虽然也会在全局作用域上创建新的绑定，但是并不会有任何属性添加到全局对象（`window`）上。

```js
    var RegExp = "hello!"
    console.log(window.RegExp) // "hello!"

    var good = "Good!"
    console.log(window.good) // "Good!"
```

```js
    let RegExp = "hello!"
    console.log(RegExp) // "hello!"
    console.log(window.RegExp === RegExp) // false

    const good = "Good!"
    console.log(good) // "Good!"
    console.log(good in window) // false
```

### 总结
`let` 与 `const` 的块级绑定将**块级作用域**引入了**JS**。这两种方式都不会进行变量提升，并且只能在声明它们的**块级作用域**内部存在，并且在声明变量之前的位置访问时，会导致**暂时性死区**的错误。

`let` 与 `const` 的表现在很多情况下都类似与 `var`，然而在循环中有明显的区别。在 `for-in` 和 `for-of` 循环中，`let` 与 `const` 都能在迭代的时候创建一个新的绑定，这意味这在循环体内创建的函数可以使用当前迭代所绑定的循环变量值（而不是像使用 `var` 那样，统一使用循环结束时的变量值）。这一点在 `for` 循环中使用 `let` 声明时也成立，不过在 `for` 循环中使用 `const` 声明会导致错误。

在使用**块级绑定**的时候默认情况下应该使用 `const` ，只有在明确知道变量值需要更改的情况下才使用 `let` 。这样有助于防止某些类型的错误。