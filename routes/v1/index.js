const express = require('express');
const app = express()

const userRouter = require('./user')
const foodRouter = require('./food')
const transactionRouter = require('./transaction')
app.use('/users', userRouter)
app.use('/foods', foodRouter)
app.use('/transactions', transactionRouter)

const authAdminRouter = require('./admin/authentication')
const userAdminRouter = require('./admin/user')
const foodAdminRouter = require('./admin/food')
const transactionAdminRouter = require('./admin/transaction')
app.use('/admin/authentication', authAdminRouter)
app.use('/admin/users', userAdminRouter)
app.use('/admin/foods', foodAdminRouter)
app.use('/admin/transactions', transactionAdminRouter)

module.exports = app