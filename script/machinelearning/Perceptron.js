class Perceptron{

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

    constructor(){
        this.paras = {
            lambda: {
                select:1.5,
                options:[0.5, 1.5, 3.0, 10.0]
            },
            limit: {
                select:100,
                options:[10, 100, 200, 1000]
            }
        };
    }

    get getParas(){
        return this.paras;
    }

    setParas(paras, callback){
        for (var property in paras) {
            if (this.paras.hasOwnProperty(property)) {
                this.paras[property]["select"] = paras[property]["select"];
            }
        }
        if (callback) return callback();
    }

    train(trainingdata, callback){
        var limit = this.paras.limit.select;
        var lambda = this.paras.lambda.select;
        
        var n = trainingdata.length;
        var m = trainingdata[0][1].length;
        this.w = Array(m).fill(0);
        var datasum = trainingdata.map(function(data){
            return data[1];
        }).reduce(this.array2sum);
        this.datamean = this.arraydivide(datasum, n);

        var t = 2;
        var cost = -1;
        var i = 0;
        while(i < limit){
            for (var j = 0; j < n; j++){
                var data = trainingdata[j];
                var y = data[0];
                var x = this.array2minus(data[1], this.datamean);
                if (y * this.dot(x, this.w) < 1){
                    this.w = this.array2sum(this.arraymultiply(this.w, 1-1/t), this.arraymultiply(x, y / lambda / t));
                }else{
                    this.w = this.arraymultiply(this.w, 1-1/t);
                }
                t += 1;
            }
            i += 1;
        }

        if (callback) return callback();
    }

    predict(arr){
        var v = this.dot(this.array2minus(arr, this.datamean), this.w);
        if (v > 0){
            return 1;
        }else if (v < 0){
            return -1;
        }else {
            return 0;
        }
    }
}
