import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const create = (newObj) => {
  return axios.post(baseUrl, newObj).then((res) => res.data);
};

const update = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj).then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove,
};
