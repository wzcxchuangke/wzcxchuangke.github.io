var canvas = document.getElementById("CAN");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var BALLS = Density(.1);
var Radius = 2;
var MaxVelocity = 2;
var maxLineLength = 100;
const LinienLimit = Infinity;
const MouseVeranstaltung = false;
var Color = "#ffffff";
var RadnomZahlTF = true;
var BackgroundImgDir = "";
var LinienAnzahl = 0;
var particles = [];
var MousePos = {
    X: undefined,
    Y: undefined
};
var FPSConterAnAus = false;
var TimeThen = Date.now();
var DeltaTime = 1;
var FPSDisplay = document.getElementById("FPSCounter");
var LineColor = "rgba(255, 255, 255, .4)";

ctx.strokeStyle = LineColor;
var tpBorder = {
    x: canvas.width + maxLineLength,
    y: canvas.height + maxLineLength
}

//#endregion

//#region Wallpaper Stuff

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        if (properties.ballcolor) {
            // Convert the custom color to 0 - 255 range for CSS usage
            var customColor = properties.ballcolor.value.split(' ');
            customColor = customColor.map(c => {
                return Math.ceil(c * 255);
            });
            var ColorPallet = 'rgb(' + customColor + ')';
            Color = ColorPallet;
            // Do something useful with the value here or assign it to a global variable
        }
        if (properties.ballsize) {
            Radius = properties.ballsize.value;
            // console.log(Radius);
        }
        if (properties.ballquantity) {
            BALLS = properties.ballquantity.value;
            if (particles.length < BALLS) {
                while (particles.length < BALLS) {
                    let X = RandomZahlBetwen(Radius, window.innerWidth - Radius);
                    let Y = RandomZahlBetwen(Radius, window.innerHeight - Radius);
                    let VX = (Math.random() - 0.5) * MaxVelocity;
                    let VY = (Math.random() - 0.5) * MaxVelocity;
                    particles.push(new Particle(X, Y, Radius, VX, VY, particles.length, Color));
                }
            } else {
                while (particles.length > BALLS) {
                    particles.pop();
                }
            }
        }
        if (properties.linelength) {
            maxLineLength = properties.linelength.value * window.innerWidth;
            tpBorder = {
                x: canvas.width + maxLineLength,
                y: canvas.height + maxLineLength
            }
        }
        if (properties.randomsize) {
            RadnomZahlTF = properties.randomsize.value;
        }
        if (properties.fpscounter) {
            if (properties.fpscounter.value) {
                FPSConterAnAus = true;
            } else {
                FPSConterAnAus = false;
                FPSDisplay.innerText = "";
            }
        }
        if (properties.backgroundcolor) {            
            let customColor = properties.backgroundcolor.value.split(' ');
            customColor = customColor.map(c => {
                return Math.ceil(c * 255);
            });
            let C = 'rgb(' + customColor + ')';
            // canvas.style.backgroundColor = C;
            document.getElementById("BackgroundColor").style.backgroundColor = C;
        }
        if (properties.backgroundimage) {
            if (properties.backgroundimage.value != "") {
                BackgroundImgDir = 'file:///' + properties.backgroundimage.value;
                console.log(BackgroundImgDir);
                document.getElementById("BackgroundImg").src = BackgroundImgDir;
                document.getElementById("BackgroundImg").style.visibility = "visible";
            } else {
                document.getElementById("BackgroundImg").style.visibility = "hidden";
            }
        }
        if (properties.linecolor) {
            let customColor = properties.linecolor.value.split(' ');
            customColor = customColor.map(c => {
                return Math.ceil(c * 255);
            });
            let C = 'rgba(' + customColor + ', .4)';
            LineColor = C;
            ctx.strokeStyle = LineColor;
        }
        if (properties.maxvelocity) {
            for (let index = 0; index < particles.length; index++) {
                particles[index].ValX = (Math.random() - .5) * properties.maxvelocity.value;
                particles[index].ValY = (Math.random() - .5) * properties.maxvelocity.value;
            }
        }
    },
};

//#endregion

//#region Other functions

function Density(Density) {
    let x = window.innerWidth;
    let y = window.innerHeight;
    x /= 10;
    y /= 10;
    x *= Density;
    y *= Density;
    let xy = x * y;
    xy = Math.round(xy);
    // console.log(xy);
    return xy;
}

