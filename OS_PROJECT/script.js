document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('process-form');
    const processList = document.getElementById('list');
    const resultsTable = document.getElementById('results-table');
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

    // FCFS Scheduling
    function fcfsScheduling() {
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        processes.forEach(process => {
            const waitingTime = currentTime - process.arrivalTime;
            const turnaroundTime = waitingTime + process.burstTime;
            const completionTime = currentTime + process.burstTime;

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

    // SJF Scheduling
    function sjfScheduling() {
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        let sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        sortedProcesses.forEach(process => {
            const waitingTime = currentTime - process.arrivalTime;
            const turnaroundTime = waitingTime + process.burstTime;
            const completionTime = currentTime + process.burstTime;

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
        let remainingProcesses = [...processes];
        let processQueue = [];

        let resultHTML = '<table><tr><th>Process Name</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>';

        // Initialize remaining burst time
        remainingProcesses.forEach(p => {
            p.remainingBurstTime = p.burstTime;
        });

        while (remainingProcesses.length > 0) {
            remainingProcesses.forEach(process => {
                if (process.remainingBurstTime > 0) {
                    const timeSpent = Math.min(timeQuantum, process.remainingBurstTime);
                    process.remainingBurstTime -= timeSpent;
                    currentTime += timeSpent;

                    if (process.remainingBurstTime === 0) {
                        const waitingTime = currentTime - process.arrivalTime - process.burstTime;
                        const turnaroundTime = currentTime - process.arrivalTime;
                        totalWaitingTime += waitingTime;
                        totalTurnaroundTime += turnaroundTime;

                        resultHTML += `<tr>
                            <td>${process.processName}</td>
                            <td>${process.arrivalTime}</td>
                            <td>${process.burstTime}</td>
                            <td>${currentTime}</td>
                            <td>${turnaroundTime}</td>
                            <td>${waitingTime}</td>
                        </tr>`;
                    }
                }
            });
            remainingProcesses = remainingProcesses.filter(p => p.remainingBurstTime > 0);
        }

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
