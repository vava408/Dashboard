const router = require("express").Router();
const { dockerPs} = require("../services/docker");


router.get("/getDockerContainers", (req, res) => {
	res.json({
		docker: dockerPs()
	})
});

module.exports = router;	
