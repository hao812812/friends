const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const friends = [];
let filteredFriends = []
const MOVIES_PER_PAGE = 24

const dataPanel = document.querySelector("#data-panel");
const searchFrom = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// 呈現朋友資訊

function showFriendList(id) {
  const name = document.querySelector(".modal-title");
  const age = document.querySelector("#age");
  const gender = document.querySelector("#gender");
  const region = document.querySelector("#region");
  const birthday = document.querySelector("#birthday");
  const mail = document.querySelector("#mail");
  const img = document.querySelector("#image");

  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data;
      name.textContent = `${data.name + data.surname}`;
      age.textContent = `Age : ${data.age}`;
      gender.textContent = `Gender : ${data.gender}`;
      region.textContent = `Region : ${data.region}`;
      birthday.textContent = `Birthday : ${data.birthday}`;
      mail.textContent = `Mail : ${data.email}`;
      img.innerHTML = `<img src="${data.avatar}" alt="avater" class='img-fluid'>`;
    })
    .catch(function (error) {
      console.log("error");
    });
}

// 呈現朋友列表
function friendList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `<div class="d-flex align-items-end flex-column m-2 card user-card">
    <div class=" card-img-overlay " data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
      <h5 class="user-title" data-id="${item.id}"> ${item.name} ${item.surname} </h5>
    </div>
    <div class=" mt-auto user-avatar-wrap " data-id="${item.id}">
      <img  class="user-avatar" src="${item.avatar}" alt="user-avatar">
    </div>
    
  </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

renderPaginator(12)

//分頁器
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  console.log(numberOfPage)
  let rawHTML = ''
  for (page = 0; page < numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page ='${page + 1}'>${page + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//每頁電影
function getFriendByPage(page) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

//換頁
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  friendList(getFriendByPage(page))
})


//搜尋朋友
searchFrom.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriends = friends.filter(function searchFriend(friend) {
    return (friend.name + friend.surname).toLowerCase().includes(keyword)
  })
  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filteredFriends.length)
  friendList(getFriendByPage(1))//讓每頁搜尋friends維持在12個
})


// 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {

  showFriendList(event.target.dataset.id);

})



//接收朋友API
axios
  .get(INDEX_URL)
  .then((response) => {
    for (const friend of response.data.results) {
      friends.push(friend);
    }
    renderPaginator(friends.length)
    friendList(getFriendByPage(1));
  })
  .catch((err) => console.log(err));