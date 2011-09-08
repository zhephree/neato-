function TextviewAssistant(t) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   this.text=unescape(t);
}

TextviewAssistant.prototype.setup = function() {
	this.actionModel = {items: [
		{icon: 'copy',
		caption: 'Copy',
		action: 'copy'
		},
		{icon: 'email',
		caption: 'E-mail',
		action: 'email'
		},
		{icon: 'sms',
		caption: 'SMS',
		action: 'sms'
		},
		{icon: 'badkitty',
		caption: 'Tweet with BadKitty',
		action: 'badkitty'
		},
		{icon: 'twee',
		caption: 'Tweet with Twee',
		action: 'twee'
		},
		{icon: 'notes',
		caption: 'Add to Notes',
		action: 'notes'
		},
		{icon: 'pnt',
		caption: 'Track with Pack \'N\' Track',
		action: 'pnt'
		}
	], listTitle: $L('Info')};
    
	// Set up the attributes & model for the List widget:
	this.controller.setupWidget('actionList', 
					      {itemTemplate:'templates/actionItems'},
					      this.actionModel);
	Mojo.Event.listen(this.controller.get('actionList'),Mojo.Event.listTap, this.actionTapped.bindAsEventListener(this));

/*
  this.controller.setupWidget("copyText",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Copy Text",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("copyText"),Mojo.Event.tap,this.copyText.bind(this));

  this.controller.setupWidget("emailText",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Email Text",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("emailText"),Mojo.Event.tap,this.emailText.bind(this));

  this.controller.setupWidget("smsText",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "SMS Text",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("smsText"),Mojo.Event.tap,this.smsText.bind(this));*/

  this.controller.setupWidget('text-content', this.textAttributes = {multiline:true,focus:true}, this.textModel = {value:this.text, disabled:false});

};

TextviewAssistant.prototype.copyText = function(event) {
	this.controller.stageController.setClipboard(this.textModel.value);
	Mojo.Controller.getAppController().showBanner("Text copied!", {source: 'notification'});
};
TextviewAssistant.prototype.emailText = function(event) {
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		 method: 'open',
		 parameters: {
			 target: 'mailto:?body='+encodeURIComponent(this.textModel.value)
		 }
	});

};
TextviewAssistant.prototype.smsText = function(event) {
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	     method: 'launch',
	     parameters: {
	         id: 'com.palm.app.messaging',
	         params: {
	             composeRecipients: [],
	        	 messageText: this.textModel.value
	         }
	     }
	 });
 
};

