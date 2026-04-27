import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/article';
import { getCategories } from '../api/category';
import { Article, Category } from '../types';

function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [page, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('获取分类失败:', err);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await getArticles({
        page,
        pageSize,
        categoryId: selectedCategory || undefined
      });
      setArticles(res.data?.list || []);
      setTotal(res.data?.pagination?.total || 0);
    } catch (err) {
      console.error('获取文章失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex gap-8">
      {/* 左侧文章列表 */}
      <div className="flex-1">
        {/* 分类筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">暂无文章</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <Link to={`/article/${article.id}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                    {article.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {article.summary || article.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      {article.author_avatar ? (
                        <img
                          src={article.author_avatar}
                          alt={article.author_username}
                          className="w-5 h-5 rounded-full mr-1"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-1">
                          {article.author_username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {article.author_username}
                    </span>
                    <span>{formatDate(article.created_at)}</span>
                    {article.category_name && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {article.category_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>阅读 {article.view_count}</span>
                    <span>评论 {article.comment_count || 0}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      {/* 右侧边栏 */}
      <aside className="w-80 hidden lg:block">
        {/* 分类统计 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">文章分类</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {category.name}
                </button>
                <span className="text-gray-400 text-sm">{category.article_count || 0}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 网站信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">关于</h3>
          <p className="text-gray-600 text-sm">
            这是一个基于 React + Node.js + MySQL 构建的全栈博客应用。
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Home;
