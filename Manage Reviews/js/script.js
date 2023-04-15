const reviewList = document.querySelector(".reviews-column");

let currentReviews = {};
let reviewIndexes = [];

const fetchQueue = async () => {
  const fetcher = await fetch(
    `https://cleopat-ac91a-default-rtdb.europe-west1.firebasedatabase.app/reviews.json`
  );
  const data = await fetcher.json();

  // Extract keys and store them in an array
  const keys = Object.keys(data);
  reviewIndexes = keys; // Array of keys

  currentReviews = data; // Original object with values

  reviewList.innerHTML = "";
  for (let i = 0; i < keys.length; i++) {
    reviewList.innerHTML += `<div class="review">
  <span>Naam:</span>
  <p>${data[keys[i]].name}</p>
  <span>Datum:</span>
  <p>${data[keys[i]].date}</p>
  <span>Sterren:</span>
  <p>${data[keys[i]].stars}</p>
  <span>Bericht:</span>
  <p>${data[keys[i]].story}</p>
  <div class="approve-box">
    <button class="cta approve" data-id="${
      keys[i]
    }"><i class="fa-solid approve fa-check" data-id="${keys[i]}"></i></button>
    <button class="cta reject" data-id="${
      keys[i]
    }"><i class="fa-solid reject fa-xmark" data-id="${keys[i]}"></i></button>
  </div>
</div>`;
  }
};
fetchQueue();

// const approveButtons = document.querySelectorAll(".approve");

// approveButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     alert("hi");
//     console.log(e.target.dataset);
//   });
// });
// const rejectButtons = document.querySelectorAll(".reject");

reviewList.addEventListener("click", async (e) => {
  if (e.target.classList[1] !== "approve" && e.target.classList[1] !== "reject")
    return;

  //Add review
  if (e.target.classList[1] === "approve") {
    //
    await updateApprovedDatabase(currentReviews);
    delete currentReviews[e.target.dataset.id];
    await updateDatabase(currentReviews);
    await fetchQueue();
    location.reload();
  }

  //Decline review
  if (e.target.classList[1] === "reject") {
    delete currentReviews[e.target.dataset.id];
    console.log("Filtered Reviews:", currentReviews);
    await updateDatabase(currentReviews);
    await fetchQueue();
    location.reload();
    //
  }
});

const updateDatabase = async (newList) => {
  fetch(
    `https://cleopat-ac91a-default-rtdb.europe-west1.firebasedatabase.app/reviews.json`,
    {
      method: "PUT",
      body: JSON.stringify(newList),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const updateApprovedDatabase = async (newList) => {
  fetch(
    `https://cleopat-ac91a-default-rtdb.europe-west1.firebasedatabase.app/approved.json`,
    {
      method: "POST",
      body: JSON.stringify(newList),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
