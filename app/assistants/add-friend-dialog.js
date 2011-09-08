function AddFriendDialogAssistant(sceneAssistant) {
  this.sceneAssistant = sceneAssistant;
}
AddFriendDialogAssistant.prototype.setup = function(widget) {
  this.widget = widget;
  
  // Setup button and event handler
  this.sceneAssistant.controller.setupWidget("addButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKButtonModel = {
      buttonLabel: "Add",
      disabled: false
    }
  );
  this.addTappedBound=this.addTapped.bindAsEventListener(this);

	Mojo.Event.listen(this.sceneAssistant.controller.get('addButton'), Mojo.Event.tap, this.addTappedBound);
  
	this.sceneAssistant.controller.setupWidget('friendcodeField', this.fcAttributes = {hintText:'Enter friend code...',multiline:false,focus:true},
	 this.fcModel = {value:'', disabled:false});
}

AddFriendDialogAssistant.prototype.activate = function() {
	this.sceneAssistant.controller.get('friendcode').mojo.focus();
}


AddFriendDialogAssistant.prototype.addTapped = function() {
	logthis("oktapped");
	
	var url="http://zhephree.com/neato/getfriend/"+this.fcModel.value;
	var request = new Ajax.Request(url, {
	   method: 'get',
	   evalJSON: 'force',
	   onSuccess: function(r){
	   		logthis(Object.toJSON(r.responseText));
			var friendchannel=r.responseText;
			if(friendchannel.indexOf("Invalid")==-1){
				PUBNUB.publish({
				    channel  : friendchannel,
				    message  : {'a':'friend', 'r':_globals.channel,'n':_globals.name},
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
							this.widget.mojo.close();
					   		Mojo.Controller.getAppController().showBanner("friend request sent!", {source: 'notification'});
						}else{
					   		//this.controller.get('addButton').mojo.deactivate();
					   		Mojo.Controller.getAppController().showBanner("error sending! retrying...", {source: 'notification'});			   				
						}
			
				    }.bind(this)
				});

			}else{
			
			}

			this.controller.get("addButton").mojo.deactivate();
	   }.bind(this),
	   onFailure: function(r){
	   		logthis(Object.toJSON(r.responseText));
	   		Mojo.Controller.getAppController().showBanner("error getting friend!", {source: 'notification'});			   
			this.controller.get("addButton").mojo.deactivate();
	   }.bind(this)
	 });

	

/*	_globals.friends.push({
		code: 
	});
	
	_globals.db.add("rules",{rules: _globals.friends},
		function(r){
			logthis("saved okay");
			this.controller.stageController.popScene("add-rule");
		}.bind(this),
		function(r){
			logthis("saved failed");
		}.bind(this)
	);*/

}


AddFriendDialogAssistant.prototype.cleanup = function() {
	Mojo.Event.stopListening(this.sceneAssistant.controller.get('addButton'), Mojo.Event.tap, this.addTappedBound);

}
