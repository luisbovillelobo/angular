(function(angular) {
  'use strict';

  angular.module('iaprofileApp').controller(
          'FormsManagerController',
          function($scope, Principal, AppService, AppFactory, Analytics) {
            
            Analytics({
              event : 'pageview',
              title : 'Formularios - Manager',
              location : 'forms_manager'
            });
            
            var coursesmanager = this;
            
            Principal.identity().then(
                    function(account) {
                      $scope.account = account;
                      $scope.isAuthenticated = Principal.isAuthenticated;
                
                      $scope.accesTypeFormFunction = function() {
                          AppService.httpGetFunction('roles/getAccesType/' + $scope.account.roles + '/forms_manager')
                                  .then(function success(data) {
                                    AppFactory.authorizedSimple(data, $scope);
                                  }, function error(data) {
                                    AppFactory.notifyError();
                                  });
                        };
                        $scope.accesTypeFormFunction();
                    });
          });
}(angular));