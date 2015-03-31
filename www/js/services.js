angular.module('ikuslang-app.services', [])

.factory('Erabiltzailea', function() {
    
    var factory = {};
    
    // Momentuz probak egiteko Asier-en erabiltzailea jarri.
    factory.id;
    factory.izena;
    factory.abizenak;
    
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
    
    factory.garbitu = function() {
        factory.id = undefined;
        factory.izena = undefined;
        factory.abizenak = undefined;
    }
    
    return factory;
})

/**
 * Zerbitzaritik datuak eskuratzeko zerbitzua.
 */
.factory('Zerbitzaria', ['$http','$q', 'push', function($http, $q, push) {
    
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
    
    factory.bidaliEmaitzak = function(id_ikasgaia, id_ariketa, id_ikaslea, zuzenak, okerrak) {
        
        var d = $q.defer();
        
        $http({
            method: 'POST',
            url: factory.api_url + 'ariketak/emaitzak/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {"id_ikasgaia": id_ikasgaia,
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
    
    factory.erregistratuAlerta = function(id_ikaslea) {
        
        var result = push.registerPush(function (result) {
            
            var data;
            
            if (result.type === 'registration') {
                
                data = {'mota': result.device, 'id_gailua': result.id, 'id_ikaslea': id_ikaslea};
                
                $.ajax({
                    url: factory.api_url + 'erregistroa',
                    type: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(data)
                })
                .done(function(data, textStatus, jqXHR) {
                    
                    console.log(data);
                    console.log(textStatus);
                    
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    
                    console.log("Errore bat gertatu da zure alerta-eskaera zerbitzarira bidaltzean");
                    
                });
                
            } else if (result.type === 'message') {
                
                // Mezua jasotzean aplikazioa 3 egoeratan egon daiteke:
                // * Aurreko planoan exekutatzen -> foreground === true
                // * Atzeko planoan ezkutuan baina memorian -> foreground === false && coldstart === false
                // * Erabat geldi -> foreground === false && coldstart === true
                if (result.foreground) {
                    
                    // Erabiltzaileari mezua bistaratu.
                    navigator.notification.alert(
                        result.message,	                            // message
                        undefined,                                 	// callback
                        'Ikuslang',                   			 	// title
                        'Ados'                                  	// buttonLabel
                    );
                    
                } else {
                    
                    if (result.coldstart) {
                        
                    } else {
                        
                    }
                    
                }
                
            }
            
        });
        
    }
    
    return factory;

}]);