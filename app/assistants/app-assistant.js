NEATO = {}; //Global Object

_globals={
	channel: '',
	subscribed: true,
	ipk: '',
	maps: '',
	friends:[],
	name:'',
	db:new Mojo.Depot({name:"neato"},function(){
		logthis("setup db");
		this.getFriends();
	}.bind(this),
	function(){
			Mojo.Log.error("error creating db");
	}.bind(this)),
	getFriends: function() {
//	   this.controller.stageController.swapScene({name: "main", transition: Mojo.Transition.crossFade});
//		   this.controller.stageController.swapScene({name: "preferences", transition: Mojo.Transition.zoomFade}); //show prefs to add accounts
	logthis("getting friends");
	//_globals.db.discard("accounts");
	_globals.db.get("friends",
		function(r){
			if(r){ var a= r.friends;}
			if(!a){
				var a=[];
				_globals.friends=a;
				logthis("friends !a="+Object.toJSON(a));
			}else{
				//load data
				logthis("friends has a="+Object.toJSON(a));
				_globals.friends=a;
			}
		}.bind(this),
	
		function(r){
			_globals.friends=[];
			logthis("friends failed so setting to empty");
		}.bind(this)
	);
}
};


function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}


function AppAssistant() {
	logthis("created appassistant");
	this.userurl=new Mojo.Model.Cookie("friendurl");
//	this.userurl.remove();
	this.userurl=new Mojo.Model.Cookie("userurl");
//	this.userurl.remove();
	_globals.db.discard("friends")
}

AppAssistant.prototype.setup = function(){
	logthis("app setup");
	this.sendstats=new Mojo.Model.Cookie("sendstats");
	var un=this.sendstats.get();
	_globals.sendstats=(un)? un.sendstats: "true";

	_globals.db=new Mojo.Depot({name:"neato"},function(){
		logthis("setup db");
		this.getFriends();
	}.bind(this),
	function(){
			Mojo.Log.error("error creating db");
	}.bind(this));
	
	NEATO.Metrix = new Metrix(); //Instantiate Metrix Library
	if(_globals.sendstats=="true"){NEATO.Metrix.postDeviceData(true);}

	this.yncookieData=new Mojo.Model.Cookie("yourname");
	var ynCookie=this.yncookieData.get();
	var yourname=(ynCookie)? ynCookie.yourname: '';

	if(yourname!=''){
		//this.controller.get("yourname").update(yourname);
		_globals.name=yourname;
	}

	this.sacookieData=new Mojo.Model.Cookie("synergy");
	var saCookie=this.sacookieData.get();
	_globals.synergyAccount=(saCookie)? saCookie.account: '';
	logthis("account="+_globals.synergyAccount);

	if(1==2){ //delete account
		var req=new Mojo.Service.Request('palm://com.palm.accounts/crud', {
		     method:   'deleteAccount',
		     parameters: {
		         accountId: _globals.synergyAccount,
		         dataTypes: ["CONTACTS"]
		     },
		     onSuccess: function(dataTypesDeleted, returnValue){	var userurl=new Mojo.Model.Cookie("synergy");
												userurl.remove();
				},
		     onFailure: function(error){}
		 });  
	}

	/*var os=Mojo.Environment.DeviceInfo.platformVersion;
	if(os.substr(0,2)=="1." && _globals.synergyAccount==''){ //use old synergy		

		//create synergy account    
		var req=new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
			method:"Get",
			parameters:{"key": "com.palm.properties.nduid" },
			onSuccess: function(response){
				this.ndid=response['com.palm.properties.nduid'];
				_globals.channel=this.ndid;
			}
		});

		var acc = {
							accountId: "neatoContacts",
			                displayName: "neato! Contact",
		                	dataTypes: [ "CONTACTS" ],
			                domain: "com.zhephree",
		                	icons: {'48x48':Mojo.appPath+'icon_48x48.png','32x32':Mojo.appPath+'icon_32x32.png'},
		                	isDataReadOnly: false,
		                	username: "neato"
		                };
		                                          					   
		var obj = new Mojo.Service.Request("palm://com.palm.accounts/crud", {
		                method:   "createAccount",
		                parameters: acc,
		                onSuccess: function(response)
		                {
		                	logthis("success account");
		                	logthis(Object.toJSON(response));
		                	_globals.synergyAccount = response.accountId;
		                	this.cookieData=new Mojo.Model.Cookie("synergy");
							this.cookieData.put(
								{"account":_globals.synergyAccount}
							);

						}.bind(this),
		                onFailure: function(response) 
		                {
		                	logthis("fail account");
		      
		                	 logthis("Error creating account:"+ response.errorText);
		                 }.bind(this)
		});

	}else{
	
	}*/

};


