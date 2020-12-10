"use strict";

const home = {
	method: "GET",
	path: "/",
	handler: (req,res) => {return "Happy Hacking!!";}
};

module.exports = [home];