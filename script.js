

let listItems = document.getElementsByTagName("LI");
let apiKey = "b2eaba-21788d-0b683e-9c3e29-524573";



//A function for toggling 
const toggleListItem = (event) => {

    let currElement = event.target;
    let currId=event.target.getAttribute("data-id");

    if (currElement.getAttribute("class") === "checked") {
        updateEventFromServer(currId,true);
    }
    else {
        updateEventFromServer(currId,false);
    }


    //UPDATE LOCALLY
    if (currElement.getAttribute("class") === "checked") {
        currElement.className = "unchecked";
    }
    else {
        currElement.className = "checked";
    }


}



const deleteEvent = (event) => {
    let currElement = event.target;
    let currId = currElement.parentElement.getAttribute("data-id");

    //delete event from the server

    deleteEventFromServer(currId);

    //location.reload(); //refresh page to reflect change 

    //DELETE ITEM LOCALLY
       currElement.parentElement.remove();
}


const addEvent = (event) => {
    event.preventDefault();
    let newEvent = document.getElementById("add-item-input").value;

    putEvent(newEvent);
    //location.reload(); //refresh page to update the data 





    //UPDATE LOCALLY (used to test out effect)

    ///clear text box
    document.getElementById("add-item-input").value="";



    // //create a new li element 
    // let newItem = document.createElement("LI");
    // newItem.className = "unchecked";
    // let newEventText = document.createTextNode(newEvent);
    // newItem.appendChild(newEventText);

    // //add close button
    // let closeButton = document.createElement("SPAN");
    // closeButton.className = "close-btn";


    // //hook up effects
    // newItem.addEventListener("click",toggleListItem);
    // closeButton.addEventListener("click", deleteEvent);

    // newItem.appendChild(closeButton);

    // //add the li element to the ul 
    // document.getElementById("to-do-list").appendChild(newItem);


}

for (let i = 0; i < listItems.length; i++) {

    //create a close button for each list item
    let closeButton = document.createElement("SPAN");
    closeButton.className = "close-btn";

    //hook up the close button with the delete function
    closeButton.addEventListener("click", deleteEvent);
    listItems[i].appendChild(closeButton);

    //toggle between check and unchecked 
    listItems[i].addEventListener("click", toggleListItem);


}





//retrieve the list of events 
const getAllEventsFromServer = () => {

    fetch('https://cse204.work/todos', {
        method: 'GET',
        headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
        }
    }).then(
        (response) => {
            if (response.status !== 200) {
                console.log("Error! Code: " + response.status);
                return;
            }
            return response.json();
        }
    )
        .then(
            (responseData) => {
                console.log("All data from server: ", responseData);

                //reverse the order so the most recently added appears last 
                Array.prototype.reverse.call(responseData);
                for (const key in responseData) {


                    //render html element 

                    //create a new li element 
                    renderEventItem(responseData, key);
                }
            }
        )

}


const putEvent = (newEvent) => {

    fetch('https://cse204.work/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify({ "text": newEvent })
    }

    ).then(
        (response) => {
            if (response.status !== 200) {
                console.log("Error! Code: " + response.status);
                return;
            }
            return response.json();
        }
    )
        .then(
            (responseData) => {
                console.log(responseData);
                renderEventItem([responseData],0);
                

                

            }
        )
}


const deleteEventFromServer = (eventId) => {
    fetch(`https://cse204.work/todos/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }

    })
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log("Error! Code: " + response.status);
                    return;
                }
                else {
                    console.log("Delete successful");

                }
            }
        )
}


const updateEventFromServer = (eventId, completed) => {

    fetch(`https://cse204.work/todos/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify({ "completed": completed ? false : true })

    })
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log("Error! Code: " + response.status);
                    return;
                }
                else {
                    console.log("Update successful");

                }
            }
        )
}



function renderEventItem(responseData, key) {
    let newItem = document.createElement("LI");
    newItem.className = responseData[key].completed ? "checked" : "unchecked";
    let newEventText = document.createTextNode(responseData[key].text);
    newItem.setAttribute('data-id', responseData[key].id); //add a data attribute to store the id 
    newItem.appendChild(newEventText);

    //add close button
    let closeButton = document.createElement("SPAN");
    closeButton.className = "close-btn";


    //hook up effects
    newItem.addEventListener("click", toggleListItem);
    closeButton.addEventListener("click", deleteEvent);

    newItem.appendChild(closeButton);

    //add the li element to the ul 
    document.getElementById("to-do-list").appendChild(newItem);
}



