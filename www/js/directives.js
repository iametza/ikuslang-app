angular.module('ikuslang-app.directives', [])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('hutsuneakBeteHipertranskribapena', ['Zerbitzaria', function(Zerbitzaria) {
    
    var dataMs = "data-ms";
    
    var initTranscript = function(scope, element, attrs, p, hutsuneak) {
        
        var hutsune_kopurua = hutsuneak.length;
        var hitz_kopurua;
        var hutsunearen_testua = "";
        var $spana;
        
        // Hutsunearen testuari kendutako !az karaktereak
        var kendutako_karaktereak = "";
        
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
            
            hitz_kopurua = hutsuneak[i].hitzak.length;
            
            hutsunearen_testua = "";
            
            kendutako_karaktereak = "";
            
            // Hitz bat baino gehiagoko hutsueneen kasuan bakarrik sartzen da while begizta honetan.
            while (--hitz_kopurua) {
                
                // Hutsunearen testua osatzen joan.
                hutsunearen_testua = hutsuneak[i].hitzak[hitz_kopurua].testua + " " + hutsunearen_testua;
                
                // Span-a ezabatu.
                $("span[data-ms='" + hutsuneak[i].hitzak[hitz_kopurua].denbora + "']", element).remove();
                
            }
            
            // Lehen hitza gehitu hutsunearen testuari. Hitz bakarreko hutsunea bada, hau izango da hitz bakarra.
            hutsunearen_testua = hutsuneak[i].hitzak[0].testua + " " + hutsunearen_testua;
            
            // Bukaerako zuriunea kendu.
            hutsunearen_testua = $.trim(hutsunearen_testua);
            
            console.log(hutsunearen_testua);
            //console.log(hutsunearen_testua.replace(/\W/g, ''));
            
            while(/[^a-zA-Z0-9]/.test(hutsunearen_testua.charAt(hutsunearen_testua.length - 1))) {
                
                kendutako_karaktereak = hutsunearen_testua.charAt(hutsunearen_testua.length - 1) + kendutako_karaktereak;
                
                hutsunearen_testua = hutsunearen_testua.substring(0, hutsunearen_testua.length - 1);
                
            }
            
            console.log(kendutako_karaktereak);
            console.log(hutsunearen_testua);
            
            console.log(hutsuneak[i]);
            
            // Lehen hitzaren span-a input text batekin ordezkatu.
            $("span[data-ms='" + hutsuneak[i].hitzak[0].denbora + "']", element).replaceWith("<input type='text' class='hutsuneak-bete-input' data-id-hutsunea='" + hutsuneak[i].id + "' data-testua='" + hutsunearen_testua + "' />");
            
            if (kendutako_karaktereak.length > 0) {
                
                $("input[data-id-hutsunea='" + hutsuneak[i].id + "']").after("<span>" + kendutako_karaktereak + "</span>");
                
            }
            
        }
        
        // Hipertranskribapenaren altuera egokitu pantailaren neurrietara.
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia").height(window.screen.height                                   // Pantailaren altuera
                                                                     - $("ion-nav-bar").outerHeight(true)                   // Nabigazio barraren altuera osoa
                                                                     - 10);                                                 // Beheko margina
        
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
            
            var id_ariketa = scope.id_ariketa;
            var id_hizkuntza = 1;
            
            var promise = Zerbitzaria.eskuratuHutsuneakBete(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                scope.hutsuneak_bete = Zerbitzaria.hutsuneak_bete;
                
                console.log(scope.hutsuneak_bete);
                
                scope.izena = scope.hutsuneak_bete.izena;
                
                if (scope.hutsuneak_bete.mota === "bideoa") {
                    
                    scope.$parent.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            m4v: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.bideo_path + scope.hutsuneak_bete.bideo_mp4,
                            webmv: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.bideo_path + scope.hutsuneak_bete.bideo_webm
                        },
                        options: {
                            solution: "html",
                            supplied: "m4v, webmv"
                        }
                    });
                    
                } else if (scope.hutsuneak_bete.mota === "audioa") {
                    
                    scope.$parent.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            mp3: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.audio_path + scope.hutsuneak_bete.audio_mp3,
                            oga: Zerbitzaria.oinarrizko_url + scope.hutsuneak_bete.audio_path + scope.hutsuneak_bete.audio_ogg
                        },
                        options: {
                            solution: "html",
                            supplied: "mp3, oga"
                        }
                    });
                    
                }
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
.directive('hitzakMarkatuHipertranskribapena', ['$compile', 'Erabiltzailea', 'Zerbitzaria', function($compile, Erabiltzailea, Zerbitzaria) {
    
    var dataMs = "data-ms";
    
    var hitzak_markatu = {};
    
    var initTranscript = function(scope, element, attrs, p, hutsuneak) {
        
        var akats_kopurua = hitzak_markatu.akatsak.length;
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
            
            hitz_kopurua = hitzak_markatu.akatsak[i].hitzak.length;
            
            for (var j = 0; j < hitz_kopurua; j++) {
                
                $("span[data-ms='" + hitzak_markatu.akatsak[i].hitzak[j].denbora + "']", element).text(hitzak_markatu.akatsak[i].hitzak[j].okerra);
                
                $("span[data-ms='" + hitzak_markatu.akatsak[i].hitzak[j].denbora + "']", element).attr("data-id-akatsa", hitzak_markatu.akatsak[i].id);
                
            }
            
        }
        
        // Hipertranskribapenaren altuera egokitu pantailaren neurrietara.
        // Izenburuaren altuera?
        $("#hitzak-markatu-hipertranskribapena-edukinontzia").height(window.screen.height                                   // Pantailaren altuera
                                                                     - $("ion-nav-bar").outerHeight(true)                   // Nabigazio barraren altuera osoa
                                                                     - $("#hitzak-markatu-hitz-ontzia").outerHeight(true)   // Hitz-ontziaren altuera osoa
                                                                     - 10);                                                 // Beheko margina.
        
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
        
        $(document).on("click", "#hitzak-markatu-zuzendu-botoia", function() {
            
            // Momentuko erantzuna zuzena den ala ez adierazten du.
            var zuzena_da = false;
            
            var akats_kopurua = hitzak_markatu.akatsak.length;
            
            var zuzenak = [];
            var okerrak = [];
            
            // Erabiltzaileak zerrendara gehitutako erantzun zuzen eta okerren hitzen denborak, hipertranskribapenean nabarmentzeko.
            var zuzenen_denborak = [];
            var okerren_denborak = [];
            
            // Elementuaren id-a eskuratuko dugu.
            var id_akatsa;
            
            scope.pop.pause();
            
            $("#hitzak-markatu-hitz-ontzia .hitzak-markatu-hitz-ontzia-spana").each(function() {
                
                // Erantzunaren denborak eskuratuko ditugu.
                var denborak = [$(this).attr("data-ms")];
                
                // Kontrakoa frogatu bitartean erantzuna okerra da:
                zuzena_da = false;
                
                // Erantzuna zuzena den ala ez ikusteko akats guztiak pasako ditugu banan bana.
                for (var i = 0; i < akats_kopurua; i++) {
                    
                    // Erantzunaren hitzen denborak akatsekoekin bat datozen begiratuko dugu.
                    for (var j = 0; j < hitzak_markatu.akatsak[i].hitzak.length; j++) {
                        
                        if (hitzak_markatu.akatsak[i].hitzak[j].denbora == denborak[j]) {
                            
                            zuzena_da = true;
                            
                        } else {
                            
                            // Erantzuneko denbora bat ez datorrenez bat ez dago egiaztatzen jarraitu beharrik.
                            break;
                            
                        }
                        
                    }
                    
                    if (zuzena_da) {
                        
                        // Erantzuna zuzena denez begiztatik atera gaitezke.
                        break;
                        
                    }
                    
                }
                
                if (zuzena_da) {
                    
                    // Erantzun zuzenaren estiloa eman zerrendako elementu honi.
                    $(this).addClass("hitzak-markatu-zerrenda-erantzun-zuzena");
                    
                    // Hitzen denborak zuzenen zerrendan gordeko ditugu.
                    zuzenen_denborak = zuzenen_denborak.concat(denborak);
                    
                    id_akatsa = $(this).attr("data-id-akatsa");
                    
                    zuzenak.push(id_akatsa);
                    
                } else {
                    
                    // Erantzun okerraren estiloa eman zerrendako elementu honi.
                    $(this).addClass("hitzak-markatu-zerrenda-erantzun-okerra");
                    
                    // Hitzen denborak okerren zerrendan gordeko ditugu.
                    okerren_denborak = okerren_denborak.concat(denborak);
                    
                }
                
            });
            
            // zuzenen_denborak: Erabiltzaileak aurkitutako akatsen denboren zerrenda -> berdez.
            // okerren_denborak: Erabiltzaileak zerrendara gehitu dituen baina akatsak ez ziren hitzen zerrenda. -> Oraingoz ez dugu erabiliko.
            // akatsak: Aurkitu beharreko akats guztiak biltzen dituen objektuen arraya.
            
            zuzen_kopurua = zuzenen_denborak.length;
            
            // Zerrendara gehitutako akatsei (asmatutakoak) dagokien estiloa emango diegu transkribapenean.
            for (var i = 0; i < zuzen_kopurua; i++) {
                
                // Erantzun zuzenaren estiloa eman hipertranskribapeneko elementu honi.
                $("#hitzak-markatu-hipertranskribapena-edukinontzia span[data-ms='" + zuzenen_denborak[i] + "']").addClass("hitzak-markatu-hipertranskribapena-erantzun-zuzena");
                
            }
            
            // Erabiltzaileak aurkitu ez dituen akatsak aurkitu behar ditugu.
            for (var i = 0; i < akats_kopurua; i++) {
                
                hitz_kopurua = hitzak_markatu.akatsak[i].hitzak.length;
                
                for (var j = 0; j < hitz_kopurua; j++) {
                    
                    // Dagoeneko erantzun zuzenaren estiloa eman ez badiogu erantzun okerraren estiloa eman hipertranskribapeneko elementu honi.
                    if (!$("#hitzak-markatu-hipertranskribapena-edukinontzia span[data-ms='" + hitzak_markatu.akatsak[i].hitzak[j].denbora + "']").hasClass("hitzak-markatu-hipertranskribapena-erantzun-zuzena")) {
                        
                        // Akatsaren lehen hitza bada okerren zerrendara gehituko dugu bere id-a.
                        if (j === 0) {
                            
                            id_akatsa = $("#hitzak-markatu-hipertranskribapena-edukinontzia span[data-ms='" + hitzak_markatu.akatsak[i].hitzak[j].denbora + "']").attr("data-id-akatsa");
                            
                            // Erantzun okerraren estiloa eman hipertranskribapeneko elementu honi.
                            $("#hitzak-markatu-hipertranskribapena-edukinontzia span[data-ms='" + hitzak_markatu.akatsak[i].hitzak[j].denbora + "']").addClass("hitzak-markatu-hipertranskribapena-erantzun-okerra");
                            
                            okerrak.push(id_akatsa);
                            
                        }
                        
                    }
                    
                }
                
            }
            
            Zerbitzaria.bidaliEmaitzak(scope.id_ikasgaia, scope.id_ariketa, Erabiltzailea.eskuratuId(), zuzenak, okerrak);
            
            scope.emaitzenModala.show();
            
            // Ez zait batere gustatzen hau, baina funtzionatzen du.
            $(".emaitzak-modala-zuzenak").text(zuzenak.length);
            $(".emaitzak-modala-okerrak").text(okerrak.length);
        });
        
        $(document).on("click", "#hitzak-markatu-berriz-hasi-botoia", function() {
            
            // Ikus-entzunezkoa hasierara eraman.
            scope.pop.currentTime(0);
            
            scope.$parent.$apply(function () {
                scope.$parent.zuzenduta = false;
            });
            
            // Hitz ontzia hustu.
            $("#hitzak-markatu-hitz-ontzia").empty();
            
            // Hipertranskribapeneko hitzei klaseak kendu.
            $("#hitzak-markatu-hipertranskribapena-edukinontzia span").each(function(i) {
                $(this).removeClass("hitzak-markatu-hipertranskribapena-erantzun-okerra").removeClass("hitzak-markatu-hipertranskribapena-erantzun-zuzena");
            })
            
        });
        
    }
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            var id_ariketa = scope.id_ariketa;
            var id_hizkuntza = 1;
            
            var promise = Zerbitzaria.eskuratuHitzakMarkatu(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                hitzak_markatu = Zerbitzaria.hitzak_markatu;
                
                console.log(hitzak_markatu);
                
                scope.izena = hitzak_markatu.izena;
                
                if (hitzak_markatu.mota === "bideoa") {
                    
                    scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            m4v: Zerbitzaria.oinarrizko_url + hitzak_markatu.bideo_path + hitzak_markatu.bideo_mp4,
                            webmv: Zerbitzaria.oinarrizko_url + hitzak_markatu.bideo_path + hitzak_markatu.bideo_webm
                        },
                        options: {
                            solution: "html",
                            supplied: "m4v, webmv"
                        }
                    });
                    
                } else if (hitzak_markatu.mota === "audioa") {
                    
                    scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                        media: {
                            mp3: Zerbitzaria.oinarrizko_url + hitzak_markatu.audio_path + hitzak_markatu.audio_mp3,
                            oga: Zerbitzaria.oinarrizko_url + hitzak_markatu.audio_path + hitzak_markatu.audio_ogg
                        },
                        options: {
                            solution: "html",
                            supplied: "mp3, oga"
                        }
                    });
                    
                }
                
                // Azpitituluen fitxategia parseatu bistaratzeko.
                //$scope.pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
                
                // Hipertranskribapenaren testua bistaratu
                element.html(hitzak_markatu.hipertranskribapena);
                
                // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
                initTranscript(scope, element, attrs, scope.pop, hitzak_markatu.akatsak);
                
            });
            
        }
    }
    
}])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('galderaErantzunakHipertranskribapena', ['Zerbitzaria', function(Zerbitzaria) {
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            var id_ariketa = scope.id_ariketa;
            var id_hizkuntza = 1;
            
            var galdera_erantzunak = [];
            
            var galderak = false;
            var amaierako_galderak = false;
            
            // Galdera arruntak bukatu diren ala ez. Amaierako galderak ez ditu kontutan hartzen.
            var galderak_bukatu_dira = false;
            
            var pop;
            
            var dataMs = "data-ms";
            
            var promise = Zerbitzaria.eskuratuGalderaErantzunak(id_ariketa, id_hizkuntza);
            
            promise.then(function() {
                
                galdera_erantzunak = Zerbitzaria.galdera_erantzunak;
                
                console.log(galdera_erantzunak);
                
                scope.izena = galdera_erantzunak.izena;
                
                // Hipertranskribapenaren testua bistaratu
                element.html(galdera_erantzunak.ikus_entzunezkoa.hipertranskribapena);
                
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
                            
                            scope.modal.show();
                            
                            // Dagokion galdera prestatu.
                            bistaratu_galdera();
                            
                        }
                        
                    });
                    
                }
                
                // Multimedia amaitzean bistaratu beharreko galderak badaude...
                if (galdera_erantzunak.amaierako_galderak.length > 0) {
                    
                    pop.on("ended", function() {
                        
                        scope.modal.show();
                        
                        // Dagokion galdera prestatu.
                        bistaratu_galdera();
                        
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
                initTranscript(pop);
                
            });
            
            var initTranscript = function(p) {
                
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
                
            }
            
            // Dagokion galdera bistaratzen du
            var bistaratu_galdera = function() {
                
                bistaratu_zuzen_kopurua();
                
                bistaratu_oker_kopurua();
                
                bistaratu_zenbagarrena();
                
                bistaratu_galdera_kopurua();
                
                // Hasieran aurrera joateko botoiak desgaituta egon behar du
                desgaitu_botoia("#galdera-erantzunak-aurrera-botoia");
                
                // Erabiltzaileari erantzuteko aukera eman
                if (!galderak_bukatu_dira
                    && galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    galderak.gaitu_erantzunak();
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    amaierako_galderak.gaitu_erantzunak();
                    
                }
                
                if (!galderak_bukatu_dira
                    && galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    // Galderaren id-a gorde atributu pertsonalizatu batean
                    $("#galdera").attr("data-id", galderak.itzuli_id_galdera());
                    
                    // Galderaren testua bistaratu
                    $("#galdera").text(galderak.itzuli_galderaren_testua());
                    
                    // Galderari dagozkion erantzunen id-en arraya eskuratu (desordenatuta)
                    var id_erantzunak = galderak.itzuli_id_erantzunak();
                    
                    // Galdera motaren arabera beharrezko fitxategia kargatu
                    if (galderak.itzuli_mota() == 'irudia') {
                        
                        // Dagokion irudia bistaratzeko img bat sortu dagokion lekuan
                        $("#galdera_kontainer").prepend("<img id='irudia' src='" + galderak.itzuli_fitxategia() + "'>");
                        
                    } else if (galderak.itzuli_mota() == 'soinua') {
                        
                        // Play botoia bistaratu
                        //$("#play").css("visibility", "visible");
                        
                        $("#galdera_kontainer").prepend("<img id='play' src='<?php echo URL_BASE; ?>img/galdera_erantzunak/play.png'>");
                        
                        $("#play").click(function() {
                            erreproduzitu_soinua();
                        });
                        
                        // soundManager.play(galderak.itzuli_fitxategia());
                    }
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    // Galderaren id-a gorde atributu pertsonalizatu batean
                    $("#galdera").attr("data-id", amaierako_galderak.itzuli_id_galdera());
                    
                    // Galderaren testua bistaratu
                    $("#galdera").text(amaierako_galderak.itzuli_galderaren_testua());
                    
                    // Galderari dagozkion erantzunen id-en arraya eskuratu (desordenatuta)
                    var id_erantzunak = amaierako_galderak.itzuli_id_erantzunak();
                    
                    // Galdera motaren arabera beharrezko fitxategia kargatu
                    if (amaierako_galderak.itzuli_mota() == 'irudia') {
                        
                        // Dagokion irudia bistaratzeko img bat sortu dagokion lekuan
                        $("#galdera_kontainer").prepend("<img id='irudia' src='" + galderak.itzuli_fitxategia() + "'>");
                        
                    } else if (amaierako_galderak.itzuli_mota() == 'soinua') {
                        
                        // Play botoia bistaratu
                        //$("#play").css("visibility", "visible");
                        
                        $("#galdera_kontainer").prepend("<img id='play' src='<?php echo URL_BASE; ?>img/galdera_erantzunak/play.png'>");
                        
                        $("#play").click(function() {
                            erreproduzitu_soinua();
                        });
                        
                        // soundManager.play(galderak.itzuli_fitxategia());
                    }
                    
                }
                
                // Galdera erantzunanitzaren div-ak ezabatu
                $(".erantzunanitza_div").remove();
                
                if (!galderak_bukatu_dira
                    && galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    /*
                     * Galdera honen eta aurrekoaren erantzun kopurua ez bada berdina,
                     * aurreko div-ak ezabatu eta behar adina div sortu 
                     */
                    if (galderak.itzuli_erantzun_mota() != "mapa") {
                        
                        // Aurreko galderako mapa ezabatu
                        $("#chaptersMap").empty();
                        
                        // Galdera erantzunanitzetan aurreko erantzunen div-ak ezabatu behar dira,
                        // bestela aurreko galderaren erantzun kopurua berdina denean ez da agertzen checkbox-ik
                        if (id_erantzunak.length != $("#erantzunak div").size()
                            || galderak.erantzunanitza_da()) {
                            
                            ezabatu_aurreko_erantzunen_divak();
                            sortu_erantzunen_divak();
                            
                        }
                        
                    } else {
                        
                        // Aurreko galderaren divak ezabatu
                        // (behar bada ezkutatzearekin nahikoa litzateke)
                        ezabatu_aurreko_erantzunen_divak();
                        
                        /*
                         * EGITEKO: Aurreko galderaren mapa berdina bada ez dago kargatu beharrik.
                         * Orain mapa berdina izanda ere berriz kargatzen du.
                         */
                        
                        // Aurreko galderako mapa ezabatu
                        $("#chaptersMap").empty();
                        
                        // Mapa berria kargatu
                        prestatu_mapa(galderak.itzuli_fitxategia());
                    }
                    
                    // Zuzendu botoia galdera erantzunanitzetan bakarrik bistaratu
                    if (galderak.erantzunanitza_da()) {
                        
                        //$("#zuzendu").css("visibility", "visible");
                        $("#zuzendu").show();
                        
                        gaitu_botoia($("#galdera-erantzunak-aurrera-botoia"));
                        
                    } else {
                        
                        //$("#zuzendu").css("visibility", "hidden");
                        $("#zuzendu").hide();
                        
                    }
                    
                    // Erantzunak bistaratu
                    if (galderak.itzuli_erantzun_mota() != "mapa") {
                        
                        for (var i = 0; i < id_erantzunak.length; i++){
                            
                            // Erantzunaren div-aren atzeko planoa kolore lehenetsira berrezarri
                            $("#erantzuna" + i).removeClass("erantzun_zuzena");
                            $("#erantzuna" + i).removeClass("erantzun_okerra");
                            //$("#erantzuna" + i).css("background", "#fff");
                            
                            // Erantzunaren testua bistaratu
                            $("#erantzuna" + i).text(galderak.itzuli_erantzunaren_testua(id_erantzunak[i]));
                            
                            // Erantzunaren id_erantzuna gorde atributu pertsonalizatu batean
                            $("#erantzuna" + i).attr("data-id", id_erantzunak[i]);
                            
                        }
                        
                    } else {
                        
                        for (var i = 0; i < id_erantzunak.length; i++) {
                            
                            // Erantzunaren bidearen atzeko planoa kolore lehenetsira berrezarri
                            //$("#erantzuna" + i).attr("fill", "#898989");
                            
                        }
                        
                    }
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    /*
                     * Galdera honen eta aurrekoaren erantzun kopurua ez bada berdina,
                     * aurreko div-ak ezabatu eta behar adina div sortu 
                     */
                    if (amaierako_galderak.itzuli_erantzun_mota() != "mapa") {
                        
                        // Aurreko galderako mapa ezabatu
                        $("#chaptersMap").empty();
                        
                        // Galdera erantzunanitzetan aurreko erantzunen div-ak ezabatu behar dira,
                        // bestela aurreko galderaren erantzun kopurua berdina denean ez da agertzen checkbox-ik
                        if (id_erantzunak.length != $("#erantzunak div").size()
                            || amaierako_galderak.erantzunanitza_da()) {
                            
                            ezabatu_aurreko_erantzunen_divak();
                            sortu_erantzunen_divak();
                            
                        }
                        
                    } else {
                        
                        // Aurreko galderaren divak ezabatu
                        // (behar bada ezkutatzearekin nahikoa litzateke)
                        ezabatu_aurreko_erantzunen_divak();
                        
                        /*
                         * EGITEKO: Aurreko galderaren mapa berdina bada ez dago kargatu beharrik.
                         * Orain mapa berdina izanda ere berriz kargatzen du.
                         */
                        
                        // Aurreko galderako mapa ezabatu
                        $("#chaptersMap").empty();
                        
                        // Mapa berria kargatu
                        prestatu_mapa(amaierako_galderak.itzuli_fitxategia());
                        
                    }
                    
                    // Zuzendu botoia galdera erantzunanitzetan bakarrik bistaratu
                    if (amaierako_galderak.erantzunanitza_da()) {
                        
                        //$("#zuzendu").css("visibility", "visible");
                        $("#zuzendu").show();
                        
                        gaitu_botoia($("#galdera-erantzunak-aurrera-botoia"));
                        
                    } else {
                        
                        //$("#zuzendu").css("visibility", "hidden");
                        $("#zuzendu").hide();
                        
                    }
                    
                    // Erantzunak bistaratu
                    if (amaierako_galderak.itzuli_erantzun_mota() != "mapa") {
                        
                        for (var i = 0; i < id_erantzunak.length; i++) {
                            
                            // Erantzunaren div-aren atzeko planoa kolore lehenetsira berrezarri
                            $("#erantzuna" + i).removeClass("erantzun_zuzena");
                            $("#erantzuna" + i).removeClass("erantzun_okerra");
                            //$("#erantzuna" + i).css("background", "#fff");
                            
                            // Erantzunaren testua bistaratu
                            $("#erantzuna" + i).text(amaierako_galderak.itzuli_erantzunaren_testua(id_erantzunak[i]));
                            
                            // Erantzunaren id_erantzuna gorde atributu pertsonalizatu batean
                            $("#erantzuna" + i).attr("data-id", id_erantzunak[i]);
                            
                        }
                        
                    } else {
                        
                        for (var i = 0; i < id_erantzunak.length; i++) {
                            
                            // Erantzunaren bidearen atzeko planoa kolore lehenetsira berrezarri
                            //$("#erantzuna" + i).attr("fill", "#898989");
                            
                        }
                        
                    }
                    
                }
                
            }
            
            var bistaratu_zenbagarrena =  function() {
                
                var zenbagarrena = 0;
                
                if (galderak && amaierako_galderak) {
                    
                    zenbagarrena = galderak.itzuli_zenbagarren_galdera() + amaierako_galderak.itzuli_zenbagarren_galdera() - 1;
                    
                } else if (galderak) {
                    
                    zenbagarrena = galderak.itzuli_zenbagarren_galdera();
                    
                } else if (amaierako_galderak) {
                    
                    zenbagarrena = amaierako_galderak.itzuli_zenbagarren_galdera();
                    
                }
                
                $("#unekoa").text(zenbagarrena);
            }
            
            var bistaratu_zuzen_kopurua =  function() {
                
                var zuzen_kopurua = 0;
                
                if (galderak) {
                    
                    zuzen_kopurua = zuzen_kopurua + galderak.itzuli_erantzun_zuzen_kopurua();
                    
                }
                
                if (amaierako_galderak) {
                    
                    zuzen_kopurua = zuzen_kopurua + amaierako_galderak.itzuli_erantzun_zuzen_kopurua();
                    
                }
                
                $("#zuzenak").text(zuzen_kopurua);
            }
            
            var bistaratu_oker_kopurua =  function() {
                
                var oker_kopurua = 0;
                
                if (galderak) {
                    
                    oker_kopurua = oker_kopurua + galderak.itzuli_erantzun_oker_kopurua();
                    
                }
                
                if (amaierako_galderak) {
                    
                    oker_kopurua = oker_kopurua + amaierako_galderak.itzuli_erantzun_oker_kopurua();
                    
                }
                
                $("#okerrak").text(oker_kopurua);
                
            }
            
            var bistaratu_galdera_kopurua =  function() {
                
                var galdera_kopurua = 0;
                
                if (galderak) {
                    
                    galdera_kopurua = galdera_kopurua + galderak.itzuli_galdera_kopurua();
                    
                }
                
                if (amaierako_galderak) {
                    
                    galdera_kopurua = galdera_kopurua + amaierako_galderak.itzuli_galdera_kopurua();
                    
                }
                
                $("#guztira").text(galdera_kopurua);
            }
            
            // Emandako id-a duen botoia desgaitu
            var desgaitu_botoia = function(id) {
                
                //$(id).attr("disabled", true);
                $(id).css("visibility", "hidden");
                
            }
            
            // Emandako id-a duen botoia gaitu
            var gaitu_botoia = function(id) {
                
                //$(id).attr("disabled", false);
                $(id).css("visibility", "visible");
                
            }
            
            var ezabatu_aurreko_erantzunen_divak = function() {
                
                $("#erantzunak div").remove();
                
            }
            
            var sortu_erantzunen_divak = function() {
                
                if (galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    // Erantzun bakoitzaren div-a sortu eta klik maneiatzailea gehitu
                    var erantzun_kop = galderak.itzuli_erantzun_kopurua();
                    
                    for (var i = 0; i < erantzun_kop; i++){
                        
                        // Erantzunentzat behar adina div sortu
                        if (galderak.erantzunanitza_da()) {
                            
                            $("#erantzunak").append("<div class='erantzunanitza_div' id='erantzunanitza" + i + "'><input type='checkbox' id='check" + i + "' ><span class='erantzuna_span' id='erantzuna" + i + "'></span></div>");
                            
                        } else {
                            
                            $("#erantzunak").append("<div class='erantzuna_div' id='erantzuna" + i + "'></div>");
                            $("#erantzuna" + i).click(erantzun_klik_maneiatzailea);
                            
                        }
                        
                    }
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    // Erantzun bakoitzaren div-a sortu eta klik maneiatzailea gehitu
                    var erantzun_kop = amaierako_galderak.itzuli_erantzun_kopurua();
                    
                    for (var i = 0; i < erantzun_kop; i++){
                        
                        // Erantzunentzat behar adina div sortu
                        if (amaierako_galderak.erantzunanitza_da()) {
                            
                            $("#erantzunak").append("<div class='erantzunanitza_div' id='erantzunanitza" + i + "'><input type='checkbox' id='check" + i + "' ><span class='erantzuna_span' id='erantzuna" + i + "'></span></div>");
                            
                        } else {
                            
                            $("#erantzunak").append("<div class='erantzuna_div' id='erantzuna" + i + "'></div>");
                            $("#erantzuna" + i).click(erantzun_klik_maneiatzailea);
                            
                        }
                        
                    }
                    
                }
                
            }
            
            var erantzun_klik_maneiatzailea = function() {
                
                if (galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    // Erantzunak gaituta badaude
                    if (galderak.itzuli_erantzunak_gaituta()) {
                        
                        // Erantzuna zuzena bada
                        if (galderak.erantzun_zuzena_da($(this).attr("data-id")) == true){
                            
                            //alert("oso ondo");
                            
                            // Erantzun okerrari dagokion estiloa aplikatu
                            $(this).addClass("erantzun_zuzena");
                            
                            // Erantzun zuzenari dagokion soinua erreproduzitu
                            // soundManager.play('erantzun_zuzena');
                            
                            scope.zuzen_kop = scope.zuzen_kop + 1;
                            
                            galderak.erantzun_zuzenak_gehi_bat();
                            bistaratu_zuzen_kopurua();
                            
                        } else { // okerra bada berriz
                            
                            //alert("oker");
                            
                            // Erantzun okerrari dagokion estiloa aplikatu
                            $(this).addClass("erantzun_okerra");
                            
                            // Erantzun okerrari dagokion soinua erreproduzitu
                            // soundManager.play('erantzun_okerra');
                                
                            // Erantzun zuzenari/ei dagokion/en estiloa aplikatu
                            var erantzun_zuzenak = galderak.itzuli_erantzun_zuzenak();
                            
                            for (var i = 0; i < erantzun_zuzenak.length; i++) {
                                $("#erantzuna" + erantzun_zuzenak[i]).addClass("erantzun_zuzena");
                            }
                            
                            scope.oker_kop = scope.oker_kop + 1;
                            
                            galderak.erantzun_okerrak_gehi_bat();
                            bistaratu_oker_kopurua();
                            
                        }
                        
                        // Erabiltzaileari ez utzi berriz erantzuten
                        galderak.desgaitu_erantzunak();
                        
                        // Aurrera joateko botoia gaitu
                        gaitu_botoia("#galdera-erantzunak-aurrera-botoia");
                        
                    }
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    // Erantzunak gaituta badaude
                    if (amaierako_galderak.itzuli_erantzunak_gaituta()) {
                        
                        // Erantzuna zuzena bada
                        if (amaierako_galderak.erantzun_zuzena_da($(this).attr("data-id")) == true){
                            
                            //alert("oso ondo");
                            
                            // Erantzun okerrari dagokion estiloa aplikatu
                            $(this).addClass("erantzun_zuzena");
                            
                            // Erantzun zuzenari dagokion soinua erreproduzitu
                            // soundManager.play('erantzun_zuzena');
                            
                            scope.zuzen_kop = scope.zuzen_kop + 1;
                            
                            amaierako_galderak.erantzun_zuzenak_gehi_bat();
                            
                            bistaratu_zuzen_kopurua();
                            
                        } else { // okerra bada berriz
                            
                            //alert("oker");
                            
                            // Erantzun okerrari dagokion estiloa aplikatu
                            $(this).addClass("erantzun_okerra");
                            
                            // Erantzun okerrari dagokion soinua erreproduzitu
                            // soundManager.play('erantzun_okerra');
                            
                            // Erantzun zuzenari/ei dagokion/en estiloa aplikatu
                            var erantzun_zuzenak = amaierako_galderak.itzuli_erantzun_zuzenak();
                            
                            for (var i = 0; i < erantzun_zuzenak.length; i++) {
                                $("#erantzuna" + erantzun_zuzenak[i]).addClass("erantzun_zuzena");
                            }
                            
                            scope.oker_kop = scope.oker_kop + 1;
                            
                            amaierako_galderak.erantzun_okerrak_gehi_bat();
                            
                            bistaratu_oker_kopurua();
                            
                        }
                        
                        // Erabiltzaileari ez utzi berriz erantzuten
                        amaierako_galderak.desgaitu_erantzunak();
                        
                        // Aurrera joateko botoia gaitu
                        gaitu_botoia("#galdera-erantzunak-aurrera-botoia");
                        
                    }
                    
                }
                
            }
            
            var aurrera_klik = function() {
                
                // Irudiak ezkutuan daudela ziurtatu
                //$("#irudia").attr("src", "");
                $("#irudia").remove();
                
                //$("#play").css("visibility", "hidden");
                $("#play").remove();
                
                if (!galderak_bukatu_dira
                    && galderak
                    && galderak.itzuli_zenbagarren_galdera() <= galderak.itzuli_galdera_kopurua()) {
                    
                    // Sortako azken galderan bagaude edo hurrengo galdera ez bada unekoaren denbora berean.
                    if ((galderak.itzuli_zenbagarren_galdera() === galderak.itzuli_galdera_kopurua())
                        || (galderak.itzuliGalderaNoiz(galderak.itzuli_zenbagarren_galdera()) !== galderak.itzuliGalderaNoiz(galderak.itzuli_zenbagarren_galdera() + 1))) {
                        
                        // Modala ezkutatu.
                        scope.modal.hide();
                        
                        // Hurrengo galdera kargatu, gero bistaratzeko.
                        // Hurrengo galderarik ez badago false itzultzen du.
                        if (!galderak.hurrengo_galdera()) {
                            
                            galderak_bukatu_dira = true;
                            
                        }
                        
                        // Multimedia erreproduzitzen hasi berriz ere.
                        pop.play();
                        
                    } else {
                        
                        galderak.hurrengo_galdera();
                        
                        // Hurrengo galdera bistaratu
                        bistaratu_galdera();
                        
                        // Zenbagarren galdera den bistaratu
                        bistaratu_zenbagarrena();
                        
                        // Botoia desgaitu erabiltzaileari erantzun bat hautatzera behartzeko
                        desgaitu_botoia("#galdera-erantzunak-aurrera-botoia");
                        
                        // Erabiltzaileari erantzuteko aukera eman
                        galderak.gaitu_erantzunak();
                        
                    }
                    
                } else if (amaierako_galderak
                           && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
                    
                    // Sortako azken galderan bagaude
                    if (amaierako_galderak.itzuli_zenbagarren_galdera() === amaierako_galderak.itzuli_galdera_kopurua()) {
                        
                        // Modala ezkutatu.
                        scope.modal.hide();
                        
                        scope.emaitzenModala.show();
                        
                    } else {
                        
                        amaierako_galderak.hurrengo_galdera();
                        
                        // Hurrengo galdera bistaratu
                        bistaratu_galdera();
                        
                        // Zenbagarren galdera den bistaratu
                        bistaratu_zenbagarrena();
                        
                        // Botoia desgaitu erabiltzaileari erantzun bat hautatzera behartzeko
                        desgaitu_botoia("#galdera-erantzunak-aurrera-botoia");
                        
                        // Erabiltzaileari erantzuteko aukera eman
                        amaierako_galderak.gaitu_erantzunak();
                        
                    }
                    
                }
                
            }
            
            // Hipertranskribapenaren altuera egokitu pantailaren neurrietara.
            $("#galdera-erantzunak-hipertranskribapena-edukinontzia").height(window.screen.height                                   // Pantailaren altuera
                                                                     - $("ion-nav-bar").outerHeight(true)                   // Nabigazio barraren altuera osoa
                                                                     - $("#hutsuneak-bete-izenburua").outerHeight(true)     // Izenburuaren altuera osoa
                                                                     - 60);                                                 // Beheko margina. Zergatik 60???
            
            $(document).on("click", "#galdera-erantzunak-aurrera-botoia", function() {
                aurrera_klik();
            });
            
        }
    }
    
}]);