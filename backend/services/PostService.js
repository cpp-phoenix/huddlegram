const PostModel = require("../models/Post");
 
exports.getAllPosts = async () => {
  return await PostModel.find();
};

exports.getAllPublicPosts = async () => {
  return await PostModel.find({gated: false}).sort({createdAt: -1});
};

exports.getAllPublicPostsById = async (id) => {
  return await PostModel.find({gated: false, id:id}).sort({createdAt: -1});
};

exports.getAllGatedPosts = async () => {
  return await PostModel.find({gated: true}).sort({createdAt: -1});
};

exports.getAllGatedPostsById = async (id) => {
  return await PostModel.find({gated: true, id:id}).sort({createdAt: -1});
};
 
exports.createPost = async (post) => {
  return await PostModel.create(post);
};
exports.getPostById = async (id) => {
  return await PostModel.findById(id);
};
 
exports.updatePost = async (id, post) => {
  return await PostModel.findByIdAndUpdate(id, post);
};
 
exports.deletePost = async (id) => {
  return await PostModel.findByIdAndDelete(id);
};