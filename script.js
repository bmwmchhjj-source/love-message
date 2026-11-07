(function(){
  var $=function(id){return document.getElementById(id)};

  /* ---------- floating hearts ---------- */
  var hearts=$('hearts'),glyphs=['❤','💗','💖','💕','♥'];
  function spawn(){
    var s=document.createElement('span'),size=12+Math.random()*26,dur=7+Math.random()*7;
    s.textContent=glyphs[Math.random()*glyphs.length|0];
    s.style.left=Math.random()*100+'%';
    s.style.fontSize=size+'px';
    s.style.color=['#ff4f87','#ff8fb7','#fff','#d66bff','#ffc2dc'][Math.random()*5|0];
    s.style.setProperty('--dx',(Math.random()*160-80)+'px');
    s.style.setProperty('--rot',(Math.random()*80-40)+'deg');
    s.style.animationDuration=dur+'s';
    hearts.appendChild(s);
    setTimeout(function(){s.remove()},dur*1000);
  }
  for(var i=0;i<10;i++)setTimeout(spawn,i*250);
  setInterval(spawn,650);

  /* ---------- soft music (synthesized, no files) ---------- */
  var ctx,master,playing=false,timer,step=0;
  var chords=[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,392]];
  function note(f,t,d){
    var o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.06);
    g.gain.exponentialRampToValueAtTime(.001,t+d);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05);
  }
  function bar(){
    var c=chords[step++%4],t=ctx.currentTime+.05;
    note(c[0]/2,t,3.2);
    c.forEach(function(f,i){note(f,t+i*.55,2.2);note(f*2,t+i*.55+.28,1.2)});
  }
  function startMusic(){
    try{
      if(!ctx){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
        ctx=new AC();master=ctx.createGain();master.gain.value=.35;master.connect(ctx.destination);}
      if(ctx.state==='suspended')ctx.resume();
      if(playing)return;
      playing=true;bar();timer=setInterval(bar,2400);
      $('music').textContent='🎵';$('music').classList.add('on');
    }catch(e){}
  }
  function stopMusic(){
    playing=false;clearInterval(timer);
    if(ctx&&ctx.state==='running')ctx.suspend();
    $('music').textContent='🔇';$('music').classList.remove('on');
  }
  $('music').addEventListener('click',function(){playing?stopMusic():startMusic()});

  /* ---------- letter ---------- */
  var lines=[
    {t:'My Dearest ❤️',c:'first'},
    {t:'There is something I have wanted to tell you.'},
    {t:'Even though we may be far apart, you are always close to my heart.'},
    {t:'You make my days brighter and my life more beautiful.'},
    {t:'And today, I just want you to know…'},
    {t:'I LOVE YOU ❤️',c:'big'},
    {t:'You are truly special to me.',c:'closing'}
  ];
  var opened=false,token=0;
  var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};

  async function typeLetter(my){
    var box=$('text'),letter=$('letter');
    for(var i=0;i<lines.length;i++){
      var p=document.createElement('p');
      if(lines[i].c)p.className=lines[i].c;
      p.classList.add('cursor');box.appendChild(p);
      var txt=lines[i].t,speed=lines[i].c==='big'?95:38;
      for(var k=0;k<=txt.length;k++){
        if(my!==token)return;
        p.textContent=txt.slice(0,k);
        letter.scrollTop=letter.scrollHeight;
        await sleep(speed);
      }
      p.classList.remove('cursor');
      await sleep(i===4?1300:550);
    }
    if(my!==token)return;
    $('rose').classList.add('show');
    letter.scrollTop=letter.scrollHeight;
    await sleep(900);
    $('next').classList.add('show');
  }

  function openLetter(){
    if(opened)return;opened=true;
    startMusic();
    $('envelope').parentNode.classList.add('opened');
    $('envelope').classList.add('opened');
    $('openBtn').style.opacity='0';$('openBtn').style.pointerEvents='none';
    for(var i=0;i<14;i++)setTimeout(spawn,i*60);
    setTimeout(function(){
      $('intro').classList.add('hide');
      $('letterScreen').classList.remove('hide');
      setTimeout(function(){
        $('letter').classList.add('show');
        var my=++token;
        setTimeout(function(){typeLetter(my)},900);
      },500);
    },2100);
  }
  $('openBtn').addEventListener('click',openLetter);
  $('envWrap').addEventListener('click',openLetter);

  $('next').addEventListener('click',function(){
    $('letterScreen').classList.add('hide');
    $('final').classList.remove('hide');
    for(var i=0;i<24;i++)setTimeout(spawn,i*90);
  });

  $('replay').addEventListener('click',function(){
    token++;
    $('final').classList.add('hide');
    $('letter').classList.remove('show');
    $('text').innerHTML='';
    $('rose').classList.remove('show');
    $('next').classList.remove('show');
    $('letterScreen').classList.remove('hide');
    setTimeout(function(){
      $('letter').classList.add('show');
      var my=++token;
      setTimeout(function(){typeLetter(my)},900);
    },400);
  });
})();
