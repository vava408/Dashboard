const router = require("express").Router();
const si = require("systeminformation");

router.get("/stats", async (req, res) => {

    const cpu = await si.currentLoad();
    const mem = await si.mem();

    res.json({
        cpu: cpu.currentLoad + "%",
        ram: ((mem.used / mem.total) * 100).toFixed(2) + "%"
    });

});

module.exports = router;