

// Check if local storage contains any previous todos or else get an empty array
var todosArray = JSON.parse(localStorage.getItem("todolist")) || [];
// Select the unordered list that will contain the to-dos
const todoList = document.querySelector("#todoList");
// Print in the console the todosArray
console.log(todosArray);
// Counter for the to-do items. Get the maximum id so that the next task gets the following number
var counter = todosArray.length > 0 ? Math.max(...todosArray.map(todo => todo.id)): 0;
// console.log(counter);
const todoCatChoice = document.querySelector("#todo-category");
var todoCategory = 0;
todoCatChoice.addEventListener('change', function() {
    console.log('You selected: ', todoCatChoice.value);
    todoCategory = todoCatChoice.value;
});


// When the window opens, present all the to-dos
window.addEventListener('load', () => {
    showTodos();
    // Show Sort by radio buttons, when to-dos exist
    if(counter>0){
        document.querySelector("#sortform").style.display = "block";
    }
    else {
        document.querySelector("#sortform").style.display = "none";
    }
    alertsToday();
})

// Function called when "Add To-Do" button is pressed
document.querySelector("#submit").addEventListener("click", () => {
    // Get the new todo text from input box
    const todoItem = document.querySelector("#todoText");
    // Get the to-do text
    const todoText = todoItem.value.trim();
    if (todoText == "") {
        // If it is empty, alert the user
        alert("You can't have an empty to-do.")
    }
    else {
        // Call the function to create the new to-do item
        createTodo(todoItem);
        todoItem.value = "";
    }
})

// Function called when Radio buttons are pressed
document.querySelector("#sortform").addEventListener("click", () => {
    // Update the view based on the new sorting/ordering values
    showTodos();
})


// Function called when "Remove All To-Dos" button is pressed
document.querySelector("#removeAll").addEventListener("click", () => {
    // Remove all to-dos
    removeAllTodos();
})

// Function used to create new to-do items
function createTodo(todoItem) {
    // Increase the counter by 1
    counter++;
    // Get the due date
    const tmpduedate = document.querySelector("#duedate").valueAsNumber;
    // Check if the duedate is not filled and if not, set the due date to 1 year by now.
    var tmpduedate2;
    if(tmpduedate){
        tmpduedate2 = tmpduedate;
    }
    else{
        const curDate = new Date;
        tmpduedate2 = curDate.setFullYear(curDate.getFullYear() + 1)
    }
    const duedate = convertDate(tmpduedate2);

    // Identify the to-do category
    
    console.log(`todoCategory:${todoCategory}`);
    switch (todoCategory){
        case "1":
            todoCat = "Business";
            break;
        case "2":
            todoCat = "Activities";
            break;
        case "3":
            todoCat = "Health";
            break;
        case "4":
            todoCat = "Other";
            break;
        default:
            todoCat = "Personal";
    }
    console.log(todoCat);
    // Create a todo object with attributes
    const todo = {
        id: counter,
        date: convertDate(Date.now()),
        dueDate: duedate,
        text: todoItem.value.trim(),
        category: todoCat,
        completed: false
    };

    // Save the new todo in the array
    todosArray.push(todo);
    // Save the todosArray to the local storage
    updateLocalStorage(todosArray);
}

function sortArray(array) {
    // Get the sorting type
    const sortBy = document.querySelector("input[name=sorting]:checked");
    const sortByValue = sortBy.value;
    // Get the ascending or descending order
    const orderBy = document.querySelector("input[name=order]:checked");
    const orderByValue = orderBy.value;
    // Initialize a new array, which will be the sorted array
    var sortedArray;
    
    if(sortByValue == 1){
        // Sort by due date
        if(orderByValue == 0){
            // Ascending order
            //sortedArray = array.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
            sortedArray = array.sort((a,b) => a.dueDate.localeCompare(b.dueDate));
        }
        else {
            // Descending order
            //sortedArray = array.sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
            sortedArray = array.sort((a,b) => b.dueDate.localeCompare(a.dueDate));
        }
    }
    else if(sortByValue == 2) {
        // Sort by Completion Status
        if(orderByValue == 0){
            // Ascending order
            sortedArray = array.sort(function(a,b) {
                // Order by completion status
                var orderCompl = Boolean(a.completed) - Boolean(b.completed);
                var orderId = a.id - b.id;
                return orderCompl || orderId;
            });
        }
        else {
            // Descending order
            sortedArray = array.sort(function(a,b) {
                // Order by completion status
                var orderCompl = Boolean(b.completed) - Boolean(a.completed);
                var orderId = b.id - a.id;
                return orderCompl || orderId;
            });
        }
    }
    else {
        // Sort by Creation Date
        if(orderByValue == 0){
            // Ascending order
            sortedArray = array.sort((a,b) => a.id - b.id);
        }
        else {
            // Descending order
            sortedArray = array.sort((a,b) => b.id - a.id);
        }
    }
    return sortedArray;
}


