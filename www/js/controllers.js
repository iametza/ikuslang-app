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
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    // Erabiltzaileari aurrerapen-barra erabiliz denboran aurrera eta atzera ibiltzea galaraziko diogu.
    $.jPlayer.prototype.seekBar = function() {};
    
    $scope.galdera_erantzunak = [];
    
    $scope.galderak = false;
    $scope.amaierako_galderak = false;
    
    // Galdera arruntak bukatu diren ala ez. Amaierako galderak ez ditu kontutan hartzen.
    var galderak_bukatu_dira = false;
    
    $scope.pop;
    
    $scope.aurrera_klik = function() {
        
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
                $scope.modal.hide();
                
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
                $scope.modal.hide();
                
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

});
