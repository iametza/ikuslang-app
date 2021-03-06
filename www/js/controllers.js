angular.module('ikuslang-app.controllers', [])

.controller('AppCtrl', function($scope) {
    
})

.controller('LoginCtrl', ['$http', '$ionicPopup', '$scope', '$state', 'Erabiltzailea', 'Zerbitzaria', function($http, $ionicPopup, $scope, $state, Erabiltzailea, Zerbitzaria) {
    
    // Form data for the login modal
    $scope.loginData = {};
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        
        $http({
            method: 'POST',
            url: Zerbitzaria.api_url + "login",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param($scope.loginData)
        })
        .success(function(data, status, headers, config) {
            
            console.log(data);
            
            Erabiltzailea.ezarriId(data.id_erabiltzailea);
            Erabiltzailea.ezarriIzena(data.izena);
            Erabiltzailea.ezarriAbizenak(data.abizenak);
            
            // Saioa hasi aurretik alertek ez dute funtzionatuko.
            // Aplikazioa atzeko planoan dagoenean saioa hasi duen azken erabiltzailearen alertak jasoko ditu.
            Zerbitzaria.erregistratuAlerta(data.id_erabiltzailea);
            
            $state.go('nire-txokoa');
            
        })
        .error(function(data, status, headers, config) {
            
            $scope.bistaratuErroreMezua(data.mezua);
            
            console.log("Fail!");
            
        });
        
    };
    
    $scope.bistaratuErroreMezua = function(testua) {
        
        var alertPopup = $ionicPopup.alert({
            title: 'Errorea',
            template: testua
        });
        
        alertPopup.then(function(res) {
            
            $scope.loginData.e_posta = "";
            $scope.loginData.pasahitza = "";
            
        });
        
    };
    
}])

.controller('NireTxokoaCtrl', ['$scope', '$state', 'Erabiltzailea', 'Zerbitzaria', function($scope, $state, Erabiltzailea, Zerbitzaria) {
    
    $scope.izena = Erabiltzailea.eskuratuIzena();
    $scope.abizenak = Erabiltzailea.eskuratuAbizenak();
    
    $scope.ariketak = {
        egitekoak: [],
        egindakoak: []
    }
    
    $scope.ikonoak = {
        '1': 'ion-shuffle',
        '2': 'ion-help',
        '3': 'ion-archive',
        '4': 'ion-compose',
        '5': 'ion-cube'
    }
    
    $scope.zeinFitxa = 'egitekoak';
    
    var id_hizkuntza = 1;
    
    var promise = Zerbitzaria.eskuratuEgitekoAriketak(Erabiltzailea.eskuratuId(), id_hizkuntza);
    
    promise.then(function() {
        
        $scope.ariketak.egitekoak = Zerbitzaria.ariketak.egitekoak;
        
    });
    
    var promise = Zerbitzaria.eskuratuEgindakoAriketak(Erabiltzailea.eskuratuId(), id_hizkuntza);
    
    promise.then(function() {
        
        $scope.ariketak.egindakoak = Zerbitzaria.ariketak.egindakoak;
        
    });
    
    $scope.amaituSaioa = function() {
        Erabiltzailea.garbitu();
        $state.go('login');
    }
    
    $scope.bistaratuAriketa = function(id_ariketa, id_ariketa_mota, id_ikasgaia) {
        
        switch (id_ariketa_mota) {
            
            case 1:
                $state.go('esaldiak-ordenatu', {
                    'id_ariketa': id_ariketa,
                    'id_ikasgaia': id_ikasgaia
                });
                break;
            
            case 2:
                $state.go('galdera-erantzunak', {
                    'id_ariketa': id_ariketa,
                    'id_ikasgaia': id_ikasgaia
                });
                break;
            
            case 3:
                $state.go('hitzak-markatu', {
                    'id_ariketa': id_ariketa,
                    'id_ikasgaia': id_ikasgaia
                });
                break;
            
            case 4:
                $state.go('hutsuneak-bete', {
                    'id_ariketa': id_ariketa,
                    'id_ikasgaia': id_ikasgaia
                });
                break;
            
            case 5:
                $state.go('multzokatu', {
                    'id_ariketa': id_ariketa,
                    'id_ikasgaia': id_ikasgaia
                });
                break;
            
            default:
                
        }
    }
    
}])

