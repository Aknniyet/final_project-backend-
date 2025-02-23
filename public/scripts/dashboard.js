document.addEventListener("DOMContentLoaded", function () {
    let allRecipes = [];
    let favoriteRecipes = [];
    const role = localStorage.getItem("role");

    async function loadRecipes() {
        try {
            const response = await fetch("/api/recipes");
            if (!response.ok) throw new Error("Failed to fetch recipes");

            allRecipes = await response.json();
            displayRecipes(allRecipes);
            populateCategories(allRecipes);
            loadFavorites();
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    async function loadFavorites() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("/api/users/favorites", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) throw new Error("Failed to load favorites");

            favoriteRecipes = await response.json();
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    }

    function displayRecipes(recipes) {
        const recipeContainer = document.getElementById("recipeList");
        recipeContainer.innerHTML = "";
        if (recipes.length === 0) {
            recipeContainer.innerHTML = "<p>No recipes found.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const imageUrl = recipe.image ? `${recipe.image}` : "https://via.placeholder.com/300";
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            let buttons = `
                <button onclick="viewRecipe('${recipe._id}')">View More</button>
            `;

            if (role === "admin") {
                buttons += `
                    <button onclick="editRecipe('${recipe._id}')">Edit</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                `;
            } else {
                const isFavorite = favoriteRecipes.some(fav => fav._id === recipe._id);
                buttons += `
                    <button onclick="toggleFavorite('${recipe._id}', event)">${isFavorite ? "⭐ Unfavorite" : "⭐ Favorite"}</button>
                    <button onclick="toggleLike('${recipe._id}', event)" id="like-btn-${recipe._id}">❤️ Like (${recipe.likes ? recipe.likes.length : 0})</button>
                `;
            }

            recipeCard.innerHTML = `
                <img src="${imageUrl}" alt="Recipe Image">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                    <p><strong>Category:</strong> ${recipe.category || "No Category"}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                </div>
                <div class="buttons">${buttons}</div>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }

    function showFavorites() {
        const recipeContainer = document.getElementById("recipeList");
        recipeContainer.innerHTML = "";

        if (favoriteRecipes.length === 0) {
            recipeContainer.innerHTML = "<p>No favorite recipes.</p>";
            return;
        }

        favoriteRecipes.forEach(recipe => {
            const imageUrl = recipe.image ? `${recipe.image}` : "https://via.placeholder.com/300";
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            recipeCard.innerHTML = `
                <img src="${imageUrl}" alt="Recipe Image">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                    <p><strong>Category:</strong> ${recipe.category || "No Category"}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                </div>
                <div class="buttons">
                    <button onclick="viewRecipe('${recipe._id}')">View More</button>
                    <button onclick="toggleFavorite('${recipe._id}', event)">⭐ Unfavorite</button>
                </div>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }

    function filterRecipes() {
        const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
        const selectedCategory = document.getElementById("categoryFilter").value;

        let filteredRecipes = allRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchValue)
        );

        if (selectedCategory !== "All Categories") {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === selectedCategory);
        }

        displayRecipes(filteredRecipes);
    }

    function populateCategories(recipes) {
        const categoryFilter = document.getElementById("categoryFilter");
        const categories = ["All Categories", ...new Set(recipes.map(recipe => recipe.category).filter(Boolean))];

        categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join("");
    }

    document.getElementById("searchButton").addEventListener("click", filterRecipes);
    document.getElementById("searchInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            filterRecipes();
        }
    });

    document.getElementById("categoryFilter").addEventListener("change", filterRecipes);

    window.viewRecipe = function (id) {
        window.location.href = `recipe.html?id=${id}`;
    };

    window.editRecipe = function (id) {
        window.location.href = `edit-recipe.html?id=${id}`;
    };

    window.deleteRecipe = async function (id) {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        const token = localStorage.getItem("token");
        await fetch(`/api/recipes/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        alert("Recipe deleted!");
        loadRecipes();
    };

    async function toggleFavorite(recipeId, event) {
        if (event) event.preventDefault();
        try {
            console.log("Toggling favorite for recipe:", recipeId);

            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("/api/users/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ recipeId })
            });

            if (!response.ok) throw new Error("Failed to update favorites");

            loadRecipes();
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    }

    async function toggleLike(recipeId, event) {
        if (event) event.preventDefault();
        try {
            console.log("Toggling like for recipe:", recipeId);
    
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("User not logged in");
                return;
            }
    
            const userId = localStorage.getItem("userId");
            let likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || {};
    
            const userLiked = likedRecipes[recipeId] || false;
    
            const response = await fetch("/api/users/likes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ recipeId })
            });
    
            if (!response.ok) throw new Error("Failed to update likes");
    
            const data = await response.json();
            const likeButton = document.getElementById(`like-btn-${recipeId}`);
    
            if (userLiked) {
                delete likedRecipes[recipeId]; 
                data.likes.length--; 
            } else {
                likedRecipes[recipeId] = true; 
                data.likes.length++; 
            }
    
            localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
    
            if (likeButton) {
                likeButton.innerHTML = `❤️ ${userLiked ? "Like" : "Unlike"} (${data.likes.length})`;
            }
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    }
    
    
    
    if (role !== "admin") {
        document.getElementById("showFavorites").addEventListener("click", showFavorites);
    } else {
        document.getElementById("showFavorites").style.display = "none";
    }

    window.toggleFavorite = toggleFavorite;
    window.toggleLike = toggleLike;

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "index.html";
    });

    loadRecipes();
});
