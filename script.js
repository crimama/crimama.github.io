let candidates = generateCandidates();
let history = [];

function generateCandidates() {
    // 모든 4자리 숫자 조합 생성
    const digits = '0123456789';
    const permutations = [];
    function permute(prefix, remaining) {
        if (prefix.length === 4) {
            permutations.push(prefix);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            permute(prefix + remaining[i], remaining.slice(0, i) + remaining.slice(i + 1));
        }
    }
    permute('', digits);
    return permutations;
}

function checkStrikeBall(guess, answer) {
    // strike와 ball 계산
    let strike = 0, ball = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === answer[i]) {
            strike++;
        } else if (answer.includes(guess[i])) {
            ball++;
        }
    }
    return [strike, ball];
}

function filterCandidates(guess, result) {
    candidates = candidates.filter(candidate => {
        const [strike, ball] = checkStrikeBall(guess, candidate);
        return strike === result[0] && ball === result[1];
    });
}

function submitGuess() {
    const guess = document.getElementById('guess').value;
    const strike = parseInt(document.getElementById('strike').value, 10);
    const ball = parseInt(document.getElementById('ball').value, 10);

    if (guess.length !== 4 || isNaN(strike) || isNaN(ball)) {
        alert("입력을 확인해주세요.");
        return;
    }

    // 히스토리 업데이트
    history.push({ guess, strike, ball });
    updateHistory();

    // 후보 필터링
    filterCandidates(guess, [strike, ball]);

    const output = document.getElementById('output');
    if (candidates.length === 0) {
        output.innerText = "조건을 만족하는 후보가 없습니다.";
    } else {
        const probability = (1 / candidates.length).toFixed(4);
        output.innerHTML = `
            <p>남은 후보 개수: ${candidates.length}</p>
            <p>후보 목록: ${candidates.join(', ')}</p>
            <p>확률: ${probability}</p>
        `;
    }
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // 이전 기록 초기화
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `Guess: ${entry.guess}, Strike: ${entry.strike}, Ball: ${entry.ball}`;
        historyList.appendChild(li);
    });
}

function resetCandidates() {
    candidates = generateCandidates();
    history = [];
    document.getElementById('output').innerText = "후보가 초기화되었습니다.";
    updateHistory();
}
