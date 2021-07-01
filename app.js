require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const session = require('express-session');
const {flash} = require('express-flash-message');
const fileUpload = require('express-fileupload');
const {nanoid} = require('nanoid');
const fs = require('fs');

const {Post,Author} = require('./models/index');

app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());
// express session
app.use(
    session({
        secret:'secret',
        resave: false,
        saveUninitialized:true,
    })
);
// apply express-flash-message middleware
app.use(flash({sessionKeyName:'flashMessage'}));
app.use(fileUpload());


app.get('/', (req,res)=>{
    res.render('index')
});
app.get('/post', async (req,res)=>{
    const posts = await Post.findAll({include:'author'});
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    res.render('post',{posts,title:'Daftar Post',infoFlash,errFlash});
});
app.get('/post/:id', async (req,res)=>{
    const id = req.params.id.trim();
    try{
        const post = await Post.findOne({
            where:{
                id:id
            }
        });
        const author = await Author.findOne({
            where:{
                id:post.authorId
            }
        });
        res.render('post-detail',{post,author});
    }catch(err){
        console.log(err);
        res.json(err);
    }
});
app.get('/insert-post', async (req,res)=>{
    const author = await Author.findAll();
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    res.render('form-post',{title:'Form Input Post',author,infoFlash,errFlash});
});
app.get('/update-post/:id', async(req,res)=>{
    const id = req.params.id.trim();
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    try{
        const post = await Post.findOne({
            where:{
                id:id
            }
        });
        console.log(post);
        const author = await Author.findAll();
        res.render('form-post',{post,author,infoFlash,errFlash});
    }catch(err){
        console.log(err);
        req.json(err);
    }
    
})

app.get('/author', async (req,res)=>{
    const authors = await Author.findAll();
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    res.render('author',{authors,title:'Daftar Author',infoFlash,errFlash});
});
app.get('/author/:id', async(req,res)=>{
    const id = req.params.id.trim();
    const authorWithPost = await Author.findOne({
        where:{id:id},
        include: 'post'
    });
    const posts = authorWithPost.post;
    res.render('author-detail',{posts,authorWithPost});
});
app.get('/insert-author', async (req,res)=>{
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    res.render('form-author',{title:'Form Input Author',infoFlash,errFlash});
});
app.get('/update-author/:id', async (req,res)=>{
    const id = req.params.id.trim();
    const infoFlash = await req.consumeFlash('info');
    const errFlash = await req.consumeFlash('err');
    try{
        const author = await Author.findOne({
            where:{
                id:id
            }
        });
        res.render('form-author',{title:'Form Update Author',author,infoFlash,errFlash});
    }catch(err){
        console.log(err);
        res.json(err);
    }
})

app.post('/insert-author', async (req,res)=>{
    const request = req.body;
    try{
        const data = await Author.create({
            name:request.author,
            username:request.username,
        });
        await req.flash('info','Input Author Berhasil');
        res.redirect('/insert-author');
    }catch(err){
        if(err.errors){
            err.errors.forEach(async (er)=>{
                await req.flash('err',er.message);
            })
        }
        console.log(err);
        res.redirect('/insert-author');
    }
});
app.post('/update-author', async (req,res)=>{
    const request = req.body;
    const authorId = req.body.authorId.trim();
    try{
        const author = await Author.update({
            name:request.author,
            username:request.username,
        },{
            where:{
                id:authorId
            }
        });
        await req.flash('info','Update Author Berhasil');
        res.redirect('/author');
    }catch(err){
        console.log(err);
        if(err.errors){
            err.errors.forEach(async (er)=>{
                await req.flash('err',er.message);
            })
        }
        res.redirect('/author');
    }
})

app.get('/delete-author/:id', async (req,res)=>{
    const id = req.params.id.trim();
    try{
        const data = await Author.destroy({
            where:{
                id:id,
            },
        });
        await req.flash('info','Delete Author Berhasil');
        res.redirect('/author');
    }catch(err){
        console.log(err);
        await req.flash('err','Delete Author Gagal');
        res.redirect('/author');
    }
});

app.post('/insert-post',async (req,res)=>{
    const request = req.body;
    try{
        let location='';
        if(req.files){
            let file;
            let typeFile;
            let uploadPath;
            file = req.files.img;
            typeFile = file.name.split('.');
            let fileName = typeFile[0]+"-"+nanoid(6)+"."+typeFile[typeFile.length-1];
            uploadPath = __dirname + '/public/img/' + fileName;

            file.mv(uploadPath,(err)=>{
                if(err){
                    return res.json(err);
                }
            });
            location = '/img/'+fileName;
        }
        const data = await Post.create({
            title:request.title,
            body:request.isiPost,
            desc:request.desc,
            image: location,
            authorId:request.author.trim(),
        });
        await req.flash('info','Input Post Berhasil');
        res.redirect('/insert-post');

    }catch(err){
        console.log(err);
        if(err.errors){
            err.errors.forEach(async (er)=>{
                await req.flash('err',er.message);
            })
        }
        res.redirect('/insert-post');
    }
});

app.post('/update-post', async (req,res)=>{
    const request = req.body;
    const postId = req.body.postId;
    try{
        const post = await Post.findOne({
            where:{
                id:postId,
            }
        })
        let data={
            title: request.title,
            body: request.isiPost,
            desc:request.desc,
            image:post.image,
            authorId:request.author,
        };
        if(req.files){ 
            let file;
            let typeFile;
            let uploadPath;
            file = req.files.img;
            typeFile = file.name.split('.');
            let fileName = typeFile[0]+"-"+nanoid(6)+"."+typeFile[typeFile.length-1];
            uploadPath = __dirname + '/public/img/' + fileName;

            file.mv(uploadPath,(err)=>{
                if(err){
                    return res.json(err);
                }
            });
            location = '/img/'+fileName;
            data = {
                title: request.title,
                body: request.isiPost,
                desc:request.desc,
                image:location,
                authorId:request.author,
            }
        }
        await Post.update(data, {
            where: {
                id:postId
            }
        });
        await req.flash('info','Update Post Berhasil');
        res.redirect('/post');
        // res.json(req.files);
    }catch(err){
        if(err.errors){
            err.errors.forEach(async (er)=>{
                await req.flash('err',er.message);
            })
        }
        console.log(err);
        res.redirect('/post');
    }
});

app.get('/delete-post/:id', async (req,res)=>{
    const id = req.params.id.trim();
    try{
        const post = await Post.findOne({
            where:{
                id:id
            }
        });
        let path = post.image;
        if(post.image){
            fs.unlink(__dirname+'/public'+path,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
        const data = await Post.destroy({
            where:{
                id:id,
            },
        });
        await req.flash('info','Hapus Post Berhasil');
        res.redirect('/post');
    }catch(err){
        await req.flash('err','Hapus Post Gagal');
        console.log(err);
        res.redirect('/post');
    }
});

app.listen(port,()=>{
    console.log(`Koneksi ke localhost:${port}`);
})