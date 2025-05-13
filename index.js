function createElement(tag, attributes, children, events) {
  const element = document.createElement(tag)

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key])
    })
  }

  if (events) {
    Object.keys(events).forEach((eventName) => {
      element.addEventListener(eventName, events[eventName])
    })
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child))
      } else if (child instanceof HTMLElement) {
        element.appendChild(child)
      }
    })
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children))
  } else if (children instanceof HTMLElement) {
    element.appendChild(children)
  }

  return element
}

class Component {
  constructor() {}

  getDomNode() {
    this._domNode = this.render()
    return this._domNode
  }

  update() {
    const newNode = this.render()
    this._domNode.replaceWith(newNode)
    this._domNode = newNode
  }
}

class AddTask extends Component {
  constructor(onAddTask) {
    super()
    this.onAddTask = onAddTask
    this.state = {
      newTaskText: "",
    }
  }

  onInputChange = (event) => {
    this.state.newTaskText = event.target.value
    // Не вызываем update, так как нам не нужно перерисовывать компонент при изменении текста
  }

  onAdd = () => {
    if (this.state.newTaskText.trim() !== "") {
      this.onAddTask(this.state.newTaskText.trim())
      this.state.newTaskText = ""
      this.update()
    }
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
          "input",
          {
            type: "text",
            placeholder: "Задание",
            value: this.state.newTaskText,
          },
          [],
          { input: this.onInputChange },
      ),
      createElement("button", {}, "+", { click: this.onAdd }),
    ])
  }
}

class Task extends Component {
  constructor(task, index, onToggleComplete, onDeleteTask) {
    super()
    this.task = task
    this.index = index
    this.onToggleComplete = onToggleComplete
    this.onDeleteTask = onDeleteTask
    this.state = {
      deleteConfirmation: false,
    }
  }

  onToggle = () => {
    this.onToggleComplete(this.index)
  }

  onDelete = () => {
    if (this.state.deleteConfirmation) {
      // Если уже было первое нажатие, удаляем задачу
      this.onDeleteTask(this.index)
    } else {
      // Первое нажатие - просто меняем цвет кнопки
      this.state.deleteConfirmation = true
      this.update()
    }
  }

  render() {
    const checkbox = createElement("input", { type: "checkbox" }, [], {
      change: this.onToggle,
    })

    // Устанавливаем свойство checked напрямую
    checkbox.checked = this.task.completed

    const deleteButton = createElement(
        "button",
        {
          style: this.state.deleteConfirmation ? "background-color: #ff3333;" : "background-color: #000000;",
        },
        "🗑",
        { click: this.onDelete },
    )

    return createElement("li", {}, [
      checkbox,
      createElement("label", { class: this.task.completed ? "completed" : "" }, this.task.text),
      deleteButton,
    ])
  }
}

class TodoList extends Component {
  constructor() {
    super()
    this.state = {
      tasks: [
        { text: "Сделать домашку", completed: false },
        { text: "Сделать практику", completed: false },
        { text: "Пойти домой", completed: false },
      ],
    }
  }

  onAddTask = (text) => {
    this.state.tasks.push({
      text: text,
      completed: false,
    })
    this.update()
  }

  onToggleComplete = (index) => {
    this.state.tasks[index].completed = !this.state.tasks[index].completed
    this.update()
  }

  onDeleteTask = (index) => {
    this.state.tasks.splice(index, 1)
    this.update()
  }


  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask(this.onAddTask).getDomNode(),
      createElement(
          "ul",
          { id: "todos" },
          this.state.tasks.map((task, index) =>
              new Task(task, index, this.onToggleComplete, this.onDeleteTask).getDomNode(),
          ),
      ),
    ])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode())
})
