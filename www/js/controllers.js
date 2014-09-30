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
