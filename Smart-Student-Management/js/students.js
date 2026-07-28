const STUDENTS_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/students";
const DELETE_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev";

function showLoader(){
    document.getElementById("loader").style.display="flex";
}

function hideLoader(){
    document.getElementById("loader").style.display="none";
}
async function loadStudents() {

    try {
        showLoader();

        const response = await fetch(STUDENTS_API);
        const students = await response.json();

        displayStudents(students);
        document.getElementById("studentCount").textContent = students.length;

        document.getElementById("searchInput").addEventListener("keyup", function () {

            const search = this.value.toLowerCase();

            const filteredStudents = students.filter(student =>
                student.name.toLowerCase().includes(search) ||
                student.roll.toLowerCase().includes(search) ||
                student.department.toLowerCase().includes(search)
            );

            displayStudents(filteredStudents);

        });

    } catch (error) {

        console.error("Error:", error);

    }
    finally {

    hideLoader();

}

}

function displayStudents(students) {

    const tableBody = document.getElementById("studentsBody");

    tableBody.innerHTML = "";

    if (students.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center; padding:40px;">
                <i class="fas fa-user-slash" style="font-size:50px;color:gray;"></i>
                <br><br>
                <strong>No Students Found</strong>
            </td>
        </tr>
    `;

    return;
}

    students.forEach(student => {

        tableBody.innerHTML += `
    <tr>
        <td><img src="${student.photo}" width="60"></td>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.department}</td>
        <td>
           <button class="view-btn" onclick="viewStudent('${student.StudentId}')">
    <i class="fas fa-eye"></i>
</button>

<button class="edit-btn" onclick="editStudent('${student.StudentId}')">
    <i class="fas fa-pen"></i>
</button>

<button class="delete-btn" onclick="deleteStudent('${student.StudentId}')">
    <i class="fas fa-trash"></i>
</button>
        </td>
    </tr>
`;

    });

}

loadStudents();
document.getElementById("refreshBtn").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    loadStudents();
});
async function deleteStudent(studentId) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    try {
        showLoader();

        const response = await fetch(`${DELETE_API}/students/${studentId}`, {
            method: "DELETE"
        });

        console.log("Status:", response.status);

        const result = await response.json();

        showToast(result.message);

        loadStudents();

    } catch (error) {

        console.error("Delete Error:", error);
        showToast("Failed to delete student.","error");

    }finally {

    hideLoader();

}
}

function editStudent(studentId) {
    window.location.href = `register.html?id=${studentId}`;
}

function viewStudent(studentId) {

    fetch(STUDENTS_API)
        .then(response => response.json())
        .then(students => {

            const student = students.find(s => s.StudentId === studentId);

            if (!student) return;

            document.getElementById("modalPhoto").src = student.photo;
            document.getElementById("modalName").textContent = student.name;
            document.getElementById("modalRoll").textContent = student.roll;
            document.getElementById("modalDepartment").textContent = student.department;
            document.getElementById("modalEmail").textContent = student.email;
            document.getElementById("modalPhone").textContent = student.phone;

            document.getElementById("studentModal").style.display = "block";

        });

}

function closeModal() {
    document.getElementById("studentModal").style.display = "none";
}
window.onload = function () {
    showToast("Toast Test");
};


document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("exportPdfBtn")
    .addEventListener("click", exportPDF);
});

async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("landscape");


    const response = await fetch(STUDENTS_API);
    const students = await response.json();


    // Title
    doc.setFontSize(20);
    doc.text(
        "SMART STUDENT MANAGEMENT SYSTEM",
        148,
        20,
        { align:"center" }
    );


    doc.setFontSize(13);
    doc.text(
        "Student Records Report",
        148,
        30,
        { align:"center" }
    );


    doc.setFontSize(10);
    doc.text(
        "Generated: " + new Date().toLocaleString(),
        148,
        38,
        {align:"center"}
    );


    const rows = students.map((student,index)=>[
        index+1,
        student.name || "-",
        student.roll || "-",
        student.department || "-",
        student.phone || "-"
    ]);


    doc.autoTable({

        startY:50,

        head:[
            [
                "S.No",
                "Student Name",
                "Roll No",
                "Department",
                "Phone"
            ]
        ],

        body:rows,


        theme:"grid",


        styles:{
            fontSize:10,
            cellPadding:5,
            halign:"center"
        },


        headStyles:{
            fillColor:[30,58,138],
            textColor:255,
            fontStyle:"bold"
        },


        alternateRowStyles:{
            fillColor:[240,240,240]
        }

    });



    let finalY = doc.lastAutoTable.finalY + 15;


    doc.setFontSize(11);

    doc.text(
        "Total Students: " + students.length,
        15,
        finalY
    );


    doc.setFontSize(10);

    doc.text(
        "Powered by AWS Cloud | Developed by Sadhana Sahani",
        148,
        200,
        {align:"center"}
    );


    doc.save(
        "Smart_Student_Records_Report.pdf"
    );

}

doc.setFontSize(10);
doc.text(
"Powered by AWS Cloud | Developed by Sadhana Sahani",
148,
200,
{align:"center"}
);