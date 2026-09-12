(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.DeskLab = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        api.mount(document);
      });
    } else {
      api.mount(document);
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DEVICE_ORDER = ["optiplex", "precision", "wd19", "monitor", "ups"];

  var DEVICES = {
    optiplex: {
      id: "optiplex",
      name: "Dell OptiPlex 3080 Micro",
      short: "OptiPlex",
      role: "3080 Micro. Brick on barrel DC-in. Video is HDMI / DP on the back.",
      picker: "OptiPlex",
      defaultFace: "rear",
      faces: [
        { id: "front", label: "Front", file: "optiplex-front.png" },
        { id: "rear", label: "Back", file: "optiplex-rear.png" }
      ],
      ports: [
        { id: "opti-ac", kind: "power", label: "Barrel / DC-in", chip: "DC-in", face: "rear", box: [51.0, 81.5, 6.4, 6.0], ticket: "That's the Micro brick — round DC-in on the back, not IEC. Seat that brick in a battery-backed UPS outlet, not surge-only." },
        { id: "opti-pwrbtn", kind: "power", label: "Power button", chip: "Power", face: "front", box: [42.4, 8.0, 7.4, 6.2], ticket: "Front power. Confirm the brick is seated in DC-in before you chase this." },
        { id: "opti-dp", kind: "video", label: "DP out", chip: "DP out", face: "rear", box: [51.2, 58.5, 6.8, 6.4], ticket: "DisplayPort out on the Micro. Use if this desk is tower-to-monitor, not docked." },
        { id: "opti-hdmi", kind: "video", label: "HDMI out", chip: "HDMI out", face: "rear", box: [42.0, 19.4, 6.6, 5.6], ticket: "HDMI 1.4 on the Micro. Fallback if the monitor has no DP." },
        { id: "opti-hdmi2", kind: "video", label: "HDMI out 2 (optional)", chip: "HDMI 2", face: "rear", box: [51.2, 67.8, 6.8, 6.8], ticket: "Lower HDMI (optional video module). Same rule: match the monitor IN." },
        { id: "opti-rj45", kind: "net", label: "RJ45", chip: "RJ45", face: "rear", box: [50.0, 19.4, 6.2, 5.8], ticket: "Onboard NIC. Ignore if the client is supposed to be on the WD19 LAN." },
        { id: "opti-usbc", kind: "usbc", label: "USB-C", chip: "USB-C", face: "rear", box: [56.2, 38.5, 4.4, 6.0], ticket: "Chassis USB-C on the back. Not the dock upstream." },
        { id: "opti-usba", kind: "usb", label: "USB-A", chip: "USB-A", face: "front", box: [42.0, 31.8, 9.2, 13.8], ticket: "Front USB-A. Keyboard / mouse / keys. Do not chase video here." },
        { id: "opti-usba-rear", kind: "usb", label: "USB-A (rear)", chip: "USB-A rear", face: "rear", box: [41.8, 28.2, 12.8, 16.4], ticket: "Rear USB-A cluster. Peripherals only." },
        { id: "opti-audio", kind: "audio", label: "Universal audio", chip: "3.5 mm", face: "front", box: [43.0, 20.8, 5.8, 5.0], ticket: "Front headset jack. Headset issues are here or on the dock, not the monitor." }
      ]
    },
    precision: {
      id: "precision",
      name: "Precision 5570",
      short: "Precision",
      role: "5570. Two Thunderbolt 4 on the left. Right side is USB-C / SD / headset. No barrel.",
      picker: "Precision",
      defaultFace: "left",
      faces: [
        { id: "left", label: "Left", file: "precision-left.png" },
        { id: "right", label: "Right", file: "precision-right.png" }
      ],
      ports: [
        { id: "prec-tb1", kind: "usbc", label: "Thunderbolt 4 (dock upstream)", chip: "TB4", face: "left", box: [14.6, 46.8, 4.6, 8.0], ticket: "Left TB4. This is where the WD19 upstream cable seats. Charging and video ride this hop." },
        { id: "prec-tb2", kind: "usbc", label: "Thunderbolt 4 (alt)", chip: "TB4 alt", face: "left", box: [20.8, 46.8, 5.0, 8.0], ticket: "Second left TB4. Try this if the first will not charge or show video." },
        { id: "prec-usbc", kind: "usbc", label: "USB-C (right, DP / PD)", chip: "USB-C", face: "right", box: [69.2, 46.8, 4.8, 8.0], ticket: "Right USB-C. Also charges. Not the usual WD19 seat — left TB4 is the dock hop." },
        { id: "prec-dc", kind: "power", label: "DC-in (USB-C / TB)", chip: "USB-C PD", ticket: "No barrel on the 5570. Off-dock, the slim brick lands on a TB4 or the right USB-C." },
        { id: "prec-hdmi", kind: "video", label: "HDMI out", ticket: "This 5570 has no HDMI. Bypass the dock on a left TB4 or the right USB-C." },
        { id: "prec-sd", kind: "usb", label: "SD card", chip: "SD", face: "right", box: [75.2, 46.8, 10.8, 8.0], ticket: "SD reader. Not power, not video." },
        { id: "prec-audio", kind: "audio", label: "3.5 mm combo", chip: "3.5 mm", face: "right", box: [86.8, 46.8, 4.0, 8.0], ticket: "Headset jack on the right side." }
      ]
    },
    wd19: {
      id: "wd19",
      name: "WD19 dock",
      short: "WD19",
      role: "Dell WD19 / WD19TBS. Brick on barrel/DC-in. Laptop on USB-C upstream.",
      picker: "WD19",
      defaultFace: "rear",
      faces: [
        { id: "front", label: "Front", file: "wd19-front.png" },
        { id: "rear", label: "Back", file: "wd19-rear.png" }
      ],
      ports: [
        { id: "wd19-dc", kind: "power", label: "Barrel / DC-in", chip: "Barrel/DC-in", face: "rear", box: [73.4, 73.8, 4.2, 6.8], ticket: "That's power on the WD19 — pull that one. 180W brick. Round jack, far right on the back. Not USB-C." },
        { id: "wd19-upstream", kind: "usbc", label: "USB-C upstream (to laptop)", chip: "USB-C up", face: "front", box: [35.8, 72.6, 5.8, 6.6], ticket: "Front USB-C. Thick cable, dock → Precision TB port. Charging and video ride this hop." },
        { id: "wd19-dp1", kind: "video", label: "DP out (to monitor)", chip: "DP out", face: "rear", box: [19.8, 74.0, 6.6, 6.6], ticket: "DisplayPort out on the dock. Lands on monitor HDMI / USB-C IN if that desk has no DP." },
        { id: "wd19-dp2", kind: "video", label: "DP out 2", chip: "DP 2", face: "rear", box: [27.6, 74.0, 6.6, 6.6], ticket: "Second DP. Dual-display desks use this plus DP 1 or HDMI." },
        { id: "wd19-hdmi", kind: "video", label: "HDMI out (to monitor)", chip: "HDMI out", face: "rear", box: [36.2, 74.0, 7.4, 6.6], ticket: "HDMI out on the dock. Match HDMI 1 or HDMI 2 on the monitor and the OSD source." },
        { id: "wd19-rj45", kind: "net", label: "RJ45", chip: "RJ45", face: "rear", box: [67.2, 73.2, 5.6, 7.4], ticket: "Dock NIC. Confirm the drop is here if the ticket is 'no LAN on dock'." },
        { id: "wd19-usbc", kind: "usbc", label: "USB-C downstream", chip: "USB-C down", face: "rear", box: [46.6, 74.8, 4.8, 5.8], ticket: "Rear USB-C + DP. Peripherals / extra display. Will not power the dock or the laptop." },
        { id: "wd19-usba", kind: "usb", label: "USB-A", chip: "USB-A", face: "rear", box: [52.4, 73.2, 8.6, 7.8], ticket: "Keyboard / mouse / keys on the dock." },
        { id: "wd19-audio", kind: "audio", label: "3.5 mm", chip: "3.5 mm", face: "rear", box: [14.8, 74.8, 3.0, 5.6], ticket: "Dock analog audio. Far left on the back." }
      ]
    },
    monitor: {
      id: "monitor",
      name: "Dell S3423DWC",
      short: "Monitor",
      role: "34-inch curved. Video IN is HDMI 1 / HDMI 2 / USB-C DP. Power is IEC AC.",
      picker: "Monitor",
      defaultFace: "rear",
      faces: [
        { id: "rear", label: "Back", file: "monitor-rear.png" }
      ],
      ports: [
        { id: "mon-ac", kind: "power", label: "IEC AC in", chip: "IEC AC", face: "rear", box: [5.4, 45.2, 12.2, 8.6], ticket: "Monitor power cord. Confirm the rocker / soft-power and the OSD is not in standby." },
        { id: "mon-hdmi", kind: "video", label: "HDMI 1 in", chip: "HDMI 1", face: "rear", box: [25.0, 45.4, 9.2, 8.2], ticket: "HDMI 1 in. Set OSD source to HDMI 1 if that is the cable in use." },
        { id: "mon-hdmi2", kind: "video", label: "HDMI 2 in", chip: "HDMI 2", face: "rear", box: [58.6, 45.4, 6.4, 8.2], ticket: "HDMI 2 in. Same cable type from the WD19 HDMI out. OSD source = HDMI 2." },
        { id: "mon-usbc", kind: "usbc", label: "USB-C (DP / PD)", chip: "USB-C DP/PD", face: "rear", box: [65.6, 46.0, 4.4, 7.8], ticket: "USB-C IN with DP Alt Mode and PD. Video + laptop charge on some desks. Not the WD19 upstream." },
        { id: "mon-dp", kind: "video", label: "DP in", ticket: "This S3423DWC has no DP in. Use HDMI 1, HDMI 2, or USB-C DP." },
        { id: "mon-usbb", kind: "usb", label: "USB-B upstream", ticket: "Hub uplink to the PC. Needed only if the monitor USB-A ports are dead." },
        { id: "mon-usba", kind: "usb", label: "USB-A downstream", chip: "USB-A", face: "rear", box: [73.6, 45.4, 13.0, 8.4], ticket: "Monitor hub ports. They stay dead until USB-B / USB-C uplink is seated." }
      ]
    },
    ups: {
      id: "ups",
      name: "APC Back-UPS XS 1000",
      short: "UPS",
      role: "Battery backup under the desk. Front switch, then rear BATTERY BACKUP outlets — not surge-only.",
      picker: "UPS",
      defaultFace: "front",
      faces: [
        { id: "front", label: "Front", file: "ups-front.png" },
        { id: "rear", label: "Back", file: "ups-rear.png" }
      ],
      ports: [
        { id: "ups-acin", kind: "power", label: "AC in (wall)", chip: "Wall cord", face: "rear", box: [20.0, 80.0, 11.0, 10.0], ticket: "UPS line cord to the wall. If the wall is dead, the UPS is a battery with a clock." },
        { id: "ups-switch", kind: "power", label: "Power switch", chip: "Switch", face: "front", box: [42.0, 30.0, 3.2, 5.0], ticket: "Front power button. Many units sit in standby with no output until this is on." },
        { id: "ups-out-batt", kind: "power", label: "AC out (battery-backed)", chip: "Battery Backup", face: "rear", box: [47.2, 50.8, 4.6, 14.2], ticket: "Rear BATTERY BACKUP bank. OptiPlex brick and WD19 brick go here — not the surge-only row." },
        { id: "ups-out-dock", kind: "power", label: "AC out (dock brick)", chip: "Dock brick", face: "rear", box: [47.2, 56.0, 4.6, 9.0], ticket: "Same battery-backed bank. WD19 180W brick — not a surge-only tap." },
        { id: "ups-out-surge", kind: "power", label: "AC out (surge-only)", chip: "Surge only", face: "rear", box: [47.2, 42.4, 4.6, 8.6], ticket: "SURGE ONLY row. Do not park the Micro brick or the dock brick here." },
        { id: "ups-usb", kind: "usb", label: "USB-B management", ticket: "Optional NUT / vendor agent. Not required for AC output." }
      ]
    }
  };

  var PLAYBOOKS = [
    {
      id: "dock-power",
      title: "No power on dock",
      ticket: "WD19 dark / no LED",
      needs: ["wd19"],
      device: "wd19",
      port: "wd19-dc",
      face: "rear",
      ports: ["wd19-dc"],
      cables: ["dock-brick"],
      coach: "That's power on the WD19 — pull that one. Barrel/DC-in — the brick, not USB-C. Wait 10s. Reseat.",
      ask: "Ask: is the brick LED on? Are they holding the USB-C cable or the round jack?",
      steps: [
        "That's power on the WD19 — pull that one.",
        "Confirm the 180W brick LED is lit.",
        "Trace that cable to the WD19 barrel/DC-in (round jack, not USB-C).",
        "Pull the barrel. Wait 10 seconds. Reseat until it is fully home.",
        "If still dark, swap the brick before you swap the dock."
      ]
    },
    {
      id: "no-display",
      title: "No display",
      ticket: "Blank monitor / no signal",
      needs: ["monitor"],
      device: "wd19",
      fallbackDevice: "monitor",
      port: "wd19-dp1",
      face: "rear",
      ports: ["wd19-dp1", "wd19-hdmi", "mon-hdmi", "mon-hdmi2", "mon-usbc", "opti-dp", "prec-tb1"],
      cables: ["dock-dp", "dock-hdmi"],
      coach: "Video leaves the dock. Trace DP or HDMI from WD19 out to the monitor IN — HDMI 1, HDMI 2, or USB-C DP. Set the OSD source to match.",
      ask: "Ask: which jack is in the monitor — HDMI 1, HDMI 2, or USB-C? What does the OSD source say?",
      steps: [
        "Confirm the WD19 has power (LED). A dark dock will not drive the panel.",
        "On the WD19: DP out or HDMI out — say the label, have them touch that jack.",
        "Same cable on the monitor IN: HDMI 1, HDMI 2, or USB-C DP/PD. This S3423DWC has no DP in.",
        "OSD source = the cable in use. Auto is often wrong.",
        "Bypass: Precision TB4 / right USB-C or OptiPlex DP straight to the monitor if the dock path fails."
      ]
    },
    {
      id: "no-charge",
      title: "Laptop not charging on dock",
      ticket: "Precision on WD19, no charge",
      needs: ["wd19", "precision"],
      device: "wd19",
      port: "wd19-upstream",
      face: "front",
      ports: ["wd19-upstream", "prec-tb1", "prec-tb2", "wd19-dc"],
      cables: ["dock-upstream"],
      coach: "Charging rides USB-C upstream. Reseat the thick cable at the dock and at the Precision TB port.",
      ask: "Ask: does the laptop charge on its own brick? Is the WD19 LED on?",
      steps: [
        "WD19 brick must be in barrel/DC-in. No brick, no charge pass-through.",
        "USB-C upstream is the front USB-C: dock → Precision left TB4.",
        "Pull both ends. Reseat. Try the other left TB4 on the Precision.",
        "If it charges on the slim chassis brick but not the dock, replace the upstream cable first."
      ]
    },
    {
      id: "dead-desk",
      title: "Dead desk",
      ticket: "Whole desk dark",
      needs: ["ups"],
      device: "ups",
      port: "ups-switch",
      face: "front",
      ports: ["ups-switch", "ups-out-batt", "ups-out-dock", "opti-ac", "wd19-dc"],
      cables: ["ups-tower", "ups-dock"],
      coach: "Whole desk dark. UPS front switch first. Then rear BATTERY BACKUP outlets — not the surge-only row.",
      ask: "Ask: is the UPS LED on? Are the Micro brick and the fat WD19 brick in the battery bank?",
      steps: [
        "UPS power switch — on, not standby.",
        "AC in (wall) seated. If the wall is dead, say so on the ticket and stop.",
        "Move the OptiPlex brick and the WD19 brick onto rear BATTERY BACKUP outlets.",
        "Do not leave those two on the SURGE ONLY row.",
        "Then re-run dock-power or no-display if only one box stayed dark."
      ]
    }
  ];

  var KIND_LABEL = {
    power: "Power",
    video: "Video",
    usbc: "USB-C / TB",
    usb: "USB",
    net: "Ethernet",
    audio: "Audio"
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function defaultPresent() {
    var present = {};
    DEVICE_ORDER.forEach(function (id) {
      present[id] = true;
    });
    return present;
  }

  function normalizePresent(input) {
    var present = defaultPresent();
    if (!input) return present;
    DEVICE_ORDER.forEach(function (id) {
      if (Object.prototype.hasOwnProperty.call(input, id)) {
        present[id] = !!input[id];
      }
    });
    return present;
  }

  function parseDeskList(raw) {
    if (!raw) return defaultPresent();
    var wanted = {};
    String(raw)
      .split(",")
      .map(function (part) {
        return part.trim().toLowerCase();
      })
      .filter(Boolean)
      .forEach(function (id) {
        if (DEVICES[id]) wanted[id] = true;
      });
    if (!Object.keys(wanted).length) return defaultPresent();
    var present = {};
    DEVICE_ORDER.forEach(function (id) {
      present[id] = !!wanted[id];
    });
    return present;
  }

  function presentToList(present) {
    return DEVICE_ORDER.filter(function (id) {
      return present[id];
    });
  }

  function playbookById(id) {
    for (var i = 0; i < PLAYBOOKS.length; i += 1) {
      if (PLAYBOOKS[i].id === id) return PLAYBOOKS[i];
    }
    return null;
  }

  function deviceById(id) {
    return DEVICES[id] || null;
  }

  function portById(device, portId) {
    if (!device) return null;
    for (var i = 0; i < device.ports.length; i += 1) {
      if (device.ports[i].id === portId) return device.ports[i];
    }
    return null;
  }

  function findPort(portId) {
    for (var i = 0; i < DEVICE_ORDER.length; i += 1) {
      var device = DEVICES[DEVICE_ORDER[i]];
      var port = portById(device, portId);
      if (port) return { device: device, port: port };
    }
    return null;
  }

  function playbookIsAvailable(playbook, present) {
    return playbook.needs.every(function (id) {
      return !!present[id];
    });
  }

  function visiblePlaybooks(present) {
    return PLAYBOOKS.filter(function (playbook) {
      return playbookIsAvailable(playbook, present);
    });
  }

  function resolvePlaybookDevice(playbook, present) {
    if (playbook.device && present[playbook.device]) return playbook.device;
    if (playbook.fallbackDevice && present[playbook.fallbackDevice]) return playbook.fallbackDevice;
    for (var i = 0; i < playbook.needs.length; i += 1) {
      if (present[playbook.needs[i]]) return playbook.needs[i];
    }
    return null;
  }

  function resolvePlaybookPort(playbook, present) {
    var deviceId = resolvePlaybookDevice(playbook, present);
    if (!deviceId) return null;
    var device = DEVICES[deviceId];
    if (playbook.port && portById(device, playbook.port) && present[deviceId]) {
      return playbook.port;
    }
    for (var i = 0; i < playbook.ports.length; i += 1) {
      var found = findPort(playbook.ports[i]);
      if (found && present[found.device.id]) return found.port.id;
    }
    return device.ports[0] ? device.ports[0].id : null;
  }

  function faceById(device, faceId) {
    if (!device || !device.faces) return null;
    for (var i = 0; i < device.faces.length; i += 1) {
      if (device.faces[i].id === faceId) return device.faces[i];
    }
    return null;
  }

  function defaultFace(device) {
    if (!device) return "";
    if (device.defaultFace && faceById(device, device.defaultFace)) return device.defaultFace;
    return device.faces && device.faces[0] ? device.faces[0].id : "";
  }

  function resolveFace(device, portId, faceId) {
    if (!device) return "";
    var port = portId ? portById(device, portId) : null;
    if (port && port.face && faceById(device, port.face)) return port.face;
    if (faceId && faceById(device, faceId)) return faceId;
    return defaultFace(device);
  }

  function resolvePlaybookFace(playbook, present) {
    if (!playbook) return "";
    var portId = resolvePlaybookPort(playbook, present);
    var found = portId ? findPort(portId) : null;
    if (found && found.port.face) return found.port.face;
    if (playbook.face) return playbook.face;
    var deviceId = resolvePlaybookDevice(playbook, present);
    return defaultFace(deviceId ? DEVICES[deviceId] : null);
  }

  function ticketNote(state) {
    var present = normalizePresent(state && state.present);
    var desk = presentToList(present)
      .map(function (id) {
        return DEVICES[id].short;
      })
      .join(", ");
    if (!desk) desk = "(none selected)";
    var lines = ["Desk: " + desk];
    var playbook = state && state.playbookId ? playbookById(state.playbookId) : null;
    if (playbook) {
      lines.push("Playbook: " + playbook.title + " (" + playbook.ticket + ")");
      lines.push("Coach: " + playbook.coach);
    }
    var device = state && state.deviceId ? deviceById(state.deviceId) : null;
    if (device) lines.push("Device: " + device.name);
    var port = device && state.portId ? portById(device, state.portId) : null;
    if (port) {
      lines.push("Port: " + port.label + " — " + port.ticket);
    }
    return lines.join("\n");
  }

  function parseHash(hash) {
    var raw = String(hash || "").replace(/^#/, "");
    var params = {};
    if (!raw) {
      return {
        present: defaultPresent(),
        playbookId: "",
        deviceId: "",
        portId: ""
      };
    }
    if (raw.indexOf("=") === -1 && raw.indexOf("&") === -1 && DEVICES[raw]) {
      return {
        present: defaultPresent(),
        playbookId: "",
        deviceId: raw,
        portId: ""
      };
    }
    raw.split("&").forEach(function (pair) {
      var parts = pair.split("=");
      var key = decodeURIComponent(parts[0] || "").trim();
      var value = decodeURIComponent(parts.slice(1).join("=") || "").trim();
      if (key) params[key] = value;
    });
    return {
      present: parseDeskList(params.desk),
      playbookId: params.playbook || "",
      deviceId: params.device || "",
      portId: params.port || ""
    };
  }

  function buildHash(state) {
    var present = normalizePresent(state && state.present);
    var parts = ["desk=" + presentToList(present).join(",")];
    if (state && state.playbookId && playbookById(state.playbookId)) {
      parts.push("playbook=" + state.playbookId);
    }
    if (state && state.deviceId && DEVICES[state.deviceId]) {
      parts.push("device=" + state.deviceId);
    }
    if (state && state.portId && findPort(state.portId)) {
      parts.push("port=" + state.portId);
    }
    return parts.join("&");
  }

  function qs(scope, sel) {
    return (scope || document).querySelector(sel);
  }

  function qsa(scope, sel) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function mount(doc) {
    var root = qs(doc, "[data-desk-lab]");
    if (!root) return null;

    var state = {
      present: defaultPresent(),
      playbookId: "",
      deviceId: "",
      portId: "",
      faceId: "",
      writingHash: false
    };

    var picker = qs(root, "[data-desk-picker]");
    var playbookBox = qs(root, "[data-playbooks]");
    var coachKicker = qs(root, "[data-coach-kicker]");
    var coachText = qs(root, "[data-coach-text]");
    var coachAsk = qs(root, "[data-coach-ask]");
    var detail = qs(root, "[data-detail]");
    var stage = qs(root, "[data-stage]");
    var copyBtn = qs(root, "[data-copy-ticket]");
    var copyStatus = qs(root, "[data-copy-status]");
    var assetBase = (root.getAttribute("data-asset-base") || "assets/desk-lab").replace(/\/$/, "");

    function assetUrl(file) {
      return assetBase + "/" + file;
    }

    function currentPlaybook() {
      return playbookById(state.playbookId);
    }

    function writeHash() {
      if (state.writingHash || typeof location === "undefined") return;
      var next = buildHash(state);
      if (location.hash.replace(/^#/, "") === next) return;
      state.writingHash = true;
      location.hash = next;
      state.writingHash = false;
    }

    function applyPresentToDom() {
      DEVICE_ORDER.forEach(function (id) {
        var on = !!state.present[id];
        qsa(picker, 'input[value="' + id + '"]').forEach(function (input) {
          input.checked = on;
        });
      });
    }

    function thumbFile(device) {
      var face = faceById(device, defaultFace(device)) || (device.faces && device.faces[0]);
      return face ? face.file : "";
    }

    function renderDeviceStrip() {
      var strip = qs(root, "[data-device-strip]");
      if (!strip) return;
      strip.innerHTML = DEVICE_ORDER.filter(function (id) {
        return state.present[id];
      })
        .map(function (id) {
          var device = DEVICES[id];
          var selected = state.deviceId === id;
          var file = thumbFile(device);
          return (
            '<button type="button" class="device-card' +
            (selected ? " is-selected" : "") +
            '" data-device="' +
            id +
            '" aria-pressed="' +
            (selected ? "true" : "false") +
            '">' +
            (file ? '<img src="' + assetUrl(file) + '" alt="">' : "") +
            "<span>" +
            device.short +
            "</span></button>"
          );
        })
        .join("");
    }

    function renderPhotoPanel() {
      var panel = qs(root, "[data-photo-panel]");
      if (!panel) return;
      var device = deviceById(state.deviceId);
      if (!device || !state.present[device.id]) {
        var cards = DEVICE_ORDER.filter(function (id) {
          return state.present[id];
        })
          .map(function (id) {
            var item = DEVICES[id];
            var file = thumbFile(item);
            return (
              '<button type="button" class="gallery-card" data-device="' +
              id +
              '">' +
              (file ? '<img src="' + assetUrl(file) + '" alt="' + item.name + '">' : "") +
              "<span>" +
              item.short +
              "</span></button>"
            );
          })
          .join("");
        panel.innerHTML = cards
          ? '<div class="photo-gallery">' + cards + "</div>"
          : '<p class="photo-empty">Check a box. Then click the photo.</p>';
        return;
      }

      var faceId = resolveFace(device, state.portId, state.faceId);
      var face = faceById(device, faceId) || device.faces[0];
      var playbook = currentPlaybook();
      var hotPorts = playbook ? playbook.ports : [];
      var tabs = device.faces
        .map(function (item) {
          var active = item.id === face.id;
          return (
            '<button type="button" class="face-tab' +
            (active ? " is-active" : "") +
            '" data-face="' +
            item.id +
            '" aria-selected="' +
            (active ? "true" : "false") +
            '">' +
            item.label +
            "</button>"
          );
        })
        .join("");
      var hotspots = device.ports
        .filter(function (port) {
          return port.face === face.id && port.box && port.box.length === 4;
        })
        .map(function (port) {
          var hot = hotPorts.indexOf(port.id) !== -1;
          var selected = state.portId === port.id;
          var box = port.box;
          return (
            '<button type="button" class="hotspot kind-' +
            port.kind +
            (hot ? " is-hot" : "") +
            (selected ? " is-selected" : "") +
            '" data-port="' +
            port.id +
            '" style="left:' +
            box[0] +
            "%;top:" +
            box[1] +
            "%;width:" +
            box[2] +
            "%;height:" +
            box[3] +
            '%" aria-label="' +
            port.label +
            '"><span class="hotspot-label">' +
            (port.chip || port.label) +
            "</span></button>"
          );
        })
        .join("");

      panel.innerHTML =
        '<div class="photo-toolbar"><p class="photo-title">' +
        device.name +
        " · " +
        face.label +
        '</p><div class="face-tabs" role="tablist" aria-label="Device face">' +
        tabs +
        '</div></div><div class="photo-stage"><img src="' +
        assetUrl(face.file) +
        '" alt="' +
        device.name +
        " " +
        face.label +
        '"><div class="hotspot-layer">' +
        hotspots +
        "</div></div>";
    }

    function renderPlaybooks() {
      if (!playbookBox) return;
      playbookBox.innerHTML = PLAYBOOKS.map(function (playbook) {
        var ready = playbookIsAvailable(playbook, state.present);
        var active = state.playbookId === playbook.id;
        return (
          '<button type="button" class="playbook-btn' +
          (active ? " is-active" : "") +
          '" data-playbook="' +
          playbook.id +
          '"' +
          (ready ? "" : " disabled") +
          ' aria-pressed="' +
          (active ? "true" : "false") +
          '">' +
          "<strong>" +
          playbook.title +
          "</strong>" +
          "<span>" +
          playbook.ticket +
          "</span>" +
          (ready ? "" : "<em>Need " + playbook.needs.map(function (id) { return DEVICES[id].short; }).join(" + ") + "</em>") +
          "</button>"
        );
      }).join("");
    }

    function defaultCoach() {
      return {
        kicker: "On the call",
        text: "Toggle what is on this desk. Click a photo. Ports sit on the real jacks. Or start a playbook and read the coach line.",
        ask: ""
      };
    }

    function renderCoach() {
      var playbook = currentPlaybook();
      var found = state.portId ? findPort(state.portId) : null;
      var copy = defaultCoach();
      if (playbook) {
        copy = {
          kicker: playbook.title,
          text: playbook.coach,
          ask: playbook.ask || ""
        };
      } else if (found) {
        copy = {
          kicker: found.device.short + " · " + found.port.label,
          text: found.port.ticket,
          ask: ""
        };
      } else if (state.deviceId && DEVICES[state.deviceId]) {
        copy = {
          kicker: DEVICES[state.deviceId].name,
          text: DEVICES[state.deviceId].role,
          ask: "Click a port. The line under it is what you say."
        };
      }
      setText(coachKicker, copy.kicker);
      setText(coachText, copy.text);
      setText(coachAsk, copy.ask);
      if (coachAsk) coachAsk.hidden = !copy.ask;
    }

    function renderDetail() {
      if (!detail) return;
      var device = deviceById(state.deviceId);
      if (!device || !state.present[device.id]) {
        detail.innerHTML =
          '<p class="detail-kicker">Device</p>' +
          "<h2>Nothing selected</h2>" +
          "<p>Click a device photo. Front/Back (or Left/Right) tabs. Ticket labels sit on the real ports: barrel/DC-in, USB-C upstream, DP out, UPS AC out.</p>";
        return;
      }

      var playbook = currentPlaybook();
      var hotPorts = playbook ? playbook.ports : [];
      var portRows = device.ports
        .map(function (port) {
          var hot = hotPorts.indexOf(port.id) !== -1;
          var selected = state.portId === port.id;
          return (
            '<button type="button" class="port-row kind-' +
            port.kind +
            (hot ? " is-hot" : "") +
            (selected ? " is-selected" : "") +
            '" data-select-port="' +
            port.id +
            '">' +
            '<span class="port-kind">' +
            KIND_LABEL[port.kind] +
            "</span>" +
            '<span class="port-label">' +
            port.label +
            "</span>" +
            '<span class="port-ticket">' +
            port.ticket +
            "</span>" +
            "</button>"
          );
        })
        .join("");

      var selected = state.portId ? portById(device, state.portId) : null;
      var steps = "";
      if (playbook && playbookIsAvailable(playbook, state.present)) {
        steps =
          '<ol class="playbook-steps">' +
          playbook.steps
            .map(function (step) {
              return "<li>" + step + "</li>";
            })
            .join("") +
          "</ol>";
      }

      detail.innerHTML =
        '<p class="detail-kicker">' +
        device.role +
        "</p>" +
        "<h2>" +
        device.name +
        "</h2>" +
        '<div class="io-plate" role="group" aria-label="' +
        device.name +
        ' ports">' +
        device.ports
          .map(function (port) {
            return (
              '<button type="button" class="io-port kind-' +
              port.kind +
              (hotPorts.indexOf(port.id) !== -1 ? " is-hot" : "") +
              (state.portId === port.id ? " is-selected" : "") +
              '" data-select-port="' +
              port.id +
              '"><abbr title="' +
              KIND_LABEL[port.kind] +
              '">' +
              port.label +
              "</abbr></button>"
            );
          })
          .join("") +
        "</div>" +
        '<div class="port-list">' +
        portRows +
        "</div>" +
        (selected
          ? '<p class="say-line"><strong>Say:</strong> ' + selected.ticket + "</p>"
          : "") +
        steps;
    }

    function syncHighlights() {
      var playbook = currentPlaybook();
      var hotPorts = playbook ? playbook.ports : [];
      qsa(root, "[data-port]").forEach(function (el) {
        var id = el.getAttribute("data-port");
        el.classList.toggle("is-hot", hotPorts.indexOf(id) !== -1);
        el.classList.toggle("is-selected", state.portId === id);
      });
      qsa(root, "[data-device]").forEach(function (el) {
        var id = el.getAttribute("data-device");
        el.classList.toggle("is-selected", id === state.deviceId && !!state.present[id]);
        if (el.hasAttribute("aria-pressed")) {
          el.setAttribute("aria-pressed", id === state.deviceId && !!state.present[id] ? "true" : "false");
        }
      });
    }

    function render() {
      applyPresentToDom();
      renderPlaybooks();
      renderDeviceStrip();
      renderPhotoPanel();
      renderCoach();
      renderDetail();
      syncHighlights();
    }

    function selectDevice(id, portId) {
      if (!DEVICES[id] || !state.present[id]) return;
      state.deviceId = id;
      if (portId && portById(DEVICES[id], portId)) {
        state.portId = portId;
        state.faceId = resolveFace(DEVICES[id], portId, "");
      } else if (!portById(DEVICES[id], state.portId)) {
        state.portId = "";
        state.faceId = defaultFace(DEVICES[id]);
      }
      render();
      writeHash();
    }

    function selectPort(portId) {
      var found = findPort(portId);
      if (!found || !state.present[found.device.id]) return;
      state.deviceId = found.device.id;
      state.portId = found.port.id;
      state.faceId = resolveFace(found.device, found.port.id, found.port.face);
      render();
      writeHash();
    }

    function selectFace(faceId) {
      var device = deviceById(state.deviceId);
      if (!device || !faceById(device, faceId)) return;
      state.faceId = faceId;
      if (state.portId) {
        var port = portById(device, state.portId);
        if (port && port.face && port.face !== faceId) state.portId = "";
      }
      render();
    }

    function clearPlaybook() {
      state.playbookId = "";
    }

    function runPlaybook(id) {
      var playbook = playbookById(id);
      if (!playbook) return;
      if (!playbookIsAvailable(playbook, state.present)) {
        state.playbookId = "";
        render();
        writeHash();
        return;
      }
      state.playbookId = playbook.id;
      state.deviceId = resolvePlaybookDevice(playbook, state.present) || "";
      state.portId = resolvePlaybookPort(playbook, state.present) || "";
      state.faceId = resolvePlaybookFace(playbook, state.present) || "";
      render();
      writeHash();
      if (stage) {
        stage.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    function setPresent(id, on) {
      if (!DEVICES[id]) return;
      state.present[id] = !!on;
      if (!state.present[id] && state.deviceId === id) {
        state.deviceId = "";
        state.portId = "";
        state.faceId = "";
      }
      var playbook = currentPlaybook();
      if (playbook && !playbookIsAvailable(playbook, state.present)) {
        clearPlaybook();
      } else if (playbook) {
        state.deviceId = resolvePlaybookDevice(playbook, state.present) || state.deviceId;
        state.portId = resolvePlaybookPort(playbook, state.present) || state.portId;
      }
      render();
      writeHash();
    }

    function applyParsed(parsed) {
      state.present = normalizePresent(parsed.present);
      state.playbookId = parsed.playbookId && playbookById(parsed.playbookId) ? parsed.playbookId : "";
      if (state.playbookId && !playbookIsAvailable(playbookById(state.playbookId), state.present)) {
        state.playbookId = "";
      }
      if (parsed.deviceId && DEVICES[parsed.deviceId] && state.present[parsed.deviceId]) {
        state.deviceId = parsed.deviceId;
      } else if (state.playbookId) {
        state.deviceId = resolvePlaybookDevice(playbookById(state.playbookId), state.present) || "";
      } else {
        state.deviceId = "";
      }
      if (parsed.portId && findPort(parsed.portId)) {
        state.portId = parsed.portId;
      } else if (state.playbookId) {
        state.portId = resolvePlaybookPort(playbookById(state.playbookId), state.present) || "";
      } else {
        state.portId = "";
      }
      if (state.deviceId) {
        state.faceId = resolveFace(DEVICES[state.deviceId], state.portId, state.faceId);
      } else {
        state.faceId = "";
      }
      render();
    }

    function copyTicket() {
      var note = ticketNote(state);
      var done = function () {
        if (copyStatus) {
          copyStatus.textContent = "Copied";
          window.setTimeout(function () {
            if (copyStatus) copyStatus.textContent = "";
          }, 1600);
        }
        if (copyBtn) copyBtn.textContent = "Copied ticket note";
        window.setTimeout(function () {
          if (copyBtn) copyBtn.textContent = "Copy ticket note";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(note).then(done).catch(function () {
          window.prompt("Ticket note", note);
        });
      } else {
        window.prompt("Ticket note", note);
      }
    }

    if (picker) {
      picker.addEventListener("change", function (event) {
        var target = event.target;
        if (!target || target.name !== "desk-device") return;
        setPresent(target.value, target.checked);
      });
    }

    if (playbookBox) {
      playbookBox.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-playbook]");
        if (!btn || btn.disabled) return;
        if (state.playbookId === btn.getAttribute("data-playbook")) {
          clearPlaybook();
          render();
          writeHash();
          return;
        }
        runPlaybook(btn.getAttribute("data-playbook"));
      });
    }

    root.addEventListener("click", function (event) {
      var portBtn = event.target.closest("[data-select-port], [data-port]");
      if (portBtn && root.contains(portBtn)) {
        var portId = portBtn.getAttribute("data-select-port") || portBtn.getAttribute("data-port");
        if (portId) {
          event.preventDefault();
          selectPort(portId);
          return;
        }
      }
      var faceBtn = event.target.closest("[data-face]");
      if (faceBtn && root.contains(faceBtn)) {
        event.preventDefault();
        selectFace(faceBtn.getAttribute("data-face"));
        return;
      }
      var unit = event.target.closest("[data-device]");
      if (unit && root.contains(unit) && !unit.closest("[data-desk-picker]")) {
        var id = unit.getAttribute("data-device");
        if (state.present[id]) selectDevice(id);
      }
    });

    root.addEventListener("keydown", function (event) {
      var unit = event.target.closest("[data-device]");
      if (!unit || !root.contains(unit) || unit.closest("[data-desk-picker]")) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        var id = unit.getAttribute("data-device");
        if (state.present[id]) selectDevice(id);
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", copyTicket);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", function () {
        if (state.writingHash) return;
        applyParsed(parseHash(location.hash));
      });
      applyParsed(parseHash(location.hash));
    } else {
      render();
    }

    return {
      getState: function () {
        return clone(state);
      },
      setPresent: setPresent,
      runPlaybook: runPlaybook,
      selectDevice: selectDevice,
      selectPort: selectPort,
      selectFace: selectFace
    };
  }

  return {
    DEVICE_ORDER: DEVICE_ORDER,
    DEVICES: DEVICES,
    PLAYBOOKS: PLAYBOOKS,
    KIND_LABEL: KIND_LABEL,
    defaultPresent: defaultPresent,
    normalizePresent: normalizePresent,
    parseDeskList: parseDeskList,
    presentToList: presentToList,
    playbookById: playbookById,
    playbookIsAvailable: playbookIsAvailable,
    visiblePlaybooks: visiblePlaybooks,
    resolvePlaybookDevice: resolvePlaybookDevice,
    resolvePlaybookPort: resolvePlaybookPort,
    resolvePlaybookFace: resolvePlaybookFace,
    resolveFace: resolveFace,
    faceById: faceById,
    ticketNote: ticketNote,
    parseHash: parseHash,
    buildHash: buildHash,
    mount: mount
  };
});
