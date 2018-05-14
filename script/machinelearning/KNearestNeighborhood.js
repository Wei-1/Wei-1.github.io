class KNearestNeighborhood {

    array2sum(a, b) {
        return a.map(function(v, i) {
            return v + b[i];
        });
    }
    array2minus(a, b) {
        return a.map(function(v, i) {
            return v - b[i];
        });
    }
    array2multiply(a, b) {
        return a.map(function(v, i) {
            return v * b[i];
        });
    }
    dot(a, b) {
        return a.map(function(v, i) {
            return v * b[i];
        }).reduce(function(a, b) {
            return a + b;
        });
    }
    arraysum(a, b) {
        return a.map(function(v, i) {
            return v + b;
        });
    }
    arrayminus(a, b) {
        return a.map(function(v, i) {
            return v - b;
        });
    }
    arraymultiply(a, b) {
        return a.map(function(v, i) {
            return v * b;
        });
    }
    arraydivide(a, b) {
        return a.map(function(v, i) {
            return v / b;
        });
    }
	distance2d(a, b) {
		return a.map(function(v, i) {
			return Math.pow(v - b[i], 2);
		}).reduce(function(a, b) {
            return a + b;
        });
	}

    constructor() {
    	this.paras = {
    		k: {
    			select:3,
    			options:[1,2,3,4,5,6,7,8]
    		}
    	};
    }

    get getParas() {
    	return this.paras;
    }

    setParas(paras, callback) {
    	for (var property in paras) {
    		if (this.paras.hasOwnProperty(property)) {
        		this.paras[property]["select"] = paras[property]["select"];
    		}
		}
        if (callback) return callback();
    }

    train(trainingdata, callback) {
        this.referencedata = trainingdata;
        if (callback) return callback();
    }

    predict(arr) {
        var distance2d = this.distance2d;
        var referencedatafinal = [];
        var limitnow = 0.2;
        while (referencedatafinal.length < this.paras['k']['select']) {
            referencedatafinal = this.referencedata.filter(function(a) {
                return Math.pow(a[1][0] - arr[0], 2) + Math.pow(a[1][1] - arr[1], 2) <
                    Math.pow(limitnow, 2);
            });
            limitnow += 0.2;
        }
        
        var referencepoints = referencedatafinal.map(function(a) {
            return [a[0], distance2d(arr, a[1])];
        });
        referencepoints.sort(function(a, b) {
            if(a[1] < b[1]) return -1;
            if(a[1] > b[1]) return 1;
            return 0;
        });

        var referenceselect = referencepoints.slice(0, this.paras['k']['select']);

        var counts = {};
        for (var i = 0; i < referenceselect.length; i++) {
            counts[referenceselect[i][0]] = (counts[referenceselect[i][0]] + 1) || 1;
        }

        var tempkey = 0;
        var tempvalue = 0;
        var highcount = 1;

        for (var key in counts) {
            if (counts[key] > tempvalue) {
                tempkey = key;
                tempvalue = counts[key];
                highcount = 1;
            } else if (counts[key] == tempvalue) {
                highcount += 1;
            }
        }
        if (highcount > 1) return referenceselect[0][0];
        return tempkey;
    }
}
