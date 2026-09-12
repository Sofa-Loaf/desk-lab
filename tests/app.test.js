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
    ["no-charge", "wd19-upstream", "rear"],
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
