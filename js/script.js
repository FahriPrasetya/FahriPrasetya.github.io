// function ketika membuka browser dan semua element telah termuat
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo()
    })

    const todos = [];
    const RENDER_EVENT = 'render-todo';

    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timesTamp = document.getElementById('date').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const generateID = generateId();
        const todoObject = generateTodoObject(generateID, textTodo, timesTamp, deskripsi, false);
        todos.push(todoObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateTodoObject(id, task, timestamp, deskripsi, isCompleted) {
        return {
            id,
            task,
            timestamp,
            deskripsi,
            isCompleted
        }
    }

    document.addEventListener(RENDER_EVENT, function () {
        console.log(todos);
    })

    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task;

        const textTimeStamp = document.createElement('p');
        textTimeStamp.innerText = todoObject.timestamp;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimeStamp);

        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);
        container.addEventListener('click',function() {
            showNotifDetailTask();
        })



        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', function (event) {
                event.stopPropagation();
                undoTaskFromCompleted(todoObject.id);
            })

            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');

            trashButton.addEventListener('click', function (event) {
                event.stopPropagation();
                removeTaskFromCompleted(todoObject.id);
            })

            container.append(undoButton, trashButton);
        }

        else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');

            checkButton.addEventListener('click', function (event) {
                event.stopPropagation();
                addTaskToCompleted(todoObject.id);
            });

            container.append(checkButton);
        }

        function addTaskToCompleted(todoId) {
            const todoTarget = findTodo(todoId);

            if (todoTarget == null) return;

            todoTarget.isCompleted = true;
            document.dispatchEvent(new Event(RENDER_EVENT));

            saveData();
        }

        function findTodo(todoId) {
            for (const todoItem of todos) {
                if (todoItem.id === todoId) {
                    return todoItem;
                }
            }
            return null;
        }

        function removeTaskFromCompleted(todoId) {
            const todoTarget = findTodoIndex(todoId);

            if (todoTarget === -1) return;

            todos.splice(todoTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));

            saveData();
        }


        function undoTaskFromCompleted(todoId) {
            const todoTarget = findTodo(todoId);

            if (todoTarget == null) return;

            todoTarget.isCompleted = false;
            document.dispatchEvent(new Event(RENDER_EVENT));

            saveData();
        }

        function findTodoIndex(todoId) {
            for (const index in todos) {
                if (todos[index].id === todoId) {
                    return index;
                }
            }

            return -1;
        }

        function showNotifDetailTask() {
            const detailTaskTitle = document.createElement('h2');
            detailTaskTitle.innerText = todoObject.task;

            const hr = document.createElement('hr');

            const detailTaskDeskripsi = document.createElement('p');
            detailTaskDeskripsi.innerText = `Deskripsi : ${todoObject.deskripsi}`;

            const detailTaskStatus = document.createElement('h4');
            if(todoObject.isCompleted) {
                detailTaskStatus.innerHTML = 'Status : <span>Finished</span>';
                detailTaskStatus.classList.add('task-status-finish');
            }
            else {
                detailTaskStatus.innerHTML = 'Status : <span>Not Finished</span>';
                detailTaskStatus.classList.add('task-status-not-finish');
            }

            const detailTaskDeadline = document.createElement('h4');
            detailTaskDeadline.innerText = `DeadLine : ${todoObject.timestamp}`;

            const buttonCloseNotifDetail = document.createElement('button');
            buttonCloseNotifDetail.innerText = 'Close';
            buttonCloseNotifDetail.classList.add('button-close-notif');
            buttonCloseNotifDetail.addEventListener('click',function() {
                fieldDetailTask.style.display = 'none';
            })

            const fieldButtonCloseNotif = document.createElement('div');
            fieldButtonCloseNotif.classList.add('field-button-close-notif');
            fieldButtonCloseNotif.append(buttonCloseNotifDetail);

            const fieldDetailTask = document.createElement('div');
            fieldDetailTask.classList.add('detail-tugas');
            fieldDetailTask.append(detailTaskTitle,hr,detailTaskDeskripsi,detailTaskStatus,detailTaskDeadline,fieldButtonCloseNotif);

            const body = document.body;

            body.append(fieldDetailTask);
        }

        
        return container;
    }

    document.addEventListener(RENDER_EVENT, function () {
        let uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = '';

        let completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerHTML = '';

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) {
                uncompletedTODOList.append(todoElement);
            }
            else {
                completedTODOList.append(todoElement);
            }
        }
    })

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(todos);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    const SAVED_EVENT = 'saved-todo';
    const STORAGE_KEY = 'TODO_APPS';

    function isStorageExist() /* boolean */ {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const todo of data) {
                todos.push(todo);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})
