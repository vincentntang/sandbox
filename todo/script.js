// MODEL
var todoList = {
  todos: [{ todoText: "first item", completed: false }],
  addTodo: function(todo) {
    this.todos.push({
      todoText: todo,
      completed: false
    });
  },
  changeTodo: function(position, newValue) {
    this.todos[position].todoText = newValue;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function(position) {
    let todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    let completedTodos = 0;
    let totalTodos = this.todos.length;
    // Loop array contents [{}, {}, {}]
    for (let i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed === true) {
        completedTodos++;
      }
    }
    // If true, make false
    if (completedTodos === totalTodos) {
      for (let i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else {
      // else make all true
      for (let i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
  }
};

// CONTROLLERS
var handlers = {
  addTodo: function() {
    var addTodoInput = document.getElementById("addTodoInput");
    todoList.addTodo(addTodoInput.value);
    addTodoInput.value = "";
    view.displayTodo();
  },
  changeTodo: function() {
    var changeTodoPositionInput = document.getElementById(
      "changeTodoPositionInput"
    );
    var changeTodoInput = document.getElementById("changeTodoInput");
    todoList.changeTodo(
      changeTodoPositionInput.valueAsNumber,
      changeTodoInput.value
    );
    changeTodoPositionInput.value = "";
    changeTodoInput.value = "";
    view.displayTodo();
  },
  deleteTodo: function() {
    var deleteTodoPositionInput = document.getElementById(
      "deleteTodoPositionInput"
    );
    todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
    deleteTodoPositionInput.value = "";
    view.displayTodo();
  },
  toggleCompleted: function() {
    var toggleCompletedPositionInput = document.getElementById(
      "toggleCompletedPositionInput"
    );
    todoList.toggleCompleted(toggleCompletedPositionInput.value);
    toggleCompletedPositionInput.value = "";
    view.displayTodo();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodo();
  }
};

// VIEW
var view = {
  displayTodo: function() {
    var todoUl = document.querySelector("ul");
    todoUl.innerHTML = "";

    // Output HTML List with (x) or ( ) and respective text
    for (var i = 0; i < todoList.todos.length; i++) {
      var todoLi = document.createElement("li");
      var todoTextWithCompletion = "";
      var todo = todoList.todos[i];

      if (todo.completed === true) {
        todoTextWithCompletion = "(x)" + todo.todoText;
      } else {
        todoTextWithCompletion = "( )" + todo.todoText;
      }
      todoLi.textContent = todoTextWithCompletion;
      todoUl.appendChild(todoLi);
    }
  }
};
