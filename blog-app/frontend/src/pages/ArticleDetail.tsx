import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticle, deleteArticle } from '../api/article';
import { getComments, createComment, deleteComment } from '../api/comment';
import { Article, Comment } from '../types';
import { useAuthStore } from '../stores/authStore';

function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await getArticle(Number(id));
      setArticle(res.data || null);
    } catch (err) {
      console.error('获取文章失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(Number(id));
      setComments(res.data || []);
    } catch (err) {
      console.error('获取评论失败:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    
    try {
      await deleteArticle(Number(id));
      navigate('/');
    } catch (err) {
      console.error('删除文章失败:', err);
      alert('删除失败');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    try {
      setSubmitting(true);
      await createComment(Number(id), {
        content: commentContent,
        parentId: replyTo || undefined
      });
      setCommentContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error('发表评论失败:', err);
      alert('发表评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error('删除评论失败:', err);
      alert('删除失败');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'border-b border-gray-200 pb-6 mb-6'}`}>
      <div className="flex items-start space-x-3">
        {comment.author_avatar ? (
          <img
            src={comment.author_avatar}
            alt={comment.author_username}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {comment.author_username?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{comment.author_username}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          <p className="mt-2 text-gray-700">{comment.content}</p>
          <div className="mt-2 flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                回复
              </button>
            )}
            {(user?.id === comment.author_id || user?.role === 'admin') && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                删除
              </button>
            )}
          </div>
          
          {/* 回复表单 */}
          {replyTo === comment.id && (
            <form onSubmit={handleSubmitComment} className="mt-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting || !commentContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? '发送中...' : '回复'}
                </button>
              </div>
            </form>
          )}
          
          {/* 嵌套回复 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">文章不存在</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          返回首页
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === article.author_id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      {/* 文章头部 */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              {article.author_avatar ? (
                <img
                  src={article.author_avatar}
                  alt={article.author_username}
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                  {article.author_username?.charAt(0).toUpperCase()}
                </div>
              )}
              {article.author_username}
            </span>
            <span>{formatDate(article.created_at)}</span>
            {article.category_name && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {article.category_name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>阅读 {article.view_count}</span>
          </div>
        </div>

        {/* 文章封面 */}
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* 文章内容 */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 编辑删除按钮 */}
        {(isAuthor || isAdmin) && (
          <div className="mt-6 flex space-x-4">
            <Link
              to={`/article/edit/${article.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              编辑
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              删除
            </button>
          </div>
        )}
      </div>

      {/* 评论区 */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-bold mb-6">评论 ({comments.length})</h2>
        
        {/* 评论表单 */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="写下你的评论..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '发送中...' : '发表评论'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-600">
              请 <Link to="/login" className="text-blue-600 hover:text-blue-800">登录</Link> 后发表评论
            </p>
          </div>
        )}

        {/* 评论列表 */}
        <div>
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无评论，来发表第一条评论吧！</p>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
