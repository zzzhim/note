# Set与Map
`Set` 是不包含重复值的列表。`Set`对象允许我们存储任何类型的唯一值，无论是原始值或者是对象引用。
`Map` 则是键与相对应的值的集合。任何值(对象或者原始值) 都可以作为一个键或一个值。

### ES5 中的 Set 与 Map
在ES5中，开发者使用对象属性来模拟 `Set` 与 `Map`。如下：
```js
    let set = Object.create(null)

    set.foo = true

    // 检查属性的存在性
    if(set.foo) {
        // ......
    }
```

在本例中的 `set` 变量是一个原型为 `null` 的对象，确保在此对象上没有继承属性。使用对象的属性作为需要检查的唯一值在ES5中是很常用的方法。当一个属性被添加到 `set` 对象时，它的值也被设为 `true`，因此条件判断语句就可以简单判断出该值是否存在。

使用对象模拟 `Set` 与模拟 `Map` 之间唯一真正的区别是所存储的值。如下：
```js
    let map = Object.create(null)

    map.foo = 'bar'

    // 提取一个值
    let value = map.foo

    console.log(value) // bar
```

与 `Set` 不同， `Map` 多数被用来提取数据，而不是仅检测键的存在性。

### 变通方法的问题
尽管在简单情况下将对象作为 `Set` 与 `Map` 来使用都是可行的，但一旦接触到对象属性的局限性，此方式就会遇到更多麻烦。例如，由于对象属性的类型必须为字符串，你就必须保证任意两个键不能被转换为相同的字符串。如下：
```js
    let map = Object.create(null)

    map[5] = 'foo'

    console.log(map['5']) // foo
```

在将字符串 `'foo'` 赋值到数值类型的键 `5` 上，因为对象属性的类型必须是字符串，所以数值类型会被隐式转换为字符串类型，因此使用 `5` 和 `'5'` 都可以访问到同一个属性。当你想将数值类型与字符串类型都同时作为键时，可能会引发一些问题。

而且如果我们使用对象作为键时，还会出现另有一个问题。如下：
```js
    let map = Object.create(null)
    let key1 = {}
    let key2 = {}

    map[key1] = 'foo'

    console.log(map[key2]) // foo

    // 放开这个注释，你会发现也会打印出 foo
    // console.log(map['[object Object]']) // foo
```

会发生上面的问题的原因，也是因为 `map[key1]` 和 `map[key2]` 引用的是同一个值。由于对象的属性只能是字符串， `key1` 与 `key2` 对象就被转换为字符串了。因为对象的默认的字符串类型表达式为 `'[object Object]'`, 所以它们被转换为了同一个字符串了。
> 这种行为导致的错误可能不太显眼，因为貌似合乎逻辑的假设是：键如果使用了不同对象，它们就应当是不同的键。


### ES6 的 Set
ES6 新增了 `Set` 类型，这是一种无重复值的有序列表。 `Set` 允许对它包含的数据进行快速访问，从而增加了一个追踪离散值的更有效方式。

###### 创建 `Set` 并添加项目
`Set` 使用 `new Set()` 来创建，而调用 `add()` 方法就能向 `Set` 中添加项目，检查 `size` 属性还能查看其中包含有多少项。如下：
```js
    let set = new Set()
    set.add(5)
    set.add('5')

    console.log(set.size) // 2
```

`Set` 是不会使用强制类型转换来判断值是否重复。这意味着 `Set` 可以同时包含数值 `5` 与字符串 `'5'`，并将它们都作为相对独立的项（`Set` 内部使用的比较是使用的 `Object.is()` 方法，来判断两个值是否相等，区别是在判断 `+0` 与 `-0` 时，在 `Set` 中会被判断为相等的）。

同时我们还可以向 `Set` 添加多个对象，它们并不会被合并为同一项：
```js
    let set = new Set()
    let key1 = {}
    let key2 = {}

    set.add(key1)
    set.add(key2)

    console.log(set.size) // 2
```

因为 `key1` 和 `key2` 不会被转换为字符串，所以它们在这个 `Set` 内部被认为是两个不同的项。

如果对 `add()` 方法用相同值进行了多次调用，那么除了第一次以外的调用都会被忽略。如下：
```js
    let set = new Set()
    set.add(5)
    set.add("5")
    set.add(5) // 被忽略

    console.log(set.size) // 2
```

可以使用数组来初始化一个 `Set` ，并且 `Set` 构造器会确保不重复地使用这些值。例如：
```js
    let set = new Set([1, 2, 3, 4, 4, 3, 5, 5, 2])

    console.log(set) // Set(5) {1, 2, 3, 4, 5}
    console.log(set.size) // 5
```

###### `has()` 方法
想要检测某个值是否存在与 `Set` 中，可以使用 `has()` 方法，如下：
```js
    let set = new Set()

    set.add(5)

    set.add('5')

    console.log(set.has(5)) // true
    console.log(set.has(10)) // false
```

###### `delete()` 与 `clear()` 方法
想要将值从 `Set` 中移除，可以使用 `delete()` 与 `clear()` 方法。

> delete() 方法来移除单个值。
>
> clear() 方法来将所有值从 Set 中移除。

