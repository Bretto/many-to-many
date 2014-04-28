(function () {
    "use strict";
    var forEach = angular.forEach;

    var module = angular.module('App', [
        'xeditable',
        'App.DataContext',
        'App.EntityModel'
    ]).run(function (editableOptions) {
        editableOptions.theme = 'bs3';
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


    module.directive('setect2Tags', function ($parse) {

        function link(scope, elem, attrs) {
            var data = [];
            var options;

            elem.select2({
                data: function () {
                    return {results: data};
                },
                multiple: true
            });

            elem.on('select2-opening', function () {
                options = $parse(attrs['setect2Tags'])(scope);
                var powers = options.data;
                if (powers) {

                    var formatData = powers.map(function (power) {
                        return {id: power.id, text: power.name}
                    })

                    data = formatData;
                }
            });


            elem.on('change', function (e) {
                options.result.length = 0;
                angular.forEach(e.val, function (elem) {
                    options.result.push(elem);
                });
                scope.$digest();
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    });

    module.directive('setect2Dropdown', function ($parse) {

        function hasPower(powerId, powerMaps) {
            var has = false;

            angular.forEach(powerMaps, function (powerMap) {
                if (powerMap.power.id === powerId) {
                    has = true;
                }
            });

            return has;
        }


        function link(scope, elem, attrs) {
            var data = [];
            var options;

            elem.select2({
                data: function () {
                    return {results: data};
                },
                multiple: false,
                allowClear: true,
                placeholder: 'Select Power'
            });

            elem.on('select2-opening', function () {
                options = $parse(attrs['setect2Dropdown'])(scope);
                var powers = options.data;
                var powerMaps = scope.hero.powerMaps;
                if (powers) {

                    var formatData = powers.map(function (power) {
                        return {id: power.id, text: power.name, disabled: hasPower(power.id, powerMaps)}
                    })

                    data = formatData;
                }
            });


            elem.on('change', function (e) {
                if(e.val){
                    options.action(e);
                }

            });

        }

        return {
            restrict: 'A',
            link: link
        };
    });


    module.controller('AppCtrl', function ($scope, DataContext, $timeout, $rootScope, ngBreeze) {
        console.log('AppCtrl');


        $scope.search = [];

        $scope.$watchCollection(function () {
            return $scope.search
        }, function (val) {

            var listofSuperPowers = val;
            var preds = listofSuperPowers.map(function (sp) {
                return ngBreeze.Predicate.create("powerMaps", "any", "power.id", "==", sp);
            });

            var whereClause = ngBreeze.Predicate.and(preds);
            var query = ngBreeze.EntityQuery.from('Hero').where(whereClause)

            var heros = DataContext.manager.executeQueryLocally(query);
            $scope.heros = heros;

        })


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

    module.controller('HeroCtrl', function ($scope, DataContext, $timeout, $rootScope, ngBreeze) {

        $scope.onPowerSelect = function (heroPowerMap) {
            DataContext.newHeroPowerMap($scope.hero.id, heroPowerMap.val);
            $scope.$digest();
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