const LEVELS = [
    { id: 1, title: 'ワインの基礎', description: 'ワインとは何か、赤・白・ロゼ・スパークリングの違いと製法の概要', icon: '🍷' },
    { id: 2, title: 'ブドウ品種 赤', description: 'カベルネ・ソーヴィニヨン、メルロー、ピノ・ノワール、シラーなど主要赤品種', icon: '🍇' },
    { id: 3, title: 'ブドウ品種 白', description: 'シャルドネ、ソーヴィニヨン・ブラン、リースリングなど主要白品種', icon: '🥂' },
    { id: 4, title: 'フランスワイン', description: 'ボルドー、ブルゴーニュ、シャンパーニュ、ローヌの特徴', icon: '🇫🇷' },
    { id: 5, title: '世界のワイン産地', description: 'イタリア、スペイン、アメリカ、オーストラリア、チリ、日本', icon: '🌍' },
    { id: 6, title: 'ワインの製造工程', description: '収穫、醸造、発酵、熟成、瓶詰めまでの流れ', icon: '🏭' },
    { id: 7, title: 'テイスティング技法', description: '外観、香り、味わい、テイスティングノートの書き方', icon: '👃' },
    { id: 8, title: 'ワインの選び方', description: 'ラベルの読み方、価格帯、シーン別の選び方', icon: '🏷️' },
    { id: 9, title: 'フードペアリング', description: '基本原則と赤・白・スパークリングとの食事相性', icon: '🍽️' },
    { id: 10, title: 'ワインの保存と管理', description: '温度管理、保管方法、デキャンタージュ、グラス選び', icon: '🌡️' },
    { id: 11, title: 'ワインの資格と検定', description: 'ソムリエ、ワインエキスパート、WSETの概要', icon: '📜' },
    { id: 12, title: 'ワインを楽しむライフスタイル', description: 'ワイナリー訪問、ホームパーティ、ワイン投資', icon: '🎉' }
];

