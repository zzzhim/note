# 扩展的对象功能
ES6注重于提高对象的效用，这是因为在JS中几乎所有的值都是某种类型的对象。

### 对象类别
JS使用混合术语来描述能在标准中找到的对象，而不是那些有运行环境（例如浏览器或Node.js）所添加的，并且ES6规范还明确定义了对象的每种类别。

对象类别包括：
- 普通对象：拥有**JS**对象所有默认的内部行为。
- 奇异对象：其内部行为在某些方面有别于默认行为。
- 标准对象：在**ES6**中被定义的对象，例如 `Array`、`Date`等等。标准对象可以是普通的，也可以是奇异的。
- 内置对象：在脚本开始运行时由**JS**运行环境提供的对象。所有的标准对象都是内置对象。

### 对象字面量语法的扩展
对象字面量（object literal）。对象字面量是由一对花括号，并且包含“键/值对”的简单集合。如下：
```js
    const person = {
        name: 'zzzhim',
        age: 22,
        sex: '男'
    }
```

?> 对象字面量是**JS**中最流行的模式之一（**JSON**就是基于这种语法），而它还存在与互联网上的几乎所以**JS**文件中。

### 属性初始化器的速记法
对象字面量是“键/值对”的简单集合。这意味着在属性值被初始化时可能会有些重复。如下：
```js
    function createObject(name, age, sex) {
        return {
            name: name,
            age: age,
            sex: sex
        }
    }
```

`createObject()` 函数创建了一个对象，它的属性名和参数名相同。这个结果实际上有些重复，尽管一边是`键`，一边是`值`。

在**ES6**中，给我们提供了一种跟便捷的方式来书写。如下：
```js
    function createObject(name, age, sex) {
        return {
            name,
            age,
            sex
        }
    }
```

上面的代码中我们可以使用属性初始化器的速记法来消除对象名称与本地变量重复的情况，当对象的中的属性和名称重复的时候，我们可以省略掉值和冒号。

?> 这是因为当对象的字面量只有名称的时候，**JS**引擎会在当前作用域和它的周边作用域查找同名变量，如果找到同名变量，就会把它的值赋值给该对象的同名属性。

### 方法简写
**ES6**同样改进了为对象字面量方法赋值的语法。在**ES5**以及更早版本中，你必须指定一个名称并用完整的函数定义来为对象添加方法。如下：
```js
    const person = {
        name: 'zzzhim',
        sayName: function() {
            console.log(this.name)
        }
    }
```

在**ES6**中我们可以通过省略 /*冒号和 function*/ 关键字来使这个语法变得更加简洁。
```js
    const person = {
        name: 'zzzhim',
        sayName() {
            console.log(this.name)
        }
    }
```

这种速记语法也被称为方法简写语法（**concise method syntax**）。

?> 这种方法与上面的唯一区别是：方法简写能够使用 `super`,而非简写方法则不能。（`super`会在后面介绍使用）。

### 需计算属性名
在**ES6**中，需计算属性名是对象字面量语法的一部分，它用的是方括号表示法。如下：
```js
    const lastName = "last name"
    const person = {
        "first name": "zzz",
        [lastName]: "him"
    }

    console.log(person["first name"]) // zzz
    console.log(person[lastName])     // him
```

我们也可以在方括号中使用表达式。如下：
```js
    const lastName = "last"
    const person = {
        "first name": "zzz",
        [lastName + " name"]: "him"
    }

    console.log(person["first name"]) // zzz
    console.log(person["last name"])     // him
```

?> 使用方括号表达法，任何能放在对象实例方括号内的东西，都可以作为需计算属性名用在对象字面量中。

### 新的方法
ES6 在 `Object` 对象上引入了两个新方法，`Object.is()` 和 `Object.assign()` 方法。

###### **Object.is()** 方法
当在**JS**中比较两个值时，我们经常会使用相等运算符（`==`）或严格相等运算符（`===`）。

