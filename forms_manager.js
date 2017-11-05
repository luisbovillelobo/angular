(function(angular) {
  'use strict';

  angular.module('iaprofileApp').config(
    function($stateProvider) {
      $stateProvider
          .state('forms_manager', {
            parent: 'site',
            url: '/forms_manager',
            data: {
              requireLogin: true
            },
            views: {
              'content@': {
                templateUrl:  'scripts/app/formsManager/forms_manager.html',
                controller:   'FormsManagerController',
                controllerAs: 'FormsManager'
              }
            },
            resolve: {
              mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
                  function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('FormsManager');
                    return $translate.refresh();
                  }]
            }
          });
    });
}(angular));