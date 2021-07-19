/* eslint-disable no-undef */
const params = new URLSearchParams(window.location.search);
const apkTitle = params.get("title");
// let url = "http://localhost:4000";
let url='http://165.227.84.121:4000';
let g_category;
let files = []; //This is multiple images
let g_subCategory;
function login() {
  const name = document.getElementById("inputUsername").value;
  const password = document.getElementById("inputPassword").value;
  if (!name || !password) {
    return alert("Please Enter Username and Password");
  }
  axios
    .post(`${url}/user/signin`, {
      name: name,
      password: password,
    })
    .then(
      (response) => {
        //console.log("response",response.data);
        
        localStorage.setItem("username" , response.data.user.name);
        localStorage.setItem("user" , response.data.user);
        const token=response.data.token
        console.log(token);
        console.log(parseJwt(token));
        var expiresIn = new Date(new Date().getTime()+(5*24*60*60*1000));
        document.cookie = `jwt=${token}; expires=${expiresIn}; path=/`
        window.location = "/dashboard";
        
      },
      (error) => {
        alert("Incorrect username or password");
        console.log(error);
      }
    );
}
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const sings = document.getElementById("c_ups");
if (sings) {
  sings.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log({ name: "tets" });

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirmPassword").value;
    if (!username || !email || !passwordConfirm || !password) {
      return alert("Please Enter complete information!!!");
    }
    axios
      .post(`${url}/user/signup`, {
        name: username,
        email,
        password,
        passwordConfirm,
        staff:true
      })
      .then(
        (response) => {
          localStorage.setItem("username" , response.data.user.name);
          localStorage.setItem("user" , response.data.user);
          //    localStorage.setItem("token" , response.data.token)
          //    console.log(response.data.token);
          //    localStorage.setItem('x-token',response.data.token)
          //    getAllUser();
          
          window.location = "/dashboard";
        },
        (error) => {
          alert("Incorrect username or password");
          console.log(error);
        }
      );
  });
}

const getAllUser = async () => {
  try {
    const x_token = localStorage.getItem("x-token");
    const data = await axios.get(`${url}/user/getall`, {
      headers: {
        "x-token": x_token,
      },
    });
    console.log(data);
    getAllApks();
  } catch (error) {
    console.log(error);
  }
};