const App = {
    progress: {},
    quizResults: {},

    init() {
        this.loadData();
        this.renderSidebar();
        this.showDashboard();
        this.updateGlobalProgress();
        if (localStorage.getItem('wine-darkmode') === 'true') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    },

    loadData() {
        try { this.progress = JSON.parse(localStorage.getItem('wine-progress')) || {}; } catch(e) { this.progress = {}; }
        try { this.quizResults = JSON.parse(localStorage.getItem('wine-quiz-results')) || {}; } catch(e) { this.quizResults = {}; }
    },

    saveData() {
        localStorage.setItem('wine-progress', JSON.stringify(this.progress));
        localStorage.setItem('wine-quiz-results', JSON.stringify(this.quizResults));
    },

    renderSidebar() {
        const nav = document.getElementById('sidebarNav');
        nav.innerHTML = LEVELS.map(level => {
            const completed = this.quizResults[level.id] && this.quizResults[level.id].passed;
            return `<div class="sidebar-section">
                <div class="sidebar-item ${this.currentLevel === level.id ? 'active' : ''}" onclick="App.showModule(${level.id})">
                    <span class="sidebar-icon">${level.icon}</span>
                    <span>Lv.${level.id} ${level.title}</span>
                    ${completed ? '<span class="check-mark">✓</span>' : ''}
                </div>
            </div>`;
        }).join('');
    },

    showDashboard() {
        this.currentLevel = null;
        this.hideAllViews();
        document.getElementById('dashboardView').style.display = 'block';

        const completedCount = LEVELS.filter(l => this.quizResults[l.id] && this.quizResults[l.id].passed).length;
        const totalModules = LEVELS.length;

        document.getElementById('dashboardView').innerHTML = `
            <div class="dashboard-hero fade-in">
                <h2>ワイン Academy へようこそ</h2>
                <p>ブドウ品種から産地、テイスティング、ペアリングまでワインの世界を体系的に学べるプラットフォームです。</p>
                <div class="dashboard-stats">
                    <div class="dashboard-stat"><div class="dashboard-stat-value">${completedCount}</div><div class="dashboard-stat-label">完了レベル</div></div>
                    <div class="dashboard-stat"><div class="dashboard-stat-value">${totalModules}</div><div class="dashboard-stat-label">全レベル</div></div>
                    <div class="dashboard-stat"><div class="dashboard-stat-value">${totalModules > 0 ? Math.round(completedCount / totalModules * 100) : 0}%</div><div class="dashboard-stat-label">達成率</div></div>
                </div>
            </div>
            <div class="dashboard-grid">
                ${LEVELS.map(level => {
                    const passed = this.quizResults[level.id] && this.quizResults[level.id].passed;
                    const read = this.progress[level.id];
                    let status = '未着手';
                    let prog = 0;
                    if (passed) { status = '完了'; prog = 100; }
                    else if (read) { status = '学習中'; prog = 50; }
                    return `<div class="level-card level-${level.id} fade-in" onclick="App.showModule(${level.id})">
                        <div class="level-card-header">
                            <span class="level-card-number">Level ${level.id}</span>
                            <span class="level-card-status">${status}</span>
                        </div>
                        <h3>${level.icon} ${level.title}</h3>
                        <p>${level.description}</p>
                        <div class="level-card-progress"><div class="level-card-progress-fill" style="width:${prog}%"></div></div>
                    </div>`;
                }).join('')}
            </div>`;
        this.renderSidebar();
        this.closeSidebar();
    },

    showModule(levelId) {
        this.currentLevel = levelId;
        this.hideAllViews();
        document.getElementById('moduleView').style.display = 'block';

        const level = LEVELS.find(l => l.id === levelId);
        const data = window[`level${levelId}Data`];
        if (!data) return;

        this.progress[levelId] = true;
        this.saveData();

        document.getElementById('moduleView').innerHTML = `
            <div class="module-header fade-in">
                <div class="module-header-top">
                    <button class="module-back" onclick="App.showDashboard()">←</button>
                    <span class="module-badge level-${levelId}"><span class="level-card-number" style="position:static;">Level ${levelId}</span></span>
                </div>
                <h2>${level.icon} ${level.title}</h2>
                <p>${level.description}</p>
            </div>
            <div class="module-body fade-in">${data.content}</div>
            <div class="module-nav fade-in">
                ${levelId > 1 ? `<button class="btn btn-secondary" onclick="App.showModule(${levelId - 1})">← 前のレベル</button>` : '<div></div>'}
                <button class="btn btn-quiz" onclick="App.startQuiz(${levelId})">クイズに挑戦</button>
                ${levelId < 12 ? `<button class="btn btn-secondary" onclick="App.showModule(${levelId + 1})">次のレベル →</button>` : '<div></div>'}
            </div>`;
        this.renderSidebar();
        this.closeSidebar();
        document.getElementById('mainContent').scrollTop = 0;
    },

    startQuiz(levelId) {
        this.currentLevel = levelId;
        this.hideAllViews();
        document.getElementById('quizView').style.display = 'block';
        const data = window[`level${levelId}Data`];
        if (!data) return;
        Quiz.start(levelId, data.quiz);
        this.closeSidebar();
        document.getElementById('mainContent').scrollTop = 0;
    },

    completeQuiz(levelId, score, total) {
        const passed = score >= Math.ceil(total * 0.7);
        this.quizResults[levelId] = { score, total, passed, date: new Date().toISOString() };
        this.saveData();
        this.updateGlobalProgress();
        this.renderSidebar();

        const pct = Math.round(score / total * 100);
        document.getElementById('modalContent').innerHTML = `
            <h2>${passed ? '合格！' : 'もう少し！'}</h2>
            <div class="score">${pct}%</div>
            <p class="score-label">${score} / ${total} 問正解</p>
            <p>${passed ? '素晴らしい！次のレベルに進みましょう。' : '70%以上で合格です。もう一度挑戦してみましょう。'}</p>
            <div style="margin-top:24px;">
                ${passed && levelId < 12 ? `<button class="btn btn-primary" onclick="App.closeModal();App.showModule(${levelId + 1})">次のレベルへ</button>` : ''}
                <button class="btn btn-secondary" onclick="App.closeModal();App.startQuiz(${levelId})">再挑戦</button>
                <button class="btn btn-secondary" onclick="App.closeModal();App.showDashboard()">ダッシュボード</button>
            </div>`;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    },

    hideAllViews() {
        ['dashboardView','moduleView','quizView','referenceView'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    },

    updateGlobalProgress() {
        const completed = LEVELS.filter(l => this.quizResults[l.id] && this.quizResults[l.id].passed).length;
        const pct = Math.round(completed / LEVELS.length * 100);
        const fill = document.getElementById('globalProgressFill');
        const text = document.getElementById('globalProgressText');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = pct + '% 完了';
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
    },

    toggleDarkMode() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
        localStorage.setItem('wine-darkmode', !isDark);
    },

    resetProgress() {
        if (confirm('全ての進捗をリセットしますか？')) {
            localStorage.removeItem('wine-progress');
            localStorage.removeItem('wine-quiz-results');
            this.progress = {};
            this.quizResults = {};
            this.updateGlobalProgress();
            this.showDashboard();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        App.closeSidebar();
    }
});