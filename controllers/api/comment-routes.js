const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get comments ('api/comment')
router.get('/', async (req, res) => {
  try{ 
    const dbCommentData = await Comment.findAll({});
    if (dbCommentData.length === 0) {
      res.status(404).json({ message: 'No comments found'});
      return;
    };
    res.status(200).json(dbCommentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all the comments from 1 post
router.get('/:id', async (req, res) => {
  try {
      const commentData = await Comment.findAll({
          where: { id: req.params.id },
      });
      if (commentData.length === 0) {
          res.status(404).json({ message: `No comments found` });
          return;
      }
      res.status(200).json(commentData);
  } catch (err) {
      res.status(500).json(err);
  }
});

// create comment ('/api/comment')
router.post('/', withAuth, async (req, res) => {
    const body = req.body;
    try {
        const newComment = await Comment.create({
            ...body,
            userId: req.session.userId,
        });
        res.status(200).json({ newComment, success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete comment ('api/comment/:id')
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const dbCommentData = await Comment.destroy({
        where: {id: req.params.id},
      });        
      if (!dbCommentData) {
        res.status(404).json({
          message: `No comments found`,
        });
        return;
      }  
      res.status(200).json({dbCommentData, success: true});
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;