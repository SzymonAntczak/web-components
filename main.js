const notifications = document.querySelector("app-notifications");

document.addEventListener("fetchingError", ({ detail }) => {
  notifications.render(detail.message);
});

const loadMoreButton = document.querySelector("#load-more-btn");
const list = document.querySelector("app-list");

loadMoreButton.addEventListener("click", () => {
  list.fetchData();
});
