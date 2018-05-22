
/*
事件派发机制，用于model到view的更新
*/


var Event = function (sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {

    attach: function (listener) {
        this._listeners.push(listener);
    },

    notify: function (args) {
        for (var i = 0; i < this._listeners.length; i += 1) {
            this._listeners[i].update(args);
        }
    }

};

/*model用于存储数据*/

var Model = {

    CityList : ['广州','深圳','珠海'],

    addCityEvent : new Event(this),

    addCityM : function (city) {
        this.CityList.push(city);
        this.addCityEvent.notify(city);
    },

    getCity: function () {
        return this.CityList;
    }


}





/*视图的展示*/

var CityView = {


    init: function (controller) {
        this.select = document.getElementById('citySel');
        this.addBtn = document.getElementById('addBtn');
        this.cityInput = document.getElementById('cityInput');
        this.controller = controller;
        console.log(this.controller);
        this.addBtnHandler = this.addBtnHandler.bind(this);

        // this.model.addCityEvent.attach(this.addCityButtonHandler);

        this.addBtn.addEventListener('click',this.addBtnHandler);

        this.render();
    },

    addBtnHandler : function () {
        console.log(this.cityInput.value.trim());
        this.controller.incrementCity(this.cityInput.value.trim());
        this.cityInput.value ="";
    },

    createOption:function (data){
        var parent = this.select;
        for(var i=0; i<data.length; i++){
            var opt = document.createElement('option');
            //设置option的值
            opt.innerHTML = data[i];
            //定义option的自定义值
            parent.appendChild(opt);
        }
    },

    update: function(data){
        if(data == '' || data == undefined || data == null){
            console.log("kong");
        }
        else{
            var parent = this.select;
            var opt = document.createElement('option');
            //设置option的值
            opt.value = data;
            opt.appendChild(document.createTextNode(data));
            console.log(opt.innerHTML);
            //定义option的自定义值
            parent.appendChild(opt);
        }


    },

    render : function () {
        this.createOption(this.controller.getCurrentCity());
    }

}


/*controller将model和view连接在一起*/


var Controller = {


    init : function (view, model){
        this.view = view;
        this.model = model;

        this.view.init(this);
        this.model.addCityEvent.attach(this.view);
    },

    incrementCity: function(city) {
        this.model.addCityM(city);
    },

    getCurrentCity: function () {
        return this.model.getCity();
    }
};



Controller.init(CityView, Model);
















