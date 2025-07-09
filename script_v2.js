
// 1. 예약된 좌석을 기록할 빈 리스트(배열)를 만듭니다.
// 이 배열이 데이터베이스 역할을 합니다. (⚠️ 새로고침 시 초기화됨)
// V2.0: Store reservations as objects to include more details.
const reservedReservations = [];

// Define seat attributes (simplified example)
// You would expand this based on your survey data and seat_layout.jpg
const seatAttributes = {
    1: { ac: true, wall: false, noise: 'medium' },
    2: { ac: true, wall: false, noise: 'medium' },
    3: { ac: true, wall: false, noise: 'medium' },
    4: { ac: true, wall: false, noise: 'medium' },
    5: { ac: true, wall: false, noise: 'medium' },
    6: { ac: true, wall: true, noise: 'low' },
    7: { ac: false, wall: true, noise: 'low' },
    8: { ac: false, wall: false, noise: 'medium' },
    9: { ac: false, wall: false, noise: 'medium' },
    10: { ac: false, wall: false, noise: 'medium' },
    11: { ac: false, wall: false, noise: 'medium' },
    12: { ac: false, wall: true, noise: 'low' },
    13: { ac: false, wall: true, noise: 'low' },
    14: { ac: false, wall: false, noise: 'medium' },
    15: { ac: false, wall: false, noise: 'medium' },
    16: { ac: false, wall: false, noise: 'medium' },
    17: { ac: false, wall: false, noise: 'medium' },
    18: { ac: false, wall: true, noise: 'low' },
    19: { ac: false, wall: true, noise: 'low' },
    20: { ac: false, wall: false, noise: 'high' },
    21: { ac: false, wall: false, noise: 'high' },
    22: { ac: false, wall: false, noise: 'high' },
    23: { ac: false, wall: false, noise: 'high' },
    24: { ac: false, wall: true, noise: 'medium' },
    25: { ac: false, wall: true, noise: 'low' },
    26: { ac: false, wall: true, noise: 'low' },
    // Large tables (27-32, 33-38, 39-40) - simplified attributes
    27: { ac: false, wall: false, noise: 'high' },
    28: { ac: false, wall: false, noise: 'high' },
    29: { ac: false, wall: false, noise: 'high' },
    30: { ac: false, wall: false, noise: 'high' },
    31: { ac: false, wall: false, noise: 'high' },
    32: { ac: false, wall: false, noise: 'high' },
    33: { ac: true, wall: false, noise: 'medium' },
    34: { ac: true, wall: false, noise: 'medium' },
    35: { ac: true, wall: false, noise: 'medium' },
    36: { ac: true, wall: false, noise: 'medium' },
    37: { ac: true, wall: false, noise: 'medium' },
    38: { ac: true, wall: false, noise: 'medium' },
    39: { ac: false, wall: true, noise: 'medium' },
    40: { ac: false, wall: true, noise: 'medium' },
};


// --- Reservation Function ---
function makeReservation() {
    const seatInput = document.getElementById('reserve-seat-number');
    const studentIdInput = document.getElementById('reserve-student-id');
    const nameInput = document.getElementById('reserve-student-name');
    const resultDiv = document.getElementById('reservation-results');

    const seat = seatInput.value.trim();
    const studentId = studentIdInput.value.trim();
    const name = nameInput.value.trim();

    // Basic validation
    if (!seat || !studentId || !name) {
        resultDiv.innerHTML = '<p style="color: red;">모든 정보를 정확하게 입력해주세요!</p>';
        return;
    }

    const seatNum = parseInt(seat);
    if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) {
        resultDiv.innerHTML = '<p style="color: red;">좌석 번호는 1부터 40 사이의 숫자로 입력해주세요.</p>';
        return;
    }

    // Check if seat is already reserved
    const isReserved = reservedReservations.some(reservation => reservation.seat === seatNum);
    if (isReserved) {
        resultDiv.innerHTML = `<p style="color: red;">죄송합니다. ${seatNum}번 좌석은 이미 예약된 자리입니다. 다른 좌석을 선택해주세요.</p>`;
        return;
    }

    // Check if the student already has a reservation
    const existingReservation = reservedReservations.find(reservation => reservation.id === studentId);
     if (existingReservation) {
         resultDiv.innerHTML = `<p style="color: red;">${studentId} 학번으로 이미 ${existingReservation.seat}번 좌석을 예약하셨습니다. 중복 예약은 불가합니다.</p>`;
         return;
     }


    // If not reserved, add the new reservation
    reservedReservations.push({
        seat: seatNum,
        id: studentId,
        name: name,
        timestamp: new Date() // Add a timestamp
    });

    // Display success message
    resultDiv.innerHTML = `
        <p style="color: green;">
            ✅ <strong>${name}(${studentId})</strong> 님,
            <strong>${seatNum}번</strong> 좌석 예약이 완료되었습니다.
        </p>
        <p style="font-size: 0.8em; color: #555;">
            (⚠️ 이 프로토타입은 새로고침 시 예약 정보가 초기화됩니다. 실제 시스템에서는 서버에 저장됩니다.)
        </p>
    `;

    // Clear input fields
    seatInput.value = '';
    studentIdInput.value = '';
    nameInput.value = '';

    // Update the list of current reservations
    updateReservedList();

    console.log("Current reservations:", reservedReservations);
}

