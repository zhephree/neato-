function MainAssistant(f) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   this.fromLaunch=f;
}

MainAssistant.prototype.aboutToActivate = function(callback){
    this.cookieData=new Mojo.Model.Cookie("autoclose");
	var acCookie=this.cookieData.get();
	var autoclose=(acCookie)? acCookie.autoclose: true;
	logthis("autoclose="+autoclose);

	this.cookie=new Mojo.Model.Cookie("firstrun");
	var cdata=this.cookie.get();
	var ver=(cdata)? cdata.version: "";
	if(ver!=Mojo.appInfo.version && 1==2){
		/*var dialog = this.controller.showDialog({
			template: 'listtemplates/whatsnew',
			assistant: new WhatsNewDialogAssistant(this)
		});*/
		autoclose=false;
		this.controller.showAlertDialog({
		    onChoose: function(value) {this.cookieData=new Mojo.Model.Cookie("firstrun");this.cookieData.put({version: Mojo.appInfo.version});}.bind(this),
		    title: $L("Important Notice!"),
		    message: $L("In order to make neato! work, if you are upgrading from an older version, you MUST delete your browser bookmarklet and reinstall it to your bookmarks by visiting your neato! URL. If you are using the Chrome extension, it will not work. An update to the Chrome extension will be relased soon."),
		    choices:[
		        {label:$L("I Understand This"), value:"med"}
		    ]
		}); 
	}



	
	
	this.yncookieData=new Mojo.Model.Cookie("yourname");
	var ynCookie=this.yncookieData.get();
	this.yourname=(ynCookie)? ynCookie.yourname: '';
	


	if(this.fromLaunch && autoclose!=false){
		Mojo.Controller.getAppController().closeStage("mainStage");
	}
	
	if(_globals.regenerated==true){
		_globals.regenerated=false;
		this.controller.get("code").update(_globals.newURL);
		this.controller.get("friendcode").update(_globals.newCode);
		logthis("regenerated detected");
	}
	
	callback.defer();
};

