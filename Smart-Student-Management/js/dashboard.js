const STUDENTS_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/students";

async function loadDashboard() {
    try {
        const response = await fetch(STUDENTS_API);

        const students = await response.json();

        document.getElementById("totalStudents").innerText = students.length;
        document.getElementById("registrations").innerText = students.length;

        const recentBody = document.getElementById("recentStudentsBody");

        recentBody.innerHTML = "";

        students.slice(-5).reverse().forEach(student => {

            recentBody.innerHTML += `
                <tr>
                    <td>
                        <img src="${student.photo}" class="student-photo">
                    </td>
                    <td>${student.name}</td>
                    <td>${student.roll}</td>
                    <td>${student.department}</td>
                </tr>
            `;
        });

    } catch(error) {
        console.error("Dashboard Error:", error);
    }
}

loadDashboard();