function FPSCounter() {
    let TimeNow = Date.now();
    let x = TimeNow - TimeThen;
    x /= 1000;
    x = 1 / x;
    TimeThen = Date.now();
    x = Math.round(x);
    DeltaTime = 1 / x;
    console.log(DeltaTime);
    if (FPSConterAnAus) {
        FPSDisplay.innerHTML = x;
    } else {
        FPSDisplay.innerHTML = "";
    }
}

function RandomZahlBetwen(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Round(KommaStellen, int) {
    let x = int * KommaStellen;
    x = Math.round(x);
    return x / KommaStellen;
}

function Abstand(X1, Y1, X2, Y2) {
    let TotalX = X1 - X2;
    let TotalY = Y1 - Y2;
    return Math.sqrt(Math.pow(TotalX, 2) + Math.pow(TotalY, 2));
}

function Clamp(min, max, int) {
    if (int > max) {
        return max;
    }
    if (int < min) {
        return min;
    }
    return int;
}

function ForceField(XBall, YBall, X2, Y2) {
    let VectorLaenge = Abstand(XBall, YBall, X2, Y2);
    let Total = {
        X: XBall - X2,
        Y: YBall - Y2
    }
    Total.X /= VectorLaenge;
    Total.Y /= VectorLaenge;
    // console.log(Total);
    return Total
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("mouseout", function () {
    MousePos.X = undefined;
    MousePos.Y = undefined;
});

window.addEventListener("mousemove", function (event) {
    MousePos.X = event.x;
    MousePos.Y = event.y;
});

//#endregion

//#region Main

function Particle(StartX, StartY, R, VelocityX, VelocityY, I, C, LineArry = []) {

    this.X = StartX;
    this.Y = StartY;
    this.R = R;
    this.ValX = VelocityX;
    this.ValY = VelocityY;
    this.StartValX = VelocityX;
    this.StartValY = VelocityY;
    this.Index = I;
    this.Color = C;
    this.LinesTo = LineArry;
    this.RandomZahl = Round(100, Math.random() + .7);

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.R, 0, Math.PI * 2, false);
        ctx.fillStyle = this.Color;
        ctx.fill();
    }

    this.drawLine = function () {
        this.X += this.ValX * Clamp(1, 100, DeltaTime * 100); // next position
        this.Y += this.ValY * Clamp(1, 100, DeltaTime * 100);

        for (let index = 0; index < particles.length; index++) {

            if (LinienAnzahl < LinienLimit && this.Index != index) {

                if (this.LinesTo[index] != index) {

                    const lineLength = Abstand(particles[index].X, particles[index].Y, this.X, this.Y);

                    if (lineLength < maxLineLength) {

                        particles[index].LinesTo[this.Index] = this.Index;
                        ctx.beginPath();
                        ctx.moveTo(this.X, this.Y);
                        ctx.lineTo(particles[index].X, particles[index].Y);
                        ctx.lineWidth = Clamp(0, 5, maxLineLength / lineLength);
                        ctx.stroke();
                        LinienAnzahl++;
                    }
                }
            }
        }
    }

    this.update = function () {
        this.Color = Color;
        if (RadnomZahlTF == true) {
            this.R = (Radius * this.RandomZahl);
        } else {
            this.R = Radius;
        }

        if (this.X > this.R + tpBorder.x || this.X < 0 - this.R - maxLineLength) {
            if (this.ValX > 0) {
                this.X = 0 - maxLineLength;
            } else {
                this.X = tpBorder.x;
            }
        }
        if (this.Y > this.R + tpBorder.y || this.Y < 0 - this.R - maxLineLength) {
            if (this.ValY > 0) {
                this.Y = 0 - maxLineLength;
            } else {
                this.Y = tpBorder.y;
            }
        }
        this.draw();
    }

}

//#endregion

//#region Animate

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let index = 0; index < particles.length; index++) {
        particles[index].drawLine();
    }
    for (let index = 0; index < particles.length; index++) {
        particles[index].update();
    }
    for (let index = 0; index < particles.length; index++) {
        particles[index].LinesTo = [];
    }
    LinienAnzahl = 0;
    // console.log(LinienAnzahl);
    FPSCounter();
}

function CreateBalls() {
    for (let index = 0; index < BALLS; index++) {
        let X = RandomZahlBetwen(Radius, window.innerWidth - Radius);
        let Y = RandomZahlBetwen(Radius, window.innerHeight - Radius);
        // let r = RandomZahlBetwen(1, Radius);
        let VX = (Math.random() - 0.5) * MaxVelocity;
        let VY = (Math.random() - 0.5) * MaxVelocity;
        particles.push(new Particle(X, Y, Radius, VX, VY, index, Color));
    }
}
CreateBalls();
animate();

//#endregion