class StatisticsClassification{

    array2sum(a, b){
        return a.map(function(v, i){
            return v + b[i];
        });
    }
    array2minus(a, b){
        return a.map(function(v, i){
            return v - b[i];
        });
    }
    array2multiply(a, b){
        return a.map(function(v, i){
            return v * b[i];
        });
    }
    dot(a, b){
        return a.map(function(v, i){
            return v * b[i];
        }).reduce(function(a, b){
            return a + b;
        });
    }
    arraysum(a, b){
        return a.map(function(v, i){
            return v + b;
        });
    }
    arrayminus(a, b){
        return a.map(function(v, i){
            return v - b;
        });
    }
    arraymultiply(a, b){
        return a.map(function(v, i){
            return v * b;
        });
    }
    arraydivide(a, b){
        return a.map(function(v, i){
            return v / b;
        });
    }
    avgzscore(a1, a2, a3){
        return a1.map(function(v, i){
            return Math.pow(v - a2[i], 2) / a3[i];
        }).reduce(function(a, b){
            return a+b;
        });
    }

    constructor(){
        this.paras = {};
    }

    get getParas(){
        return this.paras;
    }

    setParas(paras, callback){
        for (var property in paras) {
            if (paras.hasOwnProperty(property)) {
                this.paras[property]["select"] = paras[property]["select"];
            }
        }
        if (callback) return callback();
    }

    train(trainingdata, callback){
        var c1data = trainingdata.filter(function(x) { return x[0] > 0;}).map(function(data){return data[1];});
        var c2data = trainingdata.filter(function(x) { return x[0] < 0;}).map(function(data){return data[1];});
        var c1length = c1data.length;
        var c2length = c2data.length;

        var array2minus = this.array2minus;
        var c1mean = this.arraydivide(c1data.reduce(this.array2sum), c1length);
        var c2mean = this.arraydivide(c2data.reduce(this.array2sum), c2length);
        this.c1std = this.arraydivide(c1data.map(function(a){
            return array2minus(a, c1mean).map(function(d){
                return Math.pow(d, 2);
            });
        }).reduce(this.array2sum), c1length);
        this.c2std = this.arraydivide(c2data.map(function(a){
            return array2minus(a, c2mean).map(function(d){
                return Math.pow(d, 2);
            });
        }).reduce(this.array2sum), c2length);

        this.c1mean = c1mean;
        this.c2mean = c2mean;
        if (callback) return callback();
    }

    predict(arr){
        var c1d = this.avgzscore(arr, this.c1mean, this.c1std);
        var c2d = this.avgzscore(arr, this.c2mean, this.c2std);
        if (c1d < c2d){
            return 1;
        }else if (c1d > c2d){
            return -1;
        }else {
            return 0;
        }
    }
}
