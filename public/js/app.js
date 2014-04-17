(function () {
    "use strict";


    var module = angular.module('App', [
        'App.DataContext',
        'App.EntityModel'
    ]);

    module.value('ngBreeze', (function () {

        if ("breeze" in window) {
            return breeze;
        } else {
            throw new Error("The Globals breeze is missing");
        }

    })());

    module.value('ngQ', (function () {

        if ("Q" in window) {
            return Q;
        } else {
            throw new Error("The Globals Q is missing");
        }

    })());

    module.controller('AppCtrl', function ($scope, DataContext) {
        console.log('AppCtrl');

        DataContext.getAllHero()
            .then(function (res) {
                console.log(res.results[0].data);
            })
            .catch(function (error) {
                console.log(error);
            });

        DataContext.getAllHeroPowerMap()
            .then(function (res) {
                console.log(res.results[0].data);
            })
            .catch(function (error) {
                console.log(error);
            });

        DataContext.getAllPower()
            .then(function (res) {
                console.log(res.results[0].data);
            })
            .catch(function (error) {
                console.log(error);
            });

    });


//    angular.element(document).ready(
//        function () {
//            $.ajax({
//                dataType: "json",
//                url: '/assets/json/config.json'
//            }).success(function (res) {
//                    console.log('config loaded');
//                    module.constant('HERO', res.data)
//                    angular.bootstrap(document, ['App']);
//                }). error(function (err) {
//                    console.log('error:', err);
//                });
//
//        }
//    );

})();