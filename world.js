class VoxelWorld {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rewards = new Map();
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.buildGeometry();
    new ResizeObserver(() => this.draw()).observe(canvas);
  }

  buildGeometry() {
    const blocks = [];
    let reward = '';
    const box = (x, y, z, w, d, h, material) => blocks.push({x,y,z,w,d,h,material,reward});
    const tile = (x, y, z, h, material) => box(x,y,z,1,1,h,material);
    const area = (x, y, w, d, z, h, material) => {
      for (let i=x; i<x+w; i++) for (let j=y; j<y+d; j++) tile(i,j,z,h,material);
    };
    const add = (id, build) => { reward = id; build(); };

    area(0,0,16,13,-1.45,1.05,'earth');
    area(0,0,16,13,-.4,.4,'grass');
    add('foundation', () => area(2,1,7,6,0,.38,'stone'));
    add('floor', () => area(3,2,5,4,.38,.16,'wood'));
    const wall = (x,y) => {
      for (let level=0; level<3; level++) tile(x,y,.38+level*.78,.78,level===0?'woodDark':'wood');
    };
    add('left-wall', () => { for (let y=1; y<=6; y++) wall(2,y); });
    add('right-wall', () => { for (let y=1; y<=6; y++) wall(8,y); });
    add('back-wall', () => { for (let x=3; x<=7; x++) wall(x,1); });
    add('front-wall', () => {
      for (const x of [3,7]) wall(x,6);
      for (const x of [4,6]) tile(x,6,.38,.78,'woodDark');
      for (const x of [4,5,6]) tile(x,6,1.94,.78,'wood');
    });
    add('door', () => {
      box(5.12,6.65,.38,.76,.27,1.56,'door');
      box(5.70,6.92,1.06,.12,.08,.12,'gold');
    });
    add('windows', () => {
      for (const x of [4,6]) {
        box(x+.08,6.78,1.16,.84,.17,.78,'glass');
        box(x+.45,6.95,1.16,.1,.04,.78,'woodDark');
      }
    });
    add('roof', () => {
      for (let x=1; x<=9; x++) {
        const height = (4-Math.abs(x-5))*.45;
        area(x,0,1,8,2.72+height,.45,'roof');
        if (height > 0) {
          for (const y of [1,6]) tile(x,y,2.72,height,'woodDark');
        }
      }
    });
    add('chimney', () => {
      tile(3,2,4.04,1.28,'stone');
      box(2.93,1.93,5.25,1.14,1.14,.18,'woodDark');
    });
    add('fence', () => {
      for (let x=1; x<=7; x++) for (const y of [8,12]) {
        if (x===5 && y===8) continue;
        box(x+.36,y+.36,0,.28,.28,.72,'woodDark');
        if (x<7 && !(x===4 && y===8)) box(x+.62,y+.42,.27,.75,.16,.22,'wood');
      }
      for (const x of [1,7]) {
        for (let y=9; y<12; y++) box(x+.36,y+.36,0,.28,.28,.72,'woodDark');
        for (let y=8; y<12; y++) box(x+.42,y+.62,.27,.16,.75,.22,'wood');
      }
    });
    add('beds', () => {
      area(2,9,4,1,0,.09,'soil');
      area(2,11,4,1,0,.09,'soil');
    });
    add('irrigation', () => area(2,10,4,1,0,.06,'water'));
    add('wheat', () => {
      for (let x=2; x<6; x++) for (const y of [9,11]) {
        for (const [a,b,h] of [[.2,.2,.54],[.61,.31,.69],[.39,.66,.46],[.73,.71,.56]]) {
          box(x+a,y+b,.09,.09,.09,h,'stem');
          box(x+a-.035,y+b-.035,h,.16,.16,.24,'gold');
        }
      }
    });
    add('sheep', () => {
      for (const x of [6.1,6.58]) for (const y of [9.12,9.64]) box(x,y,0,.15,.15,.35,'stone');
      box(6,9,.33,.78,.9,.53,'wool');
      box(6.15,9.75,.52,.47,.4,.44,'wool');
      box(6.19,10.12,.54,.39,.1,.16,'muzzle');
      for (const x of [6.22,6.49]) box(x,10.14,.76,.07,.065,.065,'coal');
    });
    add('path', () => {
      for (const [x,y] of [[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[10,8],[10,9],[10,10],[10,11],[10,12]]) tile(x,y,0,.07,'path');
    });
    add('tree', () => {
      box(12.26,2.23,0,.48,.48,2.4,'trunk');
      area(11,1,3,3,1.9,.82,'leaves');
      area(11,1,3,3,2.72,.83,'leaves');
      tile(12,2,3.55,.75,'leaves');
    });
    add('pond', () => {
      area(12,6,3,4,0,.055,'water');
      area(13,5,2,1,0,.055,'water');
      area(13,10,2,1,0,.055,'water');
    });
    add('bridge', () => {
      for (let x=11; x<=15; x++) {
        const height = x===11 || x===15 ? .21 : .4;
        tile(x,7,0,height,'woodDark');
        tile(x,7,height,.12,'wood');
      }
    });
    const lantern = (x,y,height) => {
      box(x+.37,y+.37,0,.25,.25,height,'woodDark');
      box(x+.27,y+.27,height,.45,.45,.47,'lamp');
      box(x+.23,y+.23,height+.47,.53,.53,.12,'coal');
    };
    add('lanterns', () => { lantern(9,8,.85); lantern(11,11,.85); });
    add('flowers', () => {
      for (const [x,y,material] of [[8.2,10.2,'flower'],[8.75,10.54,'gold'],[9.22,11.16,'flower'],[11.32,4.36,'gold'],[12.08,4.52,'flower'],[11.65,4.8,'flower']]) {
        box(x,y,0,.1,.1,.37,'stem');
        box(x-.1,y-.09,.34,.3,.28,.15,material);
      }
    });
    add('chest', () => {
      box(3.15,7.05,0,.8,.72,.55,'door');
      box(3.15,7.05,.55,.8,.72,.14,'woodDark');
      box(3.48,7.77,.43,.16,.09,.19,'gold');
    });
    add('porch-lamp', () => lantern(4,7,.66));
    add('crystal', () => {
      tile(13,11,0,.17,'stone');
      box(13.12,11.12,.17,.76,.76,.76,'crystal');
    });
    add('flag', () => {
      box(15.1,11.25,0,.16,.16,3.1,'trunk');
      box(15.24,11.25,2.18,1.08,.14,.78,'flag');
      box(15.24,11.25,2.50,.68,.15,.14,'gold');
    });

    // Ground first. Along each grid diagonal, paint from low to high.
    this.blocks = blocks.sort((a,b) => Number(Boolean(a.reward))-Number(Boolean(b.reward)) ||
      Math.floor(a.x)+Math.floor(a.y)-Math.floor(b.x)-Math.floor(b.y) ||
      a.z-b.z || (a.x+a.y)-(b.x+b.y));
  }

  setRewards(rewards, latest = '') {
    this.rewards = new Map(rewards);
    this.finishes = new Map([...rewards].map(([id, variant]) => [id, this.catalogColors(id, variant)]));
    this.latest = latest;
    this.started = performance.now();
    cancelAnimationFrame(this.frame);
    this.draw();
  }

  catalogColors(reward, variant) {
    const [, materials] = buildCatalog[reward][variant + 1];
    return Object.fromEntries(Object.entries(materials).map(([material, color]) => [material, shadeMaterial(color)]));
  }

  preview(canvas, reward, variant) {
    const width = 144, height = 102;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width*ratio);
    canvas.height = Math.round(height*ratio);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio,0,0,ratio,0,0);

    const blocks = this.blocks.filter(block => block.reward === reward).map(block => catalogBlock(block, variant));
    const palette = this.catalogColors(reward, variant);
    const iso = (x,y,z) => [x-y,(x+y)*.49-z*1.05];
    const corners = blocks.flatMap(({x,y,z,w,d,h}) =>
      [x,x+w].flatMap(a => [y,y+d].flatMap(b => [z,z+h].map(c => iso(a,b,c))))
    );
    const xs = corners.map(([x]) => x), ys = corners.map(([,y]) => y);
    const left = Math.min(...xs), right = Math.max(...xs);
    const top = Math.min(...ys), bottom = Math.max(...ys);
    const scale = Math.min((width-21)/(right-left), (height-18)/(bottom-top), 52);
    const project = (x,y,z) => {
      const [i,j] = iso(x,y,z);
      return [width/2+(i-(left+right)/2)*scale,height/2+(j-(top+bottom)/2)*scale];
    };
    for (const block of blocks) this.drawBlock(ctx, block, project, 0, palette);
  }

  draw() {
    const {canvas, ctx} = this;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const ratio = window.devicePixelRatio || 1;
    const pixels = [Math.round(w*ratio), Math.round(h*ratio)];
    if (canvas.width !== pixels[0]) canvas.width = pixels[0];
    if (canvas.height !== pixels[1]) canvas.height = pixels[1];
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const sky = ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#709284');
    sky.addColorStop(.56,'#436a58');
    sky.addColorStop(1,'#243b37');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,w,h);
    this.drawHills(w,h);

    const scale = Math.min((w-28)/30, (h-52)/19);
    const originX = w/2-1.5*scale;
    const originY = (h-16)/2-5.5*scale;
    const project = (x,y,z) => [originX+(x-y)*scale,originY+((x+y)*.49-z*1.05)*scale];
    ctx.fillStyle = '#172a2780';
    ctx.beginPath();
    ctx.ellipse(w/2,h/2+7.5*scale,12*scale,2.3*scale,.04,0,Math.PI*2);
    ctx.fill();

    const elapsed = performance.now()-(this.started ?? 0);
    const drop = this.motion.matches ? 0 : Math.max(0,1-elapsed/420)**2*1.8;
    for (const source of this.blocks) {
      if (source.reward && !this.rewards.has(source.reward)) continue;
      const block = catalogBlock(source, this.rewards.get(source.reward));
      const offset = block.reward && block.reward===this.latest ? drop : 0;
      const flutter = block.material === 'flag' && !this.motion.matches ? Math.sin(elapsed/190)*.075 : 0;
      this.drawBlock(ctx, flutter ? {...block, w:block.w+flutter} : block, project, offset, this.finishes?.get(block.reward));
    }
    if (this.rewards.has('flag')) {
      const gem = this.rewards.get('crystal');
      const [x,y] = project(13.55,11.47,.36+.76*(gem === 1 ? 1.24 : gem === 2 ? .78 : 1));
      const pulse = this.motion.matches ? .5 : .5+.5*Math.sin(elapsed/290);
      ctx.fillStyle = `rgba(211,255,248,${.24+pulse*.55})`;
      ctx.fillRect(x-scale*.32,y-scale*.05,scale*.64,scale*.10);
      ctx.fillRect(x-scale*.05,y-scale*.32,scale*.10,scale*.64);
    }
    if (!this.motion.matches && (drop>0 || this.rewards.has('flag'))) {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => this.draw());
    }
  }

  drawHills(w,h) {
    const hills = [['#88a493',.33,37],['#668677',.45,22],['#527461',.58,29]];
    for (const [color,top,seed] of hills) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(0,h);
      for (let i=0; i<=24; i++) {
        const x = i*w/24, y=h*(top+.075*Math.sin(i*.58+seed)+.045*Math.cos(i*.9+seed));
        this.ctx.lineTo(x,y);
        this.ctx.lineTo(x+w/24,y);
      }
      this.ctx.lineTo(w,h);
      this.ctx.fill();
    }
  }

  drawBlock(ctx, {x,y,z,w,d,h,material}, p, offset, palette) {
    const top = z+h+offset, base = z+offset;
    const colors = palette?.[material] || voxelColors[material];
    const seed = Math.floor(x*29+y*131+z*257);
    this.face(ctx,p(x,y+d,top),p(x+w,y+d,top),p(x,y+d,base),colors[1],seed+7,material);
    this.face(ctx,p(x+w,y,top),p(x+w,y+d,top),p(x+w,y,base),colors[2],seed+15,material);
    this.face(ctx,p(x,y,top),p(x+w,y,top),p(x,y+d,top),colors[0],seed,material);
  }

  face(ctx,a,b,c,color,seed,material) {
    ctx.save();
    ctx.transform(b[0]-a[0],b[1]-a[1],c[0]-a[0],c[1]-a[1],a[0],a[1]);
    ctx.fillStyle = color;
    ctx.fillRect(-.015,-.015,1.03,1.03);
    const rows = material==='wood' || material==='roof' || material==='door';
    for (let i=0; i<6; i++) {
      const sample = Math.imul(seed+1, 0x9e3779b1) ^ Math.imul(i+1, 0x85ebca6b);
      const hash = Math.imul(sample ^ (sample >>> 16), 0x7feb352d) >>> 10 & 255;
      const x = (hash & 7)/8, y=((hash >> 3)&7)/8;
      ctx.fillStyle = hash & 64 ? '#ffffff24' : '#10180f2b';
      ctx.fillRect(x,y,rows ? Math.min(.48,1-x) : .13,.12);
    }
    ctx.restore();
  }
}