.controller('HutsuneakBeteCtrl', ['$ionicModal', '$scope', '$stateParams', 'Erabiltzailea', 'Zerbitzaria', function($ionicModal, $scope, $stateParams, Erabiltzailea, Zerbitzaria) {
    
    $scope.id_ariketa = $stateParams.id_ariketa;
    $scope.id_ikasgaia = $stateParams.id_ikasgaia;
    
    $scope.izena = "";
    
    $scope.hutsuneak_bete = [];
    
    $scope.pop;
    
    $scope.zuzenduta = false;
    
    $scope.zuzen_kop = 0;
    $scope.oker_kop = 0;
    
    $scope.hasi_berriz = function() {
        
        $scope.zuzenduta = false;
        
        // Ikus-entzunezkoa hasierara eraman.
        $scope.pop.currentTime(0);
        
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia input").each(function() {
            $(this).val("");
            $(this).removeClass("zuzena").removeClass("okerra");
        });
        
        // Hipertranskribapenaren kaxari berriz ere korritzeko aukera eman.
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia").css("overflow-y", "scroll");
        
        console.log($("#hutsuneak-bete-hipertranskribapena-edukinontzia").css("overflow-y"));
    }
    
    $scope.emaitzenModalaItxi = function() {
        
        $scope.zuzenduta = true;
        
        $scope.emaitzenModala.hide();
        
        // Erabiltzaileari hipertranskribapen osoa ikusteko aukera eman.
        // ::-webkit-scrollbar eta ::-webkit-scrollbar-thumb erabiliz korritze-barra bistaratzea lortu dut baina ez zuen funtzionatzen.
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia").css("overflow-y", "visible");
        
    }
    
    $scope.zuzendu = function() {
        
        var zuzenak = [];
        var okerrak = [];
        
        $scope.pop.pause();
        
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia input").each(function(index, elem) {
            
            var id_hutsunea = $(this).attr("data-id-hutsunea");
            
            if($(this).attr("data-testua") === $(this).val()) {
                
                $(this).addClass("zuzena");
                
                zuzenak.push(id_hutsunea);
                
            } else {
                
                $(this).val($(elem).attr("data-testua"));
                $(this).addClass("okerra");
                
                okerrak.push(id_hutsunea);
                
            }
            
        });
        
        $scope.zuzen_kop = zuzenak.length;
        $scope.oker_kop = okerrak.length;
        
        $scope.emaitzenModala.show();
        
        Zerbitzaria.bidaliEmaitzak($scope.id_ikasgaia, $scope.id_ariketa, Erabiltzailea.eskuratuId(), zuzenak, okerrak);
        
        console.log(zuzenak);
        console.log(okerrak);
        
    }
    
    $ionicModal.fromTemplateUrl('templates/emaitza-modala.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.emaitzenModala = modal;
    });
    
}])

.controller('GalderaErantzunakCtrl', ['$ionicModal', '$scope', '$state', '$stateParams', '$timeout', 'Zerbitzaria', function($ionicModal, $scope, $state, $stateParams, $timeout, Zerbitzaria) {
    
    $scope.id_ariketa = $stateParams.id_ariketa;
    $scope.id_ikasgaia = $stateParams.id_ikasgaia;
    
    $scope.izena = "";
    
    $scope.zuzen_kop = 0;
    $scope.oker_kop = 0;
    
    // Erabiltzaileak emandako erantzunak (erantzunaren id-a gordetzen dugu).
    $scope.emaitzak = {
        zuzenak: [],
        okerrak: []
    };
    
    $ionicModal.fromTemplateUrl('galderak-modala', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    // Aurretik modala existituko balitz suntsitu, bestela arazoak ematen zituen bigarren aldiz galdera-erantzunen ariketan sartzean.
    // Orain alferrik da eta egindakoa eginda dago, baina JQUERY ERABILIZ EZ DIRA DOM-EAN ALDAKETAK EGIN BEHAR!!!
    $(".modal-backdrop").remove();
    
    $ionicModal.fromTemplateUrl('templates/emaitza-modala.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.emaitzenModala = modal;
    });
    
    $scope.emaitzenModalaItxi = function() {
        
        $scope.emaitzenModala.hide();
        
        // Nire txokoa-ra eraman erabiltzailea, bestela arazoak ematen zituen berriz play sakatzean.
        $state.go('nire-txokoa');
        
    }
    
    // Erabiltzaileari aurrerapen-barra erabiliz denboran aurrera eta atzera ibiltzea galaraziko diogu.
    $.jPlayer.prototype.seekBar = function() {};
    
}])

