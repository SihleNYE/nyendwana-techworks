
function renderReplies(){if(!active)return;$('original').textContent=active.area+' · '+postBody(active);$('comments').replaceChildren();const visible=active.comments.filter(c=>!c.hidden);visible.slice(-2).forEach(c=>{const el=document.createElement('div');el.className='comment';const text=document.createElement('p');text.textContent=replyBody(c);el.append(text,button(t('reportReply'),()=>startReport(active,c),'ghost'));$('comments').append(el);});if(!visible.length){const empty=document.createElement('small');empty.textContent=t('noVisibleReplies');$('comments').append(empty);}}
function openReplies(p){active=p;renderReplies();screen('discussion');say('replyStatus');}
function setLanguage(value,announce=true){
lang=value;document.documentElement.lang=lang;
document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
document.querySelectorAll('.rule-trans').forEach(el=>{el.textContent=ruleText(el.dataset.en,el.dataset.xh);});
$('profileAlias').placeholder=t('aliasHint');updateProfilePreview();
$('postText').placeholder=t('postPlaceholder');$('reply').placeholder=t('replyPlaceholder');
document.querySelector('.stage svg').setAttribute('aria-label',t('graphic'));
document.querySelector('[aria-label="Feed category"], [data-category-control]').setAttribute('aria-label',t('feedCategory'));
['en','xh'].forEach(code=>{const b=$(code==='en'?'langEn':'langXh');b.classList.toggle('selected',lang===code);b.setAttribute('aria-pressed',String(lang===code));});
syncFilters();render();renderReplies();renderModeration();if(watchStatusTarget)renderWatchStatus();if(reportTarget){$('reportPreview').textContent=reportTarget.reply?replyBody(reportTarget.reply):postBody(reportTarget.post);document.querySelector('#reportScreen h3').textContent=t(reportTarget.reply?'reportReply':'reportTitle');}say(announce?'languageChanged':statusKey);
}
$('langEn').onclick=()=>setLanguage('en');$('langXh').onclick=()=>setLanguage('xh');
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;page=0;syncFilters();render();say('feedSelected');});
$('next').onclick=()=>{page++;render();say('more');};
$('neighbourhood').onchange=()=>{neighbourhood=$('neighbourhood').value;$('welcomeNeighbourhood').value=neighbourhood;page=0;render();say('areaSelected');};
function showRules(returnTo){rulesReturn=returnTo;$('ruleAck').checked=rulesAccepted;screen('rulesScreen');}
$('openRules').onclick=()=>showRules('home');$('composeRules').onclick=()=>showRules('compose');
$('rulesBack').onclick=()=>screen(rulesReturn);
$('acceptRules').onclick=()=>{if(!$('ruleAck').checked){$('status').textContent=ruleText('please tick the agreement before continuing.','qala uphawule isivumelwano ngaphambi kokuqhubeka.');return;}rulesAccepted=true;screen(rulesReturn);$('status').textContent=ruleText('community rules accepted for this demo.','imithetho yoluntu yamkelwe kolu vavanyo.');};
$('write').onclick=()=>{if(!rulesAccepted){$('postArea').value=neighbourhood==='All'?'Central':neighbourhood;showRules('compose');$('status').textContent=ruleText('please review and agree to the community rules before posting.','nceda ufunde uze wamkele imithetho yoluntu ngaphambi kokuposta.');return;}$('postArea').value=neighbourhood==='All'?'Central':neighbourhood;screen('compose');say('noAccount');};
$('cancel').onclick=()=>{screen('home');say('draft');};
$('postText').oninput=()=>{$('count').textContent=$('postText').value.length+' / 280';};
$('publish').onclick=()=>{
const text=$('postText').value.trim();if(!rulesAccepted){showRules('compose');return;}if(text.length<8){say('tooShort');return;}
const observed=$('observedAt').value;const stamp=new Date(observed).getTime();if(!Number.isFinite(stamp)||stamp>Date.now()+60000){say('invalidTime');return;}if(!['Safety','Hazards','Updates'].includes($('category').value)){return;}
posts.unshift({watchOwner:watchActor(),watchStatus:'reported',watchHistory:[],source:$('reportSource').value,observedAt:observed,id:Date.now(),area:$('postArea').value,type:$('category').value,text,votes:0,liked:false,comments:[],hidden:false,sample:false});
filter='All';neighbourhood=$('postArea').value;$('neighbourhood').value=neighbourhood;page=0;syncFilters();$('postText').value='';$('observedAt').value='';$('count').textContent='0 / 280';render();screen('home');say('published');
};
$('addReply').onclick=()=>{const text=$('reply').value.trim();if(!rulesAccepted){showRules('discussion');return;}if(!text){say('replyEmpty');return;}active.comments.push({text});$('reply').value='';renderReplies();say('replied');};
$('back').onclick=()=>{render();screen('home');say('home');};

