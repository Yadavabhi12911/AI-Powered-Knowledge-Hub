import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Article } from '../types';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Brain,
  Loader,
  Copy,
  CheckCircle
} from 'lucide-react';

const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const data = await apiService.getArticle(articleId);
      setArticle(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!article) return;
    
    setSummarizing(true);
    setError('');
    
    try {
      const response = await apiService.summarizeArticle(article._id);
      setArticle({ ...article, summary: response.summary });
    } catch (err: any) {
      setError(err.message || 'Failed to summarize article');
    } finally {
      setSummarizing(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await apiService.deleteArticle(article._id);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to delete article');
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || article.author._id === user?.id;
  const canDelete = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            {!article.summary && (
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {summarizing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>{summarizing ? 'Summarizing...' : 'Summarize'}</span>
              </button>
            )}
            
            {canEdit && (
              <Link
                to={`/edit-article/${article._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            )}
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{article.author.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            {article.updatedAt !== article.createdAt && (
              <div className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Updated {formatDate(article.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <div className="mb-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-900">AI Summary</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(article.summary!)}
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-emerald-800 leading-relaxed">{article.summary}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;