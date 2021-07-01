
tinymce.init({
    selector: 'textarea',
});

function readURL(input) 
{
    document.getElementById("display-img").style.display = "block";

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('display-img').src =  e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}
