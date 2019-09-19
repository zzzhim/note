# 用模块封装代码
在 **ES6** 之前，一个应用的每个 **JS** 文件所定义的所有内容都由全局作用域共享。当应用变得非常复杂时，这会造成许多问题，例如命名冲突、安全问题等。**ES6** 的设计目标之一就是要解决作用域问题，让 **JS** 应用更加有条理，更容易维护。

### 何为模块？
模块（**Modules**）是使用不同方法加载的 **JS** 文件（与 **JS** 原先的脚本加载方式相对）。这种不同模式很有必要，因为它与脚本（**script**） 有大大不同的语义：
1. 模块代码自动运行在严格模式下，并且没有任何办法跳出严格模式；
2. 在模块的顶级作用域创建的变量，不会被自动添加到共享的全局作用域，它们只会在模块顶级作用域的内部存在；
3. 模块顶级作用域的 `this` 值为 `undefined` ；
4. 模块不允许在代码中使用 **HTML** 风格的注释（这是 **JS** 来自于早期浏览器的历史遗留特性）；
5. 对于需要让模块外部代码访问的内容，模块必须导出它们；
6. 允许模块从其他模块导入绑定。

?> 模块最重要的功能是可以按需导出与导入代码的能力，而不用将所有内容放在同一个文件内。

### 基本的导出
想要把代码公开给其他模块，我们可以使用 `export` 关键字将代码导出给其他模块使用。最简单的方法就是把 `export` 放在函数、变量、类声明之前。

如下：
```js
    // 导出变量
    export var age = 23
    export let color = "red"
    export const name = "zzzhim"

    // 导出函数
    export function sum(num1, num2) {
        return num1 + num2
    }

    // 导出类
    export class React {
        constructor(length, width) {
            this.length = length
            this.width = width
        }
    }

    // 声明一个私有函数
    function add() {
        // ......
    }
```

上面被导出的函数或者类都有自己的名称，这是因为导出的函数声明与类声明必须要有名称。想要导出一个匿名函数或匿名类，需要使用 `default` 关键字（后面会提到）。

!> 在模块中未被导出的 变量、函数、类，在模块外部都不可被访问，这是因为它们在模块内是私有的。

### 基本的导入
我们可以在模块内使用 `import` 关键字来访问其他模块导出的功能。

`import` 语句有两个部分，一是需要导入的标识符，二是需要导入的标识符的来源模块。如下：
```js
    import { sum } from "./example.js"
```

`import` 的花括号指明了从给定模块导入对应的绑定， `from` 关键字则指明了需要导入的模块。

?> 当从模块导入了一个绑定时，该绑定表现的就像使用了 `const` 的定义。这意味着你不能再定义另一个同名变量（包括导入另一个同名绑定），也不能在对应的 `import` 语句之前使用此标识符（也就是要受到暂时性死区限制），更不能修改它的值。

###### 导入单个绑定
```js
    // 单个导入
    import { sum } from "./example.js"
```

###### 导入多个绑定
```js
    // 多个导入
    import { sum, React, age } from "./example.js"
```

###### 完全导入一个模块
```js
    // 完全导入
    import * as example from "./example.js"
```

在此例中，`example.js` 中所有导出的绑定都会被加载到一个名为 `example` 的对象中。这种导入格式被称为命名空间导入（**namespace import**），这是因为该 `example` 对象并不存在于 `example.js` 文件中，而是作为一个命名空间对象被创建使用。

?> 无论你对同一个模块使用了多少次 `import` 语句，该模块都只会被执行一次。在导出模块的代码执行之后，已被实例化的模块就被保留在内存中，并随时都能被其他 `import` 所引用。

> 你只能在模块的顶级作用域使用 `export` 。类似的，你不能在一个语句内部使用 `import` ，也只能将其用在顶级作用域。
```js
    if (sum) {
        export sum // 语法错误
    }
```
```js
    function tryImport() {
        import { sum } from "./example.js" // 语法错误
    }
```

