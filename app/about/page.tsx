import { Metadata } from 'next';
import { Github, Mail, Calendar, Code2, BookOpen, Lightbulb, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: '소개 | My Blog',
  description: '개발자 박진수의 블로그 소개 페이지입니다.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 메인 제목 섹션 */}
      <div className="py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Me
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            안녕하세요! 개발자 박진수의 블로그에 오신 것을 환영합니다.
          </p>
        </section>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 개발자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>개발자 정보</CardTitle>
              <CardDescription>개발자 박진수의 기본 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">이름</div>
                <div>박진수</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">학교</div>
                <div>한신대학교</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">학과</div>
                <div>컴퓨터 공학과</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">학년</div>
                <div>4학년</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">학번</div>
                <div>202058111</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-muted-foreground">이메일</div>
                <a 
                  href="mailto:gary7345@hs.ac.kr"
                  className="text-primary hover:underline"
                >
                  gary7345@hs.ac.kr
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 최근 업데이트 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 업데이트</CardTitle>
              <CardDescription>블로그의 최근 변경사항입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">캘린더 페이지 추가</div>
                  <div className="text-sm text-muted-foreground">
                    개인 일정과 메모를 관리할 수 있는 캘린더 기능을 추가했습니다.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">다크모드 지원</div>
                  <div className="text-sm text-muted-foreground">
                    사용자 편의를 위한 다크모드 기능을 추가했습니다.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">소개 페이지 작성</div>
                  <div className="text-sm text-muted-foreground">
                    개발자 소개와 블로그 정보를 담은 소개 페이지를 추가했습니다.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">홈페이지 제목 색상 변경 버튼 추가</div>
                  <div className="text-sm text-muted-foreground">
                    홈페이지에 제목 색상 변경 버튼을 추가했습니다.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기술 스택 */}
          <Card>
            <CardHeader>
              <CardTitle>기술 스택</CardTitle>
              <CardDescription>주요 사용 기술입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Frontend</div>
                  <div className="text-sm text-muted-foreground">
                    React, Next.js, TypeScript, Tailwind CSS
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Backend</div>
                  <div className="text-sm text-muted-foreground">
                    Node.js, Express, PostgreSQL
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Tools</div>
                  <div className="text-sm text-muted-foreground">
                    Git, VS Code, Docker
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Cloud</div>
                  <div className="text-sm text-muted-foreground">
                    AWS, Vercel, Supabase
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 블로그 소개 */}
          <Card>
            <CardHeader>
              <CardTitle>블로그 소개</CardTitle>
              <CardDescription>이 블로그는 다음과 같은 목적으로 만들어졌습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">기술 공유</div>
                  <div className="text-sm text-muted-foreground">
                    개발 과정에서 배운 내용과 문제 해결 방법을 공유합니다.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">학습 기록</div>
                  <div className="text-sm text-muted-foreground">
                    새로운 기술과 개념을 학습하며 기록합니다.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Github className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium">프로젝트 포트폴리오</div>
                  <div className="text-sm text-muted-foreground">
                    진행한 프로젝트와 개발 경험을 정리합니다.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 