// --- Cancellation Function ---
function cancelReservation() {
    const seatInput = document.getElementById('cancel-seat-number');
    const studentIdInput = document.getElementById('cancel-student-id');
    const resultDiv = document.getElementById('cancellation-results');

    const seat = seatInput.value.trim();
    const studentId = studentIdInput.value.trim();

    // Basic validation
    if (!seat || !studentId) {
        resultDiv.innerHTML = '<p style="color: red;">좌석 번호와 학번을 모두 입력해주세요.</p>';
        return;
    }

     const seatNum = parseInt(seat);
     if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) {
         resultDiv.innerHTML = '<p style="color: red;">유효한 좌석 번호를 입력해주세요.</p>';
         return;
     }


    // Find the reservation to cancel
    const index = reservedReservations.findIndex(reservation =>
        reservation.seat === seatNum && reservation.id === studentId
    );

    if (index !== -1) {
        // Reservation found, remove it
        const cancelledReservation = reservedReservations.splice(index, 1)[0];
        resultDiv.innerHTML = `<p style="color: blue;">✅ ${cancelledReservation.name}(${cancelledReservation.id}) 님의 ${cancelledReservation.seat}번 좌석 예약이 취소되었습니다.</p>`;

        // Clear input fields
        seatInput.value = '';
        studentIdInput.value = '';

        // Update the list of current reservations
        updateReservedList();

        console.log("Current reservations after cancellation:", reservedReservations);

    } else {
        // Reservation not found
        resultDiv.innerHTML = '<p style="color: red;">일치하는 예약 정보를 찾을 수 없습니다. 좌석 번호와 학번을 다시 확인해주세요.</p>';
    }
}

