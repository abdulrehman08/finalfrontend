/* eslint-disable no-undef */
var url = "http://165.227.84.121:4000"
const params = new URLSearchParams(window.location.search);
const apkTitle = params.get("title");
async function getApk() {
  let title = apkTitle;
  if (title.includes("-")) {
    title = title.replace(/-/g, "&");
  }
  try {
    const { data } = await axios.get(`${url}/apk/oneapk/${title}`);
    console.log(data);
    const apkData = data.data;
    loadData(apkData);
  } catch (error) {
    return "apk not existed!!!";
  }
}
getApk();
function loadData(apk) {
  document.getElementById("developer").value = apk.developer;
  document.getElementById("trending").checked=apk.trending;
  document.getElementById("feature").checked=apk.editorChoice;
  document.getElementById("hot").checked=apk.hot;
  document.getElementById("top").checked=apk.top;
  // document.getElementById("file").files[0];
  document.getElementById("description").value=apk.description;
  // document.getElementById("image").files[0];
  document.getElementById("title").value=apk.title;
  document.getElementById("version").value=apk.version;
  document.getElementById("requirements").value=apk.requirements;
  document.getElementById("tags").value=apk.tags;
  g_category=apk.category;
  g_subCategor=apk.subCategory;
}
/////////////////////////////////
const editApks = async () => {
  console.log("we are adding");
  const developer = document.getElementById("developer").value;
  const trending = document.getElementById("trending").checked;
  const feature = document.getElementById("feature").checked;
  const hot = document.getElementById("hot").checked;
  const top = document.getElementById("top").checked;
  // const file = document.getElementById("file");
  const version = document.getElementById("version").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image");
  const title = document.getElementById("title").value;
  const requirements = document.getElementById("requirements").value;
  const tags = document.getElementById("tags").value;
  console.log({image:image.files.length});
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
  // console.log(formData);
  //  const configImages = {
  //   onUploadProgress: function (progressEvent) {
  //     var percentCompleted = Math.round(
  //       (progressEvent.loaded * 100) / progressEvent.total
  //     );
  //     console.log(percentCompleted);
  //     var dragonHealth = document.getElementById("health1").value;
  //     console.log(dragonHealth);
  //     document.getElementById("health1").value = percentCompleted;
  //   },
  // };
  // const configApk = {
  //   onUploadProgress: function (progressEvent) {
  //     var percentCompleted = Math.round(
  //       (progressEvent.loaded * 100) / progressEvent.total
  //     );
  //     console.log(percentCompleted);
  //     var dragonHealth = document.getElementById("health1").value;
  //     console.log(dragonHealth);
  //     document.getElementById("health2").value = percentCompleted;
  //   },
  // };
  try {
    const rs1 = await axios.patch(`${url}/apk/apkupdate/${apkTitle}`, formData );
    console.log({ rs1 });

    // const fd = new FormData();
    // var ins = files.length;
    // for (var x = 0; x < ins; x++) {
    //   fd.append("images", files[x]);
    // }
    // const rs2 = await axios.patch(
    //   `${url}/apk/addApkImages/${title}`,
    //   fd,
    //   configImages
    // );
    // console.log({ rs2 });
    // console.log({file});
    // if (file) {
    //   const fileData = new FormData();
    // fileData.append("file", file);
    // const rs3 = await axios.patch(
    //   `${url}/apk/addApkFile/${apkTitle}`,
    //   fileData,
    //   configApk
    // );
    // console.log({ rs3 });
    // window.location = "/products";

    }
    // console.log({result,datas});
     catch (error) {
    console.log(error);
  }
};

// preview multiple images




