const mongoose = require('mongoose');

const PostModel = require('../models/posts');

exports.get_all_posts = async (req, res, next) => {
    try {
        const posts = await PostModel.find();
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).send('Failed to fetch posts');
    }
};

exports.get_single_post = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const post = await PostModel.findById(id);
        res.status(200).json(post);

    } catch (error) {
        res.status(500).send('Failed to fetch the post');
    }
}

exports.create_post = async (req, res, next) => {

    const { title, content, author } = req.body;
    const newPost = new PostModel({ title, content, author });
    
    try {
        await newPost.save();
        
        res.status(201).json(newPost);

    } catch (error) {
        res.status(409).json({ message: error });
    }
};

exports.update_post = async (req, res, next) => {
    const { id } = req.params;
    const { title, author, content } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const updatedPostData = { title, author, content, _id: id };
        const updatedPost = await PostModel.findByIdAndUpdate(id, updatedPostData, { new: true });

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.like_post = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const post = await PostModel.findById(id);
        const updatedPost = await PostModel.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
  
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({message: error});
    }
};

exports.dislike_post = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const post = await PostModel.findById(id);
        const updatedPost = await PostModel.findByIdAndUpdate(id, { dislikeCount: post.dislikeCount + 1 }, { new: true });

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({message: error});
    }
};

exports.delete_post = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        await PostModel.findByIdAndRemove(id);

        res.status(200).json({ message: "Post deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: error });
    }
}