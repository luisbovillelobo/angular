(function (angular) {
  'use strict';

  angular.module('formsManagerModule', 
  	['ui.router','ngMaterial','ngMessages', 'adminModule', 'userModule', 'interviewerModule'] );

  angular.module('formsManagerModule').config(
    function($stateProvider) {
  		$stateProvider

              .state('forms_user', {
              url: '/User',
              parent: 'site',
              data: {
                  requireLogin: true
              },
              views: {
                'content@':{
                    templateUrl: 'scripts/app/formsManager/js/modules/User/formulariosUser.html',
                    controller: 'myUserCtrl'
                }
              }
            })
            .state('forms_interviewer', {
              url: '/Interviewer',
              parent: 'site',
              data: {
                  requireLogin: true
              },
              views: {
                "content@":{
                    templateUrl: 'scripts/app/formsManager/js/modules/Interviewer/formulariosInterviewer.html',
                    controller: 'myInterviewerCtrl'
                }
              }
            })
            .state('forms_manager_admin', {
                parent: 'site',
                url: '/forms_manager_admin',
                data: {
                  requireLogin: true
                },
                views:{
                    'content@':{
                        templateUrl: 'scripts/app/formsManager/js/modules/Admin/formulariosAdmin.html',
                         controller:  'adminCtrl',

                    }
                }
            });
  	});	
})(angular);




