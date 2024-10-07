class AcademicCalendar {
    constructor(year) {
        this.year = year;
        this.events = {};
        this.holidays = {};
        this.remarks = {};
        this.initializeHolidays();
        this.academicMonths = {
            "preparation": [10],  // October only
            "continuous": [6, 7, 8, 9, 11, 12],  // June to September, November, December
            "exam": [1]  // January
        };
    }

    initializeHolidays() {
        this.holidays = {
            "2024-01-01": "New Year's Day",
            "2024-08-15": "Independence Day",
            "2024-10-02": "Gandhi Jayanti",
            "2024-12-25": "Christmas",
            "2024-11-14": "Diwali"
        };
    }

    addEvent(eventDate, eventName) {
        let eventDateString = eventDate.toISOString().split('T')[0];
        if (this.events[eventDateString]) {
            this.events[eventDateString].push(eventName);
        } else {
            this.events[eventDateString] = [eventName];
        }
    }

    addRemark() {
        const remarkDateInput = document.getElementById('remarkDateInput');
        const remarkInput = document.getElementById('remarkInput');

        const date = remarkDateInput.value;
        const remark = remarkInput.value;

        if (date && remark) {
            this.remarks[date] = remark;
            alert(`Remark added for ${date}: ${remark}`);
            remarkInput.value = '';  // Clear input
        } else {
            alert('Please enter a date and a remark.');
        }
    }

    getMonthType(month) {
        if (this.academicMonths.preparation.includes(month)) {
            return 'preparation';
        } else if (this.academicMonths.continuous.includes(month)) {
            return 'continuous';
        } else if (this.academicMonths.exam.includes(month)) {
            return 'exam';
        }
        return 'normal';
    }

    createCalendarElement(month) {
        let monthName = new Date(this.year, month - 1).toLocaleString('default', { month: 'long' });
        let firstDay = new Date(this.year, month - 1, 1);
        let lastDay = new Date(this.year, month, 0);
        let daysInMonth = lastDay.getDate();
        let dayOfWeek = firstDay.getDay();

        let cal = document.createElement('div');
        cal.classList.add('calendar-month');

        let monthTitle = document.createElement('h3');
        monthTitle.innerText = `${monthName} ${this.year}`;
        cal.appendChild(monthTitle);

        let table = document.createElement('table');
        table.classList.add('calendar-table');
        cal.appendChild(table);

        let daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        let headerRow = document.createElement('tr');
        daysOfWeek.forEach(day => {
            let th = document.createElement('th');
            th.innerText = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let week = document.createElement('tr');
        for (let i = 0; i < dayOfWeek; i++) {
            let emptyCell = document.createElement('td');
            emptyCell.classList.add('empty');
            week.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (dayOfWeek === 7) {
                table.appendChild(week);
                week = document.createElement('tr');
                dayOfWeek = 0;
            }

            let cell = document.createElement('td');
            cell.innerText = day;
            let eventDate = new Date(this.year, month - 1, day).toISOString().split('T')[0];
            let monthType = this.getMonthType(month);

            if (this.events[eventDate]) {
                cell.classList.add('event');
                cell.setAttribute('data-tooltip', this.events[eventDate].join(', '));
            } else if (this.holidays[eventDate]) {
                cell.classList.add('holiday');
                cell.setAttribute('data-tooltip', this.holidays[eventDate]);
            } else if (this.remarks[eventDate]) {
                cell.classList.add('remark');
                cell.setAttribute('data-tooltip', this.remarks[eventDate]);
            } else if (monthType === 'preparation') {
                cell.classList.add('preparation');
                cell.setAttribute('data-tooltip', 'Preparation Month');
            } else if (monthType === 'continuous') {
                cell.classList.add('academic');
                cell.setAttribute('data-tooltip', 'Continuous Academic Month');
            } else if (monthType === 'exam') {
                cell.classList.add('exam');
                cell.setAttribute('data-tooltip', 'Exam Month');
            }

            week.appendChild(cell);
            dayOfWeek++;
        }

        if (week.children.length > 0) {
            table.appendChild(week);
        }

        return cal;
    }

    displayMonth(month) {
        let calendarDiv = document.getElementById('calendar');
        let monthCalendar = this.createCalendarElement(month);
        calendarDiv.appendChild(monthCalendar);
    }

    searchDate() {
        const searchDateInput = document.getElementById('searchDateInput');
        const date = searchDateInput.value;

        if (date) {
            const eventDate = new Date(date).toISOString().split('T')[0];
            let message = `Events for ${date}:\n`;

            if (this.events[eventDate]) {
                message += `Events: ${this.events[eventDate].join(', ')}\n`;
            } else {
                message += 'No events found.\n';
            }

            if (this.holidays[eventDate]) {
                message += `Holiday: ${this.holidays[eventDate]}\n`;
            }

            if (this.remarks[eventDate]) {
                message += `Remark: ${this.remarks[eventDate]}\n`;
            }

            alert(message);
        } else {
            alert('Please enter a date to search.');
        }
    }

    getHolidays() {
        const holidayMonthSelect = document.getElementById('holidayMonthSelect');
        const month = parseInt(holidayMonthSelect.value);

        if (month) {
            const holidaysInMonth = Object.keys(this.holidays).filter(date => {
                return new Date(date).getMonth() + 1 === month;
            });

            if (holidaysInMonth.length > 0) {
                let message = `Holidays in month ${month}:\n`;
                holidaysInMonth.forEach(date => {
                    message += `${date}: ${this.holidays[date]}\n`;
                });
                alert(message);
            } else {
                alert('No holidays found for this month.');
            }
        } else {
            alert('Please select a month to find holidays.');
        }
    }

    init() {
        // Display calendar for all months
        this.academicMonths.preparation.concat(this.academicMonths.continuous, this.academicMonths.exam).forEach(month => {
            this.displayMonth(month);
        });

        // Add event listeners
        document.getElementById('remarkDateInput').addEventListener('change', () => this.addRemark());
    }
}

// Instantiate the calendar and initialize it
const academicCalendar = new AcademicCalendar(2024);
academicCalendar.init();

