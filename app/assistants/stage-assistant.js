function StageAssistant() {
	/* this is the creator function for your stage assistant object */
	logthis("stag created");
}

StageAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the stage is first created */
	logthis("stage setup");
	this.controller.pushScene("main",true);
};

