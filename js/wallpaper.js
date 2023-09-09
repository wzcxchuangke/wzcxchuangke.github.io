window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.dorealtime) {
            doit = properties.dorealtime.value;
        }
        if (properties.nightbegin) {
            nightstart = properties.nightbegin.value;
        }
        if (properties.whenshouldthenightend) {
            nightend = properties.whenshouldthenightend.value;
        }
        if (properties.timeofday) {
            if(properties.timeofday.value == "night"){
                if(isitnightyet == false){
                    setNight();
                }
                isitnightyet = true;
            } else {
                if(isitnightyet == true){
                    setDay();
                }
                isitnightyet = false;
            }
        }
    },
};