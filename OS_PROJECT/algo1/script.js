document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('process-form');
    const processList = document.getElementById('list');
    const resultsTable = document.getElementById('results-table');
    const ganttChart = document.getElementById('gantt-chart');
    const algorithmSelect = document.getElementById('algorithm');
    const timeQuantumLabel = document.getElementById('time-quantum-label');
    const timeQuantumInput = document.getElementById('time-quantum');
    const processes = [];

    // Show/hide time quantum for RR
    algorithmSelect.addEventListener('change', () => {
        if (algorithmSelect.value === 'rr') {
            timeQuantumLabel.style.display = 'block';
            timeQuantumInput.style.display = 'block';
        } else {
            timeQuantumLabel.style.display = 'none';
            timeQuantumInput.style.display = 'none';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const processName = document.getElementById('process-name').value;
        const arrivalTime = parseInt(document.getElementById('arrival-time').value);
        const burstTime = parseInt(document.getElementById('burst-time').value);

        processes.push({ processName, arrivalTime, burstTime });
        updateProcessList();

        const selectedAlgorithm = algorithmSelect.value;
        if (selectedAlgorithm === 'fcfs') {
            fcfsScheduling();
        } else if (selectedAlgorithm === 'sjf') {
            sjfScheduling();
        } else if (selectedAlgorithm === 'rr') {
            const timeQuantum = parseInt(timeQuantumInput.value);
            rrScheduling(timeQuantum);
        }

        form.reset();
    });

    function updateProcessList() {
        processList.innerHTML = '';
        processes.forEach((process, index) => {
            const li = document.createElement('li');
            li.textContent = `Process ${index + 1}: ${process.processName}, Arrival: ${process.arrivalTime}, Burst: ${process.burstTime}`;
            processList.appendChild(li);
        });
    }

    function drawGanttChart(schedule) {
        ganttChart.innerHTML = '';
        schedule.forEach(process => {
            const div = document.createElement('div');
            div.classList.add('gantt-bar');
            div.style.width = `${process.burstTime * 20}px`;
            div.innerHTML = `
                ${process.processName} 
                <span>${process.startTime} - ${process.endTime}</span>
            `;
            ganttChart.appendChild(div);
        });
    }

    // FCFS Scheduling
    function fcfsScheduling() {
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        const schedule = [];

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        processes.forEach(process => {
            const waitingTime = currentTime - process.arrivalTime;
            const turnaroundTime = waitingTime + process.burstTime;
            const completionTime = currentTime + process.burstTime;

            schedule.push({ processName: process.processName, startTime: currentTime, endTime: completionTime, burstTime: process.burstTime });

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            resultHTML += `<tr>
                <td>${process.processName}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${completionTime}</td>
                <td>${turnaroundTime}</td>
                <td>${waitingTime}</td>
            </tr>`;

            currentTime += process.burstTime;
        });

        drawGanttChart(schedule);

        resultHTML += `<tr>
            <td colspan="5">Average Waiting Time</td>
            <td>${(totalWaitingTime / processes.length).toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5">Average Turnaround Time</td>
            <td>${(totalTurnaroundTime / processes.length).toFixed(2)}</td>
        </tr></table>`;

        resultsTable.innerHTML = resultHTML;
    }

    // SJF Scheduling (completed)
    function sjfScheduling() {
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        const schedule = [];

        let sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        sortedProcesses.forEach(process => {
            const waitingTime = Math.max(0, currentTime - process.arrivalTime);
            const turnaroundTime = waitingTime + process.burstTime;
            const completionTime = currentTime + process.burstTime;

            schedule.push({ processName: process.processName, startTime: currentTime, endTime: completionTime, burstTime: process.burstTime });

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            resultHTML += `<tr>
                <td>${process.processName}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${completionTime}</td>
                <td>${turnaroundTime}</td>
                <td>${waitingTime}</td>
            </tr>`;

            currentTime += process.burstTime;
        });

        drawGanttChart(schedule);

        resultHTML += `<tr>
            <td colspan="5">Average Waiting Time</td>
            <td>${(totalWaitingTime / sortedProcesses.length).toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5">Average Turnaround Time</td>
            <td>${(totalTurnaroundTime / sortedProcesses.length).toFixed(2)}</td>
        </tr></table>`;

        resultsTable.innerHTML = resultHTML;
    }

    // Round Robin Scheduling
    function rrScheduling(timeQuantum) {
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        const queue = [...processes];
        const schedule = [];

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        while (queue.length > 0) {
            const process = queue.shift();
            const timeSlice = Math.min(process.burstTime, timeQuantum);

            const waitingTime = Math.max(0, currentTime - process.arrivalTime);
            const completionTime = currentTime + timeSlice;
            const turnaroundTime = waitingTime + timeSlice;

            schedule.push({ processName: process.processName, startTime: currentTime, endTime: completionTime, burstTime: timeSlice });

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            resultHTML += `<tr>
                <td>${process.processName}</td>
                <td>${process.arrivalTime}</td>
                <td>${timeSlice}</td>
                <td>${completionTime}</td>
                <td>${turnaroundTime}</td>
                <td>${waitingTime}</td>
            </tr>`;

            currentTime += timeSlice;
            process.burstTime -= timeSlice;

            if (process.burstTime > 0) {
                queue.push(process);
            }
        }

        drawGanttChart(schedule);

        resultHTML += `<tr>
            <td colspan="5">Average Waiting Time</td>
            <td>${(totalWaitingTime / processes.length).toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5">Average Turnaround Time</td>
            <td>${(totalTurnaroundTime / processes.length).toFixed(2)}</td>
        </tr></table>`;

        resultsTable.innerHTML = resultHTML;
    }
});
