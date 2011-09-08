function ReceivedContactAssistant(argFromPusher) {
	this.passedArgument = argFromPusher
}

ReceivedContactAssistant.prototype.setup = function() {
	//update the scene with the passed in message
	this.controller.get('info').update(this.passedArgument.message)
	this.controller.get('title').update(this.passedArgument.title)
	
	//set up button widget
	this.controller.setupWidget('deny-button', {}, {buttonLabel:'Ignore', buttonClass: 'negative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('deny-button'),Mojo.Event.tap, this.handleQuitButton.bind(this))

	this.controller.setupWidget('existing-button', {}, {buttonLabel:'Save to Existing', buttonClass: 'secondary'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('existing-button'),Mojo.Event.tap, this.handleExistingButton.bind(this))

	this.controller.setupWidget('new-button', {}, {buttonLabel:'Save to New Contact', buttonClass: 'affirmative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('new-button'),Mojo.Event.tap, this.handleNewButton.bind(this))

	this.handleURL=launchURL.bind(this);
};

ReceivedContactAssistant.prototype.handleQuitButton = function(){
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
};

ReceivedContactAssistant.prototype.handleExistingButton = function(){
   Mojo.Controller.appController.closeStage(this.passedArgument.stage);
	var os=Mojo.Environment.DeviceInfo.platformVersion;
	if(os.substr(0,2)=="1."){
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: "open",
			parameters: 
			{
				id: "com.palm.app.contacts",
				params: 
				{
					contact: this.passedArgument.contact,
					launchType: "addToExisting"
				}
			}
		});  
	}else{
	
	}
};

ReceivedContactAssistant.prototype.handleNewButton = function(){
	logthis(Object.toJSON(this.passedArgument.contact));
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
	var os=Mojo.Environment.DeviceInfo.platformVersion;
	if(os.substr(0,2)=="1."){
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: "open",
			parameters: 
			{
				id: "com.palm.app.contacts",
				params: 
				{
					contact: this.passedArgument.contact,
					launchType: "newContact"
				}
			}
		});  
	}else{
	
	}	
	
/*    this.controller.serviceRequest('palm://com.palm.contacts/crud', {
       method: 'createContact',
       parameters: {
       accountId: _globals.synergyAccount,
       contact: this.passedArgument.contact,
       externalId: _globals.synergyAccount,
       trackChange: false
       },
          onSuccess: function(){
				Mojo.Controller.getAppController().showBanner("contact saved!", {source: 'notification'});
			    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
      
          }.bind(this),

          onFailure: function(response){
     			logthis(Object.toJSON(response));
				Mojo.Controller.getAppController().showBanner("error saving contact!", {source: 'notification'});
			    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
     			
          }.bind(this)
       });*/
       
       	
};


ReceivedContactAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ReceivedContactAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ReceivedContactAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
