// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('ikuslang-app', [
    'ionic',
    'ngDragDrop',
    'ui.sortable',
    'ikuslang-app.controllers',
    'ikuslang-app.services',
    'ikuslang-app.directives',
    'cordova'
])

.run(function($ionicPlatform, push) {
    
    $ionicPlatform.ready(function() {
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        
        var result = push.registerPush(function (result) {
            console.log(result);
            
            if (result.type === 'registration') {
                
                console.log("erregistratuta");
                
            } else if (result.type === 'message') {
                
                console.log("mezua jasota");
                console.log(result);
                
                // Mezua jasotzean aplikazioa 3 egoeratan egon daiteke:
                // * Aurreko planoan exekutatzen -> foreground === true
                // * Atzeko planoan ezkutuan baina memorian -> foreground === false && coldstart === false
                // * Erabat geldi -> foreground === false && coldstart === true
                if (result.foreground) {
                    
                } else {
                    
                    if (result.coldstart) {
                        
                    } else {
                        
                    }
                    
                }
                
                // Alertaren elementura bideratu.
                document.location.href = "#/tab/nabarmenduak-xehetasunak/" + result.id_elementua;
            }
        });
        
    });
    
})

.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })
    
    .state('nire-txokoa', {
        url: "/nire-txokoa",
        templateUrl: "templates/nire-txokoa.html",
        controller: 'NireTxokoaCtrl'
    })
    
    .state('ezarpenak', {
        url: "/ezarpenak",
        templateUrl: "templates/ezarpenak.html",
        controller: 'EzarpenakCtrl'
    })
    
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    
    .state('app.hutsuneak-bete', {
        url: "/hutsuneak-bete/?id_ariketa&id_ikasgaia",
        views: {
            'menuContent' :{
                templateUrl: "templates/hutsuneak-bete.html",
                controller: "HutsuneakBeteCtrl"
            }
        }
    })

    .state('app.galdera-erantzunak', {
      url: "/galdera-erantzunak/?id_ariketa&id_ikasgaia",
      views: {
        'menuContent' :{
          templateUrl: "templates/galdera-erantzunak.html",
          controller: "GalderaErantzunakCtrl"
        }
      }
    })

    .state('app.hitzak-markatu', {
      url: "/hitzak-markatu/?id_ariketa&id_ikasgaia",
      views: {
        'menuContent' :{
          templateUrl: "templates/hitzak-markatu.html",
          controller: "HitzakMarkatuCtrl"
        }
      }
    })
    
    .state('app.multzokatu', {
      url: "/multzokatu/?id_ariketa&id_ikasgaia",
      views: {
        'menuContent' :{
          templateUrl: "templates/multzokatu.html",
          controller: "MultzokatuCtrl"
        }
      }
    })

    .state('app.esaldiak-ordenatu', {
      url: "/esaldiak-ordenatu/?id_ariketa&id_ikasgaia",
      views: {
        'menuContent' :{
          templateUrl: "templates/esaldiak-ordenatu.html",
          controller: "EsaldiakOrdenatuCtrl"
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

