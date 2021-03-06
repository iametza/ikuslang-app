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
    
    .state('hutsuneak-bete', {
        url: "/hutsuneak-bete/?id_ariketa&id_ikasgaia",
        templateUrl: "templates/hutsuneak-bete.html",
        controller: "HutsuneakBeteCtrl"
    })

    .state('galdera-erantzunak', {
        url: "/galdera-erantzunak/?id_ariketa&id_ikasgaia",
        templateUrl: "templates/galdera-erantzunak.html",
        controller: "GalderaErantzunakCtrl"
    })

    .state('hitzak-markatu', {
        url: "/hitzak-markatu/?id_ariketa&id_ikasgaia",
        templateUrl: "templates/hitzak-markatu.html",
        controller: "HitzakMarkatuCtrl"
    })
    
    .state('multzokatu', {
        url: "/multzokatu/?id_ariketa&id_ikasgaia",
        templateUrl: "templates/multzokatu.html",
        controller: "MultzokatuCtrl"
    })

    .state('esaldiak-ordenatu', {
      url: "/esaldiak-ordenatu/?id_ariketa&id_ikasgaia",
      templateUrl: "templates/esaldiak-ordenatu.html",
      controller: "EsaldiakOrdenatuCtrl"
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

