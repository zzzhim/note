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