TextviewAssistant.prototype.actionTapped = function(event) {
	switch(event.item.action){
		case "copy":
			this.copyText();
			break;
		case "email":
			this.emailText();
			break;
		case "sms":
			this.smsText();
			break;
		case "badkitty":
		   try{
		      this.controller.serviceRequest("palm://com.palm.applicationManager", {
		         method: 'launch',
		         parameters: {
		            id: 'com.superinhuman.badkitty',
		            params: {action: 'tweet', tweet: this.textModel.value}
		         },
		         onSuccess:function(){
		            /*
		              INSERT ANY CODE YOU WANT EXECUTED UPON SUCCESS OF LAUNCHING BADKITTY
		            */
		         }.bind(this),
		         onFailure:function(){
		            logthis("no bad kitty");
					this.controller.showAlertDialog({
					    onChoose: function(value) {
					    	if(value=="yes"){
					            this.controller.serviceRequest('palm://com.palm.applicationManager', {
					                method:'open',
					                   parameters:{
					                   target: 'http://developer.palm.com/appredirect/?packageid=com.superinhuman.badkitty'
					                        }
					             });
					    	}
					    },
					    title: $L("Bad Kitty is not Installed"),
					    message: $L("Would you like to download Bad Kitty by Superinhuman Industries?"),
					    choices:[
					        {label:$L('Yes'), value:"yes", type:'affirmative'},  
					        {label:$L("No"), value:"no", type:'negative'},    
					    ]
					});
		         }.bind(this)
		      })
		   }catch(e){
		      /*
		       INSERT ANY ERROR HANDLING CODE HERE
		     */
		     	logthis("no bad kitty");
		   }
			break;
		case "twee":
		   try{
		      this.controller.serviceRequest("palm://com.palm.applicationManager", {
		         method: 'launch',
		         parameters: {
		            id: 'com.deliciousmorsel.twee',
		            params: {tweet: this.textModel.value}
		         },
		         onSuccess:function(){
		            /*
		              INSERT ANY CODE YOU WANT EXECUTED UPON SUCCESS OF LAUNCHING BADKITTY
		            */
		         }.bind(this),
		         onFailure:function(){
		            logthis("no twee");
					this.controller.showAlertDialog({
					    onChoose: function(value) {
					    	if(value=="yes"){
					            this.controller.serviceRequest('palm://com.palm.applicationManager', {
					                method:'open',
					                   parameters:{
					                   target: 'http://developer.palm.com/appredirect/?packageid=com.deliciousmorsel.twee'
					                        }
					             });
					    	}
					    },
					    title: $L("Twee is not Installed"),
					    message: $L("Would you like to download Twee by Delicious Morsel?"),
					    choices:[
					        {label:$L('Yes'), value:"yes", type:'affirmative'},  
					        {label:$L("No"), value:"no", type:'negative'},    
					    ]
					});
		         }.bind(this)
		      })
		   }catch(e){
		      /*
		       INSERT ANY ERROR HANDLING CODE HERE
		     */
		     	logthis("no twee");
		   }
			break;
		case "notes":
		   try{
		      this.controller.serviceRequest("palm://com.palm.applicationManager", {
		         method: 'launch',
		         parameters: {
		            id: 'com.ingloriousapps.notes',
		            params: {newNote: this.textModel.value}
		         },
		         onSuccess:function(){
		            /*
		              INSERT ANY CODE YOU WANT EXECUTED UPON SUCCESS OF LAUNCHING BADKITTY
		            */
		         }.bind(this),
		         onFailure:function(){
		            logthis("no notes");
					this.controller.showAlertDialog({
					    onChoose: function(value) {
					    	if(value=="yes"){
					            this.controller.serviceRequest('palm://com.palm.applicationManager', {
					                method:'open',
					                   parameters:{
					                   target: 'http://developer.palm.com/appredirect/?packageid=com.ingloriousapps.notes'
					                        }
					             });
					    	}
					    },
					    title: $L("Notes is not Installed"),
					    message: $L("Would you like to download Notes by Inglorious Apps?"),
					    choices:[
					        {label:$L('Yes'), value:"yes", type:'affirmative'},  
					        {label:$L("No"), value:"no", type:'negative'},    
					    ]
					});
		         }.bind(this)
		      })
		   }catch(e){
		      /*
		       INSERT ANY ERROR HANDLING CODE HERE
		     */
		     	logthis("no notes2");
		   }
			break;
		case "pnt":
		   try{
		      this.controller.serviceRequest("palm://com.palm.applicationManager", {
		         method: 'launch',
		         parameters: {
		            id: 'com.gosyntactix.paid.packntrack',
		            params: {action: 'addPackage', trackingNumber: this.textModel.value}
		         },
		         onSuccess:function(){
		            /*
		              INSERT ANY CODE YOU WANT EXECUTED UPON SUCCESS OF LAUNCHING BADKITTY
		            */
		         }.bind(this),
		         onFailure:function(){
		            logthis("no notes");
					this.controller.showAlertDialog({
					    onChoose: function(value) {
					    	if(value=="yes"){
					            this.controller.serviceRequest('palm://com.palm.applicationManager', {
					                method:'open',
					                   parameters:{
					                   target: 'http://developer.palm.com/appredirect/?packageid=com.gosyntactix.paid.packntrack'
					                        }
					             });
					    	}
					    },
					    title: $L("Pack 'N' Track is not Installed"),
					    message: $L("Would you like to download Pack 'N' Track by Syntactix?"),
					    choices:[
					        {label:$L('Yes'), value:"yes", type:'affirmative'},  
					        {label:$L("No"), value:"no", type:'negative'},    
					    ]
					});
		         }.bind(this)
		      })
		   }catch(e){
		      /*
		       INSERT ANY ERROR HANDLING CODE HERE
		     */
		     	logthis("no notes2");
		   }
			break;
	}
};

TextviewAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

TextviewAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

TextviewAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
