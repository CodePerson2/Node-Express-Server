var card = document.getElementById("card");
var info = document.getElementById("info");
var blur = document.getElementById("blur");

var card2 = document.getElementById("card2");
var info2 = document.getElementById("info2");
var blur2 = document.getElementById("blur2");

var card3 = document.getElementById("card3");
var info3 = document.getElementById("info3");
var blur3 = document.getElementById("blur3");

window.addEventListener("scroll", function () {
  if (
    0 < card.getBoundingClientRect().top &&
    card.getBoundingClientRect().top < card.getBoundingClientRect().height
  ) {
    blur.style.opacity = "1";
    blur.style.transition = "ease-in-out 0.8s";

    info.style.opacity = "1";
    info.style.transition = "ease-in-out 0.8s";
  } else {
    blur.style.opacity = "0";

    info.style.opacity = "0";
  }

  if (
    0 < card2.getBoundingClientRect().top &&
    card2.getBoundingClientRect().top < card2.getBoundingClientRect().height
  ) {
    blur2.style.opacity = "1";
    blur2.style.transition = "ease-in-out 0.8s";

    info2.style.opacity = "1";
    info2.style.transition = "ease-in-out 0.8s";
  } else {
    blur2.style.opacity = "0";

    info2.style.opacity = "0";
  }

  if (
    0 < card3.getBoundingClientRect().top &&
    card3.getBoundingClientRect().top < card3.getBoundingClientRect().height
  ) {
    blur3.style.opacity = "1";
    blur3.style.transition = "ease-in-out 0.8s";

    info3.style.opacity = "1";
    info3.style.transition = "ease-in-out 0.8s";
  } else {
    blur3.style.opacity = "0";

    info3.style.opacity = "0";
  }
});

function launchMonkeyGame() {
  window.location.href = "/Monkey/Monkey.html";
}
function linkPixelGame() {
  window.location.href =
    "https://play.google.com/store/apps/details?id=com.MattiasStroman.PixelPlane";
}
function launchMessenger() {
    window.location.href = "https://" + window.location.hostname + ":2000";
}
