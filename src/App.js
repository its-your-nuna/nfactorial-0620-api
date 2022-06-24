import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('0fbb9931fdc0180d30c59c2a8ec4626a8b50865d')


function App() {
  /*
  
    GET — получение ресурса
    POST — создание ресурса
    PUT — обновление ресурса
    DELETE — удаление ресурса

  */
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState('active')
  const [isdone,setDone]= useState([])
  const buttons = [
    {
      type: "active",
      label: "Active",
    },
    {
      type: "done",
      label: "Done",
    },
  ];
  const changevalue=()=>{
    api.reopenTask(5464358139)
    .then((isSuccess) => console.log(isSuccess))
    .catch((error) => console.log(error))

  };
  useEffect(() => {
    api.getTasks()
      .then((tasks) => {
        console.log(tasks)
        setItems(tasks)
      })
    getAllItems();
  
  }, []);


  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    api.addTask({
      content: itemToAdd,
    })
      .then((task) =>
        setItems([...items, task]))
      .catch((error) => console.log(error))
    setItemToAdd("");
  };


  const toggleItemDone = (item) => {

    const { id, done, task_id } = item
    console.log(id,done, task_id)

    if(filterType==='done'){

      api.reopenTask(task_id)
      .then((isSuccess) => 
      {
      setItems([...items, item]);
      setDone(isdone.filter((done) => {
        return (done.id !== id) 
      }))})
      .catch((error) => console.log(error))
    }else{
      api.closeTask(id)
      .then((isSuccess) => {
        if (isSuccess) {
          setItems(items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                done: !done
              }
            }
            return item
          }))
        }
        console.log(isSuccess)
      }
      )
      .catch((error) => console.log(error))
    }
   
  }



 

  const getAllItems = () => {
    axios.get('https://api.todoist.com/sync/v8/completed/get_all', {
      headers: {
        Authorization:
          "Bearer 0fbb9931fdc0180d30c59c2a8ec4626a8b50865d"
      }
    }).then((res)=>res.data)
    .then((res)=>{
      console.log(res.items)
      setDone(res.items)
    })
  }

  const handleFilterItems=(type)=>{
    setFilterType(type)
  }
  const filterItem= filterType==='active'?items:
  filterType==='done'?isdone:
  items.filter((item)=>!item.done)

  return (
    <div className="todo-app">
      App-header
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      <div className="btn-group">
        {buttons.map((item) => (
          <button onClick={() => handleFilterItems(item.type)}
            key={item.label}
            type="button"
            className={`btn btn-${filterType !== item.type ? "outline-" : ""
              }info`}>
            {item.label}
          </button>
        ))}

      </div>
      {/* List-group */}
      <ul className="list-group todo-list">

        {items.length > 0 ? (
          filterItem.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item && item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
// axios.get(`${api}`).then((response) => {
//       console.log(response.data);
//   })

/*Неоднократно при создании веб-приложения вам может понадобиться
 получать и отображать данные из API. наиболее популярным решением 
 является использование axios, основанного на Promise HTTP-клиента.
 Axios - очень популярная библиотека JavaScript, 
 которую вы можете использовать для выполнения HTTP-запросов */

/*API (Application programming interface) — это контракт, 
который предоставляет программа. «Ко мне можно обращаться 
так и так, я обязуюсь делать то и это».

Контракт включает в себя:
    саму операцию, которую мы можем выполнить,
    данные, которые поступают на вход,
    данные, которые оказываются на выходе (контент данных или сообщение об ошибке).
 */
/*

  1. data - тело ответа, предоставленное сервером.
   Если ответ сервера является JSON, Axios автоматически анализирует 
   данные в объект JavaScript.
  2.  status - код состояния HTTP из ответа, например 200 , 400 , 404 .
  3.  statusText - сообщение о статусе HTTP из ответа сервера, 
  например OK , Bad Request , Not Found .
  4. headers - заголовки HTTP, сопровождающие ответ.
  5.  config - конфигурация, предоставленная API Axios для запроса.
  6.  request - Собственный запрос, который сгенерировал ответ. 
  В Node.js это будет объект ClientRequest В браузере
   это будет объект XMLHTTPRequest
 */
