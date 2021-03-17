var submit_button;
var notif;

submit_button= document.getElementById("submit_button");
notif = document.getElementById("notif");
submit_button.addEventListener("click", send);

function notification(sent){
    notif.innerHTML = sent.message;
    notif.style.opacity = 1;
    var view = notif.getBoundingClientRect()
    notif.style.top = (-view.top) + "px";
    setTimeout(function() { endNotif(); }, 5000);
    
}

function endNotif(){
    notif.innerHTML = "";
    notif.style.opacity = 0;
    notif.style.top = "-50px";
}

function wipeBoxes(){
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}

function send() 
{
    var xhttp;
    var loc = '/contact-information/';
    var name, email, message;

    name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    message = document.getElementById("message").value;
    info = {name: name, email: email, message: message};

    info = JSON.stringify(info);

    xhttp = new XMLHttpRequest();
    xhttp.open("POST", loc, true);
    xhttp.setRequestHeader("Content-Type", 'application/json'); 

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var res = JSON.parse(this.responseText);
            notification(res);

            if(res.success == 1){
                wipeBoxes();
            }
            
        }


    }

    xhttp.send(info);
}