AppAssistant.prototype.getFriends = function() {
//	   this.controller.stageController.swapScene({name: "main", transition: Mojo.Transition.crossFade});
//		   this.controller.stageController.swapScene({name: "preferences", transition: Mojo.Transition.zoomFade}); //show prefs to add accounts
logthis("getting friends");
	//_globals.db.discard("accounts");
	_globals.db.get("friends",
		function(r){
			if(r){ var a= r.friends;}
			if(!a){
				var a=[];
				_globals.friends=a;
				logthis("friends !a="+Object.toJSON(a));
			}else{
				//load data
				logthis("friends has a="+Object.toJSON(a));
				_globals.friends=a;
			}
		}.bind(this),
	
		function(r){
			_globals.friends=[];
			logthis("friends failed so setting to empty");
		}.bind(this)
	);
};


AppAssistant.prototype.handleLaunch = function (launchParams) {
	this.launchParams=launchParams;
	logthis("lp="+Object.toJSON(launchParams));
	logthis("handle launch");
    var cardStageController = this.controller.getStageController("mainStage");
    logthis("set cardStageController var");
    var dashStageController = this.controller.getStageController("caeDash");
    logthis("set dashboardstagcontroller var");
    var appController = Mojo.Controller.getAppController();
    logthis("got stages");
    
	if(launchParams.send){
			//var url = "http://pubnub-prod.appspot.com/pubnub-publish?channel=4eb7b6f8-a49c-11df-83df-cb0b90d0ba4b/"+_globals.channel+"-pc&message="+encodeURIComponent(launchParams.send)+"&publish_key=0eb9ad11-6ee6-4e94-b9ed-e4b96ce709e8";
			logthis("sending...");
			logthis("channel="+_globals.channel);
			logthis("send="+launchParams.send);
			var req=new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
				method:"Get",
				parameters:{"key": "com.palm.properties.nduid" },
				onSuccess: function(response){
					this.ndid=response['com.palm.properties.nduid'];
					_globals.channel=this.ndid;
					var url="http://pubsub.pubnub.com/publish/0eb9ad11-6ee6-4e94-b9ed-e4b96ce709e8/4eb7b6f8-a49c-11df-83df-cb0b90d0ba4b/0/"+_globals.channel+"-pc/0/"+escape(launchParams.send);
					var request = new Ajax.Request(url, {
					   method: 'get',
					   evalJSON: 'true',
					   onSuccess: function(){
					   		Mojo.Controller.getAppController().showBanner("neato! message sent!", {source: 'notification'});
					   		if(!cardStageController && !dashStageController){
								var pushDashboard = function(stageController){
							   		Mojo.Controller.getAppController().closeStage("fake");
								};
								logthis("creating stage");
								Mojo.Controller.getAppController().createStageWithCallback({name: "fake", lightweight: false}, pushDashboard, "card");
					   		}
					   }.bind(this),
					   onFailure: function(){
					   		Mojo.Controller.getAppController().showBanner("neato! error sending message!", {source: 'notification'});			   
					   }.bind(this)
					 });
				}.bind(this)
			});
					
			 
	}else if(launchParams.sendpc){
		logthis("send")
		//if(!cardStageController){
			this.launchSend();
		//}else{
		//	cardStageController.pushScene('send-data');
		//}
	}else if(launchParams.action){
		switch(launchParams.action){
			case "notification":
				this.launchMain();
				break;
			case "prefs":
				this.launchPrefs();
				break;
			case "open-send":
				this.launchSend();
				break;
			case "scheduleClose":
			    var currentTime = new Date();
				var oneday=86400000;
			    this.cookieData=new Mojo.Model.Cookie("closeTime");
				var ctCookie=this.cookieData.get();
				var closetime=(ctCookie!=undefined)? new Date(parseInt(ctCookie.closeTime)): currentTime;

				var v=new Date((currentTime.getMonth()+1)+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+closetime.getHours()+":"+closetime.getMinutes()+":"+closetime.getSeconds());
				v=new Date(v.getTime()+oneday);

				var closetime=getUTCTime(v);
				
				logthis("formatted close time="+closetime.toString());


			    this.cookieData=new Mojo.Model.Cookie("schedule");
				var sCookie=this.cookieData.get();
				var schedule=(sCookie)? sCookie.schedule: false;
			
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
			
				Mojo.Controller.getAppController().closeAllStages();
				break;
			case "scheduleLaunch":
			    var currentTime = new Date();
				var oneday=86400000;

			    this.cookieData=new Mojo.Model.Cookie("startTime");
				var stCookie=this.cookieData.get();
				var starttime=(stCookie!=undefined)? new Date(parseInt(stCookie.startTime)): currentTime;
				
				var v=new Date((currentTime.getMonth()+1)+"/"+currentTime.getDate()+"/"+currentTime.getFullYear()+" "+starttime.getHours()+":"+starttime.getMinutes()+":"+starttime.getSeconds());
				v=new Date(v.getTime()+oneday);
				
				var launchtime=getUTCTime(v);
				
				logthis("formatted launch time="+launchtime.toString());

			    this.cookieData=new Mojo.Model.Cookie("schedule");
				var sCookie=this.cookieData.get();
				var schedule=(sCookie)? sCookie.schedule: false;

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

				
				break;
			default:
				this.launchMain();
				break;
		}	
   	}else{
   		logthis("no params");
   		
			this.launchMain();
		    if(!dashStageController && launchParams!="notification"){
		    	logthis("no dash, creating");
		    	this.launchDashboard();
		    }else{
		    	logthis("has dash, creating prefs");
				if(!cardStageController){
					logthis("has dash, and no prefs");
					this.launchMain();
				}else{
					//Mojo.Controller.stageController.activate();
					cardStageController.pushScene('main');
				}
		    }   		
   	}
};

