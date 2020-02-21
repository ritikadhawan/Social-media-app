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
                },
                error: (error)=>{
                    console.log(error.responseText);
                }

            });
        });
    }

    createPosts();
}