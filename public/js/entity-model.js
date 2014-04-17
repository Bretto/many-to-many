(function () {
    "use strict";

    var services = angular.module('App.EntityModel', []);

    services.factory('EntityModel', function ($http, $log, $rootScope, ngBreeze) {

        // alias
        var DT = ngBreeze.DataType;

        function initialize(metadataStore) {

            metadataStore.addEntityType({
                shortName: "Hero",
                namespace: "Context",
                dataProperties: {
                    id: {
                        dataType: DT.String,
                        isPartOfKey: true
                    },
                    name: {
                        dataType: DT.String
                    }
                },
                navigationProperties: {
                    powerMaps: {
                        isScalar: false,
                        entityTypeName: "HeroPowerMap:#Context",
                        associationName: "Hero_HeroPowerMap"
                    }
                }
            });

            metadataStore.setEntityTypeForResourceName('Hero', 'Hero');
            function Hero() {
            };

            var heroInitializer = function (hero) {
            }

            metadataStore.registerEntityTypeCtor("Hero", Hero, heroInitializer);


            metadataStore.addEntityType({
                shortName: "HeroPowerMap",
                namespace: "Context",
                dataProperties: {
                    id: {
                        dataType: DT.String,
                        isPartOfKey: true
                    },
                    hero_id: {dataType: DT.String},
                    power_id: {dataType: DT.String}
                },
                navigationProperties: {
                    hero: {
                        isScalar: true,
                        entityTypeName: "Hero:#Context",
                        associationName: "Hero_HeroPowerMap",
                        foreignKeyNames: ["hero_id"]
                    },
                    power: {
                        isScalar: true,
                        entityTypeName: "Power:#Context",
                        associationName: "Power_HeroPowerMap",
                        foreignKeyNames: ["power_id"]
                    }
                }
            });

            function HeroPowerMap() {
            };

            var heroPowerMapInitializer = function (heroPowerMap) {

            }

            metadataStore.registerEntityTypeCtor("HeroPowerMap", HeroPowerMap, heroPowerMapInitializer);


            metadataStore.addEntityType({
                shortName: "Power",
                namespace: "Context",
                dataProperties: {
                    id: {
                        dataType: DT.String,
                        isPartOfKey: true
                    },
                    name: {
                        dataType: DT.String
                    }
                }
                ,
                navigationProperties: {
                    heroMaps: {
                        isScalar: false,
                        entityTypeName: "HeroPowerMap:#Context",
                        associationName: "Power_HeroPowerMap"
                    }
                }
            });

            metadataStore.setEntityTypeForResourceName('Power', 'Power');
            function Power() {
            };

            var powerInitializer = function (power) {
            }

            metadataStore.registerEntityTypeCtor("Power", Power, powerInitializer);


        }

        return {
            initialize: initialize
        }
    })


})();





