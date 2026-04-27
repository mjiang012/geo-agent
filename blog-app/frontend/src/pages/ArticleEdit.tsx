import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createArticle, updateArticle, getArticle } from '../api/article';
import { getCategories } from '../api/category';
import { Category } from '../types';

function ArticleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('获取分类失败:', err);
    }
  };

  const fetchArticle = async () => {
    try {
      setFetchLoading(true);
      const res = await getArticle(Number(id));
      const article = res.data;
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setSummary(article.summary || '');
        setCoverImage(article.cover_image || '');
        setCategoryId(article.category_id || '');
        setTags(article.tags?.map(t => t.name).join(', ') || '');
        setStatus(article.status);
      }
    } catch (err) {
      console.error('获取文章失败:', err);
      alert('获取文章失败');
      navigate('/');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishStatus?: 'draft' | 'published') => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    const articleStatus = publishStatus || status;
    const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

    const data = {
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      tags: tagList,
      status: articleStatus
    };

    try {
      setLoading(true);
      if (isEdit) {
        await updateArticle(Number(id), data);
        alert('文章更新成功');
      } else {
        const res = await createArticle(data);
        alert('文章创建成功');
        navigate(`/article/edit/${res.data?.id}`);
        return;
      }
      navigate('/my-articles');
    } catch (err: any) {
      console.error('保存文章失败:', err);
      alert(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? '编辑文章' : '写文章'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入文章标题"
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="多个标签用逗号分隔，如：React, TypeScript, 前端"
            />
          </div>

          {/* 封面图 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              封面图 URL
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              摘要
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="文章摘要（可选）"
            />
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              rows={20}
              placeholder="在这里输入文章内容..."
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存草稿'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, 'published')}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '发布中...' : '发布文章'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArticleEdit;
