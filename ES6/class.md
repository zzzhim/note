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

### 需计算的成员名
类方法与类访问器属性也都能使用需计算的名称。语法相同与对象字面量中的需计算名称：无须使用标识符，而是用中括号来包裹一个表达式。如下：
```js
    let sayName = "sayName"

    class PersonClass {
        constructor(name) {
            this.name = name
        }

        [sayName]() {
            console.log(this.name)
        }
    }

    let person = new PersonClass("zzzhim")

    person[sayName]() // zzzhim
```

### 生成器方法
想要在类上面定义一个生成器，只需要在方法名称前附加一个星号（`*`）。如下：
```js
    class PersonClass {
        constructor() {
            this.num = 0
        }

        *sayNum() {
            yield ++this.num
            yield ++this.num
            yield ++this.num
        }
    }

    let person = new PersonClass("zzzhim")

    const iterator = person.sayNum()

    console.log(iterator.next()) // {value: 1, done: false}
    console.log(iterator.next()) // {value: 2, done: false}
    console.log(iterator.next()) // {value: 3, done: false}
    console.log(iterator.next()) // {value: undefined, done: true}
```

### 静态成员
直接在构造器上添加额外的方法来模拟静态成员，这在ES5以及更早版本是另一个通用的模式。例如：
```js
    function PersonType(name) {
        this.name = name
    }

    // 静态方法
    PersonType.create = function(name) {
        return new PersonType(name)
    }

    // 实例方法
    PersonType.prototype.sayName = function() {
        console.log(this.name)
    }

    var person = PersonType.create("zzzhim")

    person.sayName() // zzzhim
```

工厂方法 `PersonType.create()` 会被认定为一个静态方法，它的数据不依赖 `PersonType` 的任何实例。 ES6 的类简化了静态成员的创建，只要在方法与访问器属性的名称前添加正式的 `static` 标注。

如下：
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

        // 等价于 PersonType.create
        static create(name) {
            return new PersonClass(name)
        }
    }

    const person = PersonClass.create("zzzhim")

    person.sayName() // zzzhim
```

> 静态成员不能用实例来访问，你始终需要直接用类自身来访问它们。

### 使用派生类进行继承
ES6 之前，实现一个自定义类型的继承是一个很繁琐的过程。而 ES6 为我们提供了 `extends` 关键字，大大的简化了这个过程。

如下：
```js
    class Father {
        constructor(name) {
            this.name = name
        }

        sayName() {
            console.log(this.name)
        }
    }

    class Child extends Father {
        constructor(props) {
            super(props)
        }
    }

    const child = new Child("zzzhim")

    child.sayName() // zzzhim
```

继承了其他类的类被称为派生类（ **derived classes** ）。如果派生类指定了构造器，就需要
使用 `super()` ，否则会造成错误。若你选择不使用构造器， `super()` 方法会被自动调用，
并会使用创建新实例时提供的所有参数。

> 使用 `super()` 时需要牢记以下几点：
> 1. 你只能在派生类中使用 `super()` 。若尝试在非派生类（即：没有使用 `extends` 关键字的类）或函数中使用它，就会抛出错误。
> 2. 在构造器中，你必须在访问 `this` 之前调用 `super()` 。 由于 `super()` 负责初始化 `this` ， 因此试图先访问 `this` 自然就会造成错误。
> 3. 唯一能避免调用 `super()` 的办法，是从类构造器中返回一个对象。

### 屏蔽类方法
派生类中的方法总是会屏蔽基类的同名方法。如下：
```js
    class Father {
        constructor(name) {
            this.name = name
        }

        sayName() {
            console.log(this.name)
        }
    }

    class Child extends Father {
        constructor(props) {
            super(props)
        }

        sayName() {
            console.log("ES6")
        }
    }

    const child = new Child("zzzhim")

    child.sayName() // ES6
```

### 继承静态成员
如果基类包含静态成员，那么这些静态成员在派生类中也是可用的。如下：
```js
    class Father {
        constructor(name) {
            this.name = name
        }

        static sayName() {
            console.log("zzzhim")
        }
    }

    class Child extends Father {
        constructor(props) {
            super(props)
        }
    }

    Child.sayName() // zzzhim
```

### 从表达式中派生类
在 ES6 中派生类的最强大能力，或许就是能够从表达式中派生类。只要一个表达式能够返回一个具有 `[[Construct]]` 属性以及原型的函数，你就可以对其使用 `extends`。如下：
```js
    function Father(name) {
        this.name = name
    }

    Father.prototype.sayName = function() {
        console.log(this.name)
    }

    class Child extends Father {
        constructor(props) {
            super(props)
        }
    }

    const child = new Child("zzzhim")

    child.sayName() // zzzhim
```

在上例中 `Father` 是一个 ES5 风格的构造器，而 `Child` 是一个类。但是因为 `Father` 具有 `[[Construct]]` 以及原型，所以 `Child` 可以直接继承它。

`extends` 后面能够接受任意类型的表达式。例如动态地决定所要继承的类。如下：
```js
    function Father(name) {
        this.name = name
    }

    Father.prototype.sayName = function() {
        console.log(this.name)
    }

    function getClass() {
        return Father
    }

    class Child extends getClass() {
        constructor(props) {
            super(props)
        }
    }

    const child = new Child("zzzhim")

    child.sayName() // zzzhim
