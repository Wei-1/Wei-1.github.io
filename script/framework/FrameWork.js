// Wei's ML Digest
// Wei Chen 2016-06-17
var DropdownME = React.createClass({
    getInitialState: function() {
        var selected = this.getSelectedFromProps(this.props.paras);
        return {selected: selected};
    },
    componentWillReceiveProps: function(nextProps) {
        var selected = this.getSelectedFromProps(nextProps.paras);
        this.setState({selected: selected});
    },
    getSelectedFromProps(paras) {
        if (paras.select === null && paras.options.length !== 0) {
            return paras.options[0]['value'];
        } else {
            return paras.select;
        }
    },
    handleChange: function(e) {
        var select = e.target.value;
        this.setState({selected: select}, function(){
            if (this.props.onChange) {
                this.props.onChange(select);
            }
        });
    },
    render: function() {
        var self = this;
        var options = self.props.paras.options.map(function(para) {
            if (typeof para === 'object'){
                return (
                    <option key={para['key']} value={para['value']}>
                        {para['key']}
                    </option>
                );
            }else{
                return (
                    <option key={para} value={para}>
                        {para}
                    </option>
                );
            }
        });
        return (
            <select className='form-control' 
                    value={this.state.selected}
                    onChange={this.handleChange}>
                {options}
            </select>
        );
    }
});
var Paras = React.createClass({
    onSetParas(para) {
        var newparas = this.props.paras;
        if (typeof newparas[para.name] === 'object'){
            newparas[para.name]['select'] = para.value;
        }else{
            newparas[para.name] = para.value;
        }
        this.props.onSetParas(newparas);
    },
    render: function() {
        var parasArray = [];
        for (var property in this.props.paras){
            if (this.props.paras.hasOwnProperty(property)){
                parasArray.push({name:property, value:this.props.paras[property]});
            }
        }
        var parasobj = this;
        var ParasItems = parasArray.map(function(para, index) {
            function dropDownOnChange(newValue) {
                parasobj.onSetParas({name:para.name, value:newValue});
            }
            return (
                <div key={index}>
                    {para.name} :
                    <DropdownME
                        paras={para.value}
                        onChange={dropDownOnChange} />
                </div>
            );
        }, this);
        return (
            <div>
                {ParasItems}
            </div>
        );
    }
});
var FeatureShow = React.createClass({
    onKeyClick(key) {
        this.props.onKeyClick(key);
    },
    render: function() {
        var parasArray = [];
        for (var property in this.props.paras){
            if (this.props.paras.hasOwnProperty(property)){
                parasArray.push({name:property, value:this.props.paras[property]});
            }
        }
        var parasobj = this;
        var ParasItems = parasArray.map(function(para, index) {
            function onKeyClick() {
                parasobj.onKeyClick(para.name);
            }
            if (para.value){
                return (
                    <a key={index} onClick={onKeyClick}>
                        o:{para.name + " "}
                    </a>
                );           
            }else{
                return (
                    <a key={index} onClick={onKeyClick}>
                        x:{para.name + " "}
                    </a>
                );           
            }
        }, this);
        return (
            <div>
                {ParasItems}
            </div>
        );
    }
});
var MLFrame = React.createClass({
    dropDownOnModel(newValue) {
        this.setState({model: newValue}, function(){
            var model = new StatisticsClassification();
            if (this.state.model == "KNearestNeighborhood"){
                model = new KNearestNeighborhood();
            }else if (this.state.model == "Perceptron"){
                model = new Perceptron();
            }
            this.setState({modelparas: model.getParas});
        });
    },
    dropDownOnDataset(newValue) {
        this.setState({dataset: newValue}, function(){
            this.clickTrain();
        });
    },
    onSetParas(newparas){
        this.setState({modelparas: newparas});
    },
    onKeyClick(key){
        var newfeatures = this.state.features;
        newfeatures[key] = !this.state.features[key];
        this.setState({features: newfeatures});
    },
    clickTrain() {
        var trainingdata = defaultGaussianPoints();
        if (this.state.dataset == "empty"){
            trainingdata = [];
        }

        this.setState({trainingdata: trainingdata}, function(){
            clearPoint("training");
            clearPoint("classifier");
            plotPoints(this.state.trainingdata, "training");
            showPoint("training");
            var model = new StatisticsClassification();
            if (this.state.model == "KNearestNeighborhood"){
                model = new KNearestNeighborhood();
            }else if (this.state.model == "Perceptron"){
                model = new Perceptron();
            }
            this.setState({modelparas: model.getParas});
        });
    },
    clickModel() {
        var model = new StatisticsClassification();
        if (this.state.model == "KNearestNeighborhood"){
            model = new KNearestNeighborhood();
        }else if (this.state.model == "Perceptron"){
            model = new Perceptron();
        }
        var feature = new Feature();
        var trainingdata = this.state.trainingdata;
        var features = this.state.features;
        var modelparas = this.state.modelparas;

        feature.setFeatures(features, function(){
            model.setParas(modelparas, function(){
                model.train(feature.transtrain(trainingdata), function(){
                    clearPoint("classifier");
                    plotClassifier(model, feature);
                    showPoint("classifier");
                    console.log("prediction done");
                });
            });
        });
    },
    componentDidMount() {
        plotPoints(this.state.trainingdata, "training");
        showPoint("training");
    },
    getInitialState: function() {
        var features = new Feature();
        return {dataset: "", features:features.getFeatures, model: "", modelparas:{},
            trainingdata: defaultGaussianPoints()};
    },
    render: function() {
        var setplotwidth = Math.min(500, window.innerWidth-40);
        updateSetting({plotwidth: setplotwidth, plotheight: setplotwidth});
        var plotstyle = {
            position:"absolute",
            width:setplotwidth+"px",
            height:setplotwidth+"px",
            overflow: "hidden",
            boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 1)"
        };
        var controlstyle = {
            position:"absolute",
            left:"20px",
            top:"120px",
            width:"100%"
        };
        return (
            <div className="mlFrame">
                <div style={controlstyle}>
                    <div>
                        Training Data :
                        <DropdownME
                            paras={{options:this.props.data.dataset, select:this.state.dataset}}
                            onChange={this.dropDownOnDataset} />
                        <a onClick={this.clickTrain}> Reset </a>
                    </div>
                    <div>
                        Algorithm :
                        <DropdownME
                            paras={{options:this.props.data.machinelearning, select:this.state.model}}
                            onChange={this.dropDownOnModel} />
                        <a onClick={this.clickModel}> Train </a>
                    </div>
                    <div>
                        <Paras paras={this.state.modelparas} onSetParas={this.onSetParas} />
                    </div>
                    <div> . </div>
                    <div style={plotstyle}>
                        <canvas id="classifier" width={setplotwidth} height={setplotwidth}>
                            No HTML5 canvas
                        </canvas>
                        <canvas id="training" width={setplotwidth} height={setplotwidth}>
                            No HTML5 canvas
                        </canvas>
                    </div>
                
                </div>
            </div>
        );
    }
});
var TubeFrame = React.createClass({
    render: function() {
        var tubeItems = this.props.data.youtube.map(function(section, index) {
            var sectionStyle = {
                width: window.innerWidth-16 + "px",
                height: "80px"
            };
            return (
                <div key={index}>
                    <a href={section.link}>
                        <div className="section" style={sectionStyle} >
                            <div className="sectionimage" >
                                <img src={section.image} />
                            </div>
                            <div className="titleStyle" >
                                {section.title}
                            </div>
                            <div className="subtitleStyle" >
                                {section.subtitle}
                            </div>
                        </div>
                    </a>
                    <div><br/></div>
                </div>
            );
        }, this);
        return (
            <div className="tubeItems" style={{position: "absolute", top: "120px"}}>{tubeItems}</div>
        );
    }
});
var Manu = React.createClass({
    onSelect(select) {
        this.props.onSelect(select);
    },
    render: function() {
        var manuItem = this.props.data.manu.map(function(section, index) {
            var boundClick = this.onSelect.bind(this, section.link);
            var sectionStyle = {
                width: window.innerWidth-16 + "px",
                height: "80px"
            };
            return (
                <div key={index}>
                    <div className="section" style={sectionStyle} onClick={boundClick} >
                        <div className="sectionimage" >
                            <img src={section.image} />
                        </div>
                        <div className="titleStyle" >
                            {section.title}
                        </div>
                        <div className="subtitleStyle" >
                            {section.subtitle}
                        </div>
                    </div>
                    <div><br/></div>
                </div>
            );
        }, this);
        return (
            <div className="manuItem" style={{position: "absolute", top: "120px"}}>{manuItem}</div>
        );
    }
});
var TheHead = React.createClass({
    onSelect() {
        this.props.onSelect("");
    },
    render: function() {
        var ownerImage = {
            position: "fixed",
            left: "25px",
            top: "25px",
            width: "70px",
            height: "70px"
        };
        return (
            <div>
                <div>
                    <div className="ownername">
                        <img src={this.props.data.owner.nameicon} />
                    </div>
                    <div className="ownergithub">
                        <a href={this.props.data.owner.github}>
                            <img src={this.props.data.reference.github} />
                        </a>
                    </div>
                    <div className="ownerlinkedin">
                        <a href={this.props.data.owner.linkedin}>
                            <img src={this.props.data.reference.linkedin} />
                        </a>
                    </div>
                    <div className="owneremail">
                        <a href={"mailto:"+this.props.data.owner.email}>
                            <img src={this.props.data.reference.email} />
                        </a>
                    </div>
                </div>
                <div className="circle" style={ownerImage} onClick={this.onSelect} >
                    <img src={this.props.data.owner.image} />
                </div>
            </div>
        );
    }
});
var WindowSelect = React.createClass({
    onSelect(select) {
        this.props.onSelect(select);
    },
    render: function() {
        if (this.props.select == "youtube"){
            return (
                <TubeFrame data={this.props.data} onSelect={this.onSelect} />
            );
        }else if (this.props.select == "mlplayground"){
            return (
                <MLFrame data={this.props.data} onSelect={this.onSelect} />
            );
        }else{
            return (
                <Manu data={this.props.data} onSelect={this.onSelect} />
            );
        }
    }
});
var MainFrame = React.createClass({
    onSelect: function(select) {
        this.setState({select: select});
    },
    getInitialState: function() {
        return {select: ""};
    },
    render: function() {
        return (
            <div className="mainFrame">
                <WindowSelect data={this.props.data}
                    onSelect={this.onSelect}
                    select={this.state.select} />
                <TheHead data={this.props.data} onSelect={this.onSelect} />
            </div>
        );
    }
});
ReactDOM.render(
    <MainFrame data={data} />,
    document.getElementById('content')
);