function submitGuess() {
    const guess = document.getElementById('guess').value;
    const strike = parseInt(document.getElementById('strike').value);
    const ball = parseInt(document.getElementById('ball').value);

    if (guess.length !== 3 || isNaN(strike) || isNaN(ball)) {
        alert("입력을 확인해주세요.");
        return;
    }

    fetch('/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess, result: [strike, ball] })
    })
    .then(response => response.json())
    .then(data => {
        const output = document.getElementById('output');
        if (data.message) {
            output.innerText = data.message;
        } else {
            output.innerHTML = `<p>남은 후보 개수: ${data.remaining_candidates}</p>`;
            output.innerHTML += `<p>후보 목록: ${data.candidates.join(', ')}</p>`;
            output.innerHTML += `<p>확률: ${data.probability.toFixed(4)}</p>`;
        }
    });
}

function resetCandidates() {
    fetch('/reset', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerText = data.message;
        });
}
