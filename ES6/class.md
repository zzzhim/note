# JS的类

### ES5 中的仿类结构
在ES5以及更早版本之前，JS是不存在类的。与类最接近的是：创建一个构造器，然后将方法指派到该构造器的原型上。

如下：
```js
    function PersonType(name) {
        this.name = name
    }

    PersonType.prototype.sayName = function () {
        console.log(this.name)
    }

    var person = new PersonType("zzzhim")
    person.sayName() // zzzhim

    console.log(person instanceof PersonType) // true
    console.log(person instanceof Object)     // true
```

`PersonType` 是一个构造器函数，创建了 `name` 属性。 `sayName()` 方法被我们挂载在原型上，`PersonType` 对象的所有实例都会共享此方法。当我们使用 `new` 运算符创建了 `PersonType` 的新实例 `person` ，此对象会被认为是一个通过原型继承了 `PersonType` 与 `Object` 的实例。

### 基本的类声明
在 **ES6** 中我们可以通过 `class` 声明创建一个基于原型继承的具有指定名称的新类。如下：
```js
    class PersonClass {
        // 等价于 PersonType 构造器
        constructor(name) {
            this.name = name
        }

        // 等价于 PersonType.prototype.sayName
        sayName() {
            console.log(this.name)
        }
    }

    const person = new PersonClass("zzzhim")

    person.sayName() // zzzhim

    console.log(person instanceof PersonClass) // true
    console.log(person instanceof Object)     // true

    console.log(typeof PersonClass) // function
    console.log(typeof PersonClass.prototype.sayName) // function
```

> 自有属性（ **Own properties** ）：该属性出现在实例上而不是原型上，只能在类的构造器或方法内部进行创建。在本例中， `name` 就是一个自有属性。我建议应在构造器函数内创建所有可能出现的自有属性，这样在类中声明变量就会被限制在单一位置（有助于代码检查）。

?> 相对于已有的自定义类型声明方式来说，类声明仅仅是以它为基础的一个语法糖。 `PersonClass` 声明实际上创建了一个拥有 `constructor` 方法及其行为的函数，这也是 `typeof PersonClass` 会得到 `function` 结果的原因。 `sayName()` 方法最终也成为 `PersonClass.prototype` 上的一个方法。

### 为什么要使用类的语法
尽管类与自定义类型之间有相似性，但仍然有一些重要的区别：
1. 类生命不会被提升，而函数定义则相反。类声明的行为与 `let` 相似，因此在程序的执行到达声明处之前，类会存在**暂时性死区**内。
2. 类声明中的所有代码会自动运行在严格模式下，并且也无法退出严格模式。
3. 类的所有方法都是不可枚举的，这是和自定义类型的显著变化，后者必须使用 `Object.defineProperty()` 才能将方法改变为不可枚举。
4. 类的所有方法内部都没有 `[[Construct]]` ，因此使用 `new` 来调用它们会抛出错误。
5. 调用类构造器时不使用 `new` ，会抛出错误。
6. 试图在类的方法内部重写类名，会抛出错误。

上例中的 `PersonClass` 声明实际上就直接等价于以下未使用类语法的代码：
```js
    let PersonClass = (() => {
        "use strict"

        const PersonClass = function(name) {
            // 查看函数是否使用了 new
            if(typeof new.target === "undefined") {
                throw new Error("Constructor must be called with new.")
            }

            this.name = name
        }

        Object.defineProperty(PersonClass.prototype, "sayName", {
            value() {
                // 确保函数调用时 没有使用 new
                if(typeof new.target !== "undefined") {
                    throw new Error("Method cannot be called with new.")
                }

                console.log(this.name)
            },
            // 设置为不可枚举
            enumerable: false,
            writable: true,
            configurable: true
        })

        return PersonClass
    })()

    const person = new PersonClass("zzzhim")

    person.sayName() // zzzhim

    console.log(person instanceof PersonClass) // true
    console.log(person instanceof Object)     // true

    console.log(typeof PersonClass) // function
    console.log(typeof PersonClass.prototype.sayName) // function
```

> 只有在类的内部，类名才被视为是使用 `const` 声明。这意味着我们可以在外部重写类名，但是不能在类的方法内部这么做。例如：
```js
    class Person {
        constructor() {
            Person = "cat" // 执行时抛错
        }
    }
    // 正常运行
    Person = "cat"
```
> 在此代码中，类构造器内部的 `Person` 与 类外部的 `Person` 是不同的绑定。内部的就像是 `const` 声明定义的，而外部的就像是 `let` 声明定义的。

