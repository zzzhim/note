# 类型断言
当我们不确定一个值是什么类型时，我们可以使用类型断言来判断当前值是否符合我们的预期。并且进行相应的操作，如下：
```ts
    const fun = (target: string | number): number => {
        if(typeof target === "number") {
            return target.toString().length
        }
        return target.length
    }

    console.log(fun(123456)) // 6
    console.log(fun("123456")) // 6
```

很显然想要上面的例子正常执行，我们需要做判断，因为我们的参数是**联合类型**，我们需要判断它是否为 `number` 类型，因为 `number` 类型是没有 `length` 方法的，所以我们需要把它转换成字符串，然后在使用 `length` 方法返回我们需要的方法。

要使用 **类型断言** ，将 `target` 的类型断言成 `string` 类型。有两种方法，一种是 `<type>value`，一种是 `value as type`，如下：
```ts
    const fun = (target: string | number): number => {
        if((<string>target).length) {
            return (target as string).length
        }else {
            return target.toString().length
        }
    }

    console.log(fun(123456)) // 6
    console.log(fun("123456")) // 6
```

代码经过编译后，如下：
```ts
    "use strict";
    const fun = (target) => {
        if (target.length) {
            return target.length;
        }
        else {
            return target.toString().length;
        }
    };
    console.log(fun(123456)); // 6
    console.log(fun("123456")); // 6
```

> 这两种写法都可以，但是 `tslint` 推荐使用 `as` 关键字，而且在 `JSX` 中只能使用 `as` 这种写法。

!> 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的
```ts
    function toBoolean(something: string | number): boolean {
        return <boolean>something // Type 'number' is not comparable to type 'boolean'
    }
```