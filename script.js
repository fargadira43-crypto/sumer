        (function(){
            var root = document.getElementById('quiz_1792974055981');
            if (!root) return;
            var MSG = { loseTitle: 'You lost!', loseMessage: 'Wrong answer or time ran out. Try again!', winTitle: 'Correct! Well done!' };
            var total = parseInt(root.getAttribute('data-seconds'), 10) || 0;
            var panels = root.querySelectorAll('.quiz-q');
            if (!panels.length) return;
            var timerEl = root.querySelector('.quiz-timer');
            var progEl = root.querySelector('.quiz-progress');
            var result = root.querySelector('.quiz-result');
            var rTitle = result.querySelector('h3');
            var rText = result.querySelector('p');
            var retry = result.querySelector('.quiz-retry');
            var cur = 0, left = 0, tick = null, locked = false;
            function stop(){ if (tick) { clearInterval(tick); tick = null; } }
            function opts(){ return panels[cur].querySelectorAll('.quiz-option'); }
            function lock(){ locked = true; opts().forEach(function(o){ o.disabled = true; }); }
            function revealCorrect(){
                var c = parseInt(panels[cur].getAttribute('data-correct'), 10) || 0;
                var o = opts()[c];
                if (o) o.classList.add('correct');
            }
            function finish(kind, title, text){
                stop(); lock();
                result.className = 'quiz-result show ' + kind;
                rTitle.textContent = title;
                rText.textContent = text;
                retry.style.display = kind === 'lose' ? '' : 'none';
            }
            function renderTimer(){ if (timerEl) timerEl.textContent = '⏱ ' + left + 's'; }
            function startTimer(){
                stop();
                if (total <= 0) return;
                left = total; renderTimer();
                tick = setInterval(function(){
                    left--; renderTimer();
                    if (left <= 0) { revealCorrect(); finish('lose', MSG.loseTitle, MSG.loseMessage); }
                }, 1000);
            }
            function show(i){
                cur = i; locked = false;
                result.className = 'quiz-result';
                for (var k = 0; k < panels.length; k++) panels[k].style.display = (k === i) ? '' : 'none';
                opts().forEach(function(o){ o.disabled = false; o.classList.remove('correct', 'wrong'); });
                if (progEl) progEl.textContent = (i + 1) + ' / ' + panels.length;
                startTimer();
            }
            Array.prototype.forEach.call(panels, function(p){
                Array.prototype.forEach.call(p.querySelectorAll('.quiz-option'), function(o){
                    o.addEventListener('click', function(){
                        if (locked) return;
                        var c = parseInt(p.getAttribute('data-correct'), 10) || 0;
                        var i = parseInt(o.getAttribute('data-index'), 10);
                        if (i === c) {
                            o.classList.add('correct'); stop(); lock();
                            if (cur + 1 < panels.length) {
                                setTimeout(function(){ show(cur + 1); }, 700);
                            } else {
                                finish('win', MSG.winTitle, panels.length + ' / ' + panels.length);
                            }
                        } else {
                            o.classList.add('wrong'); revealCorrect();
                            finish('lose', MSG.loseTitle, MSG.loseMessage);
                        }
                    });
                });
            });
            retry.addEventListener('click', function(){ show(0); });
            show(0);
        })();

        (function(){
            var root = document.getElementById('slider_1792975169586');
            if (!root) return;
            var track = root.querySelector('.sl-track');
            var n = root.querySelectorAll('.sl-slide').length;
            if (!track || n === 0) return;
            var dots = root.querySelectorAll('.sl-dot');
            var prev = root.querySelector('.sl-prev');
            var next = root.querySelector('.sl-next');
            var auto = false;
            var delay = 3000;
            var idx = 0, timer = null;
            function show(i) {
                idx = (i + n) % n;
                track.style.transform = 'translateX(-' + (idx * 100) + '%)';
                for (var k = 0; k < dots.length; k++) dots[k].classList.toggle('active', k === idx);
            }
            function restart() {
                if (timer) clearInterval(timer);
                if (auto && n > 1) timer = setInterval(function(){ show(idx + 1); }, delay);
            }
            if (prev) prev.addEventListener('click', function(){ show(idx - 1); restart(); });
            if (next) next.addEventListener('click', function(){ show(idx + 1); restart(); });
            for (var d = 0; d < dots.length; d++) {
                (function(k){ dots[k].addEventListener('click', function(){ show(k); restart(); }); })(d);
            }
            var sx = null;
            root.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive: true});
            root.addEventListener('touchend', function(e){
                if (sx === null) return;
                var dx = e.changedTouches[0].clientX - sx;
                sx = null;
                if (Math.abs(dx) > 40) { show(dx < 0 ? idx + 1 : idx - 1); restart(); }
            });
            show(0);
            restart();
        })();
        (function(){
            var root = document.getElementById('store_1792975276621');
            if (!root) return;
            var search = root.querySelector('.store-search');
            var cards = root.querySelectorAll('.store-card');
            var modal = document.getElementById('store_1792975276621_modal');
            if (search) {
                search.addEventListener('input', function(){
                    var q = search.value.trim().toLowerCase();
                    cards.forEach(function(card){
                        var name = (card.getAttribute('data-name') || '').toLowerCase();
                        card.style.display = name.indexOf(q) !== -1 ? '' : 'none';
                    });
                });
            }
            cards.forEach(function(card){
                card.addEventListener('click', function(){
                    if (!modal) return;
                    var mImg = modal.querySelector('.store-modal-img'); var mSrc = card.getAttribute('data-img') || ''; mImg.alt = card.getAttribute('data-name') || ''; if (mSrc) { mImg.src = mSrc; mImg.classList.remove('no-img'); } else { mImg.removeAttribute('src'); mImg.classList.add('no-img'); }
                    modal.querySelector('.store-modal-title').textContent = card.getAttribute('data-name') || '';
                    modal.querySelector('.store-modal-price').textContent = card.getAttribute('data-price') || '';
                    modal.querySelector('.store-modal-desc').textContent = card.getAttribute('data-desc') || '';
                    var btn = modal.querySelector('.store-modal-btn');
                    btn.textContent = card.getAttribute('data-btntext') || 'Order Now';
                    btn.href = card.getAttribute('data-url') || '#';
                    modal.classList.add('open');
                });
            });
            if (modal) {
                modal.querySelector('.store-modal-close').addEventListener('click', function(){
                    modal.classList.remove('open');
                });
                modal.addEventListener('click', function(e){
                    if (e.target === modal) modal.classList.remove('open');
                });
            }
        })();
