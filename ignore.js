module.exports = function(io){
	return function(){
		if(typeof CanZone === "function" &&
		   typeof CanZone.ignore === "function") {
			return CanZone.ignore(io).apply(this, arguments);
		}
		return io.apply(this, arguments);
	}
};
