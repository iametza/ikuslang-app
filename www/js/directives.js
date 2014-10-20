angular.module('ikuslang-app.directives', [])

// direktibaren atributua: hutsuneak-bete-hipertranskribapena (marratxoekin) baina direktibaren izena camelCase izan behar du.
.directive('hutsuneakBeteHipertranskribapena', function() {
    
    return {
        
        restrict: 'A',
        
        priority: 1,
        
        link: function(scope, element, attrs) {
            
            console.log(scope);
            
            console.log(element);
            
            console.log(attrs);
            
        }
    }
    
});