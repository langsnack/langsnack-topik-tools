/* LANGSNACK v15: independent, inspectable reading estimator.
   Experimental instructional bands, NOT validated TOPIK grade probabilities.
   Designed to avoid passage-specific lookup tables and repeated substring inflation. */
(function(root){
'use strict';
const GROUPS={
 academic:['계량화','지표','환원','배제','평가','정당성','형평성','후생','불균등','배분','분배','가치중립','이해관계','실효성','파급','제도','정책','행정','책임성','투명성','구조적','실질적','장기적','근거','검증','맥락','비판적','합리적','신뢰성','개혁','불평등','격차','사회적','경제적','공공','생산성','접근성','균형','혁신','효율성','윤리적','가치관','환경적','전가','의사 결정','민주성','사회적 가치','정책 수행','기반','체계','조치','결합','추정','촉진','확대','위험','식별','익명화','객관적','측정','수치','다층적','상충','한계','전제','요인','인식','영향','증가','감소','변화','논의','종합적','도입','조건','가능성','효과','결과','자료','정보','활용','개선','방안','고려','마련','필요'],
 specialized:['계량화','환원','가치중립','후생','불균등','형평성','정당성','실효성','파급','익명화','식별','추정','배분','분배','제도적','이해관계','다층적','계량','지표','구조적','민주성','전가','책임성','투명성','검증','비판적','불평등','격차','생산성','접근성','객관적'],
 intermediate:['주민','관광','방문객','프로그램','지역','활동','운영','도움','이용','변화','필요','경험','참여','선택','생활','방법','환경','상황','협의','조정','업무','근무','가족','회의','기회','문제','해결','다양한','이러한','중요','따라서','반면','그러나','최근','증가','감소','결정','원인','결과','건강','교육','관계','문화','시설','서비스']
};
const GRAMMAR=[
 {name:'Advanced qualification / concession',level:6,re:/(?:ㄹ지언정|을지언정|느니만큼|기는커녕|고자\s*하|는\s*바|다시피|는\s*한이\s*있더라도|다고\s*단정하|다고\s*볼\s*수는\s*없|수밖에\s*없)/g},
 {name:'Argumentation and evaluation',level:5,re:/(?:다는\s*점|다는\s*사실|기\s*위해서는|뿐만\s*아니라|뿐\s*아니라|기보다|기보다는|더라도|에\s*따라|에\s*대한|을\s*경우|는\s*경우|에\s*그치지|지\s*않는\s*한|고려하면|으?ㄹ\s*필요가\s*있|에\s*달려\s*있)/g},
 {name:'Connected clauses',level:4,re:/(?:으므로|으면서|으나|면서|지만|는데|도록|반면|따라서|그러나|그럼에도|한편|때문에|기\s*위해|기\s*전에|수\s*있도록|에\s*비해)/g},
 {name:'Beginner connections',level:2,re:/(?:아서|어서|하고|그래서|지만|으니까|니까|고\s*나서|려고|고\s*있)/g}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const uniq=a=>[...new Set(a)];
function countHits(text,words){return words.filter(w=>text.includes(w));}
function analyze(text,context={}){
 const clean=(text||'').trim();const tokens=clean.match(/[가-힣]+/g)||[];
 if(!tokens.length)return null;
 const sentences=clean.split(/[.!?。！？\n]+/).map(x=>x.trim()).filter(Boolean);
 const sentenceTokens=sentences.map(s=>(s.match(/[가-힣]+/g)||[]).length);
 const avg=tokens.length/Math.max(1,sentences.length);
 const longShare=sentenceTokens.filter(n=>n>=16).length/Math.max(1,sentences.length);
 const a=countHits(clean,GROUPS.academic),s=countHits(clean,GROUPS.specialized),m=countHits(clean,GROUPS.intermediate);
 const grams=GRAMMAR.map(g=>({name:g.name,level:g.level,matches:uniq([...clean.matchAll(new RegExp(g.re.source,'g'))].map(x=>x[0])).slice(0,12)}));
 const connective=(clean.match(/(?:지만|는데|으나|으며|면서|으므로|더라도|기보다|뿐만\s*아니라|에\s*따라|을\s*경우|는\s*경우|기\s*위해|때문에|반면|그러나|따라서|고려하면)/g)||[]).length;
 const nominal=(clean.match(/(?:성|화|적|률|율|체계|구조|관점|차원|기반|정책|제도|효과|과정|근거|평가|판단|분배)/g)||[]).length;
 const formal=(clean.match(/(?:한다|된다|있다|이다|하였다|되었다|필요하다|요구된다|중요하다|받는다|어렵다|가능하다)(?=[.!?。！？\s]|$)/g)||[]).length;
 const vocabMap=context.vocabMap;
 let matched=0,advancedKnown=0,intermediateKnown=0;
 const knownWords=[];
 if(vocabMap){
   for(const token of uniq(tokens)){
     const entry=(context.matchVocabulary&&context.matchVocabulary(token))||vocabMap.get(token);
     if(entry){matched++;const l=Number(entry.topik_level_estimate||entry.langsnack_level||0);
       if(l>=5)advancedKnown++;else if(l>=3)intermediateKnown++;
       if(knownWords.length<12&&l>=4)knownWords.push(token);
     }
   }
 }
 const coverage=matched/Math.max(1,uniq(tokens).length);
 const scale=65/Math.max(45,tokens.length);
 const aDensity=a.length*scale,sDensity=s.length*scale,mDensity=m.length*scale;
 const grammar5=grams.filter(g=>g.level>=5).reduce((n,g)=>n+g.matches.length,0);
 const grammar4=grams.find(g=>g.level===4).matches.length;
 // Each feature is bounded and exposed. No direct boosts for named benchmark passages.
 const vocabulary=clamp(1+Math.min(1.0,mDensity*.23)+Math.min(2.0,aDensity*.32)+Math.min(1.45,sDensity*.45)+Math.min(.55,advancedKnown*.06),1,6);
 const grammar=clamp(1+Math.min(1.35,grammar4*.27)+Math.min(2.3,grammar5*.60)+Math.min(.7,connective/Math.max(1,sentences.length)*.23),1,6);
 const structure=clamp(1+Math.min(2.25,Math.max(0,avg-5)*.19)+Math.min(1.4,connective/Math.max(1,sentences.length)*.44)+longShare*.8,1,6);
 const register=clamp(1+Math.min(1.5,formal/Math.max(1,sentences.length)*.75)+Math.min(2.0,nominal/Math.max(1,tokens.length)*8.0)+Math.min(.5,a.length/10),1,6);
 const components={vocabulary,grammar,structure,register};
 const weights={vocabulary:.38,grammar:.25,structure:.22,register:.15};
 const base=Object.keys(weights).reduce((v,k)=>v+components[k]*weights[k],0);
 // Advanced reasoning is a conjunction of independently measurable features.
 const advancedEvidence={specializedTerms:s.length,academicTerms:a.length,complexGrammar:grammar5,connectives:connective,meanSentenceLength:avg,nominalMarkers:nominal};
 const denseAcademic=a.length>=8&&s.length>=3&&avg>=12&&connective>=3;
 const exceptionalAcademic=a.length>=11&&s.length>=5&&avg>=15&&connective>=4&&nominal>=10;
 const evidenceFloor=exceptionalAcademic?5.52:denseAcademic?4.65:0;
 let score=Math.max(base,evidenceFloor);
 // Conservative small-sample handling, not an automatic 'easy' classification.
 if(tokens.length<10)score=Math.min(score,2.75);
 else if(tokens.length<22)score=Math.min(score,4.45);
 const thresholds=[1.55,2.45,3.35,4.35,5.45];
 const level=1+thresholds.filter(t=>score>=t).length;
 const confidence=tokens.length>=80&&a.length+grammar4+grammar5>=8?'medium':tokens.length>=35?'low':'low';
 const reasons=[
  {label:'Academic / abstract vocabulary',items:a.slice(0,12).length?a.slice(0,12):['No matching editorial cues']},
  {label:'Specialized terminology',items:s.slice(0,12).length?s.slice(0,12):['None detected']},
  {label:'Grammar / connective patterns',items:grams.filter(g=>g.matches.length).flatMap(g=>g.matches.map(x=>x+' ('+g.name+')')).slice(0,12).length?grams.filter(g=>g.matches.length).flatMap(g=>g.matches.map(x=>x+' ('+g.name+')')).slice(0,12):['No matching patterns']},
  {label:'Sentence structure',items:[sentences.length+' sentences',avg.toFixed(1)+' tokens / sentence',connective+' connective occurrences']},
  {label:'Component scores (1–6)',items:Object.entries(components).map(([k,v])=>k+': '+v.toFixed(2))},
  {label:'Decision audit',items:['raw weighted score: '+base.toFixed(3),'evidence floor: '+evidenceFloor.toFixed(2),'final score: '+score.toFixed(3),'thresholds: '+thresholds.join(' / '),'Level '+level+' selected']}
 ];
 return {level,wordCount:tokens.length,uniqueWords:uniq(tokens).length,coverage,grammarCount:grams.reduce((n,g)=>n+g.matches.length,0),confidence,reasons,scores:{score,base,evidenceFloor,components,weights,thresholds,advancedEvidence,matched,knownWords},grammarHits:[]};
}
root.V15Reading={analyze,version:'15.0.0-beta'};
})(typeof window!=='undefined'?window:globalThis);
