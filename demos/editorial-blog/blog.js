(() => {
  const editions = {
    food: { brand:'The Everyday Table', issue:'The weekly food journal', season:'autumn notes', accent:'#c9552b', soft:'#f1d4c6', hero:{title:'The dinners that make a week feel possible',category:'Kitchen notes',dek:'A gentle plan for hungry evenings: a generous pot, bright pantry staples and enough room to change your mind.',image:'photos/food-hero.webp',alt:'Plate of pasta served on a rustic table'}, categories:['All','Recipes','Kitchen notes','Weekend','Pantry'], stories:[
      ['food-pasta','Recipes','The pasta supper that starts with a lemon','A glossy, comforting bowl with a sharp little edge.','photos/food-pasta.webp','Green pasta in a bowl with lemon'],
      ['food-breakfast','Weekend','Breakfast, but make it unhurried','Eggs, toast and the small art of setting the table.','photos/food-breakfast.webp','Egg breakfast served with toast'],
      ['food-pasta-2','Pantry','Three jars that rescue dinner','Beans, chilli oil and tomatoes earn their space.','photos/food-pasta.webp','Green pasta in a bowl with lemon'],
      ['food-hero-2','Kitchen notes','The table is not a performance','A case for feeding people without making it a project.','photos/food-hero.webp','Plate of pasta served on a rustic table'],
      ['food-breakfast-2','Recipes','A soft scramble for late mornings','Simple eggs with butter, herbs and good toast.','photos/food-breakfast.webp','Egg breakfast served with toast'],
      ['food-pasta-3','Weekend','Sunday sauce, saved for later','A slow pan of tomato sauce makes Monday easier.','photos/food-pasta.webp','Green pasta in a bowl with lemon']
    ] },
    fashion: { brand:'The Style Edit', issue:'The weekly style journal', season:'new season notes', accent:'#6a2747', soft:'#ead4df', hero:{title:'Getting dressed as a quiet daily ritual',category:'Wardrobe notes',dek:'The best outfits start with what already feels like you: shape, texture and one thoughtful detail.',image:'photos/fashion-hero.webp',alt:'Women shopping outdoors carrying bags'}, categories:['All','Wardrobe','Details','Culture','How to wear'], stories:[
      ['fashion-style','How to wear','The shape of a good everyday uniform','Five pieces, a few repeats, and no wasted mornings.','photos/fashion-style.webp','Person wearing layered everyday clothing'],
      ['fashion-details','Details','Small objects, strong point of view','A closer look at texture, hardware and a favourite scarf.','photos/fashion-details.webp','Close-up of clothing and accessories'],
      ['fashion-hero-2','Wardrobe','A softer way to think about tailoring','Structure does not have to feel severe.','photos/fashion-hero.webp','Women shopping outdoors carrying bags'],
      ['fashion-style-2','Culture','The pleasure of repeating an outfit','Familiar clothes can still say something new.','photos/fashion-style.webp','Person wearing layered everyday clothing'],
      ['fashion-details-2','Details','Why the right shoe changes everything','Not a rule, just a useful nudge for the final layer.','photos/fashion-details.webp','Close-up of clothing and accessories'],
      ['fashion-hero-3','How to wear','A colour palette for ordinary days','Ink, oat and one unexpected berry note.','photos/fashion-hero.webp','Women shopping outdoors carrying bags']
    ] },
    normal: { brand:'Ordinary Days', issue:'The weekly lifestyle journal', season:'small things, well noticed', accent:'#647044', soft:'#e1e4d4', hero:{title:'Small pauses / everyday breathing room',category:'Living well',dek:'A few useful rituals for holding work, rest and the everyday things that make a place feel lived in.',image:'photos/normal-hero.webp',alt:'Sunlight filtering through a green forest'}, categories:['All','Home','Slow travel','Rituals','People'], stories:[
      ['normal-home','Home','The shelf that made the room feel finished','Not more things: just a better place for the things we use.','photos/normal-home.webp','Living room with a sofa'],
      ['normal-travel','Slow travel','Take the long way through a familiar place','A small itinerary for looking up and lingering.','photos/normal-travel.webp','Lake surrounded by mountains'],
      ['normal-hero-2','Rituals','The ten-minute reset before dinner','A modest routine for closing one part of the day.','photos/normal-hero.webp','Sunlight filtering through a green forest'],
      ['normal-home-2','People','What we borrow from one another','Advice, recipes and the gestures that travel between homes.','photos/normal-home.webp','Living room with a sofa'],
      ['normal-travel-2','Slow travel','A weekend bag with room to spare','Bring less; leave space for a book and a good detour.','photos/normal-travel.webp','Lake surrounded by mountains'],
      ['normal-hero-3','Home','A lamp, a chair, a better evening','The quiet impact of making one corner comfortable.','photos/normal-hero.webp','Sunlight filtering through a green forest']
    ] }
  };
  if(location.hostname.endsWith('github.io')) Object.values(editions).forEach(e=>{const base='https://nyendwanatechworks.co.za/demos/editorial-blog/';e.hero.image=base+e.hero.image;e.stories.forEach(s=>s[4]=base+s[4]);});
  const $ = s => document.querySelector(s), grid=$('#storyGrid'), dialog=$('#articleDialog');
  let mode='food', category='All', savedOnly=false, lastFocus=null, saved=new Set();
  try {
    const storedMode=localStorage.getItem('editorialMode');
    if (storedMode && Object.prototype.hasOwnProperty.call(editions, storedMode)) mode=storedMode;
    const storedSaved=JSON.parse(localStorage.getItem('editorialSaved') || '[]');
    saved=new Set(Array.isArray(storedSaved) ? storedSaved : []);
  } catch(e) { /* storage may be unavailable */ }
  const save = () => { try { localStorage.setItem('editorialMode',mode); localStorage.setItem('editorialSaved',JSON.stringify([...saved])); } catch(e) {} };
  const foodBodies=window.blogFoodBodies, editorialBodies=window.blogEditorialBodies;
  const bodyFor = (story, isFeature=false) => mode==='food' ? (foodBodies[isFeature ? 'feature' : story[0]] || foodBodies.feature) : (editorialBodies[mode][isFeature ? 'feature' : story[0]] || editorialBodies[mode].feature);
  function updateModeTabs(){ document.querySelectorAll('[role=tab][data-mode]').forEach(tab=>{ const active=tab.dataset.mode===mode; tab.setAttribute('aria-selected',String(active)); tab.tabIndex=active ? 0 : -1; }); }
  function setEdition(){
    if(!Object.prototype.hasOwnProperty.call(editions,mode)) mode='food';
    const e=editions[mode]; document.documentElement.style.setProperty('--accent',e.accent);document.documentElement.style.setProperty('--accent-soft',e.soft); $('#brandName').textContent=e.brand; document.title=e.brand+' — editorial blog demo'; $('#issueLabel').textContent=e.issue; $('#seasonLabel').textContent=e.season; $('#heroTitle').textContent=e.hero.title;$('#heroCategory').textContent=e.hero.category;$('#heroDek').textContent=e.hero.dek;$('#heroImage').src=e.hero.image;$('#heroImage').alt=e.hero.alt; $('#newsletterCopy').textContent=`A fictional ${mode==='food'?'food':mode==='fashion'?'style':'lifestyle'} newsletter sign-up for this demo. Nothing is collected or sent anywhere.`; category='All'; $('#storySearch').value=''; $('#savedFilter').setAttribute('aria-pressed','false'); savedOnly=false;
    $('#categoryNav').innerHTML=e.categories.map(c=>`<button class="chip" data-category="${c}" aria-pressed="${c==='All'}">${c}</button>`).join(''); updateModeTabs(); save(); render();
  }
  function render(){const term=$('#storySearch').value.trim().toLowerCase();const items=editions[mode].stories.filter(s=>(category==='All'||s[1]===category)&&(!term||(s[1]+' '+s[2]+' '+s[3]).toLowerCase().includes(term))&&(!savedOnly||saved.has(s[0])));grid.innerHTML=items.map(s=>`<article class="story-card"><figure><img src="${s[4]}" alt="${s[5]}"></figure><div><p class="kicker">${s[1]}</p><h3>${s[2]}</h3><p>${s[3]}</p></div><div class="card-actions"><button class="read-story" data-story="${s[0]}">Read story</button><button class="bookmark" data-save="${s[0]}" aria-pressed="${saved.has(s[0])}" aria-label="${saved.has(s[0])?'Remove':'Save'} ${s[2]}">${saved.has(s[0])?'★':'☆'}</button></div></article>`).join(''); $('#emptyState').hidden=items.length>0; $('#resultsText').textContent=`${items.length} ${items.length===1?'story':'stories'}`; $('#savedCount').textContent=saved.size;}
  function openStory(id, opener){const e=editions[mode];let s=id==='feature'?['feature',e.hero.category,e.hero.title,e.hero.dek,e.hero.image,e.hero.alt]:e.stories.find(x=>x[0]===id);if(!s)return;lastFocus=opener; $('#dialogCategory').textContent=s[1];$('#dialogMeta').textContent=`Fictional ${mode==='food'?'recipe and story':'editorial story'} · 5 minute read`;$('#dialogTitle').textContent=s[2];$('#dialogImage').src=s[4];$('#dialogImage').alt=s[5];$('#dialogBody').innerHTML=bodyFor(s,id==='feature');dialog.showModal();$('#closeDialog').focus();}
  document.addEventListener('click',e=>{const modeBtn=e.target.closest('[data-mode]'),cat=e.target.closest('[data-category]'),saveBtn=e.target.closest('[data-save]'),read=e.target.closest('[data-story]');if(modeBtn){mode=modeBtn.dataset.mode;setEdition()}if(cat){category=cat.dataset.category;document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',String(x===cat)));render()}if(saveBtn){const id=saveBtn.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);save();render()}if(read)openStory(read.dataset.story,read)});
  document.addEventListener('keydown',e=>{
    const activeTab=e.target.closest('[role=tab][data-mode]');
    if(activeTab && ['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
      const tabs=[...document.querySelectorAll('[role=tab][data-mode]')]; let next=tabs.indexOf(activeTab);
      if(e.key==='ArrowRight') next=(next+1)%tabs.length; if(e.key==='ArrowLeft') next=(next-1+tabs.length)%tabs.length; if(e.key==='Home') next=0; if(e.key==='End') next=tabs.length-1;
      e.preventDefault(); mode=tabs[next].dataset.mode; setEdition(); tabs[next].focus();
    }
    if(e.key==='Escape'&&dialog.open)dialog.close();
  });
  $('#storySearch').addEventListener('input',render);$('#savedFilter').addEventListener('click',()=>{savedOnly=!savedOnly;$('#savedFilter').setAttribute('aria-pressed',String(savedOnly));render()});$('#closeDialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lastFocus&&lastFocus.focus());$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#email');$('#newsletterMessage').textContent=input.validity.valid?'Demo only: no email was saved and no subscription was created.':'Please enter an email-shaped address to try this simulated form.';if(input.validity.valid)input.value='';});setEdition();
})();