MainAssistant.prototype.setup = function() {
	this.ammodel = {
		visible: true,
		items: [
			Mojo.Menu.editItem,
			{label: "Preferences", command: "do-Prefs"},
			{label: "Instructions", command: "do-Help"},
			{label: "About", command: "do-About"}
		]
	};
	this.amattributes = {
		omitDefaultItems: true
	};

	this.controller.setupWidget(Mojo.Menu.appMenu,
       this.amattributes,
       this.ammodel);

/*    this.controller.setupWidget("linkDrawer",
        this.attributes = {
            modelProperty: 'open',
            unstyled: false
        },
        this.model = {
            open: false
        }
    );
  Mojo.Event.listen(this.controller.get("openLinkDrawer"),Mojo.Event.tap,this.toggleLinkDrawer.bind(this));*/
  Mojo.Event.listen(this.controller.get("openLinkSlider"),Mojo.Event.tap,this.toggleLinkSlider.bind(this));
  this.sliderPos=false;
	this.dialogPos=false;
/*  this.controller.setupWidget("generateButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKButtonModel = {
      buttonLabel: "Generate Code",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("generateButton"),Mojo.Event.tap,this.generateURL.bind(this));
  Mojo.Event.listen(this.controller.get("regenerate"),Mojo.Event.tap,this.regenerateURL.bind(this));

  this.controller.setupWidget("generateFriendButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKFriendButtonModel = {
      buttonLabel: "Generate Friend Code",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("generateFriendButton"),Mojo.Event.tap,this.generateFriend.bind(this));*/


  /*this.controller.setupWidget("reloadButton",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Reload Dashboard",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("reloadButton"),Mojo.Event.tap,this.reloadDash.bind(this));*/
  Mojo.Event.listen(this.controller.get("reload-dash-button"),Mojo.Event.tap,this.reloadDash.bind(this));

  /*this.controller.setupWidget("addFriendButton",
    this.attributes = {},
    this.OKFriendAddButtonModel = {
      buttonLabel: "Add a Friend",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("addFriendButton"),Mojo.Event.tap,this.addFriend.bind(this));*/  
  Mojo.Event.listen(this.controller.get("add-friend-button"),Mojo.Event.tap,this.addFriend.bind(this));


  /*this.controller.setupWidget("sendButton",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Send to...",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("sendButton"),Mojo.Event.tap,this.launchSend.bind(this));*/
  Mojo.Event.listen(this.controller.get("send-to-button"),Mojo.Event.tap,this.launchSend.bind(this));

  Mojo.Event.listen(this.controller.get("prefs-button"),Mojo.Event.tap,this.launchPrefs.bind(this));

  /*this.controller.setupWidget("historyButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.OKButtonModel = {
      buttonLabel: "View History",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("historyButton"),Mojo.Event.tap,this.getHistory.bind(this));*/
  Mojo.Event.listen(this.controller.get("refresh-history-button"),Mojo.Event.tap,this.getHistory.bind(this));
  Mojo.Event.listen(this.controller.get("dialog-button"),Mojo.Event.tap,this.hideDialog.bind(this));
	logthis("ipk: "+_globals.ipk);



		this.userurl=new Mojo.Model.Cookie("userurl");
		var uu=this.userurl.get();
		this.url=(uu)? uu.url: '';
		
		if(this.url!=''){
			this.controller.get("code").innerHTML=this.url;
			this.controller.get("url").innerHTML='http://zhephree.com/neato/id/'+this.url;
			var emaillink='<a href="mailto:?subject=neato!%20bookmarklet%20url&body=http://zhephree.com/neato/id/'+this.url+'"><span id="email-button" x-mojo-touch-feedback="immediate"></span> E-mail this to myself</a>';
			this.controller.get("emaillink").innerHTML=emaillink;
			this.controller.get("emaillink").show();
			
			//this.controller.get("regenerate").show();

		}else{
			this.controller.get("code").innerHTML="Wait...";

			this.generateURL();
		}

		this.friendurl=new Mojo.Model.Cookie("friendurl");
		var fu=this.friendurl.get();
		this.friendcode=(fu)? fu.url: '';
		
		if(this.friendcode!=''){
			this.controller.get("friendcode").innerHTML=this.friendcode;
		}else{
			this.controller.get("friendcode").innerHTML="Wait...";
			this.generateFriend();
		}



	this.historyModel = {items: [], listTitle: $L('Results')};

	this.controller.setupWidget('historyList', {itemTemplate:'templates/historyItems',formatters:{"c":this.fixC.bind(this)}},this.historyModel);
	Mojo.Event.listen(this.controller.get('historyList'),Mojo.Event.listTap, this.listWasTapped.bind(this));


    this.controller.setupWidget("enabled",
        this.switchAttributes = {
            trueValue: true,
            trueLabel: "On",
            falseValue: false,
            falseLabel: "Off"
        },
        this.switchModel = {
            value: _globals.subscribed,
            disabled: false
        }
    ); 
	Mojo.Event.listen(this.controller.get("enabled"), Mojo.Event.propertyChange, this.handleState.bind(this));



	this.controller.serviceRequest('palm://com.palm.preferences/systemProperties', {
		method:"Get",
		parameters:{"key": "com.palm.properties.nduid" },
		onSuccess: function(response){
			this.ndid=response['com.palm.properties.nduid'];	
		}.bind(this)
	});
	

	this.handleURL=launchURL.bind(this);

};

MainAssistant.prototype.launchSend = function(event){
	this.controller.stageController.pushScene({name: 'send-data'});
};
MainAssistant.prototype.launchPrefs = function(event){
	this.controller.stageController.pushScene({name: 'preferences'});
};

MainAssistant.prototype.fixC = function(value,model){
	logthis("value="+value);
	return unescape(unescape(value));
};

MainAssistant.prototype.setName = function(event){
	//event.stop();
	var dialog = this.controller.showDialog({
		template: 'templates/setNameDialog',
		assistant: new SetNameDialogAssistant(this,false)
	});
};

MainAssistant.prototype.toggleLinkDrawer = function(event){
/*	this.controller.get("linkDrawer").mojo.toggleState();
	
	logthis(this.controller.get("linkDrawer").mojo.getOpenState());
	
	if(this.controller.get("linkDrawer").mojo.getOpenState()==true){
		this.controller.get("openLinkDrawer").update("Hide Link and Info");
	}else{
		this.controller.get("openLinkDrawer").update("View Link and Info");
	}*/
};

MainAssistant.prototype.toggleLinkSlider = function(event){
	var slider=this.controller.get("link-slider");
	switch(this.sliderPos){
		case false:
			Mojo.Animation.animateStyle(this.controller.get("link-slider"),"top","linear",{from: 103, to: 10, duration: 0.2});
			this.sliderPos=true;
			this.controller.get("openLinkSlider").update("Hide Link and Info");
			break;
		case true:
			Mojo.Animation.animateStyle(this.controller.get("link-slider"),"top","linear",{from: 10, to: 103, duration: 0.2});
			this.sliderPos=false;
			this.controller.get("openLinkSlider").update("View Link and Info");
			break;
	}
};

