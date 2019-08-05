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