AppAssistant.prototype.launchDashboard = function() {
    var appController = Mojo.Controller.getAppController();
    var dashboardStageController = appController.getStageProxy("caeDash");
	var pushDashboard = function(stageController){
		logthis("pushing dashboard");
		stageController.pushScene("dashboard");
	};
	logthis("creating stage");
	if(!dashboardStageController){
		appController.createStageWithCallback({name: "caeDash", lightweight: false}, pushDashboard, "dashboard");
	}
};

AppAssistant.prototype.launchMain = function() {
	logthis("launching main");
    var pushMainScene = function(stageController) {
		var r=new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
			method:"Get",
			parameters:{"key": "com.palm.properties.nduid" },
			onSuccess: function(response){
				_globals.channel=response['com.palm.properties.nduid'];	
				logthis("channel="+_globals.channel);
				this.userurl=new Mojo.Model.Cookie("userurl");
				var uu=this.userurl.get();
				this.url=(uu)? uu.url: '';
		
				var fromLaunch=false;
				if(this.launchParams.action!="notification" && this.url!=''){
					fromLaunch=true;
				}
					stageController.pushScene('main',fromLaunch);
					//stageController.activate();
					//Mojo.Controller.stageController.activate();
					stageController.activeScene().getSceneScroller().revealTop(); //hack to fix the all-white scene bug
		
			}.bind(this)
		});
    }.bind(this);
    
   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		_globals.maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		_globals.ipk=(un)? un.ipk: "preware";

    var stageArguments = {name: "mainStage", lightweight: true};
    
    var cardStageController = this.controller.getStageController("mainStage");
    if(!cardStageController){
	    this.controller.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
	}else{
		var mainOpen=false;
		var mainScene={};
		var allScenes=cardStageController.getScenes();
		for(var s=0; s<allScenes.length;s++){
			if(allScenes[s].sceneName=="main"){
				mainOpen=true;
				mainScene=allScenes[s];
			}
		}
		
		if(!mainOpen){
			pushMainScene(cardStageController);
		}else{
			cardStageController.popScenesTo("main");
		}
	}
};

AppAssistant.prototype.launchPrefs = function() {
	logthis("launching prefs");
    var pushMainScene = function(stageController) {
		var r=new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
			method:"Get",
			parameters:{"key": "com.palm.properties.nduid" },
			onSuccess: function(response){
				_globals.channel=response['com.palm.properties.nduid'];	
				logthis("channel="+_globals.channel);
				this.userurl=new Mojo.Model.Cookie("userurl");
				var uu=this.userurl.get();
				this.url=(uu)? uu.url: '';
		
				var fromLaunch=false;
				if(this.launchParams.action!="notification" && this.url!=''){
					fromLaunch=true;
				}
					stageController.pushScene('preferences',fromLaunch);
					//stageController.activate();
					//Mojo.Controller.stageController.activate();
					try {
						stageController.activeScene().getSceneScroller().revealTop(); //hack to fix the all-white scene bug
					}catch(e){
					
					}
		
			}.bind(this)
		});
    }.bind(this);
    
   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		_globals.maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		_globals.ipk=(un)? un.ipk: "preware";

    var stageArguments = {name: "mainStage", lightweight: true};
    var cardStageController = this.controller.getStageController("mainStage");
    if(!cardStageController){
	    this.controller.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
	}else{
		var mainOpen=false;
		var mainScene={};
		var allScenes=cardStageController.getScenes();
		for(var s=0; s<allScenes.length;s++){
			if(allScenes[s].sceneName=="preferences"){
				mainOpen=true;
				mainScene=allScenes[s];
			}
		}
		
		if(!mainOpen){
			pushMainScene(cardStageController);
		}else{
			cardStageController.popScenesTo("preferences");
		}
	}
};

