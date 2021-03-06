# MVC、MVP、MVVM模式

### MVC模式
**MVC**模式将程序分为了三个部分。
1. Model 模型层： 业务数据的处理和存储，数据更新后更新。
2. View 视图层： 人机交互接口，一般为展示给用户的界面。
3. Controller 控制器层： 负责连接Model层和View层，接受并处理View层触发的事件，并在Model层的数据状态变动时更新View层。

`MVC` 模式的目的是通过引入 `Controller` 层来将 `Model` 层和 `View` 层分离，使得系统在可维护性和可读性上有了进步。

`View` 层通过事件通知到 `Controller` 层， `Controller` 层经过对事件的处理完成相关业务逻辑，要求 `Model` 层改变数据状态， `Model` 层再将新数据更新到 `View` 层。


在实际操作时，用户可以直接对 `View` 层的 UI 进行操作，通过事件通知 `Controller` 层，经过处理后修改 `Model` 层的数据，`Model` 层使用更改后的最新数据更新 `View`。


用户也可以直接触发 `Controller` 去更新 `Model` 层状态，在更新 `View` 层。


### MVP模式
**MVP**模式将程序分为三个部分: 模型（Model）、视图（View）、管理层（Presenter）。

1. `Model`模型层： 只负责储存数据，与View呈现无关，也与UI处理逻辑无关，发生更新也不会主动通知`View`；
2. `View`视图层： 展示给用户的界面。
3. `Presenter` 管理层： 负责连接Model层和View层，处理View层的事件，获取数据并将获取的数据经过处理后更新View。

!> MVC模式的`View`层和`Model`层存在一定的耦合性。`MVP`模式将`View`层和`Model`层解耦，之间的交互只能通过`Presenter`层，实际上，`Mvp`模式的目的就是将`View`层和`Model`完全解耦，使得对View层的修改不会影响到`Model`层，而对`Model`层的数据改动也不会影响到`View`层。

### MVVM模式
**MVVM**模式将程序分为三个部分： 模型（Model）、视图（View）、视图模型（View-Model）。

`MVVM`和`MVP`相似，`Model`层也和`View`层被分隔开了，彻底解耦，`ViewModel`层相当于`Presenter`层，负责绑定`Model`层和`View`层，相比于`Mvp`增加了双向绑定机制。

`MVVM`模式的特点是 `ViewModel`和`View`层使用了双向绑定的形式，当`view`层发生变化的时候，`ViewModel`层也会跟着变化，反之亦然。

Vue的双向绑定机制也是借鉴了`MVVM`模式，但是Vue并没有完全的遵循`MVVM`模式，因为`MVVM`模式要求`Model`层和`View`层完全进行解耦，但是由于Vue还提供了ref这样的API，使得`Model`也可以直接操作`View`。