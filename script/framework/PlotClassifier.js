
var plotwidth = 500;
var plotheight = 500;
var strokecolor = '#FFFFFF';
var class1color = '#FF7700';
var class2color = '#0033FF';

function updateSetting(setting){
    if (setting.plotwidth) plotwidth = setting.plotwidth;
    if (setting.plotheight) plotheight = setting.plotheight;
    if (setting.strokecolor) strokecolor = setting.strokecolor;
    if (setting.class1color) class1color = setting.class1color;
    if (setting.class2color) class2color = setting.class2color;
}

function hexToRgb(hex){
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function clearPoint(str){
    var canvasobj = document.getElementById(str);
    var canvasctx = canvasobj.getContext("2d");
    canvasctx.clearRect(0, 0, plotwidth, plotheight);
    canvasobj.style.visibility = "hidden";
}

function showPoint(str){
    var canvasobj = document.getElementById(str);
    canvasobj.style.visibility = "visible";
}

function plotPoint(tempctx, x, y, fillcolor, strokecolor){
    tempctx.beginPath();
    tempctx.arc(x, y, 3, 0, 2 * Math.PI);
    tempctx.fillStyle = fillcolor;
    tempctx.fill();
    tempctx.lineWidth = 1;
    tempctx.strokeStyle = strokecolor;
    tempctx.stroke();
}

function plotPoints(data, str){
    var canvasobj = document.getElementById(str);
    var canvasctx = canvasobj.getContext("2d");
    for (i = 0; i < data.length; i++){
        var d = data[i];
        if (d[0] > 0){
            plotPoint(canvasctx, d[1][0]*plotwidth, d[1][1]*plotheight, class1color, strokecolor);
        }else if (d[0] < 0){
            plotPoint(canvasctx, d[1][0]*plotwidth, d[1][1]*plotheight, class2color, strokecolor);
        }
    }
}

function plotClassifier(model, feature){
    var classifier = document.getElementById("classifier");
    var classifierctx = classifier.getContext("2d");
    var classifierData = classifierctx.getImageData(0, 0, plotwidth, plotheight);

    // That's how you define the value of a pixel //
    function drawPixel (x, y, r, g, b, a) {
        var index = (x + y * plotwidth) * 4;
        classifierData.data[index + 0] = r;
        classifierData.data[index + 1] = g;
        classifierData.data[index + 2] = b;
        classifierData.data[index + 3] = a;
    }

    // Predict Function takes function that return a value from -1 to 1 //
    // works still with value above 1 or below -1 //
    for (var i = 0; i < plotwidth; i++) {
        for (var j = 0; j < plotheight; j++){
            var result = 0;
            if (feature){
                result = model.predict(feature.transform([i/plotwidth, j/plotheight]));
                //console.log(feature.transform([i/plotwidth, j/plotheight]));
            }else{
                result = model.predict([i/plotwidth, j/plotheight]);
            }
            if (result > 0){
                var class1rgb = hexToRgb(class1color);
                drawPixel(i, j, class1rgb.r, class1rgb.g, class1rgb.b, 255*result);
            }else if (result < 0){
                var class2rgb = hexToRgb(class2color);
                drawPixel(i, j, class2rgb.r, class2rgb.g, class2rgb.b, 255*-result);
            }else{
                drawPixel(i, j, 0, 0, 0, 0);
            }
        }
    }
    
    classifierctx.putImageData(classifierData, 0, 0);
}
