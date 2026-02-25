function sendmail() {
    let parms;
    try {
        parms = {
            Full_name: document.getElementById("name").value,
            date_of_birth: document.getElementById("dob").value,
            email_address: document.getElementById("email").value,
            ID_number: document.getElementById("number").value,
            curent_school: document.getElementById("address").value,
            school_level: document.getElementById("school").value,
            current_grade: document.getElementById("grade").value,
            average_grade: document.getElementById("average").value,
            bursary_type: document.getElementById("bursary").value,
            statement: document.getElementById("statement").value
        };
    } catch (e) {
        console.error('Form element missing or read error', e);
        alert('Form error: please ensure all fields are present. ' + e.message);
        return;
    }

    console.log('EmailJS send parameters:', parms);

    emailjs.send('service_ybuhb3g', 'template_1e4dzt7', parms)
        .then(function (response) {
            console.log('EmailJS response:', response);
            alert("Email sent successfully!");
            document.getElementById('bursaryForm')?.reset();
        })
        .catch(function (err) {
            console.error('EmailJS send error object:', err);
            // If the network request returned 200 but EmailJS reports an error, the error
            // object sometimes contains a `text` or `status` field. Log full object and show useful info.
            const msg = err && (err.text || err.statusText || err.status) ? (err.text || err.statusText || JSON.stringify(err)) : JSON.stringify(err);
            alert('Failed to send email: ' + msg);
        });
}