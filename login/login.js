//import { userExists } from "../sqlConnection";

function login()
{
    
    const user = document.getElementById("username").value;
    const pass = document.getElementById("keypass").value;

    if(user === "" || pass === ""){
        alert("Please fill all fields");
        return;
    }
    //add if for user not existing
    /*
    if (userExists(user) == false) {
        alert("user does not exist!");
        return;
    } else { */
        console.log("Entered with username:",user,"and password:",pass);
        window.location.href = ("/home.html");
    //};
}

function signup(){
    const user = document.getElementById("create-username").value;
    const pass = document.getElementById("create-keypass").value;
    const first = document.getElementById("first_name").value;
    const form = document.getElementById("account-type-form");
    const isCustomerChecked = document.getElementById("customer").checked;
    const isSellerChecked = document.getElementById("seller").checked;
    if (!isCustomerChecked && !isSellerChecked) {
    alert("Please select an account type");
    return false;
    console.log("New account created with username:", user, ",password:",pass,",and first name:",first);
    if(user === "" || pass === "" || first === ""){
        alert("Please fill all fields");
        return;
    }
    window.location.href = ("/home.html");
}
}