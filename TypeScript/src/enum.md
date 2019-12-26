# 枚举
枚举是 TypeScript 新增的一种数据类型, 枚举类型一般用于取值被限定在一定范围内的场景.

### 数字枚举
```ts
    enum color {
        Yellow,
        Red,
        Blue,
    }

    console.log(color.Yellow) // 0
    console.log(color.Red) // 1
    console.log(color["Blue]") // 2
```

我们使用 `enum` 关键字来定义枚举, `color` 有三个字段, 每个字段使用逗号隔开, 我们在访问枚举属性时, 就像访问对象属性一样, 可以使用 `.` 和 `[]` 来访问枚举的属性值.

我们从输出结果可以看出, 当我们没有指定索引的时候, 它会默认从 0 开始, 当然了我们也可以自己指定起始编号. 如下:
```ts
    enum color {
        Yellow = 10,
        Red,
        Blue,
    }

    console.log(color.Yellow) // 10
    console.log(color.Red) // 11
    console.log(color["Blue"]) // 12
```

**数字枚举** 在定义值的时候, 可以使用计算值和常量. 但是需要注意的是, 当我们使用了计算值和常量, 那么该字段后面紧接着的字段必须设置初始值, 不能使用默认的递增值. 如下:

```ts
    const getValue = (): number => {
        return 10
    }

    enum color {
        Yellow = getValue(),
        Red = 15,
        Blue,
    }

    const Start = 1
    enum Index {
        num1 = Start,
        num2, // error 枚举成员必须具有初始化表达式
        num3
    }
```

### 反向映射
当我们定义一个枚举值时, 我们可以通过 `key` 来获取对应的 `value`, 可以通过 `value` 来获取对应的 `key`. 如下:
```ts
    enum color {
        Yellow = 10,
        Red,
        Blue,
    }

    console.log(color.Yellow) // 10
    console.log(color[10]) // Yellow
```

之所以能通过这种方法来获取对应的 `key` 或 `value`, 这是因为 **TypeScript** 在编译时会把它们分别作为对象的属性名和值, 同时添加到对象中去. 这样就使我们既可以通过 `key` 来获取对应的 `value`, 也可以通过 `value` 来获取对应的 `key`.

### 字符串枚举
字符串枚举值要求每个字段的值都必须是字符串字面量, 或者是该枚举值中另一个字符串枚举成员. 如下:
```ts
    enum Str {
        Str1 = "str",
        Str2 = Str1,
        Str3 = "str3",
    }

    console.log(Str.Str1) // str
    console.log(Str.Str2) // str
    console.log(Str.Str3) // str3
```

!> 需要注意的是在字符串枚举中是不能使用常量或计算值的.

### 异构枚举
异构枚举指的是同一个枚举值中的枚举成员既有字符串类型又有数值类型. 如下:
```ts
    enum Heterogeneous {
        num = 1,
        str = "string"
    }
```

!> 这里只是做下介绍, 一般来说除非你真的想要利用 **JavaScript** 运行时的行为, 否则最好不要这样做哦.

### 枚举成员类型和联合枚举类型
如果枚举值里所有成员的值都是字面量类型的值, 那么这个枚举的每个成员和枚举本身都可以作为类型来使用. 如下:
- 不带初始值的枚举成员 `enum E = { num }`
- 值为字符串字面量 `enum E = { Str = "str" }`
- 值为数值字面量 `enum E = { num = 1 }`

当枚举值的所有成员都符合上面的情况时, 枚举值和成员就可以作为类型来使用了.

1. 枚举成员类型
我们把符合条件的枚举值的成员作为类型来使用. 如下:
```ts
    enum Animal {
        Dog = 1,
        Cat
    }

    interface Dog {
        dog: Animal.Dog
    }

    interface Cat {
        cat: Animal.Cat
    }

    let cat: Cat = {
        cat: Animal.Cat
    }

    let dog: Dog = {
        // error 不能将类型“{ dog: Animal; }”分配给类型“Cat”。对象文字可以只指定已知属性，并且“dog”不在类型“Cat”中。
        dog: Animal.Cat
    }

    console.log(cat) // { cat: 2 }
    console.log(dog) // { dog: 1 }
```

2. 联合枚举类型
当枚举值符合条件时, 枚举值就可以看做时一个包含所有成员的联合类型. 如下:
```ts
    enum Color {
        Yello,
        Red,
        Blue
    }

    interface Light {
        color: Color
    }

    const lightColor1: Light = {
        color: Color.Yello
    }

    const lightColor2: Light = {
        color: Color.Red
    }

    console.log(lightColor1.color) // 0
    console.log(lightColor2.color) // 1
```

### 运行时的枚举
之前在反向映射中说过, 枚举在编译后其实会转化为一个对象, 既然它被转化为对象, 自然我们也可以当作一个正常的对象使用. 如下:
```ts
    enum num {
        A,
        B,
        C,
    }

    const getValue = (obj: { A: number }): number => obj.A
    console.log(getValue(num)) // 0
```

### 常数枚举
常数枚举是使用 `const enum` 定义的枚举类型, 常数枚举与普通枚举的区别是, 它会在编译阶段被删, 并且不能包含计算成员.
```ts
    const enum Color {
        Yellow,
        Red,
        Blue
    }

    const color = [ Color.Yellow, Color.Red, Color.Blue ]
```

上面的例子最终会编译成这样, 如下:
```js
    "use strict";
    const color = [0 /* Yellow */, 1 /* Red */, 2 /* Blue */];
```

如果不使用 `const` 定义枚举类型, 则编译结果如下:
```js
    "use strict";
    var Color;
    (function (Color) {
        Color[Color["Yellow"] = 0] = "Yellow";
        Color[Color["Red"] = 1] = "Red";
        Color[Color["Blue"] = 2] = "Blue";
    })(Color || (Color = {}));
    const color = [Color.Yellow, Color.Red, Color.Blue];
```

我们可以看到当我们使用了常用枚举的时候, 它会在编译阶段被删除.

### 外部枚举
外部枚举（Ambient Enums）是使用 `declare enum` 定义的枚举类型, 如下:
```ts
     declare enum Color {
        Yellow,
        Red,
        Blue
    }

    const color = [ Color.Yellow, Color.Red, Color.Blue ]
```

上面的例子最终会编译成这样, 如下:
```js
    "use strict";
    const color = [Color.Yellow, Color.Red, Color.Blue];
```

需要注意的是 `declare` 定义的类型只会用于编译时的检查, 编译结果中会被删除.

同时使用 `declare` 和 `const` 也是可以的:
```ts
    declare const enum Color {
        Yellow,
        Red,
        Blue
    }

    const color = [ Color.Yellow, Color.Red, Color.Blue ]
```

编译结果如下:
```js
    "use strict";
    const color = [0 /* Yellow */, 1 /* Red */, 2 /* Blue */];
```