AppAssistant.prototype.launchSend = function() {
	logthis("launching send");
    var pushMainScene = function(stageController) {
		var r=new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
			method:"Get",
			parameters:{"key": "com.palm.properties.nduid" },
			onSuccess: function(response){
				_globals.channel=response['com.palm.properties.nduid'];	
				logthis("channel="+_globals.channel);
				this.userurl=new Mojo.Model.Cookie("userurl");
				var uu=this.userurl.get();
				this.url=(uu)? uu.url: '';
		
				var fromLaunch=false;
				if(this.launchParams.action!="notification" && this.url!=''){
					fromLaunch=true;
				}
					stageController.pushScene('send-data','',fromLaunch);
					//stageController.activate();
					//Mojo.Controller.stageController.activate();
					stageController.activeScene().getSceneScroller().revealTop(); //hack to fix the all-white scene bug
		
			}.bind(this)
		});
    }.bind(this);
    
   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		_globals.maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		_globals.ipk=(un)? un.ipk: "preware";

    var stageArguments = {name: "mainStage", lightweight: true};
    var cardStageController = this.controller.getStageController("mainStage");
    if(!cardStageController){
	    this.controller.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
	}else{
		var mainOpen=false;
		var mainScene={};
		var allScenes=cardStageController.getScenes();
		for(var s=0; s<allScenes.length;s++){
			if(allScenes[s].sceneName=="send-data"){
				mainOpen=true;
				mainScene=allScenes[s];
			}
		}
		
		if(!mainOpen){
			pushMainScene(cardStageController);
		}else{
			cardStageController.popScenesTo("send-data");
		}
	}
};


function logthis(str){
	Mojo.Log.error(str);
}


function launchURL(url){
	logthis(url);
	url=unescape(url);
	logthis(url);
	   		this.maps=new Mojo.Model.Cookie("appMaps");
		var un=this.maps.get();
		var maps=(un)? un.maps: "google";

   		this.ipk=new Mojo.Model.Cookie("appIPK");
		var un=this.ipk.get();
		var ipk=(un)? un.ipk: "preware";

	var l=url.length;
	var four=url.substr(l-4,4).toLowerCase();
	if(four==".ipk"){
		logthis("ipk");
		switch(ipk){
			case "preware":						
				this.controller.serviceRequest('palm://com.palm.applicationManager', {
				     method: 'launch',
				     parameters: {
				         id: 'org.webosinternals.preware',
				         params: {
				             target: url
				         }
				     }
				 });
				break;
			case "internalz":						
				this.controller.serviceRequest('palm://com.palm.applicationManager', {
				     method: 'launch',
				     parameters: {
				         id: 'ca.canucksoftware.internalz',
				         params: {
				             target: url
				         }
				     }
				 });
				break;
		}
	}else if(four==".mp3" || four==".wav" || four==".mid" || four==".mpa" || four==".jpg" || four==".png" || four==".gif" || four==".zip"){
		var appController = Mojo.Controller.getAppController();
	    var cardStageController = appController.getStageController("mainStage");

	    var pushMainScene = function(stageController) {
			stageController.pushScene('download',url);
	
	    };
	    var stageArguments = {name: "mainStage", lightweight: true};
	    if(!cardStageController){
		    appController.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
		}else{
			cardStageController.pushScene('download',url);
		}
		
	}else if(url.indexOf('maps.google.com')>-1){
		//got a map link
		logthis("map");
		switch(maps){
			case "google":
			logthis("google");
				this.controller.serviceRequest("palm://com.palm.applicationManager", {
				    method:"launch",
				    parameters:{
				        id: "com.palm.app.maps",
				        params: {
				            target: url
				        }
				    }
				});
				break;
			case "sprintnav":
				logthis("sprintnav");
				
				//need to parse out some junk
				var params=url.replace('http://maps.google.com/maps?','').split('&');
				var fixedParams={};
				for(var p=0;p<params.length;p++){
					var k=params[p].split('=')[0];
					var v=params[p].split('=')[1];
					
					fixedParams[k]=v;
				}
				var addy='';
				if(fixedParams.f=='d'){ //these are directions
					addy=fixedParams.daddr;
				}
				logthis("Addy="+addy);
				this.controller.serviceRequest("palm://com.palm.applicationManager", {
				    method:"launch",
				    parameters:{
				        id: "com.palm.app.sprintnavigation",
				        params: {url:'nav:Maps?loc='+addy}
				    }
				});
				break;
			case "vznav":
				break;
		}
	}else if(url.indexOf('4sq.com')>-1 || url.indexOf('foursquare.com/venue')>-1){
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
		    method:"launch",
		    parameters:{
		        id: "com.foursquare.foursquare",
		        params: {action: 'url',url:url}
		    }
		});
	}else if(url.indexOf("sendspace.com")>-1){
		var request = new Ajax.Request(url, {
		   method: 'get',
		   evalJSON: 'true',
		   onSuccess: function(r){
/*		   		var html=r.responseText;
		   		var d=html.indexOf('id="downlink"');
		   		var s=html.indexOf('href="',d)+6;
		   		var e=html.indexOf('" ');
		   		
		   		var durl=html.substring(s,e);*/
				logthis("got html");
				var html=r.responseText;
		   		var d=html.indexOf('id="downlink"');
		   		logthis("d="+d);
		   		var s=html.indexOf('href="',d)+6;
		   		logthis("s="+s);
		   		var e=html.indexOf('" ',s);
		   		logthis("e="+e);
		   		var durl=html.substring(s,e);
				logthis("durl="+durl);
				durl="http://zhephree.com/neato/getfile.php?file="+durl+"&ref="+url;

				var appController = Mojo.Controller.getAppController();
			    var cardStageController = appController.getStageController("mainStage");
		
			    var pushMainScene = function(stageController) {
					stageController.pushScene('download',durl);
			
			    };
			    var stageArguments = {name: "mainStage", lightweight: true};
			    if(!cardStageController){
				    appController.createStageWithCallback(stageArguments, pushMainScene.bind(this), "card");
				}else{
					cardStageController.pushScene('download',durl);
				}
				   		
		   }.bind(this),
		   onFailure: function(){
		   		Mojo.Controller.getAppController().showBanner("neato! error donloading", {source: 'notification'});			   
		   }.bind(this)
		 });

	}else{						
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			 method: 'open',
			 parameters: {
				 target: url
			 }
		});
	}
	
}

