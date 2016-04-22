module.exports = function(io){
	return function(){
		if(typeof Zone === "function" &&
		   typeof Zone.ignore === "function") {
			return Zone.ignore(io).apply(this, arguments);
		}
		return io.apply(this. arguments);
	}
};