const moderationLabels={"en": {"reportTitle": "report a post", "reasonLabel": "reason", "privacy": "private information", "abuse": "hate, bullying or threats", "rumour": "harmful accusation or misinformation", "scam": "scam or unsafe content", "other": "other rule violation", "reportNotice": "reporting hides this post in your demo feed until reviewed. no real moderator is notified.", "submitReport": "submit report", "modTitle": "moderation queue", "modNotice": "demo moderator view, open to everyone here. decisions reset on reopening. live use needs secure moderator accounts and server-side enforcement.", "pending": "pending", "history": "reviewed", "keep": "keep post", "remove": "remove post", "reopen": "reopen review", "kept": "kept", "removed": "removed", "reasonRequired": "choose a report reason first.", "reportQueued": "report added to the demo queue; post hidden pending review.", "alreadyQueued": "this post is already awaiting review.", "decisionSaved": "demo decision saved.", "reviewReopened": "review reopened; post hidden again.", "queueEmpty": "no pending reports. report a post to try the queue.", "historyEmpty": "no reviewed reports yet.", "caseLabel": "case", "demoReview": "demo moderation", "missingCase": "this case is no longer pending."}, "xh": {"reportTitle": "xela iposti", "reasonLabel": "isizathu", "privacy": "iinkcukacha zabucala", "abuse": "intiyo, ubundlavini okanye izoyikiso", "rumour": "izityholo eziyingozi okanye ulwazi olungachanekanga", "scam": "ubuqhophololo okanye umxholo ongakhuselekanga", "other": "okunye ukwaphulwa komthetho", "reportNotice": "ukuxela kufihla le posti kolu vavanyo ide ihlolwe. akukho modareyitha wokwenene owaziswayo.", "submitReport": "thumela ingxelo", "modTitle": "uluhlu lokuhlolwa", "modNotice": "luvavanyo lomodareyitha oluvulelekileyo kuye wonke umntu apha. izigqibo azigcinwa xa uvula kwakhona. usetyenziso lokwenene lufuna iiakhawunti ezikhuselekileyo nenkqubo yeseva.", "pending": "zilindile", "history": "zihloliwe", "keep": "gcina iposti", "remove": "susa iposti", "reopen": "phinda uvule uhlolo", "kept": "igciniwe", "removed": "isusiwe", "reasonRequired": "qala ukhethe isizathu sokuxela.", "reportQueued": "ingxelo ifakwe kuluhlu lovavanyo; iposti ifihliwe de ihlolwe.", "alreadyQueued": "le posti sele ilindele ukuhlolwa.", "decisionSaved": "isigqibo sovavanyo sigciniwe.", "reviewReopened": "uhlolo luvuliwe kwakhona; iposti ifihliwe kwakhona.", "queueEmpty": "akukho ngxelo zilindileyo. xela iposti ukuvavanya uluhlu.", "historyEmpty": "akukho ngxelo zihloliweyo okwangoku.", "caseLabel": "ingxelo", "demoReview": "uhlolo lovavanyo", "missingCase": "le ngxelo ayisalindanga."}};
Object.keys(moderationLabels).forEach(code=>Object.assign(translations[code],moderationLabels[code]));
const reports=[];let reportTarget=null,modMode='pending',modPage=0,caseId=0,moderatorSignedIn=false;
function startReport(p,reply=null){reportTarget={post:p,reply};$('reportPreview').textContent=reply?replyBody(reply):postBody(p);document.querySelector('#reportScreen h3').textContent=t(reply?'reportReply':'reportTitle');$('reportReason').value='privacy';screen('reportScreen');say('demoReview');}
function reportItem(r){return r.reply||r.post;}
function submitReport(){
if(!reportTarget)return;
const reason=$('reportReason').value;if(!['privacy','abuse','rumour','scam','other'].includes(reason)){say('reasonRequired');return;}
const item=reportItem(reportTarget);if(reports.some(r=>reportItem(r)===item&&r.state==='pending')){say('alreadyQueued');return;}
const isReply=!!reportTarget.reply;reports.push({id:++caseId,post:reportTarget.post,reply:reportTarget.reply,reason,state:'pending',events:[]});item.hidden=true;reportTarget=null;render();renderReplies();renderModeration();screen(isReply?'discussion':'home');say('reportQueued');
}
function decideReport(r,decision){if(!requireModerator())return;if(r.state!=='pending'||!['kept','removed'].includes(decision)){say('missingCase');return;}r.state=decision;reportItem(r).hidden=decision==='removed';r.events.push(decision);render();renderReplies();renderModeration();say('decisionSaved');}