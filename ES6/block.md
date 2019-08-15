# 块级绑定

### var 声明与变量提升
使用 `var` 关键字声明的变量，无论其实际声明位置在何处，都会被视为声明于所在函数的顶部（如果声明不在任意函数内，则视为在全局作用域的顶部）。这就是所谓的变量提升。

```js
    function getValue(condition) {
        if(condition) {
            var value = "blue"

            return value
        }else {
            console.log(value) // 在此处可以访问，值为undefined
            return null
        }

        console.log(value) // 在此处可以访问，值为undefined
    }
```

对于刚接触 `JS` 的人，或许会认为仅当 `condition` 的值为 **true** 时，变量 `value` 才会被创建。但实际上 `value` 无论何时都会被创建。 `JS` 引擎在后台对 `getValue` 函数进行了调整，就像下面这样：

```js
    function getValue(condition) {
        var value // 未初始化的变量，默认值为undefined

        if(condition) {
            value = "blue"

            return value
        }else {
            console.log(value) // 在此处可以访问，值为undefined
            return null
        }

        console.log(value) // 在此处可以访问，值为undefined
    }

```

`value` 变量的声明被提升到了顶部，而初始化工作则保留在原处。这也代表我们可以在 `else` 分支内 `value` 变量也可以被我们访问到，此处它的值会是 `undefined` ，因为它并没有被初始化。

?> **块级声明：** 块级声明也就是让所声明的变量在指定块的作用域外无法被访问。块级作用域（又被称为词法作用域）在以下情况被创建：

```js
    // 1. 在一个函数内部
    function fun() {
        // no thing
    }

    // 2. 在一个代码块（由一对花括号包裹）内部
    {
        // no thing
    }
```

### let 声明
`let` 声明的语法与 `var` 的语法一致。我们完全可以用 `let` 来代替 `var` 进行变量声明，但会将变量的作用域限制在当前的块级作用域中。由于 `let` 声明不存在变量提升，因此我们需要手动将 `let` 声明放置到顶部，以便让变量在整个代码块都可以被访问到。