### 类表达式
类与函数相似之处，它们都有两种形式：声明与表达式。函数声明与类声明都以适当的关键字为起始（分别是 `function` 与 `class`），随后是标识符（即函数名或类名）。函数具有一种表达式形式，无须在 `function` 后面使用标识符；类似的，类也有不需要标识符的表达式形式。

### 基本的类表达式
我们可以用类表达式的方式，声明一个 `PersonClass` 。如下：
```js
    let PersonClass = class  {
        // 等价于 PersonType 构造器
        constructor(name) {
            this.name = name
        }

        // 等价于 PersonType.prototype.sayName
        sayName() {
            console.log(this.name)
        }
    }

    const person = new PersonClass("zzzhim")

    person.sayName() // zzzhim

    console.log(person instanceof PersonClass) // true
    console.log(person instanceof Object)     // true

    console.log(typeof PersonClass) // function
    console.log(typeof PersonClass.prototype.sayName) // function
```

> 相对于函数声明与函数表达式之间的区别，类声明与类表达式都不会被提升。

### 具名类表达式
我们可以像函数表达式那样，也可以为类表达式命名。为此需要在 `class` 关键字后添加标识符，就像这样：
```js
    let PersonClass1 = class PersonClass2 {
         // 等价于 PersonType 构造器
        constructor(name) {
            this.name = name
        }

        // 等价于 PersonType.prototype.sayName
        sayName() {
            console.log(this.name)
            console.log("------")
            console.log(typeof PersonClass2) // function
            console.log("------")
        }
    }

    const person = new PersonClass1("zzzhim")

    person.sayName() // zzzhim

    console.log(typeof PersonClass1) // function
    console.log(typeof PersonClass2) // undefined
```

此例中 `PersonClass2` 标识符只在类定义内部存在，因此只能在类方法内部访问到。在类的外部，`typeof PersonClass2` 的结果为 `undefined` 。参考下面代码：
```js
    let PersonClass1 = (() => {
        "use strict"

        const PersonClass2 = function(name) {
            if(typeof new.target === "undefined") {
                throw new Error("Constructor must be called with new.")
            }

            this.name = name
        }

        Object.defineProperty(PersonClass2.prototype, "sayName", {
            value() {
                if(typeof new.target !== "undefined") {
                    throw new Error("Method cannot be called with new.")
                }

                console.log(this.name)
                console.log("------")
                console.log(typeof PersonClass2) // function
                console.log("------")
            },
            enumerable: false,
            writable: true,
            configurable: true
        })

        return PersonClass2
    })()

    const person = new PersonClass1("zzzhim")

    person.sayName() // zzzhim

    console.log(typeof PersonClass1) // function
    console.log(typeof PersonClass2) // undefined
```

### JS 中的一级公民
在编程中，能被当作值来使用的就称为一级公民（**first-class citizen**），意味着它能作为参数传给函数、能作为函数返回值、能用来给变量赋值。JS中的函数就是一级公民（它们有时又被称为一级函数）。在 ES6 中，类（**class**）同样是一级公民。

### 访问器属性
自有属性需要在类构造器中创建，类还允许我们在原型上定义访问器属性。创建 **getter** 和 **setter** ， 只需使用 `get` 和 `set` 关键字。如下：
```js
    class PersonClass {
        constructor() {
            this.name = "person"
        }

        get sayName() {
            return this.name
        }

        set sayName(value) {
            this.name = value
        }
    }

    const person = new PersonClass()

    console.log(person.sayName) // person

    person.sayName = "zzzhim"

    console.log(person.sayName) // zzzhim
```

非类的等价表示，如下：
```js
    let PersonClass = (() => {
        "use strict"

        const PersonClass = function() {
            if(typeof new.target === "undefined") {
                throw new Error("Method cannot be called with new.")
            }

            this.name = "person"
        }

        Object.defineProperty(PersonClass.prototype, "sayName", {
            enumerable: false,
            configurable: true,
            get() {
                return this.name
            },
            set(value) {
                this.name = value
            }
        })

        return PersonClass
    })()

    const person = new PersonClass()

    console.log(person.sayName) // person

    person.sayName = "zzzhim"

    console.log(person.sayName) // zzzhim
```