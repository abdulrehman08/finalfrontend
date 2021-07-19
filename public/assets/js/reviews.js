
let Url = "http://165.227.84.121:4000"


console.log("getting Reviews")
axios.get(`${Url}/getReviews`).then(
        response => {
            console.log(response.data)
        
        response.data.Reviews.forEach(Review=>{
          let title = Review.title.split(" ").join("_");
          console.log(title)
            document.getElementById("table-body").innerHTML +=`<tr>
            
            <td class="center">
              <a href=""><img class="rounded" src="/img/${Review.image}" width="40" height="40" /></a>
            </td>
            <td>
              ${Review.title}
            </td>
            <td>
              ${Review.review.comment.name}
            </td>
            <td>
              ${Review.review.comment.text}
            </td>
            
            <td>
              ${Review.review.rating}
            </td>
            

            <td style="display : flex;justify-content: space-between;">
            <textarea id = ${Review.review._id}  class="md-textarea form-control" rows="4" >${Review.review.reply ? Review.review.reply.text : ""}</textarea>
            <button id=btn-${Review.review._id} name=${title} onclick="reply(this)" class="btn btn-circle btn-primary" style="height:50px" >Reply</button>
            </td>
            </tr>`
        
         //console.log(document.getElementById(`${Review.review._id}`))
         /*.addEventListener("click" ,(e)=>{
            console.log("id",Review.review._id)
            return e;
            });*/
        
        });
        $(document).ready(function() {
          // DataTable initialisation
          $('#myTable').DataTable();
        });        
        }
    )
    .catch(err=>{
        console.log(err)
    })


    function reply(element){
      let user = localStorage.getItem("username");  
      console.log(element)
      var id = element.id.split("-")[1];
      let text = document.getElementById(id).value;
      console.log(text);
      console.log(user)
      let title = element.name
      console.log(title);
      axios.patch(`${Url}/apk/reply/${title}/${id}` , { text , user : {name : user} }).then(res =>{
         window.location.reload();
      }).catch(err =>{
          console.log(err);
      })
    }