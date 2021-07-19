/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// http://localhost:3000/
// const ss=document.querySeplectorAll('.delete')
// ss.forEach(e=>console.log(e.title));

// console.log({ss});

    // const title=event.target.firstElementChild.innerHTML;
    // try {
    //     const data = await axios.delete(`${url}/apk/deleteApk/${{title}}`);
    //     // window.location='/products'
    //     console.log(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // $(document).on('click', '.user_word_list_item', function(event) {
    //     event.preventDefault();
    //     console.log('worked!');
    //   });
    function addEvent(){
      document.getElementsByClassName('downs').addEventListener('click',(e)=>{
        e.preventDefault();
        console.log(e.target);
        // window.location = '/ProductDetails.html?title=' +e.target.title;
      })

    }
    