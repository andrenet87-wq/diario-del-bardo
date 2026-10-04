(()=>{
 const params=new URLSearchParams(location.search),preset=document.querySelector('meta[name="diario-edition"]')?.content;
 const layout=['android','pc'].includes(params.get('layout'))?params.get('layout'):preset||'auto';
 document.documentElement.classList.toggle('edition-android',layout==='android');
 document.documentElement.classList.toggle('edition-pc',layout==='pc');
 const choice=document.createElement('div');choice.className='editionLinks';choice.setAttribute('aria-label','Versione del Diario');
 choice.innerHTML='<a href="?layout=android">Android</a><a href="?layout=pc">PC</a><a href="?">Auto</a>';
 document.querySelector('.sub').after(choice);
})();
