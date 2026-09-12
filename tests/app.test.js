const test = require("node:test");
const assert = require("node:assert/strict");
const DeskLab = require("../js/app.js");

test("four MSP playbooks stay available on a full Dell desk", () => {
  const present = DeskLab.defaultPresent();
  const ids = DeskLab.visiblePlaybooks(present).map((item) => item.id);
  assert.deepEqual(ids, ["dock-power", "no-display", "no-charge", "dead-desk"]);
});

test("picker hides playbooks that need missing gear", () => {
  const present = DeskLab.normalizePresent({
    optiplex: true,
    precision: false,
    wd19: false,
    monitor: true,
    ups: true
  });
  const ids = DeskLab.visiblePlaybooks(present).map((item) => item.id);
  assert.deepEqual(ids, ["no-display", "dead-desk"]);
  assert.equal(DeskLab.playbookIsAvailable(DeskLab.playbookById("no-charge"), present), false);
});

test("dock-power playbook points at WD19 barrel/DC-in", () => {
  const playbook = DeskLab.playbookById("dock-power");
  assert.equal(playbook.port, "wd19-dc");
  assert.match(playbook.coach, /that'?s power on the WD19 — pull that one/i);
  assert.match(playbook.coach, /barrel\/DC-in/i);
  assert.equal(DeskLab.resolvePlaybookPort(playbook, DeskLab.defaultPresent()), "wd19-dc");
});

test("ticket note is short and ticket-shaped", () => {
  const note = DeskLab.ticketNote({
    present: DeskLab.defaultPresent(),
    playbookId: "no-charge",
    deviceId: "wd19",
    portId: "wd19-upstream"
  });
  assert.match(note, /Desk: OptiPlex, Precision, WD19, Monitor, UPS/);
  assert.match(note, /Laptop not charging on dock/);
  assert.match(note, /USB-C upstream/);
});

test("playbook coach lands on a real photo hotspot", () => {
  const present = DeskLab.defaultPresent();
  const cases = [
    ["dock-power", "wd19-dc", "rear"],
    ["no-display", "wd19-dp1", "rear"],
    ["no-charge", "wd19-upstream", "front"],
    ["dead-desk", "ups-switch", "front"]
  ];
  cases.forEach(([id, portId, face]) => {
    const playbook = DeskLab.playbookById(id);
    assert.equal(DeskLab.resolvePlaybookPort(playbook, present), portId);
    assert.equal(DeskLab.resolvePlaybookFace(playbook, present), face);
    const found = DeskLab.DEVICES[playbook.device].ports.find((port) => port.id === portId);
    assert.equal(found.face, face);
    assert.equal(found.box.length, 4);
  });
});

test("real-photo hotspots sit on the jacks the playbooks name", () => {
  const wd19 = DeskLab.DEVICES.wd19;
  const dc = wd19.ports.find((port) => port.id === "wd19-dc");
  const up = wd19.ports.find((port) => port.id === "wd19-upstream");
  assert.equal(dc.face, "rear");
  assert.ok(dc.box[0] > 60, "WD19 barrel is far right on the rear photo");
  assert.equal(up.face, "front");
  assert.ok(up.box[0] > 30 && up.box[0] < 45, "WD19 upstream is the front USB-C");

  const prec = DeskLab.DEVICES.precision;
  const tb1 = prec.ports.find((port) => port.id === "prec-tb1");
  const tb2 = prec.ports.find((port) => port.id === "prec-tb2");
  assert.equal(tb1.face, "left");
  assert.equal(tb2.face, "left");
  assert.ok(tb1.box[0] < tb2.box[0], "both TB4 ports are on the left, tb1 then tb2");

  const mon = DeskLab.DEVICES.monitor;
  for (const id of ["mon-ac", "mon-hdmi", "mon-hdmi2", "mon-usbc"]) {
    const port = mon.ports.find((item) => item.id === id);
    assert.equal(port.face, "rear");
    assert.equal(port.box.length, 4);
  }
  assert.match(mon.ports.find((port) => port.id === "mon-hdmi").label, /HDMI 1/);
  assert.match(mon.ports.find((port) => port.id === "mon-usbc").label, /USB-C/);

  const ups = DeskLab.DEVICES.ups;
  assert.ok(ups.faces.some((face) => face.id === "rear" && face.file === "ups-rear.png"));
  const batt = ups.ports.find((port) => port.id === "ups-out-batt");
  const surge = ups.ports.find((port) => port.id === "ups-out-surge");
  assert.equal(batt.face, "rear");
  assert.equal(surge.face, "rear");
  assert.ok(batt.box[1] > surge.box[1], "battery-backed bank is below surge-only on the rear photo");
});

test("no-display without a dock lands on monitor HDMI 1", () => {
  const present = DeskLab.normalizePresent({
    optiplex: false,
    precision: false,
    wd19: false,
    monitor: true,
    ups: false
  });
  const playbook = DeskLab.playbookById("no-display");
  assert.equal(DeskLab.resolvePlaybookDevice(playbook, present), "monitor");
  assert.equal(DeskLab.resolvePlaybookPort(playbook, present), "mon-hdmi");
  assert.equal(DeskLab.resolvePlaybookFace(playbook, present), "rear");
});

test("product photos are committed next to the hotspots", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const dir = path.join(__dirname, "..", "assets", "desk-lab");
  const files = [
    "wd19-front.png",
    "wd19-rear.png",
    "optiplex-front.png",
    "optiplex-rear.png",
    "precision-left.png",
    "precision-right.png",
    "monitor-rear.png",
    "ups-front.png",
    "ups-rear.png"
  ];
  files.forEach((file) => {
    const full = path.join(dir, file);
    assert.ok(fs.existsSync(full), file);
    assert.ok(fs.statSync(full).size > 20000, file + " should be a real photo");
  });
});

test("hash round-trips desk + playbook", () => {
  const hash = DeskLab.buildHash({
    present: { optiplex: false, precision: true, wd19: true, monitor: true, ups: false },
    playbookId: "dock-power",
    deviceId: "wd19",
    portId: "wd19-dc"
  });
  const parsed = DeskLab.parseHash("#" + hash);
  assert.deepEqual(parsed.present, {
    optiplex: false,
    precision: true,
    wd19: true,
    monitor: true,
    ups: false
  });
  assert.equal(parsed.playbookId, "dock-power");
  assert.equal(parsed.portId, "wd19-dc");
});
