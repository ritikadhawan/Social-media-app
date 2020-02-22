{
    createComment = ()=>{
        
        let submitFunction = function(e) {
            e.preventDefault();
            // console.log(this);
            $.ajax({
                type: 'POST',
                url: '/comments/create',
                data: $(this).serialize(),
                success: (data)=>{
                    let newComment = newCommentDom(data.data.comment,data.data.userName);
                    $(`#post-${data.data.comment.post}>.post-comments-list>ul`).append(newComment);
                    deleteComment($(' .delete-comment-button',newComment));//to mind the space between ' and .
                },
                error: (error)=>{
                    console.log(error.responseText);
                }
            });
        }

        let newCommentForms = $('.new-comment-form');
        for (let i = 0; i < newCommentForms.length; i++) {
            newCommentForms[i].addEventListener('submit',submitFunction);
        }
    }
    let newCommentDom = (comment,userName)=>{
        return $(`<li id="comment-${comment._id}">
        <a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a>
        ${comment.content}
        <br>
        <small>
            ${userName}
        </small>
        </li>`);
    }
    let deleteComment = (deleteLink)=>{
        $(deleteLink).click((e)=>{
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data)=>{
                    //data has the id of the comment to be deleted
                    $(`#comment-${data.data.comment_id}`).remove();

                },
                error: (error)=>{
                    console.log(error.responseText);
                }
            })
        });
    }
    createComment();
    //attaching delete comment event listener to every delete comment button
    for(let i=0;i<$('.delete-comment-button').length;i++)
    {
        deleteComment($('.delete-comment-button')[i]);
    }
}