```

> 任意表达式都能在 `extends` 关键字后使用，但并非所有表达式的结果都是一个有效的类。特别的，下列表达式类型会导致错误：
> + null
> + 生成器函数
> 试图使用结果为上述值的表达式来创建一个新的类实例，都会抛出错误，因为不存在 `[[Construct]]` 可供调用。

### 继承内置对象
在 **ES6** 基于类的继承中， `this` 的值先被基类创建，随后才被派生类的构造器所修改。结果是 `this` 初始就拥有作为基类的内置对象的所有功能，并能正确接收与之关联的所有功能。

如下：
```js
    class MyArray extends Array {
        // no thing
    }

    const colors = new MyArray()

    colors[0] = "red"

    console.log(colors.length) // 1

    colors.push("green")

    console.log(colors.length) // 2

    colors.length = 0

    console.log(colors[0]) // undefined
    console.log(colors[1]) // undefined
```

从上面代码可以看出，`MyArray` 直接继承了 `Array` ，因此工作方式与正规数组相同。

### Symbol.species 属性
继承内置对象一个有趣的方面是：任意能返回内置对象实例的方法，在派生类上却会自动返回派生类的实例。因此，若你拥有一个继承了 `Array` 的派生类 `MyArray` ，诸如 `slice()` 之类的方法都会返回 `MyArray` 的实例。如下：
```js
    class MyArray extends Array {
        // 空代码块
    }

    let items = new MyArray(1, 2, 3, 4)

    let subitems = items.slice(1, 3)

    console.log(items instanceof MyArray)    // true
    console.log(subitems instanceof MyArray) // true
```

在此代码中， `slice()` 方法返回了 `MyArray` 的一个实例。 `slice()` 方法是从 `Array` 上继承的，原本应当返回 `Array` 的一个实例。

造成这种变化的原因是因为 `Array` 类型拥有默认的 `Symbol.species` 属性，它们的返回值为 `this`，意味着该属性总是会返回自身的构造器函数。

> 下列内置类型都定义了 Symbol.species ：
> + `Array`
> + `ArrayBuffer`
> + `Map`
> + `Promise`
> + `Array`
> + `Set`
> + `类型化数组`

当然了，假如我们想要在 `MyArray` 上返回 `Array` 对象。我们可以这样做：
```js
    class MyArray extends Array {
        static get [Symbol.species]() {
            return Array
        }
    }

    let items = new MyArray(1, 2, 3, 4)

    let subitems = items.slice(1, 3)

    console.log(items instanceof MyArray)    // true
    console.log(subitems instanceof MyArray) // false
```

> `Symbol.species` 知名符号被用于定义 `MyArray` 的一个静态访问器属性。注意此处只有 `getter` 而没有 `setter` ，这是因为修改类的 `species` 是不允许的。

### 在类构造器中使用 new.target
我们可以在类构造器中使用 `new.target` ，来判断类是被如何调用的。

在一般情况下， `new.target` 就等于本类的构造器函数。如下：
```js
    class Cat {
        constructor(color) {
            console.log(new.target === Cat)
            console.log(color + " cat")
        }
    }

    const cat = new Cat("white")
    // 输出
    // true
    // white cat
```

上面代码说明当 `new Cat("white")` 被调用时， `new.target` 等于 `Cat`。因为类构造器被调用时不能缺少 `new` ， 所以 `new.target` 属性就始终会在类构造器内被定义。不过在有些情况下，这个值并不总是相同的。

如下：
```js
    class Cat {
        constructor(color) {
            console.log(new.target === Cat)
            console.log(color + " cat")
        }
    }

    class WhiteCat extends Cat {
        constructor(color) {
            super(color)
        }
    }

    const whiteCat = new WhiteCat("white")


    // 输出
    // false
    // white cat
```

`WhiteCat` 调用了 `Cat` 的构造器，因此 `Cat` 构造器被调用时， `new.target` 实际上是等于 `WhiteCat` 的。这是很重要的，因为构造器会根据是否被调用而有不同的行为，可能会因此造成一些不必要的问题。当然我们也可以创建一种只能被继承无法被实例化的抽象基类。

如下：
```js
    // 无法被实例化的抽象基类
    class Cat {
        constructor(color) {
            if (new.target === Cat) {
                throw new Error("This class cannot be instantiated directly")
            }

            console.log(color + " cat")
        }
    }

    class WhiteCat extends Cat {
        constructor(color) {
            super(color)
        }
    }

    const cat = new Cat("white") // 抛出错误

    const whiteCat = new WhiteCat("white") // 没有错误，输出 white cat

    console.log(whiteCat instanceof WhiteCat); // true
```

> 由于调用类时不能缺少 `new` ，于是 `new.target` 属性在类构造器内部就绝不会是 `undefined` 。
