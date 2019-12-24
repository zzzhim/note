# 联合类型
联合类型（Union Types）表示取值可以为多种类型中的一种。联合类型要求只要符合联合类型中任意一种类型即可, 它使用 `|` 符号定义.
```ts
    const fun = (params: string | number): number => {
        if(typeof params === "string") {
            return params.length
        }else {
            return params.toString().length
        }
    }

    console.log(fun(123)) // 3
    console.log(fun("123456")) // 6
```