```js
    let set = new Set()
    set.add(5)
    set.add('5')
    set.add(6)
    set.add('6')

    console.log(set.has(5)) // true

    set.delete(5)

    console.log(set.has(5)) // false

    set.clear()

    console.log(set.has('5')) // false
    console.log(set.has(6)) // false
    console.log(set.has('6')) // false
```

###### `Set` 上的 `forEach()` 方法
`Set` 上的 `forEach()` 方法会被传递一个回调函数，该回调接受三个参数：
1. Set 中下个位置的值；
2. 与第一个参数相同的值；
3. 目标 Set 自身。

如下：
```js
    let set = new Set([1, 2]);
        set.forEach(function(value, key, ownerSet) {
        console.log(key === value)
        console.log(key + " " + value)
        console.log(ownerSet === set)
    })
```

与传统的 `forEach()` 不同的是，`Set` 是没有键的，为了与数组以及 `Map` 版本保持一致，就把 `Set` 的每一项同时认定为键与值，因此该回调函数的前两个参数始终相等。

###### 将 `Set` 转换为数组
想要将数组转换为 `Set` 很容易，同时想把 `Set` 转换为数组也很容易，只需利用 `扩展运算符` 即可实现。如下：
```js
    let set = new Set([ 1, 2, 2, 3, 3, 4, 5 ])
    let arr = [ ...set ]

    console.log(arr) // [ 1, 2, 3, 4, 5 ]
```

不过需要注意的是把数组转化为 `Set` 的同时会进行去重。当然也可以利用这个特性去创建一个无重复的新数组。

### Weak Set
由于 `Set` 类型存储对象引用的方式， 它也可以被称为 `Strong Set`。对象存储在 `Set` 的一个实例中时，实际上相当于把对象存储在变量中。只要对于 `Set` 实例的引用仍然存在，所存储的对象就无法被垃圾回收机制回收，从而无法释放内存。如下：
```js
    let set = new Set()
    let key = {}

    set.add(key)
    console.log(set.size) // 1

    // 取消原始引用
    key = null

    console.log(set.size) // 1

    // 重新获取原始引用
    key = [...set][0]
```

在本例中，将 key 设置为 `null` 清除了对 `key` 对象的一个引用，但是另一个引用还存于 `set` 内部。你仍然可以使用扩展运算符将 `Set` 转换为数组，然后访问数组的第一项， `key` 变量就取回了原先的对象。这种结果在大部分程序中是没问题的，但有时，当其他引用消失之后若 `Set` 内部的引用也能消失，那就更好。

而使用 `Weak Set` 就可以达到这个目的。，该类型只允许存储对象弱引用，而不能存储基本类型的值。对象的弱引用在它自己成为该对象的唯一引用时，不会阻止垃圾回收。

###### 创建 `Weak Set`
`Weak Set` 使用 `WeakSet` 构造器来创建，并包含 `add()` 方法、 `has()` 方法以及 `delete()` 方法。以下例子使用了这三个方法：

```js
    let set = new WeakSet()
    let key = {}

    set.add(key)

    console.log(set.has(key)) // true

    set.delete(key)

    console.log(set.has(key)) // false
```

`Weak Set` 和 `Set` 的使用方法很相似，我们可以在 `Weak Set` 上添加、删除、或者检查引用，同样也可以给构造器传入一个可迭代对象来初始化 `Weak Set` 的值：

```js
    let key1 = {}
    let key2 = {}
    let set = new WeakSet([ key1, key2 ])

    console.log(set.has(key1)) // true
    console.log(set.has(key2)) // true
```

?>  `WeakSet` 构造器不接受基本类型的值。

###### `Set` 类型之间的关键差异
`Weak Set` 与 `Set` 之间最大的区别是对象的弱引用。如下：
```js
    let set = new WeakSet()
    let key = {}

    set.add(key)
    console.log(set.has(key)) // true

    // 取消原始引用
    key = null

    // 无法核实，不过 JS 引擎已经正确的将引用移除了
```

当此代码被执行后，`Weak Set` 中的 `key` 引用就不能再访问了。核实这一点是不可能的，因为需要把对于该对象的一个引用传递给 `has()` 方法（而只要存在其他引用， `Weak Set` 内部的弱引用就不会消失）。

> **Weak Set 与 Set 的差异**
>
> 1. 对于 `WeakSet` 的实例，若调用 `add()` 方法时传入了非对象的参数，就会抛出错误（ `has()` 或 `delete()` 则会在传入了非对象的参数时返回 `false` ）；
>
> 2. `Weak Set` 不可迭代，因此不能被用在 `for-of` 循环中；
>
> 3. `Weak Set` 无法暴露出任何迭代器（例如 `keys()` 与 `values()` 方法），因此没有任何编程手段可用于判断 `Weak Set` 的内容；
>
> 4. `Weak Set` 没有 `forEach()` 方法；
>
> 5. `Weak Set` 没有 `size` 属性。

### ES6 的 Map
`Map` 对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。

与 `Set` 相同，以下三个方法 `Map` 上也存在。
+ `has(key)` ：判断指定的键是否存在于 `Map` 中；
+ `delete(key)` ：移除 `Map` 中的键以及对应的值；
+ `clear()` ：移除 `Map` 中所有的键与值。
