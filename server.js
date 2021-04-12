const express = require('express')
const app = express()

const rowdy = require ('rowdy-logger')
const routesReport = rowdy.begin(app)

app.use(express.json())
app.use(require('cors')())

const models = require('./models')

////////////////////////Singin function///////////////////////////////////
const userCreate = async (req,res) =>{
    try {
        const user = await models.user.create({
            email:req.body.email,
            password:req.body.password
        })
        res.json({user})
    } catch (error) {
        res.status(400)
        res.json({ error: 'No same Email!!' })
    }
}
//////////////////////login function//////////////////////////////////////
const userLogin = async (req,res) =>{
    try {
        const user = await models.user.findOne({
            where:{
                email: req.body.email
            }
        })
        if (user.password === req.body.password) {
            res.json({user})
        }else{
            res.status(401).json({error:'wrong password'})
        }
    } catch (error) {
        res.status(400).json({error:'need to singup'})
        
    }
}
////////////////////Create post with user id///////////////////////////
const postCreate = async (req,res) =>{
    try {
        const newPost = await models.post.create({
            title: req.body.title,
            content: req.body.content
        })

        let user = await models.user.findOne({
            where:{
                id: req.params.id
            }
        })
        await user.addPost(newPost)

        res.json({user,post:newPost})
    } catch (error) {
    
        res.json({ error: 'Please WORk !!!!!' })
    }
}

///////////////////////bring all post without userid//////////
const getAllposts = async (req,res) => {
   try {
       const post = await models.post.findAll()
       res.json({post})
       
   } catch (error) {
        res.json({error})       
   }

}
/////////////// get all post from same userid////////////
const getAllpostbyUserid = async(req,res) => {
    try {
        const post = await models.post.findAll({
            where: {
                userId : req.params.userId
            }
        })
        res.json({post})
    } catch (error) {
        res.json({error})
    }
}

///////delet the specific post !!!!/////////////////
const deletePost = async (req,res) =>{
    try {
        let user = await models.user.findOne({
            where: {id: req.params.id}
        })
        
        let post = await models.post.findOne({
            where:{ id: req.params.postid}
        })
        await user.removePost(post)   
        await post.destroy()    
        res.json({message:'delete'})
    } catch (error) {
        res.json({error})
    }
}

//////////////////post update/////////////////////
const postUpdate = async (req,res) => {
    try {
        const post = await models.post.findOne({
            where:{
                id: req.params.id
            }
        })
        let updates = await post.update(req.body)
        res.json({updates})
       
    } catch (error) {
        res.json({error})
        
    }
}

app.get('/posts/:userId', getAllpostbyUserid)
app.get('/posts', getAllposts)
app.post('/users', userCreate)
app.post('/users/login', userLogin)
app.post('/users/:id/posts',postCreate)
app.put('/posts/:id', postUpdate)
app.delete('/users/:id/delete/:postid',deletePost)





const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`port running on ${PORT}`)
  routesReport.print()
})