// Function to display the todos
function showTodos() {
    // Clear the unordered list
    todoList.innerHTML = '';

    const displayTodosArray = sortArray(todosArray);
    // Iterate over the todos and add them to a list
    displayTodosArray.forEach(todo => {
        // Create a new list item
        const listItem = document.createElement("div");
        // Check if todo is completed
        const todoCompletedInitial = todo.completed;
        var todoCompleted = null;
        listItem.setAttribute("class", "todo");
        if (todo.completed == true ){
            listItem.classList.add('checked');
            todoCompleted = 'checked'
        }
        listItem.innerHTML = `
            <div>
            <input type="text" class="show-category" id="show-category" value="Category: ${todo.category}" readonly/>
            <br>
            <input type="checkbox" class="checkbox" id="checkbox" ${todoCompleted}/>
            <input type="text" id="todoText" class="todoText" value="${todo.text}" readonly/>
            <button class="editButton">Edit</button>
            <button class="deleteButton">Delete</button>
            <br>
            <input type="text" class="dates" id="dates" value="Created at: ${todo.date}, Due date: ${todo.dueDate}" readonly/>
            </div>
        `
        todoList.append(listItem);
    

        // Delete todo
        const deleteButton = listItem.querySelector(".deleteButton");
        // Define what happens when delete button is pressed
        deleteButton.addEventListener("click", () => {
            // Keep all the todos except for the one that needs to be deleted
            todosArray = todosArray.filter(item => item.id != todo.id);
            // Update local storage
            updateLocalStorage(todosArray);
        });

        // Edit todo
        const editButton = listItem.querySelector(".editButton");
        // Define what happens when edit button is pressed
        editButton.addEventListener("click", () => {
            // Get the text for the todo that needs to be edited
			const input = listItem.querySelector('#todoText');
            // Make it writeable
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
                // Update the text
				todo.text = e.target.value;
                // Update local storage
				updateLocalStorage(todosArray);
			});
        });

        // Check Todo
        const checkBox = listItem.querySelector("#checkbox");
        // // Modify the completion status when checkbox is checked
        checkBox.addEventListener("change", (e) => {
            const initCompleted = todo.completed;
            if(initCompleted == false){
                todo.completed = true;
                listItem.classList.add('checked');
            }
            else{
                todo.completed = false;
                listItem.classList.remove('checked');
            }
            updateLocalStorage(todosArray);
        });

        // Show Sort by radio buttons, when to-dos exist
        if(counter>0){
            document.querySelector("#sortform").style.display = "block";
        }
        else {
            document.querySelector("#sortform").style.display = "none";
        }

    });
}

function alertsToday(){
    // Set reminder if today is the due date
    // Get today date
    const today = convertDate(new Date());
    todosArray.forEach(todo => {
        if(todo.dueDate != ''){
            if(todo.dueDate == today){
                const strAlert = `To-Do "${todo.text}" is due today.`;
                alert(strAlert);
            }
        }
    });
}

function updateLocalStorage(todosArray) {
    // Save the todosArray to the local storage
    localStorage.setItem("todolist", JSON.stringify(todosArray));
    showTodos();
}

function removeAllTodos() {
    localStorage.setItem("todolist", JSON.stringify([]));
    todosArray = [];
    todoList.innerHTML = '';
    counter = 0;
    document.querySelector("#sortform").style.display = "none";
}

function convertDate(dateInit){
    // Function to get dates at the desired format
    const date = new Date(dateInit);
    const dateYear = date.getFullYear();
    const dateMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const dateDay = date.getDate().toString().padStart(2, "0");
    const dateDateStr = `${dateYear}${dateMonth}${dateDay}`;
    return dateDateStr;
}

