class CustomTranslationController{
  constructor($scope, $rootScope, socketService, mockService, $log, $translate, modalService) {
    'ngInject';
    this.modalService = modalService;
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.allLanguages;
    this.init();
    this.value = {
        value: 0,
        label: 'Unknown'
    };
    this.translationLanguage = '';
    this.percentageTranslated = '0%';
    this.showPercentage = false;
    this.loading = false;
    this.loadingContribute = false;
  }

  init(){
    this.showPlugin = false;
    this.registerListner();
    this.initService();
  }

  registerListner(){
    let self = this;
    self.socketService.on('pushAllLanguages', function (data)
    {
      self.allLanguages = data.languages;
      self.showPlugin = true;
    });

    self.socketService.on('pushPercentage', function (data)
    {
      self.percentageTranslated = data;
      self.showPercentage = true;
      self.loading = false;
    });

    self.socketService.on('contributeResponse', function(){
      self.loadingContribute = false;
    });
  }

  initService() {
    this.socketService.emit('getAllLanguages');
  }

  onChange(language){
    let self = this;
    self.translationLanguage = language.code;
  }

  contribute(){
    let self = this;
    if(self.percentageTranslated !== '100%'){
      self.modalService.openDefaultErrorModal('TRANSLATION.MODAL_ERROR');
    } else {
      self.modalService.openDefaultConfirm('TRANSLATION.CONTRIBUTE','TRANSLATION.GIT', () =>{
        self.loadingContribute = true;
        self.socketService.emit('contribute');
      });
    }
  }

  showTranslation(){
    let self = this;
    self.loading = true;
    if(self.translationLanguage !== '' && self.translationLanguage !== undefined){
      var data = {
        translation_language : {
          value : self.translationLanguage
        }
      };
      self.socketService.emit('showTranslations', data);
    } else {
      console.log('Error: Language not selected');
    }
  }
}

export default CustomTranslationController;