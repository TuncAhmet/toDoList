let toDoList = []

if ( localStorage.getItem("toDoList") != null ) {
    toDoList = JSON.parse( localStorage.getItem("toDoList") )
}

const taskInput = document.getElementById("txtTaskName")
const btnClear = document.querySelector("#btnClear")
const filters = document.querySelectorAll(".filters span")
let editId;
let isEditMode = false



displayTasks("all")

function displayTasks(filter) {
    let ul = document.getElementById("task-list")
    ul.innerHTML = ""

    if (toDoList.length == 0) {
        ul.innerHTML = "<p class='p-3'>Your Task List is Empty</p>"
    } else {
        for (let toDo of toDoList) {

            let completed = toDo.status == "completed" ? "checked": "";
            if (filter == toDo.status || filter == "all" ) {
                let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick="editStatus(this)" id="${toDo.id}" class="form-check-input" ${completed}>
                    <label for="${toDo.id}" class="form-check-label ${completed}">${toDo.dutyName}</label>
                </div>
                <div class="dropdown">
                    <a class="btn btn-link dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                     <i class="fa-solid fa-ellipsis"></i>
                    </a>
    
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a onclick="deleteTask(${toDo.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Delete</a></li>
                        <li><a onclick="editTask(${toDo.id}, '${toDo.dutyName}')" class="dropdown-item" href="#"><i class="fa-solid fa-pen-to-square"></i> Edit</a></li>
                    </ul>
                </div>
            </li>
        `
            ul.insertAdjacentHTML("beforeend",li)
            }
            
        }
    }
}

for(let span of filters) {
    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    })
}

function editStatus(checkbox) {
    let label = checkbox.nextElementSibling
    let status;
    if(checkbox.checked) {
        label.classList.add("checked")
        status = "completed"
    } else {
        label.classList.remove("checked")
        status = "incompleted"
    }

    for (let task of toDoList) {
        if(task.id == checkbox.id) {
            task.status = status
        }
    }

    displayTasks(document.querySelector("span.active").id) 
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
}


document.getElementById("btnAddNewTask").addEventListener("click",newTask)
document.getElementById("btnAddNewTask").addEventListener("keypress", function(keyboardEvent) {
    if (keyboardEvent == "Enter") {
        document.getElementById("btnAddNewTask").click()
    }
})

function newTask() {
    // console.log(taskInput.value)
    if (taskInput.value == "") {
        alert("please, enter something mindful!")
    } else {
        if(!(isEditMode)) {
            // pushing
            toDoList.push({
                "id": toDoList.length + 1,
                "dutyName": taskInput.value,
                "status" : "incompleted"
            })
        } else {
            //editing
            for (let task of toDoList) {
                if (task.id == editId) {
                    task.dutyName = taskInput.value
                }
            }
            isEditMode = false
        }

        
        taskInput.value = ""
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
    }

    event.preventDefault()
}

function deleteTask(id) {
    // console.log(id)
    let deletedId;
    deletedId = toDoList.findIndex(function(task) {
        return task.id == id;
    })
    toDoList.splice(deletedId,1)

    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("toDoList", JSON.stringify(toDoList));

    // for (let index in toDoList) {
    //     if(toDoList[index].id == id) {
    //         deletedId = index
    //     }
    // }

 

    // console.log(deletedId)

}

function editTask(taskId, taskName) {
    editId = taskId
    isEditMode = true
    taskInput.value = taskName
    taskInput.focus()
}

btnClear.addEventListener("click",function() {
    toDoList.splice(0,toDoList.length)
    displayTasks(document.querySelector("span.active").id)
    localStorage.setItem("toDoList", JSON.stringify(toDoList));

})