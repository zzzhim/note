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

###### set与get方法
想要给 `Map` 添加键值可以调用 `set()` 方法；然后可以使用键名来调用 `get()` 方法便能够取得对应的值了。如下：
```js
    let map = new Map()

    map.set("title", "ES6")
    map.set("type", "JS")

    console.log(map.get("title")) // ES6
    console.log(map.get("type"))  // JS
```

我们也可以将对象作为键，这也是以前使用对象属性来创建 `Map` 的变通方法所无法做到的。如下：
```js
    let map = new Map()
    const key1 = {}
    const key2 = {}

    map.set(key1, 1)
    map.set(key2, 2)

    console.log(map.get(key1)) // 1
    console.log(map.get(key2)) // 2
```

在这里我们使用了对象作为 **Map** 的键，并且存储了两个不同的值。由于 **Map** 的键不会被强制转换成其他形式，所以每个对象就都被认为是唯一的。这允许我们给对象关联额外数据，而不用修改对象自身。

### Map 的方法
与 `Set` 相同，以下三个方法 `Map` 上也存在。
+ `has(key)` ：判断指定的键是否存在于 `Map` 中；
+ `delete(key)` ：移除 `Map` 中的键以及对应的值；
+ `clear()` ：移除 `Map` 中所有的键与值。

**Map** 同样拥有 `size` 属性，用于指明包含了多少键值对。

此示例包含三种方法以及 `size` 属性。
```js
    let map = new Map()
    map.set('a', 1)
    map.set('b', 2)

    console.log(map.size) // 2
    console.log(map.has('a')) // true

    map.delete('a')

    // 在 a 键被使用 delete 方法移除后， has() 方法再接受 a 的时候就会返回 false 了
    console.log(map.has('a')) // false
    console.log(map.size) // 1


    console.log(map.has('b')) // true
    map.clear()

    console.log(map.size) // 0
    // 使用 clear 方法则清空了所有的键，所以 has() 方法再接受 b 的时候就会返回 false 了
    console.log(map.has('b')) // false
```

### Map 的初始化
我们也可以将数组传递给 `Map` 构造器，以便使用数据来初始化一个 **Map**。 该数组中的每一项也必须是数组，内部数组的首个项会作为键，第二项则会为对应值。因此整个 **Map** 就被这些双项数组所填充。如下：
```js
    const map = new Map([[ 'a', 1 ], [ 'b', 2 ]])

    console.log(map.size) // 2

    console.log(map.has('a')) // true
    console.log(map.has('b')) // true

    console.log(map.get('a')) // 1
    console.log(map.get('b')) // 2
```

### Map 上的 forEach 方法
**Map** 上也有  `forEach()` 方法类似于 `Set` 与数组的同名方法，它接受一个能接受三个参数的回调函数：
1. **Map** 中下个位置的值
2. 该值对应的键
3. 目标 **Map** 自身

如下：
```js
    const map = new Map([[ 'a', 1 ], [ 'b', 2 ]])

    map.forEach((value, key, own) => {
        // 第一次循环打印 1 ；第二次循环打印 2 ；
        console.log(value)
        // 第一次循环打印 a ；第二次循环打印 b ；
        console.log(key)
        // 第一次循环打印 true ；第二次循环打印 true ；
        console.log(map === own)
    })

```

> 你也可以给 forEach() 提供第二个参数来指定回调函数中的 this 值，其行为与 Set 版本的 forEach() 一致。

### Weak Map
Weak Map 对 Map 而言，就像 Weak Set 对 Set 一样：Weak 版本都是存储对象弱引用的方式。在 **Weak Map** 中，所有的键对必须是对象（如果使用非对象则会抛出错误），而且这些对象都是弱引用，不会干扰垃圾回收。当 **Weak Map** 中的键在 **Weak Map** 之外不存在引用时，该键值对会被移除。

**Weak Map** 的最佳用武之地，就是在浏览器中创建一个关联到特定 **DOM** 元素的对象。例如，某些用在网页上的 **JS** 库会维护一个自定义对象，用于引用该库所使用的每一个 **DOM** 元素，并且其映射关系会存储在内部的对象缓存中。

该方法的困难之处在于：如何判断一个 **DOM** 元素已不复存在于网页中，以便该库能移除此元素的关联对象。若做不到，该库就会继续保持对 **DOM** 元素的一个无效引用，并造成内存泄漏。使用 **Weak Map** 来追踪 **DOM** 元素，依然允许将自定义对象关联到每个 **DOM** 元素，而在此对象所关联的 **DOM** 元素不复存在时，它就会在 **Weak Map** 中被自动销毁。

> 必须注意的是， **Weak Map** 的键才是弱引用，而值不是。在 **Weak Map** 的值中存储对象会阻止垃圾回收，即使该对象的其他引用已全都被移除。

