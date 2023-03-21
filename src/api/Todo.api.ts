import axios from "./index";

export const todoApi = {
  getTodos: () => axios.get("todos"),
};

// export const todoApi = {
//  getTodos(){
//   return  axios.get('todos').then((response)=> response.data)
// }
// }
