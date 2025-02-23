document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recipeForm"); 

    if (!form) {
        console.error("Form 'recipeForm' not found!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload on form submission

        const formData = new FormData();
        formData.append("title", document.getElementById("title").value.trim());
        formData.append("ingredients", document.getElementById("ingredients").value.trim());
        formData.append("instructions", document.getElementById("instructions").value.trim());

        // Check if category exists
        const categoryElement = document.getElementById("category");
        const category = categoryElement ? categoryElement.value.trim() : "No Category";
        formData.append("category", category);

        // Check if an image is uploaded
        const imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // Retrieve authentication token
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authorized");
            return;
        }

        try {
            // Send recipe data to the server
            const response = await fetch("http://localhost:3000/api/recipes", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }, // Include authorization token
                body: formData 
            });

            const result = await response.json();
            
        
            if (response.ok) {
                alert("Recipe added successfully!");
                window.location.href = "dashboard.html";
            } else {
                alert("Error adding recipe: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("An error occurred while adding the recipe.");
        }
    });
});
