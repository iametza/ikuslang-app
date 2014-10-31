angular.module('ikuslang-app.services', [])

.factory('Erabiltzailea', function() {
    
    var factory = {};
    
    // Momentuz probak egiteko Asier-en erabiltzailea jarri.
    factory.id = 6;
    factory.izena = "Asier";
    factory.abizenak = "Iturralde";
    
    factory.ezarriId = function(id) {
        
        factory.id = id;
        
    }
    
    factory.eskuratuId = function(id) {
        
        return factory.id;
        
    }
    
    factory.ezarriIzena = function(izena) {
        
        factory.izena = izena;
        
    }
    
    factory.eskuratuIzena = function(izena) {
        
        return factory.izena;
        
    }
    
    factory.ezarriAbizenak = function(abizenak) {
        
        factory.abizenak = abizenak;
        
    }
    
    factory.eskuratuAbizenak = function(abizenak) {
        
        return factory.abizenak;
        
    }
    
    return factory;
})

/**
 * Zerbitzaritik datuak eskuratzeko zerbitzua.
 */
.factory('Zerbitzaria', ['$http','$q', function($http, $q) {
    
    var factory = {};
    
    factory.api_url ="http://asier.ikuslang.ametza.com/API/v1/";
    factory.oinarrizko_url = "http://asier.ikuslang.ametza.com/";
    
    factory.hutsuneak_bete = [];
    factory.hitzak_markatu = [];
    factory.galdera_erantzunak = [];
    factory.multzokatu = [];
    factory.esaldiak_zuzendu = [];
    
    factory.ariketak = {
        egitekoak: [],
        egindakoak: []
    }
    
    factory.bidaliEmaitzak = function(id_ikasgaia, id_ariketa, id_ikaslea, zuzenak, okerrak, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.post(factory.api_url + 'ariketak/emaitzak/', {
            params: {
                "id_ikasgaia": id_ikasgaia,
                "id_ariketa": id_ariketa,
                "id_ikaslea": id_ikaslea,
                "zuzenak": zuzenak,
                "okerrak": okerrak
            }
        }).success(function(data, status, headers) {
            
            console.log(data);
            console.log(status);
            console.log(headers);
            
            d.resolve();
            
        }).error(function(data, status, headers) {            
            
            console.log(data);
            console.log(status);
            console.log(headers);
            
            d.reject();
            
        });
        
    }
    
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
    
    factory.eskuratuHitzakMarkatu = function(id_ariketa, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'hitzak-markatu/' + id_ariketa, {
            params: {
                "id_hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.hitzak_markatu = data.hitzak_markatu;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    factory.eskuratuGalderaErantzunak = function(id_ariketa, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'galdera-erantzunak/' + id_ariketa, {
            params: {
                "id_hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.galdera_erantzunak = data.galdera_erantzunak;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    factory.eskuratuMultzokatu = function(id_ariketa, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'multzokatu/' + id_ariketa, {
            params: {
                "id_hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.multzokatu = data.multzokatu;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }

    factory.eskuratuEsaldiakZuzendu = function(id_ariketa, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'esaldiak-ordenatu/' + id_ariketa, {
            params: {
                "id_hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.esaldiak_zuzendu = data.esaldiak_zuzendu;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    factory.eskuratuEgitekoAriketak = function(id_ikaslea, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'ariketak/egitekoak/', {
            params: {
                "id_ikaslea": id_ikaslea,
                "hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.ariketak.egitekoak = data.egitekoak;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }

    factory.eskuratuEgindakoAriketak = function(id_ikaslea, id_hizkuntza) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'ariketak/egindakoak/', {
            params: {
                "id_ikaslea": id_ikaslea,
                "hizkuntza": id_hizkuntza
            }
        }).success(function(data, status, headers) {
            factory.ariketak.egindakoak = data.egindakoak;
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