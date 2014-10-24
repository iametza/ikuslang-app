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
    
})

.controller('HutsuneakBeteCtrl', ['$scope', 'Zerbitzaria', function($scope, Zerbitzaria) {
    
    $scope.izena = "";
    
    $scope.hutsuneak_bete = [];
    
    $scope.pop;
    
    $scope.hasi_berriz = function() {
        
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia input").each(function() {
            $(this).val("");
            $(this).removeClass("zuzena").removeClass("okerra");
        });
        
    }
    
    $scope.egiaztatu = function() {
        
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia input").each(function() {
            
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
        
        $("#hutsuneak-bete-hipertranskribapena-edukinontzia input").each(function(index, elem) {                        
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
    
}])

.controller('GalderaErantzunakCtrl', ['$ionicModal', '$scope', 'Zerbitzaria', function($ionicModal, $scope, Zerbitzaria) {
    
    $scope.izena = "";
    
    $ionicModal.fromTemplateUrl('galderak-modala', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false     // Whether to close the modal on clicking the backdrop. Default: true.
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    // Erabiltzaileari aurrerapen-barra erabiliz denboran aurrera eta atzera ibiltzea galaraziko diogu.
    $.jPlayer.prototype.seekBar = function() {};
    
}])

.controller('HitzakMarkatuCtrl', function($scope) {
    
    $scope.hitzak_markatu = [];
    
    $scope.pop;
    
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
})

.controller('SarreraCtrl', function($scope) {

})

.controller('MultzokatuCtrl', ['$scope', 'Zerbitzaria', function($scope, Zerbitzaria) {
    
    $scope.multzokatu = [];
    
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
        
        $(".multzokatu-helburua").each(function() {
            
            // Helburuko zutabeetan dauden elementu guztiak pasako ditugu.
            $(this).children("li").each(function() {
                
                // Hasierako zutabera gehitu.
                $("#multzokatu-jatorria").append($(this));
                
            });
        });
    };
    
    $scope.egiaztatu = function() {
        
        // Helburuko zutabe bakoitza pasako dugu.
        $(".multzokatu-helburua").each(function() {
            
            // Taldearen id-a eskuratuko dugu.
            var id_taldea = $(this).attr("data-taldea");
            
            // Talde honetako elementu guztiak pasako ditugu.
            $(this).children("li").each(function() {
                
                // Elementuaren taldearen id-a eskuratuko dugu.
                var id_elementuaren_taldea = $(this).attr("data-taldea");
                
                // Elementua ez badago dagokion taldean.
                if (id_elementuaren_taldea !== id_taldea) {
                    
                    // Jatorrizko zerrendara eraman.
                    $("#multzokatu-jatorria").append($(this));
                }
            });
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
                        $("#multzokatu-helburua_" + id_elementuaren_taldea).append($(this));
                        
                        // Okerren zerrendara gehituko dugu.
                        okerrak.push(id_elementua);
                        
                    } else {
                        
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
            $("#multzokatu-helburua_" + id_elementuaren_taldea).append($(this));
            
            // Okerren zerrendara gehituko dugu.
            okerrak.push(id_elementua);
            
        });
        
        alert("Zuzenak: " + zuzenak.length + " - Okerrak: " + okerrak.length);
        
        /*$.post(Zerbitzaria.api_url + "API/v1/multzokatu",
            {
                "id_ariketa": $scope.id_ariketa,
                "id_ikaslea": $scope.id_ikaslea,
                "zuzenak": zuzenak,
                "okerrak": okerrak
            }
        )
        .done(function(data) {
            console.log(data);
        })
        .fail(function() {
        });*/
        
        console.log(zuzenak);
        console.log(okerrak);
        
    }
    
}])

.controller('EsaldiakOrdenatuCtrl', function($scope) {

    function hasi() {
        
        var esaldiak = [["Hau","beste","proba","bat","da"],["Hau","laugarren","proba","da"]];
        var ordenak = [[[0,1,2,3,4]],[[0,1,2,3,4]]];
        
        $(".jMyPuzzle").html("");
        
        var ausazko_indizea = randomFromInterval(0, esaldiak.length-1);
        
        $(".jMyPuzzle").jMyPuzzle({
            phrase: esaldiak[ausazko_indizea],
            answers: ordenak[ausazko_indizea], //ordena_zuzenak,
            //phrase: ["a", "b", "c"],
            //answers: [[0, 1, 2], [2, 1, 0]],
            language: "eu",
            maxTrials: 5,
            visible: '100%', // ez da erabiltzen ????
            fnOnCheck: function(jSonResults){
                alert("Estatistikak:"
                        + "\n\tErantzun zuzenak: " + jSonResults.nb_valid
                        + "\n\tErantzun okerrak: " + jSonResults.nb_not_valid
                        + "\n\tErantzun erdi-zuzenak: " + jSonResults.nb_mi_valid
                        + "\n\tPortzentaia: %" + jSonResults.success_rate);
            }
        });
    }
    
    $scope.hurrengoEsaldia = function(){
        
        hasi();
        
        $("#hurrengo-esaldia-botoia").html('Beste esaldi bat!');
        
    };
    
});
