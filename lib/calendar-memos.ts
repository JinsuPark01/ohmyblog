// Supabase 클라이언트 가져오기
import { createServerSupabaseClient } from '@/lib/supabase-server';

// 특정 사용자와 날짜에 대한 메모 저장
export async function saveMemo(userId: string, date: string, memo: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('calendar_memos')
    .upsert({ user_id: userId, date, memo });

  if (error) {
    // 오류 발생 시 예외 처리
    throw new Error(error.message);
  }

  return data; // 저장된 데이터 반환
}

// 특정 사용자와 월/년에 대한 모든 메모 가져오기
export async function fetchMemos(userId: string, month: number, year: number) {
  const supabase = await createServerSupabaseClient();
  const startDate = new Date(year, month - 1, 1).toISOString(); // 월 시작 날짜
  const endDate = new Date(year, month, 0).toISOString(); // 월 종료 날짜

  const { data, error } = await supabase
    .from('calendar_memos')
    .select('*')
    .eq('user_id', userId) // 사용자 ID 기준 필터링
    .gte('date', startDate) // 시작 날짜 이상
    .lte('date', endDate); // 종료 날짜 이하

  if (error) {
    // 오류 발생 시 예외 처리
    throw new Error(error.message);
  }

  return data; // 가져온 데이터 반환
}
