// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ikuslang-app', [
    'ionic',
    'ngDragDrop',
    'ui.sortable',
    'ikuslang-app.controllers',
    'ikuslang-app.services',
    'ikuslang-app.directives'
])

.run(function($ionicPlatform) {
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

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.hutsuneak-bete', {
      url: "/hutsuneak-bete",
      views: {
        'menuContent' :{
          templateUrl: "templates/hutsuneak-bete.html",
          controller: "HutsuneakBeteCtrl"
        }
      }
    })

    .state('app.galdera-erantzunak', {
      url: "/galdera-erantzunak",
      views: {
        'menuContent' :{
          templateUrl: "templates/galdera-erantzunak.html",
          controller: "GalderaErantzunakCtrl"
        }
      }
    })

    .state('app.hitzak-markatu', {
      url: "/hitzak-markatu",
      views: {
        'menuContent' :{
          templateUrl: "templates/hitzak-markatu.html",
          controller: "HitzakMarkatuCtrl"
        }
      }
    })
    
    .state('app.multzokatu', {
      url: "/multzokatu",
      views: {
        'menuContent' :{
          templateUrl: "templates/multzokatu.html",
          controller: "MultzokatuCtrl"
        }
      }
    })

    .state('app.esaldiak-ordenatu', {
      url: "/esaldiak-ordenatu",
      views: {
        'menuContent' :{
          templateUrl: "templates/esaldiak-ordenatu.html",
          controller: "EsaldiakOrdenatuCtrl"
        }
      }
    })
    
    .state('app.sarrera', {
      url: "/sarrera",
      views: {
        'menuContent' :{
          templateUrl: "templates/sarrera.html",
          controller: 'SarreraCtrl'
        }
      }
    })
    
    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

