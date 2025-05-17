import { supabase } from './supabase';

export const storageService = {
  /**
   * 이미지 파일 업로드
   * @param file 업로드할 파일
   * @param path 저장 경로 (teams/팀이름.png 형식 권장)
   * @returns 업로드된 파일의 URL 또는 null
   */
  uploadImage: async (file: File, path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('이미지 업로드 오류:', error);
        return null;
      }

      // 업로드된 이미지의 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      return null;
    }
  },

  /**
   * 이미지 파일 삭제
   * @param path 저장 경로
   * @returns 성공 여부
   */
  deleteImage: async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([path]);

      if (error) {
        console.error('이미지 삭제 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('이미지 삭제 중 오류 발생:', error);
      return false;
    }
  },

  /**
   * 이미지 URL 가져오기
   * @param path 저장 경로
   * @returns 이미지 URL
   */
  getImageUrl: (path: string): string => {
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return publicUrl;
  }
}; 