function defaultGaussianPoints(){
    return createGaussianPoints(0.3, 0.3, 0.5, 100, 0.7, 0.7, 0.5, 100);
}

function gaussian(v, r){
    var bias = 1;
    if (v > 0.5) bias = -1;
    return (1-Math.exp(-Math.pow((v-0.5)/5,2)))*bias/0.01*r;
}

function gaussianPointFunc(x, y, r){
    return [gaussian(Math.random(), r)+x, gaussian(Math.random(), r)+y];
}

function createGaussianPoints(x1, y1, r1, class1number, x2, y2, r2, class2number){
    var vec = [];
    for (var i = 0; i < class1number; i++){
        var v = gaussianPointFunc(x1, y1, r1);
        vec.push([-1, v]);
    }
    for (var i = 0; i < class2number; i++){
        var v = gaussianPointFunc(x2, y2, r2);
        vec.push([1, v]);
    }
    return vec;
}
