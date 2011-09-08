function DashboardAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DashboardAssistant.prototype.setup = function() {
    this.switchHandler = this.launchMain.bindAsEventListener(this);
    this.controller.listen("card-button", Mojo.Event.tap, this.switchHandler);

    this.prefsHandler = this.launchPrefs.bindAsEventListener(this);
    this.controller.listen("prefs-small-button", Mojo.Event.tap, this.prefsHandler);

    this.sendHandler = this.launchSend.bindAsEventListener(this);
    this.controller.listen("send-small-button", Mojo.Event.tap, this.sendHandler);

    this.controller.listen("stateHandler", "sub", this.pubSub.bind(this));
    this.controller.listen("stateHandler", "unsub", this.pubUnsub.bind(this));
	this.controller.serviceRequest('palm://com.palm.preferences/systemProperties', {
		method:"Get",
		parameters:{"key": "com.palm.properties.nduid" },
		onSuccess: function(response){
			this.ndid=response['com.palm.properties.nduid'];
			_globals.channel=this.ndid;
			this.startWatching();	
		}.bind(this)
	});

	logthis("dash channel="+_globals.channel);

	//this.startWatching();
	this.handleURL=launchURL.bind(this);

};

DashboardAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

DashboardAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

DashboardAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
    this.controller.stopListening("card-button", Mojo.Event.tap, this.switchHandler);
    this.controller.stopListening("prefs-small-button", Mojo.Event.tap, this.prefsHandler);
    this.controller.stopListening("send-small-button", Mojo.Event.tap, this.sendHandler);
};

DashboardAssistant.prototype.launchMain = function() {
    Mojo.Log.info("Tap to Dashboard");
    var appController = Mojo.Controller.getAppController();
    appController.assistant.handleLaunch({action: "notification"});
//    this.controller.window.close();
};
DashboardAssistant.prototype.launchPrefs = function() {
    Mojo.Log.info("Tap to Dashboard");
    var appController = Mojo.Controller.getAppController();
    appController.assistant.handleLaunch({action: "prefs"});
//    this.controller.window.close();
};
DashboardAssistant.prototype.launchSend = function() {
    Mojo.Log.info("Tap to Dashboard");
    var appController = Mojo.Controller.getAppController();
    appController.assistant.handleLaunch({action: "open-send"});
//    this.controller.window.close();
};


DashboardAssistant.prototype.startWatching = function() {
	logthis("starting...");
	this.pubSub();

	this.controller.serviceRequest('palm://com.palm.display', {
	    method:'status',
	    parameters:{subscribe:true},
	    onSuccess: function(r){
	    	switch(r.event){
	    		case "displayOff":
	    			this.pubUnsub();
	    			break;
	    		case "displayOn":
	    			this.pubSub();
	    			break;
	    	}
	    }.bind(this)
	});



};


