var delayIo = require("./delay-io");

module.exports = function(io){
	return function(){
		if(typeof CanZone === "function" &&
		   typeof CanZone.ignore === "function") {
			return CanZone.ignore(delayIo(io)).apply(this, arguments);
		}
		//return io.apply(this, arguments);
		return delayIo(io).apply(this, arguments);
	}
};