.controller('HitzakMarkatuCtrl', ['$ionicModal', '$scope', '$stateParams', function($ionicModal, $scope, $stateParams) {
    
    $scope.id_ariketa = $stateParams.id_ariketa;
    $scope.id_ikasgaia = $stateParams.id_ikasgaia;
    
    $scope.pop;
    
    $scope.zuzenduta = false;
    $scope.zuzen_kop = 0;
    $scope.oker_kop = 0;
    
    $scope.dragStartCallback = function(event, ui) {
        ui.helper.removeClass("transcript-grey");
        ui.helper.addClass("hitzak-markatu-hitz-ontzia-spana");
    }
    
    $scope.dropCallback = function(event, ui) {
        
        var spana = $(ui.draggable).clone();
        
        var zerrendan = false;
        
        $("#hitzak-markatu-hitz-ontzia .hitzak-markatu-hitz-ontzia-spana").each(function() {
            
            // Zerrendako elementuaren denborak bat badatoz hautapenarekin.
            if ($(this).attr("data-ms") == spana.attr("data-ms")) {
                
                zerrendan = true;
                
            }
            
        });
        
        if (!zerrendan) {
            
            spana.removeClass("transcript-grey");
            spana.addClass("hitzak-markatu-hitz-ontzia-spana");
            
            spana.append("<span class='hitzak-markatu-hitz-ontzia-spana-x'>x</span>");
            
            // Hitzik ez badago...
            if ($("#hitzak-markatu-hitz-ontzia .hitzak-markatu-hitz-ontzia-spana").length === 0) {
                
                $("#hitzak-markatu-hitz-ontzia").append(spana);
                
            } else {
                
                // Hitz guztiak banan bana pasako ditugu hitz berria non txertatu erabakitzeko.
                $("#hitzak-markatu-hitz-ontzia .hitzak-markatu-hitz-ontzia-spana").each(function() {
                    
                    // Hitz berria uneko hitza baino lehenago bada...
                    if (parseInt($(this).attr("data-ms"), 10) > parseInt(spana.attr("data-ms"), 10)) {
                        
                        // Uneko hitzaren aurretik txertatuko dugu.
                        $(this).before(spana);
                        
                        return false;
                    }
                    
                    // Azken hitzean bagaude eta oraindik ez badugu hitz berria txertatu, azkenaren ondoren txertatuko dugu
                    $(this).after(spana);
                    
                });
                
            }
            
        } else {
            
            alert("Hautapena dagoeneko zerrendan dago!");
            
        }
        
    }
    
    $ionicModal.fromTemplateUrl('templates/emaitza-modala.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.emaitzenModala = modal;
    });
    
    $scope.emaitzenModalaItxi = function() {
        
        $scope.zuzenduta = true;
        
        $scope.emaitzenModala.hide()
        
        // Erabiltzaileari hipertranskribapen osoa ikusteko aukera eman.
        // ::-webkit-scrollbar eta ::-webkit-scrollbar-thumb erabiliz korritze-barra bistaratzea lortu dut baina ez zuen funtzionatzen.
        $("#hitzak-markatu-hipertranskribapena-edukinontzia").css("overflow-y", "visible");
    }
    
}])

