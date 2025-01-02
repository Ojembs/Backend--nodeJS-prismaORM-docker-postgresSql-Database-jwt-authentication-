import express from 'express'
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/register', async(req, res) => {
    const { username, password } = req.body
    const hashedPassword = bycrypt.hashSync(password, 8)
   

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
       
        const defaultTodo = `Hello :) You have your first todo`
       
        await prisma.todo.create({
            data: {
                userId: user.id,
                task: defaultTodo
            }
        })

        // create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        res.json({ token })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {

        const user = await prisma.user.findUnique({
            where: {
                username: username
            } 
        })


        if (!user) {
            return res.status(404).send({ message: "User Not Found!" })
        }

        const passwordIsValid = bycrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(404).send({ message: "Invalid password!" })
        }

        console.log(user)

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { "expiresIn": "24h" })
        res.json({ token })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

export default router