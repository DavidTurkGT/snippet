console.log("Hello there!");

//TODO:Integrate with API to log in and create users
function login() {
  let errors = logInValidationErrors();
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
    let usernameInput = document.querySelector("input[name='username-login']");
    let username = usernameInput.value;

    let passwordInput = document.querySelector("input[name='password-login']");
    let password = passwordInput.value;

    let url = '/api/users/login';
    let request = new Request(url, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: new Headers({
        'Content-Type':'application/json'
      }),
      redirect: 'follow'
    });

    fetch(request)
    .then( (res) => {
      if(res.status !== 200){
        res.json().then( (error) => {
          let msgContainer = document.querySelector(".messages");
          clearChildren(msgContainer);
          let p = document.createElement("p");
          p.textContent = error.msg;
          msgContainer.appendChild(p);
        })
      }
      else{
        window.location.replace("/home");
      }
    })
  }
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
        res.json().then( (errors) => {
          let msgContainer = document.querySelector(".messages");
          clearChildren(msgContainer);
          let p = document.createElement("p");
          p.textContent = errors.msg;
          msgContainer.appendChild(p);
        })
      }
      else{
        res.json()
        .then( (data) => {
          let msgContainer = document.querySelector(".messages");
          let p = document.createElement("p");
          p.textContent = "Created user: " + data.user.username;
          msgContainer.appendChild(p);
        })
      }
    })
  }
};

function signUpValidationErrors() {
  let errMsg = [];

  let usernameInput = document.querySelector('input[name="username-sign-up"]');
  let username = usernameInput.value;
  if(username === ""){
    errMsg.push("Username cannot be blank");
  }

  let passwordInput = document.querySelector('input[name="password-sign-up"]');
  let password = passwordInput.value;
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

function logInValidationErrors() {
  let errMsg = [];

  let usernameInput = document.querySelector('input[name="username-login"]');
  let username = usernameInput.value;
  if(username === ""){
    errMsg.push("Username cannot be blank");
  }

  let passwordInput = document.querySelector('input[name="password-login"]');
  let password = passwordInput.value;
  if(password === "") {
    errMsg.push("Password cannot be blank");
  }

  return errMsg === [] ? null : errMsg;
}

function clearChildren(element){
  while(element.hasChildNodes()){
    element.removeChild(element.lastChild);
  }
}

function createNewUser(){
  let usernameInput = document.querySelector("input[name='username-sign-up']");
  let username = usernameInput.value;
  usernameInput.value = "";

  let passwordInput = document.querySelector("input[name='password-sign-up']");
  let password = passwordInput.value;
  passwordInput.value = "";

  return newUser = {
    username: username,
    password: password
  };
}
