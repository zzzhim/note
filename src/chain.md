# 链模式
**链模式**一般情况下，通过对构造函数使用 `new` 会返回一个绑定到 `this` 上的新实例，所以我们可以在 `new` 出来的对象上直接用 `.` 访问其属性和方法。如果在普通函数中也返回当前实例，那么我们就可以使用 `.` 在单行代码中一次性连续调用多个方法，就好像它们被锁链链接起来一样，这就是我们常见的链式调用，又称为**链模式**。

### 链模式的实现

```js
    // jQuery使用链模式
    $('div')
        .show()
        .addClass('active')
        .css('color', 'red')
        .on('class', function() {
            // ...
        })
```

这就是我们常见的链模式。如果我们不使用链模式，如下：

```js
    let divEelement = $('div')
    divEelement.show()
    divEelement.addClass('active')
    divEelement.css('color', 'red')
    divEelement.on('class', function() {
        // ...
    })
```

可以从上面的例子上看出来，在不使用链模式调用的情况下，我们的代码量增加了很多，代码结构也复杂了不少。

**链模式**和一般的函数调用的不同在于：链模式一般会在函数调用完方法之后返回一个对象，有时也会返回 `this` ，因此我们就可以继续调用这个对象上的其他方法，这样也可以对同一个对象按照顺序执行多个方法。

这里我们自己实现一个链模式:

```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>chain</title>
    </head>
    <body>
        <div id="app">chain</div>
    </body>
    </html>

    <script>
        window.onload = function() {
            class $ {
                constructor(element) {
                    this.element = document.querySelector(element)
                }

                setWidth(width) {
                    this.element.style.width = width
                    return this
                }

                setHeight(height) {
                    this.element.style.height = height
                    return this
                }

                setBgColor(bgColor) {
                    this.element.style.backgroundColor = bgColor
                    return this
                }
            }

            const app = new $('#app')
            app.setWidth('100px')
                .setHeight('100px')
                .setBgColor('red')
        }
    </script>
```

**链模式**不一定必须返回 `this` 不一定非要在方法中 `return this` ，我们也可以返回其他对象，这样后面的方法就可以对这个新对象进行其他操作。