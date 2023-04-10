import './index.html';
import './index.scss';


let input = document.querySelector('.js_input');
let tasksContainer = document.querySelector('.js_tasks-container');
let arrayOfTasks = [];

if(window.localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"))
}

initApp();

function initApp() {
    getTaskFromLocalStorage();
    addTaskAndCleanInput();
    countTasksLeft();
    clearComplated();
    tasksSort();
}


function addTaskAndCleanInput() {
    input.addEventListener('keypress', function (e) {
        if (input.value !== '' && e.key === 'Enter') {
            e.preventDefault();
            addTaskToArray(input.value);
            input.value = '';
        }
    })
}

function addTaskToArray(taskText) {
    const task = {
        id: Date.now(),
        text: taskText,
        complated: false,
    };
    arrayOfTasks.push(task);
    addTaskToPage(arrayOfTasks);
    addTaskToLocalStorage(arrayOfTasks);
    countTasksLeft();
    tasksSort();
}

function addTaskToPage(arrayOfTasks) {
    tasksContainer.innerHTML = '';

    arrayOfTasks.forEach((task) => {
        let label = document.createElement('label');
        label.className = task.complated === true ? "main_task js_task checked" : "main_task js_task";
        label.setAttribute('data-id', task.id);
        let input = document.createElement('input');
        input.className = "main_task-input js_add-checked";
        input.type = "checkbox";
        label.appendChild(input);
        let icon = document.createElement('span');
        icon.className = "main_task-icon";
        label.appendChild(icon);
        let text = document.createElement('span');
        let taskText = document.createTextNode(task.text);
        text.className = "main_task-text";
        text.appendChild(taskText);
        label.appendChild(text);
        let deleteBtn = document.createElement('button');
        deleteBtn.className = "main_task-delete js_delete-task";
        label.appendChild(deleteBtn);
        tasksContainer.appendChild(label);
    })
}

function addTaskToLocalStorage(arrayOfTasks) {
    window.localStorage.setItem('tasks', JSON.stringify(arrayOfTasks))
}

function getTaskFromLocalStorage() {
    let data = window.localStorage.getItem('tasks');
    if(data) {
        let tasks = JSON.parse(data);
        addTaskToPage(tasks);
    }
}

tasksContainer.onclick = ((e) => {
    if (e.target.classList.contains("js_delete-task")) {
        e.target.parentElement.remove();
        deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
    }
    if (e.target.classList.contains("js_add-checked")) {
        e.target.parentElement.classList.toggle('checked');
        updateTaskInLocalStorage(e.target.parentElement.getAttribute("data-id"));
    }
    countTasksLeft();
})

function deleteTaskFromLocalStorage(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id !== +taskId);
    addTaskToLocalStorage(arrayOfTasks);
}

function updateTaskInLocalStorage(taskId) {
    arrayOfTasks.forEach((task) => {
        if(task.id === +taskId) {
            task.complated = !task.complated;
        }
    })
    addTaskToLocalStorage(arrayOfTasks);
}


function countTasksLeft() {
    arrayOfTasks.forEach((task) => {
        let arrayOfLeftTasks = arrayOfTasks.filter((task) => task.complated === false);
        let taskNumbers = arrayOfLeftTasks.length ;
        let tasksLeft = document.querySelector('.js_task-left span');
        tasksLeft.innerHTML = taskNumbers > 0 ? taskNumbers : 0 
    })
}

function clearComplated() {
    document.querySelector('.js_reset-tasks').addEventListener('click', function (e) {
        e.preventDefault();
        const taskDivs = document.querySelectorAll('.js_task.checked');
        taskDivs.forEach((item) => {
            item.remove();
            deleteTaskFromLocalStorage(item.getAttribute('data-id'))
        })
        countTasksLeft();
    })
}

function tasksSort() {
    const tabLinks = document.querySelectorAll('.js_show-tasks');
    const tabTasks = document.querySelectorAll('.js_task');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(tabLink => {
                tabLink.classList.remove('active');
            })
            link.classList.add('active');

            const dataId = link.getAttribute('data-id');
            tabTasks.forEach(task => {
              const isChecked = task.classList.contains('checked');
              if (dataId === 'active') {
                if (!isChecked) {
                  task.classList.remove('hide');
                } else {
                  task.classList.add('hide');
                }
              } else if (dataId === 'completed') {
                if (isChecked) {
                  task.classList.remove('hide');
                } else {
                  task.classList.add('hide');
                }
              } else {
                task.classList.remove('hide');
              }
            });
        })
    })
}