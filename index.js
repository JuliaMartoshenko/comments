
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
const renderApp = () => {
    const appElement = document.getElementById('app');

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

    const appHtml = `<div class="container">
                <ul class="comments" id='list'>
                ${commentsHtml}
                </ul>
                <div class="add-form">
                <input
                    type="text"
                    class="add-form-name"
                    placeholder="Введите ваше имя"
                    id="name-input"
                />
                <textarea
                    type="textarea"
                    class="add-form-text"
                    placeholder="Введите ваш коментарий"
                    rows="4"
                    id="text-input"
                ></textarea>
                <div class="add-form-row">
                    <button class="add-form-button" id="add-button">Написать</button>
                </div>
                </div>
                </div>`

    appElement.innerHTML = appHtml;

    const buttonElement = document.getElementById('add-button');
    const inputNameElement = document.getElementById('name-input');
    const inputTextElement = document.getElementById('text-input');

    //Обработка события при нажатии на кнопку Enter - добавление комментария
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            buttonElement.click();
        }
    })

    //Обработка события при нажатии на кнопку "Написать" - добавление комментария
    buttonElement.addEventListener('click', () => {
        buttonElement.disabled = true;
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
    })
    //Обработка события при нажатии на кнопку лайк
    const initButtonLikeListeners = () => {
        const likeButtonElements = document.querySelectorAll('.like-button');
        for (const likeButtonElement of likeButtonElements) {
            likeButtonElement.addEventListener('click', () => {
                const index = likeButtonElement.dataset.index;
                comments[index].isLiked ? comments[index].likes-- : comments[index].likes++;
                comments[index].isLiked = !comments[index].isLiked;
                renderApp();
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
    initButtonLikeListeners();
    initDeleteButtonListeners()
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
            renderApp();
        })
}


getAPI();
renderApp();




