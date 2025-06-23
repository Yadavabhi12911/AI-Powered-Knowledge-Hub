const Article = require('../models/Article')
const { summarizeWithLLM } = require('../llm')
const asyncHandler = require("express-async-handler")
const ErrorHandler = require("../utils/ErrorHandle")
const ApiResponse = require("../utils/ApiResponse")

// Create Article
const createArticle = asyncHandler(async (req, res) => {
    const { title, content, tags, published } = req.body
    const author = req.myUser._id

    const article = await Article.create({
        title,
        content,
        tags,
        published,
        author
    })

    return res.status(201).json({
        success: true,
        message: "Article created successfully",
        data: article
    })
})

// Get All Articles
const getArticles = asyncHandler(async (req, res) => {
    const articles = await Article.find().populate('author', 'username role')
    return res.status(200).json({
        success: true,
        message: "All articles fetched",
        data: articles
    })
})

// Get Single Article
const getArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id).populate('author', 'username role')
    if (!article) throw new ErrorHandler("Article not found", 404)

    return res.status(200).json({
        success: true,
        message: "Article fetched",
        data: article
    })
})

// Update Article
const updateArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id)
    if (!article) throw new ErrorHandler("Article not found", 404)

    if (String(article.author) !== String(req.myUser._id) && req.myUser.role !== 'admin') {
        throw new ErrorHandler("Forbidden", 403)
    }

    const { title, content, tags, published } = req.body
    if (title) article.title = title
    if (content) article.content = content
    if (tags) article.tags = tags
    if (typeof published !== "undefined") article.published = published

    await article.save()

    return res.status(200).json({
        success: true,
        message: "Article updated successfully",
        data: article
    })
})

// Delete Article
const deleteArticle = asyncHandler(async (req, res) => {
    if (req.myUser.role !== 'admin') throw new ErrorHandler("Forbidden", 403)
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) throw new ErrorHandler("Article not found", 404)

    return res.status(200).json({
        success: true,
        message: "Article deleted successfully",
        data: article
    })
})

// Summarize Article

const summarizeArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;

  const article = await Article.findById(articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found" });
  }

  const summary = await summarizeWithLLM(article.content);

  article.summary = summary;
  await article.save();

  res.json({ success: true, summary });
});


module.exports = {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle,
    summarizeArticle
}
