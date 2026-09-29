'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'config', 'runtime.generated.json');
const browserConfigPath = path.join(root, 'assets', 'public-config.js');
const seedPath = path.join(root, 'data', 'schools.generated.sql');

assert.ok(fs.existsSync(runtimePath), 'run npm run configure before tests');
assert.ok(fs.existsSync(browserConfigPath), 'browser config must be generated');
assert.ok(fs.existsSync(seedPath), 'school SQL seed must be generated');

const runtime = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
assert.ok(runtime.organization && runtime.organization.organizationName, 'organization config missing');
assert.ok(Array.isArray(runtime.zones) && runtime.zones.length > 0, 'zones config missing');
assert.ok(Array.isArray(runtime.schools) && runtime.schools.length > 0, 'school examples missing');
assert.ok(Array.isArray(runtime.officers) && runtime.officers.length > 0, 'officer examples missing');
assert.ok(runtime.officers.every(item => !Object.prototype.hasOwnProperty.call(item, 'email')), 'browser runtime must not expose officer emails');
assert.ok(!/@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(fs.readFileSync(browserConfigPath, 'utf8')), 'browser config must not contain email addresses');

console.log('PASS config generation');