const voxelColors = {
  grass:['#92bd5f','#57813f','#689847'], earth:['#775039','#5b3a2a','#79513a'],
  stone:['#abb4af','#687771','#82938b'], wood:['#d6a869','#9c633d','#bd874c'],
  woodDark:['#ab7245','#6e452f','#865739'], door:['#d9a45c','#9b5a35','#b67843'],
  roof:['#b3654c','#763d35','#914c40'], glass:['#bdece4','#74b8b6','#9bd7cf'],
  soil:['#976846','#66472e','#82563c'], water:['#59bfc7','#3096a0','#3fadb3'],
  gold:['#f3d576','#c79943','#e2b654'], stem:['#a7b24e','#607d3b','#809441'],
  wool:['#f2ebd4','#bcb7a4','#d7d2c0'], muzzle:['#c99e89','#a97869','#b78674'],
  coal:['#576169','#303739','#3f494e'], path:['#d5ba89','#ac926e','#c6a576'],
  trunk:['#a67851','#654a32','#845b3b'], leaves:['#71aa52','#3f7845','#518c49'],
  lamp:['#fff6aa','#e2a641','#ffd466'], flower:['#f19fbe','#c15d84','#e27a9f'],
  crystal:['#a5eee3','#398f92','#62c6bd'], flag:['#e98679','#a74d52','#c66868']
};

