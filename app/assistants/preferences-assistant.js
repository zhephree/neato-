function PreferencesAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

PreferencesAssistant.prototype.aboutToActivate = function(callback){
    this.cookieData=new Mojo.Model.Cookie("autoclose");
	var acCookie=this.cookieData.get();
	var autoclose=(acCookie)? acCookie.autoclose: true;
	logthis("autoclose="+autoclose);

	if(!acCookie){
		this.cookieData=new Mojo.Model.Cookie("autoclose");
		this.cookieData.put(
			{"autoclose":true}
		)	
	}

	this.yncookieData=new Mojo.Model.Cookie("yourname");
	var ynCookie=this.yncookieData.get();
	var yourname=(ynCookie)? ynCookie.yourname: '';

	if(yourname!=''){
		try{
			this.controller.get("yourname").update(yourname);
			_globals.name=yourname;
		}catch(e){
		
		}
	}



	callback.defer();

};
PreferencesAssistant.prototype.setup = function() {
  this.controller.setupWidget("addLauncherButton",
    this.attributes = {},
    this.OKButtonModel = {
      buttonLabel: "Add Launcher Icon",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("addLauncherButton"),Mojo.Event.tap,this.addLauncher.bind(this));

  this.controller.setupWidget("regenerateButton",
    this.attributes = {type : Mojo.Widget.activityButton},
    this.regenButtonModel = {
      buttonLabel: "Regenerate",
      disabled: false
    }
  );
  
  Mojo.Event.listen(this.controller.get("regenerateButton"),Mojo.Event.tap,this.regenerate.bind(this));

  Mojo.Event.listen(this.controller.get("setName"),Mojo.Event.tap,this.setName.bind(this));

    this.controller.setupWidget("appMaps",
        this.mapAppsAttributes = {
            choices: [
                {label: "Google Maps", value: "google"},
                {label: "Sprint Navigator", value: "sprintnav"},
                {label: "VZ Navigator", value: "vznav"}
                ],
            label: 'Maps'},

        this.mapAppsModel = {
        value: _globals.maps,
        disabled: false
        }
    );

    this.controller.setupWidget("appIPK",
        this.ipkAppsAttributes = {
            choices: [
                {label: "Internalz", value: "internalz"},
                {label: "Preware", value: "preware"}
                ],
            label:'.ipk'},

        this.ipkAppsModel = {
        value: _globals.ipk,
        disabled: false
        }
    );
	Mojo.Event.listen(this.controller.get("appMaps"), Mojo.Event.propertyChange, this.handleMaps.bind(this));
	Mojo.Event.listen(this.controller.get("appIPK"), Mojo.Event.propertyChange, this.handleIPK.bind(this));

    this.controller.setupWidget("sendstats",
        this.statsattributes = {
            choices: [
                {label: "Sure! I'll Help!", value: "true"},
                {label: "No, thanks.", value: "false"}
                ]},

        this.statsmodel = {
        value: _globals.sendstats,
        disabled: false
        }
    );
	Mojo.Event.listen(this.controller.get("sendstats"), Mojo.Event.propertyChange, this.handleStats.bind(this));

    this.cookieData=new Mojo.Model.Cookie("autoclose");
	var acCookie=this.cookieData.get();
	var autoclose=(acCookie)? acCookie.autoclose: true;


    this.controller.setupWidget("autoclose",
         this.ACattributes = {
             trueValue: true,
             falseValue: false 
         },
         this.ACmodel = {
             value: autoclose,
             disabled: false
         }
     );

	
    this.handleAutocloseBound=this.handleAutoclose.bind(this);
   	Mojo.Event.listen(this.controller.get("autoclose"), Mojo.Event.propertyChange, this.handleAutocloseBound);




    this.cookieData=new Mojo.Model.Cookie("schedule");
	var sCookie=this.cookieData.get();
	var schedule=(sCookie)? sCookie.schedule: false;
	


    this.controller.setupWidget("schedule",
         this.scheduleAttributes = {
             trueValue: true,
             falseValue: false 
         },
         this.scheduleModel = {
             value: schedule,
             disabled: false
         }
     );

    this.handleScheduleBound=this.handleSchedule.bind(this);
   	Mojo.Event.listen(this.controller.get("schedule"), Mojo.Event.propertyChange, this.handleScheduleBound);


	var currentTime = new Date();
	//var oneday=86400000;
	//currentTime=new Date(currentTime.getTime()+oneday);
	
	
    this.cookieData=new Mojo.Model.Cookie("startTime");
	var stCookie=this.cookieData.get();
	var starttime=(stCookie!=undefined)? new Date(parseInt(stCookie.startTime)): currentTime;
	//logthis("st="+stCookie.startTime);
	
	this.controller.setupWidget("startTime",
	  this.lauchTimeAttributes = {
	      label: 'Launch',
	      labelPlacement: Mojo.Widget.labelPlacementRight,
	      modelProperty: 'time'
	  },
	  this.launchTimeModel = {
	      time: starttime
	  }
	); 
	
    this.handleLaunchTimeBound=this.handleLaunchTime.bind(this);
   	Mojo.Event.listen(this.controller.get("startTime"), Mojo.Event.propertyChange, this.handleLaunchTimeBound);
	

    this.cookieData=new Mojo.Model.Cookie("closeTime");
	var ctCookie=this.cookieData.get();
	var closetime=(ctCookie!=undefined)? new Date(parseInt(ctCookie.closeTime)): currentTime;
	//logthis("ct="+ctCookie.closeTime);
		
	this.controller.setupWidget("closeTime",
	  this.closeTimeAttributes = {
	      label: 'Close',
	      labelPlacement: Mojo.Widget.labelPlacementRight,
	      modelProperty: 'time'
	  },
	  this.closeTimeModel = {
	      time: closetime
	  }
	); 

    this.handleCloseTimeBound=this.handleCloseTime.bind(this);
   	Mojo.Event.listen(this.controller.get("closeTime"), Mojo.Event.propertyChange, this.handleCloseTimeBound);

};

PreferencesAssistant.prototype.addLauncher = function(event){
    var appParams = {
        sendpc: true,
    };

    var title = "To Computer";
    var callParams = {
        id: 'com.zhephree.neato',
        'icon': Mojo.appPath+"icon-send.png",
        'title': title,
        'params': appParams
    };
    this.controller.serviceRequest('palm://com.palm.applicationManager/addLaunchPoint', {
        parameters: callParams,
        onSuccess: function(){Mojo.Controller.getAppController().showBanner("new launchpoint created!", {source: 'notification'});}.bind(this),
        onFailure: function(){Mojo.Controller.getAppController().showBanner("error creating launchpoint!", {source: 'notification'});}.bind(this)
    });
};

PreferencesAssistant.prototype.handleAutoclose = function(event) {
	var v=this.ACmodel.value;
	this.cookieData=new Mojo.Model.Cookie("autoclose");
	this.cookieData.put(
		{"autoclose":v}
	)
	
};

PreferencesAssistant.prototype.handleSchedule = function(event) {
	var v=this.scheduleModel.value;
	this.cookieData=new Mojo.Model.Cookie("schedule");
	this.cookieData.put(
		{"schedule":v}
	);
	
	
	if(v==true){
		var lt=this.launchTimeModel.time;
		var ct=this.closeTimeModel.time;
		var currentTime = new Date();
		var oneday=86400000;
		
		if(lt.getTime()<currentTime.getTime()){	//we're launching in the past...
			lt=new Date(lt.getTime()+oneday);
			logthis("in the past");
		}else{
			logthis("in the future");
			//v=new Date(currentTime.getMonth()+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+v.getHours()+":"+v.getMinutes()+":"+v.getSeconds());
		}
		
		logthis("launchtime="+lt.toString());
		
		/*var m=lt.getMonth()+1;
		if(m.toString().length==1){m="0"+m.toString();}
		var d=lt.getDate();
		if(d.toString().length==1){d="0"+d.toString();}
		var y=lt.getFullYear();
		var h=lt.getHours();
		if(h.toString().length==1){h="0"+h.toString();}
		var n=lt.getMinutes();
		if(n.toString().length==1){n="0"+n.toString();}
		var s=lt.getSeconds()
		if(s.toString().length==1){s="0"+s.toString();}
		
		var launchtime=m+"/"+d+"/"+y+" "+h+":"+n+":"+s;*/
		
		var launchtime=getUTCTime(lt);
		
		logthis("formatted launch time="+launchtime.toString());
		this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
	        method: "set",
	        parameters: {
	            "key": "com.zhephree.neato.launch",
	            "at": launchtime,
	            "wakeup": false,
	            "uri": "palm://com.palm.applicationManager/open",
	            "params": {
	                "id": Mojo.appInfo.id,
	                "params": {}
	            }
	        },
	        onSuccess: function(response) {
	            Mojo.Log.error("Alarm Set Success", response.returnValue);
	        },
	        onFailure: function(response) {
	            Mojo.Log.error("Alarm Set Failure",
	                response.returnValue, response.errorText);
	        }
	    });

		if(ct.getTime()<currentTime.getTime()){	//we're launching in the past...
			ct=new Date(ct.getTime()+oneday);
			logthis("in the past");
		}else{
			logthis("in the future");
			//v=new Date(currentTime.getMonth()+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+v.getHours()+":"+v.getMinutes()+":"+v.getSeconds());
		}
		
		logthis("closetime="+ct.toString());
		
		/*var m=ct.getMonth()+1;
		if(m.toString().length==1){m="0"+m.toString();}
		var d=ct.getDate();
		if(d.toString().length==1){d="0"+d.toString();}
		var y=ct.getFullYear();
		var h=ct.getHours();
		if(h.toString().length==1){h="0"+h.toString();}
		var n=ct.getMinutes();
		if(n.toString().length==1){n="0"+n.toString();}
		var s=ct.getSeconds()
		if(s.toString().length==1){s="0"+s.toString();}
		
		var closetime=m+"/"+d+"/"+y+" "+h+":"+n+":"+s;*/
		
		var closetime=getUTCTime(ct);
		
		logthis("formatted close time="+closetime.toString());
	
		this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
	        method: "set",
	        parameters: {
	            "key": "com.zhephree.neato.close",
	            "at": closetime,
	            "wakeup": false,
	            "uri": "palm://com.palm.applicationManager/open",
	            "params": {
	                "id": Mojo.appInfo.id,
	                "params": {"action": "scheduleClose"}
	            }
	        },
	        onSuccess: function(response) {
	            Mojo.Log.error("Alarm Set Success", response.returnValue);
	        },
	        onFailure: function(response) {
	            Mojo.Log.error("Alarm Set Failure",
	                response.returnValue, response.errorText);
	        }
	    });
	}else{
		this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
            method: "clear",
            parameters: {
                "key": "com.zhephree.neato.launch"
            },
            onSuccess: function(response) {
            },
            onFailure: function(response) {
            }
        });		
	
		this.sleepRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
            method: "clear",
            parameters: {
                "key": "com.zhephree.neato.close"
            },
            onSuccess: function(response) {
            },
            onFailure: function(response) {
            }
        });		
	
	}
	
};

