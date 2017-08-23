;
(function(Vue, window, Todo) {
  const app = new Vue({
    el: '#app',
    data: {
      seen: true,
      todos: Todo.getAll(),
      currentEdit: null,
      routerPath: '',
      filterTodos: []
    },
    methods: {
      addTodo(e) {
        const title = e.target.value.trim(),
          todos = this.todos,
          lastItem = todos[todos.length - 1];
        if (title.length === 0) return;
        todos.push({
          id: lastItem ? lastItem.id + 1 : 1,
          title,
          done: false
        })
        e.target.value = '';
        // console.log('addTodo执行了');
      },
      toggleAll(e) {
        const checked = e.target.checked;
        this.todos.forEach(t => t.done = checked);
      },
      removeTodo(id) {
        const todos = this.todos;
        const removedIndex = todos.findIndex(t => t.id === id);
        removedIndex !== -1 && todos.splice(removedIndex, 1);
      },
      getEditting(todo) {
        this.currentEdit = todo;
      },
      editTodo(todo, e) {
        todo.title = e.target.value;
        this.cancelEdit();
      },
      cancelEdit() {
        this.currentEdit = null;
      },
      clearAllDone() {
        const todos = this.todos;
        let len = todos.length;
        for (let i = 0; i < len; i++) {
          todos[i].done && (todos.splice(i, 1), i--, len--);
        }
      },
      handleClick(e) {

      }
    },
    directives: {
      focus: {
        inserted(el, binding) {
          el.focus();
        }
      },
      todoFocus: {
        update(el, binding) {
          if (binding.value) {
            el.focus();
          }
        }
      },
      'my-show': {
        bind(el, binding) {
          el.style.display = binding.value ? 'block' : 'none';
        },
        update(el, binding) {
          el.style.display = binding.value ? 'block' : 'none';
        }
      },
      'my-on': {
        bind(el, binding) {
          el[`on${binding.arg}`] = binding.value;
        }
      }
    },
    watch: {
      todos: {
        handler() {
          Todo.save(this.todos);
          getFilterTodosByHash();
        },
        deep: true
      }
    },
    computed: {
      remaningCount() {
        return this.todos.filter(t => !t.done).length
      },
      hasDone() {
        return this.todos.some(t => t.done)
      }
    }
  });

  function getFilterTodosByHash() {
    const hash = window.location.hash.substr(1);
    app.routerPath = hash
    switch (hash) {
      case '/active':
        app.filterTodos = app.todos.filter(t => !t.done)
        break
      case '/completed':
        // 显示所有 done 为 true 的 todos
        app.filterTodos = app.todos.filter(t => t.done)
        break
      default:
        app.routerPath = '/'
        app.filterTodos = app.todos
        break
    }
  }
  window.onhashchange = getFilterTodosByHash;

  // 所以当页面初始化的时候，手动的调用一次
  getFilterTodosByHash();
})(Vue, window, Todo);