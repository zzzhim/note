# 字符串与正则表达式

建议读一下这篇文章：[谈谈Unicode编码，简要解释UCS、UTF、BMP、BOM等名词](http://www.fmddlmyy.cn/text6.html)

### 新增的一些方法
+ [codePointAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
+ [String.fromCodePoint()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint)
+ [normalize()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)

### 正则表达式**u**标志
+ 当切换到**u**标志的时候，使用unicode码的模式进行匹配。
+ 当切换到**y**标志的时候，使用“粘性”搜索,匹配从目标字符串的当前位置开始，可以使用y标志。

### 识别字符串是否存在于其它字符串中的方法
+ **includes()** 方法，在给定文本存在于字符串中的任意位置时会返回 `true`，否则返回 `false`。
+ **startsWith()** 方法，在给定文本出现在字符串起始处时返回 `true`，否则返回 `false`。
+ **endsWith()** 方法，在给定文本出现在字符串结尾处时返回 `true`，否则返回 `false`。

以上的方法都接受两个参数：第一个参数搜索的文本，以及可选的搜索起始位置索引。
当提供了第二个参数的时候，`includes()`和`startsWith()`方法会从该索引位置开始尝试匹配；而`endsWith()`方法会将字符串长度减去该参数，以此为起点开始尝试匹配。
当不提供第二个参数的时候，`includes()`和`startsWith()`方法会从字符串起始处开始查找，而`endsWith()`方法则从尾部开始。

```js
    const str = "Hello world !"

    console.log(str.includes('world'))   // true
    console.log(str.startsWith('Hello')) // true
    console.log(str.endsWith('!'))       // true

    console.log(str.includes('a'))       // false
    console.log(str.startsWith('!'))     // false
    console.log(str.endsWith('Hello'))   // false

    console.log(str.startsWith("o", 4))  // true
    console.log(str.endsWith("o", 8))    // true
    console.log(str.includes("o", 8))    // false
```

### repeat() 方法
`repeat()` 方法，它接受一个参数作为字符串的重复次数，返回一个将初始字符串重复指定次数的新字符串。如下

```js
    console.log('x'.repeat(4))        // xxxx
    console.log('你好'.repeat(4))     // 你好你好你好你好
    console.log('zzzhim'.repeat(4))  // zzzhimzzzhimzzzhimzzzhim
```

### flags属性
ES6新增了 `flags` 属性用于配合 `source` 属性，让标志的获取变得更容易。这两个属性均为只有 `getter` 的原型访问器属性，因此都是只读的。

```js
    const reg = /ab/g

    console.log(reg.source) // ab
    console.log(reg.flags)  // g
```

### 模板字面量
模板字面量 是允许嵌入表达式的字符串字面量。让我们可以通过使用模板字面量的方式进行多行字符串和字符串插值功能。

###### 基本语法
模板字面量是使用 **反引号(\`\`)** 来代替普通字符串中的双引号和单引号。
模板字符串可以通过 **(\`${}\`)** 来插入变量和表达式等。

```js
    const a = 'world'

    const str = `Hello ${a}!`
    const str1 = `1 + 2 = ${1 + 2}`
    console.log(str)  // Hello world!
    console.log(str1) // 1 + 2 = 3
```

###### 标签化模板
一个模板标签（ template tag ）能对模板字面量进行转换并返回最终的字符串值，标签在模板的起始处被指定，即在第一个 ` 之前。

```js
    function tag(literals, ...substitutions) {
        let str = ''
        let len = literals.length > substitutions.length ? literals.length : substitutions.length

        // 返回一个字符串
        for(let i = 0; i < len; i++) {
            str += literals[i] ? literals[i] : ''
            str += substitutions[i] ? substitutions[i] : ''
        }
        return str
    }

    const str = 'world'
    let message = tag`Hello ${str}! 您${'好'}啊!`

    console.log(message) // "Hello world! 您好啊!"
```

### 总结
ES6添加了完整的Unicode支持，同时也添加了操作字符串的一些新方法，正则表达式也同样引入了许多功能。
模板字面量的添加使得我们在组合字符串与变量的时候变得更加容易拼接与操作。并且通过模板我们可以创建接收模板字面量片段作为参数的函数，可以使用它们来返回合适的字符串。