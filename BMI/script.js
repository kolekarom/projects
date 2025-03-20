
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to meters
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
  
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      alert('Please enter valid numbers!');
      return;
      
    }
  
    // Calculate BMI
    const bmi = (weight / (height * height)).toFixed(2);
    document.getElementById('bmi-result').textContent = `Your BMI: ${bmi}`;
  
    // Calculate body fat percentage (simplified formula)
    let bodyFat;
    if (gender === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    }
  
    bodyFat = bodyFat.toFixed(2);
    document.getElementById('bodyfat-result').textContent = `Your Body Fat Percentage: ${bodyFat}%`;
  
    // Render circular chart
    renderCircularGraph(bmi, bodyFat);
  }
  
  function renderCircularGraph(bmi, bodyFat) {
    const ctx = document.getElementById('bmiChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['BMI', 'Body Fat %'],
        datasets: [{
          label: 'Results',
          data: [bmi, bodyFat],
          backgroundColor: ['#4CAF50', '#FFC107'],
          hoverBackgroundColor: ['#388E3C', '#FFA000'],
          borderWidth: 2,
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.raw;
              }
            }
          }
        }
      }
    });
  }
  