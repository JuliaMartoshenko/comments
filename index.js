const buttonElement = document.getElementById('add-button');
const listElement = document.getElementById('list');
const inputNameElement = document.getElementById('name-input');
const inputTextElement = document.getElementById('text-input');
let comments = [];

//рендер данных
const renderComments = () => {
    const commentsHtml = comments.map((comment, index) => {
        return `<li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index=${index} class=${comment.isLiked ? "'like-button -active-like'" : "'like-button'"}></button>
          </div>
        </div>
  `
    }).join('');
    listElement.innerHTML = commentsHtml;
}

//Запрос данных из API
const getAPI = () => {
    fetch('https://webdev-hw-api.vercel.app/api/v1/yuliya-martoshenko/comments', {
        method: 'GET',
    })
        .then((response) => {
            return response;
        })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    id: comment.id,
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: comment.isLiked,
                }
            });
            renderComments();
            initButtonLikeListeners();
        })
}

//Обработка события при нажатии на кнопку лайк
const initButtonLikeListeners = () => {
    const likeButtonElements = document.querySelectorAll('.like-button');
    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener('click', () => {
            const index = likeButtonElement.dataset.index;
            comments[index].isLiked ? comments[index].likes-- : comments[index].likes++;
            comments[index].isLiked = !comments[index].isLiked;
            renderComments();
            initButtonLikeListeners();
        })
    }
}

//Включение и выключение кнопки "Написать"
const buttonDisable = () => {
    buttonElement.disabled = true;
    inputNameElement.addEventListener('input', () => {
        inputTextElement.addEventListener('input', () => {
            buttonElement.disabled = false;
        })
    })
}

getAPI();
buttonDisable();



//Обработка события при нажатии на кнопку Enter - добавление комментария
document.addEventListener('keyup', (e) => {
    if (e.code === 'Enter') {
        buttonElement.click();
    }
})

//Обработка события при нажатии на кнопку "Написать" - добавление комментария
buttonElement.addEventListener('click', () => {
    //buttonElement.disabled = true;
    //Отправка данных в API
    fetch("https://webdev-hw-api.vercel.app/api/v1/yuliya-martoshenko/comments", {
        method: "POST",
        body: JSON.stringify({
            name: inputNameElement.value,
            text: inputTextElement.value,
        })
    })
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            // получили данные и рендерим их в приложении
            tasks = responseData.comments;
            buttonElement.disabled = false;
            getAPI();
        });

    renderComments();
    initButtonLikeListeners();


    //очистка форм ввода
    inputNameElement.value = '';
    inputTextElement.value = '';
    buttonElement.disabled = true;
})