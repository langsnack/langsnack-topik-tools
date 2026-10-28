const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('reading-engine.js','utf8'),ctx);
const examples=[
 ['basic','저는 학생이에요. 오늘 학교에 가요. 친구를 만나요. 같이 밥을 먹어요.'],
 ['intermediate','최근 우리 지역에서는 주민들이 함께 참여하는 문화 프로그램을 운영하고 있다. 이러한 활동은 사람들에게 도움이 되지만, 시설이 부족한 경우도 있다. 따라서 주민들의 의견을 고려하여 운영 방안을 마련해야 한다.'],
 ['academic','제도적 개혁의 정당성과 정책 수행의 실효성을 객관적으로 평가하려면 구조적 조건과 이해관계의 불균등한 배분을 종합적으로 검토해야 한다. 그러나 계량화된 지표만으로는 사회적 가치와 형평성을 온전히 환원할 수 없으며, 그 결과가 장기적인 정책 효과로 이어진다고 단정하기도 어렵다.']
];
for(const [name,text] of examples){const r=ctx.V15Reading.analyze(text);assert(r&&r.level>=1&&r.level<=6);assert(r.reasons.some(x=>x.label==='Decision audit'));console.log(name,'L'+r.level,r.scores.score.toFixed(3));}
assert.equal(ctx.V15Reading.analyze('123'),null);
console.log('Smoke tests passed. No accuracy claim.');
