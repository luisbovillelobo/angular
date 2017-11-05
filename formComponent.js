(function(angular){
    'use strict';
    
    function formComponentController($scope, $element, $attrs, $mdDialog, Principal, $state, AppFactory){
        
        var self = this;
        
        if(self.data !== undefined){
           $scope.formCopy = angular.copy(self.data);

        }

        var questsAnswered = [];
        var formAnswered   = {};
        var areFormAnswered = true;

        $scope.questsToResponse = [];
        $scope.sendInterview = sendInterviewFn;
        $scope.cancelForm  = cancelFormFn;
        $scope.sendAnswers = sendAnswersFn;
        $scope.cancelSend = cancelSendFn;
        $scope.callback = callbackFn;
        $scope.callbackCancelBreadcrumb= callbackCancelBreadcrumbFn;
        $scope.goTo = goToFn;
       
        //Load all questions to answer
        if($scope.formCopy !== undefined){
            angular.forEach($scope.formCopy.questions, function(value, key){
                var aux = {question:value.question, type: value.type, weight:value.weight, mandatory:value.mandatory};
                //weightwill be the score earned if the form is an interview, if not it will worth 1 or there wont be such an attr, this must be filtered afterwards.
                $scope.questsToResponse.push(aux);   
                      
            });
        }
            
        //When form is answered, load array with user answer   questions
        if($scope.formCopy!== undefined && $scope.formCopy.answered === true){
            $scope.questsToShow = [];
            angular.forEach($scope.formCopy.questions, function(value, key){
                var questAux ={
                    question:value.question,
                    answered: true,
                    response: value.response,
                    type: value.type,
                    mandatory:value.mandatory
                };
                if(self.option === 'interviewer'){
                    questAux.response = $scope.formCopy.currentCandidate.answers[key].response;
                }
                $scope.questsToShow.push(questAux);                              
            });             
        }  

        //Callback from questComp, send the answered question
        function callbackFn (questionAnswered){
            questsAnswered.push(questionAnswered.quest);
        }

        function callbackCancelBreadcrumbFn (){
                $scope.eraser();            
        }

        function cancelFormFn (valueB){
            $mdDialog.show({
                controller: 'confirmDialogCtrl',
                templateUrl:'scripts/app/formsManager/js/modules/commons/confirmDialog/confirmDialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen,
                locals:{
                    textBody: '¿Desea cancelar el formulario?. Los cambios no serán guardados'
                }
            })
            .then(function() {
                $scope.init();
            })
        };

        function isAnswered(questions){
            var aux = true;
            questions.forEach(function(value){
                if(((value.response === undefined)||(value.response === ""))&&(value.mandatory === true)){
                    aux=aux&&false;                     
                }else{
                    aux=aux&&true;
                }
            });
            return aux;
        };
        function isAnsweredValuation (questions, valuation){
            var aux;
            if((valuation===undefined) || (valuation==="")){
                aux=false;
            }else{
                aux=true;
            }
            questions.forEach(function(value){
                if(((value.response === undefined)||(value.response === ""))&&(value.mandatory === true)){
                    aux=aux&&false;                     
                }else{
                    aux=aux&&true;
                }
            });
            return aux;
        }

        function sendAnswersFn (){
            $scope.$broadcast('mandarForm', 1); 
            formAnswered.questions = questsAnswered;
            formAnswered._id = self.data._id;

            if(!isAnswered(formAnswered.questions)){

                $scope.questsToResponse.forEach(function(quest){
                    questsAnswered.forEach(function(q){
                        if(quest.question===q.question){
                            quest.answer=q.answer;
                        }
                    })
                })
                AppFactory.notify('Error', 'Tienes preguntas obligatorias sin responder', 'error');
                questsAnswered = []; 
            }
            //all form answered
            else{
                $mdDialog.show({
                    controller: 'confirmDialogCtrl',
                    templateUrl:'scripts/app/formsManager/js/modules/commons/confirmDialog/confirmDialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen,
                    locals:{
                        textBody: '¿Desea enviar el formulario?'
                    }
                })
                .then(function() {
                    self.callback({form:formAnswered});                   
                }, function() {
                });  
            }
        }


        function cancelSendFn(){
             if($state.current.parent==="forms_interviewer"){
                self.callbackCancelBreadcrumb();
                $scope.goTo('intShow')
            }else{
                self.callbackCancelBreadcrumb();
                $scope.goTo('userForms');
            }
        }
        
        function sendInterviewFn (){
            
            var candidate = {name:$scope.formCopy.currentCandidate.name, _id:$scope.formCopy.currentCandidate._id};
            $scope.$broadcast('mandarForm', 1); 
            formAnswered._id = self.data._id;
            formAnswered.questions = questsAnswered;
            formAnswered.candidate = candidate;
            formAnswered.valuation = $scope.formCopy.valuation;

            if(!isAnsweredValuation(formAnswered.questions, formAnswered.valuation)){
                //load answers
                $scope.questsToResponse.forEach(function(quest){
                    questsAnswered.forEach(function(q){
                        if(quest.question===q.question){
                            quest.answer=q.answer;
                        }
                    })
                })
                AppFactory.notify('Error', '"Tienes campos sin responder', 'error');
                questsAnswered = []; 
            }
            //all form answered
            else{
                $mdDialog.show({
                    controller: 'confirmDialogCtrl',
                    templateUrl:'scripts/app/formsManager/js/modules/commons/confirmDialog/confirmDialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen,
                    locals:{
                        textBody: '¿Desea enviar el formulario?'
                    }
                })
                .then(function() {
                    self.callback({form:formAnswered});
                                      
                }, function() {
                    AppFactory.notify('Error', '"Formulario no enviado"', 'error');
                });  
            };
        };

       

        function goToFn(dest){
            $state.go(dest);
        }
    }

    angular.module('formsManagerModule').component('formComponent',{
        templateUrl: 'scripts/app/formsManager/js/components/form/formComponent.html', 
        controller: formComponentController,
        controllerAs: 'self',
        bindings: {
            data: '<',      //Formularios
            option: '<',    //Path
            callback: '&',
            callbackCancelBreadcrumb: '&'
        }
    })
})(angular);