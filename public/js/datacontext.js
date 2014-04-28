(function () {
    "use strict";

    var services = angular.module('App.DataContext', []);

    services.factory('jsonResultsAdapter', function (ngBreeze) {

        return new ngBreeze.JsonResultsAdapter({

            name: "context",

            extractResults: function (data) {
                var results = data.results;

                console.log('extractResults');

                if (!results) throw new Error("Unable to resolve 'results' property");
                return results;
            },

            visitNode: function (node, parseContext, nodeContext) {

                var entityType;

                switch (parseContext.query.resourceName) {
                    case "/assets/json/hero.json":
                        entityType = { entityType: "Hero"  }
                        if (nodeContext.propertyName === "data")return entityType;
                    case "/assets/json/hero-power-map.json":
                        entityType = { entityType: "HeroPowerMap"  }
                        if (nodeContext.propertyName === "data")return entityType;
                    case "/assets/json/power.json":
                        entityType = { entityType: "Power"  }
                        if (nodeContext.propertyName === "data")return entityType;
                }

            }

        });
    });

    services.factory('DataContext', function (EntityModel, jsonResultsAdapter, $log, ngBreeze, ngQ, $location, $timeout) {

        ngBreeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);

        var serviceName = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

        var ds = new ngBreeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            useJsonp: false,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new ngBreeze.EntityManager({dataService: ds});

        EntityModel.initialize(manager.metadataStore);

        function newHero() {
            var newEntity = manager.createEntity('Hero', {name: 'name'});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }

        function deleteHero(entity) {

            if (entity.powerMaps[0]) {

                var done = false;
                while (!done) {
                    entity.powerMaps[0].entityAspect.setDeleted();
                    if (entity.powerMaps.length === 0)done = true;
                }

                entity.entityAspect.setDeleted();
            }

            return entity;
        }

        function deletePower(entity) {

            if (entity.heroMaps[0]) {
                var done = false;
                while (!done) {

                    entity.heroMaps[0].entityAspect.setDeleted();
                    if (entity.heroMaps.length === 0)done = true;
                }

                entity.entityAspect.setDeleted();
            }

            return entity;
        }


        function getAllHero() {

//            var deferred = gQ.defer();

//            var query = ngBreeze.EntityQuery
//                .from("init");

//            manager.executeQuery(query)
//                .catch(function (err) {
//                    $log.error('Error getAllEntity', err);
//                    deferred.reject(new Error(err));
//                })
//                .done(function (res) {
//                    if (res)deferred.resolve(res.results);
//                })

//            return deferred.promise;

            var query = ngBreeze.EntityQuery
                .from("/assets/json/hero.json");
            return manager.executeQuery(query)

        }

        function getAllHeroPowerMap() {

            var query = ngBreeze.EntityQuery
                .from("/assets/json/hero-power-map.json");
            return manager.executeQuery(query)

        }

        function getAllPower() {

            var query = ngBreeze.EntityQuery
                .from("/assets/json/power.json");
            return manager.executeQuery(query)

        }

        function newPower() {
            var newEntity = manager.createEntity('Power', {name: 'name'});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }

        function newHeroPowerMap(heroId, powerId) {
            var newEntity = manager.createEntity('HeroPowerMap', { hero_id: heroId, power_id: powerId});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }


        return {
            getAllHero: getAllHero,
            newHero: newHero,
            deleteHero: deleteHero,
            getAllPower: getAllPower,
            newPower: newPower,
            deletePower: deletePower,
            getAllHeroPowerMap: getAllHeroPowerMap,
            newHeroPowerMap: newHeroPowerMap,
            manager: manager
        };

    });

})();


