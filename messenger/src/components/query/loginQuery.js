export const signInQuery = (username, password, setLogIn, makeNotification) => {
  querySignIn(username, password, setLogIn, makeNotification);
};

export const signUpQuery = (
  username,
  password1,
  password2,
  makeNotification
) => {
  if (password1 !== password2) {
    makeNotification("Passwords dont Match");
    return;
  } else if (password1.length < 6) {
    makeNotification("Password Must Be Atlest 6 Characters");
    return;
  }

  querySignUp(username, password1, password2, makeNotification);
};

const querySignIn = (username, password, setLogIn, makeNotification) => {
  const sign =  new Promise((res, rej) => {
    sendLogin("/login/", res, {
      username: username,
      password: password,
    });
  })
  sign.then((res) => {
    if (res.success === 1) {
      setLogIn(res.userID, res.token, res.username);
    } else {
      makeNotification(res.response);
      return;
    }
  });
};

const querySignUp = (username, password1, password2, makeNotification) => {
  const sign =  new Promise((res, rej) => {
    sendLogin("/signup/", res, {
      username: username,
      password1: password1,
      password2: password2,
    })
  })
  sign.then((res) => {
    if (res.success === 1) {
      makeNotification(res.response);
    } else {
      makeNotification(res.response);
      return;
    }
  });
};

function sendLogin(queryLocation, res, info) {
  var xhttp;
  var loc = queryLocation;

  info = JSON.stringify(info);

  xhttp = new XMLHttpRequest();
  xhttp.open("POST", loc, true);
  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var resp = JSON.parse(this.responseText);
      res(resp);
    }
  };

  xhttp.send(info);
}
