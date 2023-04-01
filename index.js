const buttonElement = document.getElementById('add-button');
const listElement = document.getElementById('list');
const inputNameElement = document.getElementById('name-input');
const inputTextElement = document.getElementById('text-input');
let comments = [];
const host = 'https://webdev-hw-api.vercel.app/api/v1/yuliya-martoshenko/comments'

const getDate = (date) => {
    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
    const newDate = new Date(date);
    return newDate.toLocaleString('ru-RU', options).replace(',', '');
};

//рендер данных
const renderComments = () => {
    const commentsHtml = comments.map((comment, index) => {
        return `<li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${getDate(comment.date)}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div>
            <button data-index=${index} class="delete-button" id="delete-button">Удалить</button>
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
    initButtonLikeListeners();
    initDeleteButtonListeners();
}

//Запрос данных из API
const getAPI = () => {
    fetch(host, {
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

//Обработка события при нажатии на кнопку "Удалить"
const initDeleteButtonListeners = () => {
    const deleteButtonElements = document.querySelectorAll('.delete-button');
    for (const deleteButtonElement of deleteButtonElements) {
        deleteButtonElement.addEventListener('click', () => {
            const id = deleteButtonElement.dataset.index;
            console.log(id);
            //Обращение к API для удаления
            // fetch(host + '/' + id, {
            //     method: "DELETE"
            // })
            // .then((response) => {
            //     return response.json()
            // .then((responseData) => {
            //         // получили данные и рендерим их в приложении
            //         comments = responseData.comments;
            //         renderComments();
            //     });
            // });

        })
    }

}


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
    fetch(host, {
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
            comments = responseData.comments;
            buttonElement.disabled = false;
            getAPI();
        });

    renderComments();
    initButtonLikeListeners();
    initDeleteButtonListeners();


    //очистка форм ввода
    inputNameElement.value = '';
    inputTextElement.value = '';
    buttonElement.disabled = true;
})