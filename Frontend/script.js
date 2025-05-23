const instruccode = document.getElementById('instructorcode').value;
        const lastname = document.getElementById('instructor_ln').value;
        const firstname = document.getElementById('instructor_fn').value;
        const middle = document.getElementById('instructor_mi').value;
        const email = document.getElementById('email').value;

        const params = {
            instructorcode: instruccode,
            instructor_ln: lastname, 
            instructor_fn: firstname,
            instructor_mi: middle,
            email: email,
        }

        const thisForm = document.getElementById('detailsForm');
            thisForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const response = await fetch('https://192.168.1.8:8086/api/Instructor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                })

                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));
            });