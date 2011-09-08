function ApproveRequestAssistant(argFromPusher) {
	this.passedArgument = argFromPusher
}

ApproveRequestAssistant.prototype.setup = function() {
	//update the scene with the passed in message
	this.controller.get('info').update(this.passedArgument.message)
	
	//set up button widget
	this.controller.setupWidget('ok-button', {}, {buttonLabel:'OK'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('ok-button'),Mojo.Event.tap, this.handleQuitButton.bind(this))
};

ApproveRequestAssistant.prototype.handleQuitButton = function(){
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
}


ApproveRequestAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ApproveRequestAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ApproveRequestAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