const getMe = async () => {
  try {
    const x_token = localStorage.getItem("x-token");
    const data = await axios.get(`${url}/user/me`, {
      headers: {
        "x-token": x_token,
      },
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
const getAllCate = async () => {
  try {
    const cate = await axios.get(`${url}/cate/allcate`);
    console.log({ cate });
  } catch (error) {
    console.log(error);
  }
};

const addCate = async () => {
  const cate = document.getElementById("newCate").value;
  const slug = document.getElementById("newSlug").value;
  try {
    const allCate = await axios.post(`${url}/apk/addCate`, {
      category: cate,
      slug: slug,
    });
    console.log({ allCate });
    window.location = "/category";
  } catch (error) {
    console.log(error);
  }
};
async function Deletecate(title) {
  try {
    console.log(title);
    await axios.delete(`${url}/apk/deletecate/${title}`);
    window.location = "/category";
  } catch (error) {
    console.log({ error });
    alert("Something went wrong!!!");
  }
}

const getAllApks = async () => {
  try {
    const x_token = localStorage.getItem("x-token");
    const data = await axios.get(`${url}/apk/allApk`, {
      headers: {
        "x-token": x_token,
      },
    });
    console.log({ allApks: data });
  } catch (error) {
    console.log(error);
  }
};

const onsubCateSelect = async () => {
  var cont = document.getElementById("subcategory").value;
  g_subCategory = cont;
  console.log({ g_category, g_subCategory });
};
const selectElement = document.querySelector("#cat_id");
if (selectElement) {
  selectElement.addEventListener("change", async (event) => {
    try {
      const { data } = await axios.get(
        `${url}/apk/getcategory/${
          selectElement.options[selectElement.selectedIndex].label
        }`
      );
      g_category = data.data.category;
      const list = data.data.subCategory;
      var cont = document.getElementById("subcategory");
      var op = document.createElement("option");
      op.innerHTML = "select ..."; // assigning text to li using array value.
      removeAllChildNodes(cont);
      cont.appendChild(op); // append li to ul.
      for (i = 0; i <= list.length - 1; i++) {
        var option = document.createElement("option");
        option.innerHTML = list[i].name; // assigning text to li using array value.
        option.setAttribute("value", list[i].name);
        cont.appendChild(option); // append li to ul.
      }

      //   const cate = await axios.get(`${url}/cate/allcate`);
      //   console.log({cate});
    } catch (error) {
      console.log(error);
    }
  });
}
const onCateSelect = async () => {};

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
const addApk= async () => {
  console.log("we are adding apks");
  const developer = document.getElementById("developer").value;
  const trending = document.getElementById("trending").checked;
  const feature = document.getElementById("feature").checked;
  const hot = document.getElementById("hot").checked;
  const top = document.getElementById("top").checked;
  const file = document.getElementById("file").files[0];

  const version = document.getElementById("version").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const title = document.getElementById("title").value;
  const requirements = document.getElementById("requirements").value;
  const tags = document.getElementById("tags").value;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", g_category);
  formData.append("subCategory", g_subCategory);
  formData.append("developer", developer);
  formData.append("trending", trending);
  formData.append("feature", feature);
  formData.append("requirements", requirements);
  formData.append("tags", tags);
  formData.append("hot", hot);
  formData.append("top", top);
  formData.append("description", description);
  formData.append("version", version);
  formData.append("image", image);
  const configImages = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
      var dragonHealth = document.getElementById("health1").value;
      console.log(dragonHealth);
      document.getElementById("health1").value = percentCompleted;
    },
  };
  const configApk = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
      var dragonHealth = document.getElementById("health1").value;
      console.log(dragonHealth);
      document.getElementById("health2").value = percentCompleted;
    },
  };
  try {
    if (apkTitle) {
       await axios.patch(`${url}/apk/apkupdate/${apkTitle}`, formData );
      //  if (files.length>0) {
      //   const fd = new FormData();
      //   let ins = files.length;
      //   for (var x = 0; x < ins; x++) {
      //     fd.append("images", files[x]);
      //   }
      //   const rs2 = await axios.patch(
      //     `${url}/apk/addApkImages/${title}`,
      //     fd,
      //     configImages
      //   );
      //  }
      //  if (file.length>0) {
      //   console.log({ rs2 });
      //   const fileData = new FormData();
      //   fileData.append("file", file);
      //   const rs3 = await axios.patch(
      //     `${url}/apk/addApkFile/${title}`,
      //     fileData,
      //     configApk
      //   );
      //   console.log({ rs3 });
      //   // console.log({result,datas});
      return  window.location = "/products";
       }
    
    // Adding apk
    const rs1 = await axios.post(`${url}/apk/addApk`, formData);
    console.log({ rs1 });
    const fd = new FormData();
    let ins = files.length;
    for (let x = 0; x < ins; x++) {
      fd.append("images", files[x]);
    }
    const rs2 = await axios.patch(
      `${url}/apk/addApkImages/${title}`,
      fd,
      configImages
    );
    console.log({ rs2 });
    const fileData = new FormData();
    fileData.append("file", file);
    const rs3 = await axios.patch(
      `${url}/apk/addApkFile/${title}`,
      fileData,
      configApk
    );
    console.log({ rs3 });

    // console.log({result,datas});
    window.location = "/products";
  } catch (error) {
    console.log(error);
  }
};
// preview multiple images
function previewImages() {
  var preview = document.querySelector("#preview");
  files.push(this.files[0]);
  if (this.files) {
    [].forEach.call(this.files, readAndPreview);
  }

  function readAndPreview(file) {
    // Make sure `file.name` matches our extensions criteria
    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      return alert(file.name + " is not an image");
    } // else...

    var reader = new FileReader();

    reader.addEventListener("load", function () {
      var image = new Image();
      image.height = 100;
      image.title = file.name;
      image.src = this.result;
      preview.appendChild(image);
    });
    console.log(files);
    reader.readAsDataURL(file);
  }
}

if (document.querySelector("#file-input")) {
  document
    .querySelector("#file-input")
    .addEventListener("change", previewImages);
}
// document.getElementsByClassName('deleteItem');
// console.log(fun);
// const all=fun.addEventListener('click',e=>{
//     console.log(e.target);
//     console.log('hell0');
//   });

// alert('helol9o');

// document.forms["status"]["pending"].checked=true;
// var deleteItem = function(title) {
//   // Work with that value
//   console.log(title);
// }
async function deleteItem(title) {
  try {
    // console.log(title);
    await axios.delete(`${url}/apk/deleteApk/${title}`);
    window.location = "/products";
  } catch (error) {
    alert("Something went wrong!!!");
  }
}
async function editRedirect(_title) {
  let title=_title;
  if ( title.includes('&')) {
    cates =title.replace(/&/g, '-');
  } 
  window.location=`/editproduct?title=${title}`
}


async function approve(item) {
  try {
    if (item.actions === "pending") {
      await axios.patch(`${url}/apk/updateactions`, {
        title: item.title,
        actions: "approved",
      });
    } else {
      await axios.patch(`${url}/apk/updateactions`, {
        title: item.title,
        actions: "pending",
      });
    }
    window.location = "/products";
  } catch (error) {
    alert("Something went wrong!!!");
  }
}

const addSliders = document.getElementById("s_addSlider");
if (addSliders) {
  addSliders.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.getElementById("s_title").value;
    const image = document.getElementById("s_image").files[0];
    // const slug=document.getElementById('c_slug').value;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    // formData.append("slug", slug);
    addSlider(formData);
  });
}
async function addSlider(formData) {
  try {
    const slider = await axios.post(`${url}/apk/addslider`, formData);
    console.log({ s: slider });
    window.location = "/home";
  } catch (error) {
    console.log(error);
  }
}

