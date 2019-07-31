# 模块模式
**模块模式**主要保持应用项目的代码单元能够清晰的分离.添加私有变量和私有方法,减少全局变量的使用.

### 命名空间模式
**命名空间模式**是一个简单的模拟模块的方法,即创建一个全局对象,然后将变量和方法添加到这个全局对象中,这个全局对象是作为命名空间一样的角色.

```
    const a = {}

    a.param1 = 'hello'
    a.param2 = 'world'
    a.param3 = { name: 'name' }

    a.method = function () {
        // ......
    }
```

通过这种方式我们可以避免系统中的变量冲突,但是同时也是有一些缺点的,比如：
1. 命名空间如果比较复杂的话,调用起来可能就会变成很长的一串 `a.params.prop.method.toString...`,使用起来会变得很不方便,并且大大的增加了我们的代码量;
2. 变量嵌套关系越多,属性解析的性能消耗就越多;
3. 安全性不佳,所有的成员都可以被使用者访问到;

### 模块模式
除了**命名空间模式**,我们也可以利用js闭包的特性来实现私有成员的功能来提升安全性,这里通过自执行函数来实现一个闭包.

```
    const myModule = (() => {
        let privateProp = '' // 私有变量
        let privateMethod = () => { // 私有方法
            console.log(privateProp)
        }

        return {
            publicProp: '', // 暴露出去的变量
            publicMethod: function(prop) { // 暴露出去的方法
                privateProp = prop
                privateMethod()
            }
        }
    })()

    myModule.publicMethod('hello world') // hello world
    myModule.privateProp // undefined
    myModule.privateMethod('hello world') // 抛错 myModule.privateMethod is not a function
```

这里面我们声明的私有方法和私有变量,在闭包外面是无法被访问到的,我们称之为私有成员.而闭包返回的方法因为作用域的原因可以访问到私有成员,所以称为特权方法.

!> 由于闭包会使得函数中的变量一直被保存在内存中,对内存消耗很大,所以我们应该尽量避免闭包,不去滥用闭包,否则可能会造成网页的性能问题,在IE中可能会导致内存泄露.

### 揭示模块模式
**揭示模块模式**又叫**暴露模块模式**,在私有域中定义我们所有的函数和变量,并且返回一个匿名对象,把想要暴露出来的私有成员赋值给这个对象,使这些私有成员公开化.

```
    const myModule = (() => {
        let privateProp = ''
        let printProp = () => {
            console.log(privateProp)
        }

        function setProp(prop) {
            privateProp = prop
            printProp()
        }

        return {
           print: printProp,
           set: setProp
        }
    })()

    myModule.set('hello world')          // 输出：hello world
    myModule.setProp('hello world')                // Uncaught TypeError: myModule.setProp is not a function
    myModule.privateProp              // undefined
```

揭示模块暴露出来的私有成员可以在被重名名后公开访问,也增强了可读性.

### ES6 Module
从ES6开始,JavaScript就支持原生模块导入机制.
ES6的Module功能主要由两个命令组成 `export`、`import`,`export`用于规定模块对外暴露的接口,`import`用于导入其他模块提供的接口,简单来说就是可以导入`export`导出的模块.

###### 导入整个模块的内容

```
    import * as myModule from '/modules/my-module.js"
```

###### 导入单个接口 & 导入多个接口

```
    import { myExport } from '/modules/my-module.js' // 单个

    import { foo, bar } from '/modules/my-module.js' // 多个
```

###### 导入带有别名的接口 

```
    import { reallyReallyLongModuleExportName as shortName } from '/modules/my-module.js' // 单个

    import { reallyReallyLongModuleMemberName as shortName, anotherLongModuleName as short } from '/modules/my-module.js' // 多个
```

###### 导入整个模块的内容
这将运行模块中的全局代码,但实际上不导入任何值

```
    import '/modules/my-module.js'
```

###### 导入默认值

```
    import myDefault from '/modules/my-module.js'

    import myDefault, * as myModule from '/modules/my-module.js'

    import myDefault, {foo, bar} from '/modules/my-module.js'
```

!> `export`、`import`都必须写在模块顶层,如果处于块级作用域内,就会报错,因为处于条件代码块中,就没法做静态优化了,违背了ES6模块的设计初衷.