.controller('MultzokatuCtrl', ['$ionicModal', '$scope', '$stateParams', 'Erabiltzailea', 'Zerbitzaria', function($ionicModal, $scope, $stateParams, Erabiltzailea, Zerbitzaria) {
    
    $scope.id_ariketa = $stateParams.id_ariketa;
    $scope.id_ikasgaia = $stateParams.id_ikasgaia;
    
    $scope.multzokatu = [];
    
    $scope.zuzen_kop = 0;
    $scope.oker_kop = 0;
    
    $scope.zuzenduta = false;
    
    $scope.sortable_options = {
        connectWith: ".sortable"
    }
    
    var id_ariketa = 4;
    var id_hizkuntza = 1;
    
    
    var promise = Zerbitzaria.eskuratuMultzokatu(id_ariketa, id_hizkuntza);
    
    promise.then(function() {
        
        $scope.multzokatu = Zerbitzaria.multzokatu;
        
    });
    
    $scope.berrizHasi = function() {
        
        $scope.zuzenduta = false;
        
        $(".multzokatu-helburua").each(function() {
            
            // Helburuko zutabeetan dauden elementu guztiak pasako ditugu.
            $(this).children("li").each(function() {
                
                // Zuzena ala okerra den adierazten duen ikonoa kendu.
                $(this).children().remove();
                
                // data-zuzenduta atributua hasieratu.
                $(this).attr("data-zuzenduta", "");
                
                // Hasierako zutabera gehitu.
                $("#multzokatu-jatorria").append($(this));
                
            });
        });
        
        // Helburuko zutabeetan dauden elementu guztiak pasako ditugu.
        $("#multzokatu-jatorria").children("li").each(function() {
            
            // Zuzena ala okerra den adierazten duen ikonoa kendu.
            $(this).children().remove();
            
            // data-zuzenduta atributua hasieratu.
            $(this).attr("data-zuzenduta", "");
            
        });
        
    };
    
    $scope.zuzendu = function() {
        
        var zuzenak = [];
        var okerrak = [];
        
        // Helburuko zutabe bakoitza pasako dugu.
        $(".multzokatu-helburua").each(function() {
            
            // Taldearen id-a eskuratuko dugu.
            var id_taldea = $(this).attr("data-taldea");
            
            // Talde honetako elementu guztiak pasako ditugu.
            $(this).children("li").each(function() {
                
                // Elementuaren id-a eskuratuko dugu.
                var id_elementua = $(this).attr("data-elementua");
                
                // Elementuaren taldearen id-a eskuratuko dugu.
                var id_elementuaren_taldea = $(this).attr("data-taldea");
                
                // Elementu hau ez badago dagoeneko zuzenduta.
                if (!$(this).attr("data-zuzenduta")) {
                    
                    // Elementua ez badago dagokion taldean.
                    if (id_elementuaren_taldea !== id_taldea) {
                        
                        // Elementua zuzenduta dagoela adieraziko dugu.
                        // Bestela dagokion zerrendara eraman ondoren bigarren aldiz kontatzeko arriskua dago.
                        $(this).attr("data-zuzenduta", true);
                        
                        // Dagokion zerrendara eramango dugu.
                        //$("#multzokatu-helburua_" + id_elementuaren_taldea).append($(this));
                        
                        // Erantzun okerra dela adierazten duen ikonoa jarri.
                        $(this).append('<i class="icon ion-close-round multzokatu-erantzun-okerra"></i>');
                        
                        // Okerren zerrendara gehituko dugu.
                        okerrak.push(id_elementua);
                        
                    } else {
                        
                        // Erantzun zuzena dela adierazten duen ikonoa jarri. Ionicons-ak erabili!
                        $(this).append('<i class="icon ion-checkmark-round multzokatu-erantzun-zuzena"></i>');
                        
                        // Zuzenen zerrendara gehituko dugu.
                        zuzenak.push(id_elementua);
                        
                    }
                    
                }
                
            });
            
        });
        
        // Jatorrizko zutabeko elementu guztiak pasako dugu.
        $("#multzokatu-jatorria").children("li").each(function() {
            
            // Elementuaren id-a eskuratuko dugu.
            var id_elementua = $(this).attr("data-elementua");
            
            // Elementuaren taldearen id-a eskuratuko dugu.
            var id_elementuaren_taldea = $(this).attr("data-taldea");
            
            // Dagokion zerrendara eramango dugu.
            //$("#multzokatu-helburua_" + id_elementuaren_taldea).append($(this));
            
            // Erantzun okerra dela adierazten duen ikonoa jarri. Ionicons-ak erabili!
            $(this).append('<i class="icon ion-close-round multzokatu-erantzun-okerra"></i>');
            
            // Okerren zerrendara gehituko dugu.
            okerrak.push(id_elementua);
            
        });
        
        Zerbitzaria.bidaliEmaitzak($scope.id_ikasgaia, $scope.id_ariketa, Erabiltzailea.eskuratuId(), zuzenak, okerrak);
        
        $scope.zuzen_kop = zuzenak.length;
        $scope.oker_kop = okerrak.length;
        
        $scope.emaitzenModala.show();
        
    }
    
    $ionicModal.fromTemplateUrl('templates/emaitza-modala.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.emaitzenModala = modal;
    });
    
    $scope.emaitzenModalaItxi = function() {
        
        $scope.zuzenduta = true;
        
        $scope.emaitzenModala.hide()
        
    }
}])