function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}


/*function pubSub(callback){
	logthis("subbed: "+_globals.channel);
	PUBNUB.subscribe({
	    channel : _globals.channel
	  	}, function(message) {
	    // Show Message
	    logthis(Object.toJSON(message));
	    callback(message);
	}.bind(this) );

}

function pubUnsub(){
	logthis("unsubbed: "+_globals.channel);
	
	PUBNUB.unsubscribe({
	    channel : _globals.channel
	  	});

}*/

isFriend = function (value){
	// Returns true if the passed value is found in the
	// array. Returns false if it is not.

	var i;
	for (i=0; i < _globals.friends.length; i++) {
		// Matches identical (===), not just similar (==).
		if (_globals.friends[i].channel === value) {
			return true;
		}
	}
	return false;
};


function getFileName(path) {
    return path.match(/[-_\w]+[.][\w]+$/i)[0];
}


function getUTCTime(localTime){
	var d = new Date();
	var gmtHours = -d.getTimezoneOffset()/60;
	var utc = new Date(localTime);
	
	utc = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate(), utc.getHours(), utc.getMinutes(), utc.getSeconds());
	
	utc = utc - (3600000 * gmtHours * 2);
	
	var dts = new Date(utc);
	                                                                            		
	var dtsMonth = dts.getMonth() + 1;
	
	if(dtsMonth < 10)
	{
		dtsMonth = "0" + dtsMonth;
	}
	
	var dtsDate = dts.getDate();
	
	if(dtsDate < 10)
	{
		dtsDate = "0" + dtsDate;
	}
	
	var dtsYear = dts.getFullYear();
	
	var dtsHours = dts.getHours();
	
	if(dtsHours < 10)
	{
		dtsHours = "0" + dtsHours;
	}
	
	var dtsMinutes = dts.getMinutes();
	
	if(dtsMinutes < 10)
	{
		dtsMinutes = "0" + dtsMinutes;
	}
	
	var dtsSeconds = dts.getSeconds();
	
	if(dtsSeconds < 10)
	{
		dtsSeconds = "0" + dtsSeconds;
	}
	
	dtss = dtsMonth + "/" + dtsDate + "/" + dtsYear + " " + dtsHours + ":" + dtsMinutes + ":" + dtsSeconds;
	
	return dtss;
}