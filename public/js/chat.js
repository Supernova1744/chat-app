const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("#messagesInput");
const $messageFormButton = $messageForm.querySelector("#submit");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const linkMessageTemplate = document.querySelector("#link-message-template")
  .innerHTML;
const sidebarTemplate = document.querySelector("#sidebarTemplate").innerHTML;
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHight = newMessageMargin + $newMessage.offsetHeight;
  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// getting message even
const socket = io();
socket.on("message", message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});
//getting link message
socket.on("linkMessage", message => {
  console.log(message);
  const html = Mustache.render(linkMessageTemplate, {
    message: message.url,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});
// get users
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});
// sending message event
$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  let message = e.target.elements.messagesInput.value;
  socket.emit("newMessageSent", message, err => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (err) return console.log(err);
    console.log("the message was delivered!");
  });
});
// sending location event
$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) return alert("not allowed");
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude
      },
      err => {
        if (err) return console.log(err);
        console.log("location sent");
      }
    );
  });
  $sendLocationButton.removeAttribute("disabled");
});

socket.emit("join", { username, room }, err => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});
