# 为函数和函数参数定义类型

### 函数类型
（1）为函数定义类型
之前我们在学习接口的时候提到过用接口描述函数类型，而我们为函数定义类型时，其实也与之相差不多。如下：
```ts
    // 使用接口描述函数类型
    interface Fun {
        (num1: number, num2: number): number
    }

    let fun: Fun = (num1, num2) => num1 + num2

    fun(1, 2)
    
    // 为函数声明定义类型
    function add(num1: number, num2: number): number {
        return num1 + num2
    }

    add(1, 2)

    // 为函数表达式定义类型
    const less = (num1: number, num2: number): number {
        return num2 - num1
    }

    less(1, 2)
```

通过上面的例子我们可以看到在 **TS** 中是如何为 **函数声明** 和 **函数表达式** 两种方式定义类型的。

> 需要注意的是如果我们省略函数参数的类型，那么在 **TS** 中或默认这个参数是 **any** 类型。如果省略函数的返回值的类型，则这个函数无返回值，如果有返回值，那么 **TS** 则会根据我们定义的逻辑推断返回值的类型是否正确。

（2）使用类型别名
我们还可以使用 **类型别名** 的方式来定义函数类型。如下：
```ts
    type Fun = (num: number, str: string) => void

    const fun: Fun = (num, str) => {
        console.log(num, str)
    }

    fun(1, "2") // 1 "2"
```

> 使用 `type` 关键字我们可以为原始值、联合类型、元组以及任何我们定义的类型起一个别名。

### 参数
（1）可选参数
有时候我们为函数传参的时候可能有些参数是必须的，而有些参数是可选的，例如下面这个例子。
```js
    function fun(type, cb) {
        if(!type && typeof cb === "function") {
            cb()
        }else {
            return true
        }
    }

    fun(true)

    fun(false, () => console.log("callback"))
```

我们定义了函数 `fun` ，它有两个参数，一个为 `type`, 一个为 `cb`，当 `type` 为真的时候我们 **retrun `true`** ，当 `type` 为假并且 `cb` 为函数时则调用 `cb`。

从上面的例子中我们可以明显看出 `cb` 是一个可选的参数，那么如何在 **TS** 中定义一个可选参数呢？可以使用下面这种方式：
```ts
    // 定义可选参数只需在参数名后面跟随一个 ? 即可
    const fun = (type: boolean, cb?: any):boolean | void => {
        if(!type && typeof cb === "function") {
            cb()
        }else {
            return true
        }
    }

    fun(true)
    fun(false, () => console.log("callback")) // callback
```

通过上面的例子我们可以看出，想要定义一个可选参数非常简单，我们只需在参数名后面跟随一个 **问号** 就可以了。

不过有一点非常重要，那就是 **可选参数** 是不能放在 **必选参数** 前面的，只能放在其后面。
```ts
    // 抛出错误
    // A required parameter cannot follow an optional parameter.
    type Fun = (cb?: any, type: boolean) => boolean | void

    // 正确的写法应该是这样
    type Fun = (type: boolean, cb?: any) => boolean | void
```

（2）参数默认值
在 **TS** 中想要给函数参数定义默认值非常简单，直接在参数后面使用等号连接默认值就可以了。如下：
```ts
    const fun = (num: number = 1, str = "1") => {
        console.log(num, str)
    }

    fun() // 1 "1"
```

!> 需要注意的是如果我们给参数显示的指定了类型，那么默认值的类型就必须是我们显示指定的类型。

（3）剩余参数
在 **JS** 中一个函数是可以输入任意个数的参数的，在 **ES6** 之前我们会使用到 `arguments` 来获取到参数列表。在 **TS** 中我们则可以使用 **ES** 新加入的 `"..."` **拓展运算符** 来处理任意数量的参数。如下：
```ts
    function fun(...arr: number[]): void {
        arr.forEach(item => console.log(item))
    }

    fun(1, 2, 3, 4, 5, 6)
    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
```

如果对 **拓展运算符** 不够了解的可以看一下 **阮一峰** 老师的 [ES6入门教程](http://es6.ruanyifeng.com/#docs/array) 和 [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read)，也可以看一下我之前写的 [ES6笔记](http://www.lovewyf.xyz:8080/#/ES6/fun)。

### TS中的函数重载
在 **JS** 中是不存在 **函数重载** 这个概念的，这是因为 **JS** 是一门动态类型语言，它的变量类型只有在运行时才能确定。

在 **TS** 中是存在函数重载的概念的，当然它不是像一些强类型语言一样定义几个同名函数，然后通过不同的参数个数或者参数类型来加载对应的函数。 **TS** 中的类型重载是通过为一个函数指定多个函数类型，并且对函数的返回值进行类型检查来进行的。如下：
```ts
    function fun(params: number): number // 重载的一部分
    function fun(params: string): string // 重载的一部分
    function fun(params: any): any { // 重载内容
        if (typeof params === "number") {
            return params
        } else if(typeof params === "string"){
            return params        
        }
    }

    console.log(fun(1)) // 1
    console.log(fun("2")) // "2"
    fun() // 报错如下
    // Overload 1 of 2, '(params: number): number', gave the following error.
    // Argument of type 'never[]' is not assignable to parameter of type 'number'.
    // Overload 2 of 2, '(params: string): string', gave the following error.
    // Argument of type 'never[]' is not assignable to parameter of type 'string'
```

首先我们使用 `function` 关键字定义了两个同名函数，但是这两个函数是没有实际的运行逻辑的，只定义了函数名、参数、参数类型、函数的返回值类型；而第三个同名函数则是一个完整的实体函数，包含函数名、参数、参数类型、函数的返回值类型和函数体；这三个定义组成了一个函数——完整的带有类型定义的函数，前两个 `function` 定义的就称为函数重载，第三个并不算是重载。

当我们调用上面的方法并且传入参数时，会从上往下在函数重载里匹配和这个参数个数和类型匹配的重载；如果没有匹配到对应的重载，则会抛出异常。

> 重载只能使用 `function` 来定义，不能使用接口或者类型别名等。