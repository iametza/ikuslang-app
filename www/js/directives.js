angular.module('ikuslang-app.directives', [])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('hutsuneakBeteHipertranskribapena', ['Zerbitzaria', function(Zerbitzaria) {
    
    var dataMs = "data-ms";
    
    var initTranscript = function(scope, element, attrs, p, hutsuneak) {
        
        var hutsune_kopurua = hutsuneak.length;
        var hitz_kopurua;
        var hutsunearen_testua = "";
        var $spana;
        
        $("span", element).each(function(i) {
            // doing p.transcript on every word is a bit inefficient - wondering if there is a better way
            p.transcript({
                time: $(this).attr(dataMs) / 1000, // seconds
                futureClass: "transcript-grey",
                target: this,
                onNewPara: function(parent) {
                    $(element).stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
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
        
        // Hipertranskribapenaren altuera egokitu pantailaren neurrietara.
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia").height(window.screen.height                                   // Pantailaren altuera
                                                                     - $("ion-nav-bar").outerHeight(true)                   // Nabigazio barraren altuera osoa
                                                                     - $("#hutsuneak-bete-izenburua").outerHeight(true)     // Izenburuaren altuera osoa
                                                                     - 60);                                                 // Beheko margina. Zergatik 60???
        
        // Erabiltzaileak transkribapeneko hitz bat klikatzen duenean.
        $('span', element).on('click', function(e) { 
            
            // Klikatutako hitza bideoko zein momenturi dagokion kalkulatu.
            var jumpTo = $(this).attr(dataMs) / 1000;
            
            // Dagokion momentuan hasi bideoa erreproduzitzen.
            scope.pop.play(jumpTo);
            
            return false;
        });
        
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
    
}])

// direktibaren atributua: hitzak-markatu-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('hitzakMarkatuHipertranskribapena', ['$compile', 'Zerbitzaria', function($compile, Zerbitzaria) {
    
    var dataMs = "data-ms";
    
    var initTranscript = function(scope, element, attrs, p, hutsuneak) {
        
        var akats_kopurua = scope.hitzak_markatu.akatsak.length;
        var hitz_kopurua;
        
        //console.log("initTranscript in "+(new Date()-startTimer));
        $("span", element).each(function(i) {
            
            // doing p.transcript on every word is a bit inefficient - wondering if there is a better way
            p.transcript({
                time: $(this).attr(dataMs) / 1000, // seconds
                futureClass: "transcript-grey",
                target: this,
                onNewPara: function(parent) {
                    $(element).stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
                }
            });
            
            $(this).attr("data-drag", "true");
            
            $(this).attr("data-jqyoui-options", "{'helper': 'clone', 'revert': 'invalid'}");
            
            // $compile gabe jqyoui-draggable direktibak ez zuen eraginik.
            // Hau ez zait batere gustatu, seguru badagoela hau egiteko modu hobe bat.
            $compile($(this).attr("jqyoui-draggable", "{'onStart': 'dragStartCallback'}"))(scope);
            
        });
        
        for (var i = 0; i < akats_kopurua; i++) {
            
            hitz_kopurua = scope.hitzak_markatu.akatsak[i].hitzak.length;
            
            for (var j = 0; j < hitz_kopurua; j++) {
                
                $("span[data-ms='" + scope.hitzak_markatu.akatsak[i].hitzak[j].denbora + "']", element).text(scope.hitzak_markatu.akatsak[i].hitzak[j].okerra);
                
                $("span[data-ms='" + scope.hitzak_markatu.akatsak[i].hitzak[j].denbora + "']", element).attr("data-id-akatsa", scope.hitzak_markatu.akatsak[i].id);
                
            }
            
        }
        
        // Hipertranskribapenaren altuera egokitu pantailaren neurrietara.
        // Izenburuaren altuera?
        $("#hitzak-markatu-hipertranskribapena-edukinontzia").height(window.screen.height                                   // Pantailaren altuera
                                                                     - $("ion-nav-bar").outerHeight(true)                   // Nabigazio barraren altuera osoa
                                                                     - $("#hitzak-markatu-hitz-ontzia").outerHeight(true)   // Hitz-ontziaren altuera osoa
                                                                     - 50);                                                 // Beheko margina. Zergatik 50???
        
        // Erabiltzaileak transkribapeneko hitz bat klikatzen duenean.
        $('span', element).on('click', function(e) { 
            
            // Klikatutako hitza bideoko zein momenturi dagokion kalkulatu.
            var jumpTo = $(this).attr(dataMs) / 1000;
            
            // Dagokion momentuan hasi bideoa erreproduzitzen.
            scope.pop.play(jumpTo);
            
            return false;
        });
        
        $(document).on("click", ".hitzak-markatu-hitz-ontzia-spana-x", function() {
            
            // Hautatutako elementua zerrendatik kendu.
			$(this).parent().remove();
            
        });
    }
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            var id_ariketa = 2;
            var id_hizkuntza = 1;
            
            var promise = Zerbitzaria.eskuratuHitzakMarkatu(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                scope.hitzak_markatu = Zerbitzaria.hitzak_markatu;
                
                console.log(scope.hitzak_markatu);
                
                scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                    media: {
                        m4v: Zerbitzaria.oinarrizko_url + scope.hitzak_markatu.bideo_path + scope.hitzak_markatu.bideo_mp4,
                        webmv: Zerbitzaria.oinarrizko_url + scope.hitzak_markatu.bideo_path + scope.hitzak_markatu.bideo_webm
                    },
                    options: {
                        solution: "html",
                        supplied: "m4v, webmv"
                    }
                });
                
                // Azpitituluen fitxategia parseatu bistaratzeko.
                //$scope.pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
                
                // Hipertranskribapenaren testua bistaratu
                element.html(scope.hitzak_markatu.hipertranskribapena);
                
                // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
                initTranscript(scope, element, attrs, scope.pop, scope.hitzak_markatu.akatsak);
                
            });
            
        }
    }
    
}])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('galderaErantzunakHipertranskribapena', ['Zerbitzaria', function(Zerbitzaria) {
    
    var dataMs = "data-ms";
    
    var initTranscript = function(scope, element, attrs) {
    }
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            var id_ariketa = 1;
            var id_hizkuntza = 1;
            
            var promise = Zerbitzaria.eskuratuGalderaErantzunak(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                galdera_erantzunak = Zerbitzaria.galdera_erantzunak;
                
                console.log(galdera_erantzunak);
                
                scope.izena = galdera_erantzunak.izena;
                
                if (galdera_erantzunak.ikus_entzunezkoa.mota === "bideoa") {
                    
                    pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            m4v: Zerbitzaria.oinarrizko_url + galdera_erantzunak.ikus_entzunezkoa.bideo_path + galdera_erantzunak.ikus_entzunezkoa.bideo_mp4,
                            webmv: Zerbitzaria.oinarrizko_url + galdera_erantzunak.ikus_entzunezkoa.bideo_path + galdera_erantzunak.ikus_entzunezkoa.bideo_webm
                        },
                        options: {
                            solution: "html",
                            supplied: "m4v, webmv"
                        }
                    });
                    
                } else if (galdera_erantzunak.ikus_entzunezkoa.mota === "audioa") {
                    
                    pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            mp3: Zerbitzaria.oinarrizko_url + galdera_erantzunak.ikus_entzunezkoa.audio_path + galdera_erantzunak.ikus_entzunezkoa.audio_mp3,
                            ogg: Zerbitzaria.oinarrizko_url + galdera_erantzunak.ikus_entzunezkoa.audio_path + galdera_erantzunak.ikus_entzunezkoa.audio_ogg
                        },
                        options: {
                            solution: "html",
                            supplied: "mp3, ogg"
                        }
                    });
                    
                }
                
                for (var i = 0; i < galdera_erantzunak.galderak.length; i++) {
                    
                    pop.code({
                        
                        start: galdera_erantzunak.galderak[i].denbora,
                        end: galdera_erantzunak.galderak[i].denbora + 1,
                        onStart: function() {
                            
                            pop.pause();
                            
                            // Dagokion galdera prestatu.
                            bistaratu_galdera();
                            
                            $scope.modal.show();
                            
                        }
                        
                    });
                    
                }
                
                // Multimedia amaitzean bistaratu beharreko galderak badaude...
                if (galdera_erantzunak.amaierako_galderak.length > 0) {
                    
                    pop.on("ended", function() {
                        
                        // Dagokion galdera prestatu.
                        bistaratu_galdera();
                        
                        $scope.modal.show();
                        
                    });
                    
                }
                
                if (galdera_erantzunak.galderak.length > 0) {
                    
                    // Galderak objektu berri bat sortu
                    galderak = new Galderak({
                        
                        galderak_desordenatu: false
                        
                    });
                    
                }
                
                if (galdera_erantzunak.amaierako_galderak.length > 0) {
                    
                    // Amaierako galderentzat objektu berri bat sortu.
                    amaierako_galderak = new Galderak({
                        
                        galderak_desordenatu: true
                        
                    });
                    
                }
                
                for (var i = 0; i < galdera_erantzunak.galderak.length; i++) {
                    
                    galderak.gehitu_galdera({
                        id_galdera: i,
                        testua: galdera_erantzunak.galderak[i].galdera,
                        noiz: galdera_erantzunak.galderak[i].denbora
                    });
                    
                    for (var j = 0; j < galdera_erantzunak.galderak[i].erantzunak.length; j++) {
                        
                        galderak.gehitu_erantzuna(i,
                                                  j,
                                                  galdera_erantzunak.galderak[i].erantzunak[j].erantzuna,
                                                  galdera_erantzunak.galderak[i].erantzunak[j].zuzena);
                        
                    }
                }
                
                for (var i = 0; i < galdera_erantzunak.amaierako_galderak.length; i++) {
                    
                    amaierako_galderak.gehitu_galdera({
                        id_galdera: i,
                        testua: galdera_erantzunak.amaierako_galderak[i].galdera,
                        noiz: galdera_erantzunak.amaierako_galderak[i].denbora
                    });
                    
                    for (var j = 0; j < galdera_erantzunak.amaierako_galderak[i].erantzunak.length; j++) {
                        
                        amaierako_galderak.gehitu_erantzuna(i,
                                                            j,
                                                            galdera_erantzunak.amaierako_galderak[i].erantzunak[j].erantzuna,
                                                            galdera_erantzunak.amaierako_galderak[i].erantzunak[j].zuzena);
                        
                    }
                }
                
                // Hasteko prestatu
                galderak && galderak.hasieratu();
                amaierako_galderak && amaierako_galderak.hasieratu();
                
                // Azpitituluen fitxategia parseatu bistaratzeko.
                //pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
                
                // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
                //initTranscript(pop, $scope.hutsuneak_bete.hutsuneak);
                
            });
            
        }
    }
    
}]);