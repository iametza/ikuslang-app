angular.module('starter.controllers', [])

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

.controller('HutsuneakBeteCtrl', function($scope) {
    
    $scope.izena = "Hutsuneak bete proba"
    
    $scope.pop = Popcorn.jplayer("#jquery_jplayer_1", {
        media: {
            m4v: "http://asier.ikuslang.ametza.com/bideoak/kzurutuzahd.mp4",
            webmv: "http://asier.ikuslang.ametza.com/bideoak/kzurutuzahd.webm"
        },
        options: {
            swfPath: "swf/Jplayer.swf",
            supplied: "m4v, webmv"
        }
    });
    
    $scope.dataMs = "data-ms";
    
    // Zertarako ziren hauek?
    $scope.playSource = true;
    $scope.tPause = 0;
    $scope.endTime = null;
    
    $scope.hasi_berriz = function() {
        
        $("#transkribapena-edukia input").each(function() {
            $(this).val("");
            $(this).removeClass("zuzena").removeClass("okerra");
        });
        
    }
    
    $scope.egiaztatu = function() {
        
        $("#transkribapena-edukia input").each(function() {
            
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
        
        $("#transkribapena-edukia input").each(function(index, elem) {                        
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
    
    $scope.initTranscript = function(p) {
        
        // Hutsuneak ze data-ms-tan jarri behar diren.
        // Hutsuneak hitz bat baino gehiagokoak izan daitezke.
        var hutsuneak = [[{"denbora":"38947","testua":"luxuzko"}],[{"denbora":"33955","testua":"azkeneko"}],[{"denbora":"117160","testua":"desberdina"}],[{"denbora":"105255","testua":"nekez"}],[{"denbora":"94919","testua":"beharrean,"}],[{"denbora":"72664","testua":"baldin"},{"denbora":"73119","testua":"baduzu"}],[{"denbora":"67134","testua":"daukazula"}],[{"denbora":"45450","testua":"nukeela"}],[{"denbora":"26725","testua":"mugatuta"}],[{"denbora":"11658","testua":"ekialderantz"}],[{"denbora":"4672","testua":"interesa"},{"denbora":"5325","testua":"izan"},{"denbora":"5978","testua":"dut"}],[{"denbora":"6630","testua":"kultur"}]];
        
        var hutsune_kopurua = hutsuneak.length;
        var hitz_kopurua;
        var hutsunearen_testua = "";
        var $spana;
        
        $("#transkribapena-edukia span").each(function(i) {  
            // doing p.transcript on every word is a bit inefficient - wondering if there is a better way
            p.transcript({
                time: $(this).attr($scope.dataMs) / 1000, // seconds
                futureClass: "transcript-grey",
                target: this,
                onNewPara: function(parent) {
                    $("#transkribapena-edukia").stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
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
            $("span[data-ms='" + hutsuneak[i][0].denbora + "']").replaceWith("<input type='text' data-testua='" + hutsunearen_testua + "' />");
            
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
    
    // Azpitituluen fitxategia parseatu bistaratzeko.
    //$scope.pop.parseSRT("http://asier.ikuslang.ametza.com/azpitituluak/karloszurutuzahd.srt", {target: "bideoa-azpitituluak"});
    
    // Hipertranskribapenaren testua bistaratu
    $('#transkribapena-edukia').html("<p><span data-ms=\"4020\">KARLOS ZURUTUZA: Berebiziko<\/span> \n<span data-ms=\"4672\">interesa<\/span> \n<span data-ms=\"5325\">izan<\/span> \n<span data-ms=\"5978\">dut<\/span> \n<span data-ms=\"6630\">kultur<\/span> \n<span data-ms=\"7283\">gutxituekin<\/span> \n<span data-ms=\"7935\">edo<\/span> \n<span data-ms=\"8588\">erlijio,<\/span> \n<span data-ms=\"9240\">sekta<\/span> \n<span data-ms=\"9803\">gutxituekin.<\/span> \n<span data-ms=\"10367\">Beti,<\/span> \n<span data-ms=\"10930\">nahi<\/span> \n<span data-ms=\"11294\">gabe,<\/span> \n<span data-ms=\"11658\">ekialderantz<\/span> \n<span data-ms=\"12022\">bidatu<\/span> \n<span data-ms=\"12386\">dut,<\/span> \n<span data-ms=\"12750\">ez<\/span> \n<span data-ms=\"12992\">naiz<\/span> \n<span data-ms=\"13234\">inoiz<\/span> \n<span data-ms=\"13476\">Ameriketan<\/span> \n<span data-ms=\"13718\">egon.<\/span> \n<\/p><p><span data-ms=\"15020\">Adibidez,<\/span> \n<span data-ms=\"15502\">Sirian<\/span> \n<span data-ms=\"15983\">egon<\/span> \n<span data-ms=\"16465\">nintzen<\/span> \n<span data-ms=\"16947\">azkeneko<\/span> \n<span data-ms=\"17428\">aldian,<\/span> \n<span data-ms=\"17910\">bi<\/span> \n<span data-ms=\"18380\">mila<\/span> \n<span data-ms=\"18850\">eta<\/span> \n<span data-ms=\"19320\">zortzin,<\/span> \n<span data-ms=\"19790\">turista<\/span> \n<span data-ms=\"20260\">bisatuarekin<\/span> \n<span data-ms=\"20730\">joan<\/span> \n<span data-ms=\"21200\">nintzen,<\/span> \n<span data-ms=\"21670\">eta<\/span> \n<span data-ms=\"21895\">Pakistanera<\/span> \n<span data-ms=\"22120\">ere<\/span> \n<span data-ms=\"22345\">bai.<\/span> \n<\/p><p><span data-ms=\"22570\">Herrialde<\/span> \n<span data-ms=\"23153\">horietara<\/span> \n<span data-ms=\"23737\">joaten<\/span> \n<span data-ms=\"24320\">bazara<\/span> \n<span data-ms=\"24903\">kazetaritza<\/span> \n<span data-ms=\"25487\">bisatu<\/span> \n<span data-ms=\"26070\">batekin<\/span> \n<span data-ms=\"26398\">oso<\/span> \n<span data-ms=\"26725\">mugatuta<\/span> \n<span data-ms=\"27053\">zaude,<\/span> \n<span data-ms=\"27380\">denbora<\/span> \n<span data-ms=\"27798\">guztian<\/span> \n<span data-ms=\"28216\">zaude<\/span> \n<span data-ms=\"28633\">zainduta<\/span> \n<span data-ms=\"29051\">eta<\/span> \n<span data-ms=\"29469\">zurekin<\/span> \n<span data-ms=\"29887\">elkartzen<\/span> \n<span data-ms=\"30304\">den<\/span> \n<span data-ms=\"30722\">jendea<\/span> \n<span data-ms=\"31140\">arriskuan<\/span> \n<span data-ms=\"31927\">jartzen<\/span> \n<span data-ms=\"32713\">duzu.<\/span> \n<\/p><p><span data-ms=\"33500\">Libiako<\/span> \n<span data-ms=\"33955\">azkeneko<\/span> \n<span data-ms=\"34410\">gerra<\/span> \n<span data-ms=\"34865\">honetan,<\/span> \n<span data-ms=\"35320\">nire<\/span> \n<span data-ms=\"35654\">asmoa<\/span> \n<span data-ms=\"35989\">zen<\/span> \n<span data-ms=\"36323\">Tripolira<\/span> \n<span data-ms=\"36658\">joatea<\/span> \n<span data-ms=\"36992\">zuzenean<\/span> \n<span data-ms=\"37327\">baina<\/span> \n<span data-ms=\"37661\">baldintzak<\/span> \n<span data-ms=\"37996\">ikusita<\/span> \n<\/p><p><span data-ms=\"38330\">Ikusita<\/span> \n<span data-ms=\"38947\">luxuzko<\/span> \n<span data-ms=\"39564\">hotel<\/span> \n<span data-ms=\"40181\">baten<\/span> \n<span data-ms=\"40799\">egon<\/span> \n<span data-ms=\"41416\">beharra<\/span> \n<span data-ms=\"42033\">neukala,<\/span> \n<span data-ms=\"42650\">kontrolatuta,<\/span> \n<span data-ms=\"43350\">24<\/span> \n<span data-ms=\"44050\">orduz<\/span> \n<span data-ms=\"44750\">ezingo<\/span> \n<span data-ms=\"45450\">nukeela<\/span> \n<span data-ms=\"46150\">lan<\/span> \n<span data-ms=\"46850\">independenterik<\/span> \n<span data-ms=\"47550\">egin,<\/span> \n<span data-ms=\"48250\">ez<\/span> \n<span data-ms=\"48650\">kaleko<\/span> \n<span data-ms=\"49050\">jende<\/span> \n<span data-ms=\"49450\">arruntarekin<\/span> \n<span data-ms=\"49850\">hitz<\/span> \n<span data-ms=\"50250\">egin,<\/span> \n<span data-ms=\"50650\">beti<\/span> \n<span data-ms=\"51086\">izango<\/span> \n<span data-ms=\"51521\">bainituen<\/span> \n<span data-ms=\"51957\">nire<\/span> \n<span data-ms=\"52393\">alboan<\/span> \n<span data-ms=\"52829\">halako<\/span> \n<span data-ms=\"53264\">komisarioak<\/span> \n<span data-ms=\"53700\">erabaki<\/span> \n<span data-ms=\"54773\">nuen<\/span> \n<span data-ms=\"55847\">bestaldekoekin,<\/span> \n<span data-ms=\"56920\">matxinoekin,<\/span> \n<span data-ms=\"58440\">sartzea.<\/span> \n<\/p><p><span data-ms=\"61020\">Esaten<\/span> \n<span data-ms=\"61329\">baldin<\/span> \n<span data-ms=\"61638\">baduzu<\/span> \n<span data-ms=\"61946\">zu<\/span> \n<span data-ms=\"62255\">zauden<\/span> \n<span data-ms=\"62564\">tokia<\/span> \n<span data-ms=\"62873\">segurua<\/span> \n<span data-ms=\"63181\">dela,<\/span> \n<span data-ms=\"63490\">jendea<\/span> \n<span data-ms=\"64219\">jatorra<\/span> \n<span data-ms=\"64948\">dela<\/span> \n<span data-ms=\"65676\">eta<\/span> \n<span data-ms=\"66405\">ez<\/span> \n<span data-ms=\"67134\">daukazula<\/span> \n<span data-ms=\"67863\">inongo<\/span> \n<span data-ms=\"68591\">arazorik,<\/span> \n<span data-ms=\"69320\">ez<\/span> \n<span data-ms=\"70042\">duzu<\/span> \n<span data-ms=\"70765\">erreportajerik<\/span> \n<span data-ms=\"71488\">salduko.<\/span> \n<\/p><p><span data-ms=\"72210\">Esaten<\/span> \n<span data-ms=\"72664\">baldin<\/span> \n<span data-ms=\"73119\">baduzu<\/span> \n<span data-ms=\"73573\">zauden<\/span> \n<span data-ms=\"74028\">tokia<\/span> \n<span data-ms=\"74482\">Al<\/span> \n<span data-ms=\"74937\">Qaedako<\/span> \n<span data-ms=\"75391\">kit-ez<\/span> \n<span data-ms=\"75846\">josita<\/span> \n<span data-ms=\"76960\">edozein<\/span> \n<span data-ms=\"77690\">momentutan<\/span> \n<span data-ms=\"78420\">bahitzeko<\/span> \n<span data-ms=\"79150\">arriskua<\/span> \n<span data-ms=\"79880\">oso<\/span> \n<span data-ms=\"80610\">handia<\/span> \n<span data-ms=\"81340\">dela,<\/span> \n<span data-ms=\"82070\">orduan<\/span> \n<span data-ms=\"82632\">bai,<\/span> \n<span data-ms=\"83194\">salduko<\/span> \n<span data-ms=\"83756\">dituzu<\/span> \n<span data-ms=\"84318\">erreportajeak.<\/span> \n<\/p><p><span data-ms=\"84880\">Horrekin<\/span> \n<span data-ms=\"85070\">zer<\/span> \n<span data-ms=\"85260\">lortzen<\/span> \n<span data-ms=\"85450\">duzu?<\/span> \n<\/p><p><span data-ms=\"85640\">Batetik<\/span> \n<span data-ms=\"86190\">erreportajea<\/span> \n<span data-ms=\"86740\">saltzen<\/span> \n<span data-ms=\"87290\">duzu,<\/span> \n<span data-ms=\"87840\">gezur<\/span> \n<span data-ms=\"88243\">bat<\/span> \n<span data-ms=\"88645\">kontatzen<\/span> \n<span data-ms=\"89048\">duzu,<\/span> \n<span data-ms=\"89450\">eta<\/span> \n<span data-ms=\"90361\">bestetik,<\/span> \n<span data-ms=\"91273\">biktimaren<\/span> \n<span data-ms=\"92184\">garrasi<\/span> \n<span data-ms=\"93096\">hori<\/span> \n<span data-ms=\"94007\">zabaldu<\/span> \n<span data-ms=\"94919\">beharrean,<\/span> \n<span data-ms=\"95830\">biktima<\/span> \n<span data-ms=\"96320\">demonizatzen<\/span> \n<span data-ms=\"96810\">duzu.<\/span> \n<\/p><p><span data-ms=\"97300\">Eta<\/span> \n<span data-ms=\"97532\">hori<\/span> \n<span data-ms=\"97764\">oso<\/span> \n<span data-ms=\"97996\">inmorala<\/span> \n<span data-ms=\"98228\">da,<\/span> \n<span data-ms=\"98460\">hori<\/span> \n<span data-ms=\"98627\">nazkagarria<\/span> \n<span data-ms=\"98793\">da.<\/span> \n<\/p><p><span data-ms=\"100020\">Ez<\/span> \n<span data-ms=\"100442\">ezagutza<\/span> \n<span data-ms=\"100863\">horrek<\/span> \n<span data-ms=\"101285\">beldurra<\/span> \n<span data-ms=\"101707\">sortzen<\/span> \n<span data-ms=\"102128\">du,<\/span> \n<span data-ms=\"102550\">eta<\/span> \n<span data-ms=\"103226\">beldurra<\/span> \n<span data-ms=\"103903\">dagoen<\/span> \n<span data-ms=\"104579\">bitartean<\/span> \n<span data-ms=\"105255\">nekez<\/span> \n<span data-ms=\"105931\">ulertuko<\/span> \n<span data-ms=\"106607\">diogu<\/span> \n<span data-ms=\"107284\">elkarri.<\/span> \n<\/p><p><span data-ms=\"109020\">Mendebaldean,<\/span> \n<span data-ms=\"110035\">edonork,<\/span> \n<span data-ms=\"111050\">aukera<\/span> \n<span data-ms=\"111462\">izango<\/span> \n<span data-ms=\"111874\">balu<\/span> \n<span data-ms=\"112285\">egun<\/span> \n<span data-ms=\"112697\">batez<\/span> \n<span data-ms=\"113109\">nik<\/span> \n<span data-ms=\"113521\">gaur<\/span> \n<span data-ms=\"113933\">bizi<\/span> \n<span data-ms=\"114345\">izan<\/span> \n<span data-ms=\"114756\">dudana<\/span> \n<span data-ms=\"115168\">bizi<\/span> \n<span data-ms=\"115580\">ahal<\/span> \n<span data-ms=\"115833\">izateko<\/span> \n<span data-ms=\"116087\">bizitzan,<\/span> \n<span data-ms=\"116340\">mundua<\/span> \n<span data-ms=\"117160\">desberdina<\/span> \n<span data-ms=\"117980\">izango<\/span> \n<span data-ms=\"118800\">litzake,<\/span> \n<span data-ms=\"119620\">ez<\/span> \n<span data-ms=\"120067\">daukat<\/span> \n<span data-ms=\"120513\">zalantzarik.<\/span> \n<\/p>");
    
    // Hipertranskribapenaren oinarrizko funtzionalitatea hasieratu
    $scope.initTranscript($scope.pop);
    
})

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
