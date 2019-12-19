# 八个JS中的常见类型
在**TS**中指定类型的语法是使用“变量:类型”的形式,如下:
```ts
    let num: number = 1
```

如果我们没有为变量指定特定的类型,编辑器会根据你赋值给这个变量的值来推断这个变量的类型:
```ts
    let num = 1
    num = '1' // 不能将类型 '1' 分配给变量 number
```

### 布尔类型
类型为布尔类型的变量的值只能是 `true` 或 `false`,如下:
```ts
    let bool: boolean = false
    bool = true
    bool = 1 // 报错
```

虽然不能直接把 `number` 赋值给 `bool` ,但是我们可以把计算之后结果是布尔值的表达式赋给 `bool`
```ts
    let bool: boolean = !!1
    console.log(bool)
```

### 数值类型
在 `TypeScript` 和 `JavaScript` 中,所有数字都是浮点数，所以只有一个 `number` 类型
```ts
    let num: number = 1
    num = 123
```

!> TypeScript中还支持二、八、十、和十六四种进制的数值。

### 字符串
和Js一样字符串类型我们可以使用单引号或者双引号包裹内容,在ES6中我们还可以使用模板字符串
```ts
    let str: string = '1'
    str = `123`
    str = "321"
```

我们也可以把字符串字面量作为一种类型,当我们把一个变量指定为这个字符串类型的时候,就不能再赋值为其他值了,就像声明了一个常量一样,如下:
```ts
    let str: '1'
    str = '2' // 不能将类型“"2"”分配给类型“"1"”
```
在 `number` 中也是如此:
```ts
    let num: 1
    num = 2 // 不能将类型“2”分配给类型“1”
```

### 数组
在 `TypeScript` 中定义数组有两种方式
```ts
    let arr1: number[] = [ 1, 2, 3, 4, 5, 6 ]
    let arr2: array<number> = [ 1, 2, 3, 4, 5, 6 ]
```
第一种方式通过 `number[]` 来指定一个类型元素均为 `number` 的数组,当然我们也可以通过第二种方式,来指定一个类型元素均为 `number` 的数组

### null和undefined
在 `JavaScript` 中, `null` 和 `undefined` 是两个基本数据类型. 在 `TypeScript` 中两个都是各自的类型，也就是说它们两个既是实际的值，同时也是类型
```ts
    let u: undefined = undefined
    let n: null = null
```

当我们在 tsconfig.json 里设置了 `strictNullChecks` 为 `false` 时，我们可以把 `null` 和 `undefined` 赋值给任意类型的值，也就是说我们可以把他们赋值给 `number` 类型,或者 `string` 类型.但是当我们把 `strictNullChecks` 设为 `true` 时,我们就只能把它们赋值给它们本身了

### object
`object` 在 **JS** 中时引用类型,它和 **JS** 中的其他基本类型是不一样的,在 **JS** 中基本类型的变量存储的是它们的值,而引用类型的变量存储的则是它们的引用

当我们希望一个变量或者函数的参数类型是一个对象的时候,使用这个类型,比如:
```ts
    let obj: object
    obj = { name: "zzzhim" }
```
虽然上面我们给 `obj` 指定了 `object` 类型,并且给它赋值了一个对象,但是这并不意味着我们就可以操作对象上的属性了,当我们去操作的时候其实会抛出属性不存在的错误,如下:
```ts
    let obj: object
    obj = { name: 'zzzhim' }
    console.log(obj.name) // error 类型“object”上不存在属性“name”
```

如果我们想要达到操作对象上自定义的属性这种需求,我们需要使用到接口这种方式,这个后面会提到.
```ts
    interface obj {
        name: string
    }

    let obj: obj = {
        name: 'zzzhim'
    }

    console.log(obj.name)
```

既然我们不能直接这样使用,那么它的应用场景在哪里呢?我们可以在当我们需要一个值是对象的时候使用它,比如我们定义一个函数,参数必须是对象,这个时候我们就可以使用它了,如下:
```ts
    function fun(obj: object) {
        if('name' in obj) {
            console.log(obj.name)
        }
    }

    fun({ name: 'zzzhim' })
```

### symbol
`Symbol` 是 ES6 加入的基础数据类型,它的特性比较多,后面会单独介绍