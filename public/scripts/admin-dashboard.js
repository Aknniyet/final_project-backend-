document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Access Denied! Please log in.");
        window.location.href = "index.html";
    }

    try {
        const response = await fetch("/api/recipes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        // Convert response data to JSON format
        const recipes = await response.json();
        const recipeList = document.getElementById("recipeList");

        // Iterate over each recipe and dynamically create table rows
        recipes.forEach(recipe => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${recipe.title}</td>
                <td>
                    <button onclick="editRecipe('${recipe._id}')">Edit</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                </td>
            `;
            recipeList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
});

async function deleteRecipe(recipeId) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Recipe deleted!");
            window.location.reload();
        } else {
            alert("Failed to delete recipe.");
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
}

function editRecipe(recipeId) {
    window.location.href = `edit-recipe.html?id=${recipeId}`;
}
