const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const imageSection = document.getElementById("images");
const recipeSection = document.getElementById("recipe");
const resultText = document.getElementById("result");
const formSearch = document.getElementById("form");
const recipeTitle = document.getElementById("recipe-title");
const ingredientsSection = document.getElementById("ingredients");

recipeSection.innerHTML = ``;
imageSection.innerHTML = ``;
resultText.innerHTML = ``;

let ingredients = [];

async function getSearch(e) {
    recipeSection.innerHTML = ``;
    resultText.innerHTML = ``;
    imageSection.innerHTML = ``;
    e.preventDefault();
    const mealText = searchBar.value;

    if (!mealText) 
        return alert("Please enter the recipe name")

    searchBar.value = ``;
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealText}`);
    let data = await response.json();
        
    if (!data.meals) {
        return resultText.innerHTML = `The recipe for '${mealText} ' was not found`;
    }
     resultText.innerHTML = `<h2 id="result">Search results for '${mealText}'</h2>`

    data.meals.forEach(meal => {
        const newImage = document.createElement("div");
        newImage.classList.add("image");
        const mealid = document.createAttribute("mealid");
        mealid.value = meal.idMeal;
        newImage.setAttributeNode(mealid);
        newImage.innerHTML = `<img src="${meal.strMealThumb}" >
            <div class="food-text">${meal.strMeal}</div>
        `
        imageSection.appendChild(newImage);
    });
}


async function getMealById(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await response.json();
    const currentMeal = data.meals[0];

    //Get ingredients
    ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (currentMeal[`strIngredient${i}`])
          ingredients.push(`${currentMeal[`strIngredient${i}`]} - ${currentMeal[`strMeasure${i}`]}`);
        else break
    }

    console.log(ingredients)

    recipeSection.innerHTML = `
        <h1 class="recipe-title">${currentMeal.strMeal}</h1>
        <img src="${currentMeal.strMealThumb}" alt="">
        <div class="description" id="description">
            <p>${currentMeal.strCategory}</p>
            <p>${currentMeal.strArea}</p>
        </div>
            <div class="recipe-text" id="recipe-text">
                <p>${currentMeal.strInstructions}</p>
            </div>
            <h1>Ingredients</h1>
            <ul class="ingredients">
                ${ingredients.map(item => `<li class="ingredient">${item}</li>`)}
            </ul>
        </div>
    `
}

async function getRandomMeal() {
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    let data = await response.json();
    getMealById(data.meals[0].idMeal);

}

//Event Listeners
formSearch.addEventListener("submit", getSearch);
imageSection.addEventListener("click", async (e) => {
    const mealInfo = e.path.find(item => {
        return item.classList.contains("image");
    })
    if (mealInfo) {
       await getMealById(mealInfo.getAttribute("mealid"));
       recipeSection.scrollIntoView({ behavior: 'smooth' });
    }
})
randomBtn.addEventListener("click", getRandomMeal);