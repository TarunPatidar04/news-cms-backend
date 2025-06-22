// Frontend route Controller

const mongoose = require("mongoose");

const CategoryModel = require("../models/Category");
const NewsModel = require("../models/News");
const CommentModel = require("../models/Comment");
const UserModel = require("../models/User");


const index=async(req,res)={}
const articalByCategory=async(req,res)={}
const singleArticle=async(req,res)={}
const search=async(req,res)={}
const author=async(req,res)={}
const addComment=async(req,res)={}

module.exports={
    index,
    articalByCategory,
    singleArticle,
    search,
    author,
    addComment
}