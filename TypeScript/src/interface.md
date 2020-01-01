# 接口
在 **TypeScript** 中，我们使用接口（**Interfaces**）来定义对象的类型。我们可以把接口理解成一种描述对象或者函数的东西。

下面有一个例子：
```ts
    interface Person {
        name: string
        age: number
    }

    let zzzhim: Person = {
        name: "zzzhim",
        age: 23
    }

    console.log(zzzhim)
```

我们定义了一个接口 `Person` 和一个变量 `zzzhim`，并且把该变量的类型指定为 `Person` ，这个时候该变量的形状就必须要与 `Person` 保持一致，多一个或者少一个都是不行的。也就是说赋值的时候变量的形状必须和接口的形状保持一致。

### 可选属性
当我们定义一个变量时，有些时候可能不一定非要和接口完全匹配，只要匹配一部分就可以了，这个时候我们可以使用**可选属性**只要在属性名后面加一个 `?` 就可以了。如下：
```ts
    interface Person {
        name: string
        age?: number
    }

    let zzzhim: Person = {
        name: "zzzhim"
    }

    console.log(zzzhim)
```

当然这样也是不允许添加未定义属性的。
```ts
    interface Person {
        name: string
        age?: number
    }

    let zzzhim: Person = {
      name: "zzzhim",
      // Object literal may only specify known properties, and 'height' does not exist in type 'Person'.
      height: "1.85"
    }

    console.log(zzzhim)
```

### 任意属性
有的时候我们并不希望TS对我们进行这么严格的检查，比如上面的例子中，我们希望它只检测我们是否传递了对应的属性，而不管我们是否多传了属性，这个时候我们就需要绕开属性检查了。

绕开属性检查有很多中办法，这里只介绍一种，如下：
```ts
    interface Person {
        name: string
        age?: number
        [ props: string ]: any
    }

    let zzzhim: Person = {
        name: "zzzhim",
        age: 21,
        height: "1.85"
    }
```

!> 需要特别注意的是，一旦定义了任意属性，那么已经确定的属性和可选属性的类型都必须要是它的类型的子集。

### 只读属性
接口也可以定义一个只读的属性。如下：
```ts
    interface Person {
        readonly name: string
        age?: number
        [ props: string ]: any
    }

    let zzzhim: Person = {
        name: "zzzhim",
        age: 21,
        height: "1.85"
    }

    // Cannot assign to 'name' because it is a read-only property.
    zzzhim.name = "tom"
```

### 函数类型
接口不单单可以描述一个对象，也可以描述函数类型，如下：
```ts
    interface Fun {
        (num1: number, num2: number): number
    }

    let fun: Fun = (num1, num2) => num1 + num2

    fun(1, 2)

    // Argument of type '""' is not assignable to parameter of type 'number'.
    fun(1, "")
```
