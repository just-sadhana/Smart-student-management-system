const REGISTER_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/register";
const UPLOAD_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/upload-url";
const STUDENTS_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/students";
const UPDATE_API = "https://fx2qmjbm0d.execute-api.ap-south-2.amazonaws.com/dev/students";

const studentId = new URLSearchParams(window.location.search).get("id");
function showLoader(){
    document.getElementById("loader").style.display="flex";
}

function hideLoader(){
    document.getElementById("loader").style.display="none";
}
let existingPhoto = "";

if (studentId) {

    fetch(STUDENTS_API)
        .then(res => res.json())
        .then(students => {

            const student = students.find(s => s.StudentId === studentId);

            if (!student) return;

            document.getElementById("studentName").value = student.name;
            document.getElementById("rollNo").value = student.roll;
            document.getElementById("department").value = student.department;
            document.getElementById("email").value = student.email;
            document.getElementById("phone").value = student.phone;

            existingPhoto = student.photo;

            document.getElementById("submitBtn").textContent = "Update Student";
            document.getElementById("formTitle").textContent = "Update Student";

        });

}

document.getElementById("studentForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    try {
        showLoader();

        const name = document.getElementById("studentName").value;
        const roll = document.getElementById("rollNo").value;
        const email = document.getElementById("email").value;
        const department = document.getElementById("department").value;
        const phone = document.getElementById("phone").value;

        let photoUrl = existingPhoto;

        // Upload a new photo only if one is selected
        const photoFile = document.getElementById("photo").files[0];

        if (photoFile) {

            const uploadResponse = await fetch(UPLOAD_API);
            const uploadData = await uploadResponse.json();

            await fetch(uploadData.uploadUrl, {
                method: "PUT",
                body: photoFile,
                headers: {
                    "Content-Type": photoFile.type
                }
            });

            photoUrl = uploadData.imageUrl;
        }

        let response;

        if (studentId) {

            // UPDATE STUDENT
            response = await fetch(`${UPDATE_API}/${studentId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    roll,
                    email,
                    department,
                    phone
                })

            });

        } else {

            // REGISTER NEW STUDENT
            response = await fetch(REGISTER_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    roll,
                    email,
                    department,
                    phone,
                    photo: photoUrl
                })

            });

        }

        const result = await response.json();

        alert(result.message);

        if (!studentId) {
            document.getElementById("studentForm").reset();
        } else {
            window.location.href = "students.html";
        }

    } catch (error) {

        console.error(error);
        showToast("Operation failed.", "error");

    }
    finally {
        hideLoader();
    }

});

document.getElementById("photo").addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

            const preview = document.getElementById("photoPreview");

            preview.src = e.target.result;
            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    }

});

       