### 使用 Weak Map
ES6 的 `Weak Map` 类型是键值对的无序列表，其中键必须是非空的对象，值则允许是任意类型。 `Weak Map` 的接口与 `Map` 的非常相似，都使用 `set()` 与 `get()` 方法来分别添加与提取数据。如下：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title></title>
    </head>
    <body>
        <div id="ele">123</div>
    </body>
    </html>

    <script>
        let map = new WeakMap()
        let ele = document.querySelector("#ele")

        map.set(ele, 'dom')

        const value = map.get(ele)
        console.log(value) // dom

        // 删除元素
        ele.parentNode.removeChild(ele)

        ele = null

        // 该 Weak Map 在此处为空
    </script>
```

类似于 Weak Set ，没有任何办法可以确认 Weak Map 是否为空，因为它没有 `size` 属性。在其他引用被移除后，由于对键的引用不再有残留，也就无法调用 `get()` 方法来提取对应的值。Weak Map  已经切断了对于该值的访问，其所占的内存在垃圾回收器运行时便会被释放。

### Weak Map 的初始化
和正规的 `Map` 构造器一样，初始化 **Weak Map**，也需要把一个由数组构成的数组传递给 `Weak Map` 构造器。每个内部数组都要有两个值，第一项是作为键的非空对象，第二项则是对应的值（任意类型`any`）。如下：
```js
    const key1 = {}
    const key2 = {}
    const map = new WeakMap([[ key1, 1 ], [ key2, 2 ]])

    console.log(map.get(key1)) // 1
    console.log(map.get(key2)) // 2
```

!> 在传递给 **WeakMap** 构造器的参数中，若任意键值对使用了非对象的键，构造器就会抛出错误。

### Weak Map 的方法
Weak Map 只有两个附加方法能用来与键值对交互。
1. `has()` 方法用于判断指定的键是否存在于 Map 中。
2. `delete()` 方法则用于移除一个特定的键值对。

需要注意的是 **Weak Map** 上是没有 `clear()` 方法的，这是因为没必要对键进行枚举，而且也不可能对 Weak Map 进行枚举。

此示例使用了两种方法，如下：
```js
    const key1 = {}
    const key2 = {}
    let map = new WeakMap([[ key1, 1 ], [ key2, 2 ]])

    console.log(map.has(key1)) // true
    console.log(map.has(key2)) // true

    map.delete(key1)
    map.delete(key2)

    console.log(map.has(key1)) // false
    console.log(map.has(key2)) // false
```

### 使用 Weak Map 来创建对象的私有数据
Weak Map 的另一个实际应用就是在对象实例中存储私有数据。如下：
```js
    let Person = (function() {
        let privateData = new WeakMap()

        function Person(name) {
            privateData.set(this, { name: name })
        }

        Person.prototype.getName = function() {
            return privateData.get(this).name
        }

        return Person
    }())

    const person = new Person('反芹菜联盟盟主')

    person.getName() // 反芹菜联盟盟主
```

由于 `Person` 对象的实例本身能被作为键来使用，于是也就无须再记录单独的 `ID` 。当 `Person` 构造器被调用时，将 `this` 作为键在 `Weak Map` 上建立了一个入口，而包含私有信息的对象成为了对应的值，其中只存放了 `name` 属性。通过将 `this` 传递给 `privateData.get()` 方法，以获取值对象并访问其 `name` 属性， `getName()` 函数便能提取私有信息。这种技术让私有信息能够保持私有状态，并且当与之关联的对象实例被销毁时，私有信息也会被同时销毁。

### 总结
**Set** 是无重复值的有序列表。根据 `Object.is()` 方法来判断其中的值不相等，以保证无重复。**Set** 会自动移除重复的值，因此我们也可以使用它来过滤数组的重复值。我们可以使用 `has()` 方法来判断某一个值是否存在于 **Set** 中，也可以通过 `size` 属性查看其中有多少值。也可以使用 `forEach()` 方法，来处理每个值。

Weak Set 是只能包含对象的特殊 Set 。其中的对象使用弱引用来存储，意味着当 Weak Set中的项是某个对象的仅存引用时，它不会屏蔽垃圾回收。由于内存管理的复杂性， Weak Set的内容不能被检查，因此最好将 Weak Set 仅用于追踪需要被归组在一起的对象。

Map 是有序的键值对，其中的键允许是任何类型。与 Set 相似，通过调用 `Object.is()` 方法来判断重复的键，这意味着能将数值 5 与字符串 "5" 作为两个相对独立的键。使用 `set()` 方法能将任何类型的值关联到某个键上，并且该值此后能用 `get()` 方法提取出来。Map 也拥有一个 size 属性与一个 `forEach()` 方法，让项目访问更容易。

Weak Map 是只能包含对象类型的键的特殊 Map 。与 Weak Set 相似，键的对象引用是弱引用，因此当它是某个对象的仅存引用时，也不会屏蔽垃圾回收。当键被回收之后，所关联的值也同时从 Weak Map 中被移除。