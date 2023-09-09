var clouds = [document.getElementById("cloud0"),document.getElementById("cloud1"),document.getElementById("cloud2"),document.getElementById("cloud3")];
var colors = ["#5375a0","#374e6b","#1b2735","#000","#7c766b","#8a8181","#978c97","#a598ad"];
var moon = document.getElementById("moon");
var doit = true;
var nightend = 6;
var nightstart = 20;
var isitnightyet = true;

function setNight(){
    for(let i = 0; i < clouds.length; i++){
        clouds[i].style.backgroundImage = "url('images/Now/clouds" + i + ".png')";
        clouds[i].style.backgroundColor = colors[i];
    }
    document.body.style.backgroundImage = "url('images/Now/sky.png')";
    document.body.style.backgroundColor = "#000";
    moon.style.backgroundImage = "url('images/Now/moon.png')";
}

function setDay(){
    for(let i = 0; i < clouds.length; i++){
        clouds[i].style.backgroundImage = "url('images/Now/fog" + i + ".png')";
        clouds[i].style.backgroundColor = colors[i + 4];
    }
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#a598ad";
    moon.style.backgroundImage = "url('images/Now/sun.png')";
}

function updateHour() {
    if(doit == true){
        var date = new Date();
        let hour = date.getHours();
        if(hour >= nightstart || hour < nightend){
            if(isitnightyet == false){
                isitnightyet = true;
                setNight();
            }
        } else {
            if(isitnightyet == true){
                isitnightyet = false;
                setDay();
            }
        }
    }
}

var inter = setInterval(updateHour, 10000);