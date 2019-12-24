# 交叉类型
交叉类型(Cross type)就是取多个类型的并集, 使用 `&` 符合定义, 被 `&` 符链接的多个类型构成的类型.如下:
```ts
    const merge = <T, U>(obj1: T, obj2: U): T & U => {
        // 指定返回值的类型兼备T和U两个类型变量代表的类型的特点
        let obj = {} as T & U
        obj = Object.assign(obj1, obj2)
        return obj
    }

    const obj1 = {
        name: "zzzhim"
    }

    const obj2 = {
        age: "22"
    }

    const obj = merge(obj1, obj2)
    console.log(obj.name) // zzzhim
    console.log(obj.age) // 22
```

从上面的函数返回值可以看出, 返回的对象既有 `name` 属性, 同时也拥有 `age` 属性.