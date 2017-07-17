console.log("Hello there!");

//TODO:Integrate with API to log in and create users
function login() {
  console.log("You want to log in");
};

function signup() {
  let errors = signUpValidationErrors();
  if(errors.length){
    let msgContainer = document.querySelector(".messages");
    clearChildren(msgContainer);
    errors.forEach( (error) => {
      let p = document.createElement("p");
      p.textContent = error;
      msgContainer.appendChild(p);
    });
  }
  else{
    //TODO sign up a new user
    let newUser = createNewUser();
    let url = '/api/users';
    let request = new Request(url, {
      method: 'POST',
      body: JSON.stringify({
        username: newUser.username,
        password: newUser.password
      }),
      headers: new Headers({
        'Content-Type':'application/json'
      }),
      redirect: 'follow'
    });

    fetch(request)
    .then( (res) => {
      if(res.status !== 200){
        let msgContainer = document.querySelector(".messages");
        let p = document.createElement("p");
        p.textContent = "Error signing up";
        msgContainer.appendChild(p);
      }
      else{
        // window.location.replace()
      }
    })
  }
};

function signUpValidationErrors() {
  let errMsg = [];

  let usernameInput = document.querySelector('input[name="username-sign-up"]');
  let username = usernameInput.value;
  usernameInput.value = "";
  if(username === ""){
    errMsg.push("Username cannot be blank");
  }

  let passwordInput = document.querySelector('input[name="password-sign-up"]');
  let password = passwordInput.value;
  passwordInput.value = "";
  if(password === "") {
    errMsg.push("Password cannot be blank");
  }

  let confirmationInput = document.querySelector('input[name="confirmation"]');
  let confirmation = confirmationInput.value;
  confirmationInput.value = "";
  if(confirmation !== password) {
    errMsg.push("Password and confirmation do not match");
  }

  return errMsg === [] ? null : errMsg;

};

function clearChildren(element){
  while(element.hasChildNodes()){
    element.removeChild(element.lastChild);
  }
}

function createNewUser(){
  let usernameInput = document.querySelector("input[name='username-sign-up']");
  let username = usernameInput.value;

  let passwordInput = document.querySelector("input[name='password-sign-up']");
  let password = passwordInput.value;

  return newUser = {
    username: username,
    password: password
  };
}