当我们使用**相等运算符**的时候，**相等运算符**会比较两个值是否相等，在比较前会将被比较的值进行隐式转换，转换为相同的类型。
```js
    const num = 0
    const str = "0"

    console.log(num == num) // true
    console.log(num == str) // true
    console.log(str == str) // true
    console.log(num == false) // true
    console.log(num == null) // false
    console.log(str == null) // false
    console.log(num == undefined) // false
    console.log(str == undefined) // false
    console.log(null == undefined) // true
```

当我们使用**严格相等运算符**的时候。**严格相等运算符**比较两个值是否相等，类型是否相等。当值和类型都相等的时候结果为 `true`。在两个被比较的值在比较前是不会进行隐式转换的。
```js
    const num = 0;
    const obj = new String("0");
    const str = "0";
    const b = false;

    console.log(num === num); // true
    console.log(obj === obj); // true
    console.log(str === str); // true

    console.log(num === obj); // false
    console.log(num === str); // false
    console.log(obj === str); // false
    console.log(null === undefined); // false
    console.log(obj === null); // false
    console.log(obj === undefined); // false
```

但严格相等运算符也并不完全准确，例如，它会认为 `+0` 和 `-0` 相等，即使这两者在 JS 引擎中有不同的表示；另外 `NaN` === `NaN` 会返回 `false` ，因此有必要使用 `isNaN()` 函数来正确检测 `NaN` 。

**ES6** 引入了 `Object.is()` 方法来弥补**严格相等运算符**残留的怪异点。此方法接受两个参数，并且会在二者的值相等时返回 `true`。
```js
    console.log(+0 == -0)            // true
    console.log(+0 === -0)           // true
    console.log(Object.is(+0, -0))   // false

    console.log(NaN == NaN)          // false
    console.log(NaN === NaN)         // false
    console.log(Object.is(NaN, NaN)) // true
```

?> 在许多情况下 `Object.is()` 的结果与**严格相等运算符**是相同的，仅有的例外是： 它会认为  `+0` 和 `-0` 不相等，而且 `NaN` 等于 `NaN`。

###### Object.assign() 方法
Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

**Object.assign()** 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。
```js
    const target = {
        a: 1,
        b: 2
    }

    const source = {
        b: 3,
        c: 4
    }

    const copy = Object.assign(target, source)
    console.log(copy)
```

需要注意的是 `Object.assign()` 进行的是浅拷贝，拷贝的是属性值。假如源对象的值是一个对象的引用，那么它也只指向那个引用。如下：
```js
    const target = {
        a: 1,
        b: 2
    }

    const source = {
        b: 3,
        c: {
            a: 1
        }
    }

    const copy = Object.assign(target, source)
    console.log(copy)   // { a: 1, b: 3, c: { a: 1 } }

    source.c.a = 2

    console.log(source) // { a: 1, b: 3, c: { a: 2 } }
    console.log(copy)   // { a: 1, b: 3, c: { a: 2 } }
```

?> 如果我们需要进行深拷贝可以使用 `JSON` 进行深拷贝，这也是目前很常见的一种深拷贝方式。


### 修改对象的原型
一般来说，对象的原型会在通过构造器或者 `Object.create()` 方法创建该对象时被指定。**ES6** 通过添加了 `Object.setPrototypeOf()` 方法，允许我们修改任意对象的原型。

`Object.setPrototypeOf()` 接受两个参数：第一个参数是要设置原型的对象，第二个参数是该对象的新原型（`Object` 或者 `null`）。
```js
    const person = {
        getGreeting() {
            return "Hello"
        }
    }

    const dog = {
        getGreeting() {
            return "Woof"
        }
    }

    const friend = Object.create(person)

    console.log(friend.getGreeting()) // Hello
    console.log(Object.getPrototypeOf(friend) === person) // true

    Object.setPrototypeOf(friend, dog)

    console.log(friend.getGreeting()) // Woof
    console.log(Object.getPrototypeOf(friend) === person) // false
    console.log(Object.getPrototypeOf(friend) === dog) // true
```

