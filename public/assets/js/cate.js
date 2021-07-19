/* eslint-disable no-undef */
const params = new URLSearchParams(window.location.search);
const cate = params.get("cate");
// let url = "https://localhost:4000";
// http://165.227.84.121:4000/
let url='http://165.227.84.121:4000';
const addCates=document.getElementById('c_button');
if (addCates) {
  addCates.addEventListener('click',(e)=>{
    e.preventDefault();
    const subcategory=document.getElementById("c_subCate").value;
    const image = document.getElementById("c_image").files[0];
    const slug=document.getElementById('c_slug').value;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("subCate", subcategory);
    formData.append("slug", slug);
    addSubCate(formData);
    }); 
}

 async function addSubCate(formData) {
    try {
        const allCate = await axios.patch(`${url}/apk/addSubCate/${cate}`, 
       formData
   );
        console.log({ allCate });
        window.location = "/category";
      } catch (error) {
        console.log(error);
      }
  }
   console.log("im from cate file");
  async function   deletecate(title) {
    try {
      console.log(title); 
      await axios.delete(`${url}/apk/deletecate/${title}`);
      window.location='/category';
    } catch (error) {
      console.log({error});
      alert('Something went wrong!!!')
    }
    }