MainAssistant.prototype.toggleDialog = function(event,title,content){
	var slider=this.controller.get("dialog");
	this.controller.get("dialog-title").update(title);
	this.controller.get("dialog-content").update(content);
	switch(this.dialogPos){
		case false:
			Mojo.Animation.animateStyle(this.controller.get("dialog"),"bottom","linear",{from: -300, to: 0, duration: 0.2});
			this.dialogPos=true;
			break;
		case true:
			Mojo.Animation.animateStyle(this.controller.get("dialog"),"bottom","linear",{from: 0, to: -300, duration: 0.2});
			this.dialogPos=false;
			break;
	}
};

MainAssistant.prototype.hideDialog = function(event){
	Mojo.Animation.animateStyle(this.controller.get("dialog"),"bottom","linear",{from: 0, to: -300, duration: 0.2});
	this.dialogPos=false;
};

MainAssistant.prototype.getHistory = function(event){
	PUBNUB.history( {
	    channel : _globals.channel,
	    limit   : 25
	}, function(messages) {
	    // Shows All Messages
	    	var histItems=[];
	    	for(var h=0;h<messages.length;h++){
				if(messages[h].indexOf){
					if(messages[h].indexOf("%7B")>-1){
						messages[h]=eval("("+unescape(messages[h])+")");
					}
				}				
			    messages[h].c=unescape(messages[h].c);
	    		if(messages[h].a=="text" || messages[h].a=="url"){
	    			if(isUrl(messages[h].c)){
	    				messages[h].a="url";
	    			}
	    			histItems.push(messages[h]);
	    		}
	    	}
	    	if(histItems.length==0){
	    		histItems.push({'a':'none','c':'No recent history items'});
	    	}
			this.historyModel.items=histItems;
			this.controller.modelChanged(this.historyModel);
			//this.controller.get("historyButton").mojo.deactivate();
	}.bind(this) );
	

	/*//var url="http://pubsub.pubnub.com/history/4eb7b6f8-a49c-11df-83df-cb0b90d0ba4b/"+_globals.channel+"/0/10";	
	var url="http://pubnub-prod.appspot.com/pubnub-history?channel=4eb7b6f8-a49c-11df-83df-cb0b90d0ba4b/"+_globals.channel+"&limit=10";
	logthis(url);
	var request = new Ajax.Request(url, {
	   method: 'get',
	   evalJSON: 'force',
	   onSuccess: function(r){
	   		logthis(Object.toJSON(r.responseText));
			this.historyModel.items=r.responseJSON.messages;
			this.controller.modelChanged(this.historyModel);
			this.controller.get("historyButton").mojo.deactivate();
	   }.bind(this),
	   onFailure: function(r){
	   		logthis(Object.toJSON(r.responseText));
	   		Mojo.Controller.getAppController().showBanner("error getting history!", {source: 'notification'});			   
			this.controller.get("historyButton").mojo.deactivate();
	   }.bind(this)
	 });*/

};
MainAssistant.prototype.regenerateURL = function(event) {
	this.generateURL();
	this.generateFriend();
};

MainAssistant.prototype.generateURL = function(event) {
		var url = 'http://zhephree.com/neato/generate.php?ndid='+_globals.channel;
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'force',
			onSuccess: function(r){
				logthis(r.responseText);
				this.controller.get("url").innerHTML='http://zhephree.com/neato/id/'+r.responseJSON.url;
				this.userurl=new Mojo.Model.Cookie("userurl");
				this.userurl.put(
					{"url":r.responseJSON.url}
				);
				
				this.controller.get("code").update(r.responseJSON.url);
				var emaillink='<a href="mailto:?subject=neato!%20bookmarklet%20url&body=http://zhephree.com/neato/id/'+r.responseJSON.url+'"><span id="email-button" x-mojo-touch-feedback="immediate"></span> E-mail this to myself</a>';
				this.controller.get("openLinkSlider").update("Hide Link and Info");
				
				this.controller.get("emaillink").innerHTML=emaillink;
				this.controller.get("emaillink").show();
				this.sliderPos=false;
				this.toggleLinkSlider();
				this.toggleDialog(undefined,"Welcome!","Your neato! codes have been generated! You should visit your neato! URL (visible after you close this dialog) on your computer so that you can copy your neato! bookmarklet or download a browser extension so that you can start sending stuff to and from your phone and computer and other neato! users.<br/><br/>Thanks for downloading! Be sure to follow me on twitter at <a href=\"http://twitter.com/neato_webos\">@neato_webos</a>");
				
			}.bind(this),
			onFailure: function(r){logthis(r.responseText);}.bind(this)
		});

};

