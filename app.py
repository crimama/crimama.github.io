from flask import Flask, request, jsonify
from itertools import permutations

app = Flask(__name__)

def check_strike_ball(guess, answer):
    strike = sum(g == a for g, a in zip(guess, answer))
    ball = 0
    for g in guess:
        if g in answer:
            ball += answer.count(g)
    ball -= strike
    return strike, ball

def generate_candidates():
    return [''.join(p) for p in permutations('0123456789', 3)]

def filter_candidates(candidates, guess, result):
    filtered = []
    for c in candidates:
        s, b = check_strike_ball(guess, c)
        if (s, b) == result:
            filtered.append(c)
    return filtered

# Initialize candidates globally
candidates = generate_candidates()

@app.route('/filter', methods=['POST'])
def filter_candidates_api():
    global candidates
    data = request.get_json()
    guess = data['guess']
    result = tuple(data['result'])
    candidates = filter_candidates(candidates, guess, result)
    
    if len(candidates) == 0:
        return jsonify({"message": "조건을 만족하는 후보가 없습니다.", "candidates": []})
    else:
        probability = 1 / len(candidates)
        return jsonify({
            "remaining_candidates": len(candidates),
            "candidates": candidates,
            "probability": probability
        })

@app.route('/reset', methods=['POST'])
def reset_candidates():
    global candidates
    candidates = generate_candidates()
    return jsonify({"message": "후보가 초기화되었습니다."})

if __name__ == '__main__':
    app.run(debug=True)
