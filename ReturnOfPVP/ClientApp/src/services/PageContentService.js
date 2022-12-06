import axios from "../api/axios";

const get = (page) => {
  return axios.get(`pagecontent/${page}`);
};

const update = (content, page) => {
  console.log(page);
  return axios.put(`pagecontent/${page}`, { content });
};

const PageContentService = {
  get,
  update,
};

export default PageContentService;
