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
        profileCache.put('typeMedia', [
            {
                Text: 'Ảnh',
                Value: 1
            },
            {
                Text: 'Video',
                Value: 2
            },
            {
                Text: 'Tệp',
                Value: 3
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
