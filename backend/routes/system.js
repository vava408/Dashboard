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
  const usedMemory = mem.total - (mem.available ?? mem.free);
  const usedMemoryPercent = (usedMemory / mem.total) * 100;
  
  const uptimeSeconds = time.uptime;

    // Conversion en jours / heures / minutes
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    let uptimeText = "";

    if (days > 0) {
      uptimeText = `${days}j ${hours}h ${minutes}min`;
    } else if (hours > 0) {
      uptimeText = `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      uptimeText = `${minutes}min ${seconds}s`;
    } else {
      uptimeText = `${seconds}s`;
    }


    res.json({
      cpu: {
        label : "CPU",
        value: Number(cpu.currentLoad.toFixed(1)),
        text: `${cpu.currentLoad.toFixed(1)}%`,
        width: `${cpu.currentLoad.toFixed(1)}%`
      },

      ram: {
        label : "RAM",
        value: Number(usedMemoryPercent.toFixed(1)),
        text: `${usedMemoryPercent.toFixed(1)}%`,
        used: usedMemory,
        total: mem.total,
        width: `${usedMemoryPercent.toFixed(1)}%`
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
      uptime:{
        label : "UPTIME",
        value: uptimeSeconds,
        text: uptimeText
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