# TS中补充的六个类型
### 元组
元组可以看做是数组的扩展,它表示已知元素数量和类型的数组.如下:
```ts
    let tuple: [ string, number, boolean ]
    tuple = [ "", 0, false ]
    tuple = [ false, "", 0 ] // 不能将类型“false”分配给类型“string”
```

通过上面的例子可以看出,当我们为**元组**赋值时:各个位置上的元素类型都要对应,元素个数也都要一致.

### 枚举
TypeScript 在 ES 原有的类型上添加了 `enum` 类型,使我们在 TypeScript 中也可以给一组数值赋予名字.如下:
```ts
    enum Role {
        admin,
        user
    }

    console.log(Role) // { 0: "admin", 1: "user", admin: 0, user: 1 }
```

通过上面的打印结果可以看出,TypeScript会为它们每个值分配编号,默认从0开始,依次排列.

当我们想要使用枚举值的时候就可以通过名称或者编号来使用它们了.如下:
```ts
    console.log(Role.admin) // 0
```

当然我们也可以修改它的默认编号,比如让它从10开始,依次排列.如下:
```ts
    enum Animal {
        cat = 10,
        dog,
        parrot
    }

    console.log(Animal) // { 10: "cat", 11: "dog", 12: "parrot", cat: 10, dog: 11, parrot: 12 }
```

我们还可以这样做:
```ts
    enum Animal {
        cat = 10,
        dog = 18,
        parrot,
        tiger,
        panda = 20,
        crestedIbis
    }

    /**
        {
            10: "cat",
            18: "dog",
            19: "parrot",
            20: "panda",
            21: "crestedIbis",
            cat: 10,
            dog: 18,
            parrot: 19,
            tiger: 20,
            panda: 20,
            crestedIbis: 21
        }
    */
    console.log(Animal)
```

### any
在JS中我们可能会碰到无法确定一个值到底是什么类型这种情况,这时我们就可以用到 any 类型了, any类型也称作任意类型.如下:
```ts
    let value: any
    value = 1
    value = ""
    value = false
    value = {}
```

可以从上面例子看出,当我们给变量 `value` 指定类型为 `any` 时,我们给它赋值任意值都是可以的.

!> 需要注意的是,虽然我们可以为变量指定类型为 `any`, 但是最好不要滥用它, 不然我们就失去了使用 **TypeScript** 的意义了.

> 如果类型是未知的, 最好的办法是使用 `unknown`, 而不是使用 `any`.

### void
void 表示的是没有任意类型,也就是什么类型也不是,一般我们在函数没有返回值时会经常用到.如下:
```ts
    const fun = (): void => {
        console.log('void')
    } 
```

!> void 类型的变量只能赋值为 `undefined` 和 `null`, 其他类型是不能赋值给 void 类型的变量的.

### never
`never` 类型指那些永不存在的值的类型, 它是那些总会抛出异常或根本不会有返回值的函数表达式的返回值类型,当变量被永不为真的类型保护所约束时,该变量也是 `never` 类型.如下:
```ts
    const err = (message: string): never => {
        throw new Error(message)
    }
```

上面的函数只会抛出异常,所以它的返回值类型是 never, 用来表明它的返回值是永远不存在的.

`never` 类型是任何类型的子类型, 所以它可以赋值给任何类型; 而没有类型是 `never` 的子类型, 所以除了它自身没有任何类型可以赋值给 `never` 类型, `any` 也不可以赋值给 `never`.

> `void` 与 `never` 是有区别的, void 在函数中是我们没有给它返回值, 而 `never` 则是根本不会有返回值存在.

### unknown
`unknown` 类型是 **TypeScript** 在3.0版本新增的类型, 它表示未知类型. 

虽然 `unknown` 和 `any` 很像, 但是它们还是有区别的, `unknown` 相对于 `any` 是安全的. 为什么说 `unknown` 相对于 `any` 是安全呢, 这是因为当我们为一个变量指定类型为 `any` 时, 也就意味着我们可以对它进行任意的属性方法访问, 不管它存不存在这个属性方法.如下:
```ts
    let value: any = {}

    console.log(value.name)
    console.log(value.toFixed())
```

同过上面的例子可以看出我们的三个操作都不会报错, 三个操作都会有合法的情况出现, 但是这就出现了问题当 `value` 的类型是对象时, 它的第一个操作不会出现问题, 但是第二个操作则会出现问题.

当我们为变量指定类型为 `unknown` 的时候, 如果没有通过基于控制流的类型断言来缩小范围的话, 我们是不能对它进行任何操作的.如下:
```ts
    let value: unknown

    if(typeof value === "number") {
        console.log(value.toFixed())
    }

    if(typeof value === "string") {
        console.log(value.length)
    }
```