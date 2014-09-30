angular.module('ikuslang-app.services', [])

/**
 * Zerbitzaritik datuak eskuratzeko zerbitzua.
 */
.factory('Zerbitzaria', ['$http','$q', function($http, $q) {
    
    var factory = {};
    
    factory.api_url ="http://asier.ikuslang.ametza.com/API/v1/";
    
    factory.hutsuneak_bete = [];
    
    factory.eskuratuHutsuneakBete = function(id_ariketa, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'hutsuneak-bete/' + id_ariketa, {
            params: {
                "id_hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.hutsuneak_bete = data.hutsuneak_bete;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    return factory;

}]);