PreferencesAssistant.prototype.handleLaunchTime = function(event) {
	var v=this.launchTimeModel.time;
	this.cookieData=new Mojo.Model.Cookie("startTime");
	this.cookieData.put(
		{"startTime":v.getTime()}
	);
	
	logthis("launchtime="+v.toString());

	var currentTime = new Date();
	var oneday=86400000;

	
	logthis("currenttime="+currentTime.toString());
	

	if(v.getTime()<currentTime.getTime()){	//we're launching in the past...
		v=new Date(v.getTime()+oneday);
		logthis("in the past");
	}else{
		logthis("in the future");
		//v=new Date(currentTime.getMonth()+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+v.getHours()+":"+v.getMinutes()+":"+v.getSeconds());
	}
	
	logthis("launchtime="+v.toString());

	
	/*var m=v.getMonth()+1;
	if(m.toString().length==1){m="0"+m.toString();}
	var d=v.getDate();
	if(d.toString().length==1){d="0"+d.toString();}
	var y=v.getFullYear();
	var h=v.getHours();
	if(h.toString().length==1){h="0"+h.toString();}
	var n=v.getMinutes();
	if(n.toString().length==1){n="0"+n.toString();}
	var s=v.getSeconds()
	if(s.toString().length==1){s="0"+s.toString();}
	
	var launchtime=m+"/"+d+"/"+y+" "+h+":"+n+":"+s;*/
	
	var launchtime=getUTCTime(v);
	
	logthis("formatted launch time="+launchtime.toString());
	
	var schedule=this.scheduleModel.value;
	
	if(schedule){
		this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
	        method: "set",
	        parameters: {
	            "key": "com.zhephree.neato.launch",
	            "at": launchtime,
	            "wakeup": false,
	            "uri": "palm://com.palm.applicationManager/open",
	            "params": {
	                "id": Mojo.appInfo.id,
	                "params": {"action":"scheduleLaunch"}
	            }
	        },
	        onSuccess: function(response) {
	            Mojo.Log.error("Alarm Set Success", response.returnValue);
	        },
	        onFailure: function(response) {
	            Mojo.Log.error("Alarm Set Failure",
	                response.returnValue, response.errorText);
	        }
	    });
	}
	
};

