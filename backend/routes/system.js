const router = require("express").Router();
const si = require("systeminformation");

router.get("/stats", async (req, res) => {
  try {
    const [
      cpu,
      mem,
      temp,
      fs,
      os,
      time
    ] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.fsSize(),
      si.osInfo(),
      si.time()
    ]);

    const disk = fs[0];

    res.json({
      cpu: {
        label : "CPU",
        value: Number(cpu.currentLoad.toFixed(1)),
        text: `${cpu.currentLoad.toFixed(1)}%`,
        width: `${cpu.currentLoad.toFixed(1)}%`
      },

      ram: {
        label : "RAM",
        value: Number(((mem.used / mem.total) * 100).toFixed(1)),
        text: `${((mem.used / mem.total) * 100).toFixed(1)}%`,
        used: mem.used,
        total: mem.total,
        width: `${((mem.used / mem.total) * 100).toFixed(1)}%`
      },

      temperature: {
        label : "TEMPERATURE",
        value: temp.main ?? 0,
        text: `${temp.main ?? "--"}°C`
      },

      storage: {
        label : "DISK",
        value: Number(disk.use.toFixed(1)),
        text: `${disk.use.toFixed(1)}%`,
        used: disk.used,
        total: disk.size,
        width: `${disk.use.toFixed(1)}%`
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Impossible de récupérer les statistiques."
    });
  }
});

module.exports = router;