// The catalog keeps each option on the same building plot so pieces fit in any combination.
const planks = [
  ['Honey oak', {wood:'#d6a869', woodDark:'#ab7245'}],
  ['White birch', {wood:'#e0d5b2', woodDark:'#a4977b'}],
  ['Dark walnut', {wood:'#80604f', woodDark:'#604033'}]
];
const buildCatalog = {
  foundation: ['Foundation',
    ['River stone', {stone:'#abb4af'}], ['Sandstone', {stone:'#d5b881'}], ['Slate', {stone:'#697f92'}]],
  floor: ['Floor', ...planks],
  'left-wall': ['Left wall', ...planks],
  'right-wall': ['Right wall', ...planks],
  'back-wall': ['Back wall', ...planks],
  'front-wall': ['Front wall', ...planks],
  door: ['Door',
    ['Oak', {door:'#d9a45c'}], ['Forest green', {door:'#68906d'}], ['Crimson', {door:'#b66664'}]],
  windows: ['Windows',
    ['Clear glass', {glass:'#bdece4'}], ['Sea glass', {glass:'#6fc1d3'}], ['Rose glass', {glass:'#eab2cd'}]],
  roof: ['Roof',
    ['Terracotta', {roof:'#b3654c'}], ['Blue slate', {roof:'#607e9c'}], ['Moss shingles', {roof:'#728758'}]],
  chimney: ['Chimney',
    ['Stone stack', {stone:'#abb4af'}], ['Tall brick stack', {stone:'#ba7761', woodDark:'#825143'}], ['Short slate stack', {stone:'#657889', woodDark:'#49515c'}]],
  fence: ['Fence', ...planks],
  beds: ['Garden beds',
    ['Loam', {soil:'#976846'}], ['Red clay', {soil:'#b57256'}], ['Dark compost', {soil:'#5d4a43'}]],
  irrigation: ['Irrigation',
    ['Spring water', {water:'#59bfc7'}], ['Blue canal', {water:'#6595d6'}], ['Jade canal', {water:'#56b498'}]],
  wheat: ['Wheat',
    ['Golden wheat', {gold:'#f3d576'}], ['Green shoots', {gold:'#a9ce63', stem:'#7a9d51'}], ['Amber wheat', {gold:'#dfaa61'}]],
  sheep: ['Sheep',
    ['Vanilla', {wool:'#f2ebd4'}], ['Cocoa', {wool:'#9f7762'}], ['Pepper', {wool:'#6b727d', coal:'#333741'}]],
  path: ['Path',
    ['Gravel', {path:'#d5ba89'}], ['Brick', {path:'#bb806a'}], ['Flagstone', {path:'#a5b8b9'}]],
  tree: ['Tree',
    ['Green oak', {leaves:'#71aa52'}], ['Tall maple', {leaves:'#da9355', trunk:'#90624b'}], ['Dwarf cherry', {leaves:'#e292aa'}]],
  pond: ['Pond',
    ['Spring pool', {water:'#59bfc7'}], ['Deep blue', {water:'#638fc7'}], ['Jade pool', {water:'#67b69f'}]],
  bridge: ['Bridge', ...planks],
  lanterns: ['Path lanterns',
    ['Candlelight', {lamp:'#fff6aa'}], ['Moonlight', {lamp:'#a7e5fb'}], ['Rose glow', {lamp:'#ffc0c6'}]],
  flowers: ['Flowers',
    ['Cottage mix', {flower:'#f19fbe', gold:'#f3d576'}], ['Lavender bed', {flower:'#b69ee9', gold:'#d9b8eb'}], ['Meadow mix', {flower:'#fff4d7', gold:'#ffcc65'}]],
  chest: ['Chest',
    ['Oak chest', {door:'#d9a45c'}], ['Painted trunk', {door:'#6f9c82', woodDark:'#47705f'}], ['Iron chest', {door:'#a0aab7', woodDark:'#5e697d'}]],
  'porch-lamp': ['Porch lamp',
    ['Warm amber', {lamp:'#fff6aa'}], ['Cool mist', {lamp:'#a7e5fb'}], ['Peach glow', {lamp:'#ffbead'}]],
  crystal: ['Gem block',
    ['Diamond cube', {crystal:'#a5eee3'}], ['Amethyst tower', {crystal:'#c89bee'}], ['Citrine', {crystal:'#f4cc75'}]],
  flag: ['Flag',
    ['Coral banner', {flag:'#e98679'}], ['Long blue pennant', {flag:'#86b2eb', gold:'#e1edff'}], ['Short green flag', {flag:'#9ac575', gold:'#f2e28d'}]]
};

function catalogBlock(block, variant) {
  if (!variant) return block;
  const {reward, material, z, h, w} = block;
  const scale = variant === 1 ? 1.24 : .78;
  if (reward === 'tree') return {...block, z:z*scale, h:h*scale};
  if (reward === 'chimney') return {...block, z:4.04+(z-4.04)*scale, h:h*scale};
  if (reward === 'crystal' && material === 'crystal') return {...block, h:h*scale};
  if (reward === 'flag' && material !== 'trunk') return {...block, w:w*scale};
  return block;
}

function shadeMaterial(hex) {
  const value = parseInt(hex.slice(1), 16);
  const side = factor => {
    const channels = [16, 8, 0].map(shift => Math.round(((value >> shift)&255)*factor));
    return `rgb(${channels.join(',')})`;
  };
  return [hex, side(.68), side(.84)];
}