通过上面的例子我们可以看到，通过 `Object.getPrototypeOf()` 我们可以把一个对象的原型指向另外一个对象。

?> 对象原型的实际值被存储在一个内部属性 `[[Prototype]]` 上， `Object.getPrototypeOf()` 方法会返回此属性存储的值，而 `Object.setPrototypeOf()` 方法则能够修改该值。不过，使用`[[Prototype]]` 属性的方式还不止这些。

### 使用 super 引用的简单原型访问
**super** 关键字用于访问和调用一个对象的父对象上的函数。**super**是指向当前对象的原型的一个指针，实际上就是 `Object.getPrototypeOf()` 的值。
```js
    const obj1 = {
        method() {
            console.log("obj1")
        }
    }

    const obj2 = {
        method() {
            Object.getPrototypeOf(this).method()
        }
    }

    Object.setPrototypeOf(obj2, obj1)
    obj2.method() // obj1

    const obj3 = {
        method() {
            console.log("obj3")
        }
    }

    Object.setPrototypeOf(obj2, obj3)
    obj2.method() // obj3
```

### 正式的方法定义
在**ES6**之前，“方法”的概念从未被正式定义，它此前仅指对象的函数属性（而非数据属性）。ES6则正式做出了定义：方法是一个拥有`[[HomeObject]]`内部属性的函数，此内部属性指向该方法所属的对象。
```js
    const person = {
        // 方法
        getGreeting() {
            return "Hello"
        }
    }

    // 并非方法
    function shareGreeting() {
        return "Hi!"
    }
```

此例定义了拥有单个 `getGreeting()` 方法的 `person` 对象。由于 `getGreeting()` 被直接赋给了一个对象，它的 `[[HomeObject]]` 属性值就是 `person` 。 而另一方面， `shareGreeting()`函数没有被指定 `[[HomeObject]]` 属性，因为它在被创建时并没有赋给一个对象。大多数情况下，这种差异并不重要，然而使用 `super` 引用时就完全不同了。

任何对 `super` 的引用都会使用 `[[HomeObject]]` 属性来判断要做什么。第一步是在`[[HomeObject]]` 上调用 `Object.getPrototypeOf()` 来获取对原型的引用；接下来，在该原型上查找同名函数；最后，创建 `this` 绑定并调用该方法。

### 总结
对象是 `JS` 编程的中心， `ES6` 对它进行了一些有益改进，让它更易用并且更加强大。

`ES6` 为对象字面量做了几个改进。速记法属性定义能够更轻易地将作用域内的变量赋值给对象的同名属性；**需计算属性名**允许你将非字面量的值指定为属性的名称，就像此前在其他场合的用法那样；方法简写让你在对象字面量中定义方法时能省略冒号和 `function` 关键字，从而减少输入的字符数； `ES6` 还舍弃了对象字面量中重复属性名的检查，意味着你可以在一个对象字面量中书写两个同名属性，而不会抛出错误。

`Object.assign()` 方法使得一次性更改单个对象的多个属性变得更加容易，这在你使用混入模
式时非常有用。 `Object.is()` 方法对任何值都会执行严格相等比较，当在处理特殊的 `JS` 值
时，它有效成为了 `===` 的一个更安全的替代品。

对象自有属性的枚举顺序在 `ES6` 中被明确定义了。在枚举属性时，数字类型的键总是会首先出现，并按升序排列，此后是字符串类型的键，最后是符号类型的键，后两者都分别按添加顺序排列。

感谢 `ES6` 的 `Object.setPrototypeOf()` 方法，现在能够在对象已被创建之后更改它的原型了。

最后，你能用 `super` 关键字来调用对象原型上的方法，所调用的方法会被设置好其内部的`this` 绑定，以自动使用该 `this` 值来进行工作。
