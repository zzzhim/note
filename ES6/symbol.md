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