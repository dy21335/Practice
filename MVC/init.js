$(function () {
    var model = new ListModel(['PHP', 'JavaScript']),
        view = new ListView(model, {
            'list' : $('#list'),
            'addButton' : $('#plusBtn'),
            'delButton' : $('#minusBtn')
        }),
        controller = new ListController(model, view);

    view.show();
});