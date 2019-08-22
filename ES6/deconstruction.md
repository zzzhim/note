# 结构赋值
**解构赋值** 语法是一种**Javascript**表达式。通过**结构赋值**，可以将属性/值从对象/数组中取出，赋值给其他变量。

### 对象解构
在**ES5**中，从对象或数组中获取特定的数据存入本地变量，我们可能要编写许多重复的代码。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    // 获取对象中的指定数据
    const name = person.name
    const age = person.age
    const sex = person.sex
    //...
```

从上面的代码中看到我们想要获取到对象中的指定数据，就必须要逐个赋值，虽然看起来挺简单，但是如果需要提取的数据很多的话，就会变得很麻烦。这就是为什么**ES6**中为何要给对象和数组添加解构赋值的原因。

对象解构语法在赋值语句的左侧使用了对象字面量。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    const { name, age, sex } = person
    console.log(name, age, sex) // zzzhim 23 男
```

在上面的代码中 `person.name`、`person.age`、`person.sex`的值，分别被储存在了`name`、`age`、`sex`的本地变量中。

?> 进行解构赋值时，会把对象上同名的属性的值赋值给对应的变量，来完成解构赋值。

可以看到我们使用**ES6**中的对象解构赋值也可以达到同样的效果，同时代码也更加精简，即使是在处理大量数据的时候，也不会进行重复的操作。

!> 需要注意的是当我们使用解构来配合 `var`、`let` 与 `const`来声明变量的时候，我们必须提供初始化器（也就是等号右边的值）。

###### 无声明赋值
我们在进行变量声明解构赋值的同时，也可以进行**无声明赋值**。如下：
```js
    let name, age, sex
    const person = {
        name: "zzzhim",
        age: 23,
        sex: "男"
    }

    // 使用解构赋值来分配对应的值
    ;({ name, age, sex } = person)
    console.log(name, age, sex) // zzzhim 23 男
```

在上面的例子中 `name`、`age`、`sex`变量都已经被声明，然后我们通过解构来获取到了 `person` 上对应的同名属性，来进行赋值。

!> 这里进行解构赋值时，必须使用圆括号包裹解构赋值语句，这是因为 左侧的 `{ name, age, sex }` 会被认为一个块而不是对象字面量，使用圆括号包裹代码块，标识了里面的并不是块语句，而应该被解释为表达式。`(...)`表达式之前有些时候可能需要一个分号，否则可能会被当成上一行的函数执行。

### 默认值
变量可以先赋予默认值，当我们要提取的对象没有对应的属性或者值为 `undefined` 时，变量将会被赋予默认值。如下：
```js
    const person = {
        name: "zzzhim",
        age: 23,
        sex: undefined
    }

    const { name, age, sex = "男", height = "1.85" } = person
    console.log(name, age, sex, height) // zzzhim 23 男 1.85
```

上面的例子我们可以看到，我们给 `sex` 与 `height` 声明了一个默认值，当 `person` 对象上面并没有该属性，或者该属性的值为 `undefined` 时默认值将会被应用。

### 别名：将对象的属性值赋值给不同的变量名
上面的例子中我们都是把对象的属性值赋值给了相同的变量名，ES6中的解构赋值也支持给与对象属性名不同的变量名赋值。如下：
```js
    const person = {
        name: "zzzhim"
    }

    const { name: englishName } = person
    console.log(englishName) // zzzhim
```

`{ name: englishName } = person` 表示要读取 `person` 对象上的 `name` 属性，并把它的值赋值在变量 `englishName` 上面。可以看到这种语法正好与我们使用的传统字面量语法相反，传统语法将名称放在冒号左边、值放在右边。而本例中正好相反，名称在右，值则在左。

### 给别名添加默认值
我们可以给变量别名添加默认值，依然是在本地变量名称后添加等号与默认值。如下：
```js
    const person = {
        name: "zzzhim",
        age: undefined
    }

    const { age: localAge = 23 } = person
    console.log(localAge) // 23
```

### 嵌套的对象解构
使用类似于对象字面量的语法，可以深入到嵌套的对象结构中去提取我们想要的数据。如下：
```js
    const person = {
        name: {
            englishName: 'zzzhim',
            chineseName: '反芹菜联盟盟主'
        }
    }

    const { name: { englishName, chineseName } } = person
    console.log(englishName, chineseName) // zzzhim, 反芹菜联盟盟主
```

从上面的例子中我们看到，解构赋值上使用了花括号，表示应当到 `person` 对象下的 `name` 属性寻找 `englishName` 与 `chineseName` 属性。

当然了**嵌套的对象解构**也同样支持参数默认值与别名。
```js
    const person = {
        name: {
            chineseName: '反芹菜联盟盟主'
        }
    }

    const { name: { englishName = "zzzhim", chineseName: localName } } = person
    console.log(englishName, localName) // zzzhim, 反芹菜联盟盟主
```
