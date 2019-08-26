# 符号（Symbol）与符号（Symbol）属性
在 JS 已有的基本类型之外，ES6 引入了一种新的基本数据类型： **符号（`Symbol`）** 。

`Symbol()` 函数会返回 **Symbol** 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 **symbol** 注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法：`new Symbol()`。

?> 每个 `Symbol()` 返回的 **symbol** 值都是唯一的。一个 **symbol** 值能作为对象属性的标识符；这也是 **symbol**存在的意义。

### 创建符号值
符号没有字面量形式，这在 **JS** 的基本类型中是独一无二的。想要创建一个 **symbol** 值，我们可以使用全局函数 **Symbol()** 来创建。
```js
    const firstName = Symbol()
    const person = {}

    person[firstName] = '反芹菜联盟盟主'
    console.log(person[firstName]) // 反芹菜联盟盟主
```

通过上面的方法我们创建了一个名叫 `firstName` 的符号类型的变量，并将它作为了 `person` 对象的一个属性，而每次访问该属性都要使用这个符号值。

###### 符号描述
`Symbol()` 函数还可以接受一个额外的参数用于描述符号值，但是该描述不能用来访问对应属性，但是可以用于调试。如下：
```js
    const name = Symbol('name')
    const person = {}

    person[name] = '反芹菜联盟盟主'

    console.log(person[name]) // 反芹菜联盟盟主
    console.log(name) // Symbol(name)
```

符号的描述信息会被储存在内部属性 `[[Description]]` 中，当我们显式或者隐式调用时，该属性都会被读取。

当我们使用 `console.log()` 打印 `name` 符号时， `console.log()` 就隐式调用了 `name` 变量的 `toString()` 方法了。如下：
```js
    const name = Symbol('name')
    const str = name.toString()

    console.log(str)  // Symbol(name)
    console.log(name) // Symbol(name)
```

?> 除了使用 `toString()` 方法，目前还没有其他办法可以从代码中直接访问 `[[Description]]` 属性。

### 识别符号值
由于符号是基本类型的值，因此我们可以使用 `typeof` 运算符来判断一个变量是否为符号。如下：
```js
    const symbol = Symbol('test symbol')

    console.log(typeof symbol === 'symbol') // true
```