###### 重命名导出与导入
假如我们想用不同的名称导出一个函数，我们可以使用 `as` 关键字来指定新的名称。如下：
```js
    function sum(num1, num2) {
        return num1 + num2
    }

    // 导出函数
    export { sum as add }
```

在此处 `sum` 是本地名称（**local name**），后者则是导出名称（**exported name**）。这意味着当另一个模块想要导入此函数时，需要使用 `add` 这个名称。如下：
```js
    import { add } from "./example.js"
```

如果模块导入函数时想使用另一个名称，同样也可以用 `as` 关键字：
```js
    import { add as sum } from "./example.js"

    console.log(typeof add) // undefined
    console.log(sum(1, 2)) // 3
```

### 模块的默认值
模块的默认值（**default value**）是使用 `default` 关键字所指定的单个变量、函数或类，在每个模块中只能设置一个默认导出，将 `default` 关键字用于多个导出会是语法错误。

###### 导出默认值
以下是使用 `default` 关键字的例子：
```js
    // 导出默认值
    export default function(num1, num2) {
        return num1 + num2
    }
```

在此模块中我们将一个函数作为默认值导出， `default` 关键字标明了这是一个默认导出。此函数不需要名称，因为它就代表了这个模块自身。

我们也可以这样指定一个默认的导出，如下：
```js
    // 导出默认值
    function sum(num1, num2) {
        return num1 + num2
    }
    export default sum
```

###### 导入默认值
我们可以使用下列语法导入一个模块的默认值：
```js
    // 导入默认值
    import sum from "./example.js"

    console.log(sum(1, 2)) // 3
```

对于即导出了默认值，又导出了非默认绑定的模块，如下：
```js
    export let color = "red"

    // 导出默认值
    function sum(num1, num2) {
        return num1 + num2
    }
    export default sum
```

我们可以使用这种方式导入非默认和默认值，如下：
```js
    import sum, { color } from "./example.js"
```

###### 绑定的再导出
如果我们想把当前导入的模块再重新导出，只需这样：
```js
    import sum, { color } from "./example.js"

    export { color }
```

当然我们也可以选择将一个值用不同名称导出：
```js
    export { color as red } from "./example.js"
```

如果我们想将来自另一个模块的所有值完全导出，可以使用星号（ * ）模式：
```js
    export * from "./example.js"
```

### 无绑定的导入
有些模块也许没有进行任何导出，可能我们只需要它做一些适配处理。

如下：
```js
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if(clientWidth>= 750){
                    docEl.style.fontSize = '100px';
                }else{
                    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                }
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
        recalc();
    })(document, window);
```

我们只需要此代码在屏幕宽度变化时，做不同的适配。尽管我们并没有在该模块中做任何导出与导入，但它仍然是一个有效的模块。我们可以把它当做一个模块或者脚本使用。

如下：
```js
    import "./example.js"
```

由于它没有导出任何东西，我们可以使用此简化的导入语法来执行此模块的代码。

?> 无绑定的导入经常被用于创建 **polyfill** 与 **shim** (也就是为新语法在旧环境中运行提供向下兼容的两种方式)。

### 加载模块
ES6 虽然定义了模块的语法，但是并未定义如何加载它们。。这是规范复杂性的一部分，这种复杂性对于实现环境来说是无法预知的。 ES6 未选择给所有 JS 环境努力创建一个有效的单一规范，而只对一个未定义的内部操作 `HostResolveImportedModule` 指定了语法以及抽象的加载机制。

### 在 Web 浏览器中使用模块
即使在 ES6 之前， web 浏览器都有多种方式在 web 应用中加载 JS 。这些可能的脚本加载选择是：
1. 使用 `<script>` 元素以及 `src` 属性来指定代码加载的位置，以便加载 JS 代码文件。
2. 使用 `<script>` 元素但不使用 `src` 属性，来嵌入内联的 JS 代码。
3. 加载 JS 代码文件并作为 **Worker** （例如 **Web Worker** 或 **Service Worker**）来执行。

