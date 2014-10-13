angular.module('ikuslang-app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
    // Erabiltzaileari aurrerapen-barra erabiliz denboran aurrera eta atzera ibiltzea galaraziko diogu.
    $.jPlayer.prototype.seekBar = function() {};
    
})

.controller('HutsuneakBeteCtrl', ['$scope', 'Zerbitzaria', function($scope, Zerbitzaria) {
    
    $scope.izena = "";
    
    $scope.hutsuneak_bete = [];
    
    $scope.pop;
    
    $scope.hasi_berriz = function() {
        
        $("#hutsuneak-bete-transkribapena-edukinontzia input").each(function() {
            $(this).val("");
            $(this).removeClass("zuzena").removeClass("okerra");
        });
        
    }
    
    $scope.egiaztatu = function() {
        
        $("#hutsuneak-bete-transkribapena-edukinontzia input").each(function() {
            
            // Erantzun okerrak ezabatu
            if($(this).attr("data-testua") === $(this).val()) {
                $(this).addClass("zuzena");
            } else {
                $(this).val("");
            }
        });
        
    }
    
    $scope.zuzendu = function() {
        
        var zuzenak = 0;
        var okerrak = 0;
        
        $("#hutsuneak-bete-transkribapena-edukinontzia input").each(function(index, elem) {                        
            if($(this).attr("data-testua") === $(this).val()) {
                $(this).addClass("zuzena");
                
                zuzenak++;
            } else {
                $(this).val($(elem).attr("data-testua"));
                $(this).addClass("okerra");
                
                okerrak++;
            }
        });
        
        alert("Emaitza: " + zuzenak + "/" + (zuzenak + okerrak));
        
    }
    
    $scope.initTranscript = function(p, hutsuneak) {
        
        var hutsune_kopurua = hutsuneak.length;
        var hitz_kopurua;
        var hutsunearen_testua = "";
        var $spana;
        var dataMs = "data-ms";
        
        $("#hutsuneak-bete-transkribapena-edukinontzia span").each(function(i) {  
            // doing p.transcript on every word is a bit inefficient - wondering if there is a better way
            p.transcript({
                time: $(this).attr(dataMs) / 1000, // seconds
                futureClass: "transcript-grey",
                target: this,
                onNewPara: function(parent) {
                    $("#hutsuneak-bete-transkribapena-edukinontzia").stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
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
                $("span[data-ms='" + hutsuneak[i][hitz_kopurua].denbora + "']").remove();
                
            }
            
            // Lehen hitza gehitu hutsunearen testuari. Hitz bakarreko hutsunea bada, hau izango da hitz bakarra.
            hutsunearen_testua = hutsuneak[i][0].testua + " " + hutsunearen_testua;
            
            // Bukaerako zuriunea kendu.
            hutsunearen_testua = $.trim(hutsunearen_testua);
            
            // Lehen hitzaren span-a input text batekin ordezkatu.
            $("span[data-ms='" + hutsuneak[i][0].denbora + "']").replaceWith("<input type='text' class='hutsuneak-bete-input' data-testua='" + hutsunearen_testua + "' />");
            
        }
        
    }
    
    // select text function
    $scope.getSelText = function() {
        var txt = '';
        if (window.getSelection){
            txt = window.getSelection();
        }
        else if (document.getSelection){
            txt = document.getSelection();
        }
        else if (document.selection){
            txt = document.selection.createRange().text;
        }          
        
        return txt;
    }
    
    $scope.eskuratuDatuak = function() {
        
        var id_ariketa = 3;
        var id_hizkuntza = 1;
        
        var promise = Zerbitzaria.eskuratuHutsuneakBete(id_ariketa, id_hizkuntza);
        
        promise.then(function() {
            
            $scope.hutsuneak_bete = Zerbitzaria.hutsuneak_bete;
            
            console.log($scope.hutsuneak_bete);
            
            $scope.izena = $scope.hutsuneak_bete.izena;
            
            $scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
                media: {
                    m4v: Zerbitzaria.oinarrizko_url + $scope.hutsuneak_bete.bideo_path + $scope.hutsuneak_bete.bideo_mp4,
                    webmv: Zerbitzaria.oinarrizko_url + $scope.hutsuneak_bete.bideo_path + $scope.hutsuneak_bete.bideo_webm
                },
                options: {
                    solution: "html",
                    supplied: "m4v, webmv"
                }
            });
            
            // Azpitituluen fitxategia parseatu bistaratzeko.
            //$scope.pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
            
            // Hipertranskribapenaren testua bistaratu
            $('#hutsuneak-bete-transkribapena-edukinontzia').html($scope.hutsuneak_bete.hipertranskribapena);
            
            // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
            $scope.initTranscript($scope.pop, $scope.hutsuneak_bete.hutsuneak);
            
        });
        
    }
    
    $scope.eskuratuDatuak();
    
}])

.controller('GalderaErantzunakCtrl', ['$scope', 'Zerbitzaria', function($scope, Zerbitzaria) {
    
    var eredua = {
        izena: ""
    };
    
    $scope.izena = eredua.izena;
    
    var galdera_erantzunak = [];
    
    var galderak = false;
    var amaierako_galderak = false;
    
    // Galdera arruntak bukatu diren ala ez. Amaierako galderak ez ditu kontutan hartzen.
    var galderak_bukatu_dira = false;
    
    var pop;
    
    var eskuratuDatuak = function() {
        
        var id_ariketa = 1;
        var id_hizkuntza = 1;
        
        var promise = Zerbitzaria.eskuratuGalderaErantzunak(id_ariketa, id_hizkuntza);
        
        promise.then(function() {
            
            galdera_erantzunak = Zerbitzaria.galdera_erantzunak;
            
            console.log(galdera_erantzunak);
            
            eredua.izena = galdera_erantzunak.izena;
            
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
                        
                        $("#galderak-modala").modal("show", {
                            backdrop: "static"
                        });
                        
                    }
                    
                });
                
            }
            
            // Multimedia amaitzean bistaratu beharreko galderak badaude...
            if (galdera_erantzunak.amaierako_galderak.length > 0) {
                
                pop.on("ended", function() {
                    
                    // Dagokion galdera prestatu.
                    bistaratu_galdera();
                    
                    $("#galderak-modala").modal("show", {
                        backdrop: "static"
                    });
                    
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
            //initTranscript(pop, hutsuneak_bete.hutsuneak);
            
        });
        
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
    
    // Dagokion galdera bistaratzen du
    var bistaratu_galdera = function() {
        
        bistaratu_zuzen_kopurua();
        
        bistaratu_oker_kopurua();
        
        bistaratu_zenbagarrena();
        
        bistaratu_galdera_kopurua();
        
        // Hasieran aurrera joateko botoiak desgaituta egon behar du
        desgaitu_botoia("#aurrera");
        
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
                
                soundManager.play(galderak.itzuli_fitxategia());
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
                
                soundManager.play(galderak.itzuli_fitxategia());
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
                
                gaitu_botoia($("#zuzendu"));
                
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
                
                gaitu_botoia($("#zuzendu"));
                
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
                $("#galderak-modala").modal("hide");
                
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
                desgaitu_botoia("#aurrera");
                
                // Erabiltzaileari erantzuteko aukera eman
                galderak.gaitu_erantzunak();
                
            }
            
        } else if (amaierako_galderak
                   && amaierako_galderak.itzuli_zenbagarren_galdera() <= amaierako_galderak.itzuli_galdera_kopurua()) {
            
            // Sortako azken galderan bagaude
            if (amaierako_galderak.itzuli_zenbagarren_galdera() === amaierako_galderak.itzuli_galdera_kopurua()) {
                
                // Modala ezkutatu.
                $("#galderak-modala").modal("hide");
                
                alert("Bukatuttuk");
                
            } else {
                
                amaierako_galderak.hurrengo_galdera();
                
                // Hurrengo galdera bistaratu
                bistaratu_galdera();
                
                // Zenbagarren galdera den bistaratu
                bistaratu_zenbagarrena();
                
                // Botoia desgaitu erabiltzaileari erantzun bat hautatzera behartzeko
                desgaitu_botoia("#aurrera");
                
                // Erabiltzaileari erantzuteko aukera eman
                amaierako_galderak.gaitu_erantzunak();
                
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
                    soundManager.play('erantzun_zuzena');
                    
                    galderak.erantzun_zuzenak_gehi_bat();
                    bistaratu_zuzen_kopurua();
                    
                } else { // okerra bada berriz
                    
                    //alert("oker");
                    
                    // Erantzun okerrari dagokion estiloa aplikatu
                    $(this).addClass("erantzun_okerra");
                    
                    // Erantzun okerrari dagokion soinua erreproduzitu
                    soundManager.play('erantzun_okerra');
                        
                    // Erantzun zuzenari/ei dagokion/en estiloa aplikatu
                    var erantzun_zuzenak = galderak.itzuli_erantzun_zuzenak();
                    
                    for (var i = 0; i < erantzun_zuzenak.length; i++) {
                        $("#erantzuna" + erantzun_zuzenak[i]).addClass("erantzun_zuzena");
                    }
                    
                    galderak.erantzun_okerrak_gehi_bat();
                    bistaratu_oker_kopurua();
                    
                }
                
                // Erabiltzaileari ez utzi berriz erantzuten
                galderak.desgaitu_erantzunak();
                
                // Aurrera joateko botoia gaitu
                gaitu_botoia("#aurrera");
                
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
                    soundManager.play('erantzun_zuzena');
                    
                    amaierako_galderak.erantzun_zuzenak_gehi_bat();
                    
                    bistaratu_zuzen_kopurua();
                    
                } else { // okerra bada berriz
                    
                    //alert("oker");
                    
                    // Erantzun okerrari dagokion estiloa aplikatu
                    $(this).addClass("erantzun_okerra");
                    
                    // Erantzun okerrari dagokion soinua erreproduzitu
                    soundManager.play('erantzun_okerra');
                    
                    // Erantzun zuzenari/ei dagokion/en estiloa aplikatu
                    var erantzun_zuzenak = amaierako_galderak.itzuli_erantzun_zuzenak();
                    
                    for (var i = 0; i < erantzun_zuzenak.length; i++) {
                        $("#erantzuna" + erantzun_zuzenak[i]).addClass("erantzun_zuzena");
                    }
                    
                    amaierako_galderak.erantzun_okerrak_gehi_bat();
                    
                    bistaratu_oker_kopurua();
                    
                }
                
                // Erabiltzaileari ez utzi berriz erantzuten
                amaierako_galderak.desgaitu_erantzunak();
                
                // Aurrera joateko botoia gaitu
                gaitu_botoia("#aurrera");
                
            }
            
        }
        
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
    
    eskuratuDatuak();
    
}])

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
