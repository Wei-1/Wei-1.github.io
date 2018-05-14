class Feature{

    constructor(){
        this.features = {
            "x":true,
            "y":true,
        };
    }

    get getFeatures(){
        return this.features;
    }

    setFeatures(features, callback){
        for (var feature in features) {
            if (this.features.hasOwnProperty(feature)) {
                this.features[feature] = features[feature];
            }
        }
        if (callback) return callback();
    }

    transform(arr){
        var newarr = [];
        var x = arr[0];
        var y = arr[1];
        if (this.features["x"]) newarr.push(x);
        if (this.features["y"]) newarr.push(y);
        return newarr;
    }

    transtrain(matrix){
        var newmatrix = [];
        for (i in matrix){
            newmatrix.push([matrix[i][0], this.transform(matrix[i][1])]);
        }
        return newmatrix;
    }
}
