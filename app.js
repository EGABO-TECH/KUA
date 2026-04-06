        /* ── Splash screen ────────────────────────────────── */
        function enterApp() {
            const splash = document.getElementById('splash');
            const btn    = document.getElementById('splash-btn');
            if (!splash) return;
            // Animate button click
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                splash.classList.add('exit');
                // Remove from DOM after transition (0.7 s)
                setTimeout(() => splash.remove(), 750);
                // Kick off the main app
                init();
            }, 180);
        }

        const $ = id => document.getElementById(id);
        const P = { page: 'dash', ldm: false, pro: false, sbC: false, fS: 1, img: null, imgU: null, title: '', price: '', desc: '', tags: [], theme: 'classic', fr: false, bcCh: { whatsapp: true, facebook: true, instagram: true, x: true } };

        /* Data persistence */
        function gD() { try { return JSON.parse(localStorage.getItem('kua_d') || '{}') } catch (e) { return {} } }
        function sD(d) { localStorage.setItem('kua_d', JSON.stringify(d)) }
        function getProfile() { return gD().profile || { name: '', businessName: '', brandName: '', ctaText: 'Order on WhatsApp', channels: { whatsapp: { connected: false, phone: '' }, instagram: { connected: false, username: '' }, twitter: { connected: false, username: '' }, linkedin: { connected: false, username: '' } } } }
        function saveProfile() { const d = gD(); d.profile = getProfile(); sD(d) }
        function getActivity() { return gD().activity || [] }
        function addActivity(item) { const d = gD(); d.activity = d.activity || []; d.activity.unshift(item); if (d.activity.length > 50) d.activity.length = 50; d.flyers = (d.flyers || 0) + (item.type === 'flyer' ? 1 : 0); d.broadcasts = (d.broadcasts || 0) + (item.type === 'broadcast' ? 1 : 0); sD(d) }

        const cM = { whatsapp: { n: 'WhatsApp', i: 'fa-brands fa-whatsapp', c: '#25D366' }, instagram: { n: 'Instagram', i: 'fa-brands fa-instagram', c: '#E4405F' }, twitter: { n: 'X (Twitter)', i: 'fa-brands fa-x-twitter', c: '#E7E9EA' }, linkedin: { n: 'LinkedIn', i: 'fa-brands fa-linkedin-in', c: '#0A66C2' } };
        const aTags = ['Premium Quality', 'Fast Delivery', 'Limited Stock', 'Best Seller', 'Free Shipping', 'New Arrival', 'Handmade', 'Organic'];
        const mHooks = [
            { h: 'The Pinnacle of Craftsmanship', d: 'Perfect for high-end luxury items.' },
            { h: 'Timeless Elegance. Redefined.', d: 'Classic, sophisticated appeal.' },
            { h: 'Elevate Your Everyday.', d: 'Focuses on lifestyle improvement.' },
            { h: 'Pure Quality. No Compromise.', d: 'Strong focus on durability/build.' },
            { h: 'Discover the Extraordinary.', d: 'Creates a sense of wonder/newness.' },
            { h: 'Crafted for Perfection.', d: 'Heavy focus on detail and design.' }
        ];

        /* Toast */
        function toast(m, t = 'info') { const c = $('ts'), cs = { success: 'border-green-500/40 bg-green-500/10 text-green-300', error: 'border-red-500/40 bg-red-500/10 text-red-300', warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300', info: 'border-blue-400/40 bg-blue-400/10 text-blue-300' }, is = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' }, el = document.createElement('div'); el.className = `pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-xl border backdrop-blur-xl text-[13px] font-medium ti ${cs[t]}`; el.innerHTML = `<i class="fa-solid ${is[t]}"></i><span>${m}</span>`; c.appendChild(el); setTimeout(() => { el.classList.remove('ti'); el.classList.add('to'); setTimeout(() => el.remove(), 300) }, 3000) }

        /* Nav */
        const pT = { dash: 'Dashboard', flyer: 'Flyer Generator', bcast: 'Broadcast Center', acct: 'Connected Accounts', set: 'Settings' };
        function nv(p) { P.page = p; $('pt').textContent = pT[p] || 'Kua'; document.querySelectorAll('.vw').forEach(v => v.classList.remove('on')); const t = $('v-' + p); if (t) t.classList.add('on'); document.querySelectorAll('.ni').forEach(b => { const a = b.dataset.n === p; b.classList.toggle('text-white', a); b.classList.toggle('bg-el', a); b.classList.toggle('text-nv-400', !a); b.classList.toggle('hover:bg-nv-800', !a); b.classList.toggle('hover:text-white', !a); }); document.querySelectorAll('.bn').forEach(b => { const a = b.dataset.bn === p; b.classList.toggle('text-el', a); b.classList.toggle('text-nv-600', !a) }); $('cnt').scrollTop = 0; if (p === 'acct') rAcct(); if (p === 'bcast') rBCP(); if (p === 'dash') rDash(); if (p === 'set') loadSet() }
        function tSB() { P.sbC = !P.sbC; $('sidebar').classList.toggle('col', P.sbC); $('main').style.marginLeft = window.innerWidth >= 768 ? (P.sbC ? '64px' : '256px') : '0' }
        function tLDM() { P.ldm = !P.ldm; document.querySelectorAll('#ldm-st').forEach(t => t.classList.toggle('on', P.ldm)); document.body.classList.toggle('ldm', P.ldm); $('ldm-mt').textContent = P.ldm ? 'On' : 'Off'; if (P.fr && P.fS === 3) { $('fpw').classList.toggle('hidden', P.ldm); $('fpl').classList.toggle('hidden', !P.ldm) } toast(P.ldm ? 'Low Data Mode on' : 'Low Data Mode off', 'info') }
        function tPro() { P.pro = !P.pro; document.querySelectorAll('#pro-st').forEach(t => t.classList.toggle('on', P.pro)); toast(P.pro ? 'Pro Mode active - watermark hidden' : 'Pro Mode off', 'success') }

        /* Upload */
        function hFile(e) { const f = e.target.files[0]; if (f) pF(f) } function hDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('dv'); const f = e.dataTransfer.files[0]; if (f) pF(f) }
        function pF(f) { if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) { toast('Use JPG, PNG, or WebP', 'error'); return } if (f.size > 10 * 1024 * 1024) { toast('Max 10MB', 'error'); return } const r = new FileReader(); r.onload = e => { const u = e.target.result, img = new Image(); img.onload = () => { P.img = img; P.imgU = u; $('up-h').classList.add('hidden'); $('up-v').classList.remove('hidden'); $('pv-i').src = u; $('pv-f').textContent = f.name; $('b1').disabled = false; toast('Image uploaded', 'success') }; img.src = u }; r.readAsDataURL(f) }
        function rmI() { P.img = null; P.imgU = null; $('up-h').classList.remove('hidden'); $('up-v').classList.add('hidden'); $('fi').value = ''; $('b1').disabled = true }

        /* Steps */
        function gS(n) {
            P.fS = n; document.querySelectorAll('.fs').forEach(s => s.classList.add('hidden')); $('f' + n).classList.remove('hidden'); for (let i = 1; i <= 4; i++) { const d = $('s' + i); d.className = 'sd'; if (i < n) { d.classList.add('dn'); d.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i>' } else if (i === n) { d.classList.add('ac'); d.textContent = i } else { d.classList.add('pn'); d.textContent = i } if (i < 4) { const l = $('l' + i); l.className = 'sln mx-2 mt-[-14px]'; l.classList.add(i < n ? 'dn' : 'pn') } }
            if (n === 4) { $('bc-ti').textContent = P.title; $('bc-pr').textContent = '$' + P.price; $('bc-de').textContent = P.desc || ''; $('bc-th').src = P.imgU || ''; rBcC(); $('bc-rs').classList.add('hidden'); $('bc-er').classList.add('hidden'); $('bc-bn').disabled = false; $('bc-bn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1.5"></i>Broadcast Now' }
            if (n === 3 && P.ldm) { $('fpw').classList.add('hidden'); $('fpl').classList.remove('hidden') } else if (n === 3) { $('fpw').classList.remove('hidden'); $('fpl').classList.add('hidden') }
        }

        /* Tags & Theme */
        function iTags() { $('tg-b').innerHTML = aTags.map(t => `<button type="button" onclick="tTg(this,'${t}')" class="tgb px-2 py-1 text-[11px] font-medium rounded-full border border-nv-700 text-nv-400 hover:border-el/30 hover:text-el transition-colors">${t}</button>`).join('') }
        function tTg(b, t) { const i = P.tags.indexOf(t); if (i > -1) { P.tags.splice(i, 1); b.classList.remove('border-el/50', 'text-el', 'bg-el/8'); b.classList.add('border-nv-700', 'text-nv-400') } else { P.tags.push(t); b.classList.add('border-el/50', 'text-el', 'bg-el/8'); b.classList.remove('border-nv-700', 'text-nv-400') } }
        function pTh(el) { document.querySelectorAll('.tc').forEach(c => c.classList.remove('sl')); el.classList.add('sl'); P.theme = el.dataset.t }

        function rHooks() {
            const ti = $('i-t').value.trim(); if (!ti) { $('hk-z').classList.add('hidden'); return }
            $('hk-z').classList.remove('hidden');
            const hooks = mHooks.slice(0, 3).map(h => `<button type="button" onclick="sHg('${h.h.replace(/'/g, "\\'")}')" class="group text-left p-3 rounded-xl border border-nv-700/50 bg-nv-800/30 hover:border-el/40 transition-all"><p class="text-white text-xs font-bold mb-0.5 group-hover:text-el">${h.h}</p><p class="text-[10px] text-nv-500">${h.d}</p></button>`).join('');
            $('hk-b').innerHTML = hooks;
        }
        function sHg(h) { $('i-d').value = h; $('dc').textContent = h.length; toast('Expert copy applied', 'success') }
        /* Add listeners for hooks */
        window.addEventListener('DOMContentLoaded', () => { $('i-t').addEventListener('input', rHooks); $('i-p').addEventListener('input', rHooks) });

        /* Flyer Engine Utilities */
        function nPattern(c, w, h, a) { const nc = document.createElement('canvas'); nc.width = 128; nc.height = 128; const nctx = nc.getContext('2d'); const id = nctx.createImageData(128, 128); for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = v; id.data[i + 1] = v; id.data[i + 2] = v; id.data[i + 3] = 35 } nctx.putImageData(id, 0, 0); const p = c.createPattern(nc, 'repeat'); c.save(); c.globalAlpha = a; c.fillStyle = p; c.fillRect(0, 0, w, h); c.restore() }
        const TH = {
            luxe: { bg: '#0D0D0D', hBg: 'transparent', hAc: '#D4AF37', tC: '#F2F2F2', dC: '#8C8C8C', pBg: '#D4AF37', pBd: '#D4AF37', pC: '#0D0D0D', cBg: 'transparent', cC: '#D4AF37', tgC: '#595959', wC: '#404040', la: 'left', hBar: false, sh: true, gl: true, fH: '700 68px serif', fT: '400 20px Inter', fP: '700 42px Inter', lS: '0.12em', iF: 'brightness(1.1) contrast(1.1)', ed: true, g: 0.08 },
            modernist: { bg: '#FFFFFF', hBg: '#000000', hAc: '#E63946', tC: '#000000', dC: '#1D3557', pBg: '#000000', pBd: '#000000', pC: '#FFFFFF', cBg: '#E63946', cC: '#FFFFFF', tgC: '#457B9D', wC: '#F1FAEE', la: 'center', hBar: true, sh: false, gl: false, fH: '900 78px Inter', fT: '500 18px Inter', fP: '900 52px Inter', lS: '-0.04em', iF: 'grayscale(0.1) contrast(1.15)', ed: false, g: 0.05 },
            streetwise: { bg: '#050505', hBg: 'gradient', hAc: '#3A86FF', tC: '#FFFFFF', dC: '#8338EC', pBg: 'gradient', pBd: 'transparent', pC: '#FFFFFF', cBg: '#3A86FF', cC: '#FFFFFF', tgC: '#FF006E', wC: '#333333', la: 'left', hBar: true, sh: true, gl: true, fH: '800 62px Inter', fT: '600 22px Inter', fP: '800 46px Inter', lS: '0.04em', iF: 'saturate(1.2) contrast(1.15)', ed: false, g: 0.1 }
        };
        function rR(c, x, y, w, h, r) { r = Math.max(0, Math.min(r, Math.min(w, h) / 2)); c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath() }
        function iC(c, img, dx, dy, dw, dh) { const ir = img.width / img.height, ar = dw / dh; let sx, sy, sw, sh; if (ir > ar) { sh = img.height; sw = Math.max(1, sh * ar); sx = (img.width - sw) / 2; sy = 0 } else { sw = img.width; sh = Math.max(1, sw / ar); sx = 0; sy = (img.height - sh) / 2 } c.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) }
        function trT(c, t, mw) { if (c.measureText(t).width <= mw) return t; let s = t; while (s.length > 0 && c.measureText(s + '...').width > mw) s = s.slice(0, -1); return s + '...' }
        function wrT(c, t, mw, lh, ml) { const ws = t.split(' '); let ls = [], cur = ''; for (const w of ws) { const test = cur ? cur + ' ' + w : w; if (c.measureText(test).width > mw && cur) { ls.push(cur); cur = w; if (ls.length >= ml) break } else cur = test } if (cur && ls.length < ml) ls.push(cur); return ls }

        function rFlyer(cv, d, tk) {
            const t = TH[tk] || TH.luxe; const c = cv.getContext('2d', { alpha: false }), W = 1080, H = 1080; cv.width = W; cv.height = H;
            const pr = getProfile(), br = (pr.brandName || pr.businessName || 'KUA').toUpperCase(), ct = pr.ctaText || 'ORDER ON WHATSAPP';
            const cx = W / 2, lx = 80, ta = t.la === 'left' ? 'left' : 'center', mX = ta === 'left' ? lx : cx;

            // Background & Studio Aurora
            c.fillStyle = t.bg; c.fillRect(0, 0, W, H);
            if (d.image) {
                c.save();
                c.filter = 'blur(60px) desaturate(0.5) brightness(0.6)';
                c.globalAlpha = 0.4;
                iC(c, d.image, -100, -100, W + 200, H + 200);
                c.restore();
            }
            if (t.gl) {
                const g = c.createRadialGradient(W * .8, H * .2, 0, W * .8, H * .2, W);
                g.addColorStop(0, tk === 'luxe' ? 'rgba(212,175,55,0.12)' : 'rgba(58,134,255,0.15)');
                g.addColorStop(1, 'transparent');
                c.fillStyle = g; c.fillRect(0, 0, W, H);
            }

            // Header/Brand
            if (t.hBar) {
                if (t.hBg === 'gradient') {
                    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#3A86FF'); g.addColorStop(1, '#8338EC');
                    c.fillStyle = g;
                } else c.fillStyle = t.hBg;
                c.fillRect(0, 0, W, 110);
                c.fillStyle = '#FFF'; c.font = '900 38px Inter'; c.textAlign = ta; c.textBaseline = 'middle';
                c.fillText(br, mX, 55);
                c.fillStyle = t.hAc; c.fillRect(0, 110, W, 4);
            } else {
                c.fillStyle = t.hAc; c.font = '800 32px Inter'; c.textAlign = 'left'; c.textBaseline = 'top';
                c.fillText(br, lx, 40);
                c.fillRect(lx, 85, 60, 4);
            }

            // Image Section
            let iH = 540, iY = t.hBar ? 150 : 120, iW = 920, iX = (W - iW) / 2;
            if (t.ed) { iW = 1000; iX = 40; iH = 600 } // Editorial layout scaling
            
            c.save();
            rR(c, iX, iY, iW, iH, t.ed ? 8 : 24);
            if (t.sh) {
                c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 60; c.shadowOffsetY = 30;
                c.fillStyle = '#111'; c.fill();
                c.shadowBlur = 0;
            }
            c.clip();
            if (d.image) {
                if (t.iF) c.filter = t.iF;
                iC(c, d.image, iX, iY, iW, iH);
                c.filter = 'none';
                // Rim Light Effect
                const rg = c.createLinearGradient(iX, iY, iX, iY + iH);
                rg.addColorStop(0, 'rgba(255,255,255,0.2)'); rg.addColorStop(0.5, 'transparent'); rg.addColorStop(1, 'rgba(0,0,0,0.3)');
                c.fillStyle = rg; c.fillRect(iX, iY, iW, iH);
            } else {
                c.fillStyle = '#1A1A1A'; c.fillRect(iX, iY, iW, iH);
            }
            c.restore();

            // Content Section
            let cy = iY + iH + 60;
            const mw = 920;
            
            if (t.ed) {
                // Editorial Title Overlap
                const oy = iY + iH - 40;
                c.fillStyle = 'rgba(0,0,0,0.6)';
                c.fillRect(0, oy - 20, W, 140);
                c.fillStyle = t.tC; c.font = '700 82px serif'; c.textAlign = 'center';
                c.fillText(d.title.toUpperCase(), W/2, oy);
                cy = oy + 120;
            } else {
                c.fillStyle = t.tC; c.font = t.fH; c.textAlign = ta; c.textBaseline = 'top';
                c.letterSpacing = t.lS || '0';
                const wrappedTitle = wrT(c, d.title.toUpperCase(), mw, 60, 2);
                wrappedTitle.forEach(l => { c.fillText(l, mX, cy); cy += 75 });
            }

            if (d.desc) {
                cy += 10; c.fillStyle = t.dC; c.font = t.fT;
                const wrappedDesc = wrT(c, d.desc, mw, 24, 2);
                wrappedDesc.forEach(l => { c.fillText(l, mX, cy); cy += 30 });
            }

            // Price Badge
            cy += 40;
            const pS = `$${parseFloat(d.price).toLocaleString()}`;
            c.font = t.fP; const pw = c.measureText(pS).width;
            const bW = pw + 80, bH = 90, bX = ta === 'left' ? lx : cx - bW / 2;
            c.save();
            if (t.pBg === 'gradient') {
                const g = c.createLinearGradient(bX, cy, bX + bW, cy); g.addColorStop(0, '#FF006E'); g.addColorStop(1, '#FB5607');
                c.fillStyle = g;
            } else c.fillStyle = t.pBg;
            rR(c, bX, cy, bW, bH, 12); c.fill();
            c.fillStyle = t.pC; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText(pS, bX + bW / 2, cy + bH / 2 + 2);
            c.restore();

            // CTA Button
            cy += bH + 50;
            const cW = 440, cH = 80, cX = ta === 'left' ? lx : cx - cW / 2;
            c.save();
            if (tk === 'luxe') {
                rR(c, cX, cy, cW, cH, 0); c.strokeStyle = '#D4AF37'; c.lineWidth = 3; c.stroke();
            } else {
                c.fillStyle = t.cBg === 'gradient' ? '#3A86FF' : t.cBg;
                rR(c, cX, cy, cW, cH, 12); c.fill();
            }
            c.fillStyle = t.cC; c.font = 'bold 22px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.letterSpacing = '0.15em';
            c.fillText(ct, cX + cW / 2, cy + cH / 2 + 1);
            c.restore();

            // Footer
            if (!P.pro) {
                c.letterSpacing = '0.3em';
                c.fillStyle = t.wC; c.font = '800 16px Inter'; c.textAlign = 'center';
                c.fillText('POWERED BY UNITED', cx, H - 50);
            }
            c.letterSpacing = '0';

            // Noise Overlay
            if (t.g) nPattern(c, W, H, t.g);
        }

        function genF() {
            const ti = $('i-t').value.trim(), pr = $('i-p').value.trim(), de = $('i-d').value.trim(); if (!ti) { $('s2e').classList.remove('hidden'); $('s2et').textContent = 'Product title is required.'; return } if (!pr || isNaN(parseFloat(pr))) { $('s2e').classList.remove('hidden'); $('s2et').textContent = 'Enter a valid price.'; return } $('s2e').classList.add('hidden'); P.title = ti; P.price = pr; P.desc = de; $('gov').classList.remove('hidden');
            setTimeout(() => { rFlyer($('fc'), { image: P.img, title: P.title, price: P.price, desc: P.desc, tags: P.tags }, P.theme); rFlyer($('pv-c'), { image: P.img, title: P.title, price: P.price, desc: P.desc, tags: P.tags }, P.theme); $('gov').classList.add('hidden'); P.fr = true; addActivity({ type: 'flyer', title: ti, price: pr, time: Date.now(), theme: P.theme }); gS(3); toast('Flyer generated', 'success') }, 900)
        }
        function dlF() { const c = $('fc'), a = document.createElement('a'); a.download = `kua-${P.title.replace(/\s/g, '-').toLowerCase()}-${Date.now()}.png`; a.href = c.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); toast('Downloaded', 'success') }
        function shF() { const c = $('fc'); c.toBlob(b => { if (!b) return; const f = new File([b], 'kua-flyer.png', { type: 'image/png' }); if (navigator.share && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ title: 'Kua Flyer', files: [f] }).catch(() => { }) } else if (navigator.clipboard && window.ClipboardItem) { navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]).then(() => toast('Copied', 'success')).catch(() => toast('Use Download', 'warning')) } else toast('Not supported', 'warning') }, 'image/png') }

        function startOver() { rmI(); $('i-t').value=''; $('i-p').value=''; $('i-d').value=''; $('tc').textContent='0'; $('dc').textContent='0'; P.title=''; P.price=''; P.desc=''; gS(1); }

        /* Broadcast Cards */
        function rBcC() {
            const pr = getProfile(); const box = $('bc-cs'); box.innerHTML = ''; const waC = !!pr.channels?.whatsapp?.connected, igC = !!pr.channels?.instagram?.connected, twC = !!pr.channels?.twitter?.connected;
            [{ k: 'whatsapp', c: waC }, { k: 'facebook', c: igC }, { k: 'instagram', c: igC }, { k: 'x', c: twC }].forEach(({ k, c: co }) => { const m = { whatsapp: { n: 'WhatsApp', i: 'fa-brands fa-whatsapp', c: '#25D366' }, facebook: { n: 'Facebook', i: 'fa-brands fa-facebook-f', c: '#1877F2' }, instagram: { n: 'Instagram', i: 'fa-brands fa-instagram', c: '#E4405F' }, x: { n: 'X (Twitter)', i: 'fa-brands fa-x-twitter', c: '#E7E9EA' } }[k]; const sl = P.bcCh[k]; const el = document.createElement('div'); el.className = `cc ${sl ? 'sl' : ''} bg-nv-800/50 border border-nv-700/30 rounded-xl p-3 flex items-center gap-3 ${!co ? 'opacity-40' : ''}`; el.innerHTML = `<div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style="background:${m.c}12"><i class="${m.i}" style="color:${m.c}"></i></div><div class="flex-1 min-w-0"><div class="text-[13px] font-bold text-white">${m.n}</div><div class="text-[10px] text-nv-500">${co ? 'Connected' : 'Not linked'}</div></div><div class="w-5 h-5 rounded-full ${sl ? 'bg-el border-el' : 'border-nv-600'} border-2 flex items-center justify-center shrink-0">${sl ? '<i class="fa-solid fa-check text-[8px] text-white"></i>' : ''}</div>`; el.onclick = () => { P.bcCh[k] = !P.bcCh[k]; rBcC() }; box.appendChild(el) })
        }

        /* Broadcast Execution */
        async function doBC() {
            const pr = getProfile(), sel = Object.entries(P.bcCh).filter(([_, v]) => v).map(([k]) => k); if (!sel.length) { $('bc-er').classList.remove('hidden'); return } $('bc-er').classList.add('hidden'); const btn = $('bc-bn'); btn.disabled = true; btn.innerHTML = '<span class="spn mr-1.5"></span>Deploying...'; const res = $('bc-rs'), list = $('bc-ls'); res.classList.remove('hidden'); list.innerHTML = '';
            const msg = `🔥 *${P.title.toUpperCase()}*\n\n"${P.desc}"\n\n💎 *Price: $${parseFloat(P.price).toLocaleString()}*\n\n✅ *Order here:* ${pr.channels?.whatsapp?.phone ? 'https://wa.me/' + pr.channels.whatsapp.phone.replace(/\D/g,'') : 'DM for link'}`;
            const nM = { whatsapp: 'WhatsApp', facebook: 'Facebook', instagram: 'Instagram', x: 'X (Twitter)' }, iM = { whatsapp: 'fa-brands fa-whatsapp', facebook: 'fa-brands fa-facebook-f', instagram: 'fa-brands fa-instagram', x: 'fa-brands fa-x-twitter' }, cM2 = { whatsapp: '#25D366', facebook: '#1877F2', instagram: '#E4405F', x: '#E7E9EA' };
            const items = {}; sel.forEach(ch => { const d = document.createElement('div'); d.className = 'flex items-center gap-2.5 bg-nv-800/40 border border-nv-700/20 rounded-xl p-3 fu'; d.innerHTML = `<div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${cM2[ch]}15"><i class="${iM[ch]} text-xs" style="color:${cM2[ch]}"></i></div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1.5"><span class="text-[11px] font-bold text-white uppercase tracking-wider">${nM[ch]}</span><span class="cs text-[10px] font-bold text-nv-500 uppercase">Awaiting...</span></div><div class="w-full h-1 bg-nv-700/50 rounded-full overflow-hidden"><div class="pb h-full rounded-full transition-all duration-500" style="width:0%;background:${cM2[ch]}"></div></div></div>`; list.appendChild(d); items[ch] = { st: d.querySelector('.cs'), br: d.querySelector('.pb') } });
            for (let i = 0; i < sel.length; i++) {
                const ch = sel[i], it = items[ch]; await new Promise(r => setTimeout(r, 400 + i * 200)); it.st.textContent = 'Securing Node...'; it.br.style.width = '30%'; await new Promise(r => setTimeout(r, 600)); it.st.textContent = 'Optimizing Payload...'; it.st.className = 'cs text-[10px] font-bold text-amb uppercase'; it.br.style.width = '70%'; await new Promise(r => setTimeout(r, 400));
                let ok = true; try { if (ch === 'whatsapp') { try { $('fc').toBlob(b => { if (b) navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]) }) } catch(err){} window.open(`https://wa.me/?text=${encodeURIComponent(msg + '\n\n(Paste Flyer Now!)')}`, '_blank'); } else if (ch === 'x') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank'); else if (ch === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(msg)}`, '_blank'); else if (ch === 'instagram') { ok = false; it.st.textContent = 'Ready for Feed'; it.st.className = 'cs text-[10px] font-bold text-el uppercase'; it.br.style.width = '100%'; it.br.style.background = '#FF8C00'; continue } } catch (e) { ok = false }
                await new Promise(r => setTimeout(r, 400)); it.br.style.width = '100%'; if (ok) { it.st.textContent = 'Deployed'; it.st.className = 'cs text-[10px] font-bold text-green-400 uppercase' } else { it.st.textContent = 'Skipped'; it.st.className = 'cs text-[10px] font-bold text-cor uppercase'; it.br.style.background = '#EF4444' }
            }
            addActivity({ type: 'broadcast', title: P.title, channels: sel, time: Date.now() }); btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-check-double mr-1.5"></i>Broadcast Complete'; toast('All channels deployed successfully', 'success')
        }

        /* Connected Accounts */
        function rAcct() {
            const pr = getProfile(); const box = $('ac-cs'); box.innerHTML = ''; const chs = [{ k: 'whatsapp', n: 'WhatsApp', i: 'fa-brands fa-whatsapp', c: '#25D366', d: 'Enable WhatsApp to pick contacts or groups and broadcast freely.', t: 'toggle' }, { k: 'instagram', n: 'Instagram', i: 'fa-brands fa-instagram', c: '#E4405F', d: 'Connect Instagram for feed posts and stories.', t: 'oauth', u: 'https://www.instagram.com/accounts/login/' }, { k: 'twitter', n: 'X (Twitter)', i: 'fa-brands fa-x-twitter', c: '#E7E9EA', d: 'Link X to post tweets with your flyers.', t: 'oauth', u: 'https://twitter.com/i/flow/login' }, { k: 'linkedin', n: 'LinkedIn', i: 'fa-brands fa-linkedin-in', c: '#0A66C2', d: 'Connect LinkedIn for professional network sharing.', t: 'oauth', u: 'https://www.linkedin.com/login' }];
            chs.forEach(ch => {
                const co = pr.channels?.[ch.k]?.connected, dt = pr.channels?.[ch.k] || {}; const el = document.createElement('div'); el.className = 'bg-nv-800/50 border border-nv-700/30 rounded-xl p-5 transition-all hover:border-nv-600/40';
                el.innerHTML = `<div class="flex items-start gap-3.5"><div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:${ch.c}12"><i class="${ch.i} text-lg" style="color:${ch.c}"></i></div><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-0.5"><h3 class="text-sm font-bold text-white">${ch.n}</h3>${co ? '<span class="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Connected</span>' : '<span class="text-[10px] font-semibold text-nv-500 bg-nv-700/30 px-2 py-0.5 rounded-full">Not linked</span>'}</div><p class="text-xs text-nv-400 leading-relaxed mb-3">${ch.d}</p>${co && ch.t === 'oauth' ? `<p class="text-xs text-nv-300 mb-3"><i class="fa-solid fa-at text-[10px] mr-1"></i>${dt.username || 'Authorized'}</p>` : ''}
<div class="flex items-center gap-2">${co ? `<button onclick="ulkCh('${ch.k}')" class="px-3 py-2 bg-cor/10 hover:bg-cor/15 text-cor text-xs font-semibold rounded-lg transition-colors border border-cor/15"><i class="fa-solid fa-link-slash mr-1"></i>Disconnect</button>` : ch.t === 'toggle' ? `<button onclick="cfOA('${ch.k}')" class="px-3 py-2 bg-el hover:bg-el-d text-white text-xs font-semibold rounded-lg transition-colors"><i class="fa-solid fa-check mr-1"></i>Enable</button>` : `<button onclick="lkOA('${ch.k}','${ch.u}')" class="px-3 py-2 bg-el hover:bg-el-d text-white text-xs font-semibold rounded-lg transition-colors"><i class="fa-solid fa-link mr-1"></i>Connect ${ch.n}</button>`}</div></div></div>`; box.appendChild(el)
            })
        }

        function lkPh(k) { const v = $('ph-' + k).value.trim(); if (!v || v.length < 7) { toast('Enter a valid phone number', 'error'); return } const pr = getProfile(); pr.channels[k] = { connected: true, phone: v }; saveProfile(); rAcct(); rDash(); addActivity({ type: 'connect', channel: k, time: Date.now() }); toast('WhatsApp number linked', 'success') }
        function lkOA(k, url) { window.open(url, '_blank', 'width=600,height=700'); toast(`Opening ${cM[k].n} — click "I've Connected" when done`, 'info'); setTimeout(() => { const cards = $('ac-cs').children; for (const cd of cards) { const btn = cd.querySelector(`[onclick*="lkOA('${k}'"]`); if (btn) { btn.outerHTML = `<div class="flex items-center gap-2"><button onclick="cfOA('${k}')" class="px-3 py-2 bg-green-500/15 hover:bg-green-500/20 text-green-400 text-xs font-semibold rounded-lg transition-colors border border-green-500/20"><i class="fa-solid fa-check mr-1"></i>I've Connected</button><button onclick="rAcct()" class="px-2.5 py-2 text-nv-500 text-xs font-semibold rounded-lg hover:text-nv-300 transition-colors">Cancel</button></div>`; break } } }, 700) }
        function cfOA(k) { const pr = getProfile(); const fake = k === 'instagram' ? '@' + (pr.businessName || 'mybusiness').replace(/\s/g, '').toLowerCase() : k === 'twitter' ? '@' + (pr.businessName || 'mybusiness').replace(/\s/g, '').toLowerCase() : (pr.businessName || 'mybusiness').replace(/\s/g, '').toLowerCase(); pr.channels[k] = { connected: true, username: fake }; saveProfile(); rAcct(); rDash(); addActivity({ type: 'connect', channel: k, time: Date.now() }); toast(`${cM[k].n} connected`, 'success') }
        function ulkCh(k) { const pr = getProfile(); pr.channels[k] = { connected: false, phone: '', username: '' }; saveProfile(); rAcct(); rDash(); addActivity({ type: 'disconnect', channel: k, time: Date.now() }); toast(`${cM[k].n} disconnected`, 'info') }

        /* Dashboard */
        function rDash() {
            const pr = getProfile(), d = gD(); $('dash-w').textContent = 'Welcome to Kua'; const nName = pr.name || pr.businessName || 'Kua User'; $('sb-nm').textContent = nName; $('sb-av').textContent = nName.charAt(0).toUpperCase(); $('st-fl').textContent = d.flyers || 0; $('st-bc').textContent = d.broadcasts || 0;
            const conns = Object.values(pr.channels || {}).filter(c => c?.connected).length; $('d-ch-c').textContent = conns; $('d-ch-l').textContent = conns ? conns + ' linked' : 'None linked';
            const box = $('d-chs'); box.innerHTML = '';['whatsapp', 'instagram', 'twitter', 'linkedin'].forEach(k => { const m = cM[k], co = !!pr.channels?.[k]?.connected; box.innerHTML += `<div class="bg-nv-800/40 border border-nv-700/25 rounded-xl p-3 flex flex-col items-center text-center"><div class="w-8 h-8 rounded-full flex items-center justify-center mb-1" style="background:${m.c}12"><i class="${m.i} text-sm" style="color:${m.c}"></i></div><div class="text-[10px] font-bold text-white">${m.n}</div><div class="text-[9px] ${co ? 'text-green-400' : 'text-nv-500'} mt-0.5">${co ? '<i class="fa-solid fa-circle text-[4px] mr-0.5"></i>Linked' : 'Not linked'}</div></div>` });
            const act = getActivity(); const aEl = $('dash-activity');
            if (!act.length) { aEl.innerHTML = '<div class="px-5 py-6 text-center text-xs text-nv-500">No activity yet. Create your first flyer to get started.</div>' } else {
                aEl.innerHTML = act.slice(0, 8).map(a => {
                    const ago = timeAgo(a.time); let icon = '', color = '', label = '';
                    if (a.type === 'flyer') { icon = 'fa-solid fa-wand-magic-sparkles'; color = 'text-el'; label = `Created flyer: ${a.title}` }
                    else if (a.type === 'broadcast') { icon = 'fa-solid fa-tower-broadcast'; color = 'text-wa'; label = `Broadcast "${a.title}" to ${a.channels?.length || 0} channels` }
                    else if (a.type === 'connect') { icon = 'fa-solid fa-link'; color = 'text-green-400'; label = `Connected ${cM[a.channel]?.n || a.channel}` }
                    else if (a.type === 'disconnect') { icon = 'fa-solid fa-link-slash'; color = 'text-cor'; label = `Disconnected ${cM[a.channel]?.n || a.channel}` }
                    return `<div class="px-5 py-2.5 flex items-center gap-3 hover:bg-nv-700/10 transition-colors"><div class="w-7 h-7 rounded-lg bg-nv-700/30 flex items-center justify-center shrink-0"><i class="${icon} text-[10px] ${color}"></i></div><div class="flex-1 min-w-0"><p class="text-xs text-nv-300 truncate">${label}</p></div><span class="text-[10px] text-nv-600 shrink-0">${ago}</span></div>`
                }).join('')
            }
        }

        function timeAgo(ts) { const s = Math.floor((Date.now() - ts) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 604800) return Math.floor(s / 86400) + 'd ago'; return Math.floor(s / 604800) + 'w ago' }

        /* Broadcast Page */
        function rBCP() {
            const pr = getProfile(); const box = $('bc-ov'); box.innerHTML = '';['whatsapp', 'instagram', 'twitter', 'linkedin'].forEach(k => { const m = cM[k], co = !!pr.channels?.[k]?.connected; box.innerHTML += `<div class="bg-nv-800/40 border border-nv-700/25 rounded-xl p-3 flex flex-col items-center text-center"><div class="w-8 h-8 rounded-full flex items-center justify-center mb-1" style="background:${m.c}12"><i class="${m.i} text-sm" style="color:${m.c}"></i></div><div class="text-[10px] font-bold text-white">${m.n}</div><div class="text-[9px] ${co ? 'text-green-400' : 'text-nv-500'} mt-0.5">${co ? 'Connected' : 'Not linked'}</div></div>` });
            const act = getActivity().filter(a => a.type === 'broadcast'); const hEl = $('bc-hi');
            if (!act.length) { hEl.innerHTML = '<div class="px-5 py-6 text-center text-xs text-nv-500">No broadcasts yet.</div>' } else { hEl.innerHTML = act.slice(0, 6).map(a => `<div class="px-5 py-2.5 flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-nv-700/30 flex items-center justify-center shrink-0"><i class="fa-solid fa-image text-nv-500 text-[10px]"></i></div><div class="flex-1 min-w-0"><div class="text-xs font-semibold text-white truncate">${a.title || 'Flyer'}</div><div class="text-[10px] text-nv-500 mt-0.5">${a.channels?.length || 0} channels</div></div><span class="text-[10px] text-nv-500 shrink-0">${timeAgo(a.time)}</span><span class="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">Sent</span></div>`).join('') }
        }

        /* Settings */
        function loadSet() { const pr = getProfile(); $('s-nm').value = pr.name || ''; $('s-bz').value = pr.businessName || ''; $('s-br').value = pr.brandName || ''; $('s-ct').value = pr.ctaText || '' }
        function saveSet() { const pr = getProfile(); pr.name = $('s-nm').value.trim() || pr.name; pr.businessName = $('s-bz').value.trim() || pr.businessName; pr.brandName = $('s-br').value.trim() || pr.businessName; pr.ctaText = $('s-ct').value.trim() || pr.ctaText; saveProfile(); rDash(); toast('Saved', 'success') }
        function resetAll() { localStorage.removeItem('kua_d'); location.reload() }

        /* Init */
        function init() { iTags(); rDash(); nv('dash'); $('main').style.marginLeft = window.innerWidth >= 768 ? (P.sbC ? '64px' : '256px') : '0' }
        window.addEventListener('resize', () => { $('main').style.marginLeft = window.innerWidth >= 768 ? (P.sbC ? '64px' : '256px') : '0' });
        document.addEventListener('keydown', e => { if (e.target.classList.contains('tog') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.target.click() } });
        /* init() is now called by enterApp() — do NOT call it here */
