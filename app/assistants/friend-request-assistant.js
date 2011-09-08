function FriendRequestAssistant(argFromPusher) {
	this.passedArgument = argFromPusher
}

FriendRequestAssistant.prototype.setup = function() {
	//update the scene with the passed in message
	this.controller.get('info').update(this.passedArgument.message)
	
	//set up button widget
	this.controller.setupWidget('deny-button', {}, {buttonLabel:'Deny', buttonClass: 'negative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('deny-button'),Mojo.Event.tap, this.handleQuitButton.bind(this))
	this.controller.setupWidget('approve-button', {}, {buttonLabel:'Approve', buttonClass: 'affirmative'})
	//set up button handler
	Mojo.Event.listen(this.controller.get('approve-button'),Mojo.Event.tap, this.handleApproveButton.bind(this))
};
FriendRequestAssistant.prototype.handleQuitButton = function(){
    Mojo.Controller.appController.closeStage(this.passedArgument.stage);
}
FriendRequestAssistant.prototype.handleApproveButton = function(){
	//ADD CONTACT TO LIST
    if(!isFriend(this.passedArgument.r)){
	    _globals.friends.push({
	    	channel: this.passedArgument.r,
	    	name: this.passedArgument.n
	    });
	    
		_globals.db.add("friends",{friends: _globals.friends},
			function(r){
				logthis("saved okay");
			}.bind(this),
			function(r){
				logthis("saved failed");
			}.bind(this)
		);
	}

	PUBNUB.publish({
	    channel  : this.passedArgument.r,
	    message  : {'a':'approve', 'r':_globals.channel,'n':_globals.name},
	    callback : function(info) {
	        // info[0] == 1 for success
	        // info[0] == 0 for failure
	        // info[1] == "D" for "Demo Success" or
	        // info[1] == "S" for "Success with Valid Key" or
	        // info[1] == "Error..." with reason of failure.
	        // if the respons is an error, do not re-publish
	        // the failed publish will re-send automatically
//	        console.log(info);

			if(info[0]==1 || info[0]=="1"){
				Mojo.Controller.appController.closeStage(this.passedArgument.stage);
			}else{
		   		//this.controller.get('addButton').mojo.deactivate();
		   		Mojo.Controller.getAppController().showBanner("error sending! retrying...", {source: 'notification'});			   				
			}

	    }.bind(this)
	});


    
}

FriendRequestAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FriendRequestAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FriendRequestAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