DashboardAssistant.prototype.handleMessage = function(message){
		Mojo.Controller.getAppController().showBanner("neato! message received!", {source: 'notification'});
   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		var maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		var ipk=(un)? un.ipk: "preware";

		if(message.indexOf){
			message=eval("("+unescape(message)+")");
		}
		
		
		if(message.firstName){ //received a contact
			logthis("received contact");
		}else{
		
	       message.c=unescape(message.c);
		   switch(message.a){
		   		case "url":
					this.handleURL(message.c);
		   			break;
		   		case "text":
			   		//first, see what kind of text it is
			   		var phoneRegex = /^(?:(\d)[ \-\.]?)?(?:\(?(\d{3})\)?[ \-\.])?(\d{3})[ \-\.](\d{4})(?: ?x?(\d+))?$/;
			   		var phone=message.c.match(phoneRegex);
			   		
			   		logthis("phone="+Object.toJSON(phone));
			   		if(phone){
			   			//strip non-numeric chars
			   			var no=['(',')','.',' ','-','/'];
			   			var em=['','','','','',''];
			   			phonenum=phone[0].replace(no,em);
						this.controller.serviceRequest('palm://com.palm.applicationManager', {
							 method: 'open',
							 parameters: {
								 target: 'tel://'+phonenum
							 }
						});
		
			   		}else if(isUrl(message.c)){
			   			if(message.n=="" || message.n==undefined){		   		
							this.handleURL(message.c);
						}else{
				   			var theirName=unescape(message.n);
						    var appController = Mojo.Controller.getAppController();
						    var stageName = "gotUrlStage";
						    var text=theirName+" has sent you the URL <b>"+message.c+"</b>";
						    
						    var f = function(stageController){
								//We can't use our showScene function from our app's stage assistant here since this
								//stageController is actually a new stage controller specifically for our popup alert.
						        stageController.pushScene({name: "received-url",
									       		   		   sceneTemplate: "received-url/received-url-scene"},
														   {
														 	  message: text,
															  stage: stageName,
															  url: message.c,
															  n: theirName
														   });
						    };
						    appController.createStageWithCallback({
						        name: stageName,
						        height: 245,
								lightweight: true
						    }, f, 'popupalert');					
						}
			   		}else{
			   			
			   		
			   		    var appController = Mojo.Controller.getAppController();
					    var cardStageController = appController.getStageController("mainStage");
		
					    var pushMainScene = function(stageController) {
							stageController.pushScene('textview',message.c);
					
					    };
					    var stageArguments = {name: "mainStage", lightweight: true};
					    if(!cardStageController){
						    appController.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
						}else{
							cardStageController.pushScene('textview',message.c);
						}
					}
		   			
		   			break;
		   		case "friend": //got a friend request
		   			var requestingChannel=message.r;
		   			var theirName=message.n;
				    var appController = Mojo.Controller.getAppController();
				    var stageName = "requestStage";
				    var text=theirName+" has requested to add you to their neato! contacts.";
				    
				    var f = function(stageController){
						//We can't use our showScene function from our app's stage assistant here since this
						//stageController is actually a new stage controller specifically for our popup alert.
				        stageController.pushScene({name: "friend-request",
							       		   		   sceneTemplate: "friend-request/friend-request-scene"},
												   {
												 	  message: text,
													  stage: stageName,
													  r: requestingChannel,
													  n: theirName
												   });
				    };
				    appController.createStageWithCallback({
				        name: stageName,
				        height: 245,
						lightweight: true
				    }, f, 'popupalert');
					
		   			
		   			break;
		   		case "approve": //got a friend request approval
		   			var requestingChannel=message.r;
		   			var theirName=message.n;
				    var appController = Mojo.Controller.getAppController();
				    var stageName = "requestStage";
				    var text=theirName+" has approved your friend request.";
				    
				    //STORE THEIR CONTACT INFO
				   if(!isFriend(requestingChannel)){
					    _globals.friends.push({
					    	channel: requestingChannel,
					    	name: theirName
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
				    
				    
				    var f = function(stageController){
						//We can't use our showScene function from our app's stage assistant here since this
						//stageController is actually a new stage controller specifically for our popup alert.
				        stageController.pushScene({name: "approve-request",
							       		   		   sceneTemplate: "approve-request/approve-request-scene"},
												   {
												 	  message: text,
													  stage: stageName,
													  r: requestingChannel,
													  n: theirName
												   });
				    };
				    appController.createStageWithCallback({
				        name: stageName,
				        height: 205,
						lightweight: true
				    }, f, 'popupalert');
					
		   			
		   			break;
		   		case "contact":
		   			logthis(message.c);
		   			logthis(message.n);
		   			var contact=eval("("+message.c+")");
		   			logthis("contact received");
		   			
		   			var fname=contact.firstName;
		   			var lname=(contact.lastName)? " "+contact.lastName: '';
		   			var cName=fname+lname;
		   			var requestingChannel=message.r;
		   			var theirName=message.n;
				    var appController = Mojo.Controller.getAppController();
				    var stageName = "contactStage";
				    var text=theirName+" has sent you contact information for "+cName;
		   			
				    var f = function(stageController){
						//We can't use our showScene function from our app's stage assistant here since this
						//stageController is actually a new stage controller specifically for our popup alert.
				        stageController.pushScene({name: "received-contact",
							       		   		   sceneTemplate: "received-contact/received-contact-scene"},
												   {
												 	  message: text,
													  stage: stageName,
													  r: requestingChannel,
													  n: theirName,
													  contact: contact
												   });
				    };
				    appController.createStageWithCallback({
				        name: stageName,
				        height: 855,
						lightweight: true
				    }, f, 'popupalert');
		   			
		   			break;
		   }
		}
};

DashboardAssistant.prototype.pubSub = function(){
	logthis("subbed");
	this.controller.get("dashboard-text").innerHTML='neato!';
	_globals.subscribed=true;
	/*PUBNUB.subscribe({
	    channel : this.ndid
	  	}, function(message) {
	    // Show Message
	    logthis(Object.toJSON(message));
	    this.handleMessage(message);
	}.bind(this) );*/
	logthis("ndid="+this.ndid);
	
	PUBNUB.subscribe({
	    channel  : this.ndid,
	    callback : function(message) {
	    		logthis(Object.toJSON(message));
	    		this.handleMessage(message);
	    	}.bind(this),
	    error    : function(e) {
	        // Do not call subscribe() here.
	        // PUBNUB will auto-reconnect.
	        logthis(e);
			//Mojo.Controller.getAppController().showBanner("error receiving!", {source: 'notification'});        
	    }.bind(this)
	});
	

};

DashboardAssistant.prototype.pubUnsub = function(){
	logthis("unsubbed");
	this.controller.get("dashboard-text").innerHTML='Disconnected.';
	_globals.subscribed=false;
	PUBNUB.unsubscribe({
	    channel : this.ndid
	  	});

};