.controller('EsaldiakOrdenatuCtrl', ['$ionicModal', '$scope', '$stateParams', 'Erabiltzailea', 'Zerbitzaria', function($ionicModal, $scope, $stateParams, Erabiltzailea, Zerbitzaria) {
    
    $scope.esaldiak_zuzendu;
    
    $scope.zuzen_kop = 0;
    $scope.oker_kop = 0;
    
    var zuzen_idak = [];
    var oker_idak = [];
    
    var id_ariketa = $stateParams.id_ariketa;
    $scope.id_ikasgaia = $stateParams.id_ikasgaia;
    
    var id_hizkuntza = 1;
    
    var esaldien_idak = [];
    var esaldiak = [];
    var ordenak = [];
    
    var zenbagarren_esaldia = 0;
    
    // Esaldiak zein ordenatan erakutsi behar diren.
    var esaldien_ordena = [];
    
    var promise = Zerbitzaria.eskuratuEsaldiakZuzendu(id_ariketa, id_hizkuntza);
    
    promise.then(function() {
        
        $scope.esaldiak_zuzendu = Zerbitzaria.esaldiak_zuzendu;
        
        for (var i = 0; i < $scope.esaldiak_zuzendu.esaldiak.length; i++) {
            
            ordenak.push(JSON.parse($scope.esaldiak_zuzendu.esaldiak[i].ordenak));
            
            esaldiak.push($scope.esaldiak_zuzendu.esaldiak[i].testua.split(" "));
            
            esaldien_idak.push($scope.esaldiak_zuzendu.esaldiak[i].id);
        }
        
        // esaldiak arrayak dituen elementuak adina elementu gehituko ditugu array berrira.
        for (var i = 0; i < esaldiak.length; i++) {
            
            esaldien_ordena.push(i);
            
        }
        
        // Array berria desordenatuko dugu.
        esaldien_ordena = shuffle(esaldien_ordena);
        
        hasi();
        
    });
    
    function bistaratu_zenbagarrena() {
        
        $("#esaldiak-zuzendu-unekoa").text(zenbagarren_esaldia + 1);
    }
    
    function bistaratu_zuzen_kopurua() {
        
        $("#esaldiak-zuzendu-zuzenak").text($scope.zuzen_kop);
    }
    
    function bistaratu_oker_kopurua() {
        
        $("#esaldiak-zuzendu-okerrak").text($scope.oker_kop);
        
    }
    
    function bistaratu_galdera_kopurua() {
        
        $("#esaldiak-zuzendu-guztira").text(esaldiak.length);
    }
    
    function shuffle(array) {
        
        var counter = array.length, temp, index;
        
        // While there are elements in the array
        while (counter > 0) {
            
            // Pick a random index
            index = Math.floor(Math.random() * counter);
            
            // Decrease counter by 1
            counter--;
            
            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
            
        }
        
        return array;
        
    }

    function bistaratuEsaldia() {
        
        $(".jMyPuzzle").html("");
        
        $(".jMyPuzzle").jMyPuzzle({
            phrase: esaldiak[esaldien_ordena[zenbagarren_esaldia]],
            answers: ordenak[esaldien_ordena[zenbagarren_esaldia]], //ordena_zuzenak,
            //phrase: ["a", "b", "c"],
            //answers: [[0, 1, 2], [2, 1, 0]],
            language: "eu",
            maxTrials: 1,
            showTrials: false,
            visible: '100%', // ez da erabiltzen ????
            fnOnCheck: function(jSonResults){  
                /*alert("Estatistikak:"
                      + "\n\tErantzun zuzenak: " + jSonResults.nb_valid
                      + "\n\tErantzun okerrak: " + jSonResults.nb_not_valid
                      + "\n\tErantzun erdi-zuzenak: " + jSonResults.nb_mi_valid
                      + "\n\tPortzentaia: %" + jSonResults.success_rate);*/
                
                if (jSonResults.nb_not_valid === 0) {
                    
                    $scope.zuzen_kop++;
                    
                    zuzen_idak.push(esaldien_idak[esaldien_ordena[zenbagarren_esaldia]]);
                    
                } else {
                    
                    $scope.oker_kop++;
                    
                    oker_idak.push(esaldien_idak[esaldien_ordena[zenbagarren_esaldia]]);
                    
                }
                
                bistaratu_zuzen_kopurua();
                
                bistaratu_oker_kopurua();
                
                zenbagarren_esaldia++;
                
                // Erabiltzaileari ordena aldatzen ez utzi.
                $("#parts li").draggable("disable");
                
                // Zuzendu eta berrezarri botoiak kendu.
                $(".jMyPuzzle input").remove();
                
                if (zenbagarren_esaldia < esaldiak.length) {
                    
                    // Aurrera botoia gehitu.
                    $("#jMyPuzzle-buttons").append("<input type='button' class='button' value='Aurrera' id='esaldiak-zuzendu-aurrera-botoia' />");
                    
                } else {
                    
                    Zerbitzaria.bidaliEmaitzak($scope.id_ikasgaia, id_ariketa, Erabiltzailea.eskuratuId(), zuzen_idak, oker_idak);
                    
                    $scope.emaitzenModala.show();
                    
                    // Berriz hasi botoia gehitu.
                    $("#jMyPuzzle-buttons").append("<input type='button' class='button' value='Berriz hasi' id='esaldiak-zuzendu-berriz-hasi-botoia' />");
                    
                }
            }
        });
        
    }
    
    function hasi() {
        
        bistaratuEsaldia();
        
        bistaratu_zuzen_kopurua();
        
        bistaratu_oker_kopurua();
        
        bistaratu_zenbagarrena();
        
        bistaratu_galdera_kopurua();
        
        $(document).on("click", ".jMyPuzzle #esaldiak-zuzendu-aurrera-botoia", function() {
            
            bistaratu_zenbagarrena();
            
            bistaratuEsaldia();
            
        });
        
        $(document).on("click", ".jMyPuzzle #esaldiak-zuzendu-berriz-hasi-botoia", function() {
            
            // Aldagaiak zeroratuko ditugu.
            $scope.zuzen_kop = 0;
            $scope.oker_kop = 0;
            zenbagarren_esaldia = 0;
            zuzen_idak = [];
            oker_idak = [];
            
            // Arraya berriz desordenatuko dugu.
            esaldien_ordena = shuffle(esaldien_ordena);
            
            bistaratuEsaldia();
            
            bistaratu_zuzen_kopurua();
            
            bistaratu_oker_kopurua();
            
            bistaratu_zenbagarrena();
            
            bistaratu_galdera_kopurua();
            
        });
        
    }
    
    $ionicModal.fromTemplateUrl('templates/emaitza-modala.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.emaitzenModala = modal;
    });
    
    $scope.emaitzenModalaItxi = function() {
        
        $scope.emaitzenModala.hide()
        
    }
    
}]);