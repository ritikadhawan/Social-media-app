{
    // method to submit the form data for new post using AJAX
    //sending form data using ajax to post_controller
    let createPosts = ()=>{
        
        let newPostForm = $('#new-post-form');
        newPostForm.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: (data)=>{
                    console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-lists-container>ul').prepend(newPost);
                },
                error: (error)=>{
                    console.log(error.responseText);
                }

            });
        });
    }


    //function to display the post
    //here the person who is making the post is already signed in thus we can remove the checks
    let newPostDom = (post)=>{
        return $(`<li id="post-${post._id}">
            <p>
               
                <a href="/posts/destroy/${post.id}" class="delete-post-button">Delete Post</a>
               
                ${post.content}
                <br>
                <small>
                    ${post.user.name}
                </small>
            </p>
            <div class="post-comments">
                    <form action="/comments/create" method="POST" >
                    
                        <input type="text" id="comment-content" name="content" placeholder="type here to add comment.." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Comment">
                    </form>
             
            </div>
            <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
                
            </ul>
            </div>
        </li>`);
    }
    createPosts();
}