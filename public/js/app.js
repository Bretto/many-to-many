(function () {
    "use strict";
    var forEach = angular.forEach;

    var module = angular.module('App', [
        'xeditable',
        'App.DataContext',
        'App.EntityModel'
    ]).run(function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });

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


    module.directive('setect2Tag', function ($parse) {

        function link(scope, elem, attrs) {
            var data = [];

            elem.select2({
                data: function () {
                    return {results: data};
                },
                multiple: true
            });

            elem.on('select2-opening', function () {
                var powers = $parse(attrs['setect2Tag'])(scope);;
                if (powers) {

                    var formatData = powers.map(function (power) {
                        return {id: power.id, text: power.name}
                    })

                    data = formatData;
                }
            })

        }

        return {
            restrict: 'A',
            link: link
        };
    });


    module.controller('AppCtrl', function ($scope, DataContext, $timeout, $rootScope) {
        console.log('AppCtrl');


        DataContext.getAllHeroPowerMap()
            .then(function (res) {
                console.log(res.results[0].data);
                $scope.$digest();
            })
            .catch(function (error) {
                console.log(error);
            });

        DataContext.getAllPower()
            .then(function (res) {
                console.log(res.results[0].data);
                $scope.powers = res.results[0].data;
                $scope.$digest();
            })
            .catch(function (error) {
                console.log(error);
            });

        $scope.myPowerList = {tags: ["red", "green", "blue"]};

        DataContext.getAllHero()
            .then(function (res) {
                console.log(res.results[0].data);
                $scope.heros = res.results[0].data;
                $scope.$digest();
            })
            .catch(function (error) {
                console.log(error);
            });


        $scope.onNewHero = function () {
            var newHero = DataContext.newHero();
            $scope.heros.unshift(newHero);
        }

        $scope.onDeleteHero = function (index) {
            var deletedEntity = DataContext.deleteHero($scope.heros[index]);
            $scope.heros.splice(index, 1);
            DataContext.manager.acceptChanges();
        }

        $scope.onNewPower = function () {
            var newPower = DataContext.newPower();
            $scope.powers.unshift(newPower);
        }

        $scope.onDeletePower = function (index) {
            var deletedEntity = DataContext.deletePower($scope.powers[index]);
            $scope.powers.splice(index, 1);
            DataContext.manager.acceptChanges();
        }


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