const serverUrl = "http://localhost:3000/character";
const cardsContainer = document.querySelector(".cards-container");
const nextPage = document.querySelector(".right-page");
const previousPage = document.querySelector(".left-page");
const aliveFilter = document.querySelector("#alive-radio");
const deadFilter = document.querySelector("#dead-radio");
const unknownFilter = document.querySelector("#unknown-radio");
const nameFilterInput = document.querySelector("#name-filter");
const clearFiltersBtn = document.querySelector(".filters-button");
const dataBtn = document.getElementById("add-data");
const submitBtn = document.getElementById("submit-btn");
const form = document.querySelector("form");
const formNameInput = document.getElementById("form-input-name");
const formOriginInput = document.getElementById("form-input-origin");
let page = 1;
let allCharacters = [];
let limitedCharacters = [];
const basicImg = "https://rickandmortyapi.com/api/character/avatar/3.jpeg";

const allData = async () => {
  const response = await fetch(serverUrl);
  const data = await response.json();
  allCharacters = data;
};

const removeData = async (id) => {
  try {
    await fetch(`${serverUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("error: ", err);
  }
};

const getDataFromSerever = async (filter = "") => {
  const response = await fetch(
    `${serverUrl}?_page=${page}&_per_page=5&${filter}`
  );
  const data = await response.json();
  limitedCharacters = data.data;
  displayCharacters(limitedCharacters);
};

nextPage.addEventListener("click", () => {
  if (allCharacters.length / page > 5 && limitedCharacters.length === 5) {
    page += 1;
    getDataFromSerever(getSelectedFilter());
  }
});

previousPage.addEventListener("click", () => {
  if (page > 1) {
    page -= 1;
    getDataFromSerever(getSelectedFilter());
  }
});

aliveFilter.addEventListener("change", () => {
  page = 1;
  getDataFromSerever(getSelectedFilter());
});

deadFilter.addEventListener("change", () => {
  page = 1;
  getDataFromSerever(getSelectedFilter());
});

unknownFilter.addEventListener("change", () => {
  page = 1;
  getDataFromSerever(getSelectedFilter());
});

nameFilterInput.addEventListener("input", () => {
  const filterValue = nameFilterInput.value.trim().toLowerCase();

  const filteredCharacters = allCharacters.filter((character) =>
    character.name.toLowerCase().includes(filterValue)
  );
  displayCharacters(filteredCharacters);

  if (filterValue === "") {
    displayCharacters(limitedCharacters);
  }
});

clearFiltersBtn.addEventListener("click", () => {
  unCheck();
});

const displayCharacters = (characters) => {
  cardsContainer.innerHTML = "";
  if (characters.length === 0) {
    displayNotFoundMessage();
  } else {
    characters.forEach(({ id, image, name, status, species }) => {
      createCard(id, image, name, status, species);
    });
    removeNotFoundMessage();
  }
};

submitBtn.addEventListener("click", (e) => {
  handleSubmit(e);
  alert("Created");
});

const handleSubmit = async (e) => {
  try {
    if (formNameInput.value !== "" && formOriginInput.value !== "") {
      e.preventDefault();
      const formData = new FormData(form);
      formData.append("image", basicImg);
      const data = await fetch(serverUrl);
      const response = await data.json();
      const id = response.length;
      formData.append("id", id + 1);
      const formProps = Object.fromEntries(formData);

      await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formProps),
      });
    }
  } catch (err) {
    console.log("error: ", err);
  }
};

const getSelectedFilter = () => {
  if (aliveFilter.checked) return "status=Alive";
  if (deadFilter.checked) return "status=Dead";
  if (unknownFilter.checked) return "status=unknown";
  return "";
};

const displayNotFoundMessage = () => {
  const notFoundDiv = document.createElement("div");
  notFoundDiv.className = "not-found-div";
  notFoundDiv.textContent = "No characters found, try changing filters";
  cardsContainer.appendChild(notFoundDiv);
};

const removeNotFoundMessage = () => {
  const notFoundDiv = document.querySelector(".not-found-div");
  if (notFoundDiv) {
    notFoundDiv.remove();
  }
};

const createCard = (id, img, name, status, origin) => {
  const card = document.createElement("div");
  card.className = "card";
  card.id = id;
  const removeBtn = document.createElement("button");

  removeBtn.addEventListener("click", async () => {
    await removeData(id);
    card.remove();
    alert("Deleted");
  });

  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "DISCARD";
  const imgOfCard = document.createElement("img");
  imgOfCard.src = img;
  const nameOfCard = document.createElement("h5");
  nameOfCard.innerHTML = name;
  const statusOfCard = document.createElement("span");
  statusOfCard.innerHTML = `Status: ${status}`;
  statusOfCard.className = "status";
  const originOfCard = document.createElement("span");
  originOfCard.innerHTML = `Origin: ${origin}`;
  cardsContainer.appendChild(card);
  card.appendChild(removeBtn);
  card.appendChild(imgOfCard);
  card.appendChild(nameOfCard);
  card.appendChild(statusOfCard);
  card.appendChild(originOfCard);
};

const unCheck = () => {
  const checkBoxes = document.querySelectorAll('input[type="radio"]');
  checkBoxes.forEach((checkbox) => (checkbox.checked = false));
  nameFilterInput.value = "";
  getDataFromSerever(getSelectedFilter());
};

getDataFromSerever();
allData();