### 使用符号值
我们可以再任意能够使用 **需计算属性名** 的场合使用符号。此外还可以在 `Object.defineProperty()` 或者 `Object.defineProperties()` 调用中使用它。如下：
```js
    const name = Symbol('name')

    // 使用需计算属性名
    const person = {
        [name]: '反芹菜联盟盟主1'
    }

    // 让该属性变为只读
    Object.defineProperty(person, name, {
        writable: false
    })

    const restName = Symbol('name')

    Object.defineProperties(person, {
        [restName]: {
            value: '反芹菜联盟盟主2',
            writable: false
        }
    })

    console.log(person[name])       // 反芹菜联盟盟主1
    console.log(person[restName])   // 反芹菜联盟盟主2
```
> [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
>
> [Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

### 共享符号值
假如我们想要在不同的代码段中使用同一个 **符号值** ，例如在两个不同的对象类型中使用同一个 **符号属性** ，用来表示一个唯一标识符。为此，ES6 为我们提供了 **“全局符号注册表”** 供我们在任意时间点进行访问。

想要创建 **共享符号值** ，应该使用 `Symbol.for()` 方法而不是 `Symbol()` 方法。如下：
```js
    const id = Symbol.for('id')
    const obj = {}

    obj[id] = 123

    console.log(obj[id]) // 123
    console.log(id)      // Symbol(id)
```

?> `Symbol.for()` 方法仅接受单个字符串类型的参数，作为目标符号值的标识符，同时此参数也会成为该符号的描述信息。

`Symbol.for()` 方法创建前，会首先搜索 **全局符号注册表** ，看看是否存在一个键值为 `id` 的 **符号值** 。如果存在就会返回已存在的 **符号值** ；否则创建一个新的 **符号值** 。如下：
```js
    const id1 = Symbol.for('id')

    const obj = {
        [id1]: 123
    }

    console.log(obj[id1]) // 123
    console.log(id1)      // Symbol(id)

    const id2 = Symbol.for('id')

    console.log(id1 === id2) // true
    console.log(obj[id2]) // 123
    console.log(id2)      // Symbol(id)
```

在上面的例子中，`id1` 和 `id2` 包含同一个 **符号值** ，在第一次调用 `Symbol.for('id')` 时创建了这个 **符号值** ，而第二次调用在 **全局符号注册表** 检测到此 **符号值** 以创建，则返回了已存在的 **符号值** 。

### Symbol.keyFor()
从 **全局symbol注册表** 中，根据 **符号值** 检索出对应的键值。如下：
```js
    const id = Symbol.for('id')

    console.log(Symbol.keyFor(id)) // id
```

### 符号值的转换
类型转换是 **JS** 语言重要的一部分，能够非常灵活地将一种数据类型转换为另一种。然而符号类型在进行转换时非常不灵活，因为其他类型缺乏与符号值的合理等价，尤其是符号值无法被转换为字符串或数值。

因为符号值无法被转换为字符串或数值，也就以为着当我们把 **符号（`Symbol`）** 与字符串进行连接或者对其使用数学运算符都会导致其发生错误。如下：
```js
    const id = Symbol.for('id')

    // 抛出错误：Cannot convert a Symbol value to a string
    const str = id + ''

    const symbol = Symbol.for('number')

    // 抛出错误：Cannot convert a Symbol value to a number
    const num = symbol + 1
```

?> 虽然说不能够对 **符号** 使用数学运算符，不过使用逻辑运算符是不会导致错误的，因为符号值在逻辑运算符中会被认为等价于 `true` （就像 **JS** 中其他的非空值一样）。

### 检索符号属性
想要检索对象的所有属性名称可以使用 `Object.keys()` 与 `Object.getOwnPropertyNames()`。

> `Object.keys()` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 `for...in` 循环遍历该对象时返回的顺序一致 。如果对象的键-值都不可枚举，那么将返回由键组成的数组。
>
> `Object.getOwnPropertyNames()`方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

上面的两种方法都不能返回符号类型的属性，以保持它们在 **ES5**的功能不发生变化。为了让我们可以检索对象的符号类型属性，**ES6** 新增了 `Object.getOwnPropertySymbols()` 方法。

> `Object.getOwnPropertySymbols()` 方法返回一个给定对象自身的所有 Symbol 属性的数组。

```js
    const symbol = Symbol.for('id')

    const obj = {
        a: 'aaa',
        [symbol]: 123,
        b: 'bbb'
    }

    const arr = Object.getOwnPropertySymbols(obj)

    console.log(arr.length)  // 1
    console.log(arr[0])      // Symbol(id)
    console.log(obj[arr[0]]) // 123
```

上面的代码中 `obj` 对象有2个普通属性和一个 `Symbol` 属性，我们使用 `Object.getOwnPropertySymbols()` 方法返回的数组，则只包含了它的符号值。

所有对象初始化情况下都不包含任何自由符号类型属性，但对象可以从它们的原型上继承符合类型属性。**ES6** 预定义了一些此类属性，它们被称为“知名符合”。

### 使用知名符号暴露内部方法
**ES6** 允许使用符号类型的原型属性来定义某些对象的基础行为。

**ES6** 定义了“知名符号”来代表 JS 中一些公共行为，而这些行为此前被认为只能是内部操作。
每一个知名符号都对应全局 `Symbol` 对象的一个属性，例如 `Symbol.create` 。

这些知名符号下面会介绍一部分：

迭代 `symbols`
> `Symbol.iterator`：一个返回一个对象默认迭代器的方法。被 `for...of` 使用。
>
> `Symbol.asyncIterator`: 一个返回对象默认的异步迭代器的方法。被 for await of 使用。

正则表达式 symbols
> `Symbol.match`：一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 `String.prototype.match()` 使用。
>
> `Symbol.replace`：一个替换匹配字符串的子串的方法. 被 `String.prototype.replace()` 使用。
>
> `Symbol.search`： 一个返回一个字符串中与正则表达式相匹配的索引的方法。被`String.prototype.search()` 使用。
>
> `Symbol.split`： 一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 `String.prototype.split()` 使用。

其他 symbols
> `Symbol.hasInstance`： 一个确定一个构造器对象识别的对象是否为它的实例的方法。被 `instanceof` 使用。
>
> `Symbol.isConcatSpreadable`： 一个布尔值，表明一个对象是否应该 `flattened` 为它的数组元素。被 `Array.prototype.concat()` 使用。
>
> `Symbol.unscopables`： 拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。
>
> `Symbol.species`： 一个用于创建派生对象的构造器函数。
>
> `Symbol.toPrimitive`： 一个将对象转化为基本数据类型的方法。
>
> `Symbol.toStringTag`：用于对象的默认描述的字符串值。被 `Object.prototype.toString()` 使用。

###### `Symbol.hasInstance`
每个函数都具有一个 `Symbol.hasInstance` 方法，用来判断指定对象是否为本函数的一个实例。这个方法定义在 `Function.prototype` 上，因此所有函数都继承了面对 `instanceof` 运算符时的默认行为。 `Symbol.hasInstance` 属性自身是不可写入、不可配置、不可枚举的，从而保证它不会被错误地重写。

`Symbol.hasInstance` 方法只接受单个参数，即需要检测的值。如果该值是本函数的一个实例，则返回 `true`。如下：
```js
    ([] instanceof Array) // true
    // 上面的代码等价于：
    Array[Symbol.hasInstance]([]) // true
```

ES6 从本质上将 `instanceof` 运算符重定义为上述方法调用的简写语法，这样使用 `instanceof` 便会触发一次方法调用，实际上允许你改变该运算符的工作。

我们可以自定义一个函数，使得任意对象都不会被判断为该函数的一个实例。如下：
```js
    function Fun() {
        // no thing
    }

    // 注释此段代码则结果为 true
    Object.defineProperty(Fun, Symbol.hasInstance, {
        value(v) {
            return false
        }
    })

    const obj = new Fun()

    console.log(obj instanceof Fun) // false
```

> `Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

###### `Symbol.isConcatSpreadable`
内置的 `Symbol.isConcatSpreadable` 符号用于配置某对象作为 `Array.prototype.concat()` 方法的参数时是否展开其数组元素。

默认情况下 `Array.prototype.concat()` 会展开自身元素连接到结果中。如下：
```js
    const arr1 = [ 1, 2, 3 ]
    const arr2 = [ 4, 5 ]

    const arr3 = arr1.concat(arr2)

    console.log(arr3) // [ 1, 2, 3, 4, 5 ]
```

当我们设置了 `Symbol.isConcatSpreadable` 属性为 `false` 时，如下：
```js
    const arr1 = [ 1, 2, 3 ]
    const arr2 = [ 4, 5 ]

    arr2[Symbol.isConcatSpreadable] = false

    const arr3 = arr1.concat(arr2)

    console.log(arr3) // [ 1, 2, 3, [ 4, 5 ] ]
```

对于类数组 (array-like)对象，默认不展开。期望展开其元素用于连接，需要设置 `Symbol.isConcatSpreadable` 为 `true` ：
```js
    const arr1 = [ 1, 2, 3 ]
    const obj = {
        [Symbol.isConcatSpreadable]: true,
        length: 2,
        0: 4,
        1: 5
    }

    const arr3 = arr1.concat(obj)

    console.log(arr3) // [ 1, 2, 3, 4, 5 ]
```

设置 `Symbol.isConcatSpreadable` 为 `false`，如下：
```js
    const arr1 = [ 1, 2, 3 ]
    const obj = {
        [Symbol.isConcatSpreadable]: false,
        length: 2,
        0: 4,
        1: 5
    }

    const arr3 = arr1.concat(obj)

    console.log(arr3) // [ 1, 2, 3, { 0: 4, 1: 5, length: 2, Symbol(Symbol.isConcatSpreadable): false }]
```

###### Symbol.toPrimitive
`Symbol.toPrimitive` 是一个内置的 `Symbol` 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。如下：
```js
    const obj = {
        [Symbol.toPrimitive]: function(hint) {
            if (hint == 'number') {
                return 42
            }
            return null
        }
    };

    console.log(obj / 2) // 21
```

###### Symbol.toStringTag
`Symbol.toStringTag` 是一个内置 `symbol`，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。如下：
```js
    function Cat() {
        // no thing
    }

    Cat.prototype[Symbol.toStringTag] = "Cat"

    const cat = new Cat()

    console.log(cat.toString())
    console.log(Object.prototype.toString.call(cat))
```

> 除非进行了特殊指定，否则所有对象都会从 `Object.prototype` 继承 `Symbol.toStringTag` 属性，其默认的属性值是字符串 `"Object"`

###### Symbol.match
`Symbol.match` 指定了匹配的是正则表达式而不是字符串。 `String.prototype.match()` 方法会调用此函数。如下：
```js
    const reg = /foo/

    reg[Symbol.match] = false

    console.log('/foo/'.startsWith(reg)) // true

    console.log('/123foo123/'.endsWith(reg)) // false
```
如果将 `Symbol.match` 置为 `false`，使用 `match` 属性的表达式检查会认为该象不是正则表达式对象。`startsWith` 和 `endsWith` 方法将不会抛出 `TypeError`。

我们也可以使用 `Symbol.match` 定义一个正则表达式对象。如下：
```js
    const reg = {
        [Symbol.match]: function(value) {
            return value.length > 6 ? '长度大于6' : '长度小于6'
        }
    }

    const len1 = 'Hello world'
    const len2 = 'Hello'


    console.log(len1.match(reg)) // 长度大于6
    console.log(len2.match(reg)) // 长度小于6
```

###### Symbol.replace
`Symbol.replace` 这个属性指定了当一个字符串替换所匹配字符串时所调用的方法。`String.prototype.replace()` 方法会调用此方法。

我们也可以使用 `Symbol.replace` 定义一个正则表达式对象。如下：
```js
    const reg = {
        [Symbol.replace]: function(value, replacement) {
            return value.length === 11 ? replacement + value.substring(11) : value
        }
    }

    const len1 = 'Hello world'
    const len2 = 'Hello'


    console.log(len1.replace(reg, '12345')) // 12345
    console.log(len2.replace(reg, '12345')) // Hello
```

###### Symbol.search
`Symbol.search` 指定了一个搜索方法，这个方法接受用户输入的正则表达式，返回该正则表达式在字符串中匹配到的下标，这个方法由以下的方法来调用 `String.prototype.search()`。

我们也可以使用 `Symbol.search` 定义一个正则表达式对象。如下：
```js
    const reg = {
        [Symbol.search]: function(value) {
            return value.length > 10 ? true : false
        }
    }

    const len1 = 'Hello world'
    const len2 = 'Hello'

    console.log(len1.search(reg)) // true
    console.log(len2.search(reg)) // false
```

###### Symbol.split
`Symbol.split` 指向 一个正则表达式的索引处分割字符串的方法。 这个方法通过 `String.prototype.split()` 调用。

我们也可以使用 `Symbol.split` 定义一个正则表达式对象。如下：
```js
    const reg = {
        [Symbol.split]: function(value) {
            return value.length > 10 ? [] : [value]
        }
    }

    const len1 = 'Hello world'
    const len2 = 'Hello'

    console.log(len1.split(reg)) // []
    console.log(len2.split(reg)) // [ Hello ]
```

### 总结
符号（`Symbol`）是 **JS** 新引入的基本类型值，可以使用它创建不可枚举的属性，并且这些属性不使用符号的情况下是无法访问的。

虽然符号类型不可以创建真正的私有属性，但它们很难被修改，当我们创建一个不想被用户修改的方法时，可以去使用符号。

为符号添加描述，可以更加容易判断它的作用。使用全局符号注册，允许我们在不同的代码段使用同一个符号值。

`Object.keys()` 或 `Object.getOwnPropertyNames()` 不会返回符号值，因此 ES6 新增了一个`Object.getOwnPropertySymbols()` 方法，允许检索符号类型的对象属性。而你依然可以使用 `Object.defineProperty()` 与 `Object.defineProperties()` 方法对符号类型的属性进行修改。

“知名符号”使用了全局符号常量（例如 `Symbol.hasInstance` ），为常规对象定义了一些功
能，而这些功能原先仅限内部使用。这些符号按规范使用 `Symbol`. 的前缀，允许开发者通过
多种方式去修改常规对象的行为/*不过一般情况下也用不到这些方法，个人觉得了解一下即可*/。