###### 在 script 标签中使用模块
`<script>` 元素默认以脚本方式（而非模块）来加载 **JS** 文件，只要 `type` 属性缺失，或者 `type` 属性含有与 **JS** 对应的内容类型（如：`"text/javascript"`）。`<script>` 元素能够执行内联脚本，也能加载在 `src` 中指定的文件。为了支持模块，添加了 `"module"` 值作为 `type` 的选项。将 `type` 设置为 `"module"` ，就告诉了浏览器要将内联代码或是指定文件中的代码当做模块，而不是当作脚本。

如下：
```js
    // 加载 js模块文件
    <script type="module" src="module.js"></srcipt>

    // 包括内联模块
    <script type="module">
        import { sum } from "./example.js"
        let result = sum(1, 2)
    </script>
```

###### Web 浏览器中的模块加载次序
模块相对脚本的独特之处在于：它们能使用 `import` 来指定必须要加载的其他文件，以保证正确执行。为了支持此功能， `<script type="module">` 总是表现得像是已经应用了 `defer` 属性。

`defer` 属性是加载脚本文件时的可选项，但在加载模块文件时总是自动应用的。当 **HTML** 解析到拥有 `src` 属性的 `<script type="module">` 标签时，就会立即开始下载模块文件，但并不会执行它，直到整个网页文档全部解析完为止。这也就意味着模块会按照它们在 **HTML** 文件中出现的顺序依次执行。

如下：
```js
    // 第一个执行
    <script type="module" src="module1.js"></script>

    // 第二个执行
    <script type="module">
        import { sum } from "./example.js"
        let result = sum(1, 2)
    </script>

    // 第三个执行
    <script type="module" src="module2.js"></script>
```

所有模块无论是用 `<script type="module">` 显式包含的，还是用 `import` 隐式包含的，都会按照次序加载与执行。

前面的范例，完整的加载次序是：
1. 下载并解析 `module1.js`；
2. 递归下载并解析在 `module1.js` 中使用 `import` 导入的资源；
3. 解析内联模块；
4. 递归下载并解析在内联模块中使用 `import` 导入的资源；
5. 下载并解析 `module2.js`；
6. 递归下载并解析在 `module2.js` 中使用 `import` 导入的资源；

一旦加载完毕，直到页面文档被完整解析之前，都不会有任何代码被执行。在文档解析完毕后，会发生下列行为：
1. 递归执行 `module1.js` 导入的资源；
2. 执行 `module1.js`；
3. 递归执行内联模块导入的资源；
4. 执行内联模块；
5. 递归执行 `module2.js` 导入的资源；
6. 执行 `module2.js`；

> `<script type="module">` 上的 `defer` 属性总是会被忽略，因为它已经应用了该属性。

###### Web 浏览器中的异步模块加载
当配合脚本使用时， `async` 会导致脚本文件在下载并解析完毕后就立即执行。但带有 `async` 的脚本在文档中的顺序却并不会影响脚本执行的次序，脚本总是会在下载完成后就立即执行，而无须等待包含它的文档解析完毕。

`async` 属性也能同样被应用到模块上。在 `<script type="module">` 上使用 `async` 会导致模块的执行行为与脚本相似。唯一区别是模块中所有 `import` 导入的资源会在模块自身被执行前先下载。这保证了模块中所有需要的资源会在模块执行前被下载，你只是不能保证模块何时会执行。

如下：
```js
    // 不能保证哪个会先执行
    <script type="module" async src="module1.js"></script>
    <script type="module" async src="module2.js"></script>
```

###### 将模块作为 Worker 加载
为了支持模块加载， **HTML** 标准的开发者为 **worker** 构造器添加了第二个参数。此参数是一个有 `type` 属性的对象，该属性的默认值是 `"script"` 。你也可以将 `type` 设置为`"module"` 以便加载模块文件：
```js
    // 用模块方式加载 module.js
    let worker = new Worker("module.js", { type: "module" })
```