PreferencesAssistant.prototype.handleCloseTime = function(event) {
	var v=this.closeTimeModel.time;
	this.cookieData=new Mojo.Model.Cookie("closeTime");
	this.cookieData.put(
		{"closeTime":v.getTime()}
	);
	
	logthis("closetime="+v.toString());

	var currentTime = new Date();
	var oneday=86400000;
	

	if(v.getTime()<currentTime.getTime()){	//we're launching in the past...
		v=new Date(v.getTime()+oneday);
		logthis("in the past");
	}else{
		logthis("in the future");
		//v=new Date(currentTime.getMonth()+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+v.getHours()+":"+v.getMinutes()+":"+v.getSeconds());
	}
	
	logthis("closetime="+v.toString());
	
	/*var m=v.getMonth()+1;
	if(m.toString().length==1){m="0"+m.toString();}
	var d=v.getDate();
	if(d.toString().length==1){d="0"+d.toString();}
	var y=v.getFullYear();
	var h=v.getHours();
	if(h.toString().length==1){h="0"+h.toString();}
	var n=v.getMinutes();
	if(n.toString().length==1){n="0"+n.toString();}
	var s=v.getSeconds()
	if(s.toString().length==1){s="0"+s.toString();}
	
	var closetime=m+"/"+d+"/"+y+" "+h+":"+n+":"+s;*/
	var closetime=getUTCTime(v);
	
	logthis("formatted close time="+closetime.toString());


	var schedule=this.scheduleModel.value;
	if(schedule){
		this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
	        method: "set",
	        parameters: {
	            "key": "com.zhephree.neato.close",
	            "at": closetime,
	            "wakeup": false,
	            "uri": "palm://com.palm.applicationManager/open",
	            "params": {
	                "id": Mojo.appInfo.id,
	                "params": {"action": "scheduleClose"}
	            }
	        },
	        onSuccess: function(response) {
	            Mojo.Log.error("Alarm Set Success", response.returnValue);
	        },
	        onFailure: function(response) {
	            Mojo.Log.error("Alarm Set Failure",
	                response.returnValue, response.errorText);
	        }
	    });
	}	
};


