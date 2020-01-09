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
