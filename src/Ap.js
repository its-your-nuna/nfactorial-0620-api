import "./App.css";
import {useState,useEffect} from 'react'
import {v4 as myId} from 'uuid'
import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('0fbb9931fdc0180d30c59c2a8ec4626a8b50865d')


// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: myId(),
    label: "Have fun",
  },
  {
    key: myId(),
    label: "Spread Empathy",
  },
  {
    key: myId(),
    label: "Generate Value",
  }
]

function App() {
  const[itemToDo,setItemToDo]=useState("")
  const[items,setItems]=useState(()=>{
    const saved = localStorage.getItem("items");
    const initialValue = JSON.parse(saved);
    return initialValue || toDoItems;
  })
  const [filterType,setFilterType]=useState('all')
  let [searching,setSearching]=useState("")
useEffect(() => {
  localStorage.setItem('items', JSON.stringify(items));
}, [items]);


  const addItem=()=>{
    api.addTask({
        content: itemToAdd,
    })
        .then((task) =>
        setItems([ ...items, task]))
        .catch((error) => console.log(error))
      setItemToAdd("");
    // const newItem={key:myId(),label:itemToDo}
    // setItems((prevItem)=>[newItem, ...prevItem])
    // setItemToDo("")
  }
  const handleItemImportant=({key})=>{
    setItems(()=>
    items.map((item)=>{
      if(item.key===key){
        return {...item, important: !item.important}
      }else return item;
    }))
  }
  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };
  const handleDelete=({key})=>{
    setItems((prevItems) =>
      prevItems.filter((item) => {
        return  item.key !== key
      }
      )
    );
  };
  const handleFunction=(event)=>{
    setItemToDo(event.target.value)
  }
  const handleFilterItems=(type)=>{
    setFilterType(type)
  }
  const handleSearch=(event)=>{
   setSearching(event.target.value)
  }
  const filterItem= filterType==='all'?items:
  filterType==='done'?items.filter((item)=>item.done):
  items.filter((item)=>!item.done)


  const moreToDO=items.filter((item)=>!item.done).length
  const done=items.length-moreToDO
  
  return (
    <div className="todo-app">
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>{moreToDO} more to do, {done} done</h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          // onClick={()=>handleSearch()}
          onChange={(event)=>handleSearch(event)}
        />
        <div className="btn-group">
          {buttons.map((item)=>(
            <button onClick={()=>handleFilterItems(item.type)}
            key={item.label}
            type="button"
            className={`btn btn-${
              filterType !== item.type ? "outline-" : ""
            }info`}>
            {item.label}
              </button>
          ))}

        </div>
      </div>
      
      <ul className="list-group todo-list">
      {filterItem.filter(item=>{
      if(searching===""){
        return item
        }else if(item.label.toLowerCase().includes(searching.toLowerCase())){
        return item
      }}).map((item)=>(
          <li key={item.key} className="list-group-item">
          <span className={`todo-list-item ${item.done? "done":""}`}>
          <span className={`todo-list-item ${item.important? "important":""}`}>
            <span className="todo-list-item-label" onClick={()=>handleItemDone(item)}>
             {item.label}
            </span>

            <button
            onClick={()=>handleItemImportant(item)}
              type="button"
              className="btn btn-outline-success btn-sm float-right"
            >
              <i className="fa fa-exclamation" />
            </button>

            <button
              onClick={()=>handleDelete(item)}
              type="button"
              className="btn btn-outline-danger btn-sm float-right"
            >
              <i className="fa fa-trash-o" />
            </button>
            </span>
          </span>
        </li>
        ))}

      </ul>

      <div className="item-add-form d-flex">
        <input value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleFunction}
        />
        <button className="btn btn-outline-secondary" onClick={()=>addItem()}>Add item</button>
      </div>
    </div>
  );
}

export default App;