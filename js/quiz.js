const Quiz = {
    currentLevel: null,
    questions: [],
    currentQuestion: 0,
    score: 0,
    answered: false,

    start(levelId, questions) {
        this.currentLevel = levelId;
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.render();
    },

    render() {
        const container = document.getElementById('quizView');
        const q = this.questions[this.currentQuestion];
        const total = this.questions.length;

        container.innerHTML = `
            <div class="quiz-container fade-in">
                <div class="quiz-header">
                    <h2>Level ${this.currentLevel} クイズ</h2>
                    <div class="quiz-progress">
                        ${this.questions.map((_, i) => {
                            let cls = '';
                            if (i === this.currentQuestion) cls = 'active';
                            else if (i < this.currentQuestion) cls = 'answered';
                            return `<div class="quiz-dot ${cls}"></div>`;
                        }).join('')}
                    </div>
                    <p style="margin-top:12px;color:var(--text-secondary);">問題 ${this.currentQuestion + 1} / ${total}</p>
                </div>
                <div class="quiz-question">
                    <h3>${q.question}</h3>
                    <div class="quiz-options">
                        ${q.options.map((opt, i) => `
                            <button class="quiz-option" onclick="Quiz.answer(${i})" ${this.answered ? 'disabled' : ''}>
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div id="quizExplanation"></div>
                </div>
                <div class="quiz-actions">
                    ${this.answered ? `
                        <button class="btn btn-primary" onclick="Quiz.next()">
                            ${this.currentQuestion < total - 1 ? '次の問題 →' : '結果を見る'}
                        </button>
                    ` : ''}
                </div>
            </div>`;
    },

    answer(index) {
        if (this.answered) return;
        this.answered = true;

        const q = this.questions[this.currentQuestion];
        const correct = q.answer === index;
        if (correct) this.score++;

        const options = document.querySelectorAll('.quiz-option');
        options.forEach((opt, i) => {
            opt.disabled = true;
            if (i === q.answer) opt.classList.add('correct');
            if (i === index && !correct) opt.classList.add('incorrect');
        });

        const dots = document.querySelectorAll('.quiz-dot');
        if (dots[this.currentQuestion]) {
            dots[this.currentQuestion].classList.remove('active');
            dots[this.currentQuestion].classList.add(correct ? 'answered' : 'wrong');
        }

        document.getElementById('quizExplanation').innerHTML = `
            <div class="quiz-explanation">
                <strong>${correct ? '正解！' : '不正解'}</strong> ${q.explanation}
            </div>`;

        document.querySelector('.quiz-actions').innerHTML = `
            <button class="btn btn-primary" onclick="Quiz.next()">
                ${this.currentQuestion < this.questions.length - 1 ? '次の問題 →' : '結果を見る'}
            </button>`;
    },

    next() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.answered = false;
            this.render();
            document.getElementById('mainContent').scrollTop = 0;
        } else {
            App.completeQuiz(this.currentLevel, this.score, this.questions.length);
        }
    }
};