MainAssistant.prototype.generateFriend = function(event) {
		var url = 'http://zhephree.com/neato/generate-friend.php?ndid='+_globals.channel;
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'force',
			onSuccess: function(r){
				logthis(r.responseText);
				this.friendurl=new Mojo.Model.Cookie("friendurl");
				this.friendurl.put(
					{"url":r.responseJSON.code}
				);
				
				this.controller.get("friendcode").update(r.responseJSON.code);
				this.setName(event);
				//this.controller.get("friend-button-row").hide();
				//this.controller.get("generateFriendButton").mojo.deactivate();
				
			}.bind(this),
			onFailure: function(r){logthis(r.responseText);}.bind(this)
		});

};

MainAssistant.prototype.handleState = function(event) {
	switch(this.switchModel.value){
		case true:
		    var appController = Mojo.Controller.getAppController();
		    var dashStageController = appController.getStageController("caeDash");
			Mojo.Event.send(dashStageController.document.getElementById("stateHandler"),"sub");

			break;
		case false:
			//pubUnsub();
		    var appController = Mojo.Controller.getAppController();
		    var dashStageController = appController.getStageController("caeDash");
			Mojo.Event.send(dashStageController.document.getElementById("stateHandler"),"unsub");
			break;
	}
};
MainAssistant.prototype.handleCommand = function(event) {
	switch(event.command){
		case "do-Help":
			this.controller.serviceRequest('palm://com.palm.applicationManager', {
				 method: 'open',
				 parameters: {
					 target: 'http://zhephree.com/neato/help'
				 }
			});
			break;
		case "do-About":
			this.controller.stageController.pushScene("about");
			break;
		case "do-Prefs":
			this.controller.stageController.pushScene("preferences");
			break;
	}
};

MainAssistant.prototype.reloadDash = function(event){
    var appController = Mojo.Controller.getAppController();
    var dashboardStageController = appController.getStageProxy("caeDash");
	var pushDashboard = function(stageController){
		stageController.pushScene("dashboard");
	};
	if(!dashboardStageController){
		appController.createStageWithCallback({name: "caeDash", lightweight: false}, pushDashboard, "dashboard");
	}
};

MainAssistant.prototype.addFriend = function(event) {
	event.stop();
	var dialog = this.controller.showDialog({
		template: 'templates/addFriendDialog',
		assistant: new AddFriendDialogAssistant(this)
	});
};

MainAssistant.prototype.listWasTapped = function(event){
	var message=event.item;
   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		var maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		var ipk=(un)? un.ipk: "preware";

	switch(event.item.a){
		case "url":
			this.handleURL(event.item.c);
			break;
		case "text":
		   		//first, see what kind of text it is
		   		var phoneRegex = /^(?:(\d)[ \-\.]?)?(?:\(?(\d{3})\)?[ \-\.])?(\d{3})[ \-\.](\d{4})(?: ?x?(\d+))?$/;
		   		var phone=event.item.c.match(phoneRegex);
		   		
		   		logthis("phone="+Object.toJSON(phone));
		   		if(phone){
		   			//strip non-numeric charsmus
		   			var no=['(',')','.',' ','-','/'];
		   			var em=['','','','','',''];
		   			phonenum=phone[0].replace(no,em);
					this.controller.serviceRequest('palm://com.palm.applicationManager', {
						 method: 'open',
						 parameters: {
							 target: 'tel://'+phonenum
						 }
					});
	
		   		}else if(isUrl(event.item.c)){
					this.handleURL(event.item.c);
		   		}else{
		   			
		   		
		   		    var appController = Mojo.Controller.getAppController();
				    var cardStageController = appController.getStageController("mainStage");
	
				    var pushMainScene = function(stageController) {
						stageController.pushScene('textview',event.item.c);
				
				    };
				    var stageArguments = {name: "mainStage", lightweight: true};
				    if(!cardStageController){
					    appController.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
					}else{
						cardStageController.pushScene('textview',event.item.c);
					}
				}
	   			
			break;
	}
};

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */




	   NEATO.Metrix.checkBulletinBoard(this.controller, Mojo.appInfo.version);
	   
	   if(_globals.subscribed==false){
	   	this.switchModel.value=true;
	   	this.controller.modelChanged(this.switchModel);
	   }
	   
	   this.getHistory();
};


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
