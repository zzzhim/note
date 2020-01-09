# 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

### 简单使用
我们可以来实现一个函数 `createArray` ，它可以创建一个数组，同时把它的值填充为同一个默认值。如下：
```ts
    function createArray(length: number, value: any) {
        return new Array(length).fill(value)
    }

    console.log(createArray(3, "1")) // ["1", "1", "1"]
```

虽然说上面的例子并没有报错，但是它并没有准确的返回数组内部值的类型，反而把数组的每一项值都定义为了 `any` ，这并不是我们想要的结果，我们的预期结果应该是该数组的类型正好是我们所输入的 `value` 类型，也就是每一项都为 `string`。这个时候，我们就可以用上前面提到的 **泛型** 了。如下：
```ts
    function createArray<T>(length: number, value: T): T[] {
        return new Array(length).fill(value)
    }

    const arr = createArray(3, "1")

    arr[0].substring(0, 1)
    arr[0].toFixed() // 报错 Property 'toFixed' does not exist on type 'string'. Did you mean 'fixed'?
```

我们在函数后面添加了 `<T>` , 其中 `T` 用来指定代输入的类型（`T` 不是固定的，可以换成任何字母如：`K`、`L` 等等。），在我们想要指定的参数类型后面使用，就能指定为代输入的类型，然后再把输出的结果定义为 `T[]` ，即可达到我们想要的结果。从我们调用的结果可以看出数组中的类型已经被指定为我们输入的 `string` 类型。

### 泛型约束
当我们使用泛型时，就意味着这个类型可能是任意一种类型，也就是说我们不能对它进行任意的操作，比如在传入类型为 `number` 的情况下调用 `length` 方法。不过我们可以对泛型进行一定的约束，比如传入的类型中必须拥有 `length` 方法。想要实现这种功能也很简单，如下：
```ts
    interface length {
        length: number
    }

    function createArray<T extends length>(length: number, value: T): T[] {
        return new Array(length).fill(value)
    }

    createArray(3, "1")
    createArray(3, 1) // 报错 Argument of type '1' is not assignable to parameter of type 'length'
```

从上面的例子可以看出，**泛型约束**就是使用一个类型和 `extends` 对泛型进行约束。从而使我们传入的参数必须满足我们约束的条件，比如上面的例子就是我们传入的参数必须有一个 `length` 属性。

### 泛型参数的默认类型
在 **TS** 2.3版本以后，可以给泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
```ts
    function createArray<T = string>(length: number, value: T): T[] {
        return new Array(length).fill(value)
    }
```

### 泛型的一些写法
（1）函数
```ts
    // 函数声明
    function createArray<T = string>(length: number, value: T): T[] {
        return new Array(length).fill(value)
    }

    // 函数表达式
    const fun: <T>(params: T) => T = (params) => {
        return params
    }

    // 类型别名
    type Fun = <T>(params: T) => T
    const fun1: Fun = (params) => {
        return params
    }
```
（2）接口
```ts
    interface Fun {
        <T>(params: T): T[]
    }

    const fun: Fun = params => [ params ]
```
（3）类

```ts
    class Fun<T> {
        length: number;
        createArray: ((length: number,value: T) => T[]);
    }

    const fun = new Fun<number>()
    fun.length = 0
    fun.createArray = (length, value) => {
        return new Array(length).fill(value)
    }
```