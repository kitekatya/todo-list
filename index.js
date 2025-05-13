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

class TodoList extends Component {
  constructor() {
    super()
    this.state = {
      tasks: [
        { text: "Сделать домашку", completed: false },
        { text: "Сделать практику", completed: false },
        { text: "Пойти домой", completed: false },
      ],
      newTaskText: "",
    }
  }

  onAddInputChange = (event) => {
    this.state.newTaskText = event.target.value
  }

  onAddTask = () => {
    if (this.state.newTaskText.trim() !== "") {
      this.state.tasks.push({
        text: this.state.newTaskText.trim(),
        completed: false,
      })
      this.state.newTaskText = ""
      this.update()
    }
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
      createElement("div", { class: "add-todo" }, [
        createElement(
            "input",
            {
              id: "new-todo",
              type: "text",
              placeholder: "Задание",
              value: this.state.newTaskText,
            },
            [],
            { input: this.onAddInputChange },
        ),
        createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask }),
      ]),
      createElement(
          "ul",
          { id: "todos" },
          this.state.tasks.map((task, index) => {
            const checkbox = createElement("input", { type: "checkbox" }, [], {
              change: () => this.onToggleComplete(index),
            })

            // Set the checked property directly
            checkbox.checked = task.completed

            return createElement("li", {}, [
              checkbox,
              createElement("label", { class: task.completed ? "completed" : "" }, task.text),
              createElement("button", {}, "🗑️", {
                click: () => this.onDeleteTask(index),
              }),
            ])
          }),
      ),
    ])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode())
})
