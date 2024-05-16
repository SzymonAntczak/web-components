const notifications = document.querySelector("app-notifications");

document.addEventListener("fetchingError", ({ detail }) => {
  notifications.render(detail.message);
});