// --- Seat Recommendation Function ---
function recommendSeats() {
    const resultDiv = document.getElementById('recommendation-results');
    resultDiv.innerHTML = ''; // Clear previous results

    // 1. Get available seats
    const availableSeats = Object.keys(seatAttributes)
        .map(seatNumStr => parseInt(seatNumStr)) // Convert keys to numbers
        .filter(seatNum =>
            !reservedReservations.some(reservation => reservation.seat === seatNum)
        );

    if (availableSeats.length === 0) {
        resultDiv.innerHTML = '<p>현재 예약 가능한 좌석이 없습니다.</p>';
        console.log("No available seats for recommendation.");
        return; // Exit function if no seats are available
    }

    // 2. Get user preferences
    const prefAc = document.getElementById('pref-ac').checked;
    const prefWall = document.getElementById('pref-wall').checked;
    const prefQuiet = document.getElementById('pref-quiet').checked;

    const preferencesSelected = prefAc || prefWall || prefQuiet;

    const recommendedList = document.createElement('ul');
    const heading = document.createElement('p');

    if (preferencesSelected) {
        // 3. If preferences selected, score available seats
        const scoredSeats = availableSeats.map(seatNum => {
            const attrs = seatAttributes[seatNum];
            let score = 0;

            // Scoring logic
            if (prefAc && attrs.ac) score += 2;
            if (prefWall && attrs.wall) score += 2;
            if (prefQuiet && attrs.noise === 'low') score += 3; // Higher score for quiet

            // Deductions for conflicting preferences
             if (prefAc && !attrs.ac) score -= 1; // Slight penalty for not having AC if preferred
             if (prefWall && !attrs.wall) score -= 1; // Slight penalty for not being wall if preferred
            if (prefQuiet && (attrs.noise === 'medium' || attrs.noise === 'high')) score -= 2; // Strong penalty for noise if quiet is preferred


            // Add a small random factor to break ties and ensure some variation
            score += Math.random() * 0.5;

            return { seat: seatNum, score: score, attrs: attrs };
        });

        // Sort by score descending
        scoredSeats.sort((a, b) => b.score - a.score);

        // 4. Display top N recommended seats (e.g., top 5) with positive scores
        // Let's filter for seats with a score > 0 and take the top 5 from that filtered list.
         const positivelyScoredSeats = scoredSeats.filter(item => item.score > 0);
         const topRecommendations = positivelyScoredSeats.slice(0, 5);


        if (topRecommendations.length > 0) {
            heading.innerHTML = '<strong>✨ 추천 좌석 (선호도 반영):</strong>';
            resultDiv.appendChild(heading);

            topRecommendations.forEach(item => {
                const listItem = document.createElement('li');
                let detail = `${item.seat}번 (점수: ${item.score.toFixed(2)}`;
                 const attrs = seatAttributes[item.seat]; // Get attributes again for display
                 if (attrs) {
                    if (attrs.ac) detail += ', 에어컨 O';
                    if (attrs.wall) detail += ', 벽 O';
                    if (attrs.noise) detail += `, 소음: ${attrs.noise}`;
                 }
                 detail += ')';
                listItem.innerHTML = detail; // Use innerHTML as string contains HTML-like structure
                recommendedList.appendChild(listItem);
            });
            resultDiv.appendChild(recommendedList); // Append the list here!

        } else {
            // 5. If no seats got a positive score based on preferences, list general available seats as fallback
            heading.innerHTML = '<strong>💡 선택 조건에 맞는 최적의 좌석이 없습니다. 현재 빈 좌석:</strong>';
            resultDiv.appendChild(heading);
             // List some available seats as fallback (e.g., first 5 available regardless of score)
             const fallbackList = document.createElement('ul');
             availableSeats.slice(0, 5).forEach(seatNum => {
                  const listItem = document.createElement('li');
                  let detail = `${seatNum}번`;
                  const attrs = seatAttributes[seatNum]; // Get attributes for display
                  if (attrs) {
                      detail += ' (';
                      if (attrs.ac) detail += '에어컨 O, ';
                      if (attrs.wall) detail += '벽 O, ';
                      if (attrs.noise) detail += `소음: ${attrs.noise}`;
                      detail = detail.trim().replace(/,$/, '') + ')'; // Clean up trailing comma
                  }
                  listItem.textContent = detail; // Use textContent for plain text display
                  fallbackList.appendChild(listItem);
             });
             resultDiv.appendChild(fallbackList);
        }

    } else {
        // 6. If no preferences selected, just list available seats
        heading.innerHTML = '<strong>✅ 현재 예약 가능한 좌석:</strong>';
        resultDiv.appendChild(heading);

        const availableList = document.createElement('ul');
        availableSeats.slice(0, 10).forEach(seatNum => { // Show up to 10 available seats
            const listItem = document.createElement('li');
            let detail = `${seatNum}번`;
            const attrs = seatAttributes[seatNum]; // Get attributes for display
            if (attrs) {
                detail += ' (';
                if (attrs.ac) detail += '에어컨 O, ';
                if (attrs.wall) detail += '벽 O, ';
                if (attrs.noise) detail += `소음: ${attrs.noise}`;
                detail = detail.trim().replace(/,$/, '') + ')'; // Clean up trailing comma
            }
            listItem.textContent = detail; // Use textContent
            availableList.appendChild(listItem);
        });
        resultDiv.appendChild(availableList); // Append the list here!
    }

    console.log("Available Seats:", availableSeats);
    if (preferencesSelected) {
        console.log("Scored Seats (sorted):", scoredSeats);
    }
}


// --- Function to update the displayed list of reserved seats ---
function updateReservedList() {
    const reservedListUl = document.getElementById('reserved-list');
    reservedListUl.innerHTML = ''; // Clear current list

    if (reservedReservations.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = '현재 예약된 좌석이 없습니다.';
        reservedListUl.appendChild(listItem);
        return;
    }

    reservedReservations.forEach(reservation => {
        const listItem = document.createElement('li');
        listItem.textContent = `${reservation.seat}번: ${reservation.name} (${reservation.id})`;
        reservedListUl.appendChild(listItem);
    });
}

// Initial display of reserved seats (will be empty on first load)
updateReservedList();

// Note on QR code/No-show cancellation:
// The current JS prototype cannot implement automatic cancellation based on a real-world timer or QR scan.
// This would require a backend system to track reservation timestamps and integrate with an external QR scanning process.
// In your project report, you can explain this as a planned feature for a full implementation.