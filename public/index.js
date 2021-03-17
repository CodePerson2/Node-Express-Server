var navbar_bars;
var navbar_x;
var contact__bar;

window.addEventListener('resize', pageLoad);

function pageLoad(){
    navbar_bars = document.getElementById("navbar__bars");
    navbar_x = document.getElementById("navbar__x");
    contact__bar = document.getElementById("contact__bar")

    contact__bar.style.display = "none";

    if(window.innerWidth < 768){
        navbar_bars.style.opacity = 1;
        navbar_x.style.opacity = 0;
    }
    else{
        navbar_x.style.opacity = 0;
        navbar_bars.style.opacity = 0;
    }
}

function bars_to_x(){

    if(navbar_bars.style.opacity == 1){
        navbar_x.style.opacity = 1;
        navbar_bars.style.opacity = 0;
        contact__bar.style.display = "block";
    }
    else if(navbar_x.style.opacity == 1){
        navbar_bars.style.opacity = 1;
        navbar_x.style.opacity = 0;
        contact__bar.style.display = "none";
    }
    
}
