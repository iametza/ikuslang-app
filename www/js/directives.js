angular.module('ikuslang-app.directives', [])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('hutsuneakBeteHipertranskribapena', ['Zerbitzaria', function(Zerbitzaria) {
    
    var initTranscript = function(scope, element, attrs, p, hutsuneak) {
        
        var hutsune_kopurua = hutsuneak.length;
        var hitz_kopurua;
        var hutsunearen_testua = "";
        var $spana;
        var dataMs = "data-ms";
        
        $("span", element).each(function(i) {
            // doing p.transcript on every word is a bit inefficient - wondering if there is a better way
            p.transcript({
                time: $(this).attr(dataMs) / 1000, // seconds
                futureClass: "transcript-grey",
                target: this,
                onNewPara: function(parent) {
                    // Hurrengo errenkadarekin zerbait arraroa gertatzen da.
                    // $() gabe errorea ematen du: Uncaught TypeError: Object [object Object] has no method 'stop'
                    // eta $() gehitzean, span guztiek estiloa galtzen dute. Nik uste parent-ekin zerikusia duela.
                    element.stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
                }
            });  
        });
        
        // Hutsuneak gehitu dagokion lekuan.
        for (var i = 0; i < hutsune_kopurua; i++) {
            
            hitz_kopurua = hutsuneak[i].length;
            
            hutsunearen_testua = "";
            
            // Hitz bat baino gehiagoko hutsueneen kasuan bakarrik sartzen da while begizta honetan.
            while (--hitz_kopurua) {
                
                // Hutsunearen testua osatzen joan.
                hutsunearen_testua = hutsuneak[i][hitz_kopurua].testua + " " + hutsunearen_testua;
                
                // Span-a ezabatu.
                $("span[data-ms='" + hutsuneak[i][hitz_kopurua].denbora + "']", element).remove();
                
            }
            
            // Lehen hitza gehitu hutsunearen testuari. Hitz bakarreko hutsunea bada, hau izango da hitz bakarra.
            hutsunearen_testua = hutsuneak[i][0].testua + " " + hutsunearen_testua;
            
            // Bukaerako zuriunea kendu.
            hutsunearen_testua = $.trim(hutsunearen_testua);
            
            // Lehen hitzaren span-a input text batekin ordezkatu.
            $("span[data-ms='" + hutsuneak[i][0].denbora + "']", element).replaceWith("<input type='text' class='hutsuneak-bete-input' data-testua='" + hutsunearen_testua + "' />");
            
        }
        
    }
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            var id_ariketa = 3;
            var id_hizkuntza = 1;
            
            var promise = Zerbitzaria.eskuratuHutsuneakBete(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                scope.hutsuneak_bete = Zerbitzaria.hutsuneak_bete;
                
                console.log(scope.hutsuneak_bete);
                
                scope.izena = scope.hutsuneak_bete.izena;
                
                scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                    media: {
                        m4v: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.bideo_path + scope.hutsuneak_bete.bideo_mp4,
                        webmv: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.bideo_path + scope.hutsuneak_bete.bideo_webm
                    },
                    options: {
                        solution: "html",
                        supplied: "m4v, webmv"
                    }
                });
                
                // Azpitituluen fitxategia parseatu bistaratzeko.
                //$scope.pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
                
                // Hipertranskribapenaren testua bistaratu
                element.html(scope.hutsuneak_bete.hipertranskribapena);
                
                // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
                initTranscript(scope, element, attrs, scope.pop, scope.hutsuneak_bete.hutsuneak);
                
            });
            
        }
    }
    
}]);