const allSliders = async () => {
  try {
    const { data } = await axios.post(`${url}/apk/allsliders`);
    console.log({ papular_apps: data.data });
    data.data.map((apk,index) => {
      const status=apk.active?"Yes":"No";
      const li = `
      <td>${index+1}</td>
      <td class="center">
          <a ><img class="rounded" src="${url}/img/${apk.image}" width="40" height="40" /></a>
      </td>
      <td>${apk.title}</td>
      <td>${status}</td>
      <td class="text-right ">
      <a  class="btn btn-circle btn-success downs text-white" title="${apk.title}">switch</a>
      <a  class="btn btn-circle btn-danger down text-white" title="${apk.title}" >Delete</a>
      </td>
        `;
        const tr=document.createElement('tr');
        tr.innerHTML=li;
      tr.querySelector(".down").addEventListener("click", (e) => {
        e.preventDefault();
        deleteSlider(e.target.title);
        console.log("deleted",e.target.title);
        // window.location = "/ProductDetails.html?title=" + e.target.title;
      });
      tr.querySelector(".downs").addEventListener("click", (e) => {
        e.preventDefault();
        switchslider(e.target.title);
        console.log("active",e.target.title);
        // window.location = "/ProductDetails.html?title=" + e.target.title;
      });
      document.querySelector("#s_tbody").appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
};
// allSliders();
if (document.querySelector("#s_tbody")) {
  allSliders();
}

async function deleteSlider(title) {
  try {
    console.log(title);
    await axios.delete(`${url}/apk/deleteSlider`,{data:{title}});
    window.location = "/home";
  } catch (error) {
    alert("Something went wrong!!!");
  }
}

async function switchslider(title) {
  try {
    console.log({title});
    await axios.patch(`${url}/apk/activeSwitch/${title}`);
    window.location = "/home";
  } catch (error) {
    alert("Something went wrong!!!");
  }
}


const editApks = async () => {
  console.log("we are adding");
  console.log("we are adding apks");
  const developer = document.getElementById("developer").value;
  const trending = document.getElementById("trending").checked;
  const feature = document.getElementById("feature").checked;
  const hot = document.getElementById("hot").checked;
  const top = document.getElementById("top").checked;
  const file = document.getElementById("file").files[0];
  const version = document.getElementById("version").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const title = document.getElementById("title").value;
  const requirements = document.getElementById("requirements").value;
  const tags = document.getElementById("tags").value;
  console.log({img:image});
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", g_category);
  formData.append("subCategory", g_subCategory);
  formData.append("developer", developer);
  formData.append("trending", trending);
  formData.append("feature", feature);
  formData.append("requirements", requirements);
  formData.append("tags", tags);
  formData.append("hot", hot);
  formData.append("top", top);
  formData.append("description", description);
  formData.append("version", version);
  formData.append("image", image);

   const configImages = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
      var dragonHealth = document.getElementById("health1").value;
      console.log(dragonHealth);
      document.getElementById("health1").value = percentCompleted;
    },
  };
  const configApk = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
      var dragonHealth = document.getElementById("health1").value;
      console.log(dragonHealth);
      document.getElementById("health2").value = percentCompleted;
    },
  };
  try {
    const rs1 = await axios.patch(`${url}/apk/apkupdate/${apkTitle}`, formData );
    console.log({ rs1 });
    const images=document.getElementById('file-input').files.length;
   if (images) {
    const fd = new FormData();
    var ins = files.length;
    for (var x = 0; x < ins; x++) {
      fd.append("images", files[x]);
    }
    const rs2 = await axios.patch(
      `${url}/apk/addApkImages/${apkTitle}`,
      fd,
      configImages
    );
    console.log({ rs2 });
   }
    console.log({file});
    const apkfile=document.getElementById('file').files.length;
    if (apkfile) {
      const fileData = new FormData();
    fileData.append("file", file);
    const rs3 = await axios.patch(
      `${url}/apk/addApkFile/${apkTitle}`,
      fileData,
      configApk
    );
    console.log({ rs3 });
    window.location = "/products";
    }
     }
    // console.log({result,datas});
     catch (error) {
    console.log(error);
  }
};

const changePassword = async()=>{
  let user = localStorage.user;
  let passwordCurrent = document.getElementById("ch_password").value;
  let password = document.getElementById("ch_new_password").value;
  let passwordConfirm = document.getElementById("ch_new_confirmPassword").value;
  //let user = {password : currentPassword , _id : id}
  try{
  axios.patch(`${url}/user/updatePassword` , 
  {
  user,
  passwordCurrent,
  password ,
  passwordConfirm 
  }
  ).then(
    (response) => {
      console.log(response);
      localStorage.setItem("user" , response.data.user);
      //    localStorage.setItem("token" , response.data.token)
      //    console.log(response.data.token);
      //    localStorage.setItem('x-token',response.data.token)
      //    getAllUser();
      
      window.location = "/dashboard";
    },
    (error) => {
      alert("Incorrect or password");
      console.log(error);
    }
  );
  }
  catch(err){
    console.log(err);
  }

}


///////////////////////////////////////////////
