function ReceivedUrlAssistant(argFromPusher) {
	this.passedArgument = argFromPusher
}

ReceivedUrlAssistant.prototype.setup = function() {
	//update the scene with the passed in message
	this.controller.get('info').update(this.passedArgument.message)
	this.controller.get('title').update(this.passedArgument.title)
	
	//set up button widget
	this.controller.setupWidget('deny-button', {}, {buttonLabel:'Ignore', buttonClass: 'negative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('deny-button'),Mojo.Event.tap, this.handleQuitButton.bind(this))
	this.controller.setupWidget('approve-button', {}, {buttonLabel:'Open', buttonClass: 'affirmative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('approve-button'),Mojo.Event.tap, this.handleApproveButton.bind(this))
	this.handleURL=launchURL.bind(this);

};

ReceivedUrlAssistant.prototype.handleQuitButton = function(){
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
};

ReceivedUrlAssistant.prototype.handleApproveButton = function(){
	this.handleURL(this.passedArgument.url);
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
};

ReceivedUrlAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ReceivedUrlAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ReceivedUrlAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
