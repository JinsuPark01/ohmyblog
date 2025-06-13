import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ApiResponse } from '@/types/database.types';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // 최신 게시물 조회 (카테고리 정보 포함)
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color
        )
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ 최신 게시물 조회 오류:', error);
      return NextResponse.json({
        success: false,
        error: '최신 게시물을 조회할 수 없습니다.'
      } as ApiResponse, { status: 500 });
    }

    console.log('📝 최신 게시물 조회 결과:', posts);

    return NextResponse.json({
      success: true,
      data: posts || []
    } as ApiResponse);

  } catch (error) {
    console.error('❌ GET /api/posts/latest 오류:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    } as ApiResponse, { status: 500 });
  }
} 