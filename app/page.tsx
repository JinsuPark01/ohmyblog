/**
 * 블로그 홈페이지 컴포넌트 (2025년 새로운 Third-Party Auth 방식)
 * Hero 섹션, 최신 포스트, 카테고리 섹션으로 구성
 * 실제 Supabase 데이터베이스와 연동
 */

"use client";

import { Suspense, useState, useEffect } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Eye, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

// 타입 정의
type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  view_count: number;
  created_at: string;
  content: string;
  status: string;
  author_id: string;
  category_id: number;
  updated_at: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
    color: string;
    description: string;
    created_at: string;
    updated_at: string;
  } | null;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  color: string;
  description: string;
  created_at: string;
  updated_at: string;
};

// 날짜 포맷팅 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 그라데이션 색상 옵션 정의
const gradientOptions = [
  {
    name: '파란색',
    gradient: 'from-blue-600 via-blue-500 to-blue-400',
    colors: ['#2563eb', '#3b82f6', '#60a5fa']
  },
  {
    name: '보라색',
    gradient: 'from-purple-600 via-purple-500 to-purple-400',
    colors: ['#9333ea', '#a855f7', '#c084fc']
  },
  {
    name: '핑크색',
    gradient: 'from-pink-600 via-pink-500 to-pink-400',
    colors: ['#db2777', '#ec4899', '#f472b6']
  },
  {
    name: '초록색',
    gradient: 'from-green-600 via-green-500 to-green-400',
    colors: ['#16a34a', '#22c55e', '#4ade80']
  },
  {
    name: '주황색',
    gradient: 'from-orange-600 via-orange-500 to-orange-400',
    colors: ['#ea580c', '#f97316', '#fb923c']
  }
];

export default function Home() {
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/posts/latest'),
          fetch('/api/categories')
        ]);

        const postsData = await postsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setLatestPosts(postsData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="main-content" className="py-16">
      {/* Hero 섹션 */}
      <section className="text-center mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-background -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 py-20">
          {/* 색상 선택 버튼들 */}
          <div className="flex justify-center gap-2 mb-8">
            {gradientOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => setSelectedGradient(option)}
                className={`group relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  selectedGradient.name === option.name ? 'ring-2 ring-offset-2 ring-primary' : ''
                }`}
                title={option.name}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br" style={{
                    background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]}, ${option.colors[2]})`
                  }} />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {option.name}
                </span>
              </button>
            ))}
          </div>

          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r ${selectedGradient.gradient} bg-clip-text text-transparent transition-all duration-300`}
            style={{
              backgroundSize: '200% auto',
              animation: 'gradient 3s ease infinite'
            }}
          >
            Welcome to My Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            웹 개발, JavaScript, React, Next.js에 관한 최신 기술과 실무 경험을 공유합니다. 
            함께 성장하는 개발자가 되어보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/posts"
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="mr-2">📚</span>
              블로그 글 읽기
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/about"
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
            >
              <span className="mr-2">👋</span>
              소개 보기
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 최신 게시물 섹션 */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold">최신 게시물</h2>
            </div>
            <Link
              href="/posts"
              className="group inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              모든 글 보기
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    {post.cover_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {/* 카테고리 */}
                      {post.categories && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${post.categories.color}20`, color: post.categories.color }}
                        >
                          {post.categories.name}
                        </Badge>
                      )}

                      {/* 제목 */}
                      <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* 요약 */}
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* 빈 상태 */
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">아직 게시물이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    첫 번째 블로그 글을 작성해보세요!
                  </p>
                  
                  <SignedIn>
                    <Button asChild>
                      <Link href="/admin/posts/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        첫 글 작성하기
                      </Link>
                    </Button>
                  </SignedIn>
                  
                  <SignedOut>
                    <p className="text-sm text-muted-foreground">
                      게시물을 작성하려면 로그인이 필요합니다.
                    </p>
                  </SignedOut>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold">카테고리</h2>
            </div>
            <Link
              href="/categories"
              className="group inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              모든 카테고리 보기
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="text-center p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name.charAt(0)}
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* 카테고리 빈 상태 */
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">
                  아직 카테고리가 없습니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
