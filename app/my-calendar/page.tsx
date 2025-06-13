"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTheme } from 'next-themes';

interface Memo {
  id: number;
  date: string;
  memo: string;
  created_at: string;
}

// 날짜를 YYYY-MM-DD 형식의 문자열로 변환하는 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MyCalendar = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memo, setMemo] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoadingMemos, setIsLoadingMemos] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [memoToDelete, setMemoToDelete] = useState<Memo | null>(null);

  // 메모 조회 함수
  const fetchMemos = async (year: number, month: number) => {
    if (!user?.id) return;
    
    setIsLoadingMemos(true);
    try {
      const response = await fetch(
        `/api/calendar-memos?userId=${user.id}&year=${year}&month=${month}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setMemos(data.data || []);
      } else {
        console.error('메모 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('메모 조회 오류:', error);
    } finally {
      setIsLoadingMemos(false);
    }
  };

  // 날짜 변경 시 메모 조회
  useEffect(() => {
    if (user?.id) {
      fetchMemos(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
    }
  }, [user?.id, selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = formatDate(date);
    const existingMemo = memos.find(m => m.date === dateStr);
    setMemo(existingMemo?.memo || '');
    setEditingMemoId(existingMemo?.id || null);
    setShowPopup(true);
  };

  const handleSaveMemo = async () => {
    setError('');
    setSuccess('');

    if (!memo.trim()) {
      setError('메모를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const userId = user?.id;
      const date = formatDate(selectedDate);

      const memoData = {
        userId,
        date,
        memo,
        id: editingMemoId // 수정 시 기존 메모 ID 포함
      };

      const response = await fetch('/api/calendar-memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('메모가 성공적으로 저장되었습니다!');
        fetchMemos(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
        setShowPopup(false);
        setEditingMemoId(null);
      } else {
        setError(data.error || '메모 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 저장 오류:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemo = async () => {
    if (!memoToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/calendar-memos/${memoToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('메모가 삭제되었습니다.');
        fetchMemos(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
        setShowDeleteAlert(false);
        setMemoToDelete(null);
      } else {
        const data = await response.json();
        setError(data.error || '메모 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 삭제 오류:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 날짜에 메모가 있는지 확인하는 함수
  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDate(date);
    const hasMemo = memos.some(m => m.date === dateStr);
    
    return hasMemo ? (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-1 rounded-full bg-primary"></div>
      </div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 메인 제목 섹션 */}
      <div className="py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Calendar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            나만의 일정과 메모를 관리하세요
          </p>
        </section>

        {/* 오늘 날짜 섹션 */}
        <section className="mb-0">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted text-muted-foreground text-sm">
              <span>📅</span>
              <span>오늘 날짜: {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 캘린더 섹션 */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">이번 달 일정</h2>
            <div className="mt-6 pt-6 border-t border-border" />
            <Calendar
              onClickDay={handleDateClick}
              value={selectedDate}
              className={`react-calendar text-lg w-full ${
                theme === 'dark' ? 'dark' : ''
              }`}
              tileClassName={({ date, view }) =>
                view === 'month' ? 'p-6 text-left relative' : ''
              }
              tileContent={tileContent}
            />
          </div>

          {/* 메모 목록 섹션 */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">이번 달 메모</h2>
            <div className="mt-6 pt-6 border-t border-border" />
            {isLoadingMemos ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : memos.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {memos.map((memo) => (
                    <div
                      key={memo.id}
                      className="p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-muted-foreground">
                          {new Date(memo.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDate(new Date(memo.date));
                              setMemo(memo.memo);
                              setEditingMemoId(memo.id);
                              setShowPopup(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMemoToDelete(memo);
                              setShowDeleteAlert(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{memo.memo}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex justify-center items-center h-[400px] text-muted-foreground">
                이번 달 작성된 메모가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메모 작성/수정 팝업 */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요..."
            rows={4}
            className="resize-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPopup(false);
                setEditingMemoId(null);
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleSaveMemo}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메모 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메모 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMemo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyCalendar;
