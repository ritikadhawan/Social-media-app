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
                    let newPost = newPostDom(data.data.post);
                    $('#posts-lists-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost)); //passing delete post button inside of newPost to our function with event listener
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    createComment();
                },
                error: (error)=>{
                    console.log(error.responseText);
                }

            });
        });
    }


    //function to display the post
    //here the person who is making the post is already signed in thus we can remove the checks
    let newPostDom = (post,userName)=>{
        return $(`<li id="post-${post._id}">
            <p>
               
                <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete Post</a>
               
                ${post.content}
                <br>
                <small>
                    ${post.user.name}
                </small>
            </p>
            <div class="post-comments">
                    <form action="/comments/create" class="new-comment-form" method="POST" >
                    
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
    //funciton to delete the post from the dom
    //it takes the a tag as argument
    let deletePost = (deleteLink)=>{
        $(deleteLink).click((e)=>{
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data)=>{
                    //data has the id of the post to be deleted
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: (error)=>{
                    console.log(error.responseText);
                }
            })
        });
    }
    createPosts();
    
    for(let i=0;i<$('.delete-post-button').length;i++)
    {
        deletePost($('.delete-post-button')[i]);
    }
}