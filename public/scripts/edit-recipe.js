document.addEventListener("DOMContentLoaded", function () {
    console.log("edit-recipe.js loaded!"); 

    // Get recipe ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (!recipeId) {
        alert("Error: Recipe not found.");
        return;
    }

    // Fetch and load the current recipe data
    fetch(`/api/recipes/${recipeId}`)
        .then(response => response.json())
        .then(recipe => {
            console.log("Current recipe data:", recipe);

            // Populate form fields with existing recipe data
            document.getElementById("title").value = recipe.title;
            document.getElementById("ingredients").value = recipe.ingredients.join(", ");
            document.getElementById("instructions").value = recipe.instructions;
        })
        .catch(error => {
            console.error("Error loading recipe:", error);
            alert("Failed to load recipe data.");
        });

    // Handle form submission to update the recipe
    document.getElementById("editRecipeForm").addEventListener("submit", async function (event) {
        event.preventDefault(); 

        // Collect form data
        const formData = new FormData();
        formData.append("title", document.getElementById("title").value.trim());
        formData.append("ingredients", document.getElementById("ingredients").value.trim());
        formData.append("instructions", document.getElementById("instructions").value.trim());

        // Attach image file if selected
        const imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // Check for authentication token
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authorized!");
            return;
        }

        try {
            console.log("Sending data to the server...");
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}` // Attach authentication token
                },
                body: formData // Send updated recipe data
            });

            const result = await response.json();
            console.log("Server response:", result);

            // Handle response
            if (response.ok) {
                alert("Recipe updated successfully!");
                window.location.href = `recipe.html?id=${recipeId}`;
            } else {
                alert("Error updating recipe: " + result.message);
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
            alert("An error occurred while updating the recipe.");
        }
    });
});