PreferencesAssistant.prototype.handleStats = function(event) {
	if(event.type===Mojo.Event.propertyChange) {
		var v=this.statsmodel.value;
				
		this.cookieData=new Mojo.Model.Cookie("sendstats");
		this.cookieData.put(
			{"sendstats":v}
		)
		_globals.sendstats=v;
	}
};

PreferencesAssistant.prototype.setName = function(event){
	event.stop();
	var dialog = this.controller.showDialog({
		template: 'templates/setNameDialog',
		assistant: new SetNameDialogAssistant(this,true)
	});
};

PreferencesAssistant.prototype.handleMaps = function(event) {
	if(event.type===Mojo.Event.propertyChange) {
		var v=this.mapAppsModel.value;
				
		this.cookieData=new Mojo.Model.Cookie("appMaps");
		this.cookieData.put(
			{"maps":v}
		)
		_globals.maps=v;
	}

};

PreferencesAssistant.prototype.handleIPK = function(event) {
	if(event.type===Mojo.Event.propertyChange) {
		var v=this.ipkAppsModel.value;
				logthis("ipk v="+v);
		this.cookieData=new Mojo.Model.Cookie("appIPK");
		this.cookieData.put(
			{"ipk":v}
		)
		_globals.ipk=v;
	}

};

PreferencesAssistant.prototype.regenerate = function(event) {
		var url = 'http://zhephree.com/neato/generate.php?ndid='+_globals.channel;
		logthis("url="+url);
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'force',
			onSuccess: function(r){
				logthis(r.responseText);
				//this.controller.get("url").innerHTML='http://zhephree.com/neato/id/'+r.responseJSON.url;
				this.userurl=new Mojo.Model.Cookie("userurl");
				this.userurl.put(
					{"url":r.responseJSON.url}
				);
				
				_globals.newURL=r.responseJSON.url;
				
				this.generateFriend();				
			}.bind(this),
			onFailure: function(r){
				logthis(r.responseText);
				Mojo.Controller.getAppController().showBanner("error regenerating user code!", {source: 'notification'});	
			}.bind(this)
		});

};

PreferencesAssistant.prototype.generateFriend = function(event) {
		var url = 'http://zhephree.com/neato/generate-friend.php?ndid='+_globals.channel;
		logthis("friend="+url);
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'force',
			onSuccess: function(r){
				logthis(r.responseText);
				this.friendurl=new Mojo.Model.Cookie("friendurl");
				this.friendurl.put(
					{"url":r.responseJSON.code}
				);
				
				//this.controller.get("friendcode").update(r.responseJSON.code);
				//this.controller.get("friend-button-row").hide();
				_globals.regenerated=true;
				_globals.newCode=r.responseJSON.code;
				this.controller.get("regenerateButton").mojo.deactivate();

				Mojo.Controller.getAppController().showBanner("neato! codes regenerated!", {source: 'notification'});
					
			}.bind(this),
			onFailure: function(r){
				logthis(r.responseText);
				Mojo.Controller.getAppController().showBanner("error regenerating friend code!", {source: 'notification'});	
			}.bind(this)
		});
};


PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

PreferencesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

PreferencesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
