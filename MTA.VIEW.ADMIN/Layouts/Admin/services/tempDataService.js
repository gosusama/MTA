define(['angular'], function () {
    var app = angular.module('tempDataModule', []);

    app.factory('tempDataService',['CacheFactory',function (CacheFactory) {
        var profileCache;
        if (!CacheFactory.get('profileCache')) {
            profileCache = CacheFactory('profileCache');
        }
        profileCache.put('status', [
            {
                Text: 'Sử dụng',
                Value: 10
            },
            {
                Text: 'Không sử dụng',
                Value: 0
            }
        ]);

        var result = {
            dateFormat: 'dd/MM/yyyy',
            delegateEvent: function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
        };

        result.tempData=function(name) {
            return profileCache.get(name);
        }

        return result;
    }
    ]);
    return app;
});
