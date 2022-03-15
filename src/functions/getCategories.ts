import axios from "axios";

export default async function getCategories():Promise<any[]> {
  const res = await axios.get("http://localhost:3000/api/retrieve-categories");
  return res.data.items;
}