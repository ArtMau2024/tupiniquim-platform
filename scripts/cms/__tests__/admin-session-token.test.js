"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
const SECRET = "a-session-secret-with-at-least-thirty-two-characters";
const OTHER = "another-session-secret-with-at-least-thirty-two";
const NOW = 1700000000000;
async function mod() { return import("../../../lib/cms/admin-session-token.ts"); }
function signed(payload, secret = SECRET) { const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url"); const sig = createHmac("sha256", secret).update(body).digest("base64url"); return `${body}.${sig}`; }
test("token válido não contém senha nem segredo", async () => { const {createSessionToken,verifySessionToken}=await mod(); const token=createSessionToken(SECRET,NOW,60); assert.equal(verifySessionToken(token,SECRET,NOW+1),true); assert.equal(token.includes(SECRET),false); assert.equal(token.includes("password"),false); });
test("payload ou assinatura adulterados são rejeitados", async () => { const {createSessionToken,verifySessionToken}=await mod(); const [p,s]=createSessionToken(SECRET,NOW,60).split("."); assert.equal(verifySessionToken(`${p}x.${s}`,SECRET,NOW),false); assert.equal(verifySessionToken(`${p}.${s}x`,SECRET,NOW),false); });
test("segredo diferente e expiração são rejeitados", async () => { const {createSessionToken,verifySessionToken}=await mod(); const token=createSessionToken(SECRET,NOW,1); assert.equal(verifySessionToken(token,OTHER,NOW),false); assert.equal(verifySessionToken(token,SECRET,NOW+1001),false); });
test("payload malformado e partes incorretas são rejeitados", async () => { const {verifySessionToken}=await mod(); assert.equal(verifySessionToken("invalid",SECRET,NOW),false); assert.equal(verifySessionToken("a.b.c",SECRET,NOW),false); assert.equal(verifySessionToken(signed("invalid"),SECRET,NOW),false); });
test("versão desconhecida com assinatura válida é rejeitada", async () => { const {verifySessionToken}=await mod(); const token=signed({version:99,authenticated:true,issuedAt:NOW,expiresAt:NOW+60000}); assert.equal(verifySessionToken(token,SECRET,NOW),false); });
test("emissão futura é rejeitada", async () => { const {verifySessionToken}=await mod(); const token=signed({version:1,authenticated:true,issuedAt:NOW+1000,expiresAt:NOW+60000}); assert.equal(verifySessionToken(token,SECRET,NOW),false); });
